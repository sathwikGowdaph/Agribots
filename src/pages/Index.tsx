import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import DetectionSection from '@/components/DetectionSection';
import AgribotChat from '@/components/AgribotChat';
import CommunitySection from '@/components/CommunitySection';
import FeaturesSection from '@/components/FeaturesSection';
import { translations } from '@/translations';

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  const handleStartDetection = () => {
    const detectSection = document.getElementById('detect');
    if (detectSection) {
      detectSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentTranslations = translations[currentLanguage as keyof typeof translations] || translations.en;

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        translations={currentTranslations}
      />
      
      <main className="pt-16">
        <HeroSection
          translations={currentTranslations}
          onStartDetection={handleStartDetection}
        />
        
        <DetectionSection translations={currentTranslations} currentLanguage={currentLanguage} />
        
        <section id="chatbot" className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AgribotChat currentLanguage={currentLanguage} translations={currentTranslations} />
          </div>
        </section>
        
        <CommunitySection translations={currentTranslations} />
        
        <FeaturesSection translations={currentTranslations} />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold font-heading mb-4">
              {currentTranslations.appName}
            </h3>
            <p className="text-primary-foreground/80 mb-4">
              Empowering farmers with AI-powered crop disease detection
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/70">
              <span>© 2024 CropCare AI</span>
              <span>Made for farmers, by farmers</span>
              <span>Available in 3+ languages</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
