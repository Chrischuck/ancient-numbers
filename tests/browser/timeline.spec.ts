import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { timeline } from '../../src/data/timeline';
import { systems } from '../../src/data/systems';

const visible = '[data-entry]:visible';
test('timeline filters combine, preserve URL state, and recover from empty results', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('timeline/');
  await expect(page.locator(visible)).toHaveCount(timeline.length);
  await page.getByRole('button', { name: '1500–1799', exact: true }).click();
  await page.getByLabel('Entry type', { exact: true }).selectOption('notation');
  await page.getByLabel('Search timeline', { exact: true }).fill('Leibniz');
  await expect(page.locator(visible)).toHaveCount(2);
  await expect(page).toHaveURL(/type=notation/);
  await page.reload();
  await expect(page.locator(visible)).toHaveCount(2);
  await expect(page.getByLabel('Search timeline', { exact: true })).toHaveValue('Leibniz');
  await page.getByLabel('Search timeline', { exact: true }).fill('nothing-here');
  await expect(page.locator('#timeline-empty')).toBeVisible();
  await page.getByRole('button', { name: 'Show all history' }).click();
  await expect(page.locator(visible)).toHaveCount(timeline.length);
  await expect(page.locator('#timeline-count')).toHaveText(
    `${timeline.length} entries · all history`,
  );
  expect(errors).toEqual([]);
});

test('BCE ranges, overview navigation, and date validation work', async ({ page }) => {
  await page.goto('timeline/');
  await page.getByLabel('From year').fill('-2000');
  await page.getByLabel('To year').fill('-1500');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(page.locator(visible)).toHaveCount(2);
  await page.getByLabel('From year').fill('1500');
  await page.getByLabel('To year').fill('1000');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(page.locator('#timeline-date-error')).toBeVisible();
  await expect(page.locator(visible)).toHaveCount(2);
  await page.getByLabel('From year').fill('0');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(page.locator('#timeline-date-error')).toContainText('no year zero');
  await page.locator('[data-window][data-start="1000"]').click();
  await expect(page.locator('#cistercian-numerals')).toBeVisible();
  await expect(page.locator('#equals')).toBeHidden();
});

test('period view distinguishes overlapping use from dated events', async ({ page }) => {
  await page.goto('timeline/?from=1900&to=2026&view=periods');
  await expect(page.locator('#equals')).toBeVisible();
  await expect(page.locator('#equals .usage-visual')).toBeVisible();
  await expect(page.locator('#kaktovik')).toBeVisible();
  await expect(page.locator('#wiles')).toBeHidden();
  await expect(page.locator('#cistercian-numerals')).toBeHidden();
  await page.getByRole('button', { name: 'Events', exact: true }).click();
  await expect(page.locator('#equals')).toBeHidden();
  await expect(page.locator('#wiles')).toBeVisible();
  await page.getByRole('button', { name: 'Periods of use', exact: true }).click();
  await page.getByLabel('Use today', { exact: true }).selectOption('historical');
  await expect(page.locator('#vai-numerals')).toBeVisible();
  await expect(page.locator('#osmanya-numerals')).toBeVisible();
  await expect(page.locator('#equals')).toBeHidden();
  await expect(page.locator('#cistercian-numerals')).toBeHidden();
});

test('entry links expand their sources, are keyboard accessible, and survive filtering', async ({
  page,
}) => {
  await page.goto('timeline/#equals');
  await expect(page.locator('#equals details')).toHaveAttribute('open', '');
  await expect(page.locator('#equals .timeline-entry-links')).toBeVisible();
  const summary = page.locator('#equals summary');
  await summary.focus();
  await summary.press('Enter');
  await expect(page.locator('#equals details')).not.toHaveAttribute('open');
  await summary.press('Enter');
  await expect(page.locator('#equals details')).toHaveAttribute('open', '');
  await page.goto('timeline/?type=milestone#kaktovik');
  await expect(page.locator('#kaktovik')).toBeVisible();
  await expect(page.locator('#kaktovik details')).toHaveAttribute('open', '');
  await expect(page.locator('#kaktovik a[href$="systems/kaktovik/"]')).toBeVisible();
});

for (const width of [1440, 390, 320])
  test(`timeline layout and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('timeline/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(
      page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'Timeline', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  });

test('timeline remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/ancient-numbers/timeline/');
  await expect(page.locator(visible)).toHaveCount(timeline.length);
  await page.locator('#equals summary').click();
  await expect(page.locator('#equals .timeline-entry-links')).toBeVisible();
  await expect(page.locator('.timeline-controls')).toBeHidden();
  await context.close();
});

test('all supported systems are linked and unknown origins respect date filters', async ({
  page,
}) => {
  await page.goto('timeline/?type=numerals');
  await expect(
    page.locator('[data-entry]:visible .timeline-entry-links a[href*="/systems/"]'),
  ).toHaveCount(systems.length);
  await expect(page.locator('#yoruba-numerals')).toContainText('Origin unknown');
  await page.getByLabel('Search timeline', { exact: true }).fill('Yoruba');
  await expect(page.locator(visible)).toHaveCount(1);
  await page.getByRole('button', { name: 'Ancient', exact: true }).click();
  await expect(page.locator('#yoruba-numerals')).toBeHidden();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.locator('#yoruba-numerals')).toBeVisible();
});
