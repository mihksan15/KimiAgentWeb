import type { Product, Category, Testimonial, Bundle, Promo, Expense, ExpenseCategory } from '@/types';

export const categories: Category[] = [
  {
    id: 'makanan-minuman',
    name: 'Makanan dan Minuman',
    description: 'Makanan siap saji, minuman kemasan, dan camilan',
    image: '/images/categories/makanan-minuman.jpg',
    productCount: 0
  },
  {
    id: 'bahan-pokok',
    name: 'Bahan Pokok',
    description: 'Beras, minyak, gula, tepung, dan kebutuhan pokok lainnya',
    image: '/images/categories/bahan-pokok.jpg',
    productCount: 0
  },
  {
    id: 'produk-rumah-tangga',
    name: 'Produk Rumah Tangga',
    description: 'Sabun, deterjen, tissue, dan perlengkapan rumah tangga',
    image: '/images/categories/produk-rumah-tangga.jpg',
    productCount: 0
  },
  {
    id: 'perawatan-diri',
    name: 'Produk Perawatan Diri',
    description: 'Shampoo, sabun mandi, pasta gigi, dan produk perawatan pribadi',
    image: '/images/categories/perawatan-diri.jpg',
    productCount: 0
  },
  {
    id: 'peralatan-rumah-tangga',
    name: 'Peralatan Rumah Tangga Kecil',
    description: 'Peralatan dapur, lampu, baterai, dan perlengkapan rumah kecil',
    image: '/images/categories/peralatan-rumah-tangga.jpg',
    productCount: 0
  },
  {
    id: 'rokok-tembakau',
    name: 'Rokok dan Tembakau',
    description: 'Rokok, tembakau, dan perlengkapannya',
    image: '/images/categories/rokok-tembakau.jpg',
    productCount: 0
  },
  {
    id: 'alat-tulis',
    name: 'Alat Tulis dan Kebutuhan Sekolah',
    description: 'Buku, pulpen, pensil, dan perlengkapan sekolah',
    image: '/images/categories/alat-tulis.jpg',
    productCount: 0
  },
  {
    id: 'obat-ringan',
    name: 'Obat-obatan Ringan',
    description: 'Obat sakit kepala, vitamin, dan obat-obatan bebas terbatas',
    image: '/images/categories/obat-ringan.jpg',
    productCount: 0
  },
  {
    id: 'sayur-mayur',
    name: 'Sayur Mayur',
    description: 'Sayuran segar dan buah-buahan',
    image: '/images/categories/sayur-mayur.jpg',
    productCount: 0
  }
];

export const products: Product[] = [
  // Bahan Pokok
  {
    id: 'beras-premium-5kg',
    name: 'Beras Premium 5kg',
    description: 'Beras premium berkualitas tinggi, pulen dan wangi',
    price: 72000,
    costPrice: 65000,
    category: 'bahan-pokok',
    image: '/images/products/beras-premium.jpg',
    stock: 50,
    unit: 'karung',
    isAvailable: true,
    isBestseller: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'beras-medium-5kg',
    name: 'Beras Medium 5kg',
    description: 'Beras medium berkualitas baik, hemat dan enak',
    price: 58000,
    costPrice: 52000,
    category: 'bahan-pokok',
    image: '/images/products/beras-medium.jpg',
    stock: 45,
    unit: 'karung',
    isAvailable: true,
    rating: 4.5,
    reviews: 89
  },
  {
    id: 'minyak-goreng-1l',
    name: 'Minyak Goreng 1L',
    description: 'Minyak goreng berkualitas, tidak mudah panas',
    price: 18500,
    costPrice: 16000,
    category: 'bahan-pokok',
    image: '/images/products/minyak-goreng.jpg',
    stock: 80,
    unit: 'botol',
    isAvailable: true,
    isBestseller: true,
    rating: 4.6,
    reviews: 156
  },
  {
    id: 'minyak-goreng-2l',
    name: 'Minyak Goreng 2L',
    description: 'Minyak goreng kemasan ekonomis 2 liter',
    price: 34000,
    costPrice: 30000,
    category: 'bahan-pokok',
    image: '/images/products/minyak-goreng-2l.jpg',
    stock: 60,
    unit: 'botol',
    isAvailable: true,
    rating: 4.7,
    reviews: 98
  },
  {
    id: 'gula-pasir-1kg',
    name: 'Gula Pasir 1kg',
    description: 'Gula pasir halus, manis alami',
    price: 15000,
    costPrice: 13000,
    category: 'bahan-pokok',
    image: '/images/products/gula-pasir.jpg',
    stock: 100,
    unit: 'kg',
    isAvailable: true,
    isBestseller: true,
    rating: 4.7,
    reviews: 203
  },
  {
    id: 'gula-merah-500g',
    name: 'Gula Merah 500g',
    description: 'Gula merah asli, cocok untuk kolak dan es campur',
    price: 12000,
    costPrice: 10000,
    category: 'bahan-pokok',
    image: '/images/products/gula-merah.jpg',
    stock: 40,
    unit: 'pack',
    isAvailable: true,
    rating: 4.5,
    reviews: 67
  },
  {
    id: 'tepung-terigu-1kg',
    name: 'Tepung Terigu 1kg',
    description: 'Tepung terigu serbaguna untuk kue dan gorengan',
    price: 14000,
    costPrice: 12000,
    category: 'bahan-pokok',
    image: '/images/products/tepung-terigu.jpg',
    stock: 70,
    unit: 'kg',
    isAvailable: true,
    rating: 4.6,
    reviews: 112
  },
  {
    id: 'mie-instan-5pcs',
    name: 'Mie Instan 5pcs',
    description: 'Mie instan favorit keluarga, berbagai rasa',
    price: 13500,
    costPrice: 11500,
    category: 'bahan-pokok',
    image: '/images/products/mie-instan.jpg',
    stock: 120,
    unit: 'pack',
    isAvailable: true,
    isBestseller: true,
    rating: 4.8,
    reviews: 245
  },
  // Makanan dan Minuman
  {
    id: 'kopi-sachet-10pcs',
    name: 'Kopi Sachet 10pcs',
    description: 'Kopi instant sachet, nikmat dan praktis',
    price: 12000,
    costPrice: 10000,
    category: 'makanan-minuman',
    image: '/images/products/kopi-sachet.jpg',
    stock: 90,
    unit: 'pack',
    isAvailable: true,
    isBestseller: true,
    rating: 4.7,
    reviews: 178
  },
  {
    id: 'kopi-bubuk-200g',
    name: 'Kopi Bubuk 200g',
    description: 'Kopi bubuk murni, aroma khas',
    price: 25000,
    costPrice: 21000,
    category: 'makanan-minuman',
    image: '/images/products/kopi-bubuk.jpg',
    stock: 35,
    unit: 'pack',
    isAvailable: true,
    rating: 4.6,
    reviews: 87
  },
  {
    id: 'teh-celup-25pcs',
    name: 'Teh Celup 25pcs',
    description: 'Teh celup berkualitas, segar setiap saat',
    price: 8500,
    costPrice: 7000,
    category: 'makanan-minuman',
    image: '/images/products/teh-celup.jpg',
    stock: 85,
    unit: 'box',
    isAvailable: true,
    rating: 4.5,
    reviews: 134
  },
  {
    id: 'kerupuk-udang-250g',
    name: 'Kerupuk Udang 250g',
    description: 'Kerupuk udang renyah, cocok untuk lauk',
    price: 18000,
    costPrice: 15000,
    category: 'makanan-minuman',
    image: '/images/products/kerupuk-udang.jpg',
    stock: 55,
    unit: 'pack',
    isAvailable: true,
    rating: 4.7,
    reviews: 92
  },
  {
    id: 'minuman-soda-1l',
    name: 'Minuman Soda 1L',
    description: 'Minuman soda segar, cocok untuk bersantai',
    price: 9500,
    costPrice: 8000,
    category: 'makanan-minuman',
    image: '/images/products/minuman-soda.jpg',
    stock: 65,
    unit: 'botol',
    isAvailable: true,
    rating: 4.4,
    reviews: 76
  },
  // Produk Rumah Tangga
  {
    id: 'sabun-cuci-500ml',
    name: 'Sabun Cuci Piring 500ml',
    description: 'Sabun cuci piring, busa melimpah',
    price: 12000,
    costPrice: 10000,
    category: 'produk-rumah-tangga',
    image: '/images/products/sabun-cuci.jpg',
    stock: 60,
    unit: 'botol',
    isAvailable: true,
    rating: 4.5,
    reviews: 98
  },
  {
    id: 'deterjen-1kg',
    name: 'Deterjen 1kg',
    description: 'Deterjen bubuk, bersihkan noda membandel',
    price: 22000,
    costPrice: 19000,
    category: 'produk-rumah-tangga',
    image: '/images/products/deterjen.jpg',
    stock: 50,
    unit: 'pack',
    isAvailable: true,
    rating: 4.7,
    reviews: 167
  },
  {
    id: 'tissue-250s',
    name: 'Tissue 250 Sheets',
    description: 'Tissue lembut, tidak mudah robek',
    price: 13500,
    costPrice: 11000,
    category: 'produk-rumah-tangga',
    image: '/images/products/tissue.jpg',
    stock: 95,
    unit: 'box',
    isAvailable: true,
    rating: 4.6,
    reviews: 134
  },
  {
    id: 'pembersih-lantai-1l',
    name: 'Pembersih Lantai 1L',
    description: 'Pembersih lantai, wangi segar',
    price: 18500,
    costPrice: 15500,
    category: 'produk-rumah-tangga',
    image: '/images/products/pembersih-lantai.jpg',
    stock: 45,
    unit: 'botol',
    isAvailable: true,
    rating: 4.5,
    reviews: 89
  },
  // Perawatan Diri
  {
    id: 'sabun-mandi-3pcs',
    name: 'Sabun Mandi 3pcs',
    description: 'Sabun mandi wangi tahan lama',
    price: 16500,
    costPrice: 14000,
    category: 'perawatan-diri',
    image: '/images/products/sabun-mandi.jpg',
    stock: 75,
    unit: 'pack',
    isAvailable: true,
    isBestseller: true,
    rating: 4.6,
    reviews: 145
  },
  // Peralatan Rumah Tangga
  {
    id: 'lampu-led-9w',
    name: 'Lampu LED 9W',
    description: 'Lampu LED hemat energi, terang tahan lama',
    price: 25000,
    costPrice: 20000,
    category: 'peralatan-rumah-tangga',
    image: '/images/products/lampu-led.jpg',
    stock: 40,
    unit: 'pcs',
    isAvailable: true,
    rating: 4.8,
    reviews: 76
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Rina',
    role: 'Ibu Rumah Tangga',
    avatar: '/images/avatars/rina.jpg',
    quote: 'Pesen dari pagi, siang sudah sampai. Harganya pas di kantong. ULFAMART paling ngerti kebutuhan keluarga!',
    rating: 5
  },
  {
    id: '2',
    name: 'Pak Tono',
    role: 'Warga Sekitar',
    avatar: '/images/avatars/pak-tono.jpg',
    quote: 'Stoknya lengkap, jadi nggak perlu bolak-balik warung. Pelayanannya juga ramah banget.',
    rating: 5
  },
  {
    id: '3',
    name: 'Mbak Siti',
    role: 'Pedagang Kecil',
    avatar: '/images/avatars/mbak-siti.jpg',
    quote: 'Saya langganan beli sembako di sini untuk jualan lagi. Harganya kompetitif dan stok selalu ada.',
    rating: 5
  }
];

export const bundles: Bundle[] = [
  {
    id: 'paket-sembako-mingguan',
    name: 'Paket Sembako Mingguan',
    description: 'Paket lengkap untuk kebutuhan seminggu',
    image: '/images/bundles/paket-sembako.jpg',
    products: [
      { productId: 'beras-premium-5kg', quantity: 1 },
      { productId: 'minyak-goreng-2l', quantity: 1 },
      { productId: 'gula-pasir-1kg', quantity: 1 },
      { productId: 'kopi-sachet-10pcs', quantity: 1 }
    ],
    originalPrice: 136500,
    bundlePrice: 125000,
    savings: 11500,
    isActive: true
  },
  {
    id: 'paket-bulanan',
    name: 'Paket Bulanan',
    description: 'Paket hemat untuk kebutuhan sebulan',
    image: '/images/bundles/paket-bulanan.jpg',
    products: [
      { productId: 'beras-premium-5kg', quantity: 2 },
      { productId: 'minyak-goreng-2l', quantity: 2 },
      { productId: 'gula-pasir-1kg', quantity: 2 },
      { productId: 'tepung-terigu-1kg', quantity: 1 },
      { productId: 'mie-instan-5pcs', quantity: 2 }
    ],
    originalPrice: 312500,
    bundlePrice: 285000,
    savings: 27500,
    isActive: true
  }
];

export const promos: Promo[] = [
  {
    id: 'promo-new-member',
    code: 'MEMBERBARU',
    name: 'Diskon Member Baru',
    description: 'Diskon 10% untuk pembelian pertama',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 50000,
    maxDiscount: 20000,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    isActive: true
  },
  {
    id: 'promo-weekend',
    code: 'WEEKEND',
    name: 'Promo Weekend',
    description: 'Diskon Rp 10.000 untuk pembelian di akhir pekan',
    discountType: 'fixed',
    discountValue: 10000,
    minPurchase: 100000,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    isActive: true
  }
];

export const shippingOptions = [
  {
    id: 'same-day',
    name: 'Pengiriman Instant',
    description: 'Diantar di hari yang sama',
    baseCost: 15000,
    costPerKm: 2000,
    estimatedTime: '2-4 jam'
  },
  {
    id: 'next-day',
    name: 'Pengiriman Besok',
    description: 'Diantar keesokan harinya',
    baseCost: 8000,
    costPerKm: 1000,
    estimatedTime: '1 hari'
  },
  {
    id: 'pickup',
    name: 'Ambil di Toko',
    description: 'Ambil pesanan langsung di warung',
    baseCost: 0,
    estimatedTime: 'Sesuai jam buka'
  }
];

export const paymentMethods = [
  {
    id: 'transfer',
    name: 'Transfer Bank',
    description: 'Transfer ke rekening BCA/BRI/Mandiri',
    icon: 'bank',
    isActive: true
  },
  {
    id: 'cod',
    name: 'Bayar di Tempat',
    description: 'Bayar saat barang diterima',
    icon: 'cash',
    isActive: true
  },
  {
    id: 'ewallet',
    name: 'E-Wallet',
    description: 'GoPay, OVO, DANA, LinkAja',
    icon: 'wallet',
    isActive: true
  },
  {
    id: 'qris',
    name: 'QRIS',
    description: 'Scan QRIS untuk pembayaran',
    icon: 'qrcode',
    isActive: true
  }
];

export const expenseCategories: ExpenseCategory[] = [
  {
    id: 'inventory',
    name: 'Pembelian Stok',
    description: 'Pembelian barang untuk stok toko'
  },
  {
    id: 'operational',
    name: 'Operasional',
    description: 'Biaya operasional toko harian'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Biaya promosi dan marketing'
  },
  {
    id: 'other',
    name: 'Lainnya',
    description: 'Pengeluaran lainnya'
  }
];

// Initial expenses data
export const initialExpenses: Expense[] = [
  {
    id: 'exp-001',
    date: '2024-01-15',
    category: 'inventory',
    description: 'Restock beras premium',
    amount: 3250000,
    notes: '50 karung beras premium',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'exp-002',
    date: '2024-01-15',
    category: 'inventory',
    description: 'Restock minyak goreng',
    amount: 1280000,
    notes: '80 botol minyak 1L',
    createdAt: '2024-01-15T08:30:00Z'
  },
  {
    id: 'exp-003',
    date: '2024-01-16',
    category: 'operational',
    description: 'Biaya listrik Januari',
    amount: 850000,
    notes: 'Tagihan listrik bulanan',
    createdAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'exp-004',
    date: '2024-01-18',
    category: 'marketing',
    description: 'Cetak spanduk promo',
    amount: 250000,
    notes: 'Spanduk paket hemat',
    createdAt: '2024-01-18T14:00:00Z'
  },
  {
    id: 'exp-005',
    date: '2024-01-20',
    category: 'inventory',
    description: 'Restock sabun dan deterjen',
    amount: 950000,
    notes: 'Berbagai merek sabun dan deterjen',
    createdAt: '2024-01-20T09:00:00Z'
  }
];

// Helper functions
export const getBestsellers = () => products.filter(p => p.isBestseller);

export const getProductsByCategory = (categoryId: string) => 
  products.filter(p => p.category === categoryId);

export const getProductById = (id: string) => 
  products.find(p => p.id === id);

export const getRelatedProducts = (productId: string, limit = 4) => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => p.category === product.category && p.id !== productId)
    .slice(0, limit);
};

export const searchProducts = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
};

// Generate unique product ID
export const generateProductId = (name: string): string => {
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30);
  return `${slug}-${Date.now().toString(36).slice(-4)}`;
};

// Generate unique expense ID
export const generateExpenseId = (): string => {
  return `exp-${Date.now().toString(36).slice(-6)}`;
};
