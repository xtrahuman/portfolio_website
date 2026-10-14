// Tiny line-based syntax highlighter used by the editor and API concepts.
import { esc } from './data.js';

const LANG = {
  ts: [
    [/\/\/.*/, 'com'],
    [/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`/, 'str'],
    [/<\/?[A-Z]\w*|\/?>(?!=)/, 'tag'],
    [/\b(?:const|export|default|function|return|true|false|null|import|from)\b/, 'kw'],
    [/\b\d+\b/, 'num'],
    [/[A-Za-z_]\w*(?=\s*(?:=[^=>]|:))/, 'key'],
  ],
  json: [
    [/"(?:[^"\\]|\\.)*"(?=\s*:)/, 'key'],
    [/"(?:[^"\\]|\\.)*"/, 'str'],
    [/\b(?:true|false|null)\b/, 'kw'],
    [/-?\b\d+(?:\.\d+)?\b/, 'num'],
  ],
  sh: [
    [/#.*/, 'com'],
    [/"(?:[^"\\]|\\.)*"|'[^']*'/, 'str'],
    [/\$\w+/, 'key'],
    [/\b(?:echo|export|pbcopy)\b/, 'kw'],
    [/\b[A-Z_]{2,}(?==)/, 'key'],
  ],
};

const RE = {};
Object.keys(LANG).forEach((lang) => {
  RE[lang] = new RegExp(LANG[lang].map(([r]) => `(${r.source})`).join('|'), 'g');
});

const hlMarkdown = (line) => {
  if (/^#/.test(line)) return `<span class="t-tag">${esc(line)}</span>`;
  if (/^>/.test(line)) return `<span class="t-com">${esc(line)}</span>`;
  return esc(line)
    .replace(/^- /, '<span class="t-kw">- </span>')
    .replace(/\*\*(.+?)\*\*/g, '<span class="t-key">**$1**</span>');
};

export function hlLine(line, lang) {
  if (lang === 'md') return hlMarkdown(line);
  const rules = LANG[lang];
  if (!rules) return esc(line);
  let out = '';
  let last = 0;
  line.replace(RE[lang], (...args) => {
    const match = args[0];
    const groups = args.slice(1, rules.length + 1);
    const index = args[rules.length + 1];
    const kind = rules[groups.findIndex((g) => g !== undefined)][1];
    out += `${esc(line.slice(last, index))}<span class="t-${kind}">${esc(match)}</span>`;
    last = index + match.length;
    return match;
  });
  return out + esc(line.slice(last));
}

export const hlBlock = (src, lang) => src.split('\n').map((l) => hlLine(l, lang)).join('\n');
