// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  unit: string;
  isAvailable: boolean;
  isBestseller?: boolean;
  isPromo?: boolean;
  discount?: number;
  rating?: number;
  reviews?: number;
  tags?: string[];
  // Cost price for profit calculation
  costPrice?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Order Types
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  finalAmount: number;
  paymentMethod: 'transfer' | 'cod' | 'ewallet' | 'qris';
  shippingMethod: 'delivery' | 'pickup';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  isAdmin: boolean;
  wishlist: string[];
  orderHistory: string[];
}

// Promo Types
export interface Promo {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

// Bundle Types
export interface Bundle {
  id: string;
  name: string;
  description: string;
  image: string;
  products: { productId: string; quantity: number }[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  isActive: boolean;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

// Filter Types
export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'popular';
  inStockOnly?: boolean;
  isPromoOnly?: boolean;
}

// Shipping Types
export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costPerKm?: number;
  estimatedTime: string;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

// Stats Types
export interface SalesStats {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
}

export interface ProductStats {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
}

export interface DashboardStats {
  sales: SalesStats;
  orders: { pending: number; processing: number; completed: number; cancelled: number };
  topProducts: ProductStats[];
  lowStock: Product[];
}

// Expense Types
export interface Expense {
  id: string;
  date: string;
  category: 'inventory' | 'operational' | 'marketing' | 'other';
  description: string;
  amount: number;
  notes?: string;
  createdAt: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
}

// Financial Report Types
export interface FinancialReport {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalOrders: number;
  totalItemsSold: number;
}

// Product Form Data (for create/edit)
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  costPrice: number;
  category: string;
  stock: number;
  unit: string;
  image: string;
  isAvailable: boolean;
  isBestseller: boolean;
}
