import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginAdmin: (username: string, password: string) => boolean;
  loginUser: (phone: string, name?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addOrderToHistory: (orderId: string) => void;
  getOrderHistory: () => string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials - bisa diubah sesuai kebutuhan
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ulfamart-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user:', error);
      }
    }
  }, []);

  // Save user to localStorage on change
  useEffect(() => {
    if (user) {
      localStorage.setItem('ulfamart-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ulfamart-user');
    }
  }, [user]);

  // Login untuk Admin
  const loginAdmin = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: `admin-${Date.now()}`,
        name: 'Administrator',
        phone: '-',
        isAdmin: true,
        wishlist: [],
        orderHistory: []
      };
      setUser(adminUser);
      return true;
    }
    return false;
  }, []);

  // Login untuk Pembeli (User)
  const loginUser = useCallback((phone: string, name?: string) => {
    const savedUser = localStorage.getItem(`ulfamart-customer-${phone}`);
    let existingData = { wishlist: [], orderHistory: [] };
    
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        existingData = { wishlist: parsed.wishlist || [], orderHistory: parsed.orderHistory || [] };
      } catch (error) {
        console.error('Failed to parse customer data:', error);
      }
    }

    const newUser: User = {
      id: `customer-${phone}`,
      name: name || 'Pelanggan',
      phone,
      isAdmin: false,
      wishlist: existingData.wishlist,
      orderHistory: existingData.orderHistory
    };
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ulfamart-user');
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      // Simpan data customer
      if (!user.isAdmin) {
        localStorage.setItem(`ulfamart-customer-${user.phone}`, JSON.stringify(updatedUser));
      }
    }
  }, [user]);

  const addToWishlist = useCallback((productId: string) => {
    if (user && !user.isAdmin) {
      const newWishlist = [...user.wishlist, productId];
      const updatedUser = { ...user, wishlist: newWishlist };
      setUser(updatedUser);
      localStorage.setItem(`ulfamart-customer-${user.phone}`, JSON.stringify(updatedUser));
    }
  }, [user]);

  const removeFromWishlist = useCallback((productId: string) => {
    if (user && !user.isAdmin) {
      const newWishlist = user.wishlist.filter(id => id !== productId);
      const updatedUser = { ...user, wishlist: newWishlist };
      setUser(updatedUser);
      localStorage.setItem(`ulfamart-customer-${user.phone}`, JSON.stringify(updatedUser));
    }
  }, [user]);

  const isInWishlist = useCallback((productId: string) => {
    return user?.wishlist.includes(productId) || false;
  }, [user]);

  const addOrderToHistory = useCallback((orderId: string) => {
    if (user && !user.isAdmin) {
      const newHistory = [orderId, ...user.orderHistory];
      const updatedUser = { ...user, orderHistory: newHistory };
      setUser(updatedUser);
      localStorage.setItem(`ulfamart-customer-${user.phone}`, JSON.stringify(updatedUser));
    }
  }, [user]);

  const getOrderHistory = useCallback(() => {
    return user?.orderHistory || [];
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        loginAdmin,
        loginUser,
        logout,
        updateProfile,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        addOrderToHistory,
        getOrderHistory
      }}
    >
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
