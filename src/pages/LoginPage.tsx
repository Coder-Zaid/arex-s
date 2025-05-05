
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Separator } from '@/components/ui/separator';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithApple, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
        route: '/'
      });
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error("Google login error:", error);
    }
  };
  
  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
      navigate('/');
    } catch (error) {
      console.error("Apple login error:", error);
    }
  };
  
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-xs text-brand-blue hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-brand-blue hover:bg-brand-blue/90"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </Button>
              
              <div className="relative w-full my-2">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-black px-2 text-xs text-gray-500">
                  or continue with
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={handleGoogleLogin}
                >
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={handleAppleLogin}
                >
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="fill-current dark:fill-white">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  Apple
                </Button>
              </div>
              
              <p className="text-center text-sm text-gray-500 mt-2">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-brand-blue hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        {/* Demo credentials */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo credentials:</p>
          <p>Email: demo@example.com</p>
          <p>Password: password</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
