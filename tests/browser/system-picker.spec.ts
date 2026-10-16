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
  const popup = page.getByRole('dialog', { name: 'Choose a numeral system' });
  expect(await popup.boundingBox()).toEqual({ x: 0, y: 0, width: 390, height: 844 });
  await expect(popup.getByRole('button', { name: 'Cancel' })).toBeVisible();
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

test('mobile search keeps focus inside and Cancel restores the scrolled page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('?system=mangarevan&number=40');
  await page.evaluate(() => document.fonts.ready);
  const button = page.locator('#system-picker-button');
  const popup = page.getByRole('dialog', { name: 'Choose a numeral system' });
  const search = page.getByRole('combobox', { name: 'Search numeral systems' });
  const cancel = popup.getByRole('button', { name: 'Cancel' });
  await button.evaluate((element) =>
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 240,
      behavior: 'instant',
    }),
  );
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(0);
  await button.click();
  expect(await popup.boundingBox()).toEqual({ x: 0, y: 0, width: 390, height: 844 });
  await page.locator('#number-input').evaluate((element) => element.focus());
  await expect(search).toBeFocused();
  await search.press('Tab');
  await expect(cancel).toBeFocused();
  await cancel.press('Tab');
  await expect(search).toBeFocused();
  await search.press('Shift+Tab');
  await expect(cancel).toBeFocused();
  await cancel.press('Shift+Tab');
  await expect(search).toBeFocused();
  await search.fill('maya');
  await cancel.click();
  await expect(popup).toBeHidden();
  await expect(button).toBeFocused();
  await expect(button).toContainText('Mangarevan');
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(scrollY, 0);
  await button.click();
  await expect(search).toHaveValue('');
  await search.press('Escape');
  await expect(popup).toBeHidden();
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(scrollY, 0);
});

test('mobile results fit above the keyboard when only the visual viewport shrinks', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('');
  const button = page.locator('#system-picker-button');
  const popup = page.getByRole('dialog', { name: 'Choose a numeral system' });
  const search = page.getByRole('combobox', { name: 'Search numeral systems' });
  const list = page.getByRole('listbox', { name: 'Numeral systems' });
  await button.click();
  // Model iOS: the keyboard changes the visual viewport, leaving the layout viewport intact.
  await page.evaluate(() => {
    const viewport = window.visualViewport!;
    Object.defineProperty(viewport, 'height', { configurable: true, value: 300 });
    viewport.dispatchEvent(new Event('resize'));
    Object.defineProperty(viewport, 'offsetTop', { configurable: true, value: 40 });
    viewport.dispatchEvent(new Event('scroll'));
  });
  expect(await page.evaluate(() => window.innerHeight)).toBe(568);
  expect(await popup.boundingBox()).toEqual({ x: 0, y: 40, width: 320, height: 300 });
  const searchBounds = (await search.boundingBox())!;
  const listBounds = (await list.boundingBox())!;
  expect(searchBounds.y).toBeGreaterThanOrEqual(40);
  expect(listBounds.y).toBeGreaterThan(searchBounds.y);
  expect(listBounds.height).toBeGreaterThan(44);
  expect(listBounds.y + listBounds.height).toBeLessThanOrEqual(340);
  expect(await list.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  await search.fill('oceania');
  await search.press('ArrowUp');
  await expect(page.locator('.system-option.is-active')).toBeInViewport({ ratio: 0.99 });
  await search.fill('maya');
  await page.getByRole('option', { name: 'Maya', exact: true }).click();
  await expect(popup).toBeHidden();
  await expect(button).toBeFocused();
  await expect(page.locator('#output-name')).toHaveText('MAYA');
  await expect(page).toHaveURL(/system=maya/);
});
