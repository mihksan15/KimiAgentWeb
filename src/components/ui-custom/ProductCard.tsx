import { Link } from 'react-router-dom';
import { Plus, Check, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  showAddButton?: boolean;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, showAddButton = true, variant = 'default' }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  if (variant === 'compact') {
    return (
      <Link to={`/produk/${product.id}`} className="group block">
        <div className="bg-white rounded-2xl border-2 border-[#2B2B2B]/10 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.discount && (
              <Badge className="absolute top-2 left-2 bg-[#D64A58] text-white">
                -{product.discount}%
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge className="absolute top-2 right-2 bg-amber-500 text-white">
                Stok menipis
              </Badge>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge className="bg-gray-500 text-white">Habis</Badge>
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm text-[#2B2B2B] line-clamp-1">{product.name}</h3>
            <p className="text-[#D64A58] font-semibold text-sm mt-1">
              Rp{product.price.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/produk/${product.id}`} className="group block">
      <div className="bg-white rounded-[28px] border-[3px] border-[#2B2B2B]/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isBestseller && (
              <Badge className="bg-amber-500 text-white text-xs">
                Bestseller
              </Badge>
            )}
            {product.discount && (
              <Badge className="bg-[#D64A58] text-white text-xs">
                -{product.discount}%
              </Badge>
            )}
          </div>

          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge className="absolute top-3 right-3 bg-amber-500 text-white text-xs">
              Stok menipis
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge className="bg-gray-500 text-white">Stok Habis</Badge>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              inWishlist
                ? 'bg-[#D64A58] text-white'
                : 'bg-white/90 text-[#2B2B2B] hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <p className="text-xs text-[#6E6E6E] uppercase tracking-wider mb-1">
              {product.category}
            </p>
            <h3 className="font-['Fredoka'] text-lg font-medium text-[#2B2B2B] line-clamp-2 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-[#6E6E6E] line-clamp-1 mb-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-end justify-between mt-3">
            <div>
              {product.originalPrice && (
                <p className="text-sm text-[#6E6E6E] line-through">
                  Rp{product.originalPrice.toLocaleString('id-ID')}
                </p>
              )}
              <p className="text-xl font-bold text-[#D64A58]">
                Rp{product.price.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-[#6E6E6E]">/{product.unit}</p>
            </div>

            {showAddButton && product.stock > 0 && (
              <Button
                onClick={handleAddToCart}
                size="sm"
                className={`rounded-full transition-all ${
                  inCart
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-[#D64A58] hover:bg-[#c43d4b]'
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Ditambahkan
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1" />
                    Keranjang
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
