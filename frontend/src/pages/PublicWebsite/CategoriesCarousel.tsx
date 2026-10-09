import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '../../components/ScrollReveal';
import { useLanguage } from '../../i18n/LanguageContext';

interface TradeCategory {
  title: string;
  count: string;
  description: string;
  skills: string[];
  imageUrl: string;
}

export const CategoriesCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const categories: TradeCategory[] = [
    {
      title: 'Electricians',
      count: '1,420+ Verified Passports',
      description: 'Conduit wiring, LT panels, switchgear, phase balancing, earthing pits.',
      skills: ['Conduit Wiring', 'LT Distribution', 'Insulation Meggering'],
      imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Plumbers',
      count: '980+ Verified Passports',
      description: 'CPVC line layout, sanitary fittings, pressure testing, solar line runs.',
      skills: ['Pressure Testing', 'CPVC Jointing', 'Drainage Slope'],
      imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Carpenters',
      count: '1,120+ Verified Passports',
      description: 'Modular shuttering, framework carpentry, acoustic panelling, joinery.',
      skills: ['Formwork Framing', 'Modular Joinery', 'Laser Alignment'],
      imageUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Mechanics',
      count: '860+ Verified Passports',
      description: 'Heavy machinery overhaul, motor rewinding, hydraulic line servicing.',
      skills: ['Hydraulic Valves', 'Motor Rewind', 'Torque Tolerances'],
      imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Welders & Fabricators',
      count: '750+ Verified Passports',
      description: 'TIG/MIG pipeline welding, structural truss assembly, ultrasonic inspection.',
      skills: ['TIG/MIG Welding', 'Truss Fabrication', 'Radiography Proof'],
      imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Drivers & Heavy Operators',
      count: '1,240+ Verified Passports',
      description: 'Excavator, crane, transit mixer, and commercial heavy vehicle handling.',
      skills: ['Crane Load Limits', 'Excavation Grading', 'Logbook Verifications'],
      imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Technicians',
      count: '930+ Verified Passports',
      description: 'HVAC chillers, elevator controls, solar inverters, telecom optic fiber.',
      skills: ['Chiller Charging', 'Fiber Splicing', 'Inverter Calibration'],
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Construction Workers',
      count: '1,890+ Verified Passports',
      description: 'Reinforced concrete, masonry, rebar tying, scaffolding safety compliance.',
      skills: ['Rebar Bending', 'Concrete Pouring', 'Scaffolding Safety'],
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Painters & Finishers',
      count: '640+ Verified Passports',
      description: 'Airless spray coating, epoxy floor finishes, waterproofing membranes.',
      skills: ['Epoxy Coating', 'Waterproofing', 'Surface Priming'],
      imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Facility & Hospitality',
      count: '510+ Verified Passports',
      description: 'Commercial facility upkeep, kitchen utilities, boiler systems, housekeeping.',
      skills: ['Boiler Maintenance', 'Sanitation Safety', 'Asset Auditing'],
      imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="categories" className="py-20 sm:py-28 lg:py-32 bg-[#F5F2EB] border-t border-b border-[#DFD9CE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Carousel Navigation Buttons */}
        <ScrollReveal delay={0} duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#162B22] font-bold mb-3">
                {t('categories.tag', '07 / TRADE SPECIALIZATIONS')}
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#141715] tracking-tight leading-[1.08]">
                {t('categories.title', 'BUILT FOR REAL WORK.')}
              </h2>
              <p className="text-lg text-[#484F4A] mt-4 max-w-xl">
                {t('categories.subtitle', 'Engineered for hands-on, site-tested vocations where physical work and verifiable technique define true professional caliber.')}
              </p>
            </div>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => scroll('left')}
                className="vouch-btn w-12 h-12 rounded-full border border-[#DFD9CE] bg-white hover:bg-[#F5F2EB] text-[#141715] flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Scroll left"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="vouch-btn w-12 h-12 rounded-full border border-[#DFD9CE] bg-[#162B22] hover:bg-[#102019] text-white flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Scroll right"
              >
                <ArrowRight className="w-5 h-5 text-[#C2672B]" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Horizontal Scrollable Carousel Container */}
        <ScrollReveal delay={120} duration={650}>
          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 bg-[#E6EDE8] rounded-2xl overflow-hidden border border-[#DFD9CE] shadow-[0_12px_24px_rgba(18,22,20,0.06)] hover:border-[#162B22] transition-all group flex flex-col justify-between"
              >
                {/* Image Banner */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100 reveal-image-container">
                  <img
                    src={cat.imageUrl}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter saturate-[0.95]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141715]/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 bg-[#F5F2EB]/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono font-bold text-[#162B22]">
                    {cat.count}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-display font-bold text-xl text-white">
                      {cat.title}
                    </h3>
                  </div>
                </div>

                {/* Description & Technical Skills */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#484F4A] leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  <div className="pt-3 border-t border-[#ECE7DE]">
                    <span className="text-[10px] font-mono text-[#727A75] uppercase block mb-1.5">
                      KEY EVIDENCE CRITERIA
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] font-mono bg-[#F5F2EB] text-[#162B22] px-2 py-0.5 rounded border border-[#DFD9CE]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
