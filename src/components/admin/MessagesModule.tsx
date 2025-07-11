
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Send, Inbox, MessageSquare, Users, Clock } from 'lucide-react';

interface Message {
  id: string;
  schoolId: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  type: string;
  status: string;
  readAt: string | null;
  createdAt: string;
}

const MessagesModule: React.FC = () => {
  const { user } = useAuth();
  const { school } = useSchool();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');

  const [messageForm, setMessageForm] = useState({
    receiverId: '',
    subject: '',
    content: '',
    type: 'direct'
  });

  useEffect(() => {
    fetchMessages();
  }, [school, user]);

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const fetchMessages = async () => {
    if (!school || !user) return;

    setLoading(true);
    try {
      const allMessages = await sdk.get<Message>('messages');
      const schoolMessages = allMessages.filter(message => 
        message.schoolId === school.id && 
        (message.senderId === user.id || message.receiverId === user.id)
      );
      setMessages(schoolMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!school || !user) return;

    try {
      const newMessage = await sdk.insert<Message>('messages', {
        id: generateUniqueId(),
        ...messageForm,
        schoolId: school.id,
        senderId: user.id!,
        status: 'sent',
        readAt: null,
        createdAt: new Date().toISOString()
      });
      setMessages([newMessage, ...messages]);
      resetForm();
      setIsDialogOpen(false);
      setActiveTab('sent');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const updatedMessage = await sdk.update<Message>('messages', messageId, {
        status: 'read',
        readAt: new Date().toISOString()
      });
      setMessages(messages.map(msg => 
        msg.id === messageId ? updatedMessage : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const resetForm = () => {
    setMessageForm({
      receiverId: '',
      subject: '',
      content: '',
      type: 'direct'
    });
  };

  const getInboxMessages = () => {
    return messages.filter(msg => msg.receiverId === user?.id);
  };

  const getSentMessages = () => {
    return messages.filter(msg => msg.senderId === user?.id);
  };

  const getUnreadCount = () => {
    return getInboxMessages().filter(msg => msg.status !== 'read').length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-green-100 text-green-800';
      case 'unread': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {isAdmin && (
            <DialogTrigger asChild>
              <Button onClick={() => { setActiveTab('compose'); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
          )}
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">To (User ID) *</label>
                <Input
                  value={messageForm.receiverId}
                  onChange={(e) => setMessageForm({ ...messageForm, receiverId: e.target.value })}
                  placeholder="Enter recipient user ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <Input
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                  placeholder="Enter message subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <Select value={messageForm.type} onValueChange={(value) => setMessageForm({ ...messageForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct Message</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <Textarea
                  value={messageForm.content}
                  onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                  placeholder="Enter your message"
                  rows={6}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{messages.length}</div>
                <p className="text-xs text-muted-foreground">Total Messages</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{getInboxMessages().length}</div>
            <p className="text-xs text-muted-foreground">Inbox</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{getSentMessages().length}</div>
            <p className="text-xs text-muted-foreground">Sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{getUnreadCount()}</div>
            <p className="text-xs text-muted-foreground">Unread</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'inbox' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('inbox')}
            >
              <Inbox className="w-4 h-4 mr-2" />
              Inbox ({getInboxMessages().length})
            </Button>
            <Button
              variant={activeTab === 'sent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('sent')}
            >
              <Send className="w-4 h-4 mr-2" />
              Sent ({getSentMessages().length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeTab === 'inbox' && (
              <>
                {getInboxMessages().map((message) => (
                  <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{message.subject}</h4>
                          <Badge className={getStatusColor(message.status)}>
                            {message.status}
                          </Badge>
                          <Badge variant="outline">
                            {message.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">From: {message.senderId}</p>
                        <p className="text-sm line-clamp-2">{message.content}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(message.createdAt).toLocaleString()}
                          </span>
                          {message.readAt && (
                            <span>Read: {new Date(message.readAt).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {message.status !== 'read' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(message.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMessage(message)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {getInboxMessages().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No messages in your inbox.
                  </div>
                )}
              </>
            )}

            {activeTab === 'sent' && (
              <>
                {getSentMessages().map((message) => (
                  <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{message.subject}</h4>
                          <Badge className={getStatusColor(message.status)}>
                            {message.status}
                          </Badge>
                          <Badge variant="outline">
                            {message.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">To: {message.receiverId}</p>
                        <p className="text-sm line-clamp-2">{message.content}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(message.createdAt).toLocaleString()}
                          </span>
                          {message.readAt && (
                            <span>Read: {new Date(message.readAt).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMessage(message)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {getSentMessages().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No sent messages.
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMessage.subject}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(selectedMessage.status)}>
                  {selectedMessage.status}
                </Badge>
                <Badge variant="outline">
                  {selectedMessage.type}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">From:</span> {selectedMessage.senderId}
                </div>
                <div>
                  <span className="font-medium">To:</span> {selectedMessage.receiverId}
                </div>
                <div>
                  <span className="font-medium">Sent:</span> {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
                {selectedMessage.readAt && (
                  <div>
                    <span className="font-medium">Read:</span> {new Date(selectedMessage.readAt).toLocaleString()}
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Message:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setSelectedMessage(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MessagesModule;
