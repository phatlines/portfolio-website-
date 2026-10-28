export function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 className="section-h" id={id}>{children}</h2>;
}
