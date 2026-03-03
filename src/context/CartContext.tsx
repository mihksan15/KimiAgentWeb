import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { CartItem, CartState, Product } from '@/types';

interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

function calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalPrice: acc.totalPrice + item.product.price * item.quantity
    }),
    { totalItems: 0, totalPrice: 0 }
  );
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity }];
      }
      
      const totals = calculateTotals(newItems);
      return { items: newItems, ...totals };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload);
      const totals = calculateTotals(newItems);
      return { items: newItems, ...totals };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.product.id !== productId);
        const totals = calculateTotals(newItems);
        return { items: newItems, ...totals };
      }
      
      const newItems = state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      const totals = calculateTotals(newItems);
      return { items: newItems, ...totals };
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    case 'LOAD_CART':
      return action.payload;
    
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ulfamart-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Failed to parse cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('ulfamart-cart', JSON.stringify(state));
  }, [state]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (product.stock < quantity) {
      alert(`Maaf, stok ${product.name} hanya tersedia ${product.stock} ${product.unit}`);
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const item = state.items.find(i => i.product.id === productId);
    if (item && quantity > item.product.stock) {
      alert(`Maaf, stok ${item.product.name} hanya tersedia ${item.product.stock} ${item.product.unit}`);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, [state.items]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const isInCart = useCallback((productId: string) => {
    return state.items.some(item => item.product.id === productId);
  }, [state.items]);

  const getCartItem = useCallback((productId: string) => {
    return state.items.find(item => item.product.id === productId);
  }, [state.items]);

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
