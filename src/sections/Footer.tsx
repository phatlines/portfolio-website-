import { site } from "../content/site";
import { ArrowDown, GitHubMark, XMark } from "../components/Icons";

/** Rights, social links and the wordmark half under the edge; hovering lifts it. */
export function Footer() {
  const f = site.footer, s = site.social;
  return (
    <footer className="footer">
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
