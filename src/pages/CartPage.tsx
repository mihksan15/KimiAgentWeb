import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

export function CartPage() {
  const navigate = useNavigate();
  const { state, updateQuantity, removeFromCart } = useCart();

  if (state.items.length === 0) {
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

          <div className="bg-white rounded-[28px] border border-[#2B2B2B]/10 p-8 lg:p-16 text-center">
            <div className="w-24 h-24 bg-[#F7F2E9] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-[#6E6E6E]" />
            </div>
            <h1 className="font-['Fredoka'] text-2xl lg:text-3xl text-[#2B2B2B] mb-4">
              Keranjang Belanja Kosong
            </h1>
            <p className="text-[#6E6E6E] mb-8 max-w-md mx-auto">
              Yuk, tambahkan produk ke keranjang! Kami punya berbagai kebutuhan harian dengan harga bersahabat.
            </p>
            <Link to="/katalog">
              <Button className="bg-[#D64A58] hover:bg-[#c43d4b] rounded-full px-8 py-6 text-lg">
                Lihat Katalog
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

        <h1 className="font-['Fredoka'] text-2xl lg:text-3xl font-semibold text-[#2B2B2B] mb-8">
          Keranjang Belanja ({state.totalItems} item)
        </h1>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-[24px] p-4 lg:p-6 border border-[#2B2B2B]/10"
              >
                <div className="flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-2xl"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          to={`/produk/${item.product.id}`}
                          className="font-semibold text-[#2B2B2B] hover:text-[#D64A58] transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-[#6E6E6E] mt-1">
                          {item.product.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#6E6E6E] hover:text-[#D64A58] transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-9 h-9 rounded-full bg-[#F7F2E9] flex items-center justify-center hover:bg-[#E6F3F3] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-9 h-9 rounded-full bg-[#F7F2E9] flex items-center justify-center hover:bg-[#E6F3F3] transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#6E6E6E]">
                          Rp{item.product.price.toLocaleString('id-ID')} x {item.quantity}
                        </p>
                        <p className="text-lg font-bold text-[#D64A58]">
                          Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-[24px] p-6 border border-[#2B2B2B]/10">
              <h2 className="font-['Fredoka'] text-xl font-semibold text-[#2B2B2B] mb-6">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E6E6E]">Subtotal ({state.totalItems} item)</span>
                  <span>Rp{state.totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E6E6E]">Ongkir</span>
                  <span className="text-[#6E6E6E]">Dihitung saat checkout</span>
                </div>
              </div>

              <div className="border-t border-[#2B2B2B]/10 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#2B2B2B]">Total</span>
                  <span className="text-2xl font-bold text-[#D64A58]">
                    Rp{state.totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#D64A58] hover:bg-[#c43d4b] rounded-full py-6 text-lg font-medium"
              >
                Lanjutkan ke Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#6E6E6E]">
                <Package className="w-4 h-4" />
                <span>Stok terjamin & dikemas rapi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
