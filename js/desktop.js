/* eslint-disable no-use-before-define */
import {
  PROFILE, PUBLICATION, PROJECTS, FEATURED, ARCHIVED, SKILLS, STACK, esc, host,
} from './data.js';
import {
  initThemeButton, isDark, setTheme, copyText,
} from './ui.js';

const BLANK = 'target="_blank" rel="noopener noreferrer"';
const phone = window.matchMedia('(max-width: 720px)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* ---------- icons ---------- */
const PAGE = '<path d="M10 4h14l7 7v23a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="var(--paper)" stroke="var(--paper-edge)"/><path d="M24 4v7h7" fill="none" stroke="var(--paper-edge)"/>';
const SVG = {
  folder: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M4 10a3 3 0 0 1 3-3h8.5l4 4H33a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="var(--folder)"/><path d="M4 15.5h32V30a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="var(--folder-front)"/></svg>',
  md: `<svg viewBox="0 0 40 40" aria-hidden="true">${PAGE}<rect x="11" y="18" width="18" height="11" rx="2" fill="var(--accent)"/><path d="M14 26v-5l2 2.4 2-2.4v5M22 21v4.6M20.2 24l1.8 2 1.8-2" fill="none" stroke="var(--accent-ink)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  person: `<svg viewBox="0 0 40 40" aria-hidden="true">${PAGE}<circle cx="19.5" cy="21" r="4" fill="var(--accent)"/><path d="M12.5 32a7 7 0 0 1 14 0z" fill="var(--accent)"/></svg>`,
  monitor: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="6" width="32" height="23" rx="3" fill="var(--paper)" stroke="var(--paper-edge)"/><path d="M15 34h10M20 29v5" stroke="var(--paper-edge)" stroke-width="2" stroke-linecap="round"/><rect x="9" y="18" width="4" height="7" rx="1" fill="var(--accent)"/><rect x="15" y="12" width="4" height="13" rx="1" fill="var(--accent)"/><rect x="21" y="15" width="4" height="10" rx="1" fill="var(--accent)" opacity=".7"/><rect x="27" y="20" width="4" height="5" rx="1" fill="var(--accent)" opacity=".5"/></svg>',
  term: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="7" width="32" height="26" rx="4" fill="var(--term-bg)" stroke="var(--paper-edge)" stroke-opacity=".5"/><path d="M10.5 15.5l5 4-5 4" fill="none" stroke="var(--term-green)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 24.5h10" stroke="var(--term-fg)" stroke-width="2.4" stroke-linecap="round"/></svg>',
  mail: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="9" width="32" height="22" rx="3" fill="var(--paper)" stroke="var(--paper-edge)"/><path d="M5.5 11.5L20 22l14.5-10.5" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  pdf: `<svg viewBox="0 0 40 40" aria-hidden="true">${PAGE}<rect x="6" y="20" width="20" height="10" rx="2" fill="#d6524a"/><text x="16" y="27.6" text-anchor="middle" font-family="ui-monospace, monospace" font-size="7" font-weight="700" fill="#fff">CV</text></svg>`,
  app: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="5" y="7" width="30" height="26" rx="4" fill="var(--paper)" stroke="var(--paper-edge)"/><path d="M5 13h30" stroke="var(--paper-edge)"/><circle cx="9" cy="10" r="1.2" fill="var(--paper-edge)"/><circle cx="13" cy="10" r="1.2" fill="var(--paper-edge)"/><rect x="9" y="17" width="22" height="12" rx="2" fill="var(--accent)" opacity=".85"/></svg>',
  classic: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="7" y="6" width="26" height="28" rx="3" fill="var(--paper)" stroke="var(--paper-edge)"/><path d="M12 13h16M12 18h16M12 23h10" stroke="var(--paper-edge)" stroke-width="1.8" stroke-linecap="round"/></svg>',
  linkedin: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="5" y="5" width="30" height="30" rx="6" fill="#2867b2"/><path d="M12 17h4v12h-4zM14 10.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4zM19 17h3.8v1.7c.6-1 1.9-2 3.9-2 4 0 4.3 2.6 4.3 6V29h-4v-5.6c0-1.4 0-3.1-1.9-3.1s-2.1 1.5-2.1 3V29h-4z" fill="#fff"/></svg>',
};
const UI = {
  min: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 9h8" stroke="currentColor" stroke-width="1.5"/></svg>',
  max: '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="2" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  close: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" stroke-width="1.5"/></svg>',
  back: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  prev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  up: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const BEST_STEP = 2;
const statusPill = '<span class="pill"><i></i>Open to build</span>';
const srcLink = (p, label, cls = '') => (p.src ? `<a${cls ? ` class="${cls}"` : ''} href="${p.src}" ${BLANK}>${label}</a>` : '');
const liveLink = (p, label, cls = '') => (p.live ? `<a${cls ? ` class="${cls}"` : ''} href="${p.live}" ${BLANK}>${label}</a>` : '');
// the main button goes to the live site when there is one, otherwise to the code
const projectButtons = (p) => (p.live
  ? `${liveLink(p, 'See it live ↗', 'btn primary')}${srcLink(p, 'View source ↗', 'btn')}`
  : srcLink(p, 'View code on GitHub ↗', 'btn primary'));
const mainUrl = (p) => p.live || p.src;
const paperLink = `<a href="${PUBLICATION.url}" ${BLANK}>${esc(PUBLICATION.title)}</a>`;

/* ---------- apps ---------- */
const APPS = {
  welcome: {
    title: 'welcome.md', icon: 'md', w: 520, h: 520, render: renderWelcome,
  },
  about: {
    title: 'about-me.md', icon: 'person', w: 560, h: 620, render: renderAboutMe,
  },
  projects: {
    title: 'projects', icon: 'folder', w: 700, h: 470, render: renderExplorer,
  },
  skills: {
    title: 'skills.sys — system monitor', icon: 'monitor', w: 620, h: 470, render: renderSkills,
  },
  terminal: {
    title: 'terminal — tsh', icon: 'term', w: 600, h: 360, render: renderTerminal,
  },
  contact: {
    title: 'contact.app', icon: 'mail', w: 470, h: 360, render: renderContact,
  },
  resume: {
    title: 'resume.pdf', icon: 'pdf', w: 420, h: 280, render: renderResume,
  },
};
PROJECTS.forEach((p) => {
  APPS[p.id] = {
    title: `${p.id}.app`, icon: 'app', w: 620, h: 600, render: (body) => renderProject(body, p),
  };
});

const DESKTOP_ICONS = [
  { app: 'about', label: 'about-me.md' },
  { app: 'projects', label: 'projects' },
  { app: 'skills', label: 'skills.sys' },
  { app: 'terminal', label: 'terminal' },
  { app: 'resume', label: 'resume.pdf' },
  { app: 'contact', label: 'contact.app' },
];

const desk = document.getElementById('desk');
const iconLayer = document.getElementById('icons');
const tasks = document.getElementById('tasks');
const toast = document.getElementById('toast');
const wins = new Map();
let z = 10;
let opened = 0;

/* ---------- window manager ---------- */
const topWin = () => [...wins.entries()]
  .filter(([, v]) => !v.el.hidden)
  .sort((a, b) => b[1].el.style.zIndex - a[1].el.style.zIndex)[0];

function focusWin(id) {
  wins.forEach((r, k) => {
    r.el.classList.toggle('focused', k === id);
    r.task.classList.toggle('active', k === id);
  });
  const rec = wins.get(id);
  if (!rec) return;
  z += 1;
  rec.el.style.zIndex = z;
  if (rec.onFocus) rec.onFocus();
}

function focusTop() {
  const next = topWin();
  if (next) focusWin(next[0]);
}

function minimize(id) {
  const rec = wins.get(id);
  if (!rec) return;
  rec.el.hidden = true;
  rec.el.classList.remove('focused');
  rec.task.classList.remove('active');
  focusTop();
}

function closeApp(id) {
  const rec = wins.get(id);
  if (!rec) return;
  rec.el.remove();
  rec.task.remove();
  wins.delete(id);
  focusTop();
}

function makeDraggable(el, bar) {
  bar.addEventListener('dblclick', (e) => {
    if (!e.target.closest('button') && !phone.matches) el.classList.toggle('max');
  });
  bar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || phone.matches || el.classList.contains('max') || e.button !== 0) return;
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = el.offsetLeft;
    const oy = el.offsetTop;
    bar.setPointerCapture(e.pointerId);
    const move = (ev) => {
      el.style.left = `${clamp(ox + ev.clientX - sx, 80 - el.offsetWidth, desk.clientWidth - 80)}px`;
      el.style.top = `${clamp(oy + ev.clientY - sy, 0, desk.clientHeight - 40)}px`;
    };
    const up = () => {
      bar.removeEventListener('pointermove', move);
      bar.removeEventListener('pointerup', up);
      bar.removeEventListener('pointercancel', up);
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up);
    bar.addEventListener('pointercancel', up);
  });
}

function openApp(id, opts = {}) {
  const app = APPS[id];
  if (!app) return false;
  if (wins.has(id)) {
    wins.get(id).el.hidden = false;
    focusWin(id);
    return true;
  }
  const el = document.createElement('section');
  el.className = `win${opts.instant ? '' : ' pop'}`;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', app.title);
  el.innerHTML = `
    <header class="bar">
      <button type="button" class="back" data-act="close" aria-label="Back to home">${UI.back}</button>
      <span class="glyph">${SVG[app.icon]}</span>
      <span class="ttl">${esc(app.title)}</span>
      <div class="ctl">
        <button type="button" data-act="min" aria-label="Minimize">${UI.min}</button>
        <button type="button" data-act="max" aria-label="Maximize">${UI.max}</button>
        <button type="button" data-act="close" aria-label="Close">${UI.close}</button>
      </div>
    </header>
    <div class="body"></div>`;

  const W = desk.clientWidth;
  const H = desk.clientHeight;
  const w = Math.min(app.w, W - 24);
  const h = Math.min(app.h, H - 24);
  const n = opened % 6;
  opened += 1;
  const cascadeX = clamp(Math.round(W / 2 - w / 2 - 60 + n * 30), 12, W - w - 12);
  const x = opts.x !== undefined ? opts.x : cascadeX;
  const y = opts.y !== undefined ? opts.y : clamp(30 + n * 30, 12, Math.max(12, H - h - 12));
  Object.assign(el.style, {
    width: `${w}px`, height: `${h}px`, left: `${x}px`, top: `${y}px`,
  });
  desk.append(el);

  const task = document.createElement('button');
  task.type = 'button';
  task.className = 'task';
  task.innerHTML = `${SVG[app.icon]}<span>${esc(app.title)}</span>`;
  task.addEventListener('click', () => {
    if (!el.hidden && el.classList.contains('focused')) minimize(id);
    else {
      el.hidden = false;
      focusWin(id);
    }
  });
  tasks.append(task);

  const rec = { el, task, app };
  wins.set(id, rec);
  app.render(el.querySelector('.body'), rec);

  el.addEventListener('pointerdown', () => focusWin(id), true);
  el.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const { act } = b.dataset;
    if (act === 'close') closeApp(id);
    else if (act === 'min') minimize(id);
    else el.classList.toggle('max');
  }));
  makeDraggable(el, el.querySelector('.bar'));
  focusWin(id);
  return true;
}

/* ---------- desktop icons ---------- */
let lastPointer = 'mouse';
const iconEls = DESKTOP_ICONS.map((d) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'icon';
  b.innerHTML = `${SVG[APPS[d.app].icon]}<span class="lbl">${esc(d.label)}</span>${d.badge ? `<span class="badge">${d.badge}</span>` : ''}`;
  let moved = false;
  b.addEventListener('pointerdown', (e) => {
    lastPointer = e.pointerType;
    if (phone.matches || e.button !== 0) return;
    moved = false;
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = b.offsetLeft;
    const oy = b.offsetTop;
    b.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      moved = true;
      b.classList.add('dragging');
      b.style.left = `${clamp(ox + dx, 0, desk.clientWidth - b.offsetWidth)}px`;
      b.style.top = `${clamp(oy + dy, 0, desk.clientHeight - b.offsetHeight)}px`;
    };
    const up = () => {
      b.classList.remove('dragging');
      b.removeEventListener('pointermove', move);
      b.removeEventListener('pointerup', up);
    };
    b.addEventListener('pointermove', move);
    b.addEventListener('pointerup', up);
  });
  b.addEventListener('click', (e) => {
    if (moved) {
      moved = false;
      return;
    }
    if (phone.matches || lastPointer === 'touch' || e.detail === 0) {
      openApp(d.app);
      return;
    }
    iconEls.forEach((other) => other.classList.toggle('sel', other === b));
  });
  b.addEventListener('dblclick', () => openApp(d.app));
  iconLayer.append(b);
  return b;
});

const layoutIcons = () => {
  const rows = Math.max(1, Math.floor((desk.clientHeight - 20) / 98));
  iconEls.forEach((b, i) => {
    b.style.left = `${14 + Math.floor(i / rows) * 102}px`;
    b.style.top = `${14 + (i % rows) * 98}px`;
  });
};
layoutIcons();
desk.addEventListener('pointerdown', (e) => {
  if (e.target === desk || e.target === iconLayer) iconEls.forEach((b) => b.classList.remove('sel'));
});

/* ---------- welcome notification ---------- */
toast.querySelector('.x').innerHTML = UI.close;
desk.classList.add('toasting');
toast.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.open) openApp(b.dataset.open);
  toast.hidden = true;
  desk.classList.remove('toasting');
});
document.getElementById('status').addEventListener('click', () => openApp('contact'));

/* ---------- shared helpers ---------- */
function wireCopy(scope) {
  scope.querySelectorAll('[data-copy]').forEach((btn) => btn.addEventListener('click', () => {
    const label = btn.textContent;
    copyText(PROFILE.email).then(() => {
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = label; }, 1600);
    }, () => {
      const out = scope.querySelector('output');
      if (out) {
        const range = document.createRange();
        range.selectNodeContents(out);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
      btn.textContent = 'Selected, press Ctrl+C';
    });
  }));
}
function wireOpen(scope) {
  scope.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => openApp(b.dataset.open)));
}

/* ---------- app renderers ---------- */
function renderWelcome(body) {
  body.innerHTML = `
    <div class="welcome">
      <div class="idrow">
        <div class="avatar" aria-hidden="true">TO</div>
        <div>${statusPill}<span class="eyebrow">Software engineer</span></div>
      </div>
      <h1>${esc(PROFILE.name)}</h1>
      <p class="lead">I build web apps end to end: <b>Python</b> and <b>Node.js</b> on the back, <b>React</b> and <b>Next.js</b> on the front.</p>
      <dl class="facts">
        <div><dt>Projects</dt><dd>${PROJECTS.length}</dd></div>
        <div><dt>Main stack</dt><dd>Python · TypeScript</dd></div>
        <div><dt>Leads</dt><dd>Team of 5</dd></div>
      </dl>
      <div class="actions">
        <button type="button" class="btn primary" data-open="projects">View my work</button>
        <button type="button" class="btn" data-open="about">About me</button>
        <button type="button" class="btn" data-open="resume">Résumé</button>
      </div>
      <p class="devhint">Developer? Drag anything around, or type <code>help</code> in the terminal.</p>
    </div>`;
  wireOpen(body);
}

function renderAboutMe(body) {
  body.innerHTML = `
    <div class="summary">
      <span class="eyebrow">~/about-me.md</span>
      <h2>Hi, I'm Tochukwu.</h2>
      <div>${statusPill}</div>
      <p class="one">I'm a senior software engineer based in Canada. I lead teams and build in whatever language a project needs, especially <b>Python</b>, <b>JavaScript</b> and <b>Ruby</b>, and I direct AI agents to keep building fast and fun.</p>
      <h3>Best work</h3>
      <ul class="best">${FEATURED.map((p, i) => `
        <li${i >= BEST_STEP ? ' hidden' : ''}>
          <img src="${p.img}" alt="">
          <div class="t">
            <button type="button" data-open="${p.id}">${esc(p.title)}</button>
            <span>${esc(p.one)}</span>
            <nav>${liveLink(p, 'Live ↗')}${srcLink(p, 'Code ↗')}</nav>
          </div>
        </li>`).join('')}
      </ul>
      ${FEATURED.length > BEST_STEP ? `<button type="button" class="btn sm more-work">Show ${Math.min(BEST_STEP, FEATURED.length - BEST_STEP)} more</button>` : ''}
      <h3>Publication</h3>
      <p class="one">${paperLink} (2025)</p>
      <h3>Background</h3>
      <p class="one">MSc Computer Science, Birmingham City University · BSc Mechanical Engineering, University of Ibadan</p>
      <h3>Stack</h3>
      <ul class="tags">${STACK.map((t) => `<li>${t}</li>`).join('')}</ul>
      <h3>Get in touch</h3>
      <div class="mailrow">
        <output>${esc(PROFILE.email)}</output>
        <button type="button" class="btn primary sm" data-copy>Copy email</button>
        <a class="btn sm" href="${PROFILE.linkedin}" ${BLANK}>LinkedIn ↗</a>
        <a class="btn sm" href="${PROFILE.github}" ${BLANK}>GitHub ↗</a>
        <button type="button" class="btn sm" data-open="resume">Résumé</button>
      </div>
    </div>`;
  wireOpen(body);
  wireCopy(body);
  // best work starts with two projects; each click reveals two more, then links to the folder
  const more = body.querySelector('.more-work');
  if (more) {
    more.addEventListener('click', () => {
      const hiddenItems = [...body.querySelectorAll('.best li[hidden]')];
      if (!hiddenItems.length) {
        openApp('projects');
        return;
      }
      hiddenItems.slice(0, BEST_STEP).forEach((li) => { li.hidden = false; });
      const left = hiddenItems.length - BEST_STEP;
      more.textContent = left > 0 ? `Show ${Math.min(BEST_STEP, left)} more` : 'Open projects folder';
    });
  }
}

function renderExplorer(body, rec) {
  let path = 'projects';
  const tile = (p) => `
    <button type="button" class="tile" data-proj="${p.id}">
      <span class="thumb"><img src="${p.img}" alt="Screenshot of ${esc(p.title)}" loading="lazy"></span>
      <span class="nm">${p.id}.app</span>
      <span class="meta">${p.tags.slice(0, 3).join(' · ')}</span>
    </button>`;
  const folderTile = `
    <button type="button" class="tile" data-folder="archive">
      <span class="thumb">${SVG.folder}</span>
      <span class="nm">archive/</span>
      <span class="meta">${ARCHIVED.length} older projects</span>
    </button>`;
  const draw = () => {
    const root = path === 'projects';
    const items = root ? FEATURED : ARCHIVED;
    body.innerHTML = `
      <div class="explorer">
        <div class="toolbar">
          <button type="button" data-up aria-label="Up one folder"${root ? ' disabled' : ''}>${UI.up}</button>
          <div class="path">~/${root ? 'projects' : 'projects/archive'}</div>
          <span class="count">${items.length + (root ? 1 : 0)} items</span>
        </div>
        <div class="grid">${items.map(tile).join('')}${root ? folderTile : ''}</div>
      </div>`;
    body.querySelector('[data-up]').addEventListener('click', () => {
      path = 'projects';
      draw();
    });
    body.querySelectorAll('[data-folder]').forEach((b) => b.addEventListener('click', () => {
      path = 'archive';
      draw();
    }));
    body.querySelectorAll('[data-proj]').forEach((b) => b.addEventListener('click', () => openApp(b.dataset.proj)));
    rec.el.querySelector('.ttl').textContent = root ? 'projects' : 'projects/archive';
  };
  draw();
}

// screenshot slider: swipe, arrow buttons, dots or the arrow keys
function wireSlider(frame) {
  const track = frame.querySelector('.slides');
  const dots = [...frame.querySelectorAll('.dots button')];
  const count = dots.length;
  const index = () => Math.round(track.scrollLeft / track.clientWidth);
  const go = (i) => {
    const target = (i + count) % count;
    track.scrollTo({ left: target * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  frame.querySelector('.prev').addEventListener('click', () => go(index() - 1));
  frame.querySelector('.next').addEventListener('click', () => go(index() + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
  track.addEventListener('scroll', () => {
    const current = index();
    dots.forEach((dot, i) => {
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  });
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      go(index() + (e.key === 'ArrowRight' ? 1 : -1));
    }
  });
  // mouse users can drag the image sideways too
  let startX = null;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') startX = e.clientX;
  });
  track.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) go(index() + (dx < 0 ? 1 : -1));
  });
}

function renderProject(body, p) {
  const shots = p.shots || [{ src: p.img, alt: `Screenshot of ${p.title}` }];
  const many = shots.length > 1;
  const controls = many ? `
          <button type="button" class="slide-nav prev" aria-label="Previous screenshot">${UI.prev}</button>
          <button type="button" class="slide-nav next" aria-label="Next screenshot">${UI.next}</button>
          <div class="dots">${shots.map((s, i) => `<button type="button" aria-label="Screenshot ${i + 1} of ${shots.length}"${i === 0 ? ' aria-current="true"' : ''}></button>`).join('')}</div>` : '';
  body.innerHTML = `
    <article class="proj">
      <div class="stage">
        <div class="browser">
          <div class="chrome"><i></i><i></i><i></i><span class="url">${esc(host(mainUrl(p)))}</span></div>
          <div class="slides"${many ? ' tabindex="0" aria-label="Screenshots; use the arrow keys to move between them"' : ''}>${shots.map((s) => `<img src="${s.src}" alt="${esc(s.alt)}" draggable="false">`).join('')}</div>${controls}
        </div>
      </div>
      <div class="info">
        <span class="eyebrow">${esc(p.kind)}${p.archived ? ' · archived' : ''}</span>
        <h2>${esc(p.title)}</h2>
        <p>${esc(p.desc)}</p>
        <h3>Highlights</h3>
        <ul class="hl">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
        <h3>Built with</h3>
        <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <div class="actions">${projectButtons(p)}</div>
      </div>
    </article>`;
  if (many) wireSlider(body.querySelector('.browser'));
}

function renderSkills(body) {
  const total = PROJECTS.length;
  const row = ([name, list]) => `
    <tr>
      <td class="n">${esc(name)}</td>
      <td class="u"><div class="usage"><span class="track"><span class="fill" style="width:${(list.length / total) * 100}%"></span></span>${list.length}/${total}</div></td>
      <td class="p">${list.map(esc).join(', ')}</td>
    </tr>`;
  body.innerHTML = `
    <div class="mon">
      <div class="mon-head"><b>Processes</b><span>${SKILLS.length} running · counted from my ${total} projects</span></div>
      <div class="mon-tbl">
        <table>
          <thead><tr><th>Name</th><th>Used in</th><th>Projects</th></tr></thead>
          <tbody>${SKILLS.map(row).join('')}</tbody>
        </table>
      </div>
      <div class="mon-foot note">Also used at work: Django, Node.js, TypeScript, PostgreSQL, Redis, AWS, Docker. Usage bars come from the projects on this desktop, not self-ratings.</div>
    </div>`;
}

function renderContact(body) {
  body.innerHTML = `
    <div class="doc">
      <span class="eyebrow">contact.app</span>
      <h2>Let's build something</h2>
      <p>Have a project or an idea you want built? Email is the fastest way to reach me.</p>
      <div class="mailrow"><output>${esc(PROFILE.email)}</output><button type="button" class="btn primary" data-copy>Copy email</button></div>
      <div class="actions">
        <a class="btn" href="${PROFILE.linkedin}" ${BLANK}>LinkedIn ↗</a>
        <a class="btn" href="${PROFILE.github}" ${BLANK}>GitHub ↗</a>
        <a class="btn" href="mailto:${PROFILE.email}">Open mail app</a>
      </div>
    </div>`;
  wireCopy(body);
}

function renderResume(body) {
  if (PROFILE.resume) {
    body.innerHTML = `
      <div class="doc">
        <span class="eyebrow">resume.pdf</span>
        <h2>My résumé</h2>
        <p>Opens as a PDF in a new tab.</p>
        <div class="actions"><a class="btn primary" href="${PROFILE.resume}" ${BLANK}>Open résumé ↗</a></div>
      </div>`;
    return;
  }
  body.innerHTML = `
    <div class="doc">
      <span class="eyebrow">resume.pdf</span>
      <h2>Résumé coming soon</h2>
      <p class="note">Email me and I'll send my latest CV straight away.</p>
      <div class="actions"><button type="button" class="btn primary" data-open="contact">Contact me</button></div>
    </div>`;
  wireOpen(body);
}

/* ---------- terminal ---------- */
const bootTime = Date.now();
const ALIAS = {
  'about-me': 'about', summary: 'about', cv: 'resume',
};
const TARGETS = ['about', 'projects', 'skills', 'contact', 'resume', 'welcome', ...PROJECTS.map((p) => p.id)];
const LISTING = {
  '~': ['about-me.md', '<span class="bl">projects/</span>', 'skills.sys', 'contact.app', 'resume.pdf', 'welcome.md'],
  '~/projects': [...FEATURED.map((p) => `<span class="gr">${p.id}.app</span>`), '<span class="bl">archive/</span>'],
  '~/projects/archive': ARCHIVED.map((p) => `<span class="gr">${p.id}.app</span>`),
};
const normTarget = (t) => {
  const n = (t || '').toLowerCase().replace(/^.*\//, '').replace(/\.(app|txt|md|pdf|sys)$/, '');
  return ALIAS[n] || n;
};

function renderTerminal(body, rec) {
  body.innerHTML = '<div class="term"><div class="out"></div><form autocomplete="off"><span class="ps1"></span><input id="term-input" aria-label="Terminal command" spellcheck="false" autocapitalize="off"></form></div>';
  const term = body.querySelector('.term');
  const out = term.querySelector('.out');
  const form = term.querySelector('form');
  const input = term.querySelector('input');
  const ps1El = term.querySelector('.ps1');
  let cwd = '~';
  const hist = [];
  let histIndex = 0;

  const ps1 = () => `<span class="ps1">visitor@tochukwu<span class="dim">:</span><i>${cwd}</i><span class="dim">$</span></span>`;
  const print = (html = '', cls = '') => {
    const line = document.createElement('div');
    if (cls) line.className = cls;
    line.innerHTML = html;
    out.append(line);
  };
  const cmd = (c) => `<button type="button" class="cmdlink" data-run="${esc(c)}">${esc(c)}</button>`;
  const link = (url, label) => `<a href="${url}" ${BLANK}>${esc(label)}</a>`;

  const resolveDir = (arg) => {
    if (!arg || arg === '.') return cwd;
    if (arg === '~' || arg === '/') return '~';
    if (arg === '..') return cwd === '~' ? '~' : cwd.split('/').slice(0, -1).join('/');
    const clean = arg.replace(/\/$/, '').replace(/^~\//, '');
    const full = cwd === '~' ? `~/${clean}` : `${cwd}/${clean}`;
    if (LISTING[full]) return full;
    if (LISTING[`~/${clean}`]) return `~/${clean}`;
    if (clean === 'archive') return '~/projects/archive';
    return null;
  };

  const COMMANDS = {
    help() {
      print(`<span class="hi">Start here</span>
  ${cmd('about')}           who I am and what I build
  ${cmd('contact')}         how to reach me
<span class="hi">Explore</span>
  ${cmd('ls')} [dir]        list files
  ${cmd('cd projects')}     change directory
  ${cmd('open car-rentals')}  open a project in a window
  ${cmd('cat space-travelers')}  print project details here
  ${cmd('projects')}        list projects with links
  ${cmd('skills')}          tech, counted from real projects
  ${cmd('whoami')}          who built this
  ${cmd('neofetch')}        system info
  ${cmd('theme')} [light|dark]  switch theme
  ${cmd('clear')}           clear the screen
<span class="dim">Tab completes names. Up and down arrows recall history.</span>`);
    },
    ls(a) {
      const dir = resolveDir(a[0]);
      if (dir) print(LISTING[dir].join('   '));
      else print(`ls: ${esc(a[0])}: no such directory`, 'err');
    },
    cd(a) {
      const dir = resolveDir(a[0] || '~');
      if (!dir) {
        print(`cd: ${esc(a[0])}: no such directory`, 'err');
        return;
      }
      cwd = dir;
      ps1El.innerHTML = ps1();
    },
    pwd() {
      print(cwd.replace('~', '/home/visitor'));
    },
    open(a) {
      const t = normTarget(a[0]);
      if (!a[0]) print(`usage: open &lt;name&gt;   e.g. ${cmd('open space-travelers')}`, 'dim');
      else if (t === 'archive') {
        openApp('projects');
        print('opened projects');
      } else if (t === 'terminal') print('you are already in it', 'dim');
      else if (openApp(t)) print(`<span class="dim">opened</span> ${esc(APPS[t].title)}`);
      else print(`open: ${esc(a[0])}: not found. Try ${cmd('ls projects')}`, 'err');
    },
    cat(a) {
      const t = normTarget(a[0]);
      const p = PROJECTS.find((x) => x.id === t);
      if (t === 'about') COMMANDS.whoami();
      else if (t === 'contact') COMMANDS.hire();
      else if (t === 'skills') COMMANDS.skills();
      else if (t === 'welcome') print(`# Hi, I'm Tochukwu\nSoftware engineer. Type ${cmd('projects')} to see my work.`);
      else if (p) {
        const hl = p.highlights.map((h) => `<span class="gr">→</span> ${esc(h)}`).join('\n');
        print(`<span class="hi">${esc(p.title)}</span> <span class="dim">· ${esc(p.kind)}</span>\n${esc(p.desc)}\n${hl}\n<span class="dim">stack:</span> ${p.tags.join(', ')}\n<span class="dim">${p.live ? 'live' : 'code'}:</span>  ${link(mainUrl(p), host(mainUrl(p)))}`);
      } else if (t === 'resume') print(`cat: resume.pdf is a binary file. Try ${cmd('open resume')}`, 'err');
      else print(`cat: ${esc(a[0] || '')}: no such file`, 'err');
    },
    projects() {
      FEATURED.forEach((p) => print(`<span class="gr">${p.id.padEnd(17)}</span>${esc(`${p.tags.join(', ')} `).padEnd(36)}${link(mainUrl(p), p.live ? 'live ↗' : 'code ↗')}`));
      print(`<span class="dim">+ ${ARCHIVED.length} archived. ${cmd('ls archive')}</span>`);
    },
    whoami() {
      print(`<span class="hi">${esc(PROFILE.name)}</span>, software engineer  <span class="gr">● open to build</span>\nPython, TypeScript and Rails; leads a team of 5 developers.\n<span class="dim">next:</span> ${cmd('projects')}  ${cmd('about')}  ${cmd('contact')}`);
    },
    about() {
      print('<span class="dim">opening</span> about-me.md');
      openApp('about');
    },
    skills() {
      const total = PROJECTS.length;
      SKILLS.forEach(([n, l]) => print(`${n.padEnd(12)}<span class="gr">${'█'.repeat(l.length * 3)}</span><span class="dim">${'░'.repeat((total - l.length) * 3)}</span> ${l.length}/${total} projects`));
      print(`<span class="dim">graphical view:</span> ${cmd('open skills')}`);
    },
    hire() {
      print(`<span class="dim">email   </span> ${esc(PROFILE.email)}\n<span class="dim">linkedin</span> ${link(PROFILE.linkedin, host(PROFILE.linkedin))}\n<span class="dim">github  </span> ${link(PROFILE.github, host(PROFILE.github))}\n<span class="dim">or run</span> ${cmd('open contact')}`);
    },
    neofetch() {
      const s = Math.floor((Date.now() - bootTime) / 1000);
      const logo = ['████████', '   ██   ', '   ██   ', '   ██   ', '   ██   ', '        ', '        '];
      const info = [
        '<span class="hi">visitor</span>@<span class="hi">tochukwu</span>',
        '<span class="bl">os</span>        TochukwuOS 2.0',
        '<span class="bl">shell</span>     tsh (vanilla JS)',
        `<span class="bl">uptime</span>    ${Math.floor(s / 60)}m ${s % 60}s`,
        `<span class="bl">projects</span>  ${FEATURED.length} featured, ${ARCHIVED.length} archived`,
        '<span class="bl">stack</span>     Python · TypeScript · React',
        '<span class="bl">status</span>    <span class="gr">open to build</span>',
      ];
      print(logo.map((l, i) => `<span class="gr">${l}</span>   ${info[i]}`).join('\n'));
    },
    theme(a) {
      let next = isDark() ? 'light' : 'dark';
      if (a[0] === 'light' || a[0] === 'dark') [next] = a;
      setTheme(next);
      print(`theme set to ${next}`, 'dim');
    },
    date() {
      print(new Date().toString());
    },
    echo(a) {
      print(esc(a.join(' ')));
    },
    history() {
      hist.forEach((h, i) => print(`${String(i + 1).padStart(4)}  ${esc(h)}`));
    },
    clear() {
      out.innerHTML = '';
    },
    exit() {
      closeApp('terminal');
    },
    sudo(a) {
      if (/^hire[- ]?me$/.test(a.join(' '))) {
        print('[sudo] password for visitor: ********\n<span class="gr">Permission granted.</span> Opening contact.app…');
        setTimeout(() => openApp('contact'), 500);
      } else print(`visitor is not in the sudoers file. Try ${cmd('sudo hire-me')}`, 'err');
    },
    rm() {
      print('rm: read-only file system. Nice try.', 'err');
    },
  };
  COMMANDS.contact = COMMANDS.hire;
  COMMANDS.summary = COMMANDS.about;
  COMMANDS.dir = COMMANDS.ls;
  COMMANDS.cls = COMMANDS.clear;

  const run = (rawInput) => {
    const raw = rawInput.trim();
    print(`${ps1()} ${esc(raw)}`);
    if (raw) {
      hist.push(raw);
      histIndex = hist.length;
      const [name, ...args] = raw.split(/\s+/);
      const fn = COMMANDS[name.toLowerCase()];
      if (fn) fn(args);
      else if (APPS[normTarget(name)]) COMMANDS.open([name]);
      else print(`tsh: command not found: ${esc(name)}. Type ${cmd('help')}`, 'err');
    }
    term.scrollTop = term.scrollHeight;
  };

  const complete = () => {
    const parts = input.value.split(' ');
    const last = parts.pop().toLowerCase();
    const pool = parts.length ? TARGETS : Object.keys(COMMANDS);
    const hits = pool.filter((t) => t.startsWith(last));
    if (hits.length === 1) input.value = `${[...parts, hits[0]].join(' ')} `;
    else if (hits.length > 1) {
      print(`${ps1()} ${esc(input.value)}`);
      print(hits.join('   '), 'dim');
      term.scrollTop = term.scrollHeight;
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run(input.value);
    input.value = '';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIndex > 0) {
        histIndex -= 1;
        input.value = hist[histIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      histIndex = Math.min(hist.length, histIndex + 1);
      input.value = hist[histIndex] || '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      COMMANDS.clear();
    }
  });
  out.addEventListener('click', (e) => {
    const b = e.target.closest('[data-run]');
    if (!b) return;
    run(b.dataset.run);
    input.focus({ preventScroll: true });
  });
  term.addEventListener('click', (e) => {
    if (!e.target.closest('a, button') && !window.getSelection().toString()) input.focus({ preventScroll: true });
  });
  rec.onFocus = () => {
    if (!phone.matches) setTimeout(() => input.focus({ preventScroll: true }), 0);
  };

  ps1El.innerHTML = ps1();
  print(`<span class="hi">TochukwuOS 2.0</span> <span class="dim">· tsh 1.0 · type</span> ${cmd('help')} <span class="dim">for commands</span>\n`);

  // type the first command so visitors can see the terminal is live
  const first = 'whoami';
  if (reduceMotion) {
    run(first);
    return;
  }
  let typed = 0;
  const typer = setInterval(() => {
    if (input.value.length !== typed) {
      clearInterval(typer); // the visitor started typing
      return;
    }
    typed += 1;
    input.value = first.slice(0, typed);
    if (typed === first.length) {
      clearInterval(typer);
      setTimeout(() => {
        if (input.value === first) {
          run(first);
          input.value = '';
        }
      }, 260);
    }
  }, 85);
}

/* ---------- start menu ---------- */
const startBtn = document.getElementById('start');
const menu = document.getElementById('menu');
const MENU_ITEMS = [
  ['about', 'About me', 'person'],
  ['projects', 'Projects', 'folder'],
  ['skills', 'Skills', 'monitor'],
  ['terminal', 'Terminal', 'term'],
  ['contact', 'Contact', 'mail'],
  ['resume', 'Résumé', 'pdf'],
];
menu.innerHTML = `
  <div class="who"><b>${esc(PROFILE.name)}</b><span class="sub">Software engineer · Python, TypeScript, React</span>${statusPill}</div>
  ${MENU_ITEMS.map(([id, label, icon, hint]) => `<button type="button" class="item" data-open="${id}">${SVG[icon]}${label}${hint ? `<small>${hint}</small>` : ''}</button>`).join('')}
  <a class="item" href="${PROFILE.linkedin}" ${BLANK}>${SVG.linkedin}LinkedIn<small>↗</small></a>
  <hr>
  <button type="button" class="item" data-classic>${SVG.classic}Classic view<small>no windows</small></button>`;
const toggleMenu = (show) => {
  menu.hidden = !show;
  startBtn.setAttribute('aria-expanded', String(show));
};
startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu(menu.hidden);
});
menu.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (!item) return;
  if (item.dataset.open) openApp(item.dataset.open);
  if (item.hasAttribute('data-classic')) showClassic(true);
  toggleMenu(false);
});
document.addEventListener('pointerdown', (e) => {
  if (!menu.hidden && !menu.contains(e.target) && !startBtn.contains(e.target)) toggleMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleMenu(false);
});

/* ---------- classic view ---------- */
const classic = document.getElementById('classic');
function showClassic(on) {
  if (on && !classic.innerHTML) {
    const row = (p) => `
      <section class="row">
        <img src="${p.img}" alt="Screenshot of ${esc(p.title)}" loading="lazy">
        <div>
          <span class="eyebrow">${esc(p.kind)}${p.archived ? ' · archived' : ''}</span>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.desc)}</p>
          <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          <div class="actions">${projectButtons(p)}</div>
        </div>
      </section>`;
    classic.innerHTML = `
      <div class="wrap">
        <header><span class="eyebrow">classic view</span><button type="button" class="btn" data-back>Back to desktop</button></header>
        <div class="intro">${statusPill}<h1>${esc(PROFILE.name)}</h1><p>Software engineer · Python, TypeScript, React · ${esc(PROFILE.email)}</p>
          <div class="actions"><a class="btn" href="${PROFILE.linkedin}" ${BLANK}>LinkedIn ↗</a><a class="btn" href="${PROFILE.github}" ${BLANK}>GitHub ↗</a></div>
        </div>
        ${PROJECTS.map(row).join('')}
      </div>`;
    classic.querySelector('[data-back]').addEventListener('click', () => showClassic(false));
  }
  classic.hidden = !on;
}

/* ---------- theme + clock ---------- */
initThemeButton(document.getElementById('theme'));
const clock = document.getElementById('clock');
const tick = () => {
  clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
tick();
setInterval(tick, 20000);

/* ---------- first frame ---------- */
if (!phone.matches) {
  const W = desk.clientWidth;
  const H = desk.clientHeight;
  const wx = clamp(Math.round(W * 0.13), 130, 240);
  openApp('welcome', { instant: true, x: wx, y: 28 });
  const tw = Math.min(600, W - 24);
  const th = Math.min(360, H - 24);
  openApp('terminal', { instant: true, x: clamp(W - tw - 40, wx + 200, W - tw - 12), y: clamp(H - th - 140, 220, H - th - 12) });
  focusWin('welcome');
}
// links like /#scandiweb-store or /#about open that window straight away
const deepLink = decodeURIComponent(window.location.hash.slice(1));
if (APPS[deepLink]) openApp(deepLink, { instant: true });
