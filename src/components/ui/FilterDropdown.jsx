import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "../../styles/ui.css";

// Filtro em dropdown: mostra só o valor atual (ou `allLabel`) e abre a lista ao
// clicar — bom para muitas opções (ex.: meses/anos). Fecha em clique-fora/Esc.
// Renderiza apenas o controle; envolva num wrapper com o rótulo na página
// (ex.: <div className="emg-filter"><span className="emg-filter-label">Período:</span> …).
// `value === null` representa "todos" (o `allLabel`).
export default function FilterDropdown({ allLabel, options, value, onChange, minWidth }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const pick = (v) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="ui-dropdown" ref={ref}>
      <button
        type="button"
        className={`ui-dd-toggle${open ? " open" : ""}`}
        style={minWidth ? { minWidth } : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{value || allLabel}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <ul className="ui-dd-menu" role="listbox">
          <li>
            <button type="button" className={`ui-dd-item${value === null ? " active" : ""}`} onClick={() => pick(null)}>
              {allLabel}
            </button>
          </li>
          {options.map((o) => (
            <li key={o}>
              <button type="button" className={`ui-dd-item${value === o ? " active" : ""}`} onClick={() => pick(o)}>
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
