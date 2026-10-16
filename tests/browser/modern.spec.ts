import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test('the Modern picker group contains binary and hex and updates the converter', async ({
  page,
}) => {
  await page.goto('');
  await page.locator('#system-picker-button').click();
  await page.getByRole('combobox', { name: 'Search numeral systems' }).fill('modern');
  const group = page.getByRole('group', { name: 'Modern', exact: true });
  await expect(group.getByRole('option')).toHaveText(['Binary', 'Hexadecimal']);
  await group.getByRole('option', { name: 'Hexadecimal' }).click();
  await expect(page.locator('#output-name')).toHaveText('HEXADECIMAL');
  await expect(page.locator('#output-base')).toHaveText('Base 16');
  await expect(page.locator('#output-value .specimen')).toHaveAttribute(
    'aria-label',
    'Digit 2, Digit A (10)',
  );
  await expect(page).toHaveURL(/system=hexadecimal/);
});

test('the collection filters modern systems and opens their detail pages', async ({ page }) => {
  await page.goto('collection/');
  await page.locator('#region-filter').selectOption({ label: 'Modern' });
  await expect(page.locator('[data-card]:visible')).toHaveCount(2);
  await expect(page.locator('[data-card]:visible h3')).toHaveText(['Binary', 'Hexadecimal']);
  await page.locator('#structure-filter').selectOption('Positional');
  await expect(page.locator('[data-card]:visible')).toHaveCount(2);
  await page.locator('#collection-search').fill('hex');
  await expect(page.locator('[data-card]:visible')).toHaveCount(1);
  await page.locator('[data-card]:visible').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hexadecimal');
  await expect(page.locator('.breadcrumb')).toContainText('Modern');
  await expect(page.locator('.symbol-tile')).toHaveCount(16);
  await page.getByRole('button', { name: '256', exact: true }).click();
  await expect(page.locator('#detail-specimen svg')).toHaveCount(3);
  await expect(page.locator('#detail-description')).toContainText('100: one 256');
  await page.goto('systems/binary/');
  await expect(page.locator('.symbol-tile')).toHaveCount(2);
  await page.getByRole('button', { name: '181', exact: true }).click();
  await expect(page.locator('#detail-specimen svg')).toHaveCount(8);
  await expect(page.locator('#detail-description')).toContainText('10110101');
});

for (const [system, numeral] of [
  ['binary', '101010'],
  ['hexadecimal', '2A'],
]) {
  test(`${system} supports shared links, copying, downloads, and calculations`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(`?system=${system}&number=42`);
    await expect(page.locator('#output-message')).toBeHidden();
    await expect(page.locator('#output-value svg')).toHaveCount(numeral.length);
    await expect(page.locator('#copy-button')).toBeEnabled();
    await page.locator('#copy-button').click();
    await expect(page.locator('#action-status')).toHaveText('Numeral copied.');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(numeral);
    const download = page.waitForEvent('download');
    await page.locator('#download-button').click();
    const file = await download;
    const svg = await readFile((await file.path())!, 'utf8');
    expect(svg).toContain('<path');
    expect(svg).not.toContain('<text');
    expect(file.suggestedFilename()).toBe(`ancient-numbers-${system}-42.svg`);
    await page.getByRole('tab', { name: 'Calculate' }).click();
    await page.locator('#number-input').fill('40');
    await page.locator('#second-input').fill('2');
    await expect(page.locator('#exact-value')).toHaveText('42');
    await expect(page.locator('#math-reasoning')).toContainText('40 + 2 = 42');
    await expect(page.locator('#math-reasoning')).not.toContainText('Evidence limit');
    await page.locator('#copy-button').click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(numeral);
  });
}

test('modern converters and detail pages fit mobile and preserve accessibility', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const system of ['binary', 'hexadecimal']) {
    for (const route of [`?system=${system}&number=255`, `systems/${system}/`]) {
      await page.goto(route);
      if (route.startsWith('?')) await expect(page.locator('#learning-guide')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(result.violations.map((violation) => violation.id)).toEqual([]);
    }
  }
});
