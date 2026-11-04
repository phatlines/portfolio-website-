import { useRef } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { scramble } from "../lib/scramble";
import { isScrolling } from "../lib/scrolling";
import { Bracket } from "./Icons";

type Variant = "primary" | "secondary" | "link";
type Common = { variant?: Variant; children: string; icon?: ReactNode; className?: string };
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & { href: string };
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined };

/**
 * The three buttons, each with one hover signature:
 * primary: the label runs through code glyphs and resolves while a lighter fill rises from the cut corner;
 * secondary: square brackets slide in round the label; link: a block caret runs along the underline and blinks.
 * The label is read from aria-label, so a screen reader never hears the scramble. The scramble waits while the page is scrolling, so buttons sliding under a still pointer do not flash glyphs.
 */
export function Button({ variant = "primary", children, icon, className = "", ...rest }: AsLink | AsButton) {
  const label = useRef<HTMLSpanElement>(null);

  const run = () => { if (variant === "primary" && label.current && !isScrolling()) scramble(label.current, children); }; // not while the page scrolls under a still pointer
  const inner = (
    <>
      {variant === "secondary" && <Bracket />}
      {variant === "primary"
        // An invisible copy of the text holds the width; the visible copy runs the scramble on top of it, so the button never changes size and nothing is measured.
        ? <span className="btn-label btn-stack" aria-hidden="true"><span className="btn-size">{children}</span><span className="btn-text" ref={label}>{children}</span></span>
        : <span className="btn-label" aria-hidden="true">{children}</span>}
      {icon && <span className="btn-icon" aria-hidden="true">{icon}</span>}
      {variant === "secondary" && <Bracket right />}
    </>
  );
  const props = { className: `btn btn-${variant} ${className}`, "aria-label": children, onPointerEnter: run, onFocus: run };
  if (rest.href !== undefined) return <a {...props} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{inner}</a>;
  return <button type="button" {...props} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>{inner}</button>;
}
