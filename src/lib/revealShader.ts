import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";
import { gsap } from "gsap";
import { motion } from "./motion";

// Two photos of the same frame, black-and-white on top. A coarse mask (one cell per motion.revealCell CSS px) says how much colour shows
// in each cell: the pointer writes into it and every cell fades back each frame, so the colour "compiles in" round the pointer in blocks
// and decays along the trail. Cells part-way through get a one-pixel colour split, a hint of a render glitch.
const vertex = /* glsl */ `#version 300 es
in vec2 position;
out vec2 vUv;
void main() { vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0., 1.); }`;

const fragment = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D tBw;
uniform sampler2D tCol;
uniform sampler2D tMask;
uniform vec2 uRes;       // canvas size, CSS px
uniform vec2 uImg;       // photo size
uniform vec2 uMaskScale; // canvas size / mask size in px
uniform float uFocusY;   // where the crop sits vertically when the photo is cut top and bottom (1 = keep the top)
out vec4 color;

vec2 cover(vec2 uv) {
  float rs = uRes.x / uRes.y, ri = uImg.x / uImg.y;
  vec2 s = rs < ri ? vec2(rs / ri, 1.) : vec2(1., ri / rs);
  return uv * s + (1. - s) * vec2(.5, uFocusY);
}

void main() {
  vec2 uv = cover(vUv);
  float m = texture(tMask, vec2(vUv.x, 1. - vUv.y) * uMaskScale).r;
  float k = smoothstep(.12, .88, m);
  float edge = k * (1. - k) * 4.;
  vec3 bw = texture(tBw, uv).rgb;
  vec2 split = vec2(edge * .004, 0.);
  vec3 col = vec3(texture(tCol, uv + split).r, texture(tCol, uv).g, texture(tCol, uv - split).b);
  color = vec4(mix(bw, col, k), 1.);
}`;

const load = (src: string) => new Promise<HTMLImageElement>((ok, fail) => { const i = new Image(); i.decoding = "async"; i.onload = () => ok(i); i.onerror = fail; i.src = src; });

export type Reveal = { sweep: () => void; destroy: () => void };

/** Starts the reveal on `canvas`, reading the pointer over `area`. Resolves to null when WebGL 2 isn't available or a photo fails to load. */
export async function createReveal(canvas: HTMLCanvasElement, area: HTMLElement, src: { bw: string; colour: string }): Promise<Reveal | null> {
  let renderer: Renderer;
  try { renderer = new Renderer({ canvas, dpr: Math.min(2, devicePixelRatio), alpha: false, webgl: 2 }); }
  catch { return null; }
  const gl = renderer.gl;
  if (!gl || !(gl instanceof WebGL2RenderingContext)) return null;
  let bwImg: HTMLImageElement, colImg: HTMLImageElement;
  try { [bwImg, colImg] = await Promise.all([load(src.bw), load(src.colour)]); }
  catch { return null; }

  const tex = (image: HTMLImageElement) => new Texture(gl, { image, generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });
  const mask = new Texture(gl, { generateMipmaps: false, minFilter: gl.NEAREST, magFilter: gl.NEAREST, flipY: false });
  const program = new Program(gl, {
    vertex, fragment,
    uniforms: {
      tBw: { value: tex(bwImg) }, tCol: { value: tex(colImg) }, tMask: { value: mask },
      uRes: { value: [1, 1] }, uImg: { value: [bwImg.naturalWidth, bwImg.naturalHeight] }, uMaskScale: { value: [1, 1] }, uFocusY: { value: 0.8 },
    },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const cell = motion.revealCell;
  let w = 1, h = 1, cols = 1, rows = 1, cells = new Float32Array(1), data = new Uint8Array(4);
  const resize = () => {
    w = area.clientWidth; h = area.clientHeight;
    renderer.setSize(w, h);
    cols = Math.ceil(w / cell); rows = Math.ceil(h / cell);
    cells = new Float32Array(cols * rows); data = new Uint8Array(cols * rows * 4);
    program.uniforms.uRes.value = [w, h];
    program.uniforms.uMaskScale.value = [w / (cols * cell), h / (rows * cell)];
    dirty = true;
  };
  let dirty = true;
  const ro = new ResizeObserver(resize);
  ro.observe(area);
  resize();

  // The pointer, in CSS px inside the area. `on` while it is over the photo (or while the load sweep runs).
  const ptr = { x: 0, y: 0, on: false };
  const move = (e: PointerEvent) => { const r = area.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.on = true; };
  const leave = () => { ptr.on = false; };
  area.addEventListener("pointermove", move);
  area.addEventListener("pointerdown", move);
  area.addEventListener("pointerleave", leave);
  area.addEventListener("pointercancel", leave);

  const radius = motion.revealRadius / cell;
  const step = () => {
    let live = false;
    for (let i = 0; i < cells.length; i++) { const v = cells[i] * motion.revealDecay; cells[i] = v < 0.01 ? 0 : v; if (v) live = true; }
    if (ptr.on) {
      const cx = ptr.x / cell, cy = ptr.y / cell;
      const x0 = Math.max(0, Math.floor(cx - radius)), x1 = Math.min(cols - 1, Math.ceil(cx + radius));
      const y0 = Math.max(0, Math.floor(cy - radius)), y1 = Math.min(rows - 1, Math.ceil(cy + radius));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / radius;
        if (d < 1) { const i = y * cols + x; cells[i] = Math.max(cells[i], Math.min(1, (1 - d) * 1.6)); }
      }
      live = true;
    }
    if (!live && !dirty) return false;
    for (let i = 0; i < cells.length; i++) data[i * 4] = cells[i] * 255;
    mask.image = data; mask.width = cols; mask.height = rows; mask.needsUpdate = true;
    dirty = false;
    return true;
  };

  let raf = 0, visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(area);
  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    if (step()) renderer.render({ scene: mesh });
  };
  raf = requestAnimationFrame(frame);
  canvas.classList.add("ready");

  return {
    // One pass across the face on load: the photo shows its colour once, then settles back.
    sweep: () => {
      const p = { t: 0 };
      gsap.to(p, { t: 1, duration: 1.2, ease: "power2.inOut", onStart: () => { ptr.on = true; }, onUpdate: () => { ptr.x = w * (-0.1 + 1.2 * p.t); ptr.y = h * (0.15 + 0.35 * p.t); }, onComplete: leave });
    },
    destroy: () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      area.removeEventListener("pointermove", move); area.removeEventListener("pointerdown", move);
      area.removeEventListener("pointerleave", leave); area.removeEventListener("pointercancel", leave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
