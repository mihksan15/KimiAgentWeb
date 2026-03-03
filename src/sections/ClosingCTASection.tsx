import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

export function ClosingCTASection() {
  const { settings, getWhatsAppLink } = useSettings();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const footer = footerRef.current;

    if (!section || !card || !footer) return;

    const ctx = gsap.context(() => {
      // Card animation
      gsap.fromTo(card,
        { y: '14vh', opacity: 0, scale: 0.985 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 0.4
          }
        }
      );

      // Footer columns animation
      const footerCols = footer.querySelectorAll('.footer-col');
      gsap.fromTo(footerCols,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            end: 'top 70%',
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
      className="relative w-full min-h-screen bg-[#E6F3F3] py-16 lg:py-24 z-[70]"
    >
      {/* Background Pattern */}
      <svg
        className="absolute left-[6vw] top-[10vh] w-[22vw] opacity-[0.15]"
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

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* CTA Card */}
        <div
          ref={cardRef}
          className="bg-[#F7F2E9] rounded-[34px] border-[3px] border-[#2B2B2B]/10 shadow-[0_18px_40px_rgba(0,0,0,0.10)] overflow-hidden mb-12 lg:mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Content */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
              <h2 className="font-['Fredoka'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2B2B2B] mb-4 lg:mb-6">
                Pesan sekarang, kami siap antar.
              </h2>
              <p className="text-base lg:text-lg text-[#6E6E6E] mb-6 lg:mb-8 max-w-md">
                Katalog selalu update. Tanya stok? Chat langsung.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-[#D64A58] hover:bg-[#c43d4b] text-white rounded-full px-6 lg:px-8 py-5 lg:py-6 text-base lg:text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat WhatsApp
                  </Button>
                </a>
                <Link to="/katalog">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-6 lg:px-8 py-5 lg:py-6 text-base lg:text-lg font-medium border-[3px] border-[#2B2B2B]/10 hover:bg-[#2B2B2B]/5"
                  >
                    Lihat Katalog
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-64 lg:h-auto overflow-hidden">
              <img
                src="/images/closing-delivery.jpg"
                alt="Pengantaran"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F7F2E9]/50 lg:to-[#F7F2E9]" />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div
          ref={footerRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8"
        >
          <div className="footer-col flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-[#D64A58]" />
            </div>
            <div>
              <h4 className="font-semibold text-[#2B2B2B] mb-1">WhatsApp</h4>
              <p className="text-[#6E6E6E]">{settings.whatsappNumber}</p>
            </div>
          </div>

          <div className="footer-col flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#D64A58]" />
            </div>
            <div>
              <h4 className="font-semibold text-[#2B2B2B] mb-1">Alamat</h4>
              <p className="text-[#6E6E6E]">{settings.storeAddress}</p>
            </div>
          </div>

          <div className="footer-col flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[#D64A58]" />
            </div>
            <div>
              <h4 className="font-semibold text-[#2B2B2B] mb-1">Jam Buka</h4>
              <p className="text-[#6E6E6E]">{settings.storeHours}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-[#2B2B2B]/10 text-center">
          <p className="text-sm text-[#6E6E6E]">
            © 2024 {settings.storeName}. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </section>
  );
}
