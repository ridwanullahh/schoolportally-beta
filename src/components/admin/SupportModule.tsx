
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
import { Plus, MessageSquare, Clock, User, AlertCircle, CheckCircle } from 'lucide-react';

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
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
    submittedBy: 'admin'
  });

  const [responseForm, setResponseForm] = useState({
    message: '',
    isStaff: true
  });

  const categories = ['general', 'technical', 'academic', 'billing', 'feature-request', 'bug-report'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const statuses = ['open', 'in-progress', 'waiting', 'resolved', 'closed'];

  useEffect(() => {
    fetchTickets();
  }, [school]);

  const fetchTickets = async () => {
    if (!school || !user) return;

    setLoading(true);
    try {
      const allTickets = await sdk.get<SupportTicket>('support_tickets');
      let schoolTickets = allTickets.filter(ticket => ticket.schoolId === school.id);

      if (user.userType !== 'school_admin') {
        schoolTickets = schoolTickets.filter(ticket => ticket.submittedBy === user.id);
      }
      setTickets(schoolTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!school) return;

    try {
      const newTicket = await sdk.insert<SupportTicket>('support_tickets', {
        ...ticketForm,
        schoolId: school.id,
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

  const handleUpdateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const updateData: any = { 
        status, 
        updatedAt: new Date().toISOString() 
      };
      
      if (status === 'resolved' || status === 'closed') {
        updateData.resolvedAt = new Date().toISOString();
      }
      
      const updatedTicket = await sdk.update<SupportTicket>('support_tickets', ticketId, updateData);
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? updatedTicket : ticket
      ));
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleAddResponse = async () => {
    if (!selectedTicket) return;

    try {
      const newResponse: TicketResponse = {
        id: `response-${Date.now()}`,
        message: responseForm.message,
        author: responseForm.isStaff ? 'Staff Member' : 'User',
        timestamp: new Date().toISOString(),
        isStaff: responseForm.isStaff
      };

      const updatedResponses = [...selectedTicket.responses, newResponse];
      const updatedTicket = await sdk.update<SupportTicket>('support_tickets', selectedTicket.id, {
        responses: updatedResponses,
        status: 'in-progress',
        updatedAt: new Date().toISOString()
      });

      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      setSelectedTicket(updatedTicket);
      setResponseForm({ message: '', isStaff: true });
      setIsResponseDialogOpen(false);
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
      submittedBy: 'admin'
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-800',
      technical: 'bg-blue-100 text-blue-800',
      academic: 'bg-green-100 text-green-800',
      billing: 'bg-yellow-100 text-yellow-800',
      'feature-request': 'bg-purple-100 text-purple-800',
      'bug-report': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || ticket.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support & Tickets</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{tickets.length}</div>
                <p className="text-xs text-muted-foreground">Total Tickets</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tickets.filter(t => t.status === 'open').length}</div>
            <p className="text-xs text-muted-foreground">Open</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tickets.filter(t => t.status === 'in-progress').length}</div>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tickets.filter(t => t.status === 'resolved').length}</div>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tickets.filter(t => t.priority === 'urgent').length}</div>
            <p className="text-xs text-muted-foreground">Urgent</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <label className="font-medium mr-2">Status:</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="font-medium mr-2">Priority:</label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
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
                        <Badge className={getCategoryColor(ticket.category)} variant="outline">
                          {ticket.category.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {ticket.submittedBy}
                        </div>
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
                        {ticket.resolvedAt && (
                          <div className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolved {new Date(ticket.resolvedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Select value={ticket.status} onValueChange={(value) => handleUpdateTicketStatus(ticket.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Dialog open={isResponseDialogOpen && selectedTicket?.id === ticket.id} onOpenChange={setIsResponseDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Respond
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Ticket: {ticket.subject}</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <User className="w-4 h-4" />
                                <span className="font-medium">{ticket.submittedBy}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(ticket.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm">{ticket.description}</p>
                            </div>
                            
                            {ticket.responses.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-medium">Responses:</h4>
                                {ticket.responses.map((response) => (
                                  <div key={response.id} className={`p-3 rounded-lg ${response.isStaff ? 'bg-blue-50' : 'bg-gray-50'}`}>
                                    <div className="flex items-center space-x-2 mb-1">
                                      <User className="w-3 h-3" />
                                      <span className="text-sm font-medium">{response.author}</span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(response.timestamp).toLocaleString()}
                                      </span>
                                      {response.isStaff && (
                                        <Badge variant="outline" className="text-xs">Staff</Badge>
                                      )}
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
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={responseForm.isStaff}
                                    onChange={(e) => setResponseForm({ ...responseForm, isStaff: e.target.checked })}
                                  />
                                  <label className="text-sm">Staff Response</label>
                                </div>
                                <Button onClick={handleAddResponse}>
                                  Send Response
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTickets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tickets found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportModule;
