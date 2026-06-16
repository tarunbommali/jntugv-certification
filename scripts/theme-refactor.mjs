import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../src');

// Safe replacements that map to the new theme system
const replacements = [
  // Backgrounds
  { regex: /\bbg-white\b/g, replacement: 'bg-surface' },
  { regex: /\bbg-black\b/g, replacement: 'bg-background' },
  { regex: /\bbg-gray-50\b/g, replacement: 'bg-background' },
  { regex: /\bbg-gray-100\b/g, replacement: 'bg-surface-elevated' },
  { regex: /\bbg-gray-200\b/g, replacement: 'bg-surface-elevated' },
  { regex: /\bbg-gray-800\b/g, replacement: 'bg-surface-elevated' },
  { regex: /\bbg-gray-900\b/g, replacement: 'bg-surface' },

  // Text Colors
  { regex: /\btext-black\b/g, replacement: 'text-foreground' },
  { regex: /\btext-gray-900\b/g, replacement: 'text-foreground' },
  { regex: /\btext-gray-800\b/g, replacement: 'text-foreground' },
  { regex: /\btext-gray-700\b/g, replacement: 'text-muted' },
  { regex: /\btext-gray-600\b/g, replacement: 'text-muted' },
  { regex: /\btext-gray-500\b/g, replacement: 'text-muted' },
  { regex: /\btext-gray-400\b/g, replacement: 'text-muted' },

  // Borders
  { regex: /\bborder-gray-100\b/g, replacement: 'border-border' },
  { regex: /\bborder-gray-200\b/g, replacement: 'border-border' },
  { regex: /\bborder-gray-300\b/g, replacement: 'border-border' },
  { regex: /\bborder-gray-700\b/g, replacement: 'border-border' },
  { regex: /\bborder-gray-800\b/g, replacement: 'border-border' },
  { regex: /\bdivide-gray-100\b/g, replacement: 'divide-border' },
  { regex: /\bdivide-gray-200\b/g, replacement: 'divide-border' },
  { regex: /\bdivide-gray-700\b/g, replacement: 'divide-border' },
  { regex: /\bdivide-gray-800\b/g, replacement: 'divide-border' },

  // Hovers
  { regex: /\bhover:bg-gray-50\b/g, replacement: 'hover:bg-surface-elevated' },
  { regex: /\bhover:bg-gray-100\b/g, replacement: 'hover:bg-surface-elevated' },
  { regex: /\bhover:bg-gray-800\b/g, replacement: 'hover:bg-surface-elevated' },
];

let filesModified = 0;

function scanAndReplace(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanAndReplace(filePath);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx') || filePath.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;

      replacements.forEach(r => {
        content = content.replace(r.regex, r.replacement);
      });

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath.replace(rootDir, 'src')}`);
        filesModified++;
      }
    }
  }
}

console.log('Applying theme refactoring...');
scanAndReplace(rootDir);
console.log(`\nRefactoring complete! Modified ${filesModified} files.`);
