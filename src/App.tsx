import { projects, type Project } from './projects';

function ProjectRow({ project }: { project: Project }) {
  return (
    <li className="project">
      <span className="project-number">{String(project.number).padStart(2, '0')}.</span>
      {project.status === 'upcoming' ? (
        <span className="upcoming">Upcoming</span>
      ) : (
        <div className="project-info">
          <a href={project.etherscanUrl}>{project.name}</a>
          <p>{project.description}</p>
          <a className="project-action" href={project.etherscanUrl}>Play on Etherscan <span aria-hidden="true">↗</span></a>
        </div>
      )}
    </li>
  );
}

export function App() {
  const launched = projects.filter((project) => project.status === 'live').length;

  return (
    <main>
      <header>
        <h1>Ten onchain projects.</h1>
        <p className="intro">An art experiment in demand, without token or NFT incentives.</p>
        <p className="byline">By <a href="https://twitter.com/surfcoderepeat">@surfcoderepeat on Twitter <span aria-hidden="true">↗</span></a></p>
      </header>

      <ul className="rules" aria-label="The constraints">
        <li>No tokens. No NFTs or ERC-20s.</li>
        <li>No pause switches or owner-only functions.</li>
        <li>No project UIs. Play only through Etherscan.</li>
      </ul>

      <p className="index-link"><a href="#projects">View the projects <span aria-hidden="true">↓</span></a></p>

      <section aria-labelledby="projects">
        <div className="section-heading">
          <h2 id="projects" tabIndex={-1}>Projects</h2>
          <span className="launch-count">{launched} / {projects.length} launched</span>
        </div>
        <p className="launch-note">Added here as they launch.</p>
        <ol className="projects" role="list">
          {projects.map((project) => <ProjectRow key={project.number} project={project} />)}
        </ol>
      </section>

      <footer>
        <p>The experiment: will you play when there’s nothing to collect?</p>
      </footer>
    </main>
  );
}
