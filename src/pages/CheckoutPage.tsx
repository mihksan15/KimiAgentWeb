import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, CreditCard, MessageCircle, QrCode, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import { shippingOptions, paymentMethods } from '@/data/products';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
  const { createOrder } = useOrder();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRIS, setShowQRIS] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [shippingMethod, setShippingMethod] = useState('same-day');
  const [paymentMethod, setPaymentMethod] = useState('transfer');

  // Calculate shipping cost (simplified)
  const shippingCost = shippingOptions.find(s => s.id === shippingMethod)?.baseCost || 0;
  const finalTotal = cartState.totalPrice + shippingCost;

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F2E9] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['Fredoka'] text-2xl text-[#2B2B2B] mb-4">
            Keranjang Kosong
          </h1>
          <Link to="/katalog">
            <Button className="bg-[#D64A58] hover:bg-[#c43d4b] rounded-full">
              Lihat Katalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Mohon lengkapi data pengiriman');
      return;
    }

    setIsSubmitting(true);

    // Create order
    const order = createOrder({
      customerName: formData.name,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      items: cartState.items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity
      })),
      totalAmount: cartState.totalPrice,
      shippingCost,
      finalAmount: finalTotal,
      paymentMethod: paymentMethod as any,
      shippingMethod: shippingMethod as any,
      status: 'pending',
      notes: formData.notes
    });

    setOrderCreated(order);

    // If QRIS, show QR code dialog
    if (paymentMethod === 'qris') {
      setShowQRIS(true);
      setIsSubmitting(false);
    } else {
      // Clear cart and redirect
      clearCart();
      navigate(`/pesanan-sukses?orderId=${order.id}`);
    }
  };

  const handleQRISComplete = () => {
    clearCart();
    navigate(`/pesanan-sukses?orderId=${orderCreated.id}`);
  };

  // Get payment method icon
  const getPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'qrcode':
        return <QrCode className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2E9] pt-20 lg:pt-24">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <Link
          to="/keranjang"
          className="inline-flex items-center text-[#6E6E6E] hover:text-[#D64A58] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Keranjang
        </Link>

        <h1 className="font-['Fredoka'] text-2xl lg:text-3xl font-semibold text-[#2B2B2B] mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-[24px] p-6 border border-[#2B2B2B]/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#E6F3F3] rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#D64A58]" />
                </div>
                <h2 className="font-['Fredoka'] text-xl font-semibold text-[#2B2B2B]">
                  Data Pengiriman
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama lengkap"
                      className="mt-2 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0812-3456-7890"
                      className="mt-2 rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Jl. Mawar No. 12, RT.03/RW.05"
                    className="mt-2 rounded-xl min-h-[100px]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Catatan (opsional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Contoh: Depan rumah warna biru"
                    className="mt-2 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-[24px] p-6 border border-[#2B2B2B]/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#E6F3F3] rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#D64A58]" />
                </div>
                <h2 className="font-['Fredoka'] text-xl font-semibold text-[#2B2B2B]">
                  Metode Pengiriman
                </h2>
              </div>

              <RadioGroup
                value={shippingMethod}
                onValueChange={setShippingMethod}
                className="space-y-3"
              >
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      shippingMethod === option.id
                        ? 'border-[#D64A58] bg-[#D64A58]/5'
                        : 'border-[#2B2B2B]/10 hover:border-[#2B2B2B]/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <div>
                        <p className="font-medium text-[#2B2B2B]">{option.name}</p>
                        <p className="text-sm text-[#6E6E6E]">{option.description}</p>
                        <p className="text-xs text-[#6E6E6E]">Estimasi: {option.estimatedTime}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#D64A58]">
                      {option.baseCost === 0 ? 'Gratis' : `Rp${option.baseCost.toLocaleString('id-ID')}`}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-[24px] p-6 border border-[#2B2B2B]/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#E6F3F3] rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#D64A58]" />
                </div>
                <h2 className="font-['Fredoka'] text-xl font-semibold text-[#2B2B2B]">
                  Metode Pembayaran
                </h2>
              </div>

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-[#D64A58] bg-[#D64A58]/5'
                        : 'border-[#2B2B2B]/10 hover:border-[#2B2B2B]/20'
                    }`}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F7F2E9] rounded-lg flex items-center justify-center">
                        {getPaymentIcon(method.icon)}
                      </div>
                      <div>
                        <p className="font-medium text-[#2B2B2B]">{method.name}</p>
                        <p className="text-sm text-[#6E6E6E]">{method.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-[24px] p-6 border border-[#2B2B2B]/10">
              <h2 className="font-['Fredoka'] text-xl font-semibold text-[#2B2B2B] mb-6">
                Ringkasan Pesanan
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {cartState.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-[#6E6E6E]">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>
                      Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E6E6E]">Subtotal</span>
                  <span>Rp{cartState.totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E6E6E]">Ongkir</span>
                  <span>
                    {shippingCost === 0 ? 'Gratis' : `Rp${shippingCost.toLocaleString('id-ID')}`}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-[#2B2B2B]">Total</span>
                <span className="text-2xl font-bold text-[#D64A58]">
                  Rp{finalTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D64A58] hover:bg-[#c43d4b] rounded-full py-6 text-lg font-medium"
              >
                {isSubmitting ? (
                  'Memproses...'
                ) : paymentMethod === 'qris' ? (
                  <>
                    <QrCode className="w-5 h-5 mr-2" />
                    Bayar dengan QRIS
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Pesan via WhatsApp
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-[#6E6E6E] mt-4">
                {paymentMethod === 'qris' 
                  ? 'Scan QRIS untuk menyelesaikan pembayaran'
                  : 'Pesanan akan dikonfirmasi melalui WhatsApp'}
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* QRIS Dialog */}
      <Dialog open={showQRIS} onOpenChange={setShowQRIS}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-['Fredoka'] text-xl text-center">
              Scan QRIS untuk Pembayaran
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-xl border-2 border-[#2B2B2B]/10">
              {/* QR Code Placeholder */}
              <div className="aspect-square bg-[#F7F2E9] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-32 h-32 mx-auto text-[#2B2B2B]" />
                  <p className="text-xs text-[#6E6E6E] mt-2">QRIS ULFAMART</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-[#6E6E6E]">
                Total Pembayaran
              </p>
              <p className="text-2xl font-bold text-[#D64A58]">
                Rp{finalTotal.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
              <p>Scan kode QR di atas menggunakan aplikasi e-wallet atau mobile banking Anda</p>
            </div>

            <Button 
              onClick={handleQRISComplete}
              className="w-full bg-green-500 hover:bg-green-600 rounded-full"
            >
              <Check className="w-4 h-4 mr-2" />
              Saya Sudah Membayar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
