import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { products } from '@/data/products';

export function useWishlist() {
  const { user, addToWishlist, removeFromWishlist, isInWishlist } = useAuth();

  const wishlistProducts = user?.wishlist
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) || [];

  const toggleWishlist = useCallback((productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const wishlistCount = user?.wishlist.length || 0;

  return {
    wishlistProducts,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist
  };
}
