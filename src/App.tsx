import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { OrderProvider } from '@/context/OrderContext';
import { ProductProvider } from '@/context/ProductContext';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { Navigation } from '@/components/ui-custom/Navigation';
import { HomePage } from '@/pages/HomePage';
import { KatalogPage } from '@/pages/KatalogPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderSuccessPage } from '@/pages/OrderSuccessPage';
import { LoginPage } from '@/pages/LoginPage';
import { AdminPage } from '@/pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ProductProvider>
          <ExpenseProvider>
            <CartProvider>
              <OrderProvider>
                <Router>
                  <div className="min-h-screen bg-[#F7F2E9]">
                    <Navigation />
                    <Routes>
                      <Route path="/" element={<LoginPage />} />
                      <Route path="/beranda" element={<HomePage />} />
                      <Route path="/katalog" element={<KatalogPage />} />
                      <Route path="/produk/:id" element={<ProductDetailPage />} />
                      <Route path="/keranjang" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/pesanan-saya" element={<OrdersPage />} />
                      <Route path="/pesanan-sukses" element={<OrderSuccessPage />} />
                      <Route path="/masuk" element={<LoginPage />} />
                      <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                  </div>
                </Router>
              </OrderProvider>
            </CartProvider>
          </ExpenseProvider>
        </ProductProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
