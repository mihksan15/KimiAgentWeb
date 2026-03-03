import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CategoryCard } from '@/components/ui-custom/CategoryCard';
import { categories } from '@/data/products';

gsap.registerPlugin(ScrollTrigger);

export function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;

    if (!section || !heading || !cards) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(heading,
        { x: '-10vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.4
          }
        }
      );

      // Cards animation with stagger
      const cardElements = cards.querySelectorAll('.category-card');
      gsap.fromTo(cardElements,
        { y: '18vh', opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cards,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 0.4
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#F7F2E9] py-16 lg:py-24 z-20"
    >
      {/* Background Pattern */}
      <svg
        className="absolute left-[6vw] top-[6vh] w-[18vw] opacity-[0.15]"
        viewBox="0 0 200 200"
        fill="none"
      >
        {Array.from({ length: 10 }).map((_, row) =>
          Array.from({ length: 10 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={20 + col * 18}
              cy={20 + row * 18}
              r="3"
              fill="#2B2B2B"
            />
          ))
        )}
      </svg>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 lg:mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#6E6E6E] mb-3 block">
            KATEGORI
          </span>
          <h2 className="font-['Fredoka'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2B2B2B] max-w-xl">
            Stok lengkap, harga tetap bersahabat.
          </h2>
        </div>

        {/* Category Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
