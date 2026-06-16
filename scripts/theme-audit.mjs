import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../src');

// Regex to find violations
const violations = [
  { regex: /text-black\b/g, name: 'text-black', suggestion: 'text-foreground' },
  { regex: /text-white\b/g, name: 'text-white', suggestion: 'text-primary-contrast or text-foreground (dark mode)' },
  { regex: /text-gray-[0-9]{3}\b/g, name: 'text-gray-*', suggestion: 'text-secondary or text-disabled' },
  { regex: /bg-black\b/g, name: 'bg-black', suggestion: 'bg-background or bg-surface' },
  { regex: /bg-white\b/g, name: 'bg-white', suggestion: 'bg-surface or bg-card' },
  { regex: /bg-gray-[0-9]{3}\b/g, name: 'bg-gray-*', suggestion: 'bg-surface-elevated' },
  { regex: /border-gray-[0-9]{3}\b/g, name: 'border-gray-*', suggestion: 'border-border' },
  { regex: /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g, name: 'Hardcoded Hex', suggestion: 'Use var(--color-*) or tailwind classes' },
  { regex: /style=\{\{.*?color:.*?\}\}/gi, name: 'Inline Color Style', suggestion: 'Use className with theme tokens' },
  { regex: /style=\{\{.*?backgroundColor:.*?\}\}/gi, name: 'Inline Background Style', suggestion: 'Use className with theme tokens' }
];

const results = [];

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx') || filePath.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        violations.forEach(v => {
          const matches = line.match(v.regex);
          if (matches) {
            matches.forEach(match => {
              results.push({
                file: filePath.replace(rootDir, 'src'),
                line: index + 1,
                violation: match,
                suggestion: v.suggestion
              });
            });
          }
        });
      });
    }
  }
}

console.log('Scanning for hardcoded theme violations...');
scanDirectory(rootDir);

console.log('\n--- Theme Audit Report ---\n');
if (results.length === 0) {
  console.log('No theme violations found! 🎉');
} else {
  console.log(`Found ${results.length} potential violations:\n`);
  
  results.forEach(res => {
    console.log(`File Name: ${res.file}`);
    console.log(`Line Number: ${res.line}`);
    console.log(`Violation: ${res.violation}`);
    console.log(`Suggested Theme Token: ${res.suggestion}`);
    console.log('--------------------------------------------------');
  });
}
