import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
await mkdir(dist, { recursive: true });

const html = await readFile(resolve(root, 'index.html'), 'utf8');
const css = await readFile(resolve(root, 'src/styles.css'), 'utf8');
const model = await readFile(resolve(root, 'src/tab-model.mjs'), 'utf8');
const content = await readFile(resolve(root, 'content.json'), 'utf8');
const main = await readFile(resolve(root, 'src/main.js'), 'utf8');
const bundledMain = main
  .replace("import { getInitialCard, normalizeDeck, normalizeRecord } from './tab-model.mjs';", '')
  .replace('const EMBEDDED_DECK = null;', 'const EMBEDDED_DECK = ' + content.trim() + ';');
const bundledScript = model + '\n' + bundledMain;
const bundledHtml = html
  .replace('<link rel="stylesheet" href="src/styles.css" />', '<style>' + css + '</style>')
  .replace('<script type="module" src="src/main.js"></script>', '<script type="module">' + bundledScript + '</script>');

await writeFile(resolve(dist, 'index.html'), bundledHtml);
console.log('Built dist/index.html');
