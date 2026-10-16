import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { selectSystem } from './helpers';

const spokenExamples = [
  ['hawaiian', 'kanalima-kūmā-ono', '0–100'],
  ['maori', 'rima tekau mā ono', '0–9,999'],
  ['choctaw', 'pokoli tahlapi akocha hannali', '1–100'],
  ['navajo', 'ashdladiin dóó bi’aan hastą́ą́', '1–100'],
  ['mangarevan', 'tataua takau ono', '1–799'],
];

for (const [system, words, range] of spokenExamples) {
  test(`${system} constructs an intermediate number and the calculator result`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(`?system=${system}&number=56`);
    await expect(page.locator('#output-value')).toContainText(words);
    await expect(page.locator('#output-message')).toBeHidden();
    await expect(page.locator('#availability')).toContainText(range);
    await expect(page.locator('#math-reasoning')).toContainText('56');
    await expect(page.locator('#math-reasoning .formation-steps')).toBeVisible();
    await page.locator('#copy-button').click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(words);
    await page.getByRole('tab', { name: 'Calculate' }).click();
    await page.locator('#number-input').fill('50');
    await page.locator('#second-input').fill('6');
    await expect(page.locator('#exact-value')).toHaveText('56');
    await expect(page.locator('#output-value')).toContainText(words);
    await expect(page.locator('#output-message')).toBeHidden();
  });
}

test('Hawaiian distinguishes ordinary decimal words from the preserved group vocabulary', async ({
  page,
}) => {
  await page.goto('?system=hawaiian&number=40');
  await expect(page.locator('#output-value')).toContainText('kanahā');
  await expect(page.locator('#learning-guide')).toContainText('kaʻau');
  await expect(page.locator('#learning-guide')).toContainText('traditional grouping term');
  await page.locator('#number-input').fill('101');
  await expect(page.locator('#output-message')).toContainText('100');
  await expect(page.locator('#exact-value')).toHaveText('101');
  await expect(page.locator('#output-message')).not.toContainText('listed examples');
  await page.locator('#number-input').fill('0');
  await expect(page.locator('#output-value')).toContainText('ʻole');
});

test('written expansions and the complete body count work in picker comparisons and detail pages', async ({
  page,
}) => {
  await page.goto('?system=cherokee&number=56');
  await expect(page.locator('#output-value svg')).toHaveCount(2);
  await expect(page.locator('#learning-guide .symbol-tile')).toHaveCount(29);
  await expect(page.locator('#output-message')).toBeHidden();
  await selectSystem(page, 'mende-kikakui');
  await expect(page.locator('#output-value svg')).toHaveCount(2);
  await expect(page.locator('#copy-button')).toBeEnabled();
  await selectSystem(page, 'ottoman-siyaq');
  await expect(page.locator('#output-value svg')).toHaveCount(2);
  await expect(page.locator('#math-reasoning')).toContainText('unit before the tens');
  await page.goto('?system=oksapmin&number=23');
  await expect(page.locator('#output-value svg')).toHaveCount(1);
  await expect(page.locator('#output-equation')).toContainText('thumb · other side');
  await expect(page.locator('#learning-guide .symbol-tile')).toHaveCount(27);
  await page.goto('systems/hawaiian/');
  await page.getByRole('button', { name: '56', exact: true }).click();
  await expect(page.locator('#detail-specimen')).toContainText('kanalima-kūmā-ono');
});

test('expanded spoken output and lessons fit mobile and preserve accessibility', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const system of ['hawaiian', 'navajo', 'choctaw', 'mende-kikakui', 'ottoman-siyaq']) {
    await page.goto(`?system=${system}&number=56`);
    await expect(page.locator('#output-message')).toBeHidden();
    await expect(page.locator('#learning-guide')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations.map((violation) => violation.id)).toEqual([]);
  }
});
