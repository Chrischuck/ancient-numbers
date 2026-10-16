import type { Page } from '@playwright/test';

export async function selectSystem(page: Page, id: string) {
  await page.locator('#system-picker-button').click();
  await page.getByRole('combobox', { name: 'Search numeral systems' }).fill(id);
  await page.locator(`#system-option-${id}`).click();
}
