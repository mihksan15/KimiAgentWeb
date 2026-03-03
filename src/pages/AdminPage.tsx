import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  LogOut,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Truck,
  Plus,
  Edit2,
  Trash2,
  Search,
  Download,
  Upload,
  FileSpreadsheet,
  X,
  Filter,
  Settings,
  Phone,
  Store,
  Clock,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { useProduct } from '@/context/ProductContext';
import { useExpense, expenseCategories } from '@/context/ExpenseContext';
import { useSettings } from '@/context/SettingsContext';
import { categories } from '@/data/products';
import type { Product, ProductFormData, Expense } from '@/types';
import {
  exportProductsToCSV,
  exportOrdersToCSV,
  exportExpensesToCSV,
  exportFinancialReportToCSV,
  downloadCSV,
  parseCSV,
  csvToProducts,
  csvToExpenses
} from '@/utils/excelExport';

export function AdminPage() {
  const { logout, isAdmin } = useAuth();
  const {
    orders,
    pendingOrders,
    processingOrders,
    completedOrders,
    getDailySales,
    getWeeklySales,
    getMonthlySales,
    getTopProducts,
    updateOrderStatus
  } = useOrder();
  
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    importProducts
  } = useProduct();
  
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getDailyExpenses,
    getWeeklyExpenses,
    getMonthlyExpenses,
    importExpenses
  } = useExpense();

  const { settings, updateSettings } = useSettings();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Product dialog states
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    costPrice: 0,
    category: '',
    stock: 0,
    unit: 'pcs',
    image: '/images/products/default.jpg',
    isAvailable: true,
    isBestseller: false
  });

  // Expense dialog states
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseForm, setExpenseForm] = useState<{
    date: string;
    category: 'inventory' | 'operational' | 'marketing' | 'other';
    description: string;
    amount: number;
    notes: string;
  }>({
    date: new Date().toISOString().slice(0, 10),
    category: 'inventory',
    description: '',
    amount: 0,
    notes: ''
  });

  // Import/Export states
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importType, setImportType] = useState<'products' | 'expenses'>('products');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    whatsappNumber: settings.whatsappNumber,
    storeName: settings.storeName,
    storeAddress: settings.storeAddress,
    storeHours: settings.storeHours
  });

  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setProductForm(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setProductForm(prev => ({ ...prev, image: '/images/products/default.jpg' }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleSaveSettings = () => {
    updateSettings(settingsForm);
    alert('Pengaturan berhasil disimpan!');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F7F2E9] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['Fredoka'] text-2xl text-[#2B2B2B] mb-4">
            Akses Ditolak
          </h1>
          <p className="text-[#6E6E6E] mb-6">
            Anda tidak memiliki akses ke halaman ini.
          </p>
          <Link to="/">
            <Button className="bg-[#D64A58] hover:bg-[#c43d4b] rounded-full">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filtered products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const dailySales = getDailySales();
  const weeklySales = getWeeklySales();
  const monthlySales = getMonthlySales();
  const dailyExpenses = getDailyExpenses();
  const weeklyExpenses = getWeeklyExpenses();
  const monthlyExpenses = getMonthlyExpenses();
  const topProducts = getTopProducts();
  const lowStockProducts = products.filter(p => p.stock <= 10);
  
  // Use monthlySales in a card
  const monthlyRevenue = monthlySales;

  // Product form handlers
  const handleOpenProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        costPrice: product.costPrice || product.price * 0.8,
        category: product.category,
        stock: product.stock,
        unit: product.unit,
        image: product.image,
        isAvailable: product.isAvailable,
        isBestseller: product.isBestseller || false
      });
      // Set image preview if product has a custom image
      if (product.image && product.image !== '/images/products/default.jpg') {
        setImagePreview(product.image);
      } else {
        setImagePreview(null);
      }
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: 0,
        costPrice: 0,
        category: '',
        stock: 0,
        unit: 'pcs',
        image: '/images/products/default.jpg',
        isAvailable: true,
        isBestseller: false
      });
      setImagePreview(null);
    }
    setIsProductDialogOpen(true);
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.category) {
      alert('Nama dan kategori produk wajib diisi');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
    } else {
      addProduct(productForm);
    }
    setIsProductDialogOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProduct(id);
    }
  };

  // Expense form handlers
  const handleOpenExpenseDialog = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setExpenseForm({
        date: expense.date,
        category: expense.category as 'inventory' | 'operational' | 'marketing' | 'other',
        description: expense.description,
        amount: expense.amount,
        notes: expense.notes || ''
      });
    } else {
      setEditingExpense(null);
      setExpenseForm({
        date: new Date().toISOString().slice(0, 10),
        category: 'inventory',
        description: '',
        amount: 0,
        notes: ''
      });
    }
    setIsExpenseDialogOpen(true);
  };

  const handleSaveExpense = () => {
    if (!expenseForm.description || expenseForm.amount <= 0) {
      alert('Deskripsi dan jumlah pengeluaran wajib diisi');
      return;
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, expenseForm);
    } else {
      addExpense(expenseForm);
    }
    setIsExpenseDialogOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
      deleteExpense(id);
    }
  };

  // Export handlers
  const handleExportProducts = () => {
    const csv = exportProductsToCSV(products);
    downloadCSV(csv, `produk-ulfamart-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleExportOrders = () => {
    const csv = exportOrdersToCSV(orders);
    downloadCSV(csv, `pesanan-ulfamart-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleExportExpenses = () => {
    const csv = exportExpensesToCSV(expenses);
    downloadCSV(csv, `pengeluaran-ulfamart-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleExportFinancialReport = () => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const csv = exportFinancialReportToCSV(
      orders,
      expenses,
      startDate.toISOString().slice(0, 10),
      new Date().toISOString().slice(0, 10)
    );
    downloadCSV(csv, `laporan-keuangan-ulfamart-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Import handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const data = parseCSV(content);
      
      if (importType === 'products') {
        const productsData = csvToProducts(data);
        const result = importProducts(productsData);
        setImportResult(result);
      } else {
        const expensesData = csvToExpenses(data);
        const result = importExpenses(expensesData);
        setImportResult(result);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500">Menunggu</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-500">Dikonfirmasi</Badge>;
      case 'processing':
        return <Badge className="bg-purple-500">Diproses</Badge>;
      case 'shipped':
        return <Badge className="bg-cyan-500">Dikirim</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Selesai</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Dibatalkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || catId;
  };

  return (
    <div className="min-h-screen bg-[#F7F2E9] pt-20 lg:pt-24">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-[24px] p-4 border border-[#2B2B2B]/10">
              <div className="flex items-center gap-3 p-4 mb-4">
                <div className="w-10 h-10 bg-[#D64A58] rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-['Fredoka'] text-lg font-semibold">Admin Panel</h2>
                  <p className="text-xs text-[#6E6E6E]">ULFAMART</p>
                </div>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-[#D64A58] text-white'
                      : 'hover:bg-[#F7F2E9]'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'products'
                      ? 'bg-[#D64A58] text-white'
                      : 'hover:bg-[#F7F2E9]'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  Produk
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-[#D64A58] text-white'
                      : 'hover:bg-[#F7F2E9]'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Pesanan
                  {pendingOrders.length > 0 && (
                    <Badge className="ml-auto bg-white text-[#D64A58]">
                      {pendingOrders.length}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'expenses'
                      ? 'bg-[#D64A58] text-white'
                      : 'hover:bg-[#F7F2E9]'
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                  Pengeluaran
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'reports'
                      ? 'bg-[#D64A58] text-white'
                      : 'hover:bg-[#F7F2E9]'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  Laporan
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-[#D64A58] text-white'
                      : 'hover:bg-[#F7F2E9]'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Pengaturan
                </button>
              </nav>

              <div className="mt-4 pt-4 border-t border-[#2B2B2B]/10">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Keluar
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-[#6E6E6E]">Penjualan Hari Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#D64A58]" />
                        <span className="text-2xl font-bold">
                          Rp{dailySales.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-[#6E6E6E]">Penjualan Minggu Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span className="text-2xl font-bold">
                          Rp{weeklySales.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-[#6E6E6E]">Penjualan Bulan Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <span className="text-2xl font-bold">
                          Rp{monthlyRevenue.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-[#6E6E6E]">Pesanan Menunggu</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <span className="text-2xl font-bold">{pendingOrders.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                  <Card className="border-amber-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="w-5 h-5" />
                        Stok Menipis ({lowStockProducts.length} produk)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {lowStockProducts.slice(0, 5).map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-3 bg-amber-50 rounded-lg"
                          >
                            <span>{product.name}</span>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-amber-500">
                                Stok: {product.stock} {product.unit}
                              </Badge>
                              <Button
                                size="sm"
                                onClick={() => updateStock(product.id, product.stock + 10)}
                              >
                                +10
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Top Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>Produk Terlaris</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {topProducts.length > 0 ? (
                      <div className="space-y-3">
                        {topProducts.slice(0, 5).map((product, index) => (
                          <div
                            key={product.productId}
                            className="flex items-center justify-between p-3 bg-[#F7F2E9] rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 bg-[#D64A58] text-white rounded-full flex items-center justify-center text-sm">
                                {index + 1}
                              </span>
                              <span>{product.productName}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{product.totalSold} terjual</p>
                              <p className="text-sm text-[#6E6E6E]">
                                Rp{product.totalRevenue.toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#6E6E6E] text-center py-4">
                        Belum ada data penjualan
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex gap-2 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6E6E]" />
                      <Input
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportProducts}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button onClick={() => handleOpenProductDialog()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Produk
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#F7F2E9]">
                          <tr>
                            <th className="px-4 py-3 text-left">Produk</th>
                            <th className="px-4 py-3 text-left">Kategori</th>
                            <th className="px-4 py-3 text-right">Harga Jual</th>
                            <th className="px-4 py-3 text-right">Harga Modal</th>
                            <th className="px-4 py-3 text-center">Stok</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b border-[#F7F2E9]">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded-lg"
                                  />
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    {product.isBestseller && (
                                      <Badge className="bg-amber-500 text-xs">Bestseller</Badge>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">{getCategoryName(product.category)}</td>
                              <td className="px-4 py-3 text-right">
                                Rp{product.price.toLocaleString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-right text-[#6E6E6E]">
                                Rp{(product.costPrice || 0).toLocaleString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Badge className={product.stock <= 10 ? 'bg-amber-500' : 'bg-green-500'}>
                                  {product.stock}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {product.isAvailable ? (
                                  <Badge className="bg-green-500">Aktif</Badge>
                                ) : (
                                  <Badge className="bg-gray-500">Nonaktif</Badge>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex justify-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleOpenProductDialog(product)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Daftar Pesanan</CardTitle>
                  <Button variant="outline" onClick={handleExportOrders}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="pending">
                    <TabsList className="mb-4">
                      <TabsTrigger value="pending">
                        Menunggu ({pendingOrders.length})
                      </TabsTrigger>
                      <TabsTrigger value="processing">
                        Diproses ({processingOrders.length})
                      </TabsTrigger>
                      <TabsTrigger value="completed">
                        Selesai ({completedOrders.length})
                      </TabsTrigger>
                      <TabsTrigger value="all">
                        Semua ({orders.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-3">
                      {pendingOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          getStatusBadge={getStatusBadge}
                          onUpdateStatus={updateOrderStatus}
                        />
                      ))}
                      {pendingOrders.length === 0 && (
                        <p className="text-[#6E6E6E] text-center py-8">
                          Tidak ada pesanan menunggu
                        </p>
                      )}
                    </TabsContent>

                    <TabsContent value="processing" className="space-y-3">
                      {processingOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          getStatusBadge={getStatusBadge}
                          onUpdateStatus={updateOrderStatus}
                        />
                      ))}
                      {processingOrders.length === 0 && (
                        <p className="text-[#6E6E6E] text-center py-8">
                          Tidak ada pesanan diproses
                        </p>
                      )}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-3">
                      {completedOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          getStatusBadge={getStatusBadge}
                          onUpdateStatus={updateOrderStatus}
                        />
                      ))}
                      {completedOrders.length === 0 && (
                        <p className="text-[#6E6E6E] text-center py-8">
                          Belum ada pesanan selesai
                        </p>
                      )}
                    </TabsContent>

                    <TabsContent value="all" className="space-y-3">
                      {orders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          getStatusBadge={getStatusBadge}
                          onUpdateStatus={updateOrderStatus}
                        />
                      ))}
                      {orders.length === 0 && (
                        <p className="text-[#6E6E6E] text-center py-8">
                          Belum ada pesanan
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Expenses Tab */}
            {activeTab === 'expenses' && (
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <Card className="bg-red-50">
                      <CardContent className="pt-6">
                        <p className="text-sm text-[#6E6E6E]">Hari Ini</p>
                        <p className="text-2xl font-bold text-red-600">
                          Rp{dailyExpenses.toLocaleString('id-ID')}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50">
                      <CardContent className="pt-6">
                        <p className="text-sm text-[#6E6E6E]">Minggu Ini</p>
                        <p className="text-2xl font-bold text-red-600">
                          Rp{weeklyExpenses.toLocaleString('id-ID')}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50">
                      <CardContent className="pt-6">
                        <p className="text-sm text-[#6E6E6E]">Bulan Ini</p>
                        <p className="text-2xl font-bold text-red-600">
                          Rp{monthlyExpenses.toLocaleString('id-ID')}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportExpenses}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button onClick={() => handleOpenExpenseDialog()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#F7F2E9]">
                          <tr>
                            <th className="px-4 py-3 text-left">Tanggal</th>
                            <th className="px-4 py-3 text-left">Kategori</th>
                            <th className="px-4 py-3 text-left">Deskripsi</th>
                            <th className="px-4 py-3 text-right">Jumlah</th>
                            <th className="px-4 py-3 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses.map((expense) => (
                            <tr key={expense.id} className="border-b border-[#F7F2E9]">
                              <td className="px-4 py-3">{expense.date}</td>
                              <td className="px-4 py-3">
                                {expenseCategories.find(c => c.id === expense.category)?.name || expense.category}
                              </td>
                              <td className="px-4 py-3">{expense.description}</td>
                              <td className="px-4 py-3 text-right font-medium text-red-600">
                                Rp{expense.amount.toLocaleString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex justify-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleOpenExpenseDialog(expense)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500"
                                    onClick={() => handleDeleteExpense(expense.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Export Laporan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#F7F2E9] rounded-xl">
                        <h4 className="font-semibold mb-2">Laporan Keuangan</h4>
                        <p className="text-sm text-[#6E6E6E] mb-4">
                          Export laporan pendapatan dan pengeluaran dalam periode tertentu
                        </p>
                        <Button onClick={handleExportFinancialReport} className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download Laporan Keuangan
                        </Button>
                      </div>
                      <div className="p-4 bg-[#F7F2E9] rounded-xl">
                        <h4 className="font-semibold mb-2">Data Produk</h4>
                        <p className="text-sm text-[#6E6E6E] mb-4">
                          Export semua data produk dalam format CSV
                        </p>
                        <Button onClick={handleExportProducts} variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download Data Produk
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Import Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Select value={importType} onValueChange={(v: 'products' | 'expenses') => setImportType(v)}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="products">Data Produk</SelectItem>
                            <SelectItem value="expenses">Data Pengeluaran</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Pilih File CSV
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>

                      {importResult && (
                        <div className={`p-4 rounded-xl ${importResult.failed === 0 ? 'bg-green-50' : 'bg-amber-50'}`}>
                          <p className="font-medium">
                            Berhasil: {importResult.success}, Gagal: {importResult.failed}
                          </p>
                          {importResult.errors.length > 0 && (
                            <ul className="mt-2 text-sm text-red-600">
                              {importResult.errors.slice(0, 5).map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                              {importResult.errors.length > 5 && (
                                <li>...dan {importResult.errors.length - 5} error lainnya</li>
                              )}
                            </ul>
                          )}
                        </div>
                      )}

                      <div className="text-sm text-[#6E6E6E]">
                        <p className="font-medium">Format CSV yang didukung:</p>
                        {importType === 'products' ? (
                          <ul className="list-disc list-inside mt-1">
                            <li>Nama Produk, Deskripsi, Harga Jual, Harga Modal, Kategori, Subkategori, Stok, Satuan</li>
                            <li>Atau: name, description, price, costPrice, category, subcategory, stock, unit</li>
                          </ul>
                        ) : (
                          <ul className="list-disc list-inside mt-1">
                            <li>Tanggal, Kategori, Deskripsi, Jumlah, Catatan</li>
                            <li>Atau: date, category, description, amount, notes</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Pengaturan Toko
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid gap-6">
                        <div>
                          <Label htmlFor="whatsappNumber" className="flex items-center gap-2 mb-2">
                            <Phone className="w-4 h-4" />
                            Nomor WhatsApp Admin *
                          </Label>
                          <Input
                            id="whatsappNumber"
                            value={settingsForm.whatsappNumber}
                            onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                            placeholder="0812-3456-7890"
                          />
                          <p className="text-sm text-[#6E6E6E] mt-1">
                            Nomor ini akan digunakan pelanggan untuk mengirim bukti pembayaran dan konfirmasi pesanan.
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="storeName" className="flex items-center gap-2 mb-2">
                            <Store className="w-4 h-4" />
                            Nama Toko
                          </Label>
                          <Input
                            id="storeName"
                            value={settingsForm.storeName}
                            onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                            placeholder="Nama toko Anda"
                          />
                        </div>

                        <div>
                          <Label htmlFor="storeAddress" className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4" />
                            Alamat Toko
                          </Label>
                          <Textarea
                            id="storeAddress"
                            value={settingsForm.storeAddress}
                            onChange={(e) => setSettingsForm({ ...settingsForm, storeAddress: e.target.value })}
                            placeholder="Alamat lengkap toko"
                          />
                        </div>

                        <div>
                          <Label htmlFor="storeHours" className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4" />
                            Jam Operasional
                          </Label>
                          <Input
                            id="storeHours"
                            value={settingsForm.storeHours}
                            onChange={(e) => setSettingsForm({ ...settingsForm, storeHours: e.target.value })}
                            placeholder="07.00–20.00 WIB"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#2B2B2B]/10">
                        <Button 
                          onClick={handleSaveSettings}
                          className="bg-[#D64A58] hover:bg-[#c43d4b]"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Simpan Pengaturan
                        </Button>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-xl">
                        <h4 className="font-medium text-blue-800 mb-2">Informasi WhatsApp</h4>
                        <p className="text-sm text-blue-700">
                          Nomor WhatsApp: <strong>{settings.whatsappNumber}</strong>
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Setelah pelanggan melakukan pembayaran, mereka akan diarahkan ke WhatsApp dengan pesan otomatis yang berisi detail pesanan.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Fredoka'] text-xl">
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <ImageIcon className="w-4 h-4" />
                Foto Produk
              </Label>
              {imagePreview ? (
                <div className="relative">
                  <div className="aspect-video w-full max-h-48 rounded-xl border border-[#2B2B2B]/10 overflow-hidden bg-[#F7F2E9]">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="aspect-video w-full max-h-48 rounded-xl border-2 border-dashed border-[#2B2B2B]/20 bg-[#F7F2E9] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#F0E8DC] hover:border-[#D64A58]/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    <Upload className="w-5 h-5 text-[#6E6E6E]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#2B2B2B]">
                      Klik atau drag & drop foto di sini
                    </p>
                    <p className="text-xs text-[#6E6E6E] mt-1">
                      Format: JPG, PNG, WEBP (max 2MB)
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div>
              <Label>Nama Produk *</Label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="Masukkan nama produk"
              />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Deskripsi produk"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Harga Jual *</Label>
                <Input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Harga Modal</Label>
                <Input
                  type="number"
                  value={productForm.costPrice}
                  onChange={(e) => setProductForm({ ...productForm, costPrice: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label>Kategori *</Label>
              <Select
                value={productForm.category}
                onValueChange={(v) => setProductForm({ ...productForm, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stok *</Label>
                <Input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Satuan</Label>
                <Input
                  value={productForm.unit}
                  onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                  placeholder="pcs, kg, botol, dll"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={productForm.isAvailable}
                  onCheckedChange={(v) => setProductForm({ ...productForm, isAvailable: v as boolean })}
                />
                <span>Tersedia</span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={productForm.isBestseller}
                  onCheckedChange={(v) => setProductForm({ ...productForm, isBestseller: v as boolean })}
                />
                <span>Bestseller</span>
              </label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsProductDialogOpen(false)}>
                Batal
              </Button>
              <Button className="flex-1 bg-[#D64A58]" onClick={handleSaveProduct}>
                {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Fredoka'] text-xl">
              {editingExpense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tanggal *</Label>
              <Input
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Kategori *</Label>
              <Select
                value={expenseForm.category}
                onValueChange={(v) => setExpenseForm({ ...expenseForm, category: v as 'inventory' | 'operational' | 'marketing' | 'other' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Deskripsi *</Label>
              <Input
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                placeholder="Contoh: Pembelian stok beras"
              />
            </div>
            <div>
              <Label>Jumlah (Rp) *</Label>
              <Input
                type="number"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Catatan</Label>
              <Textarea
                value={expenseForm.notes}
                onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                placeholder="Catatan tambahan (opsional)"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsExpenseDialogOpen(false)}>
                Batal
              </Button>
              <Button className="flex-1 bg-[#D64A58]" onClick={handleSaveExpense}>
                {editingExpense ? 'Simpan Perubahan' : 'Tambah Pengeluaran'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Order Card Component
interface OrderCardProps {
  order: any;
  getStatusBadge: (status: string) => React.ReactNode;
  onUpdateStatus: (orderId: string, status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => void;
}

function OrderCard({ order, getStatusBadge, onUpdateStatus }: OrderCardProps) {
  return (
    <div className="p-4 bg-[#F7F2E9] rounded-xl">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold">{order.id}</p>
          <p className="text-sm text-[#6E6E6E]">{order.customerName}</p>
        </div>
        {getStatusBadge(order.status)}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6E6E6E]">
          {order.items.length} item • Rp{order.finalAmount.toLocaleString('id-ID')}
        </p>
        <div className="flex gap-2">
          {order.status === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={() => onUpdateStatus(order.id, 'confirmed')}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Konfirmasi
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Batal
              </Button>
            </>
          )}
          {order.status === 'confirmed' && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, 'processing')}
            >
              <Package className="w-4 h-4 mr-1" />
              Proses
            </Button>
          )}
          {order.status === 'processing' && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, 'shipped')}
            >
              <Truck className="w-4 h-4 mr-1" />
              Kirim
            </Button>
          )}
          {order.status === 'shipped' && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, 'delivered')}
              className="bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Selesai
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
