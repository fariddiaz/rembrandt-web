// ─────────────────────────────────────────────────────────────
// WhatsApp flotante inteligente.
// Cada <section> declara data-wa-label y data-wa-message (desde site.ts).
// La sección que cruza el centro de la pantalla define el texto y el mensaje.
// ─────────────────────────────────────────────────────────────
import { waLink } from '../config/site';

export function initWhatsApp() {
  const btn = document.querySelector<HTMLAnchorElement>('[data-wa-float]');
  const labelEl = btn?.querySelector<HTMLElement>('[data-wa-text]');
  const sections = document.querySelectorAll<HTMLElement>('[data-wa-label][data-wa-message]');
  if (!btn || !labelEl || !sections.length) return;

  let current = '';

  const setActive = (section: HTMLElement) => {
    const label = section.dataset.waLabel!;
    const message = section.dataset.waMessage!;
    if (label === current) return;
    current = label;
    btn.href = waLink(message);
    btn.setAttribute('aria-label', `${label}: abrir WhatsApp`);
    // Cambio de texto con transición corta (ancho animado con CSS)
    labelEl.classList.add('is-swapping');
    window.setTimeout(() => {
      labelEl.textContent = label;
      labelEl.classList.remove('is-swapping');
    }, 180);
  };

  // Franja central del 10% de la pantalla: evita parpadeos entre secciones
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target as HTMLElement);
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  );
  sections.forEach((s) => io.observe(s));

  // Aparece tras un breve scroll para no competir con los CTA del hero
  const reveal = () => {
    btn.classList.toggle('is-visible', scrollY > innerHeight * 0.35);
  };
  reveal();
  addEventListener('scroll', reveal, { passive: true });
}
