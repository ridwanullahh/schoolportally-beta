
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';

export const useUserManagement = () => {
  const { user: currentUser } = useAuth();
  const { school } = useSchool();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!school) return;

    setLoading(true);
    setError(null);

    try {
      const allUsers = await sdk.get<User>('users');
      const schoolUsers = allUsers.filter(u => u.schoolId === school.id);
      setUsers(schoolUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      const updatedUser = await sdk.update<User>('users', userId, {
        status: 'approved'
      });
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
    } catch (err) {
      console.error('Failed to approve user:', err);
      throw err;
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      const updatedUser = await sdk.update<User>('users', userId, {
        status: 'suspended'
      });
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
    } catch (err) {
      console.error('Failed to suspend user:', err);
      throw err;
    }
  };

  const updateUserRole = async (userId: string, userType: User['userType']) => {
    try {
      const updatedUser = await sdk.update<User>('users', userId, {
        userType
      });
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
    } catch (err) {
      console.error('Failed to update user role:', err);
      throw err;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await sdk.delete('users', userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [school]);

  return {
    users,
    loading,
    error,
    approveUser,
    suspendUser,
    updateUserRole,
    deleteUser,
    refreshUsers: fetchUsers
  };
};
