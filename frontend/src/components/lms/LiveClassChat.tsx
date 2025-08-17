import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Reply, Trash2 } from 'lucide-react';
import { LiveClassMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiveClassChatProps {
  messages: LiveClassMessage[];
  onSendMessage: (content: string, isPrivate?: boolean, recipientId?: string) => void;
  currentUserId: string;
  allowPrivateMessages?: boolean;
  participants?: Array<{ id: string; name: string; role: string }>;
}

export const LiveClassChat: React.FC<LiveClassChatProps> = ({
  messages,
  onSendMessage,
  currentUserId,
  allowPrivateMessages = false,
  participants = []
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<LiveClassMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [privateMessageRecipient, setPrivateMessageRecipient] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '👏', '🔥'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    onSendMessage(
      newMessage.trim(),
      !!privateMessageRecipient,
      privateMessageRecipient || undefined
    );

    setNewMessage('');
    setReplyingTo(null);
    setPrivateMessageRecipient(null);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isOwnMessage = (message: LiveClassMessage) => {
    return message.senderId === currentUserId;
  };

  const getMessageStyle = (message: LiveClassMessage) => {
    if (message.type === 'system') {
      return 'bg-gray-100 text-gray-600 text-center italic';
    }
    
    if (isOwnMessage(message)) {
      return message.isPrivate 
        ? 'bg-purple-600 text-white ml-8' 
        : 'bg-blue-600 text-white ml-8';
    }
    
    return message.isPrivate 
      ? 'bg-purple-100 text-purple-800 mr-8' 
      : 'bg-gray-100 text-gray-800 mr-8';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold text-white">Chat</h3>
        {privateMessageRecipient && (
          <div className="mt-2 flex items-center justify-between bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
            <span>
              Private message to {participants.find(p => p.id === privateMessageRecipient)?.name}
            </span>
            <button
              onClick={() => setPrivateMessageRecipient(null)}
              className="text-purple-600 hover:text-purple-800"
            >
              ×
            </button>
          </div>
        )}
        {replyingTo && (
          <div className="mt-2 flex items-center justify-between bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
            <span>Replying to {replyingTo.senderName}</span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`group relative ${
                message.type === 'system' ? 'text-center' : ''
              }`}
            >
              <div
                className={`inline-block max-w-[80%] p-3 rounded-lg ${getMessageStyle(message)}`}
              >
                {/* Message Header */}
                {message.type !== 'system' && (
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm">
                        {message.senderName}
                      </span>
                      {message.senderType === 'teacher' && (
                        <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded">
                          Teacher
                        </span>
                      )}
                      {message.isPrivate && (
                        <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded">
                          Private
                        </span>
                      )}
                    </div>
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                )}

                {/* Message Content */}
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>

                {/* Message Actions */}
                {message.type !== 'system' && (
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center space-x-1 bg-white shadow-lg rounded p-1">
                      {allowPrivateMessages && !isOwnMessage(message) && (
                        <button
                          onClick={() => setPrivateMessageRecipient(message.senderId)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Reply privately"
                        >
                          <Reply size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => setReplyingTo(message)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Reply"
                      >
                        <Reply size={14} />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                privateMessageRecipient 
                  ? "Type a private message..." 
                  : "Type a message..."
              }
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              maxLength={500}
            />
          </div>
          
          {/* Emoji Picker */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-400 hover:text-white"
            >
              <Smile size={20} />
            </Button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 grid grid-cols-5 gap-1">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="p-2 hover:bg-gray-100 rounded text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* File Attachment */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Paperclip size={20} />
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send size={20} />
          </Button>
        </div>

        {/* Character Count */}
        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
          <div>
            {allowPrivateMessages && (
              <span>
                Tip: Click on a message to reply privately
              </span>
            )}
          </div>
          <span>{newMessage.length}/500</span>
        </div>
      </div>
    </div>
  );
};

export default LiveClassChat;
