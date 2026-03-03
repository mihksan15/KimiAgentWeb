import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TestimonialCard } from '@/components/ui-custom/TestimonialCard';
import { testimonials } from '@/data/products';

gsap.registerPlugin(ScrollTrigger);

export function TestimonialsSection() {
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

      // Testimonial cards animation
      const cardElements = cards.querySelectorAll('.testimonial-card');
      cardElements.forEach((card, index) => {
        gsap.fromTo(card,
          { x: index === 0 ? '-12vw' : '12vw', opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cards,
              start: 'top 75%',
              end: 'top 45%',
              scrub: 0.4
            }
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#F7F2E9] py-16 lg:py-24 z-[60]"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 lg:mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#6E6E6E] mb-3 block">
            TESTIMONI
          </span>
          <h2 className="font-['Fredoka'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2B2B2B]">
            Kata tetangga yang sudah coba.
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          {testimonials.slice(0, 2).map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
