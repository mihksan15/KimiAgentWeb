import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Order } from '@/types';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  pendingOrders: Order[];
  processingOrders: Order[];
  completedOrders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: Order['status']) => Order[];
  cancelOrder: (orderId: string) => void;
  reorder: (orderId: string) => Order | null;
  getDailySales: () => number;
  getWeeklySales: () => number;
  getMonthlySales: () => number;
  getTopProducts: () => { productId: string; productName: string; totalSold: number; totalRevenue: number }[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Generate order ID
function generateOrderId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${dateStr}-${random}`;
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { addOrderToHistory } = useAuth();

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('ulfamart-orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Failed to parse orders:', error);
      }
    }
  }, []);

  // Save orders to localStorage on change
  useEffect(() => {
    localStorage.setItem('ulfamart-orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setOrders(prev => [newOrder, ...prev]);
    addOrderToHistory(newOrder.id);
    
    // Send WhatsApp notification (simulated)
    sendWhatsAppNotification(newOrder);
    
    return newOrder;
  }, [addOrderToHistory]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
  }, []);

  const getOrderById = useCallback((orderId: string) => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const getOrdersByStatus = useCallback((status: Order['status']) => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: 'cancelled', updatedAt: new Date().toISOString() }
          : order
      )
    );
  }, []);

  const reorder = useCallback((orderId: string): Order | null => {
    const originalOrder = getOrderById(orderId);
    if (!originalOrder) return null;

    const newOrder = createOrder({
      customerName: originalOrder.customerName,
      customerPhone: originalOrder.customerPhone,
      customerAddress: originalOrder.customerAddress,
      items: originalOrder.items,
      totalAmount: originalOrder.totalAmount,
      shippingCost: originalOrder.shippingCost,
      finalAmount: originalOrder.finalAmount,
      paymentMethod: originalOrder.paymentMethod,
      shippingMethod: originalOrder.shippingMethod,
      status: 'pending',
      notes: `Reorder dari pesanan ${orderId}`
    });

    return newOrder;
  }, [createOrder, getOrderById]);

  const getDailySales = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    return orders
      .filter(order => order.createdAt.startsWith(today) && order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.finalAmount, 0);
  }, [orders]);

  const getWeeklySales = useCallback(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= weekAgo && order.status !== 'cancelled';
      })
      .reduce((sum, order) => sum + order.finalAmount, 0);
  }, [orders]);

  const getMonthlySales = useCallback(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return orders
      .filter(order => order.createdAt.startsWith(currentMonth) && order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.finalAmount, 0);
  }, [orders]);

  const getTopProducts = useCallback(() => {
    const productMap = new Map<string, { productId: string; productName: string; totalSold: number; totalRevenue: number }>();
    
    orders
      .filter(order => order.status !== 'cancelled')
      .forEach(order => {
        order.items.forEach(item => {
          const existing = productMap.get(item.productId);
          if (existing) {
            existing.totalSold += item.quantity;
            existing.totalRevenue += item.subtotal;
          } else {
            productMap.set(item.productId, {
              productId: item.productId,
              productName: item.name,
              totalSold: item.quantity,
              totalRevenue: item.subtotal
            });
          }
        });
      });
    
    return Array.from(productMap.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10);
  }, [orders]);

  // Simulated WhatsApp notification
  const sendWhatsAppNotification = (order: Order) => {
    const message = `Halo ULFAMART! Ada pesanan baru:\n\n` +
      `Order ID: ${order.id}\n` +
      `Nama: ${order.customerName}\n` +
      `Telepon: ${order.customerPhone}\n` +
      `Total: Rp${order.finalAmount.toLocaleString('id-ID')}\n\n` +
      `Mohon segera diproses ya!`;
    
    console.log('WhatsApp notification:', message);
    // In real implementation, this would call WhatsApp API
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const processingOrders = orders.filter(o => ['confirmed', 'processing', 'shipped'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'delivered');

  return (
    <OrderContext.Provider
      value={{
        orders,
        pendingOrders,
        processingOrders,
        completedOrders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrdersByStatus,
        cancelOrder,
        reorder,
        getDailySales,
        getWeeklySales,
        getMonthlySales,
        getTopProducts
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
