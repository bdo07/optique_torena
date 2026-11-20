import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminLogin, adminLogout, getAdminMe } from '../api/endpoints';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const cached = localStorage.getItem('torena_admin_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('torena_admin_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verifyAuth() {
      const storedToken = localStorage.getItem('torena_admin_token');
      if (!storedToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await getAdminMe();
        setUser(response.user);
        localStorage.setItem('torena_admin_user', JSON.stringify(response.user));
      } catch (err) {
        // Token expired or invalid
        localStorage.removeItem('torena_admin_token');
        localStorage.removeItem('torena_admin_user');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await adminLogin({ email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('torena_admin_token', data.token);
    localStorage.setItem('torena_admin_user', JSON.stringify(data.user));
  };

  const logout = async () => {
    try {
      if (token) {
        await adminLogout();
      }
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('torena_admin_token');
      localStorage.removeItem('torena_admin_user');
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
