import { Link } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { state, updateQuantity, removeFromCart } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="w-5 h-5" />
          {state.totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D64A58] text-white text-xs rounded-full flex items-center justify-center">
              {state.totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg bg-[#F7F2E9] flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-['Fredoka'] text-2xl flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            Keranjang Belanja
          </SheetTitle>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-[#2B2B2B]/5 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-[#6E6E6E]" />
            </div>
            <h3 className="font-['Fredoka'] text-xl text-[#2B2B2B] mb-2">
              Keranjang Kosong
            </h3>
            <p className="text-[#6E6E6E] mb-6">
              Yuk, tambahkan produk ke keranjang!
            </p>
            <Button
              onClick={() => setOpen(false)}
              className="bg-[#D64A58] hover:bg-[#c43d4b] rounded-full"
            >
              Lihat Katalog
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {state.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-2xl p-4 border border-[#2B2B2B]/10"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#2B2B2B] line-clamp-2">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-[#6E6E6E]">
                          {item.product.unit}
                        </p>
                        <p className="text-[#D64A58] font-semibold mt-1">
                          Rp{item.product.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#6E6E6E] hover:text-[#D64A58] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-[#F7F2E9] flex items-center justify-center hover:bg-[#E6F3F3] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-[#F7F2E9] flex items-center justify-center hover:bg-[#E6F3F3] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-semibold text-[#2B2B2B]">
                        Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-[#2B2B2B]/10 pt-4 mt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E6E6E]">Subtotal</span>
                  <span>Rp{state.totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E6E6E]">Ongkir</span>
                  <span className="text-[#6E6E6E]">Dihitung saat checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-[#D64A58]">
                    Rp{state.totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <Link to="/checkout" onClick={() => setOpen(false)}>
                <Button className="w-full bg-[#D64A58] hover:bg-[#c43d4b] rounded-full py-6 text-lg">
                  Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
