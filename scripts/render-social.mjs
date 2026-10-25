import { readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Optional asset maintenance command. Normal builds use the checked-in PNG.
const modulePath = process.argv[2];
const { chromium } = modulePath
  ? await import(pathToFileURL(resolve(modulePath)).href)
  : await import('playwright');
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const svg = await readFile(new URL('../assets/social-card.svg', import.meta.url), 'utf8');
  await page.setContent(`<html><head><style>body{margin:0}svg{display:block}</style></head><body>${svg}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await mkdir(new URL('../public/', import.meta.url), { recursive: true });
  await page.screenshot({ path: new URL('../public/social.png', import.meta.url).pathname });
  console.log('Generated public/social.png (1200 × 630).');
} finally {
  await browser.close();
}
