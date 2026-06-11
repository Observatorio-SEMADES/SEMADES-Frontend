import React from 'react';

// Seção "Sobre" do Observatório Econômico. Conteúdo estático, extraído do
// HomePage para deixar a página mais legível.
export default function AboutSection() {
  return (
    <section className="about-observatory-section">
      <div className="about-observatory-container">
        <div className="about-observatory-text">
          <h2>Observatório Econômico da SEMADES</h2>
          <p>
            O Observatório Econômico da SEMADES é uma ferramenta estratégica de gestão ambiental e desenvolvimento sustentável. Através da análise contínua de dados econômicos e ambientais, monitoramos indicadores essenciais para a sustentabilidade de Campo Grande.
          </p>
          <p>
            Nossa missão é fornecer informações precisas e atualizadas que subsidiem a tomada de decisões sobre políticas públicas, investimentos estratégicos e parcerias para o desenvolvimento equilibrado da capital mato-grossense.
          </p>
          <p>
            Com tecnologia de ponta e dedicação ao bem-estar coletivo, transformamos dados em insights valiosos para construir um futuro mais verde e próspero.
          </p>
        </div>

        <div className="about-observatory-image">
          <img
            src="/imagens-cg/semades-about-bg.jpg"
            alt="SEMADES - Observatório Econômico"
            className="about-img"
          />
        </div>
      </div>
    </section>
  );
}
