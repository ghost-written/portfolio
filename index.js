import {fetchJSON, renderProjects, fetchGitHubData} from './global.js';

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);
const githubData = await fetchGitHubData('ghost-written');
const profileStats = document.querySelector('#profile-stats');

const projectsContainer = document.querySelector('.projects');

if (profileStats) {
  profileStats.innerHTML = `
    <dl class="stats-grid">
      <dt>Public Repos</dt>
      <dt>Public Gists</dt>
      <dt>Followers</dt>
      <dt>Following</dt>

      <dd>${githubData.public_repos}</dd>
      <dd>${githubData.public_gists}</dd>
      <dd>${githubData.followers}</dd>
      <dd>${githubData.following}</dd>
    </dl>
  `;
}

renderProjects(latestProjects, projectsContainer, 'h2');