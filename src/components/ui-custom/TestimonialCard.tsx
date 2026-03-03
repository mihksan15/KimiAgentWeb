import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-[28px] border-[3px] border-[#2B2B2B]/10 p-6 lg:p-8 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="w-10 h-10 text-[#D64A58]/30" />
      </div>

      {/* Quote Text */}
      <blockquote className="text-lg lg:text-xl text-[#2B2B2B] leading-relaxed flex-1 mb-6">
        "{testimonial.quote}"
      </blockquote>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < testimonial.rating
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-[#E6F3F3]">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-[#2B2B2B]">{testimonial.name}</h4>
          <p className="text-sm text-[#6E6E6E]">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
