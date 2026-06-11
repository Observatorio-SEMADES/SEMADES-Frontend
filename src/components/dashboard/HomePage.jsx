import React, { useState, useEffect } from 'react';
import '../../styles/HomePage.css';
import HeroCarousel from './HeroCarousel';
import AboutSection from './AboutSection';
import CalendarSection from './CalendarSection';
import NoteModal from './NoteModal';
import EventCarousel from './EventCarousel';
import Noticias from './Noticias';
import { eventosCalendario } from '../../data/eventos';

// Página inicial. Orquestra o estado das notas (em memória, apenas a sessão) e o
// modal; as seções viram componentes próprios (HeroCarousel, AboutSection,
// CalendarSection, NoteModal). O calendário usa os eventos estáticos + as notas.
export default function HomePage() {
  const events = eventosCalendario;

  const [notes, setNotes] = useState([]); // notas adicionadas pelo usuário (sessão)
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Abre o modal já com a data escolhida no calendário.
  const openAddNoteModal = (day) => {
    setSelectedDate(day);
    setShowNoteModal(true);
  };

  // Recebe os campos do NoteModal e monta a nota (id, data, anexos). Os object
  // URLs dos arquivos foram criados no modal e seguem vivos dentro da nota.
  const handleSubmitNote = ({ title, observation, files, links }) => {
    if (!selectedDate) return;
    const noteDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate);
    const newNote = {
      id: 'note-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      date: noteDate,
      title: title || `Nota ${selectedDate}/${currentMonth.getMonth() + 1}`,
      note: observation || '',
      attachments: [
        ...files.map((f) => ({ id: f.id, name: f.name, url: f.url, type: f.type })),
        ...links.map((lnk, i) => ({ id: 'link-' + i + '-' + Date.now(), name: lnk, url: lnk, type: 'link' })),
      ],
      isUser: true,
    };
    setNotes((prev) => [...prev, newNote]);
    setShowNoteModal(false);
  };

  // Exclusão de notas adicionadas pelo usuário (revoga os object URLs dos anexos).
  const deleteNote = (noteId) => {
    const note = notes.find((n) => n.id === noteId);
    if (note && note.attachments) {
      note.attachments.forEach((att) => { if (att.type !== 'link' && att.url) URL.revokeObjectURL(att.url); });
    }
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (selectedDate) setSelectedDate(null);
  };

  // Revoga URLs ao desmontar para não vazar memória.
  useEffect(() => {
    return () => {
      notes.forEach((n) => {
        (n.attachments || []).forEach((att) => { if (att.type !== 'link' && att.url) URL.revokeObjectURL(att.url); });
      });
    };
  }, [notes]);

  return (
    <>
      <HeroCarousel />

      <AboutSection />

      <Noticias />

      <div className="homepage-container">
        <CalendarSection
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          events={events}
          notes={notes}
          onAddNote={openAddNoteModal}
          onDeleteNote={deleteNote}
        />

        {/* Seção de Eventos Animados do Host */}
        <EventCarousel userNotes={notes} />

        {showNoteModal && (
          <NoteModal
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            onClose={() => setShowNoteModal(false)}
            onSubmit={handleSubmitNote}
          />
        )}
      </div>
    </>
  );
}
