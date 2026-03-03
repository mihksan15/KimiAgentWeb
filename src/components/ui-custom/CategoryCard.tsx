import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/katalog?category=${category.id}`} className="group block">
      <div className="bg-white rounded-[28px] border-[3px] border-[#2B2B2B]/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-[55%] overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-['Fredoka'] text-2xl font-semibold text-[#2B2B2B] mb-2">
            {category.name}
          </h3>
          <p className="text-[#6E6E6E] text-sm mb-4 flex-1">
            {category.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6E6E6E] font-mono uppercase tracking-wider">
              {category.productCount} Produk
            </span>
            <span className="flex items-center text-[#D64A58] text-sm font-medium group-hover:translate-x-1 transition-transform">
              Lihat
              <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
