import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Product, ProductFormData } from '@/types';
import { products as initialProducts, generateProductId } from '@/data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (data: ProductFormData) => Product;
  updateProduct: (id: string, data: Partial<ProductFormData>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  updatePrice: (id: string, newPrice: number, newCostPrice?: number) => void;
  getProductById: (id: string) => Product | undefined;
  getLowStockProducts: () => Product[];
  importProducts: (productsData: Partial<Product>[]) => { success: number; failed: number; errors: string[] };
  exportProducts: () => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('ulfamart-products');
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(parsedProducts);
      } catch (error) {
        console.error('Failed to parse products:', error);
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }
  }, []);

  // Save products to localStorage on change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('ulfamart-products', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = useCallback((data: ProductFormData): Product => {
    const newProduct: Product = {
      id: generateProductId(data.name),
      name: data.name,
      description: data.description,
      price: data.price,
      costPrice: data.costPrice || data.price * 0.8,
      category: data.category,
      image: data.image || '/images/products/default.jpg',
      stock: data.stock,
      unit: data.unit,
      isAvailable: data.isAvailable,
      isBestseller: data.isBestseller,
      rating: 0,
      reviews: 0
    };

    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, data: Partial<ProductFormData>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? {
              ...product,
              ...data,
              costPrice: data.costPrice ?? data.price ? (data.price || product.price) * 0.8 : product.costPrice
            }
          : product
      )
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  }, []);

  const updateStock = useCallback((id: string, newStock: number) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, stock: Math.max(0, newStock) }
          : product
      )
    );
  }, []);

  const updatePrice = useCallback((id: string, newPrice: number, newCostPrice?: number) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? {
              ...product,
              price: newPrice,
              costPrice: newCostPrice || product.costPrice
            }
          : product
      )
    );
  }, []);

  const getProductById = useCallback((id: string) => {
    return products.find(product => product.id === id);
  }, [products]);

  const getLowStockProducts = useCallback(() => {
    return products.filter(product => product.stock <= 10);
  }, [products]);

  const importProducts = useCallback((productsData: Partial<Product>[]) => {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    const newProducts: Product[] = [];

    productsData.forEach((data, index) => {
      try {
        if (!data.name || !data.price || !data.category) {
          failed++;
          errors.push(`Baris ${index + 1}: Nama, harga, dan kategori wajib diisi`);
          return;
        }

        const newProduct: Product = {
          id: data.id || generateProductId(data.name),
          name: data.name,
          description: data.description || '',
          price: Number(data.price),
          costPrice: Number(data.costPrice) || Number(data.price) * 0.8,
          category: data.category,
          image: data.image || '/images/products/default.jpg',
          stock: Number(data.stock) || 0,
          unit: data.unit || 'pcs',
          isAvailable: data.isAvailable !== false,
          isBestseller: data.isBestseller || false,
          rating: 0,
          reviews: 0
        };

        newProducts.push(newProduct);
        success++;
      } catch (error) {
        failed++;
        errors.push(`Baris ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    if (newProducts.length > 0) {
      setProducts(prev => [...prev, ...newProducts]);
    }

    return { success, failed, errors };
  }, []);

  const exportProducts = useCallback(() => {
    return products;
  }, [products]);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        updatePrice,
        getProductById,
        getLowStockProducts,
        importProducts,
        exportProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}
