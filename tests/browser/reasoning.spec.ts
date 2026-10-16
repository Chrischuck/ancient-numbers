import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { selectSystem } from './helpers';

test('Yoruba explains the words in its subtractive name and updates after calculating', async ({
  page,
}) => {
  await page.goto('?system=yoruba&number=56');
  await expect(page.locator('#output-value')).toContainText('ẹ̀rin dílọgọ́ta');
  await expect(page.locator('#math-reasoning')).toContainText('60 − 4');
  await expect(page.locator('#math-reasoning')).not.toContainText('50 + 6');
  await expect(page.locator('#math-reasoning .formation-steps')).toContainText(/dín/i);
  await expect(page.locator('#conversion-steps')).toHaveCount(0);
  await expect(page.locator('#learning-guide .word-dictionary')).toBeVisible();
  await expect(page.locator('#learning-guide')).toContainText('dín');
  await expect(page.locator('#learning-guide .symbol-tile')).toHaveCount(0);
  await expect(page.locator('#copy-button')).toContainText('Copy words');
  await expect(page.locator('#copy-button')).toBeEnabled();
  await expect(page.locator('#download-button')).toBeDisabled();
  await page.getByRole('tab', { name: 'Calculate' }).click();
  await page.locator('#number-input').fill('60');
  await page.locator('#operation').selectOption('subtract');
  await page.locator('#second-input').fill('4');
  await expect(page.locator('#exact-value')).toHaveText('56');
  await expect(page.locator('#math-reasoning')).toContainText('60 − 4');
  await selectSystem(page, 'roman');
  await expect(page.locator('#learning-guide .word-dictionary')).toHaveCount(0);
  await expect(page.locator('#learning-guide .symbol-tile')).toHaveCount(7);
});

test('worked numeral lessons show the signs being assembled for the current input', async ({
  page,
}) => {
  await page.goto('?system=babylonian&number=56');
  const lesson = page.locator('#math-reasoning');
  await expect(lesson.locator('.formation-steps')).toHaveCount(1);
  await expect(lesson.locator('.formation-steps')).toContainText('wedge');
  await expect(lesson).toContainText('5 × 10 + 6 = 56');
  await expect(lesson.locator('.formation-sign svg').first()).toBeVisible();
  await expect(lesson).not.toContainText('Familiar decimal comparison');
  await expect(lesson).not.toContainText('Building the number');
  await page.locator('#number-input').fill('3656');
  await expect(lesson).toContainText('1 × 3,600 + 0 × 60 + 56 = 3,656');
  await expect(lesson.locator('.formation-steps')).toContainText(/empty|placeholder|gap/);

  await selectSystem(page, 'maya');
  await page.locator('#number-input').fill('416');
  await expect(lesson).toContainText('1 × 400 + 0 × 20 + 16 = 416');
  await expect(lesson.locator('.formation-steps')).toContainText('shell');
  await expect(lesson.locator('.formation-sign svg').first()).toBeVisible();

  await selectSystem(page, 'roman');
  await page.locator('#number-input').fill('54');
  await expect(lesson).toContainText('LIV');
  await expect(lesson).toContainText('50 + (5 − 1) = 54');
  await expect(lesson.locator('.formation-steps')).toContainText('IV');
  await expect(lesson.locator('.formation-sign svg').first()).toBeVisible();
});

test('spoken lessons explain the actual words for arbitrary supported inputs', async ({ page }) => {
  await page.goto('?system=choctaw&number=56');
  const lesson = page.locator('#math-reasoning');
  await expect(lesson.locator('.formation-steps')).toContainText(/pokoli tahlapi/i);
  await expect(lesson.locator('.formation-steps')).toContainText(/akocha hannali/i);
  await expect(lesson).toContainText('10 × 5 + 6 = 56');
  await selectSystem(page, 'navajo');
  await expect(lesson.locator('.formation-steps')).toContainText('ashdladiin');
  await expect(lesson.locator('.formation-steps')).toContainText(/dóó bi’aan/i);
  await expect(lesson).toContainText('50 + 6 = 56');
  await page.locator('#number-input').fill('16');
  await expect(lesson.locator('.formation-steps')).toContainText('ts’áadah');
  await expect(lesson).toContainText('6 + 10 = 16');

  await selectSystem(page, 'maori');
  await page.locator('#number-input').fill('2056');
  await expect(lesson.locator('.formation-steps')).toContainText('rua mano');
  await expect(lesson.locator('.formation-steps')).toContainText('rima tekau');
  await expect(lesson).toContainText('2 × 1,000 + 5 × 10 + 6 = 2,056');
  await page.locator('#number-input').fill('56');
  await selectSystem(page, 'hawaiian');
  await expect(lesson.locator('.formation-steps')).toContainText('kanalima');
  await expect(lesson.locator('.formation-steps')).toContainText(/kūmā/i);
  await expect(lesson.locator('.formation-steps')).toContainText('ono');
  await expect(lesson).toContainText('50 + 6 = 56');
  await selectSystem(page, 'mangarevan');
  await expect(lesson.locator('.formation-steps')).toContainText('tataua names 40');
  await expect(lesson.locator('.formation-steps')).toContainText('takau names 10');
  await expect(lesson).toContainText('40 + 10 + 6 = 56');
  await page.locator('#number-input').fill('799');
  await expect(lesson).toContainText('9 × 80 + 40 + 20 + 10 + 9 = 799');
  await page.locator('#number-input').fill('23');
  await selectSystem(page, 'oksapmin');
  await expect(lesson.locator('.formation-steps')).toContainText('thumb · other side');
  await expect(lesson).toContainText('22 + 1 = 23');
  await expect(lesson.locator('.formation-sign svg')).toHaveCount(3);
  await expect(page.locator('#output-message')).toBeHidden();
});

test('medieval hand numerals have a dictionary and downloadable path artwork', async ({ page }) => {
  await page.goto('?system=medieval-finger-counting&number=9999');
  await expect(page.locator('#output-value .numeral-glyph')).toHaveCount(4);
  await expect(page.locator('#learning-guide')).toContainText('Hand gesture dictionary');
  await expect(page.locator('#learning-guide .gesture-grid')).toBeVisible();
  await expect(page.locator('#output-message')).toBeHidden();
  const downloadEvent = page.waitForEvent('download');
  await page.locator('#download-button').click();
  const download = await downloadEvent;
  const svg = await readFile((await download.path())!, 'utf8');
  expect(svg).toContain('<path');
  expect(svg).not.toContain('<text');
  expect(svg).toContain('9999');
  await page.locator('#number-input').fill('10000');
  await expect(page.locator('#output-message')).toContainText('9,999');
  await page.goto('systems/cistercian-gestures/');
  await expect(page.locator('.learning-guide')).toContainText('Hand gesture dictionary');
  await expect(page.locator('.learning-guide')).toContainText('hour');
});

test('calculator teaches Egyptian doubling using the entered operands', async ({ page }) => {
  await page.goto('?system=egyptian&number=13&mode=calculate&operation=multiply&second=12');
  await expect(page.locator('#exact-value')).toHaveText('156');
  await expect(page.locator('#math-reasoning')).toContainText('doubl');
  await expect(page.locator('#math-reasoning')).toContainText('156');
  await expect(page.locator('#math-reasoning .math-steps li')).not.toHaveCount(0);
  await expect(page.locator('#math-reasoning a').first()).toHaveAttribute('href', /^https:/);
  await page.locator('#second-input').fill('invalid');
  await expect(page.locator('#conversion-guide')).toBeHidden();
});

test('changing the operator replaces the historical method without a base-conversion lesson', async ({
  page,
}) => {
  await page.goto('?system=egyptian&number=13&mode=calculate&operation=multiply&second=24');
  const lesson = page.locator('#math-reasoning');
  await expect(page.locator('#exact-value')).toHaveText('312');
  await expect(lesson).toContainText(/doubl/i);
  await expect(lesson.locator('.formation-steps')).toHaveCount(0);
  await expect(lesson.locator('.math-table table')).toBeVisible();
  await expect(lesson.locator('.math-table svg').first()).toBeVisible();
  await expect(page.locator('#notation-reference')).not.toHaveAttribute('open');
  await page.locator('#notation-reference > summary').click();
  await expect(page.locator('#learning-guide')).toBeVisible();

  await page.locator('#operation').selectOption('add');
  await expect(page.locator('#exact-value')).toHaveText('37');
  await expect(lesson).toContainText(/combin|collect/i);
  await expect(lesson.locator('[data-operation]')).toHaveAttribute('data-operation', 'add');
  await expect(lesson).not.toContainText('doubling and selecting');
  await expect(lesson.locator('.math-table')).toHaveCount(0);
  await expect(lesson.locator('.formation-steps')).toHaveCount(0);

  await page.locator('#number-input').fill('100');
  await page.locator('#second-input').fill('1');
  await page.locator('#operation').selectOption('subtract');
  await expect(page.locator('#exact-value')).toHaveText('99');
  await expect(lesson).toContainText(/complete/i);
  await expect(lesson).toContainText('1 + 9 = 10');
  await expect(lesson).toContainText('10 + 90 = 100');
  await expect(lesson.locator('[data-operation]')).toHaveAttribute('data-operation', 'subtract');
  await expect(lesson).not.toContainText('doubling and selecting');

  await page.locator('#number-input').fill('312');
  await page.locator('#second-input').fill('24');
  await page.locator('#operation').selectOption('divide');
  await expect(page.locator('#exact-value')).toHaveText('13');
  await expect(lesson).toContainText('finding the missing multiplier');
  await expect(lesson.locator('.formation-steps')).toHaveCount(0);
  await expect(page.locator('#translated-equation')).not.toHaveAttribute('open');
});

test('Babylonian multiplication and division use their own table methods', async ({ page }) => {
  await page.goto('?system=babylonian&number=47&mode=calculate&operation=multiply&second=7');
  const lesson = page.locator('#math-reasoning');
  await expect(page.locator('#exact-value')).toHaveText('329');
  await expect(lesson).toContainText(/multiplication table/i);
  await expect(lesson).not.toContainText('multiplying by a reciprocal');
  await expect(lesson.locator('.formation-steps')).toHaveCount(0);
  await page.locator('#number-input').fill('54');
  await page.locator('#second-input').fill('6');
  await page.locator('#operation').selectOption('divide');
  await expect(page.locator('#exact-value')).toHaveText('9');
  await expect(lesson).toContainText('multiplying by a reciprocal');
  await expect(lesson).toContainText('1/6 = 0; 10');
});

test('historical operation lessons fit narrow screens and expose accessible tables', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  for (const path of [
    '?system=egyptian&number=13&mode=calculate&operation=multiply&second=24',
    '?system=egyptian&number=100&mode=calculate&operation=subtract&second=1',
    '?system=babylonian&number=47&mode=calculate&operation=multiply&second=7',
    '?system=rods&number=27&mode=calculate&operation=multiply&second=15',
    '?system=oksapmin&number=16&mode=calculate&operation=subtract&second=7',
  ]) {
    await page.goto(path);
    await expect(page.locator('#conversion-guide')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations.map((violation) => violation.id)).toEqual([]);
  }
});

test('Oksapmin subtraction tracks removed body positions separately from the result', async ({
  page,
}) => {
  await page.goto('?system=oksapmin&number=16&mode=calculate&operation=subtract&second=7');
  await expect(page.locator('#exact-value')).toHaveText('9');
  const lesson = page.locator('#math-reasoning');
  await expect(lesson).toContainText('upper arm');
  await expect(lesson.locator('.math-evidence')).toContainText(/schooling/);
  await expect(lesson.locator('.formation-body svg').first()).toBeVisible();
  await expect(lesson.locator('.formation-steps')).toHaveCount(0);
});

test('illustrated lessons, spoken guides and gesture guides fit accessible small screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    '?system=babylonian&number=3656',
    '?system=maya&number=416',
    '?system=roman&number=54',
    '?system=yoruba&number=56',
    '?system=medieval-finger-counting&number=9999',
    'systems/cistercian-gestures/',
    'systems/mangarevan/',
  ]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.learning-guide')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(accessibility.violations.map((violation) => violation.id)).toEqual([]);
  }
});
