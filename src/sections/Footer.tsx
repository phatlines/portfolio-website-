import { useEffect, useState } from "react";
import { site } from "../content/site";
import { ArrowDown, GitHubMark, XMark } from "../components/Icons";

const londonTime = () => new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" }).format(new Date());

/** A real build stamp (this deploy's date and commit), the time in London, and the wordmark half under the edge; hovering lifts it. */
export function Footer() {
  const [time, setTime] = useState(londonTime);
  useEffect(() => {
    const t = setInterval(() => setTime(londonTime()), 30_000);
    return () => clearInterval(t);
  }, []);
  const f = site.footer, s = site.social;
  return (
    <footer className="footer">
      <div className="ft-row">
        <p className="ft-stamp mono">{f.built} · {f.deployed} <time dateTime={__BUILD_DATE__}>{__BUILD_DATE__}</time> · <span className="ft-commit">{__BUILD_COMMIT__}</span></p>
        <p className="ft-time mono">{f.london} <time>{time}</time></p>
      </div>
      <div className="ft-row">
        <p className="ft-rights">{f.rights}</p>
        <ul className="ft-social">
          <li><a href={s.github.url} target="_blank" rel="noreferrer" aria-label={`${s.github.label} ${s.github.handle}`}><GitHubMark /></a></li>
          <li><a href={s.x.url} target="_blank" rel="noreferrer" aria-label={`${s.x.label} ${s.x.handle}`}><XMark /></a></li>
          <li><a className="btn btn-link" href="#top">{site.contact.backToTop}<ArrowDown up /></a></li>
        </ul>
      </div>
      <a className="ft-word" href="#top" aria-hidden="true" tabIndex={-1}>{site.name}</a>
    </footer>
  );
}
