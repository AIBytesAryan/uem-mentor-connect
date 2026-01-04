import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, User, SeniorProfile } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  seniorProfile: SeniorProfile | null;
  isLoading: boolean;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSeniorProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [seniorProfile, setSeniorProfile] = useState<SeniorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSeniorProfile = () => {
    if (user) {
      const profile = db.getSeniorByUserId(user.uid);
      setSeniorProfile(profile);
    }
  };

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const profile = db.getSeniorByUserId(currentUser.uid);
      setSeniorProfile(profile);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const result = await auth.signInWithEmail(email);
    
    if ('error' in result) {
      return { success: false, error: result.error };
    }
    
    setUser(result.user);
    const profile = db.getSeniorByUserId(result.user.uid);
    setSeniorProfile(profile);
    
    return { success: true };
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setSeniorProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, seniorProfile, isLoading, login, logout, refreshSeniorProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
