import React, { useState, useEffect } from 'react';
import { Plus, Play, Square, BarChart3, Users, Clock, Trash2, Edit } from 'lucide-react';
import { LiveClassPoll, LiveClassPollOption, LiveClassPollResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

interface LiveClassPollProps {
  classId: string;
  isTeacher: boolean;
  polls: LiveClassPoll[];
  onCreatePoll?: (poll: Omit<LiveClassPoll, 'id' | 'createdAt'>) => void;
  onStartPoll?: (pollId: string) => void;
  onEndPoll?: (pollId: string) => void;
  onSubmitResponse?: (pollId: string, response: Omit<LiveClassPollResponse, 'id' | 'submittedAt'>) => void;
}

export const LiveClassPoll: React.FC<LiveClassPollProps> = ({
  classId,
  isTeacher,
  polls,
  onCreatePoll,
  onStartPoll,
  onEndPoll,
  onSubmitResponse
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    type: 'multiple-choice' as const,
    options: ['', ''],
    isAnonymous: false,
    allowMultipleAnswers: false,
    timeLimit: 0
  });
  const [selectedAnswers, setSelectedAnswers] = useState<{ [pollId: string]: string[] }>({});
  const [textAnswers, setTextAnswers] = useState<{ [pollId: string]: string }>({});

  const handleCreatePoll = () => {
    if (!newPoll.question.trim()) return;

    const pollData: Omit<LiveClassPoll, 'id' | 'createdAt'> = {
      classId,
      createdBy: 'current-user-id', // Should come from auth
      question: newPoll.question,
      options: newPoll.options
        .filter(opt => opt.trim())
        .map((text, index) => ({
          id: `opt_${index}`,
          text: text.trim(),
          order: index
        })),
      type: newPoll.type,
      isAnonymous: newPoll.isAnonymous,
      allowMultipleAnswers: newPoll.allowMultipleAnswers,
      timeLimit: newPoll.timeLimit > 0 ? newPoll.timeLimit : undefined,
      status: 'draft',
      responses: [],
      endedAt: undefined
    };

    onCreatePoll?.(pollData);
    
    // Reset form
    setNewPoll({
      question: '',
      type: 'multiple-choice',
      options: ['', ''],
      isAnonymous: false,
      allowMultipleAnswers: false,
      timeLimit: 0
    });
    setShowCreateForm(false);
  };

  const handleAddOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleAnswerSelect = (pollId: string, optionId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    setSelectedAnswers(prev => {
      const current = prev[pollId] || [];
      
      if (poll.allowMultipleAnswers) {
        return {
          ...prev,
          [pollId]: current.includes(optionId)
            ? current.filter(id => id !== optionId)
            : [...current, optionId]
        };
      } else {
        return {
          ...prev,
          [pollId]: [optionId]
        };
      }
    });
  };

  const handleSubmitResponse = (pollId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    const response: Omit<LiveClassPollResponse, 'id' | 'submittedAt'> = {
      pollId,
      userId: 'current-user-id', // Should come from auth
      userName: 'Current User', // Should come from auth
      selectedOptions: selectedAnswers[pollId] || [],
      textResponse: textAnswers[pollId],
      rating: undefined // For rating type polls
    };

    onSubmitResponse?.(pollId, response);
    
    // Clear selections
    setSelectedAnswers(prev => ({ ...prev, [pollId]: [] }));
    setTextAnswers(prev => ({ ...prev, [pollId]: '' }));
  };

  const getPollResults = (poll: LiveClassPoll) => {
    const totalResponses = poll.responses.length;
    
    return poll.options.map(option => {
      const count = poll.responses.filter(r => 
        r.selectedOptions.includes(option.id)
      ).length;
      
      return {
        ...option,
        count,
        percentage: totalResponses > 0 ? (count / totalResponses) * 100 : 0
      };
    });
  };

  const getTimeRemaining = (poll: LiveClassPoll) => {
    if (!poll.timeLimit || poll.status !== 'active') return null;
    
    const startTime = new Date(poll.createdAt).getTime();
    const endTime = startTime + (poll.timeLimit * 1000);
    const now = Date.now();
    
    return Math.max(0, Math.floor((endTime - now) / 1000));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Polls</h3>
          {isTeacher && (
            <Button
              onClick={() => setShowCreateForm(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus size={16} className="mr-2" />
              Create Poll
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Create Poll Form */}
        {showCreateForm && isTeacher && (
          <div className="p-4 border-b border-gray-700 bg-gray-750">
            <h4 className="font-medium text-white mb-3">Create New Poll</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Question
                </label>
                <Textarea
                  value={newPoll.question}
                  onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter your poll question..."
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Poll Type
                </label>
                <select
                  value={newPoll.type}
                  onChange={(e) => setNewPoll(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="single-choice">Single Choice</option>
                  <option value="text">Text Response</option>
                  <option value="rating">Rating (1-5)</option>
                </select>
              </div>

              {(newPoll.type === 'multiple-choice' || newPoll.type === 'single-choice') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Options
                  </label>
                  {newPoll.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      {newPoll.options.length > 2 && (
                        <Button
                          onClick={() => handleRemoveOption(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={handleAddOption}
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Option
                  </Button>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={newPoll.isAnonymous}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Anonymous</span>
                </label>
                
                {newPoll.type === 'multiple-choice' && (
                  <label className="flex items-center space-x-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={newPoll.allowMultipleAnswers}
                      onChange={(e) => setNewPoll(prev => ({ ...prev, allowMultipleAnswers: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Allow multiple answers</span>
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Time Limit (seconds, 0 = no limit)
                </label>
                <Input
                  type="number"
                  value={newPoll.timeLimit}
                  onChange={(e) => setNewPoll(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                  min="0"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleCreatePoll}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Create Poll
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Polls List */}
        <div className="p-4 space-y-4">
          {polls.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
              <p>No polls yet</p>
              {isTeacher && (
                <p className="text-sm mt-2">Create your first poll to engage students</p>
              )}
            </div>
          ) : (
            polls.map(poll => {
              const results = getPollResults(poll);
              const timeRemaining = getTimeRemaining(poll);
              const hasResponded = poll.responses.some(r => r.userId === 'current-user-id');

              return (
                <div key={poll.id} className="bg-gray-750 rounded-lg p-4">
                  {/* Poll Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{poll.question}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Users size={14} className="mr-1" />
                          {poll.responses.length} responses
                        </span>
                        {poll.timeLimit && (
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {timeRemaining ? `${timeRemaining}s remaining` : 'Ended'}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs ${
                          poll.status === 'active' ? 'bg-green-600' :
                          poll.status === 'ended' ? 'bg-gray-600' : 'bg-yellow-600'
                        }`}>
                          {poll.status}
                        </span>
                      </div>
                    </div>

                    {isTeacher && (
                      <div className="flex space-x-2">
                        {poll.status === 'draft' && (
                          <Button
                            onClick={() => onStartPoll?.(poll.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Play size={14} />
                          </Button>
                        )}
                        {poll.status === 'active' && (
                          <Button
                            onClick={() => onEndPoll?.(poll.id)}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Square size={14} />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Poll Content */}
                  {poll.status === 'active' && !hasResponded && !isTeacher && (
                    <div className="space-y-3">
                      {poll.type === 'text' ? (
                        <div>
                          <Textarea
                            value={textAnswers[poll.id] || ''}
                            onChange={(e) => setTextAnswers(prev => ({ ...prev, [poll.id]: e.target.value }))}
                            placeholder="Enter your response..."
                            className="bg-gray-700 border-gray-600 text-white"
                            rows={3}
                          />
                        </div>
                      ) : poll.type === 'rating' ? (
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <button
                              key={rating}
                              onClick={() => handleAnswerSelect(poll.id, rating.toString())}
                              className={`w-10 h-10 rounded-full border-2 ${
                                selectedAnswers[poll.id]?.includes(rating.toString())
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-gray-600 text-gray-400 hover:border-blue-600'
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {poll.options.map(option => (
                            <label
                              key={option.id}
                              className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer"
                            >
                              <input
                                type={poll.allowMultipleAnswers ? 'checkbox' : 'radio'}
                                name={`poll-${poll.id}`}
                                checked={selectedAnswers[poll.id]?.includes(option.id) || false}
                                onChange={() => handleAnswerSelect(poll.id, option.id)}
                                className="text-blue-600"
                              />
                              <span className="text-white">{option.text}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      <Button
                        onClick={() => handleSubmitResponse(poll.id)}
                        disabled={
                          poll.type === 'text' 
                            ? !textAnswers[poll.id]?.trim()
                            : !selectedAnswers[poll.id]?.length
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Submit Response
                      </Button>
                    </div>
                  )}

                  {/* Poll Results */}
                  {(poll.status === 'ended' || hasResponded || isTeacher) && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-white">Results</h5>
                      {poll.type === 'text' ? (
                        <div className="space-y-2">
                          {poll.responses.map(response => (
                            <div key={response.id} className="bg-gray-700 p-2 rounded">
                              <p className="text-white">{response.textResponse}</p>
                              {!poll.isAnonymous && (
                                <p className="text-sm text-gray-400 mt-1">- {response.userName}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        results.map(result => (
                          <div key={result.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-white">{result.text}</span>
                              <span className="text-gray-400">
                                {result.count} ({result.percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <Progress value={result.percentage} className="h-2" />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LiveClassPoll;
