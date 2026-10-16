import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('search filters by name, region, and accents and selects a system', async ({ page }) => {
  await page.goto('?system=roman&number=42');
  const button = page.locator('#system-picker-button');
  const search = page.getByRole('combobox', { name: 'Search numeral systems' });
  await expect(button).toContainText('Roman');
  await button.click();
  await expect(search).toBeFocused();
  await search.fill('oceania');
  await expect(page.getByRole('group', { name: 'Oceania' })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Europe' })).toHaveCount(0);
  await search.fill('MAORI');
  await expect(page.getByRole('option')).toHaveCount(1);
  await page.getByRole('option', { name: 'Māori' }).click();
  await expect(button).toBeFocused();
  await expect(button).toContainText('Māori');
  await expect(page.locator('#output-name')).toHaveText('MĀORI');
  await expect(page).toHaveURL(/system=maori/);
  await button.click();
  await expect(search).toHaveValue('');
  await search.fill('no-such-system');
  await expect(page.getByRole('option')).toHaveCount(0);
  await expect(page.locator('#system-search-status')).toContainText('No systems found');
  await search.press('Enter');
  await expect(button).toContainText('Māori');
  await search.press('Escape');
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('keyboard navigation chooses results and dismisses without changing the selection', async ({
  page,
}) => {
  await page.goto('');
  const button = page.locator('#system-picker-button');
  const search = page.getByRole('combobox', { name: 'Search numeral systems' });
  await button.focus();
  await button.press('ArrowDown');
  await search.fill('europe');
  const options = page.getByRole('option');
  const secondName = await options.nth(1).textContent();
  await search.press('ArrowDown');
  await expect(search).toHaveAttribute(
    'aria-activedescendant',
    (await options.nth(1).getAttribute('id')) as string,
  );
  await search.press('ArrowUp');
  await search.press('ArrowDown');
  await search.press('Enter');
  await expect(button).toContainText(secondName!);
  await button.click();
  await search.fill('maya');
  await search.press('Tab');
  await expect(page.locator('#system-picker')).toBeHidden();
  await expect(page.locator('#example-chips button').first()).toBeFocused();
  await expect(button).toContainText(secondName!);
  await button.click();
  await page.locator('#number-input').click();
  await expect(page.locator('#system-picker')).toBeHidden();
  await expect(page.locator('#number-input')).toBeFocused();
});

test('open picker fits mobile and has accessible structure and contrast', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('');
  await page.locator('#system-picker-button').click();
  await expect(page.getByRole('combobox', { name: 'Search numeral systems' })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    results.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
  await page.getByRole('combobox', { name: 'Search numeral systems' }).fill('maya');
  await page.getByRole('option', { name: 'Maya', exact: true }).click();
  await expect(page.locator('#output-name')).toHaveText('MAYA');
});
