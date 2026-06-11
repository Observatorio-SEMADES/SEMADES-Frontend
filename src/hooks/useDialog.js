import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

// Acessibilidade de modal: prende o foco dentro do diálogo (Tab/Shift+Tab),
// fecha no Esc, trava o scroll do fundo e devolve o foco ao elemento que abriu
// o modal ao desmontar. Use o ref retornado no contêiner do diálogo (que deve
// ter role="dialog" aria-modal="true" e tabIndex={-1}).
export function useDialog(onClose) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return undefined;

    const previouslyFocused = document.activeElement;

    // Foca o primeiro elemento interativo (ou o próprio diálogo).
    const focusables = () => Array.from(node.querySelectorAll(FOCUSABLE));
    (focusables()[0] || node).focus();

    // Trava o scroll do fundo enquanto aberto.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => {
      node.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [onClose]);

  return dialogRef;
}
