import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BundleCard } from '@/components/ui-custom/BundleCard';
import { bundles } from '@/data/products';

gsap.registerPlugin(ScrollTrigger);

export function PromoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bundleRef = useRef<HTMLDivElement>(null);

  const featuredBundle = bundles.find(b => b.id === 'paket-sembako-mingguan') || bundles[0];

  useEffect(() => {
    const section = sectionRef.current;
    const bundle = bundleRef.current;

    if (!section || !bundle) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set(bundle, { opacity: 1, x: 0, clearProps: 'transform' });
          }
        }
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(bundle,
        { x: '-60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      // SETTLE (30% - 70%) - static

      // EXIT (70% - 100%)
      scrollTl.fromTo(bundle,
        { x: 0, opacity: 1 },
        { x: '-22vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#F7F2E9] flex items-center justify-center z-40"
    >
      {/* Background Pattern */}
      <svg
        className="absolute left-[4vw] top-[22vh] w-[18vw] opacity-[0.15]"
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
        <div ref={bundleRef}>
          <BundleCard bundle={featuredBundle} featured />
        </div>
      </div>
    </section>
  );
}
