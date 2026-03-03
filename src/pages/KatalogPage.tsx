import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/components/ui-custom/ProductCard';
import { categories } from '@/data/products';
import { useProduct } from '@/context/ProductContext';

const sortOptions = [
  { value: 'popular', label: 'Paling Populer' },
  { value: 'price-asc', label: 'Harga: Rendah ke Tinggi' },
  { value: 'price-desc', label: 'Harga: Tinggi ke Rendah' },
  { value: 'name-asc', label: 'Nama: A-Z' },
  { value: 'name-desc', label: 'Nama: Z-A' },
];

export function KatalogPage() {
  const [searchParams] = useSearchParams();
  const { products } = useProduct();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isPromoOnly, setIsPromoOnly] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      setCategoryFilter(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search by query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Filter by stock
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Filter by promo
    if (isPromoOnly) {
      result = result.filter(p => p.isPromo || p.discount);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'popular':
        result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
    }

    return result;
  }, [products, searchQuery, categoryFilter, sortBy, inStockOnly, isPromoOnly]);

  const hasActiveFilters = searchQuery || categoryFilter || inStockOnly || isPromoOnly;

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter(undefined);
    setInStockOnly(false);
    setIsPromoOnly(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F2E9] pt-20 lg:pt-24">
      {/* Header */}
      <div className="bg-white border-b border-[#2B2B2B]/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8">
          <h1 className="font-['Fredoka'] text-3xl lg:text-4xl font-semibold text-[#2B2B2B] mb-4">
            Katalog Produk
          </h1>
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6E6E]" />
              <Input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full border-[3px] border-[#2B2B2B]/10"
              />
            </div>
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full px-6 py-6 border-[3px] border-[#2B2B2B]/10"
                >
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filter
                  {hasActiveFilters && (
                    <Badge className="ml-2 bg-[#D64A58]">!</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md bg-[#F7F2E9]">
                <SheetHeader>
                  <SheetTitle className="font-['Fredoka'] text-2xl">Filter Produk</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-semibold text-[#2B2B2B] mb-3">Kategori</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setCategoryFilter(undefined)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                          !categoryFilter
                            ? 'bg-[#D64A58] text-white'
                            : 'bg-white hover:bg-[#E6F3F3]'
                        }`}
                      >
                        Semua Kategori
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setCategoryFilter(cat.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                            categoryFilter === cat.id
                              ? 'bg-[#D64A58] text-white'
                              : 'bg-white hover:bg-[#E6F3F3]'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div>
                    <h4 className="font-semibold text-[#2B2B2B] mb-3">Opsi</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={inStockOnly}
                          onCheckedChange={(v) => setInStockOnly(v as boolean)}
                        />
                        <span>Hanya tersedia</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={isPromoOnly}
                          onCheckedChange={(v) => setIsPromoOnly(v as boolean)}
                        />
                        <span>Hanya promo</span>
                      </label>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="w-full rounded-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Hapus Filter
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-2xl p-5 border border-[#2B2B2B]/10">
                <h4 className="font-semibold text-[#2B2B2B] mb-4">Kategori</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setCategoryFilter(undefined)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !categoryFilter
                        ? 'bg-[#D64A58] text-white'
                        : 'hover:bg-[#F7F2E9]'
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        categoryFilter === cat.id
                          ? 'bg-[#D64A58] text-white'
                          : 'hover:bg-[#F7F2E9]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="bg-white rounded-2xl p-5 border border-[#2B2B2B]/10">
                <h4 className="font-semibold text-[#2B2B2B] mb-4">Opsi</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer text-sm">
                    <Checkbox
                      checked={inStockOnly}
                      onCheckedChange={(v) => setInStockOnly(v as boolean)}
                    />
                    <span>Hanya tersedia</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-sm">
                    <Checkbox
                      checked={isPromoOnly}
                      onCheckedChange={(v) => setIsPromoOnly(v as boolean)}
                    />
                    <span>Hanya promo</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full rounded-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Hapus Filter
                </Button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#6E6E6E]">
                Menampilkan <span className="font-semibold text-[#2B2B2B]">{filteredProducts.length}</span> produk
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-[#2B2B2B]/10 rounded-full px-4 py-2 pr-10 text-sm cursor-pointer hover:border-[#D64A58] transition-colors"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6E6E] pointer-events-none" />
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-[#2B2B2B]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-[#6E6E6E]" />
                </div>
                <h3 className="font-['Fredoka'] text-xl text-[#2B2B2B] mb-2">
                  Produk tidak ditemukan
                </h3>
                <p className="text-[#6E6E6E] mb-4">
                  Coba ubah kata kunci atau filter yang digunakan
                </p>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="rounded-full"
                >
                  Hapus Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
