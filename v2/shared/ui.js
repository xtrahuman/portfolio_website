// Small helpers shared by every v2 concept: theme toggle, clipboard and the concept switcher.

const SUN = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 1.8v2.4M10 15.8v2.4M1.8 10h2.4M15.8 10h2.4M4.2 4.2l1.7 1.7M14.1 14.1l1.7 1.7M4.2 15.8l1.7-1.7M14.1 5.9l1.7-1.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const MOON = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';

const root = document.documentElement;
const sysDark = window.matchMedia('(prefers-color-scheme: dark)');

export const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : sysDark.matches);

export function setTheme(theme) {
  root.dataset.theme = theme;
  try {
    window.localStorage.setItem('theme', theme);
  } catch (e) {
    // storage can be blocked; the theme still applies for this visit
  }
  document.dispatchEvent(new CustomEvent('themechange'));
}

export const toggleTheme = () => setTheme(isDark() ? 'light' : 'dark');

export function initThemeButton(button) {
  const paint = () => {
    button.innerHTML = isDark() ? SUN : MOON;
  };
  button.addEventListener('click', toggleTheme);
  document.addEventListener('themechange', paint);
  sysDark.addEventListener('change', paint);
  paint();
}

export function copyText(text) {
  if (!navigator.clipboard) return Promise.reject(new Error('Clipboard unavailable'));
  return navigator.clipboard.writeText(text);
}

const CONCEPTS = [
  ['clean', 'Clean + ⌘K'],
  ['editor', 'Code editor'],
  ['api', 'API docs'],
  ['desktop', 'Desktop OS'],
];

// Floating pill for jumping between concepts while you compare them. Remove it when you pick one.
export function mountSwitcher(current) {
  const nav = document.createElement('nav');
  nav.className = 'cx';
  nav.setAttribute('aria-label', 'Portfolio concepts');
  const links = CONCEPTS.map(([id, label]) => `<a href="../${id}/"${id === current ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  nav.innerHTML = `<a class="cx-all" href="../">All concepts</a>${links}<button type="button" class="cx-toggle" aria-expanded="true">Hide</button>`;
  const toggle = nav.querySelector('.cx-toggle');
  const setMin = (min) => {
    nav.classList.toggle('cx-min', min);
    toggle.textContent = min ? 'Concepts' : 'Hide';
    toggle.setAttribute('aria-expanded', String(!min));
    try {
      window.sessionStorage.setItem('cx-min', min ? '1' : '');
    } catch (e) {
      // ignore blocked storage
    }
  };
  toggle.addEventListener('click', () => setMin(!nav.classList.contains('cx-min')));
  let startMin = false;
  try {
    startMin = window.sessionStorage.getItem('cx-min') === '1';
  } catch (e) {
    startMin = false;
  }
  setMin(startMin);
  document.body.append(nav);
}
