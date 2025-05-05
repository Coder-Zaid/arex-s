
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    address: '123 Tech Street, Silicon Valley',
    phone: '123-456-7890'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);
      if (!foundUser) {
        throw new Error('User not found');
      }
      
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Simulate Firebase Google Auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock a Google user
      const googleUser: User = {
        id: 'google-123',
        email: 'google@example.com',
        name: 'Google User'
      };
      
      setUser(googleUser);
      localStorage.setItem('user', JSON.stringify(googleUser));
      
      toast({
        title: "Google Sign-In Successful",
        description: "You've been signed in with Google"
      });
    } catch (error) {
      toast({
        title: "Sign-In Failed",
        description: "Failed to sign in with Google",
        variant: "destructive"
      });
      console.error("Google sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithApple = async () => {
    setLoading(true);
    try {
      // Simulate Firebase Apple Auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock an Apple user
      const appleUser: User = {
        id: 'apple-123',
        email: 'apple@example.com',
        name: 'Apple User'
      };
      
      setUser(appleUser);
      localStorage.setItem('user', JSON.stringify(appleUser));
      
      toast({
        title: "Apple Sign-In Successful",
        description: "You've been signed in with Apple"
      });
    } catch (error) {
      toast({
        title: "Sign-In Failed",
        description: "Failed to sign in with Apple",
        variant: "destructive"
      });
      console.error("Apple sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name
      };
      
      // Add to mock users
      mockUsers.push(newUser);
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login,
        loginWithGoogle,
        loginWithApple,
        register, 
        logout,
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
