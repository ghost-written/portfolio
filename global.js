function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'contact/', title: 'Contact' },
  { url: 'projects/', title: 'Projects'},
  { url: 'resume/', title: 'Resume' },
  { url: 'meta/', title: 'Meta'},
  { url: 'https://github.com/ghost-written', title: 'Github' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? '/'
    : '/portfolio/';

function setColorScheme(scheme) {
  document.documentElement.style.setProperty('color-scheme', scheme);
  console.log('color scheme changed to', scheme);
}


document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select id="color-scheme">
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  const select = document.querySelector('#color-scheme');

  select.addEventListener('input', function (event) {
    const scheme = event.target.value;
    setColorScheme(scheme);

  localStorage.colorScheme = scheme;
  });

  if ('colorScheme' in localStorage) {
    const savedScheme = localStorage.colorScheme;
    setColorScheme(savedScheme);

  select.value = savedScheme;
  }
}

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';

  projects.forEach((project) => {
    const article = document.createElement('article');

    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      ${project.year ? `<p class="project-year">${project.year}</p>` : ''}
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;

    containerElement.appendChild(article);
  });
}


export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
