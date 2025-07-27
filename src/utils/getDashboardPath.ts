import { User } from '@/lib/sdk';

export const getDashboardPath = (user: User, schoolSlug?: string): string => {
  if (!schoolSlug) return '/';

  const role = user.roles?.[0];

  switch (role) {
    case 'school_admin':
    case 'school_owner':
      return `/${schoolSlug}/admin`;
    case 'student':
      return `/${schoolSlug}/dashboard`;
    case 'teacher':
      return `/${schoolSlug}/dashboard`;
    case 'parent':
      return `/${schoolSlug}/dashboard`;
    default:
      return `/${schoolSlug}`;
  }
};