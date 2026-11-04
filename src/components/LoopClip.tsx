import { useEffect, useRef } from "react";
import type { Media } from "../content/types";
import { loopWhenVisible } from "../lib/pause";

/** A muted loop that plays only while on screen (or a still). Tall screenshots scroll slowly inside the frame. */
export function LoopClip({ media, className = "" }: { media: Media; className?: string }) {
  const vid = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    return loopWhenVisible(v, 0.25);
  }, []);
  if (media.kind === "video")
    return <video ref={vid} className={`clip ${className}`} src={media.src} poster={media.poster} muted loop playsInline preload="none" aria-label={media.alt} />;
  const tall = media.src.includes("-tall");
  return tall
    ? <div className={`clip clip-tall ${className}`} role="img" aria-label={media.alt} style={{ backgroundImage: `url(${media.src})` }} />
    : <img className={`clip ${className}`} src={media.src} alt={media.alt} loading="lazy" width={1600} height={1000} />;
}
