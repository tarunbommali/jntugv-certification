import fs from 'fs';
import path from 'path';

// Walk the workspace and replace problematic whitespace characters
const ROOT = path.resolve(new URL(import.meta.url).pathname, '..', '..');

const exts = ['.js', '.jsx', '.ts', '.tsx'];
const replacements = [
  // non-breaking space
  { from: /\u00A0/g, to: ' ' },
  // narrow no-break space
  { from: /\u202F/g, to: ' ' },
  // zero width space
  { from: /\u200B/g, to: '' },
  // zero width no-break space
  { from: /\uFEFF/g, to: '' },
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'build'].includes(e.name)) continue;
      walk(p);
    } else {
      if (exts.includes(path.extname(e.name))) normalizeFile(p);
    }
  }
}

function normalizeFile(file) {
  try {
    let s = fs.readFileSync(file, 'utf8');
    const before = s;
    for (const r of replacements) s = s.replace(r.from, r.to);
    if (s !== before) {
      fs.writeFileSync(file, s, 'utf8');
      console.log('Normalized whitespace in', file);
    }
  } catch (err) {
    console.error('Failed to process', file, err.message);
  }
}

const workspaceRoot = path.resolve(process.cwd());
console.log('Normalizing whitespace under', workspaceRoot);
walk(workspaceRoot);
console.log('Done');
