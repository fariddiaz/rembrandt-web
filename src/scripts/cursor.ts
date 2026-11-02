// ─────────────────────────────────────────────────────────────
// Cursor de Autor: Puntero de luz dual + Estela de partículas estelares (Stardust Trail)
// ─────────────────────────────────────────────────────────────
import { gsap } from 'gsap';

const FINE = '(hover: hover) and (pointer: fine)';

interface StardustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export function initCursor() {
  if (!matchMedia(FINE).matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.documentElement;
  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const ring = document.querySelector<HTMLElement>('.cursor-ring');
  const canvas = document.querySelector<HTMLCanvasElement>('.cursor-trail');
  if (!dot || !ring || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  root.classList.add('has-cursor');

  let mx = innerWidth / 2;
  let my = innerHeight / 2;
  let lastMx = mx;
  let lastMy = my;
  let rx = mx;
  let ry = my;
  let magnetTarget: { x: number; y: number } | null = null;
  let running = true;
  let press = 1;
  let pressTarget = 1;

  // ── Dimensiones del Canvas de Estela ─────────────────────────
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = innerWidth;
  let height = innerHeight;

  const resize = () => {
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ── Partículas y Camino de Polvo Estelar ─────────────────────
  const particles: StardustParticle[] = [];
  const trailPoints: TrailPoint[] = [];
  const MAX_TRAIL_POINTS = 14;
  const PALETTE = [
    '251, 191, 36',  // Oro cálido Rembrandt (#fbbf24)
    '216, 180, 254', // Violeta etéreo (#d8b4fe)
    '168, 85, 247',  // Amatista profundo (#a855f7)
    '255, 255, 255', // Diamante luz (#ffffff)
    '244, 63, 94',   // Rosa cósmico (#f43f5e)
  ];

  const spawnStardust = (x: number, y: number, count = 2) => {
    for (let i = 0; i < count; i++) {
      if (particles.length > 50) particles.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.9 + 0.2;
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const maxAlpha = Math.random() * 0.55 + 0.35;

      particles.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.15, // leve flotabilidad estelar ascendente
        size: Math.random() * 1.6 + 0.9,
        alpha: maxAlpha,
        maxAlpha,
        decay: Math.random() * 0.022 + 0.016,
        color,
      });
    }
  };

  // ── Movimiento del Puntero ───────────────────────────────────
  let isOverDialog = false;

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;

    mx = e.clientX;
    my = e.clientY;

    // Detectar si está sobre un modal / dialog para ceder el control al puntero nativo
    const target = e.target as Element | null;
    const inDialog = !!target?.closest('dialog, [data-lenis-prevent]');
    if (inDialog !== isOverDialog) {
      isOverDialog = inDialog;
      root.classList.toggle('cursor-hidden', inDialog);
    } else if (!inDialog) {
      root.classList.remove('cursor-hidden');
    }

    if (!isOverDialog) {
      // Registrar punto para el camino luminoso
      trailPoints.push({ x: mx, y: my, age: 0 });
      if (trailPoints.length > MAX_TRAIL_POINTS) trailPoints.shift();

      // Interpolar entre la posición anterior y actual si el ratón se mueve rápido
      const dist = Math.hypot(mx - lastMx, my - lastMy);
      const steps = Math.min(Math.floor(dist / 14), 4);
      for (let s = 1; s <= steps; s++) {
        const ix = lastMx + (mx - lastMx) * (s / (steps + 1));
        const iy = lastMy + (my - lastMy) * (s / (steps + 1));
        spawnStardust(ix, iy, 1);
      }
      spawnStardust(mx, my, 1);
    }

    lastMx = mx;
    lastMy = my;
  };

  addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('mouseleave', () => root.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => {
    if (!isOverDialog) root.classList.remove('cursor-hidden');
  });

  // Apagar en dispositivos táctiles si se detecta un toque
  addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType === 'touch') destroy();
    },
    { passive: true },
  );

  // ── Render Loop Principal (60–120 FPS) ───────────────────────
  const tick = () => {
    if (!running) return;

    // Física del anillo con retraso suave (inercia orgánica)
    const tx = magnetTarget ? magnetTarget.x : mx;
    const ty = magnetTarget ? magnetTarget.y : my;
    rx += (tx - rx) * 0.22;
    ry += (ty - ry) * 0.22;
    press += (pressTarget - press) * 0.25;

    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

    // Deformación cinemática sutil según velocidad
    const vx = tx - rx;
    const vy = ty - ry;
    const speed = Math.min(Math.hypot(vx, vy), 100);
    if (magnetTarget || speed < 0.6) {
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${press})`;
    } else {
      const angle = Math.atan2(vy, vx);
      const s = speed / 100;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) rotate(${angle}rad) scale(${(1 + s * 0.25) * press}, ${(1 - s * 0.18) * press})`;
    }

    // ── Dibujado en Canvas (Camino + Partículas) ─────────────────
    ctx.clearRect(0, 0, width, height);

    // 1. Dibujar el camino fluido de luz conectando puntos recientes
    if (trailPoints.length > 2) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 1; i < trailPoints.length; i++) {
        const p0 = trailPoints[i - 1];
        const p1 = trailPoints[i];
        p1.age += 0.08;

        const ratio = i / trailPoints.length;
        const alpha = Math.max(0, (1 - p1.age) * ratio * 0.25);
        if (alpha <= 0) continue;

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`;
        ctx.lineWidth = ratio * 2.2 + 0.6;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      ctx.restore();

      // Limpiar puntos viejos
      while (trailPoints.length > 0 && trailPoints[0].age >= 1) {
        trailPoints.shift();
      }
    }

    // 2. Dibujar y actualizar partículas de polvo estelar
    if (particles.length > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.alpha / p.maxAlpha), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowColor = `rgba(${p.color}, ${p.alpha * 0.8})`;
        ctx.shadowBlur = 6;
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // ── Interacción en Hover (Elegante, sin burbujas de texto) ───
  const interactive = 'a, button, [data-cursor], [data-magnetic], summary, label, [role="button"]';

  document.addEventListener('pointerover', (e) => {
    const el = (e.target as Element).closest<HTMLElement>(interactive);
    if (!el) return;
    ring.classList.add('is-hover');
  });

  document.addEventListener('pointerout', (e) => {
    const el = (e.target as Element).closest<HTMLElement>(interactive);
    if (!el) return;
    const to = (e.relatedTarget as Element | null)?.closest(interactive);
    if (to === el) return;
    ring.classList.remove('is-hover');
  });

  addEventListener('pointerdown', () => (pressTarget = 0.82));
  addEventListener('pointerup', () => (pressTarget = 1));

  // ── Magnetismo Suave en Botones ──────────────────────────────
  const magnets = document.querySelectorAll<HTMLElement>('[data-magnetic]');
  const cleanups: Array<() => void> = [];

  magnets.forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '') || 0.28;
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
      magnetTarget = { x: cx + dx * 0.2, y: cy + dy * 0.2 };
    };

    const leave = () => {
      magnetTarget = null;
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
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
    root.classList.remove('has-cursor', 'cursor-hidden');
    cleanups.forEach((fn) => fn());
    window.removeEventListener('resize', resize);
    removeEventListener('pointermove', onPointerMove);
  }
}
