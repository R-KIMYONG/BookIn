'use client';

import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthContext.Provider');
  }

  return context;
};
