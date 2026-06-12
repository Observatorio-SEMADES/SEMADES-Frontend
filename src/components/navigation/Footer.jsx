import React from "react";
import { MapPin } from "lucide-react";
import "../../styles/Footer.css";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/semadescg/",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17" cy="7" r="1" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@PrefCGR",
    icon: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="3" />
        <path d="M10 9.5L15 12L10 14.5Z" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/prefcg/",
    icon: <path d="M14 8H16V4H13.5C10.9 4 9 5.9 9 8.6V11H6V15H9V21H13V15H16L17 11H13V8.8C13 8.3 13.4 8 14 8Z" />,
  },
  {
    label: "Site",
    href: "https://www.campogrande.ms.gov.br",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9H20.4" />
        <path d="M3.6 15H20.4" />
        <path d="M12 3C14.3 5.5 15.5 8.5 15.5 12C15.5 15.5 14.3 18.5 12 21" />
        <path d="M12 3C9.7 5.5 8.5 8.5 8.5 12C8.5 15.5 9.7 18.5 12 21" />
      </>
    ),
  },
];

function FooterIcon({ children }) {
  return (
    <svg
      className="semades-footer-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="semades-footer no-print">
      <div className="semades-footer-accent" aria-hidden="true" />
      <div className="semades-footer-content">
        <div className="semades-footer-main">
          <div className="semades-footer-brand">
            <span className="semades-footer-kicker">Prefeitura de Campo Grande</span>
            <h2>Observatório SEMADES</h2>
          </div>

          <section className="semades-footer-address" aria-label="Endereço institucional">
            <span className="semades-footer-address-mark" aria-hidden="true">
              <MapPin size={16} strokeWidth={1.9} />
            </span>
            <p>R. Mal. Rondon, 2655 - Centro, Campo Grande - MS, Brasil</p>
          </section>

          <nav className="semades-footer-socials" aria-label="Redes oficiais">
            {socialLinks.map((item) => (
              <a
                className="semades-footer-social-link"
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                title={item.label}
              >
                <FooterIcon>{item.icon}</FooterIcon>
              </a>
            ))}
          </nav>
        </div>

        <div className="semades-footer-bottom">
          <span className="semades-footer-copyright">
            © {currentYear} Observatório SEMADES — Prefeitura de Campo Grande
          </span>
          <div className="semades-footer-meta">
            <span className="semades-footer-meta-text">LGPD</span>
            <span className="semades-footer-meta-separator" aria-hidden="true">•</span>
            <span className="semades-footer-meta-text">Privacidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
