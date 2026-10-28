import { site } from "../content/site";
import { SectionHeading } from "../components/SectionHeading";
import { Signature } from "../components/Signature";

export function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-h" data-paint="var(--black)" data-ink="var(--paper)">
      <SectionHeading id="about-h">{site.about.heading}</SectionHeading>
      <div className="about-body">
        {site.about.paragraphs.map((t, i) => <p key={i}>{t}</p>)}
        <Signature name={site.person} label={site.about.signatureLabel} />
      </div>
    </section>
  );
}
