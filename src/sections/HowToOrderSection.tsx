import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, MessageCircle, Truck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Pilih barang',
    description: 'Tambahkan ke keranjang.',
    icon: ShoppingCart
  },
  {
    number: '02',
    title: 'Konfirmasi',
    description: 'Kirim via WhatsApp.',
    icon: MessageCircle
  },
  {
    number: '03',
    title: 'Bayar & terima',
    description: 'Transfer atau bayar di tempat.',
    icon: Truck
  }
];

export function HowToOrderSection() {
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

      // Step cards animation
      const cardElements = cards.querySelectorAll('.step-card');
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
            start: 'top 80%',
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
      className="relative w-full min-h-screen bg-[#F7F2E9] py-16 lg:py-24 z-50"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 lg:mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#6E6E6E] mb-3 block">
            CARA PESAN
          </span>
          <h2 className="font-['Fredoka'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2B2B2B]">
            Tiga langkah, selesai.
          </h2>
        </div>

        {/* Step Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="step-card bg-white rounded-[28px] border-[3px] border-[#2B2B2B]/10 p-6 lg:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="font-mono text-4xl lg:text-5xl font-bold text-[#D64A58]/20">
                    {step.number}
                  </span>
                  <div className="w-14 h-14 bg-[#E6F3F3] rounded-2xl flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#D64A58]" />
                  </div>
                </div>
                <h3 className="font-['Fredoka'] text-2xl lg:text-3xl font-semibold text-[#2B2B2B] mb-2">
                  {step.title}
                </h3>
                <p className="text-[#6E6E6E] text-base lg:text-lg">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
