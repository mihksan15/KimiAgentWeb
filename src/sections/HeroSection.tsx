import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const cta = ctaRef.current;
    const image = imageRef.current;

    if (!section || !card || !headline || !subheadline || !cta || !image) return;

    const ctx = gsap.context(() => {
      // Initial load animation
      const loadTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      
      loadTl
        .fromTo(card, 
          { opacity: 0, scale: 0.98, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.9 }
        )
        .fromTo(headline.querySelectorAll('.word'),
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
          '-=0.5'
        )
        .fromTo(image,
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.9 },
          '-=0.7'
        )
        .fromTo(cta,
          { scale: 0.96, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 },
          '-=0.4'
        );

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements when scrolling back to top
            gsap.set([card, headline, subheadline, cta, image], {
              opacity: 1, x: 0, scale: 1, clearProps: 'transform'
            });
          }
        }
      });

      // EXIT phase (70% - 100%)
      scrollTl
        .fromTo(headline,
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(subheadline,
          { x: 0, opacity: 1 },
          { x: '-14vw', opacity: 0, ease: 'power2.in' },
          0.72
        )
        .fromTo(cta,
          { x: 0, opacity: 1 },
          { x: '-10vw', opacity: 0, ease: 'power2.in' },
          0.74
        )
        .fromTo(image,
          { x: 0, opacity: 1 },
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(card,
          { scale: 1, opacity: 1 },
          { scale: 0.985, opacity: 0.25, ease: 'power2.in' },
          0.75
        );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#F7F2E9] overflow-hidden z-10"
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dots Pattern - Top Left */}
        <svg
          className="absolute left-[6vw] top-[10vh] w-[22vw] opacity-[0.22]"
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

        {/* Wavy Pattern - Bottom Right */}
        <svg
          className="absolute right-[6vw] bottom-[10vh] w-[26vw] opacity-[0.22]"
          viewBox="0 0 200 100"
          fill="none"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <path
              key={i}
              d={`M0 ${20 + i * 15} Q 25 ${10 + i * 15}, 50 ${20 + i * 15} T 100 ${20 + i * 15} T 150 ${20 + i * 15} T 200 ${20 + i * 15}`}
              stroke="#2B2B2B"
              strokeWidth="2"
              fill="none"
            />
          ))}
        </svg>
      </div>

      {/* Hero Card */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div
          ref={cardRef}
          className="relative w-full max-w-[86vw] h-[64vh] bg-[#F7F2E9] rounded-[34px] border-[3px] border-[#2B2B2B]/10 shadow-[0_18px_40px_rgba(0,0,0,0.10)] overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 h-full">
            {/* Left Content */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
              <h1
                ref={headlineRef}
                className="font-['Fredoka'] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-[#2B2B2B] leading-[0.95] tracking-tight mb-4 lg:mb-6"
              >
                <span className="word inline-block">Belanja</span>{' '}
                <span className="word inline-block">harian,</span>
                <br />
                <span className="word inline-block text-[#D64A58]">simpel</span>{' '}
                <span className="word inline-block text-[#D64A58]">&</span>{' '}
                <span className="word inline-block text-[#D64A58]">hemat.</span>
              </h1>

              <p
                ref={subheadlineRef}
                className="text-base lg:text-lg text-[#6E6E6E] max-w-md mb-6 lg:mb-8"
              >
                Sembako, camilan, kebutuhan rumah—diantar atau ambil di warung.
              </p>

              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/katalog">
                  <Button
                    size="lg"
                    className="bg-[#D64A58] hover:bg-[#c43d4b] text-white rounded-full px-6 lg:px-8 py-5 lg:py-6 text-base lg:text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Lihat Katalog
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/hubungi">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-6 lg:px-8 py-5 lg:py-6 text-base lg:text-lg font-medium border-[3px] border-[#2B2B2B]/10 hover:bg-[#2B2B2B]/5"
                  >
                    Hubungi Kami
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 lg:gap-6 mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-[#2B2B2B]/10">
                <div className="flex items-center gap-2 text-sm text-[#6E6E6E]">
                  <Package className="w-4 h-4 text-[#D64A58]" />
                  <span>Stok Real-time</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6E6E6E]">
                  <Clock className="w-4 h-4 text-[#D64A58]" />
                  <span>Antar Cepat</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6E6E6E]">
                  <Shield className="w-4 h-4 text-[#D64A58]" />
                  <span>Aman & Terpercaya</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div
              ref={imageRef}
              className="relative hidden lg:block h-full"
            >
              <img
                src="/images/hero-store.jpg"
                alt="ULFAMART"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F7F2E9] via-transparent to-transparent" />
              
              {/* Floating Product Cards */}
              <div className="absolute bottom-8 left-8 flex gap-3">
                <div className="bg-white rounded-2xl p-3 shadow-lg border border-[#2B2B2B]/10">
                  <img
                    src="/images/products/beras-premium.jpg"
                    alt="Beras"
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                </div>
                <div className="bg-white rounded-2xl p-3 shadow-lg border border-[#2B2B2B]/10 -mt-4">
                  <img
                    src="/images/products/minyak-goreng.jpg"
                    alt="Minyak"
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                </div>
                <div className="bg-white rounded-2xl p-3 shadow-lg border border-[#2B2B2B]/10">
                  <img
                    src="/images/products/gula-pasir.jpg"
                    alt="Gula"
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
