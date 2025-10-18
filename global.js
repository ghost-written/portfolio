console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'contact/', title: 'Contact' },
  { url: 'projects/', title: 'Projects'},
  { url: 'resume/', title: 'Resume' },
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

  a.classList.toggle(
  'current',
  a.host === location.host && a.pathname === location.pathname,
  );

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
