
interface LocalUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdAt: string;
}

const USERS_KEY = 'schoolportal_users';
const CURRENT_USER_KEY = 'schoolportal_current_user';

export class FallbackAuth {
  private getUsers(): LocalUser[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: LocalUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private hashPassword(password: string): string {
    // Simple hash for demo - in production use proper hashing
    return btoa(password + 'salt').split('').reverse().join('');
  }

  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  register(email: string, password: string, profile: Partial<LocalUser> = {}): LocalUser {
    const users = this.getUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser: LocalUser = {
      id: crypto.randomUUID(),
      email,
      password: this.hashPassword(password),
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      roles: profile.roles || ['school_owner'],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  }

  login(email: string, password: string): LocalUser {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);

    if (!user || !this.verifyPassword(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }

  getCurrentUser(): LocalUser | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export const fallbackAuth = new FallbackAuth();
