import { Renderer, Program, Mesh, Triangle } from "ogl";

// Contour lines drawn per pixel: a smooth, low-frequency noise field, sliced into a few levels.
// Lines are anti-aliased with fwidth, so they stay hairline-thin at any size.
const vertex = /* glsl */ `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0., 1.); }`;

const fragment = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
uniform vec3 uBg;
uniform vec3 uInk;
uniform float uMix;
out vec4 color;

// 2D simplex noise (Ashima Arts, MIT).
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 p = gl_FragCoord.xy / uRes.y;           // square units, 1.0 = screen height
  p.y += uScroll * 0.00045;                     // the map flows past as the page scrolls
  float t = uTime * 0.018;
  float n = snoise(p * 0.42 + vec2(t, -t * 0.6)) * 0.82
          + snoise(p * 1.05 + vec2(-t * 0.7, t)) * 0.18;   // large, gentle shapes with a little wobble
  float v = n * 3.8;                            // a handful of levels: long, sweeping lines
  float d = abs(fract(v - 0.5) - 0.5) / fwidth(v);
  float line = 1.0 - clamp(d - 0.35, 0.0, 1.0); // about 1.2px, anti-aliased
  // Tone on tone: the line is the background nudged toward the text colour.
  color = vec4(mix(uBg, uInk, uMix), line);
}`;

const rgb = (css: string) => (css.match(/[\d.]+/g) ?? ["0", "0", "0"]).slice(0, 3).map((x) => +x / 255);

/** Full-screen contour lines behind the page. Returns null when WebGL2 isn't available (the page simply has no lines). */
export function createContours(canvas: HTMLCanvasElement, reduce: boolean) {
  let renderer: Renderer;
  try { renderer = new Renderer({ canvas, dpr: Math.min(1.5, devicePixelRatio), alpha: true, premultipliedAlpha: false, webgl: 2 }); }
  catch { return null; }
  const gl = renderer.gl;
  if (!gl || !(gl instanceof WebGL2RenderingContext)) return null;
  gl.clearColor(0, 0, 0, 0);

  const program = new Program(gl, {
    vertex, fragment, transparent: true,
    uniforms: { uRes: { value: [1, 1] }, uTime: { value: 0 }, uScroll: { value: 0 }, uBg: { value: [0, 0, 0] }, uInk: { value: [1, 1, 1] }, uMix: { value: 0.12 } },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const resize = () => {
    renderer.setSize(innerWidth, innerHeight);
    program.uniforms.uRes.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
  };
  resize();
  addEventListener("resize", resize);

  // The page colour changes between sections; read it a few times a second, not every frame.
  let lastRead = 0, bgKey = "";
  const readColours = (now: number) => {
    if (now - lastRead < 120) return;
    lastRead = now;
    const cs = getComputedStyle(document.body), key = cs.backgroundColor + cs.color;
    if (key === bgKey) return;
    bgKey = key;
    const bg = rgb(cs.backgroundColor);
    program.uniforms.uBg.value = bg;
    program.uniforms.uInk.value = rgb(cs.color);
    const light = bg[0] * 0.3 + bg[1] * 0.59 + bg[2] * 0.11 > 0.5;
    program.uniforms.uMix.value = light ? 0.075 : 0.13; // light grounds show dark lines more strongly than dark grounds show light ones
  };

  let raf = 0, running = true;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!running || document.hidden) return;
    readColours(now);
    program.uniforms.uTime.value = reduce ? 0 : now / 1000;
    program.uniforms.uScroll.value = reduce ? 0 : scrollY;
    renderer.render({ scene: mesh });
  };
  raf = requestAnimationFrame(frame);

  return {
    pause: (p: boolean) => { running = !p; },
    destroy: () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); },
  };
}
