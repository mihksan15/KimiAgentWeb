import { useState } from 'react';
import { Check, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCart } from '@/context/CartContext';
import { useProduct } from '@/context/ProductContext';
import type { Bundle } from '@/types';

interface BundleCardProps {
  bundle: Bundle;
  featured?: boolean;
}

export function BundleCard({ bundle, featured = false }: BundleCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { getProductById } = useProduct();

  const handleAddBundle = () => {
    bundle.products.forEach(({ productId, quantity }) => {
      const product = getProductById(productId);
      if (product) {
        addToCart(product, quantity);
      }
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const bundleProducts = bundle.products.map(({ productId, quantity }) => {
    const product = getProductById(productId);
    return { product, quantity };
  });

  if (featured) {
    return (
      <>
        <div className="bg-white rounded-[34px] border-[3px] border-[#2B2B2B]/10 overflow-hidden shadow-lg">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-64 lg:h-auto overflow-hidden">
              <img
                src={bundle.image}
                alt={bundle.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-[#D64A58] text-white text-sm px-3 py-1">
                PAKET HEMAT
              </Badge>
            </div>

            {/* Content */}
            <div className="p-6 lg:p-10 flex flex-col justify-center">
              <h3 className="font-['Fredoka'] text-3xl lg:text-4xl font-semibold text-[#2B2B2B] mb-4">
                {bundle.name}
              </h3>
              
              <ul className="space-y-2 mb-6">
                {bundleProducts.map(({ product, quantity }, index) => (
                  <li key={index} className="flex items-center text-[#2B2B2B]">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>
                      {product?.name} ({quantity} {product?.unit})
                    </span>
                  </li>
                ))}
                <li className="flex items-center text-[#2B2B2B]">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Dikemas rapi, siap antar</span>
                </li>
              </ul>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-[#D64A58]">
                  Rp{bundle.bundlePrice.toLocaleString('id-ID')}
                </span>
                <span className="text-lg text-[#6E6E6E] line-through">
                  Rp{bundle.originalPrice.toLocaleString('id-ID')}
                </span>
              </div>
              
              <p className="text-green-600 text-sm mb-6">
                Hemat Rp{bundle.savings.toLocaleString('id-ID')}!
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddBundle}
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
                    'Ambil Paket Ini'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDetail(true)}
                  className="rounded-full px-6"
                >
                  Detail
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-['Fredoka'] text-2xl">{bundle.name}</DialogTitle>
              <DialogDescription>{bundle.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={bundle.image}
                alt={bundle.name}
                className="w-full h-48 object-cover rounded-xl"
              />
              <div>
                <h4 className="font-medium mb-2">Isi Paket:</h4>
                <ul className="space-y-2">
                  {bundleProducts.map(({ product, quantity }, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span>{product?.name}</span>
                      <span className="text-[#6E6E6E]">{quantity} {product?.unit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center pt-4">
                <div>
                  <span className="text-2xl font-bold text-[#D64A58]">
                    Rp{bundle.bundlePrice.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[#6E6E6E] line-through ml-2">
                    Rp{bundle.originalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <Button
                  onClick={handleAddBundle}
                  className="bg-[#D64A58] hover:bg-[#c43d4b]"
                >
                  Tambah ke Keranjang
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="bg-white rounded-[28px] border-[3px] border-[#2B2B2B]/10 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden">
        <img
          src={bundle.image}
          alt={bundle.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-[#D64A58]">
          HEMAT Rp{bundle.savings.toLocaleString('id-ID')}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="font-['Fredoka'] text-xl font-semibold text-[#2B2B2B] mb-2">
          {bundle.name}
        </h3>
        <p className="text-sm text-[#6E6E6E] mb-4">{bundle.description}</p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-[#D64A58]">
            Rp{bundle.bundlePrice.toLocaleString('id-ID')}
          </span>
          <span className="text-sm text-[#6E6E6E] line-through">
            Rp{bundle.originalPrice.toLocaleString('id-ID')}
          </span>
        </div>
        <Button
          onClick={handleAddBundle}
          className="w-full rounded-full bg-[#D64A58] hover:bg-[#c43d4b]"
        >
          {added ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Ditambahkan
            </>
          ) : (
            <>
              <Package className="w-4 h-4 mr-2" />
              Ambil Paket
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
