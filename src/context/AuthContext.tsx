
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { toast } from '@/components/ui/sonner';
import { auth, googleProvider, appleProvider } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
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

  useEffect(() => {
    // Check both Firebase and localStorage
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          phone: firebaseUser.phoneNumber || undefined,
          photoURL: firebaseUser.photoURL || undefined
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Try Firebase authentication first
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          phone: firebaseUser.phoneNumber || undefined,
          photoURL: firebaseUser.photoURL || undefined
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return;
      } catch (firebaseError) {
        console.log("Firebase auth failed, falling back to mock users", firebaseError);
      }
      
      // Fallback to mock users
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
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        phone: firebaseUser.phoneNumber || undefined,
        photoURL: firebaseUser.photoURL || undefined
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({
        title: "Google Sign-In Successful",
        description: "You've been signed in with Google",
        route: '/'
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
      const result = await signInWithPopup(auth, appleProvider);
      const firebaseUser = result.user;
      
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        phone: firebaseUser.phoneNumber || undefined,
        photoURL: firebaseUser.photoURL || undefined
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({
        title: "Apple Sign-In Successful",
        description: "You've been signed in with Apple",
        route: '/'
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

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      // Update the current user data
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update your profile",
        variant: "destructive"
      });
      console.error("Profile update error:", error);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Try Firebase registration
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: name,
          phone: firebaseUser.phoneNumber || undefined,
          photoURL: firebaseUser.photoURL || undefined
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return;
      } catch (firebaseError) {
        console.log("Firebase registration failed, falling back to mock users", firebaseError);
      }
      
      // Fallback to mock users
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
    signOut(auth).then(() => {
      setUser(null);
      localStorage.removeItem('user');
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
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
        isAuthenticated: !!user,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
