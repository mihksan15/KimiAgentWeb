import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/context/OrderContext';
import { useSettings } from '@/context/SettingsContext';

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getOrderById } = useOrder();
  const { settings, getWhatsAppLink } = useSettings();
  
  const order = orderId ? getOrderById(orderId) : undefined;

  useEffect(() => {
    // Send WhatsApp message
    if (order && order.paymentMethod !== 'qris') {
      const message = `Halo ${settings.storeName}! Saya sudah memesan:\n\n` +
        `Order ID: ${order.id}\n` +
        `Nama: ${order.customerName}\n` +
        `Total: Rp${order.finalAmount.toLocaleString('id-ID')}\n\n` +
        `Mohon konfirmasinya ya!`;
      
      const whatsappUrl = getWhatsAppLink(message);
      
      // Open WhatsApp in new tab after 2 seconds
      const timer = setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [order, settings.storeName, getWhatsAppLink]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F7F2E9] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['Fredoka'] text-2xl text-[#2B2B2B] mb-4">
            Pesanan tidak ditemukan
          </h1>
          <Link to="/">
            <Button className="bg-[#D64A58] hover:bg-[#c43d4b] rounded-full">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F2E9] pt-20 lg:pt-24">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-[28px] border border-[#2B2B2B]/10 p-8 lg:p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <h1 className="font-['Fredoka'] text-2xl lg:text-3xl font-semibold text-[#2B2B2B] mb-2">
              Pesanan Berhasil!
            </h1>
            <p className="text-[#6E6E6E] mb-6">
              Terima kasih telah berbelanja di {settings.storeName}
            </p>

            <div className="bg-[#F7F2E9] rounded-2xl p-6 mb-8 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#6E6E6E]">Order ID</p>
                  <p className="font-semibold">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6E6E6E]">Total</p>
                  <p className="font-semibold text-[#D64A58]">
                    Rp{order.finalAmount.toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#6E6E6E]">Metode Pembayaran</p>
                  <p className="font-semibold">
                    {order.paymentMethod === 'transfer' && 'Transfer Bank'}
                    {order.paymentMethod === 'cod' && 'Bayar di Tempat'}
                    {order.paymentMethod === 'ewallet' && 'E-Wallet'}
                    {order.paymentMethod === 'qris' && 'QRIS'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#6E6E6E]">Status</p>
                  <p className="font-semibold text-amber-500">Menunggu Konfirmasi</p>
                </div>
              </div>
            </div>

            {order.paymentMethod !== 'qris' && (
              <p className="text-sm text-[#6E6E6E] mb-6">
                Anda akan diarahkan ke WhatsApp untuk konfirmasi pesanan.
                Jika tidak terbuka otomatis, silakan hubungi kami di{' '}
                <a
                  href={getWhatsAppLink(`Halo ${settings.storeName}! Saya sudah memesan dengan Order ID: ${order.id}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D64A58] underline"
                >
                  {settings.whatsappNumber}
                </a>
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/katalog">
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg border-[3px] border-[#2B2B2B]/10"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Lanjut Belanja
                </Button>
              </Link>
              {order.paymentMethod !== 'qris' && (
                <a
                  href={getWhatsAppLink(`Halo ${settings.storeName}! Saya sudah memesan dengan Order ID: ${order.id}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#D64A58] hover:bg-[#c43d4b] rounded-full px-8 py-6 text-lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat WhatsApp
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
