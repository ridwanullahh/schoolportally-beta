
import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import HeroSection from '../../components/marketing/HeroSection';
import FeaturesSection from '../../components/marketing/FeaturesSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        
        {/* Additional sections will be added here */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">Trusted by Schools Worldwide</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
              <div className="flex items-center justify-center h-16 bg-muted rounded-lg">
                <span className="font-semibold">School Logo</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-muted rounded-lg">
                <span className="font-semibold">School Logo</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-muted rounded-lg">
                <span className="font-semibold">School Logo</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-muted rounded-lg">
                <span className="font-semibold">School Logo</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
