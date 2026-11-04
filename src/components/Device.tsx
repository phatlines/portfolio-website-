import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { Project } from "../content/types";
import { loopWhenVisible } from "../lib/pause";

/** A project's live screen in its device: a browser window, a phone or a Mac window. Video loops play only while on screen. */
export function Device({ p, className = "" }: { p: Project; className?: string }) {
  const s = p.screen!;
  const vid = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    return loopWhenVisible(v, 0.2);
  }, []);

  if (s.frame === "phone" && s.crop) {
    // The phone is already drawn inside the poster: crop to its box.
    const [x, y, w, h, iw, ih] = s.crop;
    const style = { aspectRatio: `${w} / ${h}`, backgroundImage: `url(${s.src})`, backgroundSize: `${(iw / w) * 100}% auto`, backgroundPosition: `${(x / (iw - w)) * 100}% ${(y / (ih - h)) * 100}%` } as CSSProperties;
    return <div className={`dev dev-phone ${className}`} style={style} role="img" aria-label={p.media.alt} />;
  }
  const screen = s.kind === "video"
    ? <video ref={vid} src={s.src} poster={s.poster} muted loop playsInline preload="none" aria-label={p.media.alt} />
    : s.kind === "tall"
      ? <div className="dev-tall" role="img" aria-label={p.media.alt}><img src={s.src} alt="" loading="lazy" decoding="async" /></div>
      : <img src={s.src} alt={p.media.alt} loading="lazy" decoding="async" />;
  return (
    <div className={`dev dev-${s.frame} ${className}`}>
      <div className="dev-bar" aria-hidden="true"><i /><i /><i />{s.url && <span>{s.url}</span>}</div>
      <div className="dev-screen">{screen}</div>
    </div>
  );
}
