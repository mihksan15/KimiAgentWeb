import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Phone, User, Lock, Shield, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginAdmin, loginUser, isAuthenticated, isAdmin } = useAuth();
  
  // Admin login state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  
  // User login state
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/beranda');
    }
    return null;
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    
    if (!adminUsername || !adminPassword) {
      setAdminError('Username dan password wajib diisi');
      return;
    }

    const success = loginAdmin(adminUsername, adminPassword);
    if (success) {
      navigate('/admin', { replace: true });
    } else {
      setAdminError('Username atau password salah');
    }
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userPhone) {
      alert('Nomor telepon wajib diisi');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      loginUser(userPhone, userName || undefined);
      navigate('/beranda', { replace: true });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F7F2E9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-[28px] border border-[#2B2B2B]/10 p-8 lg:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#D64A58] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-['Fredoka'] text-2xl font-semibold text-[#2B2B2B] mb-2">
              Selamat Datang di ULFAMART
            </h1>
            <p className="text-[#6E6E6E]">
              Masuk sebagai Admin atau Pelanggan
            </p>
          </div>

          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Pelanggan
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            {/* User Login */}
            <TabsContent value="user">
              <form onSubmit={handleUserLogin} className="space-y-5">
                <div>
                  <Label htmlFor="userPhone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Nomor Telepon *
                  </Label>
                  <Input
                    id="userPhone"
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="0812-3456-7890"
                    className="mt-2 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="userName" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nama (opsional)
                  </Label>
                  <Input
                    id="userName"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Masukkan nama Anda"
                    className="mt-2 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D64A58] hover:bg-[#c43d4b] rounded-full py-6 text-lg font-medium"
                >
                  {isSubmitting ? 'Memproses...' : 'Masuk sebagai Pelanggan'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-[#6E6E6E]">
                  Dengan masuk, Anda dapat:
                </p>
                <ul className="text-sm text-[#6E6E6E] mt-2 space-y-1">
                  <li>• Belanja dan tambah ke keranjang</li>
                  <li>• Simpan wishlist produk favorit</li>
                  <li>• Lihat riwayat pesanan</li>
                  <li>• Checkout dengan berbagai metode pembayaran</li>
                </ul>
              </div>
            </TabsContent>

            {/* Admin Login */}
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <Label htmlFor="adminUsername" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username *
                  </Label>
                  <Input
                    id="adminUsername"
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="mt-2 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="adminPassword" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password *
                  </Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="mt-2 rounded-xl"
                    required
                  />
                </div>

                {adminError && (
                  <p className="text-red-500 text-sm">{adminError}</p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#2B2B2B] hover:bg-[#1a1a1a] rounded-full py-6 text-lg font-medium"
                >
                  Masuk sebagai Admin
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-[#6E6E6E]">
                  Login Admin untuk:
                </p>
                <ul className="text-sm text-[#6E6E6E] mt-2 space-y-1">
                  <li>• Memantau stok barang</li>
                  <li>• Mengedit stok dan harga</li>
                  <li>• Mengelola pesanan pelanggan</li>
                  <li>• Melihat laporan penjualan</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                <p className="text-sm text-amber-700">
                  <strong>Demo Login:</strong><br />
                  Username: <code>admin</code><br />
                  Password: <code>admin123</code>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
