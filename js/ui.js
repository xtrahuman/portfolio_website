// Small helpers: theme toggle and clipboard.

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
