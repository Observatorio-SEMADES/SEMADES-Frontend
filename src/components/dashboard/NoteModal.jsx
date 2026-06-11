import React, { useEffect, useState } from 'react';

// Modal de criação de nota (apenas demonstração em memória). Owns o estado do
// formulário; ao salvar, entrega { title, observation, files, links } ao
// HomePage, que monta a nota (id/data/attachments). Os object URLs dos arquivos
// são criados aqui e passam a viver na nota — por isso só revogamos os que o
// usuário remove ANTES de salvar; a limpeza final é feita no HomePage.
export default function NoteModal({ selectedDate, currentMonth, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    observation: '',
    links: [],
    linkInput: '',
    files: [], // { id, name, url, type }
  });

  // Trava o scroll do fundo enquanto o modal está aberto.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLink = () => {
    const url = form.linkInput.trim();
    if (!url) return;
    setForm((prev) => ({ ...prev, links: [...prev.links, url], linkInput: '' }));
  };

  const handleRemoveLink = (idx) => {
    setForm((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const fileObjs = files.map((f) => ({
      id: 'f' + (Date.now() + Math.random()).toString(36),
      name: f.name,
      url: URL.createObjectURL(f),
      type: f.type || 'file',
    }));
    setForm((prev) => ({ ...prev, files: [...prev.files, ...fileObjs] }));
    e.target.value = null;
  };

  const handleRemoveAttachment = (id) => {
    const file = form.files.find((f) => f.id === id);
    if (file && file.url) URL.revokeObjectURL(file.url);
    setForm((prev) => ({ ...prev, files: prev.files.filter((f) => f.id !== id) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: form.title,
      observation: form.observation,
      files: form.files,
      links: form.links,
    });
  };

  return (
    <div className="note-modal-overlay" onClick={onClose}>
      <div className="note-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Adicionar Nota - {selectedDate}/{currentMonth.getMonth() + 1}/{currentMonth.getFullYear()}</h3>
        <form onSubmit={handleSubmit}>
          {/* Título com placeholder (sem label) */}
          <input
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Título da nota"
            aria-label="Título da nota"
            autoComplete="off"
          />

          {/* Observação com placeholder (sem label) */}
          <textarea
            name="observation"
            rows="4"
            value={form.observation}
            onChange={handleInputChange}
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

          {form.files.length > 0 && (
            <div className="attachments-list">
              {form.files.map((f) => (
                <div key={f.id} className="attachment-row">
                  <a href={f.url} target="_blank" rel="noreferrer" download>{f.name}</a>
                  <button type="button" onClick={() => handleRemoveAttachment(f.id)}>Remover</button>
                </div>
              ))}
            </div>
          )}

          {/* Links com placeholder */}
          <div className="link-row" style={{ display: 'flex', gap: 8 }}>
            <input
              name="linkInput"
              value={form.linkInput}
              onChange={handleInputChange}
              placeholder="https://..."
              aria-label="Adicionar link"
            />
            <button type="button" onClick={handleAddLink}>Adicionar</button>
          </div>
          {form.links.length > 0 && (
            <div className="links-widget" aria-live="polite">
              {form.links.map((lnk, idx) => (
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

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-save">Salvar (temporário)</button>
          </div>
        </form>
      </div>
    </div>
  );
}
