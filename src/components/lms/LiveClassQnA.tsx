import React, { useState } from 'react';
import { Plus, ThumbsUp, MessageCircle, Check, X, Eye, EyeOff } from 'lucide-react';
import { LiveClassQnA } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiveClassQnAProps {
  classId: string;
  isTeacher: boolean;
  qnaItems: LiveClassQnA[];
  onAskQuestion?: (question: string, isAnonymous: boolean) => void;
  onAnswerQuestion?: (questionId: string, answer: string) => void;
  onUpvoteQuestion?: (questionId: string) => void;
  onDismissQuestion?: (questionId: string) => void;
}

export const LiveClassQnA: React.FC<LiveClassQnAProps> = ({
  classId,
  isTeacher,
  qnaItems,
  onAskQuestion,
  onAnswerQuestion,
  onUpvoteQuestion,
  onDismissQuestion
}) => {
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [answeringQuestion, setAnsweringQuestion] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all');

  const handleAskQuestion = () => {
    if (!newQuestion.trim()) return;

    onAskQuestion?.(newQuestion.trim(), isAnonymous);
    
    setNewQuestion('');
    setIsAnonymous(false);
    setShowAskForm(false);
  };

  const handleAnswerQuestion = (questionId: string) => {
    if (!answerText.trim()) return;

    onAnswerQuestion?.(questionId, answerText.trim());
    
    setAnswerText('');
    setAnsweringQuestion(null);
  };

  const handleUpvote = (questionId: string) => {
    onUpvoteQuestion?.(questionId);
  };

  const handleDismiss = (questionId: string) => {
    onDismissQuestion?.(questionId);
  };

  const filteredQuestions = qnaItems.filter(item => {
    switch (filter) {
      case 'pending':
        return item.status === 'pending';
      case 'answered':
        return item.status === 'answered';
      default:
        return item.status !== 'dismissed';
    }
  });

  const sortedQuestions = filteredQuestions.sort((a, b) => {
    // Sort by status (pending first), then by upvotes, then by creation time
    if (a.status !== b.status) {
      if (a.status === 'pending') return -1;
      if (b.status === 'pending') return 1;
    }
    
    if (a.upvotes.length !== b.upvotes.length) {
      return b.upvotes.length - a.upvotes.length;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">Q&A</h3>
          {!isTeacher && (
            <Button
              onClick={() => setShowAskForm(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              Ask Question
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-700 rounded p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'answered', label: 'Answered' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded transition-colors ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs">
                ({tab.key === 'all' 
                  ? qnaItems.filter(q => q.status !== 'dismissed').length
                  : qnaItems.filter(q => q.status === tab.key).length
                })
              </span>
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Ask Question Form */}
        {showAskForm && !isTeacher && (
          <div className="p-4 border-b border-gray-700 bg-gray-750">
            <h4 className="font-medium text-white mb-3">Ask a Question</h4>
            
            <div className="space-y-3">
              <Textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="What would you like to ask?"
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
                maxLength={500}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  <span>Ask anonymously</span>
                </label>
                
                <span className="text-xs text-gray-400">
                  {newQuestion.length}/500
                </span>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleAskQuestion}
                  disabled={!newQuestion.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ask Question
                </Button>
                <Button
                  onClick={() => setShowAskForm(false)}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="p-4 space-y-4">
          {sortedQuestions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No questions yet</p>
              {!isTeacher && (
                <p className="text-sm mt-2">Be the first to ask a question!</p>
              )}
            </div>
          ) : (
            sortedQuestions.map(item => (
              <div
                key={item.id}
                className={`bg-gray-750 rounded-lg p-4 ${
                  item.status === 'pending' ? 'border-l-4 border-yellow-500' :
                  item.status === 'answered' ? 'border-l-4 border-green-500' : ''
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-400">
                        {item.isAnonymous ? 'Anonymous' : item.askerName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(item.createdAt)}
                      </span>
                      {item.isAnonymous && (
                        <EyeOff size={14} className="text-gray-500" />
                      )}
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'pending' ? 'bg-yellow-600' :
                        item.status === 'answered' ? 'bg-green-600' : 'bg-gray-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-white">{item.question}</p>
                  </div>

                  {isTeacher && item.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setAnsweringQuestion(item.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check size={14} />
                      </Button>
                      <Button
                        onClick={() => handleDismiss(item.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Question Actions */}
                <div className="flex items-center space-x-4 mb-3">
                  <button
                    onClick={() => handleUpvote(item.id)}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      item.upvotes.includes('current-user-id') // Should come from auth
                        ? 'text-blue-400'
                        : 'text-gray-400 hover:text-blue-400'
                    }`}
                  >
                    <ThumbsUp size={14} />
                    <span>{item.upvotes.length}</span>
                  </button>
                </div>

                {/* Answer Form */}
                {answeringQuestion === item.id && isTeacher && (
                  <div className="mt-3 p-3 bg-gray-700 rounded">
                    <Textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Type your answer..."
                      className="bg-gray-600 border-gray-500 text-white mb-3"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAnswerQuestion(item.id)}
                        disabled={!answerText.trim()}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Submit Answer
                      </Button>
                      <Button
                        onClick={() => setAnsweringQuestion(null)}
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Answer Display */}
                {item.answer && (
                  <div className="mt-3 p-3 bg-green-900 bg-opacity-30 rounded border-l-4 border-green-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-green-400">Answer</span>
                      {item.answeredBy && (
                        <span className="text-xs text-gray-400">
                          by {item.answeredBy}
                        </span>
                      )}
                      {item.answeredAt && (
                        <span className="text-xs text-gray-500">
                          {formatTime(item.answeredAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-white">{item.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LiveClassQnA;
