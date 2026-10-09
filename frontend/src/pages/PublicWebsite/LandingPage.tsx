import React from 'react';
import { PublicNavbar } from './PublicNavbar';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { PassportShowcaseSection } from './PassportShowcaseSection';
import { EvidenceSection } from './EvidenceSection';
import { WorkerSection } from './WorkerSection';
import { EmployerSection } from './EmployerSection';
import { CategoriesCarousel } from './CategoriesCarousel';
import { PortabilitySection } from './PortabilitySection';
import { TestimonialsSection } from './TestimonialsSection';
import { ImpactStatsSection } from './ImpactStatsSection';
import { FinalCTASection } from './FinalCTASection';
import { PublicFooter } from './PublicFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#141715] flex flex-col w-full selection:bg-[#162B22] selection:text-white">
      {/* 1. Header & Navigation */}
      <PublicNavbar />

      <main className="flex-1 w-full flex flex-col">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. The Problem Section */}
        <ProblemSection />

        {/* 4. Professional Passport Product Showcase */}
        <PassportShowcaseSection />

        {/* 6. Evidence, Not Ratings */}
        <EvidenceSection />

        {/* 7. For Workers */}
        <WorkerSection />

        {/* 8. For Employers / Contractors */}
        <EmployerSection />

        {/* 9. Skilled Vocations Horizontal Carousel */}
        <CategoriesCarousel />

        {/* 10. Portable Identity Progression */}
        <PortabilitySection />

        {/* 11. Social Proof & Real-World Field Perspectives */}
        <TestimonialsSection />

        {/* 12. Illustrative Impact Scale Numbers */}
        <ImpactStatsSection />

        {/* 13. Final Editorial CTA */}
        <FinalCTASection />
      </main>

      {/* 14. Professional Footer */}
      <PublicFooter />
    </div>
  );
};

export default LandingPage;
