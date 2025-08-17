import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, Clock, User } from 'lucide-react';

interface SupportTicket {
  id: string;
  schoolId: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  submittedBy: string;
  assignedTo: string;
  responses: TicketResponse[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface TicketResponse {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  isStaff: boolean;
}

const SupportModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
  });

  const [responseForm, setResponseForm] = useState({
    message: '',
  });

  const categories = ['general', 'technical', 'academic', 'billing', 'feature-request', 'bug-report'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  useEffect(() => {
    fetchTickets();
  }, [school, user]);

  const fetchTickets = async () => {
    if (!school || !user) return;

    setLoading(true);
    try {
      const allTickets = await sdk.get<SupportTicket>('support_tickets');
      let userTickets = allTickets.filter(ticket => ticket.schoolId === school.id && ticket.submittedBy === user.id);
      setTickets(userTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!school || !user) return;

    try {
      const newTicket = await sdk.insert<SupportTicket>('support_tickets', {
        ...ticketForm,
        schoolId: school.id,
        submittedBy: user.id,
        status: 'open',
        assignedTo: '',
        responses: [],
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setTickets([newTicket, ...tickets]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleAddResponse = async () => {
    if (!selectedTicket || !user) return;

    try {
      const newResponse: TicketResponse = {
        id: `response-${Date.now()}`,
        message: responseForm.message,
        author: user.id,
        timestamp: new Date().toISOString(),
        isStaff: false
      };

      const updatedResponses = [...selectedTicket.responses, newResponse];
      const updatedTicket = await sdk.update<SupportTicket>('support_tickets', selectedTicket.id, {
        responses: updatedResponses,
        status: 'open',
        updatedAt: new Date().toISOString()
      });

      setTickets(tickets.map(ticket =>
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      setSelectedTicket(updatedTicket);
      setResponseForm({ message: '' });
    } catch (error) {
      console.error('Error adding response:', error);
    }
  };

  const resetForm = () => {
    setTicketForm({
      subject: '',
      description: '',
      category: 'general',
      priority: 'medium',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'waiting': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Support Tickets</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <Input
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="Brief description of the issue"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={ticketForm.category} onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm({ ...ticketForm, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Detailed description of the issue"
                  rows={6}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTicket}>
                Create Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {setSelectedTicket(ticket); setIsResponseDialogOpen(true);}}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('-', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        {ticket.responses.length > 0 && (
                          <div className="flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {ticket.responses.length} responses
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {tickets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                You have not submitted any support tickets.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedTicket && (
        <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ticket: {selectedTicket.subject}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">You</span>
                  <span className="text-sm text-gray-500">
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{selectedTicket.description}</p>
              </div>
              
              {selectedTicket.responses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Responses:</h4>
                  {selectedTicket.responses.map((response) => (
                    <div key={response.id} className={`p-3 rounded-lg ${response.isStaff ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="w-3 h-3" />
                        <span className="text-sm font-medium">{response.isStaff ? 'Support Staff' : 'You'}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(response.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{response.message}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Add Response:</h4>
                <Textarea
                  value={responseForm.message}
                  onChange={(e) => setResponseForm({ ...responseForm, message: e.target.value })}
                  placeholder="Type your response here..."
                  rows={4}
                />
                <div className="flex justify-end mt-3">
                  <Button onClick={handleAddResponse}>
                    Send Response
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SupportModule;