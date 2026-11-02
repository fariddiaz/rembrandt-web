// ─────────────────────────────────────────────────────────────
// Orbe orgánico del hero: cristal líquido con ondas senoidales + ruido simplex,
// fresnel (bordes más brillantes que el centro) y polvo de luz.
// Se carga con import() dinámico DESPUÉS del LCP (ver HeroOrb.astro).
// ─────────────────────────────────────────────────────────────
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Points,
  Quaternion,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

// Ruido simplex 3D (Ashima Arts / Stefan Gustavson, licencia MIT)
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const orbVertex = /* glsl */ `
uniform float uTime;
uniform float uEnergy;
uniform vec3 uMouseDir;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;
${NOISE}

float displacement(vec3 n){
  float t = uTime * 0.32;
  float noise = snoise(n * 1.25 + vec3(t, t * 0.8, -t * 0.6));
  float waves = sin(n.y * 5.0 + uTime * 1.1) * 0.035 + sin(n.x * 6.0 - uTime * 0.8) * 0.025;
  float pull = pow(max(dot(n, uMouseDir), 0.0), 4.0) * (0.1 + uEnergy * 0.28);
  return noise * (0.15 + uEnergy * 0.1) + waves + pull;
}
vec3 displaced(vec3 n){ return n * (1.0 + displacement(n)); }

void main(){
  vec3 n = normalize(position);
  // normal recalculada por diferencias finitas (cristal sin facetas)
  vec3 tang = normalize(cross(n, abs(n.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0)));
  vec3 bitan = normalize(cross(n, tang));
  float e = 0.01;
  vec3 p0 = displaced(n);
  vec3 p1 = displaced(normalize(n + tang * e));
  vec3 p2 = displaced(normalize(n + bitan * e));
  vec3 objNormal = normalize(cross(p1 - p0, p2 - p0));
  if (dot(objNormal, n) < 0.0) objNormal = -objNormal;

  vDisp = displacement(n);
  vNormal = normalize(normalMatrix * objNormal);
  vec4 mv = modelViewMatrix * vec4(p0, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const orbFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uDeep;
uniform vec3 uViolet;
uniform vec3 uLight;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vViewPos);
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 2.4);

  // falsa refracción: bandas iridiscentes que se deforman con la superficie
  float band = 0.5 + 0.5 * sin(dot(N, vec3(2.1, 3.3, 1.2)) * 2.4 + uTime * 0.5 + vDisp * 9.0);
  vec3 core = mix(vec3(0.015, 0.012, 0.03), uDeep * 0.5, band * 0.55);

  // luz de Rembrandt: foco alto a la izquierda, sombra profunda a la derecha
  vec3 L = normalize(vec3(-0.65, 0.75, 0.55));
  float diff = pow(max(dot(N, L), 0.0), 2.2);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 90.0);

  vec3 col = core;
  col += uViolet * diff * 0.32;
  col += uViolet * fres * 1.25;
  col += uLight * pow(fres, 3.5) * 0.85;
  col += uLight * spec * 0.95;

  float alpha = clamp(0.62 + fres * 0.5 + spec, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}`;

const dustVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform vec2 uMouse;
attribute float aScale;
attribute float aSpeed;
varying float vAlpha;
void main(){
  vec3 p = position;
  float a = uTime * aSpeed * 0.08;
  float c = cos(a), s = sin(a);
  p.xz = mat2(c, -s, s, c) * p.xz;
  p.y += sin(uTime * 0.4 + aScale * 12.0) * 0.08;
  p.xy += uMouse * 0.15 * aScale;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aScale * 34.0 * uPixelRatio / -mv.z;
  vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.8 + aSpeed) + aScale * 30.0));
}`;

const dustFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor, a * a * vAlpha * 0.9);
}`;

export interface OrbOptions {
  reduceMotion?: boolean;
}

export function mountOrb(canvas: HTMLCanvasElement, opts: OrbOptions = {}) {
  const container = canvas.parentElement!;
  const isSmall = matchMedia('(max-width: 768px)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.75);

  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isSmall,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  // ── Orbe ──────────────────────────────────────────────────
  const orbUniforms = {
    uTime: { value: 0 },
    uEnergy: { value: 0 },
    uMouseDir: { value: new Vector3(0, 0, 1) },
    uDeep: { value: new Color('#7c3aed') },
    uViolet: { value: new Color('#8b5cf6') },
    uLight: { value: new Color('#fcfbfe') },
  };
  const orb = new Mesh(
    new IcosahedronGeometry(1.25, isSmall ? 28 : 56),
    new ShaderMaterial({
      vertexShader: orbVertex,
      fragmentShader: orbFragment,
      uniforms: orbUniforms,
      transparent: true,
    }),
  );
  scene.add(orb);

  // ── Polvo de luz ──────────────────────────────────────────
  const count = isSmall ? 260 : 650;
  const pos = new Float32Array(count * 3);
  const scale = new Float32Array(count);
  const speed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 1.7 + Math.random() * 2.2;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.75;
    pos[i * 3 + 2] = r * Math.cos(ph);
    scale[i] = 0.25 + Math.random() * 0.9;
    speed[i] = 0.3 + Math.random() * 1.2;
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  dustGeo.setAttribute('aScale', new Float32BufferAttribute(scale, 1));
  dustGeo.setAttribute('aSpeed', new Float32BufferAttribute(speed, 1));
  const dustUniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: dpr },
    uMouse: { value: new Vector2() },
    uColor: { value: new Color('#d8ccff') },
  };
  const dust = new Points(
    dustGeo,
    new ShaderMaterial({
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      uniforms: dustUniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  );
  scene.add(dust);

  // ── Ratón (y dedo en táctil) ──────────────────────────────
  const mouse = new Vector2();
  const smooth = new Vector2();
  let lastX = 0;
  let lastY = 0;
  let energyTarget = 0;
  const onMove = (e: PointerEvent) => {
    const nx = (e.clientX / innerWidth) * 2 - 1;
    const ny = -((e.clientY / innerHeight) * 2 - 1);
    const v = Math.hypot(nx - lastX, ny - lastY);
    energyTarget = Math.min(1, energyTarget + v * 4);
    lastX = nx;
    lastY = ny;
    mouse.set(nx, ny);
  };
  addEventListener('pointermove', onMove, { passive: true });

  // ── Tamaño ───────────────────────────────────────────────
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // ── Bucle (se pausa fuera de pantalla o con la pestaña oculta) ──
  let last = performance.now();
  const timeScale = opts.reduceMotion ? 0.2 : 1;
  let elapsed = 0;
  let visible = true;
  let raf = 0;
  let firstFrame = true;
  const invQ = new Quaternion();
  const dir = new Vector3();

  const render = () => {
    raf = requestAnimationFrame(render);
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt * timeScale;

    smooth.lerp(mouse, 0.06);
    energyTarget *= 0.95;
    orbUniforms.uEnergy.value += (energyTarget - orbUniforms.uEnergy.value) * 0.08;

    orb.rotation.y = elapsed * 0.12 + smooth.x * 0.5;
    orb.rotation.x = -smooth.y * 0.35;
    orb.position.x = smooth.x * 0.12;
    orb.position.y = smooth.y * 0.08;

    // dirección del ratón en espacio del objeto (para el "tirón" hacia el cursor)
    invQ.copy(orb.quaternion).invert();
    dir.set(smooth.x * 1.4, smooth.y * 1.4, 1).normalize().applyQuaternion(invQ);
    orbUniforms.uMouseDir.value.copy(dir);

    orbUniforms.uTime.value = elapsed;
    dustUniforms.uTime.value = elapsed;
    dustUniforms.uMouse.value.copy(smooth);
    dust.rotation.y = smooth.x * 0.15;

    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      canvas.classList.add('is-ready');
    }
  };

  const start = () => {
    if (raf || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(render);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? start() : stop();
  });
  io.observe(container);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  start();

  return function dispose() {
    stop();
    io.disconnect();
    ro.disconnect();
    removeEventListener('pointermove', onMove);
    document.removeEventListener('visibilitychange', onVis);
    orb.geometry.dispose();
    (orb.material as ShaderMaterial).dispose();
    dustGeo.dispose();
    (dust.material as ShaderMaterial).dispose();
    renderer.dispose();
  };
}
