import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Plus, Send, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import { AIChatSession, AIChatMessage } from '@/types';
import { aiService } from '@/services/aiService';
import { useAuth } from '@/contexts/AuthContext';
import { useAI } from '@/contexts/AIContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export const FloatingAIChat: React.FC = () => {
  const { user } = useAuth();
  const { context, contextData, isAIEnabled } = useAI();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessions, setSessions] = useState<AIChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [sessions, activeSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewSession = async () => {
    if (!user) return;

    try {
      const newSession = await aiService.createSession(
        user.id,
        user.schoolId,
        context,
        undefined,
        contextData
      );
      
      setSessions(prev => [...prev, newSession]);
      setActiveSessionId(newSession.id);
    } catch (error) {
      console.error('Failed to create new session:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !activeSessionId || !user || isLoading) return;

    const userMessage: AIChatMessage = {
      id: `msg_${Date.now()}_user`,
      sessionId: activeSessionId,
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message to session
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId 
        ? { ...session, messages: [...session.messages, userMessage] }
        : session
    ));

    setMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await aiService.sendMessage(
        activeSessionId,
        userMessage.content,
        user.id,
        context,
        contextData
      );

      // Add AI response to session
      setSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, aiResponse],
              updatedAt: new Date().toISOString()
            }
          : session
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      const errorMessage: AIChatMessage = {
        id: `msg_${Date.now()}_error`,
        sessionId: activeSessionId,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      
      setSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { ...session, messages: [...session.messages, errorMessage] }
          : session
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      setActiveSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const remainingRequests = user ? aiService.getRemainingRequests(user.id) : 0;

  if (!user || !isAIEnabled) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Open AI Chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className={`fixed z-50 bg-white border border-gray-200 shadow-2xl transition-all duration-300 ${
          isMobile 
            ? 'inset-0' 
            : isMinimized 
              ? 'bottom-6 right-6 w-80 h-16' 
              : 'bottom-6 right-6 w-96 h-[600px]'
        } rounded-lg overflow-hidden`}>
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <span className="font-semibold">AI Assistant</span>
              <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                {context.charAt(0).toUpperCase() + context.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isMobile && (
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-blue-500 p-1 rounded"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-500 p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Sessions Tabs */}
              <div className="bg-gray-50 p-2 border-b flex items-center space-x-2 overflow-x-auto">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-sm cursor-pointer ${
                      activeSessionId === session.id 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-white hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSessionId(session.id)}
                  >
                    <span className="truncate max-w-20">{session.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={createNewSession}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                >
                  <Plus size={12} />
                  <span>New</span>
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 h-96">
                {activeSession ? (
                  <div className="space-y-4">
                    {activeSession.messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Start a new conversation</p>
                      <Button onClick={createNewSession} className="mt-2">
                        <Plus size={16} className="mr-2" />
                        New Chat
                      </Button>
                    </div>
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              {activeSession && (
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={isLoading || remainingRequests <= 0}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!message.trim() || isLoading || remainingRequests <= 0}
                      size="sm"
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>Requests remaining: {remainingRequests}</span>
                    {contextData && (
                      <span>
                        Context: {contextData.subject || contextData.class || 'General'}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingAIChat;
