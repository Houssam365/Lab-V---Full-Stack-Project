import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage on initial load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    let isTokenValid = false;

    if (storedToken) {
      // Basic JWT expiration check
      try {
        const payloadBase64 = storedToken.split('.')[1];
        if (payloadBase64) {
          const payload = JSON.parse(atob(payloadBase64));
          const now = Math.floor(Date.now() / 1000);

          if (payload.exp && payload.exp < now) {
            // Token expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          } else {
            setToken(storedToken);
            isTokenValid = true;
          }
        } else {
          // If no payload part, assume valid or let backend handle it
          setToken(storedToken);
          isTokenValid = true;
        }
      } catch (e) {
        // Failed to parse, assume valid (let backend handle 401)
        setToken(storedToken);
        isTokenValid = true;
      }
    }

    if (storedUser && isTokenValid) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }

    setIsLoading(false);

    const handleAuthError = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleAuthError);

    return () => {
      window.removeEventListener('auth:unauthorized', handleAuthError);
    };
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};