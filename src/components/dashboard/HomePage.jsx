import React, { useState, useEffect, useRef } from 'react';
import '../../styles/HomePage.css';
import EventCarousel from './EventCarousel';
import Noticias from './Noticias';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const touchStartX = useRef(null);

  // ===== novos estados para notas temporárias / modal =====
  const [notes, setNotes] = useState([]); // notas adicionadas pelo usuário (apenas sessão)
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({
    title: '',
    observation: '',
    links: [],
    linkInput: '',
    files: [], // { id, name, url, type }
  });

  // Dados de exemplo para o carrossel de notícias
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
      title: 'Sustentabilidade e Reciclagem',
      description: 'Programa de coleta seletiva e gestão de resíduos para uma cidade mais limpa e sustentável.',
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

  // Dados de exemplo para eventos/notas (estáticos, imutáveis)
  const events = [
    { id: 'e1', date: new Date(2026, 0, 22), title: 'Reunião SEMADES', note: 'Planejamento 2026' },
    { id: 'e2', date: new Date(2026, 0, 25), title: 'Publicação Relatório', note: 'Dados ambientais Q4' },
    { id: 'e3', date: new Date(2026, 0, 28), title: 'Workshop', note: 'Capacitação equipe' },
  ];

  // ===== utilitários atualizados para considerar notas adicionadas =====
  const hasEvent = (day) => {
    const inStatic = events.some(event =>
      event.date.getDate() === day &&
      event.date.getMonth() === currentMonth.getMonth() &&
      event.date.getFullYear() === currentMonth.getFullYear()
    );
    const inNotes = notes.some(n =>
      n.date.getDate() === day &&
      n.date.getMonth() === currentMonth.getMonth() &&
      n.date.getFullYear() === currentMonth.getFullYear()
    );
    return inStatic || inNotes;
  };

  const getEventForDay = (day) => {
    const staticEvent = events.find(event =>
      event.date.getDate() === day &&
      event.date.getMonth() === currentMonth.getMonth() &&
      event.date.getFullYear() === currentMonth.getFullYear()
    );
    if (staticEvent) return staticEvent;
    const userNote = notes.find(n =>
      n.date.getDate() === day &&
      n.date.getMonth() === currentMonth.getMonth() &&
      n.date.getFullYear() === currentMonth.getFullYear()
    );
    return userNote || null;
  };

  // ===== abrir modal para adicionar nota (preenche date automaticamente) =====
  const openAddNoteModal = (day) => {
    setSelectedDate(day);
    setNoteForm({
      title: '',
      observation: '',
      links: [],
      linkInput: '',
      files: [],
    });
    setShowNoteModal(true);
  };

  // ===== manipulação do formulário do modal =====
  const handleNoteInputChange = (e) => {
    const { name, value } = e.target;
    setNoteForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLink = () => {
    const url = noteForm.linkInput.trim();
    if (!url) return;
    setNoteForm(prev => ({ ...prev, links: [...prev.links, url], linkInput: '' }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const fileObjs = files.map(f => ({
      id: 'f' + (Date.now() + Math.random()).toString(36),
      name: f.name,
      url: URL.createObjectURL(f),
      type: f.type || 'file'
    }));
    setNoteForm(prev => ({ ...prev, files: [...prev.files, ...fileObjs] }));
    // limpa input
    e.target.value = null;
  };

  const handleRemoveAttachment = (id) => {
    // revoke URL se for file
    const file = noteForm.files.find(f => f.id === id);
    if (file && file.url) URL.revokeObjectURL(file.url);
    setNoteForm(prev => ({ ...prev, files: prev.files.filter(f => f.id !== id) }));
  };

  const handleRemoveLink = (idx) => {
    setNoteForm(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }));
  };

  const handleSubmitNote = (e) => {
    e.preventDefault();
    if (!selectedDate) return;
    const noteDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate);
    const newNote = {
      id: 'note-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      date: noteDate,
      title: noteForm.title || `Nota ${selectedDate}/${currentMonth.getMonth()+1}`,
      note: noteForm.observation || '',
      attachments: [...noteForm.files.map(f => ({ id: f.id, name: f.name, url: f.url, type: f.type })), ...noteForm.links.map((lnk, i) => ({ id: 'link-'+i+'-'+Date.now(), name: lnk, url: lnk, type: 'link' }))],
      isUser: true
    };
    setNotes(prev => [...prev, newNote]);
    setShowNoteModal(false);
  };

  // permitir exclusão de notas adicionadas pelo usuário
  const deleteNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (note && note.attachments) {
      note.attachments.forEach(att => { if (att.type !== 'link' && att.url) URL.revokeObjectURL(att.url); });
    }
    setNotes(prev => prev.filter(n => n.id !== noteId));
    if (selectedDate) setSelectedDate(null);
  };

  // revoga URLs ao desmontar componente
  useEffect(() => {
    return () => {
      notes.forEach(n => {
        (n.attachments || []).forEach(att => { if (att.type !== 'link' && att.url) URL.revokeObjectURL(att.url); });
      });
    };
  }, [notes]);

  useEffect(() => {
    if (!showNoteModal) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showNoteModal]);

  // Navegação do carrossel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newsItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

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

  // Autoplay do carrossel a cada 4 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % newsItems.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [newsItems.length]);

  // Funções do calendário
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <>
      <section className="news-carousel-section under-navbar">
        <div className="carousel-hero" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {newsItems.map((item, idx) => (
            <div
              key={item.id}
              className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${item.image})` }}
              aria-hidden={idx === currentSlide ? "false" : "true"}
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

          <div className="carousel-controls">
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
          </div>
        </div>

      </section>

      {/* Seção Sobre - Observatório Econômico */}
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

      <Noticias />

      <div className="homepage-container">
        {/* Seção de Calendário com Notas (agora começa após o hero/logo) */}
        <section className="calendar-section">
        <h2 className="section-title">Calendário e Publicações</h2>
        <div className="calendar-container">
          {/* Calendário Principal */}
          <div className="calendar-main">
            <div className="calendar-header">
              <button className="month-nav-btn prev" onClick={previousMonth}>‹</button>
              <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
              <button className="month-nav-btn next" onClick={nextMonth}>›</button>
            </div>

            <div className="calendar-grid">
              <div className="calendar-day-header">Dom</div>
              <div className="calendar-day-header">Seg</div>
              <div className="calendar-day-header">Ter</div>
              <div className="calendar-day-header">Qua</div>
              <div className="calendar-day-header">Qui</div>
              <div className="calendar-day-header">Sex</div>
              <div className="calendar-day-header">Sáb</div>

              {/* Espaços vazios antes do primeiro dia */}
              {[...Array(startingDayOfWeek)].map((_, index) => (
                <div key={`empty-${index}`} className="calendar-day empty"></div>
              ))}

              {/* Dias do mês */}
              {[...Array(daysInMonth)].map((_, index) => {
                const day = index + 1;
                const hasEventMarker = hasEvent(day);
                const isToday = 
                  day === new Date().getDate() &&
                  currentMonth.getMonth() === new Date().getMonth() &&
                  currentMonth.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={day}
                    className={`calendar-day ${hasEventMarker ? 'has-event' : ''} ${isToday ? 'today' : ''} ${selectedDate === day ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(prev => (prev === day ? null : day))}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedDate(prev => (prev === day ? null : day)); }}
                  >
                    <span className="day-number">{day}</span>
                    {hasEventMarker && <span className="event-indicator">•</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notas/Eventos - Lateral */}
          <div className="events-list">
            <h4>Eventos e Notas</h4>
            {selectedDate ? (
              <div className="selected-day-events">
                {getEventForDay(selectedDate) ? (
                  (() => {
                    const ev = getEventForDay(selectedDate);
                    return (
                      <div className="event-item">
                        <div style={{flex:1}}>
                          <strong>{ev.title}</strong>
                          <p>{ev.note}</p>
                          {(ev.attachments || []).map(att => (
                            <div key={att.id} style={{marginTop:6}}>
                              {att.type === 'link' ? (
                                <a href={att.url} target="_blank" rel="noreferrer">{att.name}</a>
                              ) : (
                                <a href={att.url} target="_blank" rel="noreferrer" download>{att.name}</a>
                              )}
                            </div>
                          ))}
                        </div>
                        {ev.isUser && (
                          <div style={{marginLeft:8}}>
                            <button className="attach-file-btn" onClick={() => deleteNote(ev.id)}>Excluir</button>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="no-events">
                    <p>Nenhum evento para {selectedDate}/{currentMonth.getMonth() + 1}</p>
                    <button className="add-note-btn" onClick={() => openAddNoteModal(selectedDate)}>+ Adicionar Nota</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="upcoming-events">
                {[
                  // combina eventos estáticos + notas do usuário para o mês atual
                  ...events.filter(event => event.date.getMonth() === currentMonth.getMonth() && event.date.getFullYear() === currentMonth.getFullYear()),
                  ...notes.filter(n => n.date.getMonth() === currentMonth.getMonth() && n.date.getFullYear() === currentMonth.getFullYear())
                ]
                  .sort((a, b) => a.date - b.date)
                  .map((event, index) => (
                    <div key={event.id} className="event-preview">
                      <span className="event-date">{event.date.getDate()}</span>
                      <div className="event-details">
                        <strong>{event.title}</strong>
                        <small>{event.note}</small>
                        {(event.attachments || []).map(att => (
                          <div key={att.id} style={{marginTop:6}}>
                            {att.type === 'link' ? (
                              <a href={att.url} target="_blank" rel="noreferrer">{att.name}</a>
                            ) : (
                              <a href={att.url} target="_blank" rel="noreferrer" download>{att.name}</a>
                            )}
                          </div>
                        ))}
                      </div>
                      {event.isUser && (
                        <div style={{marginLeft:8}}>
                          <button className="attach-file-btn" onClick={() => deleteNote(event.id)}>Excluir</button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Seção de Eventos Animados do Host */}
      <EventCarousel userNotes={notes} />

      {/* ===== Modal de criação de nota (apenas demonstração em memória) ===== */}
      {showNoteModal && (
        <div className="note-modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="note-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Adicionar Nota - {selectedDate}/{currentMonth.getMonth() + 1}/{currentMonth.getFullYear()}</h3>
            <form onSubmit={handleSubmitNote}>
              {/* Título com placeholder (sem label) */}
              <input
                name="title"
                value={noteForm.title}
                onChange={handleNoteInputChange}
                placeholder="Título da nota"
                aria-label="Título da nota"
                autoComplete="off"
              />

              {/* Observação com placeholder (sem label) */}
              <textarea
                name="observation"
                rows="4"
                value={noteForm.observation}
                onChange={handleNoteInputChange}
                placeholder="Escreva aqui a observação..."
                aria-label="Observação"
              />

              {/* Arquivos: input + texto auxiliar (sem label acima) */}
              <div className="file-block">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  multiple
                  onChange={handleFileChange}
                  aria-label="Anexar arquivos"
                />
                <div className="file-hint">Anexar arquivos (PDF, Word)</div>
              </div>

              {noteForm.files.length > 0 && (
                <div className="attachments-list">
                  {noteForm.files.map(f => (
                    <div key={f.id} className="attachment-row">
                      <a href={f.url} target="_blank" rel="noreferrer" download>{f.name}</a>
                      <button type="button" onClick={() => handleRemoveAttachment(f.id)}>Remover</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Links com placeholder */}
              <div className="link-row" style={{display:'flex', gap:8}}>
                <input
                  name="linkInput"
                  value={noteForm.linkInput}
                  onChange={handleNoteInputChange}
                  placeholder="https://..."
                  aria-label="Adicionar link"
                />
                <button type="button" onClick={handleAddLink}>Adicionar</button>
              </div>
              {noteForm.links.length > 0 && (
                <div className="links-widget" aria-live="polite">
                  {noteForm.links.map((lnk, idx) => (
                    <div key={idx} className="link-chip">
                      <a
                        href={lnk}
                        target="_blank"
                        rel="noreferrer"
                        className="link-url"
                        title={lnk}
                      >
                        {lnk}
                      </a>
                      <button
                        type="button"
                        className="remove-link-btn"
                        onClick={() => handleRemoveLink(idx)}
                        aria-label={`Remover link ${idx + 1}`}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:12}}>
                <button type="button" onClick={() => setShowNoteModal(false)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-save">Salvar (temporário)</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
