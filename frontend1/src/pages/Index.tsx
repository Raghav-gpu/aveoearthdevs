import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryBubbles from '@/components/CategoryBubbles';
import GoGreenSection from '@/components/GoGreenSection';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoryBubbles />
        <GoGreenSection />
      </main>
      <ChatBot />
    </div>
  );
};

export default Index;
