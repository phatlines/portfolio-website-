type Props = { label: string; pressed: boolean; onClick: () => void };

/** A quick-pick button that fills the hero search. `pressed` marks the one that matches what's typed. */
export function FilterChip({ label, pressed, onClick }: Props) {
  return <button type="button" className="chip" aria-pressed={pressed} onClick={onClick}>{label}</button>;
}
