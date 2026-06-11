import React, { useEffect, useRef, useState } from 'react';

// Carrossel do topo da Home (fotos de Campo Grande). Autônomo: gerencia o slide
// atual, o autoplay (pausa no hover/foco e respeita prefers-reduced-motion) e o
// swipe no mobile. Extraído do HomePage para enxugar o componente-página.
const newsItems = [
  {
    id: 1,
    title: 'Parques e Áreas Verdes',
    description: 'Campo Grande é referência em gestão ambiental com seus belos parques urbanos e áreas de lazer.',
    image: '/imagens-cg/campo1.jpg',
    date: '20/01/2026',
  },
  {
    id: 2,
    title: 'Capital dos Ipês em Flor',
    description: 'Entre avenidas largas e áreas verdes, os ipês reforçam a identidade de Campo Grande como uma das cidades mais arborizadas do país.',
    image: '/imagens-cg/campo2.jpg',
    date: '18/01/2026',
  },
  {
    id: 4,
    title: 'Campo Grande em Crescimento',
    description: 'A capital do estado investe em infraestrutura moderna e qualidade de vida para seus cidadãos.',
    image: '/imagens-cg/campo4.jpg',
    date: '12/01/2026',
  },
  {
    id: 5,
    title: 'Inovação e Desenvolvimento',
    description: 'A SEMADES promove soluções inteligentes para o desenvolvimento sustentável de Campo Grande.',
    image: '/imagens-cg/campo5.jpg',
    date: '10/01/2026',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const touchStartX = useRef(null);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % newsItems.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  const goToSlide = (index) => setCurrentSlide(index);

  // swipe handlers para mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  // Autoplay a cada 4s. Pausa no hover/foco e respeita prefers-reduced-motion.
  useEffect(() => {
    if (isHoverPaused) return undefined;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % newsItems.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [isHoverPaused]);

  return (
    <section className="news-carousel-section under-navbar">
      <div
        className="carousel-hero"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHoverPaused(true)}
        onMouseLeave={() => setIsHoverPaused(false)}
        onFocusCapture={() => setIsHoverPaused(true)}
        onBlurCapture={() => setIsHoverPaused(false)}
        aria-roledescription="carrossel"
        aria-label="Destaques de Campo Grande"
      >
        {newsItems.map((item, idx) => (
          <div
            key={item.id}
            className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${item.image})` }}
            aria-hidden={idx === currentSlide ? 'false' : 'true'}
          >
            <div className="hero-overlay" />
            <div className="hero-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}

        <button className="carousel-nav prev" onClick={prevSlide} aria-label="Anterior">‹</button>
        <button className="carousel-nav next" onClick={nextSlide} aria-label="Próximo">›</button>

        <div className="carousel-indicators">
          {newsItems.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Anúncio educado do slide atual para leitores de tela. */}
        <p className="sr-only" aria-live="polite">
          Slide {currentSlide + 1} de {newsItems.length}: {newsItems[currentSlide].title}
        </p>
      </div>
    </section>
  );
}
