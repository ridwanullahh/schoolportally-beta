
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectPath?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, redirectPath }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, verifyOTP } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      });
      
      if (onSuccess) {
        onSuccess();
      } else if (redirectPath) {
        window.location.href = redirectPath;
      }
    } catch (error: any) {
      if (error.message === 'OTP_REQUIRED') {
        setShowOTP(true);
        toast({
          title: 'OTP Required',
          description: 'Please check your email for the verification code.',
        });
      } else {
        toast({
          title: 'Login Failed',
          description: error.message || 'Invalid credentials',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyOTP(email, otp);
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      });
      
      if (onSuccess) {
        onSuccess();
      } else if (redirectPath) {
        window.location.href = redirectPath;
      }
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid OTP',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (showOTP) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Verify OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOTPVerification} className="space-y-4">
            <div>
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setShowOTP(false)}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <div className="text-center space-y-2">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
            <div>
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <Link 
                to="/signup" 
                className="text-sm text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
