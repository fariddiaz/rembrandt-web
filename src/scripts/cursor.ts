// ─────────────────────────────────────────────────────────────
// Cursor magnético: anillo elástico + punto + burbujas de texto.
// Uso en el HTML:
//   data-magnetic            → el elemento es atraído por el cursor
//   data-magnetic="0.5"      → fuerza personalizada (0–1)
//   data-cursor="VER"        → el anillo se convierte en burbuja con ese texto
// Solo se activa con ratón/trackpad (hover + pointer fine). En táctil no existe.
// ─────────────────────────────────────────────────────────────
import { gsap } from 'gsap';

const FINE = '(hover: hover) and (pointer: fine)';

export function initCursor() {
  if (!matchMedia(FINE).matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.documentElement;
  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const ring = document.querySelector<HTMLElement>('.cursor-ring');
  const label = ring?.querySelector<HTMLElement>('.cursor-label');
  if (!dot || !ring || !label) return;

  root.classList.add('has-cursor');

  let mx = innerWidth / 2;
  let my = innerHeight / 2;
  let rx = mx;
  let ry = my;
  let labelMode = false;
  let magnetTarget: { x: number; y: number } | null = null;
  let running = true;
  let press = 1;
  let pressTarget = 1;

  // ── Movimiento ──────────────────────────────────────────────
  addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      mx = e.clientX;
      my = e.clientY;
      root.classList.remove('cursor-hidden');
    },
    { passive: true },
  );
  document.addEventListener('mouseleave', () => root.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => root.classList.remove('cursor-hidden'));

  // Dispositivos híbridos: si llega un toque, se apaga el cursor limpiamente
  addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType === 'touch') destroy();
    },
    { passive: true },
  );

  const tick = () => {
    if (!running) return;
    const tx = magnetTarget ? magnetTarget.x : mx;
    const ty = magnetTarget ? magnetTarget.y : my;
    rx += (tx - rx) * 0.2;
    ry += (ty - ry) * 0.2;
    press += (pressTarget - press) * 0.25;

    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

    // Estiramiento elástico según velocidad (se desactiva en modo burbuja)
    const vx = tx - rx;
    const vy = ty - ry;
    const speed = Math.min(Math.hypot(vx, vy), 120);
    if (labelMode || magnetTarget || speed < 0.4) {
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${press})`;
    } else {
      const angle = Math.atan2(vy, vx);
      const s = speed / 120;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) rotate(${angle}rad) scale(${(1 + s * 0.45) * press}, ${(1 - s * 0.3) * press})`;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // ── Burbujas de texto y hover ───────────────────────────────
  const interactive = 'a, button, [data-cursor], [data-magnetic], summary, label';
  document.addEventListener('pointerover', (e) => {
    const el = (e.target as Element).closest<HTMLElement>(interactive);
    if (!el) return;
    const text = el.dataset.cursor;
    if (text) {
      label.textContent = text;
      ring.classList.add('is-label');
      labelMode = true;
    } else {
      ring.classList.add('is-hover');
    }
  });
  document.addEventListener('pointerout', (e) => {
    const el = (e.target as Element).closest<HTMLElement>(interactive);
    if (!el) return;
    const to = (e.relatedTarget as Element | null)?.closest(interactive);
    if (to === el) return;
    ring.classList.remove('is-label', 'is-hover');
    labelMode = false;
  });
  addEventListener('pointerdown', () => (pressTarget = 0.82));
  addEventListener('pointerup', () => (pressTarget = 1));

  // ── Magnetismo ──────────────────────────────────────────────
  const magnets = document.querySelectorAll<HTMLElement>('[data-magnetic]');
  const cleanups: Array<() => void> = [];
  magnets.forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '') || 0.35;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      xTo(dx * strength);
      yTo(dy * strength);
      // el anillo se "pega" al centro del botón con un poco de holgura
      magnetTarget = labelMode ? null : { x: cx + dx * 0.25, y: cy + dy * 0.25 };
    };
    const leave = () => {
      magnetTarget = null;
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.set(el, { x: 0, y: 0 });
    });
  });

  function destroy() {
    running = false;
    root.classList.remove('has-cursor');
    cleanups.forEach((fn) => fn());
  }
}
