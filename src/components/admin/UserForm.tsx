import React from 'react';
import { User } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFormProps {
  user: Partial<User>;
  onUserChange: (field: keyof User, value: any) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onUserChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" value={user.firstName || ''} onChange={(e) => onUserChange('firstName', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={user.lastName || ''} onChange={(e) => onUserChange('lastName', e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={user.email || ''} onChange={(e) => onUserChange('email', e.target.value)} />
      </div>
      <div>
        <Label htmlFor="userType">Role</Label>
        <Select value={user.userType || ''} onValueChange={(value) => onUserChange('userType', value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="parent">Parent</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserForm;