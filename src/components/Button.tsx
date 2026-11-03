import { useLayoutEffect, useRef } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { scramble } from "../lib/scramble";
import { Bracket } from "./Icons";

type Variant = "primary" | "secondary" | "link";
type Common = { variant?: Variant; children: string; icon?: ReactNode; className?: string };
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & { href: string };
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined };

/**
 * The three buttons, each with one hover signature:
 * primary: the label runs through code glyphs and resolves while a lighter fill rises from the cut corner;
 * secondary: square brackets slide in round the label; link: a block caret runs along the underline and blinks.
 * The label is read from aria-label, so a screen reader never hears the scramble.
 */
export function Button({ variant = "primary", children, icon, className = "", ...rest }: AsLink | AsButton) {
  const label = useRef<HTMLSpanElement>(null);

  // Hold the label's width so the scramble never makes the button twitch.
  useLayoutEffect(() => {
    const el = label.current;
    if (variant !== "primary" || !el) return;
    const fix = () => { el.style.width = ""; el.style.width = `${Math.ceil(el.getBoundingClientRect().width)}px`; };
    fix();
    document.fonts.ready.then(fix);
  }, [variant, children]);

  const run = () => { if (variant === "primary" && label.current) scramble(label.current, children); };
  const inner = (
    <>
      {variant === "secondary" && <Bracket />}
      <span className="btn-label" ref={label} aria-hidden="true">{children}</span>
      {icon && <span className="btn-icon" aria-hidden="true">{icon}</span>}
      {variant === "secondary" && <Bracket right />}
    </>
  );
  const props = { className: `btn btn-${variant} ${className}`, "aria-label": children, onPointerEnter: run, onFocus: run };
  if (rest.href !== undefined) return <a {...props} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{inner}</a>;
  return <button type="button" {...props} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>{inner}</button>;
}
