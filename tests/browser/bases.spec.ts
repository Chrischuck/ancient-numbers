import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Bases is reachable from the converter and explains both conversion directions', async ({
  page,
}) => {
  await page.goto('');
  await page.getByRole('link', { name: 'Understanding bases' }).click();
  await expect(page).toHaveURL(/\/bases\/$/);
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Bases', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  const lesson = page.locator('#base-lesson');
  await expect(lesson).toContainText('101010');
  await expect(lesson).toContainText('Read the source number');
  await expect(lesson).toContainText('Write the target number');
  await expect(lesson).toContainText('bottom to top');

  await page.getByLabel('From base', { exact: true }).selectOption('2');
  await page.getByLabel('To base', { exact: true }).selectOption('16');
  await page.getByLabel('Number', { exact: true }).fill('11111111');
  await page.getByRole('button', { name: 'Show conversion' }).click();
  await expect(lesson).toContainText('255');
  await expect(lesson).toContainText('FF');
  await expect(lesson).toContainText('15');

  await page.getByLabel('From base', { exact: true }).selectOption('60');
  await page.getByLabel('To base', { exact: true }).selectOption('10');
  await page.getByLabel('Number', { exact: true }).fill('1,0,1');
  await page.getByRole('button', { name: 'Show conversion' }).click();
  await expect(lesson).toContainText('3601');
  await expect(page.locator('#base-input-error')).toBeHidden();
});

test('base conversion rejects invalid digits and recovers with a valid value', async ({ page }) => {
  await page.goto('bases/');
  await page.getByLabel('From base', { exact: true }).selectOption('2');
  await page.getByLabel('Number', { exact: true }).fill('102');
  await page.getByRole('button', { name: 'Show conversion' }).click();
  await expect(page.locator('#base-input-error')).toBeVisible();
  await expect(page.locator('#base-number')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#base-lesson')).toBeHidden();
  await page.getByLabel('Number', { exact: true }).fill('101');
  await page.getByLabel('To base', { exact: true }).selectOption('10');
  await page.getByRole('button', { name: 'Show conversion' }).click();
  await expect(page.locator('#base-input-error')).toBeHidden();
  await expect(page.locator('#base-lesson')).toContainText('5');
});

test('Bases works at phone widths with accessible content and controls', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('bases/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(accessibility.violations.map((violation) => violation.id)).toEqual([]);
});
