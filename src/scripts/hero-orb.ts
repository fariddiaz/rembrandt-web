import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  IcosahedronGeometry,
  ShaderMaterial,
  Vector2,
  Vector3,
  Clock,
  Points,
  BufferGeometry,
  Float32BufferAttribute,
  AdditiveBlending,
} from 'three';

const hex = (h: number) =>
  new Vector3(((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255);

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vDisp;

  float wave(vec3 p, float t) {
    return sin(p.x * 2.1 + t) * sin(p.y * 2.7 + t * 1.3) * sin(p.z * 2.4 + t * 0.8)
         + 0.5 * sin(p.x * 4.3 - t * 1.1) * sin(p.y * 3.9 + t * 0.6) * sin(p.z * 4.7 + t * 1.4);
  }

  void main() {
    float d = wave(normal + vec3(uMouse * 0.5, 0.0), uTime * 0.55) * (0.12 + uEnergy * 0.08);
    vec3 p = position + normal * d;
    vDisp = d;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCarbon;
  uniform vec3 uViolet;
  uniform vec3 uViolet2;
  uniform vec3 uWhite;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vDisp;

  void main() {
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.4); // Fresnel
    float bands = 0.5 + 0.5 * sin(vNormal.y * 8.0 + vDisp * 16.0 + uTime * 0.7); // Iridiscencia
    vec3 col = mix(uCarbon, uViolet2, smoothstep(0.04, 0.6, f));
    col = mix(col, uViolet, bands * f);
    col += uWhite * pow(f, 4.5) * 0.85; // Borde de brillo blanco
    float key = max(dot(vNormal, normalize(vec3(-0.5, 0.8, 0.6))), 0.0); // Luz Rembrandt
    col += uViolet * pow(key, 10.0) * 0.5;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function mountHeroOrb(canvas: HTMLCanvasElement) {
  const isMobile = window.innerWidth < 768;
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.z = 4.2;

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new Vector2() },
    uEnergy: { value: 0 },
    uCarbon: { value: hex(0x0a0a0d) },
    uViolet: { value: hex(0x8b5cf6) },
    uViolet2: { value: hex(0x7c3aed) },
    uWhite: { value: hex(0xfcfbfe) },
  };

  const orb = new Mesh(
    new IcosahedronGeometry(1.05, isMobile ? 24 : 44),
    new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    })
  );
  scene.add(orb);

  // Polvo de luz cósmico / Partículas aditivas
  const N = isMobile ? 200 : 500;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 1.5 + Math.random() * 1.6;
    const t = Math.random() * Math.PI * 2;
    const u = Math.acos(2 * Math.random() - 1);
    pos.set(
      [r * Math.sin(u) * Math.cos(t), r * Math.sin(u) * Math.sin(t), r * Math.cos(u)],
      i * 3
    );
  }

  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  const dust = new Points(
    dustGeo,
    new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms,
      vertexShader: /* glsl */ `
        uniform float uTime;
        void main() {
          vec3 p = position;
          p.y += sin(uTime * 0.35 + position.x * 2.0) * 0.08;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = 15.0 / -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uViolet;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          gl_FragColor = vec4(uViolet, smoothstep(0.5, 0.0, d) * 0.7);
        }
      `,
    })
  );
  scene.add(dust);

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    orb.position.x = w > 1024 ? 0.8 : 0;
  };

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const mouse = new Vector2();
  const onMove = (e: PointerEvent) => {
    mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  let progress = 0;
  const clock = new Clock();

  const tick = () => {
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uMouse.value.lerp(mouse, 0.05);
    uniforms.uEnergy.value += (mouse.length() * 0.5 - uniforms.uEnergy.value) * 0.05;
    orb.rotation.y += (mouse.x * 0.45 - orb.rotation.y) * 0.04 + 0.0018;
    orb.rotation.x += (-mouse.y * 0.25 - orb.rotation.x) * 0.04;
    orb.position.y = -progress * 1.1;
    orb.scale.setScalar(1 - progress * 0.3);
    dust.rotation.y = t * 0.025;
    renderer.render(scene, camera);
  };

  let onScreen = true;
  const sync = () => renderer.setAnimationLoop(onScreen && !document.hidden ? tick : null);

  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    sync();
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', sync);
  sync();

  return {
    setProgress: (p: number) => {
      progress = p;
    },
    destroy() {
      renderer.setAnimationLoop(null);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', sync);
      orb.geometry.dispose();
      dustGeo.dispose();
      renderer.dispose();
    },
  };
}
