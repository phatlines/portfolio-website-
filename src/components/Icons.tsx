// Small line icons that inherit the text colour. Decorative: the link text next to them carries the meaning.
const base = { width: "1em", height: "1em", viewBox: "0 0 24 24", "aria-hidden": true, focusable: false } as const;

export const MailIcon = () => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
);

export const XIcon = () => (
  <svg {...base} fill="currentColor"><path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.17h1.7L7.4 4.74H5.58l11.09 14.43Z" /></svg>
);

export const ArrowIcon = ({ up = false }: { up?: boolean }) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    {up ? <path d="M12 19V5m-6 6 6-6 6 6" /> : <path d="M7 17 17 7M9 7h8v8" />}
  </svg>
);
