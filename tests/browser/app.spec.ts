import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { systems } from '../../src/data/systems';
import { readFile } from 'node:fs/promises';
const ready = async (page: import('@playwright/test').Page) => {
  await expect(page.locator('.output-panel')).toHaveAttribute('aria-busy', 'false');
};
test('default converter, calculator exactness, and unsupported results', async ({ page }) => {
  await page.goto('');
  await ready(page);
  await expect(page.locator('#exact-value')).toHaveText('42');
  await expect(page.locator('#output-value .numeral-glyph')).toHaveCount(2);
  await page.getByRole('tab', { name: 'Calculate' }).click();
  await page.locator('#number-input').fill('0.1');
  await page.locator('#second-input').fill('0.2');
  await expect(page.locator('#exact-value')).toHaveText('0.3');
  await expect(page.locator('#output-message')).toContainText('whole numbers');
  await page.locator('#operation').selectOption('divide');
  await page.locator('#second-input').fill('0');
  await expect(page.locator('#input-error')).toContainText('Division by zero');
  await expect(page.locator('#output-value .numeral-glyph')).toHaveCount(0);
  await page.locator('#number-input').fill('1');
  await page.locator('#second-input').fill('3');
  await expect(page.locator('#exact-value')).toHaveText('1/3');
  await page.locator('#operation').selectOption('subtract');
  await page.locator('#second-input').fill('2');
  await expect(page.locator('#exact-value')).toHaveText('-1');
  await expect(page.locator('#output-message')).toContainText('minus sign');
});
test('every tradition loads its specimen without client errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('');
  for (const s of systems) {
    await page.locator('#number-input').fill(String(s.specimen));
    await page.locator('#system-select').selectOption(s.id);
    await ready(page);
    await expect(page.locator('#output-name')).toHaveText(s.name.toUpperCase());
    await expect(page.locator('#exact-value')).toHaveText(String(s.specimen));
    await expect(page.locator('#output-message')).toBeHidden();
    await expect(page.locator('#output-value > .specimen')).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test('Sinhala thousands work in shared links, examples, and calculations', async ({ page }) => {
  await page.goto('?system=sinhala&number=1987');
  await expect(page.locator('#output-name')).toHaveText('SINHALA ILLAKKAM');
  await expect(page.locator('#output-value .numeral-glyph')).toHaveCount(5);
  await expect(page.locator('#output-message')).toBeHidden();
  await expect(page.locator('#output-equation')).toHaveText('1,000 + 9 × 100 + 80 + 7 = 1,987');
  await page.getByRole('button', { name: '2010', exact: true }).click();
  await expect(page.locator('#output-value .numeral-glyph')).toHaveCount(3);
  await expect(page.locator('#output-equation')).toHaveText('2 × 1,000 + 10 = 2,010');
  await page.getByRole('tab', { name: 'Calculate' }).click();
  await page.locator('#number-input').fill('1000');
  await page.locator('#second-input').fill('987');
  await expect(page.locator('#exact-value')).toHaveText('1987');
  await expect(page.locator('#output-value .numeral-glyph')).toHaveCount(5);
  await page.locator('#number-input').fill('9999');
  await page.locator('#second-input').fill('1');
  await expect(page.locator('#exact-value')).toHaveText('10000');
  await expect(page.locator('#output-message')).toContainText('9,999');
});
test('SVGdownload contains paths and no font dependency', async ({ page }) => {
  await page.goto('');
  await ready(page);
  const download = page.waitForEvent('download');
  await page.locator('#download-button').click();
  const file = await download;
  const svg = await readFile((await file.path())!, 'utf8');
  expect(svg).toContain('<path');
  expect(svg).not.toContain('<text');
  expect(svg).not.toContain('href=');
  expect(file.suggestedFilename()).toBe('ancient-numbers-kaktovik-42.svg');
});
test('comparison state is bounded, shareable, and restored', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('');
  await ready(page);
  await page.locator('#add-comparison').click();
  await expect(page.locator('.comparison-card')).toHaveCount(1);
  await page.locator('#add-comparison').click();
  await expect(page.locator('.comparison-card')).toHaveCount(2);
  await expect(page.locator('#add-comparison')).toBeDisabled();
  await page.locator('#share-button').click();
  await expect(page.locator('#action-status')).toContainText('Link copied');
  const shared = await page.evaluate(() => navigator.clipboard.readText());
  expect(shared).toContain('/ancient-numbers/?');
  expect(shared).toContain('compare=');
  await page.goto(shared);
  await expect(page.locator('.comparison-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Remove comparison 1' }).click();
  await expect(page.locator('.comparison-card')).toHaveCount(1);
  await expect(page.locator('#add-comparison')).toBeEnabled();
});
test('collection filters normalize accents and combine filters', async ({ page }) => {
  await page.goto('collection/');
  await expect(page.locator('[data-card]:visible')).toHaveCount(36);
  await page.locator('#region-filter').selectOption('Africa');
  await expect(page.locator('[data-card]:visible')).toHaveCount(11);
  await page.locator('#structure-filter').selectOption('Spoken');
  await expect(page.locator('[data-card]:visible')).toHaveCount(1);
  await page.locator('#region-filter').selectOption('all');
  await page.locator('#collection-search').fill('maori');
  await expect(page.locator('[data-card]:visible')).toHaveCount(1);
  await expect(page.locator('[data-card]:visible h3')).toHaveText('Māori');
  await page.locator('#collection-search').fill('not-a-tradition');
  await expect(page.locator('#no-results')).toBeVisible();
});
test('deep links and verified detail examples work under repository base', async ({ page }) => {
  await page.goto('systems/oksapmin/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oksapmin body counting');
  await page.getByRole('button', { name: '27', exact: true }).click();
  await expect(page.locator('#detail-description')).toContainText('opposite little finger');
  await expect(page.locator('#detail-specimen svg')).toHaveCount(1);
  await page.goto('systems/mangarevan/');
  await page.getByRole('button', { name: '273', exact: true }).click();
  await expect(page.locator('#detail-specimen')).toContainText('toru varu paua takau toru');
});
for (const route of ['', 'collection/', 'systems/mende-kikakui/', 'about/'])
  test(`accessible structure and contrast: ${route || 'home'}`, async ({ page }) => {
    await page.goto(route);
    if (route === '') await ready(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  });
test('mobile layouts have no horizontal page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    '',
    '?system=sinhala&number=9999',
    'collection/',
    'systems/kharoshthi/',
    'systems/navajo/',
    'about/',
  ]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});

test('tool tabs follow keyboard focus and Home/End semantics', async ({ page }) => {
  await page.goto('');
  const translate = page.getByRole('tab', { name: 'Translate' });
  const calculate = page.getByRole('tab', { name: 'Calculate' });
  await translate.focus();
  await translate.press('End');
  await expect(calculate).toBeFocused();
  await expect(calculate).toHaveAttribute('aria-selected', 'true');
  await calculate.press('Home');
  await expect(translate).toBeFocused();
  await translate.press('Home');
  await expect(translate).toBeFocused();
  await translate.press('ArrowRight');
  await expect(calculate).toBeFocused();
});
