import React, { useState, useEffect } from 'react';
import sdk from '../../lib/sdk-config';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const TermsModule = ({ schoolId }) => {
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [newTermName, setNewTermName] = useState('');
  const [newTermStartDate, setNewTermStartDate] = useState('');
  const [newTermEndDate, setNewTermEndDate] = useState('');
  const [editingTerm, setEditingTerm] = useState(null);
  const { toast } = useToast();

  const fetchSessions = async () => {
    try {
      const result = await sdk.get('sessions');
      setSessions(result.filter(s => s.schoolId === schoolId));
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchTerms = async (sessionId) => {
    try {
      const result = await sdk.get('terms');
      setTerms(result.filter(t => t.schoolId === schoolId && t.sessionId === sessionId));
    } catch (error) {
      console.error('Error fetching terms:', error);
      toast({ title: 'Error', description: 'Failed to fetch terms.' });
    }
  };

  useEffect(() => {
    if (schoolId) {
      fetchSessions();
    }
  }, [schoolId]);

  useEffect(() => {
    if (selectedSession) {
      fetchTerms(selectedSession);
    }
  }, [selectedSession]);

  const handleCreateTerm = async (e) => {
    e.preventDefault();
    if (!newTermName || !newTermStartDate || !newTermEndDate || !selectedSession) {
      toast({ title: 'Error', description: 'Please fill all fields and select a session.' });
      return;
    }
    try {
      await sdk.insert('terms',{
        schoolId,
        sessionId: selectedSession,
        name: newTermName,
        startDate: newTermStartDate,
        endDate: newTermEndDate,
        status: 'active'
      });
      setNewTermName('');
      setNewTermStartDate('');
      setNewTermEndDate('');
      fetchTerms(selectedSession);
      toast({ title: 'Success', description: 'Term created successfully.' });
    } catch (error) {
      console.error('Error creating term:', error);
      toast({ title: 'Error', description: 'Failed to create term.' });
    }
  };

  const handleUpdateTerm = async (term) => {
    try {
      await sdk.update('terms', term.id, term);
      setEditingTerm(null);
      fetchTerms(selectedSession);
      toast({ title: 'Success', description: 'Term updated successfully.' });
    } catch (error) {
      console.error('Error updating term:', error);
      toast({ title: 'Error', description: 'Failed to update term.' });
    }
  };

  const handleDeleteTerm = async (termId) => {
    try {
      await sdk.delete('terms', termId);
      fetchTerms(selectedSession);
      toast({ title: 'Success', description: 'Term deleted successfully.' });
    } catch (error) {
      console.error('Error deleting term:', error);
      toast({ title: 'Error', description: 'Failed to delete term.' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Terms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Session</label>
          <Select onValueChange={setSelectedSession} value={selectedSession}>
            <SelectTrigger>
              <SelectValue placeholder="Select a session" />
            </SelectTrigger>
            <SelectContent>
              {sessions.map((session) => (
                <SelectItem key={session.id} value={session.id}>{session.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSession && (
          <div>
            <form onSubmit={handleCreateTerm} className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Create New Term</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  value={newTermName}
                  onChange={(e) => setNewTermName(e.target.value)}
                  placeholder="Term Name (e.g., First Term)"
                />
                <Input
                  type="date"
                  value={newTermStartDate}
                  onChange={(e) => setNewTermStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  value={newTermEndDate}
                  onChange={(e) => setNewTermEndDate(e.target.value)}
                />
              </div>
              <Button type="submit" className="mt-4">Create Term</Button>
            </form>

            <div>
              <h3 className="text-lg font-semibold mb-2">Existing Terms</h3>
              {terms.map((term) => (
                <div key={term.id} className="p-4 border rounded mb-2">
                  {editingTerm?.id === term.id ? (
                    <div>
                      <Input
                        type="text"
                        value={editingTerm.name}
                        onChange={(e) => setEditingTerm({ ...editingTerm, name: e.target.value })}
                        className="mb-2"
                      />
                      <Input
                        type="date"
                        value={editingTerm.startDate}
                        onChange={(e) => setEditingTerm({ ...editingTerm, startDate: e.target.value })}
                        className="mb-2"
                      />
                      <Input
                        type="date"
                        value={editingTerm.endDate}
                        onChange={(e) => setEditingTerm({ ...editingTerm, endDate: e.target.value })}
                        className="mb-2"
                      />
                      <Button onClick={() => handleUpdateTerm(editingTerm)} className="mr-2">Save</Button>
                      <Button onClick={() => setEditingTerm(null)} variant="outline">Cancel</Button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                       <div>
                        <p className="font-bold">{term.name}</p>
                        <p>Start: {new Date(term.startDate).toLocaleDateString()}</p>
                        <p>End: {new Date(term.endDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Button onClick={() => setEditingTerm(term)} className="mr-2">Edit</Button>
                        <Button onClick={() => handleDeleteTerm(term.id)} variant="destructive">Delete</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TermsModule;