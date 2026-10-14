/* eslint-disable no-use-before-define */
import {
  PROFILE, PROJECTS, FEATURED, ARCHIVED, SKILLS, esc, host,
} from '../shared/data.js';
import { hlLine } from '../shared/highlight.js';
import { copyText, mountSwitcher } from '../shared/ui.js';

const $ = (sel) => document.querySelector(sel);
const phone = window.matchMedia('(max-width: 720px)');
const X = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" stroke-width="1.6"/></svg>';

// ---------- file contents ----------
const pascal = (s) => s.split(/\s+/).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
const wrapText = (text, width, indent) => {
  const lines = [];
  let line = '';
  text.split(' ').forEach((word) => {
    if (`${line} ${word}`.trim().length > width) {
      lines.push(line.trim());
      line = word;
    } else line += ` ${word}`;
  });
  if (line.trim()) lines.push(line.trim());
  return lines.map((l) => indent + l).join('\n');
};

const tsxSource = (p, path) => `// ${path}
import { Project } from '../components/Project';

export default function ${pascal(p.title)}() {
  return (
    <Project
      title="${p.title}"
      kind="${p.kind}"
      stack={[${p.tags.map((t) => `'${t}'`).join(', ')}]}
      live="${p.live}"
      source="${p.src}"
    >
${wrapText(p.desc, 58, '      ')}
    </Project>
  );
}`;

const readmePreview = () => `<div class="pv-in">
  <span class="pill"><i></i>Open to work</span>
  <h1>${esc(PROFILE.name)}</h1>
  <p>Software developer · React, Redux, Ruby on Rails</p>
  <blockquote>Open to work. Start with <a href="#car-rentals" data-file="projects/car-rentals.tsx">projects/car-rentals.tsx</a></blockquote>
  <h2>Featured work</h2>
  <ul class="feat">${FEATURED.map((p) => `<li><button type="button" data-file="projects/${p.id}.tsx"><img src="${p.img}" alt=""><span><b>${esc(p.title)}</b><span>${esc(p.one)}</span></span></button></li>`).join('')}</ul>
  <h2>Stack</h2>
  <ul class="chips">${['JavaScript', 'Ruby', 'React', 'Redux', 'Ruby on Rails', 'RSpec'].map((t) => `<li>${t}</li>`).join('')}</ul>
  <h2>Contact</h2>
  <p>${esc(PROFILE.email)}</p>
  <div class="row">
    <a class="btn sm" href="${PROFILE.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
    <a class="btn sm" href="${PROFILE.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
    <button type="button" class="btn sm" data-file="contact.sh">Run contact.sh</button>
  </div>
</div>`;

const projectPreview = (p) => `<div class="pv-in">
  <div class="frame"><div class="chrome"><i></i><i></i><i></i><span>${esc(host(p.live))}</span></div><img src="${p.img}" alt="Screenshot of ${esc(p.title)}"></div>
  <span class="eyebrow">${esc(p.kind)}${p.archived ? ' · archived' : ''}</span>
  <h1 class="sm">${esc(p.title)}</h1>
  <p>${esc(p.desc)}</p>
  <ul class="chips">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
  <div class="row">
    <a class="btn primary sm" href="${p.live}" target="_blank" rel="noopener noreferrer">See it live ↗</a>
    <a class="btn sm" href="${p.src}" target="_blank" rel="noopener noreferrer">Source ↗</a>
  </div>
</div>`;

const skillsJson = {};
SKILLS.forEach(([name, used]) => {
  skillsJson[name] = { projects: used.length, usedIn: used };
});

const FILES = {
  'README.md': {
    lang: 'md',
    views: ['preview', 'code'],
    preview: readmePreview,
    src: `# ${PROFILE.name}
Software developer · React, Redux, Ruby on Rails

> Open to work. Start with projects/car-rentals.tsx

## Featured work
${FEATURED.map((p) => `- **${p.title}**: ${p.one}`).join('\n')}

## Stack
JavaScript, Ruby, React, Redux, Ruby on Rails, RSpec

## Contact
${PROFILE.email} · ${host(PROFILE.linkedin)} · ${host(PROFILE.github)}`,
  },
  'about.ts': {
    lang: 'ts',
    src: `// about.ts: the short version
export const tochukwu = {
  name: '${PROFILE.name}',
  role: '${PROFILE.role}',
  openToWork: ${PROFILE.openToWork},
  builds: 'web apps end to end, from Rails APIs to React front ends',
  languages: ['JavaScript', 'Ruby', 'HTML', 'CSS'],
  frameworks: ['React', 'Redux', 'Ruby on Rails', 'RSpec', 'Bootstrap'],
  tools: ['Git', 'GitHub', 'GitLab', 'Webpack'],
  liveProjects: ${PROJECTS.length},
};

console.log(\`\${tochukwu.name}, \${tochukwu.role}\`);`,
    run: () => [
      '<span class="dim">$ npx tsx about.ts</span>',
      `${esc(PROFILE.name)}, ${esc(PROFILE.role)}`,
      '<span class="ok">✓ done</span> <span class="dim">· openToWork: true</span>',
    ],
  },
  'skills.json': {
    lang: 'json',
    src: JSON.stringify(skillsJson, null, 2),
    run: () => [
      '<span class="dim">$ node -e "require(\'./skills.json\')"</span>',
      `<span class="ok">✓ valid JSON</span> · ${SKILLS.length} technologies across ${PROJECTS.length} projects`,
      `<span class="dim">most used:</span> ${SKILLS.slice(0, 3).map(([n, l]) => `${n} (${l.length})`).join(', ')}`,
    ],
  },
  'contact.sh': {
    lang: 'sh',
    src: `#!/usr/bin/env bash
# Run me to copy my email address, or just read it below.

EMAIL="${PROFILE.email}"
LINKEDIN="${PROFILE.linkedin}"
GITHUB="${PROFILE.github}"

echo "$EMAIL" | pbcopy
echo "Copied $EMAIL. Talk soon!"`,
    run: 'copy',
  },
};
PROJECTS.forEach((p) => {
  const path = `projects/${p.archived ? 'archive/' : ''}${p.id}.tsx`;
  FILES[path] = {
    lang: 'ts', ext: 'tsx', views: ['split', 'code', 'preview'], src: tsxSource(p, path), preview: () => projectPreview(p),
  };
});
const ALL_PATHS = Object.keys(FILES);

const ICON = {
  md: ['md', 'MD'], ts: ['ts', 'TS'], tsx: ['tsx', 'TSX'], json: ['json', '{ }'], sh: ['sh', 'SH'],
};
const fileIcon = (path) => {
  const [cls, label] = ICON[path.split('.').pop()] || ['ts', '?'];
  return `<span class="fi ${cls}">${label}</span>`;
};
const codeHtml = (f) => `<div class="code">${f.src.split('\n').map((l) => `<div>${hlLine(l, f.lang) || ' '}</div>`).join('')}</div>`;

// ---------- explorer ----------
const treeEl = $('#tree');
const fileBtn = (path) => `<li><button type="button" data-file="${path}">${fileIcon(path)}${esc(path.split('/').pop())}</button></li>`;
treeEl.innerHTML = `
  <li><button type="button" data-folder><span class="car">▶</span>TOCHUKWU-PORTFOLIO</button>
    <ul>
      ${['README.md', 'about.ts', 'skills.json', 'contact.sh'].map(fileBtn).join('')}
      <li><button type="button" data-folder><span class="car">▶</span>projects</button>
        <ul>
          ${FEATURED.map((p) => fileBtn(`projects/${p.id}.tsx`)).join('')}
          <li class="collapsed"><button type="button" data-folder><span class="car">▶</span>archive</button>
            <ul>${ARCHIVED.map((p) => fileBtn(`projects/archive/${p.id}.tsx`)).join('')}</ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>`;
treeEl.addEventListener('click', (e) => {
  const folder = e.target.closest('[data-folder]');
  if (folder) {
    folder.parentElement.classList.toggle('collapsed');
    return;
  }
  const file = e.target.closest('[data-file]');
  if (file) openFile(file.dataset.file);
});

// ---------- editor state ----------
const tabsEl = $('#tabs');
const barEl = $('#bar');
const viewEl = $('#view');
const outEl = $('#out');
const outPre = $('#out-pre');
const outClose = $('#out-x');
outClose.innerHTML = X;
outClose.addEventListener('click', () => { outEl.hidden = true; });

let openFiles = [];
let active = null;
const viewOf = {};

const defaultView = (f) => {
  if (!f.views) return 'code';
  if (phone.matches && f.views[0] === 'split') return 'preview';
  return f.views[0];
};

function openFile(requested) {
  let path = requested;
  if (!FILES[path]) {
    path = ALL_PATHS.find((k) => k.endsWith(`/${requested.split('/').pop()}`));
    if (!path) return;
  }
  if (!openFiles.includes(path)) openFiles.push(path);
  active = path;
  if (!viewOf[path]) viewOf[path] = defaultView(FILES[path]);
  draw();
}

function closeFile(path) {
  const i = openFiles.indexOf(path);
  if (i < 0) return;
  openFiles.splice(i, 1);
  if (active === path) active = openFiles[Math.max(0, i - 1)] || null;
  draw();
}

const printOut = (lines) => {
  outEl.hidden = false;
  outPre.innerHTML = lines.join('\n');
};

function runFile(f) {
  if (f.run === 'copy') {
    copyText(PROFILE.email).then(
      () => printOut(['<span class="dim">$ bash contact.sh</span>', `Copied ${PROFILE.email}. Talk soon!`]),
      () => printOut(['<span class="dim">$ bash contact.sh</span>', `Clipboard is blocked here. Email: ${PROFILE.email}`]),
    );
  } else if (f.run) printOut(f.run());
}

const viewLabel = (v) => (v === 'code' ? 'Source' : v[0].toUpperCase() + v.slice(1));

function renderView(f, v) {
  if (v === 'preview') return `<div class="pv">${f.preview()}</div>`;
  if (v === 'split') return `${codeHtml(f)}<div class="pv">${f.preview()}</div>`;
  return codeHtml(f);
}

function draw() {
  tabsEl.innerHTML = openFiles.map((p) => `<div class="ed-tab ${p === active ? 'on' : ''}" data-tab="${p}" role="button" tabindex="0">${fileIcon(p)}${esc(p.split('/').pop())}<button type="button" class="x" data-close="${p}" aria-label="Close ${esc(p)}">${X}</button></div>`).join('');
  treeEl.querySelectorAll('[data-file]').forEach((b) => b.classList.toggle('on', b.dataset.file === active));

  if (!active) {
    barEl.innerHTML = `<select aria-label="Open a file"><option value="">Open a file…</option>${ALL_PATHS.map((p) => `<option>${p}</option>`).join('')}</select>`;
    viewEl.className = 'ed-view';
    viewEl.innerHTML = '<div class="ed-empty">No file open.<br>Pick one from the explorer, or start with README.md.</div>';
    document.title = 'tochukwu-portfolio';
    wireBar();
    drawStatus(null);
    return;
  }

  const f = FILES[active];
  const v = viewOf[active];
  const crumbs = ['tochukwu-portfolio', ...active.split('/')].join(' › ');
  const seg = f.views ? `<div class="seg">${f.views.map((x) => `<button type="button" data-view="${x}" class="${x === v ? 'on' : ''}">${viewLabel(x)}</button>`).join('')}</div>` : '';
  const run = f.run ? '<button type="button" class="runbtn" data-run>▶ Run</button>' : '';
  const options = ALL_PATHS.map((p) => `<option ${p === active ? 'selected' : ''}>${p}</option>`).join('');
  barEl.innerHTML = `<span class="crumbs">${esc(crumbs)}</span><select aria-label="Open a file">${options}</select>${seg}${run}`;
  viewEl.className = `ed-view${v === 'split' ? ' split' : ''}`;
  viewEl.innerHTML = renderView(f, v);
  document.title = `${active.split('/').pop()} — tochukwu-portfolio`;
  wireBar();
  drawStatus(f);
}

function wireBar() {
  const select = barEl.querySelector('select');
  select.addEventListener('change', (e) => {
    if (e.target.value) openFile(e.target.value);
  });
  barEl.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => {
    viewOf[active] = b.dataset.view;
    draw();
  }));
  const runBtn = barEl.querySelector('[data-run]');
  if (runBtn) runBtn.addEventListener('click', () => runFile(FILES[active]));
}

tabsEl.addEventListener('click', (e) => {
  const x = e.target.closest('[data-close]');
  if (x) {
    e.stopPropagation();
    closeFile(x.dataset.close);
    return;
  }
  const tab = e.target.closest('[data-tab]');
  if (tab) {
    active = tab.dataset.tab;
    draw();
  }
});
tabsEl.addEventListener('keydown', (e) => {
  const tab = e.target.closest('[data-tab]');
  if (tab && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    active = tab.dataset.tab;
    draw();
  }
});
viewEl.addEventListener('click', (e) => {
  const link = e.target.closest('[data-file]');
  if (!link) return;
  e.preventDefault();
  openFile(link.dataset.file);
  if (link.dataset.file === 'contact.sh') runFile(FILES['contact.sh']);
});

// ---------- status bar ----------
const statusEl = $('#status');
const LANG_NAME = {
  md: 'Markdown', ts: 'TypeScript', json: 'JSON', sh: 'Shell Script',
};
function drawStatus(f) {
  let lang = '';
  if (f) lang = f.ext === 'tsx' ? 'TypeScript JSX' : LANG_NAME[f.lang];
  statusEl.innerHTML = `<span>⎇ main</span><span class="opt">✓ 0 problems</span><span class="grow"></span><button type="button" data-contact><i></i>Open to work</button><span class="opt">${f ? `${f.src.split('\n').length} lines` : ''}</span><span class="opt">${lang}</span>`;
  statusEl.querySelector('[data-contact]').addEventListener('click', () => openFile('contact.sh'));
}

// ---------- first frame: README rendered, a project in split view ----------
openFiles = ['README.md', 'projects/car-rentals.tsx'];
viewOf['projects/car-rentals.tsx'] = phone.matches ? 'preview' : 'split';
viewOf['README.md'] = 'preview';
active = 'README.md';
draw();
mountSwitcher('editor');
