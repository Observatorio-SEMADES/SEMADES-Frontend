import React, { useMemo, useState } from 'react';
import '../../styles/EventCarousel.css';
import { Calendar, Clock, MapPin, Phone, Link as LinkIcon, StickyNote, Pause, Play } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import { hostEvents } from '../../data/eventos';
import { useDialog } from '../../hooks/useDialog';

// Modal de detalhes do evento, isolado para poder usar o hook de acessibilidade
// (foco preso, Esc, foco de volta) só quando está montado.
function EventModal({ event, onClose }) {
  const dialogRef = useDialog(onClose);
  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div
        className="event-modal"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        tabIndex={-1}
      >
        <button className="event-modal-close" onClick={onClose} aria-label="Fechar">✕</button>

        <div className="event-modal-header">
          <span className="event-modal-icon"><event.icon size={32} aria-hidden="true" /></span>
          <h2 className="event-modal-title" id="event-modal-title">{event.title}</h2>
        </div>

        <div className="event-modal-content">
          <div className="modal-info-group">
            <h3>Detalhes do Evento</h3>

            <div className="modal-info-item">
              <span className="modal-info-icon"><Calendar size={20} aria-hidden="true" /></span>
              <div className="modal-info-details">
                <span className="modal-label">Data</span>
                <span className="modal-value">{event.date}</span>
              </div>
            </div>

            <div className="modal-info-item">
              <span className="modal-info-icon"><Clock size={20} aria-hidden="true" /></span>
              <div className="modal-info-details">
                <span className="modal-label">{event.isUserNote ? 'Tipo' : 'Horário'}</span>
                <span className="modal-value">{event.time}</span>
              </div>
            </div>

            <div className="modal-info-item">
              <span className="modal-info-icon">
                {event.isUserNote ? <StickyNote size={20} aria-hidden="true" /> : <MapPin size={20} aria-hidden="true" />}
              </span>
              <div className="modal-info-details">
                <span className="modal-label">{event.isUserNote ? 'Observação' : 'Local'}</span>
                <span className="modal-value">{event.location}</span>
              </div>
            </div>

            {event.contact && (
              <div className="modal-info-item">
                <span className="modal-info-icon"><Phone size={20} aria-hidden="true" /></span>
                <div className="modal-info-details">
                  <span className="modal-label">Contato</span>
                  <span className="modal-value">
                    <a href={`tel:${event.contact}`}>{event.contact}</a>
                  </span>
                </div>
              </div>
            )}

            {event.link && (
              <div className="modal-info-item">
                <span className="modal-info-icon"><LinkIcon size={20} aria-hidden="true" /></span>
                <div className="modal-info-details">
                  <span className="modal-label">Link</span>
                  <span className="modal-value">
                    <a href={event.link} target="_blank" rel="noopener noreferrer">Acessar</a>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="event-modal-footer">
          <button className="modal-btn-close" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

const formatEventDate = (date) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
  }).format(date);

export default function EventCarousel({ userNotes = [] }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tickerPaused, setTickerPaused] = useState(false);

  const events = useMemo(() => {
    const mappedNotes = userNotes.map((note, index) => ({
      id: note.id,
      title: note.title,
      date: formatEventDate(note.date),
      time: 'Nota adicionada',
      location: note.note || 'Sem observação informada',
      icon: StickyNote,
      color: ['blue', 'teal', 'cyan', 'green', 'purple'][index % 5],
      contact: null,
      link: note.attachments?.find((att) => att.type === 'link')?.url || null,
      isUserNote: true,
    }));

    return [...hostEvents, ...mappedNotes];
  }, [userNotes]);

  return (
    <section className="event-carousel-section">
      <div className="event-carousel-head">
        <SectionTitle tone="light">Eventos</SectionTitle>
        <button
          type="button"
          className="ticker-pause"
          onClick={() => setTickerPaused((p) => !p)}
          aria-pressed={tickerPaused}
          aria-label={tickerPaused ? 'Retomar rolagem dos eventos' : 'Pausar rolagem dos eventos'}
        >
          {tickerPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
        </button>
      </div>

      <div className="events-carousel-wrapper">
        <div className={`events-carousel-track${tickerPaused ? ' is-paused' : ''}`}>
          {/* Duplicamos os eventos para criar efeito contínuo */}
          {[...events, ...events].map((event, idx) => (
            <div 
              key={`${event.id}-${idx}`} 
              className={`event-card event-card-${event.color}`}
            >
              <div className="event-card-header">
                <span className="event-icon"><event.icon size={26} aria-hidden="true" /></span>
                <h3 className="event-title">{event.title}</h3>
              </div>
              
              <div className="event-card-body">
                <div className="event-info">
                  <div className="info-row">
                    <span className="info-label"><Calendar size={15} aria-hidden="true" /></span>
                    <span className="info-text">{event.date}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><Clock size={15} aria-hidden="true" /></span>
                    <span className="info-text">{event.time}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><MapPin size={15} aria-hidden="true" /></span>
                    <span className="info-text">{event.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="event-card-footer">
                <button className="event-btn" onClick={() => setSelectedEvent(event)}>Detalhes</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-gradient-left"></div>
      <div className="carousel-gradient-right"></div>

      {/* ===== MODAL DE DETALHES DO EVENTO ===== */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </section>
  );
}
