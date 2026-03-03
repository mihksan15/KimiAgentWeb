import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Heart, Share2, Check, ShoppingCart, Star, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useProduct } from '@/context/ProductContext';
import { ProductCard } from '@/components/ui-custom/ProductCard';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { products, getProductById } = useProduct();

  const product = id ? getProductById(id) : undefined;
  
  // Get related products
  const relatedProducts = product 
    ? products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];
    
  const inWishlist = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F2E9] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['Fredoka'] text-2xl text-[#2B2B2B] mb-4">
            Produk tidak ditemukan
          </h1>
          <Link to="/katalog">
            <Button className="bg-[#D64A58] hover:bg-[#c43d4b] rounded-full">
              Kembali ke Katalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2E9] pt-20 lg:pt-24">
      {/* Breadcrumb */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
        <Link
          to="/katalog"
          className="inline-flex items-center text-[#6E6E6E] hover:text-[#D64A58] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Katalog
        </Link>
      </div>

      {/* Product Detail */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-4 lg:py-8">
        <div className="bg-white rounded-[28px] border border-[#2B2B2B]/10 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative aspect-square lg:aspect-auto">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isBestseller && (
                  <Badge className="bg-amber-500 text-white">Bestseller</Badge>
                )}
                {product.discount && (
                  <Badge className="bg-[#D64A58] text-white">-{product.discount}%</Badge>
                )}
              </div>

              {/* Stock Badge */}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge className="absolute top-4 right-4 bg-amber-500 text-white">
                  Stok menipis: {product.stock} {product.unit}
                </Badge>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge className="bg-gray-500 text-white text-lg px-4 py-2">
                    Stok Habis
                  </Badge>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 lg:p-10 flex flex-col">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-[#6E6E6E] uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                    <h1 className="font-['Fredoka'] text-2xl lg:text-3xl font-semibold text-[#2B2B2B]">
                      {product.name}
                    </h1>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        inWishlist
                          ? 'bg-[#D64A58] text-white'
                          : 'bg-[#F7F2E9] text-[#2B2B2B] hover:bg-[#E6F3F3]'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-[#F7F2E9] flex items-center justify-center hover:bg-[#E6F3F3] transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (product.rating || 0)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[#6E6E6E]">
                    {product.rating} ({product.reviews} ulasan)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {product.originalPrice && (
                    <p className="text-lg text-[#6E6E6E] line-through">
                      Rp{product.originalPrice.toLocaleString('id-ID')}
                    </p>
                  )}
                  <p className="text-3xl lg:text-4xl font-bold text-[#D64A58]">
                    Rp{product.price.toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-[#6E6E6E]">/{product.unit}</p>
                </div>

                {/* Description */}
                <p className="text-[#6E6E6E] mb-6">
                  {product.description}
                </p>

                {/* Stock Info */}
                <div className="flex items-center gap-2 mb-6 p-4 bg-[#F7F2E9] rounded-xl">
                  <Package className="w-5 h-5 text-[#D64A58]" />
                  <span className="text-sm">
                    Stok tersedia: <span className="font-semibold">{product.stock} {product.unit}</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#6E6E6E]">Jumlah:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-full bg-[#F7F2E9] flex items-center justify-center hover:bg-[#E6F3F3] transition-colors disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 rounded-full bg-[#F7F2E9] flex items-center justify-center hover:bg-[#E6F3F3] transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`flex-1 rounded-full py-6 text-lg font-medium transition-all ${
                      added
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-[#D64A58] hover:bg-[#c43d4b]'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Ditambahkan
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Tambah ke Keranjang
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    variant="outline"
                    className="flex-1 rounded-full py-6 text-lg font-medium border-[3px] border-[#2B2B2B]/10 hover:bg-[#2B2B2B]/5"
                  >
                    Beli Sekarang
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <h2 className="font-['Fredoka'] text-2xl lg:text-3xl font-semibold text-[#2B2B2B] mb-6">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
