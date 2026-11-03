// One small authored set, drawn on the Prox Yo grid: 1.75px strokes, square ends, mitred 45° corners like the face's cuts.
// Decorative: the text beside each icon carries the meaning. Brand marks are the official ones, untouched.
const base = { width: "1em", height: "1em", viewBox: "0 0 24 24", "aria-hidden": true, focusable: false } as const;
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "square", strokeLinejoin: "miter" } as const;

/** Out of the page: a diagonal with a chamfered head. */
export const ArrowOut = () => <svg {...base} {...line}><path d="M6.5 17.5 17 7M9 6.5h8.5V15" /></svg>;
/** Along the page (down by default). */
export const ArrowDown = ({ up = false }: { up?: boolean }) => <svg {...base} {...line} style={up ? { transform: "rotate(180deg)" } : undefined}><path d="M12 4.5v14M6 13l6 6 6-6" /></svg>;
export const Tick = () => <svg {...base} {...line}><path d="m4.5 12.5 4.5 4.5L19.5 6.5" /></svg>;
/** Two sheets with a cut corner. */
export const CopyIcon = () => <svg {...base} {...line}><path d="M9 9h8.5l2 2V20H9zM15 5.5V4H4.5v11.5H6" /></svg>;
/** The secondary button's brackets: [ and ]. */
export const Bracket = ({ right = false }: { right?: boolean }) => (
  <svg className="bk" viewBox="0 0 8 24" aria-hidden="true" focusable="false" {...line} style={right ? { transform: "scaleX(-1)" } : undefined}><path d="M7 3H2v18h5" /></svg>
);

// Official marks. X: the X logo from X's brand toolkit. GitHub: the mark from github.com/logos. One colour (currentColor), never altered.
export const XMark = () => (
  <svg {...base} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);
export const GitHubMark = () => (
  <svg {...base} fill="currentColor"><path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z" /></svg>
);
