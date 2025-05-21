import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, CustomUserData } from '../types';
import { useToast } from '@/components/ui/use-toast';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: (method?: 'redirect') => Promise<void>;
  signInWithApple: () => Promise<void>;
  updateUserProfile: (data: Partial<CustomUserData>) => Promise<void>;
  isAuthenticated: boolean;
  requestSellerAccount: (
    storeName: string, 
    storeDescription: string, 
    sellerPhone: string,
    sellerEmail: string,
    sellerAge: number,
    identityDoc?: File,
    logo?: File
  ) => Promise<void>;
  approveSellerRequest: (userId: string) => Promise<void>;
  rejectSellerRequest: (userId: string) => Promise<void>;
  pendingSellerRequests: User[];
  verifySellerIdentity: (userId: string) => Promise<void>;
  verifySellerEmail: (code: string) => Promise<boolean>;
  resendVerificationCode: () => Promise<void>;
  ownerEmail: string;
  ownerPhone: string;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
    displayName: 'Demo User',
    address: '123 Tech Street, Silicon Valley',
    phone: '123-456-7890',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    phoneNumber: null,
    photoURL: null,
    providerData: [],
    providerId: '',
    refreshToken: '',
    tenantId: null,
    uid: '1',
    delete: async () => {},
    getIdToken: async () => '',
    getIdTokenResult: async () => ({
      token: '',
      authTime: '',
      issuedAtTime: '',
      expirationTime: '',
      signInProvider: null,
      claims: {},
      signInSecondFactor: null
    }),
    reload: async () => {},
    toJSON: () => ({})
  },
  {
    id: 'admin1',
    email: 'arex.ksa@gmail.com',
    displayName: 'Admin User',
    address: '456 Admin Street',
    phone: '+966509738173',
    isSeller: true,
    sellerVerified: true,
    sellerApproved: true,
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    phoneNumber: null,
    photoURL: null,
    providerData: [],
    providerId: '',
    refreshToken: '',
    tenantId: null,
    uid: 'admin1',
    delete: async () => {},
    getIdToken: async () => '',
    getIdTokenResult: async () => ({
      token: '',
      authTime: '',
      issuedAtTime: '',
      expirationTime: '',
      signInProvider: null,
      claims: {},
      signInSecondFactor: null
    }),
    reload: async () => {},
    toJSON: () => ({})
  }
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingSellerRequests, setPendingSellerRequests] = useState<User[]>([]);
  const { toast } = useToast();
  const ownerEmail = 'arex.ksa@gmail.com';
  const ownerPhone = '+966509738173';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Get custom user data from localStorage or create new
        const customData: CustomUserData = JSON.parse(localStorage.getItem(`userData_${firebaseUser.uid}`) || '{}') || {
          id: firebaseUser.uid,
          address: '',
          phone: '',
          isSeller: false,
          sellerVerified: false,
          sellerApproved: false
        };

        // Combine Firebase user with custom data
        const user: User = {
          ...firebaseUser,
          ...customData
        };
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const storedRequests = localStorage.getItem('pendingSellerRequests');
    if (storedRequests) {
      setPendingSellerRequests(JSON.parse(storedRequests));
    }
  }, []);

  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === 'pendingSellerRequests') {
        const updated = event.newValue ? JSON.parse(event.newValue) : [];
        setPendingSellerRequests(updated);
      }
    }
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const foundUser = mockUsers.find(u => u.email === email);
      if (!foundUser) {
        throw new Error('User not found');
      }
      setUser(foundUser);
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(foundUser));
      } else {
        sessionStorage.setItem('user', JSON.stringify(foundUser));
      }
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
        displayName: name,
        address: '',
        phone: '',
        isSeller: false,
        sellerVerified: false,
        sellerApproved: false,
        emailVerified: false,
        isAnonymous: false,
        metadata: {},
        phoneNumber: null,
        photoURL: null,
        providerData: [],
        providerId: '',
        refreshToken: '',
        tenantId: null,
        uid: `user-${Date.now()}`,
        delete: async () => {},
        getIdToken: async () => '',
        getIdTokenResult: async () => ({
          token: '',
          authTime: '',
          issuedAtTime: '',
          expirationTime: '',
          signInProvider: null,
          claims: {},
          signInSecondFactor: null
        }),
        reload: async () => {},
        toJSON: () => ({})
      };
      
      // Add to mock users
      mockUsers.push(newUser);
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    await signOut(auth);
  };

  const verifySellerEmail = async (code: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login before verifying your email",
        variant: "destructive"
      });
      return false;
    }

    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const storedCode = localStorage.getItem('verificationCode');
    
    if (code === storedCode) {
      // Update the user's verification status
      const updatedUser = {
        ...user,
        sellerVerified: true
      };
      
      // Update in mock users
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
      
      // Update current user state
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Also update in pending requests if present
      const updatedRequests = pendingSellerRequests.map(req => 
        req.id === user.id ? {...req, sellerVerified: true} : req
      );
      setPendingSellerRequests(updatedRequests);
      localStorage.setItem('pendingSellerRequests', JSON.stringify(updatedRequests));
      
      return true;
    }
    
    return false;
  };

  const resendVerificationCode = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login before requesting verification",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a new verification code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('verificationCode', randomCode);
    
    toast({
      title: "Verification code sent",
      description: `A new verification code has been sent to your email. (For demo: ${randomCode})`,
    });
  };

  const verifySellerIdentity = async (userId: string) => {
    if (!user?.sellerApproved) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to verify seller identity",
        variant: "destructive"
      });
      return;
    }
    
    // Find the user
    const sellerUser = pendingSellerRequests.find(req => req.id === userId);
    if (!sellerUser) {
      toast({
        title: "User not found",
        description: "Could not find the seller to verify",
        variant: "destructive"
      });
      return;
    }
    
    // Update the user's identity verification status
    const updatedUser = {
      ...sellerUser,
      sellerIdentityVerified: true
    };
    
    // Update in mock users
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }
    
    // Update in pending requests
    const updatedRequests = pendingSellerRequests.map(req => 
      req.id === userId ? updatedUser : req
    );
    setPendingSellerRequests(updatedRequests);
    localStorage.setItem('pendingSellerRequests', JSON.stringify(updatedRequests));
    
    toast({
      title: "Identity verified",
      description: "The seller's identity has been verified successfully",
    });
  };

  const requestSellerAccount = async (
    storeName: string, 
    storeDescription: string, 
    sellerPhone: string,
    sellerEmail: string,
    sellerAge: number,
    identityDoc?: File,
    logo?: File
  ) => {
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
        sellerPhone: sellerPhone,
        sellerEmail: sellerEmail,
        sellerAge: sellerAge,
        sellerIdentityVerified: false,
        sellerIdentityDoc: identityDoc ? URL.createObjectURL(identityDoc) : undefined,
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

      // Generate a verification code
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('verificationCode', randomCode);

      toast({
        title: "Request submitted",
        description: `Your seller account request has been submitted. Please verify your email using the code: ${randomCode}`,
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

  const signInWithGoogle = async (method?: 'redirect') => {
    try {
      let result;
      if (method === 'redirect') {
        await signInWithRedirect(auth, googleProvider);
        return;
      } else {
        result = await signInWithPopup(auth, googleProvider);
      }
      if (result) {
        const user: User = {
          ...result.user,
          id: result.user.uid,
          address: '',
          phone: '',
          isSeller: false,
          sellerVerified: false,
          sellerApproved: false
        };
        setUser(user);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const user: User = {
        ...result.user,
        id: result.user.uid,
        address: '',
        phone: '',
        isSeller: false,
        sellerVerified: false,
        sellerApproved: false
      };
      setUser(user);
    } catch (error) {
      console.error('Apple sign-in error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<CustomUserData>) => {
    if (!user) return;
    
    try {
      const updatedCustomData = { ...user, ...data };
      localStorage.setItem(`userData_${user.uid}`, JSON.stringify(updatedCustomData));
      
      const updatedUser: User = {
        ...user,
        ...updatedCustomData
      };
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your inbox for a password reset link.'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send password reset email.',
        variant: 'destructive'
      });
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    signInWithGoogle,
    signInWithApple,
    updateUserProfile,
    isAuthenticated: !!user,
    requestSellerAccount,
    approveSellerRequest,
    rejectSellerRequest,
    pendingSellerRequests,
    verifySellerIdentity,
    verifySellerEmail,
    resendVerificationCode,
    ownerEmail,
    ownerPhone,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
