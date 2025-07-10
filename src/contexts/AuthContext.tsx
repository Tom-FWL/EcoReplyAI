import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  currentUser: { email: string; uid: string } | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<{ email: string; uid: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    // Demo authentication - in production, replace with actual Firebase auth
    if (email === 'admin@ecoreply.com' && password === 'password123') {
      const user = { email, uid: 'demo-user-123' };
      setCurrentUser(user);
      localStorage.setItem('ecoreply-user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (email: string, password: string) => {
    // Demo signup - in production, replace with actual Firebase auth
    const user = { email, uid: Date.now().toString() };
    setCurrentUser(user);
    localStorage.setItem('ecoreply-user', JSON.stringify(user));
  };

  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('ecoreply-user');
  };

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('ecoreply-user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('ecoreply-user');
      }
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}