import React from 'react';
import { CalendarDays } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import EmptyState from '../ui/EmptyState';

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function getDaysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
}

const sameMonth = (date, ref) =>
  date.getMonth() === ref.getMonth() && date.getFullYear() === ref.getFullYear();

// Calendário de publicações + lista lateral de eventos/notas. O estado das notas
// e o modal vivem no HomePage (orquestrador); aqui só lemos e disparamos
// callbacks (onAddNote / onDeleteNote). Extraído do HomePage.
export default function CalendarSection({
  currentMonth,
  setCurrentMonth,
  selectedDate,
  setSelectedDate,
  events,
  notes,
  onAddNote,
  onDeleteNote,
}) {
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const hasEvent = (day) => {
    const match = (item) => item.date.getDate() === day && sameMonth(item.date, currentMonth);
    return events.some(match) || notes.some(match);
  };

  const getEventForDay = (day) => {
    const match = (item) => item.date.getDate() === day && sameMonth(item.date, currentMonth);
    return events.find(match) || notes.find(match) || null;
  };

  const previousMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const monthItems = [
    ...events.filter((event) => sameMonth(event.date, currentMonth)),
    ...notes.filter((n) => sameMonth(n.date, currentMonth)),
  ].sort((a, b) => a.date - b.date);

  const renderAttachments = (item) =>
    (item.attachments || []).map((att) => (
      <div key={att.id} style={{ marginTop: 6 }}>
        {att.type === 'link' ? (
          <a href={att.url} target="_blank" rel="noreferrer">{att.name}</a>
        ) : (
          <a href={att.url} target="_blank" rel="noreferrer" download>{att.name}</a>
        )}
      </div>
    ));

  return (
    <section className="calendar-section">
      <SectionTitle>Calendário e Publicações</SectionTitle>
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
              const today = new Date();
              const isToday =
                day === today.getDate() && sameMonth(today, currentMonth);

              return (
                <div
                  key={day}
                  className={`calendar-day ${hasEventMarker ? 'has-event' : ''} ${isToday ? 'today' : ''} ${selectedDate === day ? 'selected' : ''}`}
                  onClick={() => setSelectedDate((prev) => (prev === day ? null : day))}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedDate((prev) => (prev === day ? null : day)); }}
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
                      <div style={{ flex: 1 }}>
                        <strong>{ev.title}</strong>
                        <p>{ev.note}</p>
                        {renderAttachments(ev)}
                      </div>
                      {ev.isUser && (
                        <div style={{ marginLeft: 8 }}>
                          <button className="attach-file-btn" onClick={() => onDeleteNote(ev.id)}>Excluir</button>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="no-events">
                  <p>Nenhum evento para {selectedDate}/{currentMonth.getMonth() + 1}</p>
                  <button className="add-note-btn" onClick={() => onAddNote(selectedDate)}>+ Adicionar Nota</button>
                </div>
              )}
            </div>
          ) : (
            <div className="upcoming-events">
              {monthItems.length === 0 && (
                <EmptyState
                  icon={CalendarDays}
                  title="Sem eventos neste mês"
                  description="Selecione um dia para adicionar uma nota."
                />
              )}
              {monthItems.map((event) => (
                <div key={event.id} className="event-preview">
                  <span className="event-date">{event.date.getDate()}</span>
                  <div className="event-details">
                    <strong>{event.title}</strong>
                    <small>{event.note}</small>
                    {renderAttachments(event)}
                  </div>
                  {event.isUser && (
                    <div style={{ marginLeft: 8 }}>
                      <button className="attach-file-btn" onClick={() => onDeleteNote(event.id)}>Excluir</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
