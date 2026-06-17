import React from 'react';
import '../../styles/HomePage.css';
import HeroCarousel from './HeroCarousel';
import AboutSection from './AboutSection';
import Noticias from './Noticias';

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <AboutSection />
      <Noticias />
    </>
  );
}
