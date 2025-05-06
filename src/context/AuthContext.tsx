
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  requestSellerAccount: (storeName: string, storeDescription: string, logo?: File) => Promise<void>;
  approveSellerRequest: (userId: string) => Promise<void>;
  rejectSellerRequest: (userId: string) => Promise<void>;
  pendingSellerRequests: User[];
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
  },
  {
    id: 'admin1',
    email: 'admin@example.com',
    name: 'Admin User',
    address: '456 Admin Street',
    phone: '987-654-3210',
    isSeller: true,
    sellerVerified: true,
    sellerApproved: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingSellerRequests, setPendingSellerRequests] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load pending seller requests from localStorage
    const storedRequests = localStorage.getItem('pendingSellerRequests');
    if (storedRequests) {
      setPendingSellerRequests(JSON.parse(storedRequests));
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

  const requestSellerAccount = async (storeName: string, storeDescription: string, logo?: File) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login before requesting a seller account",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API request and email verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update the current user with seller request details
      const updatedUser: User = {
        ...user,
        isSeller: false,
        sellerVerified: false, 
        sellerApproved: false,
        sellerRequestDate: new Date().toISOString(),
        storeDetails: {
          name: storeName,
          description: storeDescription,
          logo: logo ? URL.createObjectURL(logo) : undefined
        }
      };

      // Update mock users array
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }

      // Add to pending requests
      const updatedRequests = [...pendingSellerRequests, updatedUser];
      setPendingSellerRequests(updatedRequests);
      localStorage.setItem('pendingSellerRequests', JSON.stringify(updatedRequests));

      // Update current user
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast({
        title: "Request submitted",
        description: "Your seller account request has been submitted for approval. Please check your email to verify your account.",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveSellerRequest = async (userId: string) => {
    if (!user || !user.sellerApproved) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to approve seller accounts",
        variant: "destructive"
      });
      return;
    }

    // Find the user in pending requests
    const requestUser = pendingSellerRequests.find(req => req.id === userId);
    if (!requestUser) {
      toast({
        title: "Request not found",
        description: "The seller request was not found",
        variant: "destructive"
      });
      return;
    }

    // Update the user's seller status
    const updatedUser = {
      ...requestUser,
      isSeller: true,
      sellerApproved: true
    };

    // Update in mock users
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }

    // Remove from pending requests
    const updatedRequests = pendingSellerRequests.filter(req => req.id !== userId);
    setPendingSellerRequests(updatedRequests);
    localStorage.setItem('pendingSellerRequests', JSON.stringify(updatedRequests));

    // Update current user if it's the same user
    if (user.id === userId) {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    toast({
      title: "Seller approved",
      description: "The seller account has been approved successfully",
    });
  };

  const rejectSellerRequest = async (userId: string) => {
    if (!user || !user.sellerApproved) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to reject seller accounts",
        variant: "destructive"
      });
      return;
    }

    // Find the user in pending requests
    const requestUser = pendingSellerRequests.find(req => req.id === userId);
    if (!requestUser) {
      toast({
        title: "Request not found",
        description: "The seller request was not found",
        variant: "destructive"
      });
      return;
    }

    // Update the user's seller status
    const updatedUser = {
      ...requestUser,
      isSeller: false,
      sellerVerified: false,
      sellerApproved: false,
      storeDetails: undefined
    };

    // Update in mock users
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }

    // Remove from pending requests
    const updatedRequests = pendingSellerRequests.filter(req => req.id !== userId);
    setPendingSellerRequests(updatedRequests);
    localStorage.setItem('pendingSellerRequests', JSON.stringify(updatedRequests));

    // Update current user if it's the same user
    if (user.id === userId) {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    toast({
      title: "Seller rejected",
      description: "The seller account request has been rejected",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout,
        isAuthenticated: !!user,
        requestSellerAccount,
        approveSellerRequest,
        rejectSellerRequest,
        pendingSellerRequests
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
