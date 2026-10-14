import {
  PROFILE, PROJECTS, FEATURED, ARCHIVED, SKILLS, esc, host,
} from '../shared/data.js';
import {
  initThemeButton, toggleTheme, copyText, mountSwitcher,
} from '../shared/ui.js';

const $ = (sel) => document.querySelector(sel);
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
document.querySelectorAll('.kbd-k').forEach((k) => {
  k.textContent = isMac ? '⌘K' : 'Ctrl K';
});

// ---------- toast ----------
const toastEl = $('#toast');
let toastTimer;
const toast = (msg) => {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2200);
};

const jump = (id) => document.getElementById(id).scrollIntoView({ block: 'start' });
const copyEmail = () => copyText(PROFILE.email).then(
  () => toast(`Email copied: ${PROFILE.email}`),
  () => toast(`${PROFILE.email} (copy it from the contact card)`),
);
const openResume = () => {
  if (PROFILE.resume) window.open(PROFILE.resume, '_blank', 'noopener');
  else toast('Résumé coming soon. Email me and I will send it.');
};

// ---------- content ----------
$('#count').textContent = `${PROJECTS.length} live projects, solo and with teams.`;
$('#fan').innerHTML = FEATURED.map((p) => `<img src="${p.img}" alt="">`).reverse().join('');
$('#mail').textContent = PROFILE.email;
$('#github').href = PROFILE.github;
$('#linkedin').href = PROFILE.linkedin;

$('#cases').innerHTML = FEATURED.map((p) => `
  <article class="case">
    <div class="shot">
      <div class="browser">
        <div class="chrome"><i></i><i></i><i></i><span>${esc(host(p.live))}</span></div>
        <img src="${p.img}" alt="Screenshot of ${esc(p.title)}" loading="lazy">
      </div>
    </div>
    <div class="body">
      <span class="eyebrow">${esc(p.kind)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.desc)}</p>
      <ul class="hl">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <ul class="chips">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="links">
        <a class="btn primary sm" href="${p.live}" target="_blank" rel="noopener noreferrer">See it live ↗</a>
        <a class="btn sm" href="${p.src}" target="_blank" rel="noopener noreferrer">Source ↗</a>
      </div>
    </div>
  </article>`).join('');

$('#earlier').innerHTML = ARCHIVED.map((p) => `
  <div>
    <div><b>${esc(p.title)}</b><span>${esc(p.one)}</span></div>
    <nav><a href="${p.live}" target="_blank" rel="noopener noreferrer">Live ↗</a><a href="${p.src}" target="_blank" rel="noopener noreferrer">Code ↗</a></nav>
  </div>`).join('');

$('#skillrows').innerHTML = SKILLS.map(([name, list]) => `
  <div class="skillrow">
    <b>${esc(name)}</b>
    <span class="track"><span class="fill" style="width:${(list.length / PROJECTS.length) * 100}%"></span></span>
    <span>${list.length} of ${PROJECTS.length}</span>
  </div>`).join('');

document.querySelectorAll('[data-jump]').forEach((b) => b.addEventListener('click', () => jump(b.dataset.jump)));
document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', copyEmail));
document.querySelectorAll('[data-resume]').forEach((b) => b.addEventListener('click', openResume));

// ---------- command palette ----------
const pal = $('#pal');
const q = $('#pal-q');
const list = $('#pal-list');
const ACTIONS = [
  { g: 'Navigate', label: 'Go to selected work', run: () => jump('work') },
  { g: 'Navigate', label: 'Go to skills', run: () => jump('skills') },
  { g: 'Navigate', label: 'Go to contact', run: () => jump('contact') },
  ...FEATURED.map((p) => ({
    g: 'Projects', label: `Open ${p.title}`, hint: host(p.live), href: p.live,
  })),
  ...PROJECTS.map((p) => ({
    g: 'Source code', label: `${p.title} on GitHub`, hint: 'github ↗', href: p.src,
  })),
  {
    g: 'Contact', label: 'Copy email address', hint: PROFILE.email, run: copyEmail,
  },
  {
    g: 'Contact', label: 'Open LinkedIn', hint: 'linkedin ↗', href: PROFILE.linkedin,
  },
  {
    g: 'Contact', label: 'Open GitHub profile', hint: 'github.com/xtrahuman', href: PROFILE.github,
  },
  { g: 'Contact', label: 'Get my résumé', run: openResume },
  { g: 'Settings', label: 'Toggle light or dark theme', run: toggleTheme },
  {
    g: 'Other concepts', label: 'See this portfolio as a code editor', href: '../editor/', same: true,
  },
  {
    g: 'Other concepts', label: 'See this portfolio as a desktop OS', href: '../desktop/', same: true,
  },
];
let hits = [];
let sel = 0;

const renderPalette = () => {
  const words = q.value.toLowerCase().split(/\s+/).filter(Boolean);
  hits = ACTIONS.filter((a) => {
    const text = `${a.label} ${a.hint || ''} ${a.g}`.toLowerCase();
    return words.every((w) => text.includes(w));
  });
  sel = Math.min(sel, Math.max(0, hits.length - 1));
  if (!hits.length) {
    list.innerHTML = `<li class="pal-empty">No matches for “${esc(q.value)}”. Try “email” or “space”.</li>`;
    return;
  }
  let lastGroup = '';
  list.innerHTML = hits.map((a, i) => {
    const head = a.g !== lastGroup ? `<li class="grp" role="presentation">${a.g}</li>` : '';
    lastGroup = a.g;
    const inner = `${esc(a.label)}${a.hint ? `<small>${esc(a.hint)}</small>` : ''}`;
    const target = a.same ? '' : ' target="_blank" rel="noopener noreferrer"';
    const control = a.href
      ? `<a href="${a.href}"${target} tabindex="-1">${inner}</a>`
      : `<button type="button" tabindex="-1">${inner}</button>`;
    return `${head}<li role="option" data-i="${i}" class="${i === sel ? 'on' : ''}" aria-selected="${i === sel}">${control}</li>`;
  }).join('');
  const on = list.querySelector('li.on');
  if (on) on.scrollIntoView({ block: 'nearest' });
};

const openPalette = () => {
  pal.hidden = false;
  q.value = '';
  sel = 0;
  renderPalette();
  q.focus();
};
const closePalette = () => { pal.hidden = true; };
const fire = (i) => {
  const action = hits[i];
  if (!action) return;
  closePalette();
  if (action.run) action.run();
};

document.querySelectorAll('[data-palette]').forEach((b) => b.addEventListener('click', openPalette));
q.addEventListener('input', () => {
  sel = 0;
  renderPalette();
});
q.addEventListener('keydown', (e) => {
  const n = Math.max(1, hits.length);
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    sel = (sel + 1) % n;
    renderPalette();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    sel = (sel - 1 + n) % n;
    renderPalette();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const link = list.querySelector('li.on a');
    if (link) {
      link.click();
      closePalette();
    } else fire(sel);
  } else if (e.key === 'Escape') closePalette();
});
list.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-i]');
  if (!li) return;
  const index = Number(li.dataset.i);
  if (hits[index].href) closePalette();
  else fire(index);
});
pal.addEventListener('pointerdown', (e) => {
  if (e.target === pal) closePalette();
});
document.addEventListener('keydown', (e) => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName);
  if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    if (pal.hidden) openPalette();
    else closePalette();
  } else if (e.key === '/' && !typing && pal.hidden) {
    e.preventDefault();
    openPalette();
  }
});

initThemeButton($('#theme'));
mountSwitcher('clean');
