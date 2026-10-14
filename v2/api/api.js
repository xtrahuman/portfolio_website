import {
  PROFILE, PROJECTS, FEATURED, SKILLS, esc,
} from '../shared/data.js';
import { hlBlock } from '../shared/highlight.js';
import { initThemeButton, copyText, mountSwitcher } from '../shared/ui.js';

const json = (obj) => hlBlock(JSON.stringify(obj, null, 2), 'json');
const BLANK = 'target="_blank" rel="noopener noreferrer"';

const projectJson = (p) => ({
  id: p.id,
  title: p.title,
  kind: p.kind,
  summary: p.one,
  stack: p.tags,
  live_url: p.live,
  source_url: p.src,
  archived: !!p.archived,
});

const ME = {
  name: PROFILE.name,
  role: PROFILE.role,
  open_to_work: PROFILE.openToWork,
  builds: 'Web apps end to end: Rails APIs with React + Redux front ends',
  stack: {
    languages: ['JavaScript', 'Ruby', 'HTML', 'CSS'],
    frameworks: ['React', 'Redux', 'Ruby on Rails', 'RSpec', 'Bootstrap'],
  },
  live_projects: PROJECTS.length,
  links: {
    email: PROFILE.email,
    linkedin: PROFILE.linkedin,
    github: PROFILE.github,
    resume: PROFILE.resume || null,
  },
};

const card = (p) => `<div class="rcard"><img src="${p.img}" alt=""><div><b>${esc(p.title)}</b><span>${esc(p.one)}</span><a href="${p.live}" ${BLANK}>live ↗</a><a href="${p.src}" ${BLANK}>source ↗</a></div></div>`;
const findProject = (id) => PROJECTS.find((x) => x.id === id);

const hire = (state, raw) => {
  let body;
  try {
    body = JSON.parse(raw);
  } catch (e) {
    return { code: 400, body: { error: 'invalid_json', message: 'The request body is not valid JSON. Check for a missing quote or comma.' } };
  }
  if (!body || typeof body.role !== 'string' || !body.role.trim()) {
    return { code: 422, body: { error: 'missing_field', message: 'Add a "role" so I know what the position is.' } };
  }
  return {
    code: 201,
    body: {
      status: 'ready',
      role: body.role,
      next_step: `Email me about the ${body.role} role`,
      email: PROFILE.email,
      linkedin: PROFILE.linkedin,
      note: 'Demo endpoint: nothing was sent. Copy the email to reach me.',
    },
  };
};

const ENDPOINTS = [
  {
    id: 'me',
    method: 'GET',
    path: '/v2/me',
    title: 'Get profile',
    group: 'Profile',
    desc: 'Who I am, what I build and whether I am available right now.',
    run: () => ({ code: 200, body: ME }),
  },
  {
    id: 'projects',
    method: 'GET',
    path: '/v2/projects',
    title: 'List projects',
    group: 'Projects',
    desc: 'My featured projects, best first. Turn on <code>include_archived</code> to also get older coursework.',
    params: [{
      name: 'include_archived', type: 'boolean', control: 'checkbox', def: false, note: 'default false',
    }],
    run: (s) => {
      const list = s.include_archived ? PROJECTS : FEATURED;
      return { code: 200, body: { count: list.length, data: list.map(projectJson) } };
    },
    preview: (s) => (s.include_archived ? PROJECTS : FEATURED).map(card).join(''),
  },
  {
    id: 'project',
    method: 'GET',
    path: '/v2/projects/{id}',
    title: 'Get a project',
    group: 'Projects',
    desc: 'Full details for one project, including highlights and links.',
    pathParams: true,
    params: [{
      name: 'id', type: 'string', control: 'select', options: PROJECTS.map((p) => p.id), def: 'car-rentals', note: 'required',
    }],
    run: (s) => {
      const p = findProject(s.id);
      const body = { ...projectJson(p), description: p.desc, highlights: p.highlights };
      return { code: 200, body };
    },
    preview: (s) => {
      const p = findProject(s.id);
      return `<div class="rbig"><img src="${p.img}" alt="Screenshot of ${esc(p.title)}"></div>${card(p)}`;
    },
  },
  {
    id: 'skills',
    method: 'GET',
    path: '/v2/skills',
    title: 'List skills',
    group: 'Skills',
    desc: 'Each technology with the projects that use it. Counted from real projects, not self-ratings.',
    run: () => {
      const data = SKILLS.map(([name, used]) => ({
        name, project_count: used.length, used_in: used,
      }));
      return { code: 200, body: { data } };
    },
  },
  {
    id: 'hire',
    method: 'POST',
    path: '/v2/hire',
    title: 'Start a conversation',
    group: 'Hiring',
    desc: 'Tell me about the role and the response tells you exactly how to reach me. Try breaking the JSON to see a 400.',
    body: '{\n  "company": "Your company",\n  "role": "Frontend Developer",\n  "remote": true\n}',
    run: hire,
    copy: true,
  },
];
const STATUS = {
  200: '200 OK', 201: '201 Created', 400: '400 Bad Request', 422: '422 Unprocessable',
};

// ---------- navigation ----------
const nav = document.getElementById('nav');
const groups = [...new Set(ENDPOINTS.map((e) => e.group))];
const navGroup = (g) => `<section><h3>${g}</h3><ul>${ENDPOINTS.filter((e) => e.group === g).map((e) => `<li><button type="button" data-go="${e.id}"><span class="m ${e.method.toLowerCase()}">${e.method}</span><code>${esc(e.path)}</code></button></li>`).join('')}</ul></section>`;
nav.innerHTML = `
  <div class="ttl"><div><b>Tochukwu API</b><span>v2.0 · REST · JSON</span></div><button type="button" class="iconbtn" id="theme" aria-label="Toggle light or dark theme"></button></div>
  <section><h3>Start here</h3><ul><li><button type="button" data-go="intro">Quickstart</button></li></ul></section>
  ${groups.map(navGroup).join('')}`;

// ---------- sections ----------
const paramRow = (e, p) => {
  const id = `p-${e.id}-${p.name}`;
  const control = p.control === 'checkbox'
    ? `<label><input type="checkbox" id="${id}" data-param="${p.name}"${p.def ? ' checked' : ''}> include</label>`
    : `<select id="${id}" data-param="${p.name}" aria-label="${p.name}">${p.options.map((o) => `<option${o === p.def ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
  return `<tr><td><code>${p.name}</code><small>${p.type} · ${p.note}</small></td><td>${control}</td></tr>`;
};

const section = (e) => `
  <section class="api-sec" id="ep-${e.id}" data-ep="${e.id}">
    <div class="api-doc">
      <div class="sig"><span class="m ${e.method.toLowerCase()}">${e.method}</span><code>${esc(e.path)}</code></div>
      <h2>${e.title}</h2>
      <p>${e.desc}</p>
      ${e.params ? `<table class="params"><caption>${e.pathParams ? 'Path parameters' : 'Query parameters'}</caption><tbody>${e.params.map((p) => paramRow(e, p)).join('')}</tbody></table>` : ''}
    </div>
    <div class="api-code">
      <div class="panel">
        <div class="ph"><span>Request</span><span class="grow"></span><button type="button" class="send" data-send>Send request</button></div>
        <pre class="req"></pre>
        ${e.body !== undefined ? `<label class="sr" for="b-${e.id}">Request body</label><textarea class="body" id="b-${e.id}" spellcheck="false">${esc(e.body)}</textarea>` : ''}
      </div>
      <div class="panel">
        <div class="ph"><span>Response</span><span class="status"></span><span class="grow"></span>${e.preview ? '<span class="ptabs"><button type="button" data-pt="json" class="on">JSON</button><button type="button" data-pt="preview">Preview</button></span>' : ''}</div>
        <pre class="res"><span class="wait">Press “Send request” to run it.</span></pre>
        ${e.preview ? '<div class="rpv" hidden></div>' : ''}
        ${e.copy ? `<div class="after" hidden><button type="button" class="btn sm" data-copy>Copy email</button><a class="btn sm" href="${PROFILE.linkedin}" ${BLANK}>LinkedIn ↗</a><a class="btn sm" href="${PROFILE.github}" ${BLANK}>GitHub ↗</a></div>` : ''}
      </div>
    </div>
  </section>`;

const main = document.getElementById('main');
main.innerHTML = `
  <section class="api-sec intro" id="ep-intro">
    <div class="api-doc">
      <span class="eyebrow">Quickstart · plain English first</span>
      <h1>Tochukwu API</h1>
      <div><span class="pill"><i></i>Open to work</span></div>
      <p class="lead">${esc(PROFILE.name)} is a software developer who builds web apps end to end, with <b>Ruby on Rails</b> APIs and <b>React + Redux</b> front ends. ${PROJECTS.length} live projects, solo and with teams.</p>
      <p>Everything on this page is a request you can run. If you are short on time, follow this route:</p>
      <ol class="route">
        <li><button type="button" data-go="me"><span class="m get">GET</span><code>/v2/me</code></button><span>who I am</span></li>
        <li><button type="button" data-go="projects"><span class="m get">GET</span><code>/v2/projects</code></button><span>my best work</span></li>
        <li><button type="button" data-go="hire"><span class="m post">POST</span><code>/v2/hire</code></button><span>how to reach me</span></li>
      </ol>
    </div>
  </section>
  ${ENDPOINTS.map(section).join('')}`;

// ---------- request runner ----------
const wireEndpoint = (e) => {
  const sec = main.querySelector(`[data-ep="${e.id}"]`);
  const reqEl = sec.querySelector('.req');
  const resEl = sec.querySelector('.res');
  const statusEl = sec.querySelector('.status');
  const previewEl = sec.querySelector('.rpv');
  const after = sec.querySelector('.after');
  const send = sec.querySelector('[data-send]');
  const textarea = sec.querySelector('textarea');

  const state = () => {
    const s = {};
    sec.querySelectorAll('[data-param]').forEach((input) => {
      s[input.dataset.param] = input.type === 'checkbox' ? input.checked : input.value;
    });
    return s;
  };

  const drawRequest = () => {
    const s = state();
    let path = e.path.replace('{id}', s.id || '');
    if (e.id === 'projects' && s.include_archived) path += '?include_archived=true';
    const contentType = e.body !== undefined ? '\n<span class="t-key">Content-Type</span>: application/json' : '';
    reqEl.innerHTML = `<span class="t-kw">${e.method}</span> ${esc(path)} <span class="t-com">HTTP/1.1</span>\n<span class="t-key">Accept</span>: application/json${contentType}`;
  };

  const execute = (instant) => {
    const finish = () => {
      const r = e.run(state(), textarea ? textarea.value : '');
      statusEl.textContent = STATUS[r.code];
      statusEl.className = `status ${r.code < 300 ? 's2' : 's4'}`;
      resEl.innerHTML = json(r.body);
      if (previewEl) previewEl.innerHTML = e.preview(state());
      if (after) after.hidden = r.code >= 300;
      send.disabled = false;
      send.textContent = 'Send request';
    };
    if (instant) {
      finish();
      return;
    }
    send.disabled = true;
    send.textContent = 'Sending…';
    setTimeout(finish, 280);
  };

  sec.querySelectorAll('[data-param]').forEach((input) => input.addEventListener('change', () => {
    drawRequest();
    if (statusEl.textContent) execute(true);
  }));
  send.addEventListener('click', () => execute(false));
  sec.querySelectorAll('[data-pt]').forEach((b) => b.addEventListener('click', () => {
    sec.querySelectorAll('[data-pt]').forEach((x) => x.classList.toggle('on', x === b));
    const showPreview = b.dataset.pt === 'preview';
    if (!statusEl.textContent) execute(true);
    resEl.hidden = showPreview;
    previewEl.hidden = !showPreview;
  }));
  const copyBtn = sec.querySelector('[data-copy]');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => copyText(PROFILE.email).then(() => {
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 1500);
    }, () => {
      copyBtn.textContent = PROFILE.email;
    }));
  }

  drawRequest();
  // the first screen shows real responses instead of empty panels
  if (e.id === 'me' || e.id === 'projects') execute(true);
};
ENDPOINTS.forEach(wireEndpoint);

const goTo = (id) => {
  const target = document.getElementById(`ep-${id}`);
  if (target) target.scrollIntoView({ block: 'start' });
  nav.querySelectorAll('[data-go]').forEach((b) => b.classList.toggle('on', b.dataset.go === id));
};
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-go]');
  if (b) goTo(b.dataset.go);
});
nav.querySelector('[data-go="intro"]').classList.add('on');

initThemeButton(document.getElementById('theme'));
mountSwitcher('api');
