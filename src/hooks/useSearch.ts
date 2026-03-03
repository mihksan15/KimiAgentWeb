import { useState, useCallback, useMemo } from 'react';
import { products } from '@/data/products';
import type { ProductFilter } from '@/types';

export function useSearch() {
  const [filter, setFilter] = useState<ProductFilter>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search by query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filter.category) {
      result = result.filter(p => p.category === filter.category);
    }

    // Filter by price range
    if (filter.minPrice !== undefined) {
      result = result.filter(p => p.price >= filter.minPrice!);
    }
    if (filter.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filter.maxPrice!);
    }

    // Filter by stock
    if (filter.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Filter by promo
    if (filter.isPromoOnly) {
      result = result.filter(p => p.isPromo || p.discount);
    }

    // Sort
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'popular':
          result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
          break;
      }
    }

    return result;
  }, [searchQuery, filter]);

  const setCategory = useCallback((category: string | undefined) => {
    setFilter(prev => ({ ...prev, category }));
  }, []);

  const setPriceRange = useCallback((min?: number, max?: number) => {
    setFilter(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  }, []);

  const setSortBy = useCallback((sortBy: ProductFilter['sortBy']) => {
    setFilter(prev => ({ ...prev, sortBy }));
  }, []);

  const toggleInStockOnly = useCallback(() => {
    setFilter(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }));
  }, []);

  const togglePromoOnly = useCallback(() => {
    setFilter(prev => ({ ...prev, isPromoOnly: !prev.isPromoOnly }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilter({});
    setSearchQuery('');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filter).length > 0 || searchQuery.length > 0;
  }, [filter, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filter,
    filteredProducts,
    setCategory,
    setPriceRange,
    setSortBy,
    toggleInStockOnly,
    togglePromoOnly,
    clearFilters,
    hasActiveFilters
  };
}
