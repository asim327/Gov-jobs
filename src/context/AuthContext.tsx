import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../services/storage';
import { DEMO_USER, DEMO_ADMIN } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password?: string) => boolean;
  loginAsDemoUser: () => void;
  loginAsDemoAdmin: () => void;
  register: (name: string, email: string, phone: string, city: string, category?: string) => boolean;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  calculateProfileCompletion: (user?: User | null) => number;
  toggleUserStatus: (userId: string) => void;
  changeUserRole: (userId: string, role: 'user' | 'admin') => void;
  deleteUser: (userId: string) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    return getStorageItem<User[]>(STORAGE_KEYS.USERS, [DEMO_USER, DEMO_ADMIN]);
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Default logged in as DEMO_USER so the platform feels ready-to-test immediately, or read from storage
    const stored = getStorageItem<User | null>(STORAGE_KEYS.CURRENT_USER, DEMO_USER);
    return stored;
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      setStorageItem(STORAGE_KEYS.CURRENT_USER, currentUser);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  const calculateProfileCompletion = (targetUser?: User | null): number => {
    const u = targetUser || currentUser;
    if (!u) return 0;
    let score = 0;
    if (u.name) score += 10;
    if (u.email) score += 10;
    if (u.phone) score += 10;
    if (u.city) score += 10;
    if (u.title) score += 10;
    if (u.bio) score += 10;
    if (u.skills && u.skills.length > 0) score += 10;
    if (u.education && u.education.length > 0) score += 10;
    if (u.experience && u.experience.length > 0) score += 10;
    if (u.preferredCategory) score += 5;
    if (u.expectedSalary) score += 5;
    return Math.min(100, score);
  };

  const login = (email: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === trimmed);
    if (found) {
      if (found.status === 'disabled') {
        return false;
      }
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const loginAsDemoUser = () => {
    const existing = users.find((u) => u.id === DEMO_USER.id) || DEMO_USER;
    setCurrentUser(existing);
  };

  const loginAsDemoAdmin = () => {
    const existing = users.find((u) => u.id === DEMO_ADMIN.id) || DEMO_ADMIN;
    setCurrentUser(existing);
  };

  const register = (
    name: string,
    email: string,
    phone: string,
    city: string,
    category?: string
  ): boolean => {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return false; // Email already in use
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      name,
      email: trimmedEmail,
      phone,
      city,
      role: 'user',
      avatar: '👤',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      preferredCategory: category || 'Software & IT',
      skills: [],
      education: [],
      experience: [],
    };

    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const nextStatus = u.status === 'active' ? 'disabled' : 'active';
        return { ...u, status: nextStatus };
      })
    );
  };

  const changeUserRole = (userId: string, role: 'user' | 'admin') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        loginAsDemoUser,
        loginAsDemoAdmin,
        register,
        logout,
        updateProfile,
        calculateProfileCompletion,
        toggleUserStatus,
        changeUserRole,
        deleteUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
      }}
    >
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
