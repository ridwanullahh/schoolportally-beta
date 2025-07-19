import React, { useState, useEffect } from 'react';
import sdk from '../../lib/sdk-config';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';

const SessionsModule = ({ schoolId }) => {
  const [sessions, setSessions] = useState([]);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionStartDate, setNewSessionStartDate] = useState('');
  const [newSessionEndDate, setNewSessionEndDate] = useState('');
  const [editingSession, setEditingSession] = useState(null);
  const { toast } = useToast();

  const fetchSessions = async () => {
    try {
      const result = await sdk.get('sessions');
      setSessions(result.filter(s => s.schoolId === schoolId));
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({ title: 'Error', description: 'Failed to fetch sessions.' });
    }
  };

  useEffect(() => {
    if (schoolId) {
      fetchSessions();
    }
  }, [schoolId]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!newSessionName || !newSessionStartDate || !newSessionEndDate) {
      toast({ title: 'Error', description: 'Please fill all fields.' });
      return;
    }
    try {
      await sdk.insert('sessions', {
        schoolId,
        name: newSessionName,
        startDate: newSessionStartDate,
        endDate: newSessionEndDate,
        status: 'active'
      });
      setNewSessionName('');
      setNewSessionStartDate('');
      setNewSessionEndDate('');
      fetchSessions();
      toast({ title: 'Success', description: 'Session created successfully.' });
    } catch (error) {
      console.error('Error creating session:', error);
      toast({ title: 'Error', description: 'Failed to create session.' });
    }
  };

  const handleUpdateSession = async (session) => {
    try {
      await sdk.update('sessions', session.id, session);
      setEditingSession(null);
      fetchSessions();
      toast({ title: 'Success', description: 'Session updated successfully.' });
    } catch (error) {
      console.error('Error updating session:', error);
      toast({ title: 'Error', description: 'Failed to update session.' });
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await sdk.delete('sessions', sessionId);
      fetchSessions();
      toast({ title: 'Success', description: 'Session deleted successfully.' });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({ title: 'Error', description: 'Failed to delete session.' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateSession} className="mb-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Create New Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="text"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="Session Name (e.g., 2024-2025)"
            />
            <Input
              type="date"
              value={newSessionStartDate}
              onChange={(e) => setNewSessionStartDate(e.target.value)}
            />
            <Input
              type="date"
              value={newSessionEndDate}
              onChange={(e) => setNewSessionEndDate(e.target.value)}
            />
          </div>
          <Button type="submit" className="mt-4">Create Session</Button>
        </form>

        <div>
          <h3 className="text-lg font-semibold mb-2">Existing Sessions</h3>
          {sessions.map((session) => (
            <div key={session.id} className="p-4 border rounded mb-2">
              {editingSession?.id === session.id ? (
                <div>
                  <Input
                    type="text"
                    value={editingSession.name}
                    onChange={(e) => setEditingSession({ ...editingSession, name: e.target.value })}
                    className="mb-2"
                  />
                   <Input
                    type="date"
                    value={editingSession.startDate}
                    onChange={(e) => setEditingSession({ ...editingSession, startDate: e.target.value })}
                     className="mb-2"
                  />
                   <Input
                    type="date"
                    value={editingSession.endDate}
                    onChange={(e) => setEditingSession({ ...editingSession, endDate: e.target.value })}
                     className="mb-2"
                  />
                  <Button onClick={() => handleUpdateSession(editingSession)} className="mr-2">Save</Button>
                  <Button onClick={() => setEditingSession(null)} variant="outline">Cancel</Button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{session.name}</p>
                    <p>Start: {new Date(session.startDate).toLocaleDateString()}</p>
                    <p>End: {new Date(session.endDate).toLocaleDateString()}</p>
                    </div>
                  <div>
                    <Button onClick={() => setEditingSession(session)} className="mr-2">Edit</Button>
                    <Button onClick={() => handleDeleteSession(session.id)} variant="destructive">Delete</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionsModule;