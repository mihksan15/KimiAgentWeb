import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/ui-custom/ProductCard';
import { useProduct } from '@/context/ProductContext';

gsap.registerPlugin(ScrollTrigger);

export function BestsellersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { products } = useProduct();
  
  const bestsellers = products.filter(p => p.isBestseller).slice(0, 4);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;

    if (!section || !heading || !cards) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(heading,
        { x: '-8vw', opacity: 0 },
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

      // Product cards animation
      const cardElements = cards.querySelectorAll('.product-card');
      gsap.fromTo(cardElements,
        { y: '16vh', opacity: 0, scale: 0.985 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cards,
            start: 'top 78%',
            end: 'top 40%',
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
      className="relative w-full min-h-screen bg-[#F7F2E9] py-16 lg:py-24 z-30"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Heading */}
        <div ref={headingRef} className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 lg:mb-16">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#6E6E6E] mb-3 block">
              BESTSELLER
            </span>
            <h2 className="font-['Fredoka'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2B2B2B]">
              Paling sering dibeli minggu ini.
            </h2>
          </div>
          <Link
            to="/katalog"
            className="flex items-center text-[#D64A58] font-medium mt-4 sm:mt-0 hover:translate-x-1 transition-transform"
          >
            Lihat semua
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        {/* Product Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {bestsellers.map((product) => (
            <div key={product.id} className="product-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
