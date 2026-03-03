import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useProduct } from '@/context/ProductContext';
import { ProductCard } from '@/components/ui-custom/ProductCard';

export function WishlistPage() {
  const { user } = useAuth();
  const { products } = useProduct();

  const wishlistProducts = user?.wishlist
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-[#F7F2E9] pt-20 lg:pt-24">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <Link
          to="/katalog"
          className="inline-flex items-center text-[#6E6E6E] hover:text-[#D64A58] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Katalog
        </Link>

        <h1 className="font-['Fredoka'] text-2xl lg:text-3xl font-semibold text-[#2B2B2B] mb-2">
          Wishlist Saya
        </h1>
        <p className="text-[#6E6E6E] mb-8">
          {wishlistProducts.length} produk tersimpan
        </p>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {wishlistProducts.filter(Boolean).map((product) => (
              product && <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[28px] border border-[#2B2B2B]/10 p-8 lg:p-16 text-center">
            <div className="w-24 h-24 bg-[#F7F2E9] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-[#6E6E6E]" />
            </div>
            <h2 className="font-['Fredoka'] text-xl lg:text-2xl text-[#2B2B2B] mb-4">
              Wishlist Kosong
            </h2>
            <p className="text-[#6E6E6E] mb-8 max-w-md mx-auto">
              Simpan produk favorit Anda untuk dibeli nanti.
            </p>
            <Link to="/katalog">
              <Button className="bg-[#D64A58] hover:bg-[#c43d4b] rounded-full px-8 py-6 text-lg">
                Jelajahi Katalog
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
