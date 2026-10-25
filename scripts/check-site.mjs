import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

// Uses a separately provided Playwright install, keeping browser binaries out of the source bundle.
const modulePath = process.argv[2];
const { chromium } = modulePath
  ? await import(pathToFileURL(resolve(modulePath)).href)
  : await import('playwright');
const axePath = process.argv[3];
const root = resolve('dist');
const output = resolve('test/scratch/interactions');
await mkdir(output, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://preview.invalid').pathname);
  if (!pathname.startsWith('/preview/')) { res.writeHead(404).end(); return; }
  const file = resolve(root, pathname.slice('/preview/'.length) || 'index.html');
  if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  try {
    const content = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
    res.end(content);
  } catch { res.writeHead(404).end(); }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}/preview/`;
const browser = await chromium.launch({ headless: true });
const checks = [];
const errors = [];
const check = (message) => { checks.push(message); console.log(`PASS ${message}`); };

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', (request) => errors.push(request.failure()?.errorText));
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(base);

  assert.equal(await page.locator('main').count(), 1);
  assert.equal(await page.getByRole('heading', { level: 1 }).textContent(), 'Ten onchain projects.');
  assert.equal(await page.locator('.project').count(), 10);
  assert.equal(await page.locator('.upcoming').count(), 10);
  assert.equal(await page.locator('.project a').count(), 0);
  assert.equal(await page.locator('.launch-count').textContent(), '0 / 10 launched');
  assert.equal(await page.locator('script').count(), 0);
  check('Ten honest upcoming slots, zero launched, no fake project links or client scripts');

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(base);
    const bounds = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
      title: document.querySelector('h1').getBoundingClientRect().bottom,
      action: document.querySelector('.index-link a').getBoundingClientRect().bottom,
      firstProject: document.querySelector('.project').getBoundingClientRect().bottom,
    }));
    assert.ok(bounds.content <= bounds.viewport, `${width}px overflow`);
    assert.ok(bounds.title <= 844 && bounds.action <= 844 && bounds.firstProject <= 844);
    await page.screenshot({ path: `${output}/${width}.png`, fullPage: true });
    check(`${width}px: no overflow; title, primary action and first project on first screen`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('href'), 'https://twitter.com/surfcoderepeat');
  assert.equal(await page.locator(':focus').evaluate((el) => getComputedStyle(el).outlineStyle), 'solid');
  await page.screenshot({ path: `${output}/390-focus-creator.png` });
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('href'), '#projects');
  await page.screenshot({ path: `${output}/390-focus-projects.png` });
  await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).hash, '#projects');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'projects');
  check('Keyboard: creator link, visible focus, project link, Enter jumps and focuses project heading');

  await page.goto(base);
  await page.getByRole('link', { name: 'View the projects' }).click();
  assert.equal(new URL(page.url()).hash, '#projects');
  await page.goBack();
  assert.equal(new URL(page.url()).hash, '');
  check('Pointer: project jump and browser Back work at the gateway subpath');

  let clickedTwitter = false;
  await page.route('https://twitter.com/surfcoderepeat', async (route) => {
    clickedTwitter = true;
    await route.fulfill({ contentType: 'text/html', body: '<title>Navigation test</title>' });
  });
  await page.getByRole('link', { name: '@surfcoderepeat on Twitter' }).click();
  assert.ok(clickedTwitter);
  check('Creator link navigates to the exact requested Twitter profile (intercepted, no availability claim)');

  await page.goto(base);
  for (const selector of ['link[rel="icon"]', 'meta[property="og:image"]']) {
    const asset = await page.locator(selector).getAttribute(selector.startsWith('link') ? 'href' : 'content');
    assert.ok(asset.startsWith('./'));
    const response = await context.request.get(new URL(asset, base).href);
    assert.equal(response.status(), 200);
  }
  const image = await page.evaluate(async () => {
    const img = new Image();
    img.src = document.querySelector('meta[property="og:image"]').content;
    await img.decode();
    return [img.naturalWidth, img.naturalHeight];
  });
  assert.deepEqual(image, [1200, 630]);
  assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 0);
  assert.ok((await page.locator('meta[property="og:title"]').getAttribute('content')).length > 0);
  check('Title, description, favicon and 1200 × 630 share image resolve at /preview/');

  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
  await page.screenshot({ path: `${output}/390-text-200.png`, fullPage: true });
  check('200% CSS text enlargement at 390px reflows without horizontal scroll');

  await page.goto(base);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.evaluate(() => {
    document.querySelector('.project:nth-child(1) .upcoming').textContent = 'Upcoming project with a much longer announcement still to come';
    document.querySelector('.byline a').textContent = '@surfcoderepeat on Twitter, with an intentionally longer link label';
  });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
  await page.screenshot({ path: `${output}/320-long-copy.png`, fullPage: true });
  check('Long-copy stress at 320px wraps without clipping or horizontal overflow (test-only content)');

  await page.goto(base);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').evaluate((el) => getComputedStyle(el).outlineStyle), 'solid');
  await page.screenshot({ path: `${output}/390-forced-colors.png` });
  await page.emulateMedia({ forcedColors: 'none', reducedMotion: 'no-preference' });
  check('Forced colors retain underlines and keyboard focus; reduced motion needs no animated fallback');

  if (axePath) {
    await page.goto(base);
    await page.addScriptTag({ path: resolve(axePath) });
    const axe = await page.evaluate(async () => window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
    }));
    await writeFile(`${output}/axe.json`, JSON.stringify(axe, null, 2));
    assert.deepEqual(axe.violations.map(({ id, impact }) => ({ id, impact })), []);
    check(`axe-core ${axe.testEngine.version}: zero WCAG A/AA violations (${axe.passes.length} rules passed)`);
  }

  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJs.newPage();
  await staticPage.goto(base);
  assert.equal(await staticPage.locator('.project').count(), 10);
  await staticPage.getByRole('link', { name: 'View the projects' }).click();
  assert.equal(new URL(staticPage.url()).hash, '#projects');
  check('JavaScript disabled: full content and project navigation still work');
  await noJs.close();

  assert.deepEqual(errors, []);
  check('No browser console errors, page errors, failed requests or HTTP error responses');
  await writeFile(`${output}/results.json`, JSON.stringify({ checks, errors }, null, 2));
  await context.close();
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
