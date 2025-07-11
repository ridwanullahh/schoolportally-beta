import React, { useState, useEffect, useMemo } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import UserForm from './UserForm';

const UsersModule = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });
  const [visibleCount, setVisibleCount] = useState(10);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [bulkUsers, setBulkUsers] = useState('');

  useEffect(() => {
    if (school) {
      fetchUsers();
    }
  }, [school]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await sdk.get<User>('users');
      const schoolUsers = allUsers.filter(user => user.schoolId === school?.id);
      setUsers(schoolUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({ title: 'Error', description: 'Failed to load user data.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId: string, action: 'approve' | 'deny' | 'suspend' | 'delete') => {
    try {
      let updates: Partial<User> = {};
      if (action === 'approve') updates = { status: 'approved', verified: true };
      if (action === 'deny') updates = { status: 'denied' };
      if (action === 'suspend') updates = { status: 'suspended' };

      if (action === 'delete') {
        await sdk.delete('users', userId);
        toast({ title: 'Success', description: 'User has been deleted.' });
      } else {
        await sdk.update('users', userId, updates);
        toast({ title: 'Success', description: `User has been ${action}d.` });
      }
      fetchUsers();
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      toast({ title: 'Error', description: `Failed to ${action} user.`, variant: 'destructive' });
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser || !school) return;

    try {
      if (editingUser.id) {
        // Update existing user
        await sdk.update('users', editingUser.id, editingUser);
        toast({ title: 'Success', description: 'User updated successfully.' });
      } else {
        // Create new user
        await sdk.insert('users', {
          ...editingUser,
          schoolId: school.id,
          status: 'approved',
          verified: true,
          password: sdk.hashPassword(Math.random().toString(36).slice(-8)), // Hash the random password
        });
        toast({ title: 'Success', description: 'User created successfully.' });
      }
      fetchUsers();
      setIsUserFormOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to save user:', error);
      toast({ title: 'Error', description: 'Failed to save user.', variant: 'destructive' });
    }
  };

  const handleBulkSave = async () => {
    if (!bulkUsers.trim() || !school) return;

    const lines = bulkUsers.trim().split('\n');
    const usersToCreate: Partial<User>[] = lines.map(line => {
      const [firstName, lastName, email, userType] = line.split(',').map(item => item.trim());
      return {
        firstName,
        lastName,
        email,
        userType: userType as User['userType'],
        schoolId: school.id,
        status: 'approved',
        verified: true,
        password: sdk.hashPassword(Math.random().toString(36).slice(-8)),
      };
    });

    try {
      await sdk.bulkInsert('users', usersToCreate);
      toast({ title: 'Success', description: `${usersToCreate.length} users created successfully.` });
      fetchUsers();
      setIsBulkFormOpen(false);
      setBulkUsers('');
    } catch (error) {
      console.error('Failed to bulk save users:', error);
      toast({ title: 'Error', description: 'Failed to save users in bulk.', variant: 'destructive' });
    }
  };

  const openUserForm = (user: Partial<User> | null = null) => {
    setEditingUser(user || {});
    setIsUserFormOpen(true);
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter(user => {
        const term = searchTerm.toLowerCase();
        return (
          (user.firstName?.toLowerCase().includes(term) ||
           user.lastName?.toLowerCase().includes(term) ||
           user.email.toLowerCase().includes(term)) &&
          (roleFilter === 'all' || user.userType === roleFilter) &&
          (statusFilter === 'all' || user.status === statusFilter)
        );
      })
      .sort((a, b) => {
        const aVal = (a as any)[sort.field];
        const bVal = (b as any)[sort.field];
        if (aVal < bVal) return sort.order === 'asc' ? -1 : 1;
        if (aVal > bVal) return sort.order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [users, searchTerm, roleFilter, statusFilter, sort]);

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <Button onClick={() => openUserForm()}>
                <Plus className="w-4 h-4 mr-2" /> Add User
              </Button>
              <Button variant="outline" onClick={() => setIsBulkFormOpen(true)}>
                <Upload className="w-4 h-4 mr-2" /> Bulk Add
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.slice(0, visibleCount).map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><Badge variant="secondary">{user.userType}</Badge></TableCell>
                <TableCell><Badge variant={user.status === 'approved' ? 'default' : 'destructive'}>{user.status}</Badge></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isAdmin && (
                        <>
                          {user.status === 'pending' && <DropdownMenuItem onClick={() => handleAction(user.id, 'approve')}>Approve</DropdownMenuItem>}
                          {user.status === 'pending' && <DropdownMenuItem onClick={() => handleAction(user.id, 'deny')}>Deny</DropdownMenuItem>}
                          <DropdownMenuItem onClick={() => openUserForm(user)}>Edit</DropdownMenuItem>
                          {user.status === 'approved' && <DropdownMenuItem onClick={() => handleAction(user.id, 'suspend')}>Suspend</DropdownMenuItem>}
                          <DropdownMenuItem className="text-red-600" onClick={() => handleAction(user.id, 'delete')}>Delete</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {visibleCount < filteredUsers.length && (
          <div className="text-center mt-4">
            <Button onClick={() => setVisibleCount(prev => prev + 10)}>Load More</Button>
          </div>
        )}
      </CardContent>
      <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser?.id ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <UserForm
            user={editingUser || {}}
            onUserChange={(field, value) => setEditingUser(prev => ({ ...prev, [field]: value }))}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser}>Save User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkFormOpen} onOpenChange={setIsBulkFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Add Users</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="bulk-users">Paste user data (CSV format: firstName,lastName,email,userType)</Label>
            <Textarea
              id="bulk-users"
              value={bulkUsers}
              onChange={(e) => setBulkUsers(e.target.value)}
              rows={10}
              placeholder="John,Doe,john.doe@example.com,student&#10;Jane,Smith,jane.smith@example.com,teacher"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkFormOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkSave}>Save Bulk Users</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UsersModule;