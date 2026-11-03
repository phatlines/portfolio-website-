import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { site } from "../content/site";
import { motion, reduceMotion } from "../lib/motion";
import { scramble } from "../lib/scramble";
import { TopBar } from "../sections/TopBar";
import { ContactCard } from "../components/ContactCard";

const copy = site.notFound;

/** The address they asked for, read in their own browser and never sent anywhere. Null when there is nothing worth showing. */
const askedFor = () => {
  try {
    const p = decodeURIComponent(location.pathname);
    if (p === "/" || /^\/404(\.html)?$/.test(p)) return null;
    return p.length > 48 ? `${p.slice(0, 47)}…` : p;
  } catch { return null; }
};

const suggestions = [
  { href: "/", label: copy.home },
  { href: "/#work", label: site.nav.work },
  { href: "/#resume", label: site.nav.resume },
  { href: "/#contact", label: site.nav.contact },
];

/** The router file as it reads in the editor; the line marked `err` is the one that failed. */
const code: { t: string; err?: boolean }[] = [
  { t: 'import { routes } from "./sections";' },
  { t: "" },
  { t: "export function route(path: string) {" },
  { t: "  const page = routes.find((r) => r.path === path);" },
  { t: "  if (!page) throw new RouteError(404, path);", err: true },
  { t: "  return page;" },
  { t: "}" },
];

/**
 * The 404 as the hero's editor window after a failed build: router.tsx open with the failing line underlined,
 * and the output panel showing the compile error, the route that failed and "did you mean" links to real sections.
 */
export function NotFound() {
  const root = useRef<HTMLDivElement>(null);
  const path = askedFor();

  useLayoutEffect(() => {
    document.title = copy.title;
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      const digits = root.current!.querySelector<HTMLElement>(".nf-404")!;
      digits.textContent = "000";
      gsap.timeline()
        .from(".nf-code li", { autoAlpha: 0, x: -6, stagger: 0.04, duration: 0.25 }, 0.1)
        .from(".nf-squiggle", { scaleX: 0, transformOrigin: "0 50%", duration: 0.4, ease: "power2.out" }, 0.5)
        .from(".nf-log li", { autoAlpha: 0, x: -8, stagger: 0.08, duration: 0.3 }, 0.7)
        .add(() => scramble(digits, "404", 1.1), 1)
        .from(".nf-in", { autoAlpha: 0, y: 12, stagger: 0.07, duration: 0.6, ease: motion.easeSoft }, 1.2);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="nf">
      <TopBar home />
      <main className="nf-main">
        <div className="ide nf-ide">
          <div className="ide-title" aria-hidden="true"><i /><i /><i /><span>{copy.ide.title}</span></div>
          <div className="ide-body">
            <div className="ide-tree" aria-hidden="true">
              <p className="ide-label">{site.hero.ide.explorer}</p>
              <p className="ide-folder">{site.hero.ide.folder}</p>
              <ul>{copy.ide.files.map((f) => <li key={f}><span className={`ide-file${f === copy.ide.file ? " on nf-bad" : ""}`}>{f}</span></li>)}</ul>
            </div>
            <div className="ide-pane nf-pane">
              <div className="ide-tabs" aria-hidden="true"><span className="on nf-bad">{copy.ide.file}</span></div>
              <ol className="nf-code" aria-hidden="true">
                {code.map((l, i) => (
                  <li key={i} className={l.err ? "err" : undefined}>
                    {l.err ? <>  if (!page) throw new RouteError(404, <span className="nf-squiggle">path</span>);<span className="nf-lens">{copy.error}{path ? `: ${path}` : ""}</span></> : l.t}
                  </li>
                ))}
              </ol>
              <div className="nf-out">
                <div className="nf-out-tabs" aria-hidden="true"><span>{copy.ide.problems} <b>1</b></span><span className="on">{copy.ide.output}</span><span>{copy.ide.terminal}</span></div>
                <div className="nf-out-body">
                  <ol className="nf-log mono" aria-hidden="true">
                    <li><span className="nf-prompt">&gt;</span> {site.loader.cmd}</li>
                    <li className="nf-fail">✖ {copy.ide.failed}</li>
                    <li className="nf-file">./src/{copy.ide.file}:5:42</li>
                    <li className="nf-err">{copy.error}</li>
                    <li>&nbsp;&nbsp;at GET {path ?? "/"}</li>
                    <li>&nbsp;&nbsp;at phatlines.router ({copy.ide.file}:5)</li>
                  </ol>
                  <p className="nf-404" aria-hidden="true">404</p>
                  <h1 className="nf-h nf-in">{copy.heading}</h1>
                  <p className="nf-path nf-in">{path ? <>{copy.path} <b className="mono">{path}</b></> : copy.noPath}</p>
                  <nav className="nf-in" aria-label={copy.didYouMean}>
                    <p className="nf-mean">{copy.didYouMean}</p>
                    <ul className="nf-links">{suggestions.map((s) => <li key={s.href}><a className="btn btn-link" href={s.href}>{s.label}</a></li>)}</ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div className="ide-status nf-status" aria-hidden="true">
            <span>⎇ {site.hero.ide.branch}</span>
            <span className="nf-count">⊗ 1 · ⚠ 0</span>
            <span className="ide-meta">{site.hero.ide.meta.map((m) => <span key={m}>{m}</span>)}</span>
          </div>
        </div>
      </main>
      <ContactCard />
    </div>
  );
}
