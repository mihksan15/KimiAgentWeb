import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, RotateCcw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrder } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function OrdersPage() {
  const { user } = useAuth();
  const { orders, getOrderById, reorder } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [reorderSuccess, setReorderSuccess] = useState(false);

  const userOrders = orders.filter(order => 
    user?.orderHistory.includes(order.id)
  );

  const pendingOrders = userOrders.filter(o => o.status === 'pending');
  const processingOrders = userOrders.filter(o => 
    ['confirmed', 'processing', 'shipped'].includes(o.status)
  );
  const completedOrders = userOrders.filter(o => o.status === 'delivered');

  const handleReorder = (orderId: string) => {
    const newOrder = reorder(orderId);
    if (newOrder) {
      setReorderSuccess(true);
      setTimeout(() => setReorderSuccess(false), 3000);
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

  const selectedOrderData = selectedOrder ? getOrderById(selectedOrder) : null;

  return (
    <div className="min-h-screen bg-[#F7F2E9] pt-20 lg:pt-24">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-[#6E6E6E] hover:text-[#D64A58] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>

        <h1 className="font-['Fredoka'] text-2xl lg:text-3xl font-semibold text-[#2B2B2B] mb-8">
          Pesanan Saya
        </h1>

        {reorderSuccess && (
          <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6">
            Pesanan berhasil dibuat ulang! Silakan checkout.
          </div>
        )}

        {userOrders.length > 0 ? (
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                Semua ({userOrders.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Menunggu ({pendingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Diproses ({processingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Selesai ({completedOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {userOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetail={() => setSelectedOrder(order.id)}
                  onReorder={() => handleReorder(order.id)}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetail={() => setSelectedOrder(order.id)}
                  onReorder={() => handleReorder(order.id)}
                  getStatusBadge={getStatusBadge}
                />
              ))}
              {pendingOrders.length === 0 && (
                <p className="text-[#6E6E6E] text-center py-8">
                  Tidak ada pesanan menunggu
                </p>
              )}
            </TabsContent>

            <TabsContent value="processing" className="space-y-4">
              {processingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetail={() => setSelectedOrder(order.id)}
                  onReorder={() => handleReorder(order.id)}
                  getStatusBadge={getStatusBadge}
                />
              ))}
              {processingOrders.length === 0 && (
                <p className="text-[#6E6E6E] text-center py-8">
                  Tidak ada pesanan diproses
                </p>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetail={() => setSelectedOrder(order.id)}
                  onReorder={() => handleReorder(order.id)}
                  getStatusBadge={getStatusBadge}
                  showReorder
                />
              ))}
              {completedOrders.length === 0 && (
                <p className="text-[#6E6E6E] text-center py-8">
                  Belum ada pesanan selesai
                </p>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="bg-white rounded-[28px] border border-[#2B2B2B]/10 p-8 lg:p-16 text-center">
            <div className="w-24 h-24 bg-[#F7F2E9] rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-[#6E6E6E]" />
            </div>
            <h2 className="font-['Fredoka'] text-xl lg:text-2xl text-[#2B2B2B] mb-4">
              Belum Ada Pesanan
            </h2>
            <p className="text-[#6E6E6E] mb-8 max-w-md mx-auto">
              Yuk, mulai berbelanja di ULFAMART!
            </p>
            <Link to="/katalog">
              <Button className="bg-[#D64A58] hover:bg-[#c43d4b] rounded-full px-8 py-6 text-lg">
                Lihat Katalog
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Fredoka'] text-xl">
              Detail Pesanan
            </DialogTitle>
            <DialogDescription>
              {selectedOrderData?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrderData && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#6E6E6E]">Status</span>
                {getStatusBadge(selectedOrderData.status)}
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium mb-2">Item Pesanan</h4>
                <div className="space-y-2">
                  {selectedOrderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>Rp{item.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E6E6E]">Subtotal</span>
                  <span>Rp{selectedOrderData.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E6E6E]">Ongkir</span>
                  <span>Rp{selectedOrderData.shippingCost.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-[#D64A58]">
                    Rp{selectedOrderData.finalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium mb-2">Informasi Pengiriman</h4>
                <p className="text-sm text-[#6E6E6E]">{selectedOrderData.customerName}</p>
                <p className="text-sm text-[#6E6E6E]">{selectedOrderData.customerPhone}</p>
                <p className="text-sm text-[#6E6E6E]">{selectedOrderData.customerAddress}</p>
              </div>

              {selectedOrderData.notes && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium mb-2">Catatan</h4>
                  <p className="text-sm text-[#6E6E6E]">{selectedOrderData.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface OrderCardProps {
  order: any;
  onViewDetail: () => void;
  onReorder: () => void;
  getStatusBadge: (status: string) => React.ReactNode;
  showReorder?: boolean;
}

function OrderCard({ order, onViewDetail, onReorder, getStatusBadge, showReorder }: OrderCardProps) {
  return (
    <div className="bg-white rounded-[24px] p-5 border border-[#2B2B2B]/10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-semibold text-[#2B2B2B]">{order.id}</p>
          <p className="text-sm text-[#6E6E6E]">
            {new Date(order.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
        {getStatusBadge(order.status)}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-[#F7F2E9] rounded-xl flex items-center justify-center">
          <Package className="w-6 h-6 text-[#D64A58]" />
        </div>
        <div>
          <p className="text-sm text-[#6E6E6E]">
            {order.items.length} item
          </p>
          <p className="font-semibold text-[#D64A58]">
            Rp{order.finalAmount.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onViewDetail}
          className="flex-1 rounded-full"
        >
          Lihat Detail
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
        {showReorder && (
          <Button
            onClick={onReorder}
            variant="outline"
            className="rounded-full"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Beli Lagi
          </Button>
        )}
      </div>
    </div>
  );
}
