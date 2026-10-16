import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { systems } from '../../src/data/systems';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide';
type Workspace = 'suanpan' | 'inupiaq-abacus' | 'counter-board' | 'yupana';
type Fixture = {
  system: string;
  operation: Operation;
  first: string;
  second: string;
  exact: string;
  workspace?: Workspace;
  audit?: boolean;
};

const operationNames: Record<Operation, string> = {
  add: 'Addition',
  subtract: 'Subtraction',
  multiply: 'Multiplication',
  divide: 'Division',
};
const smallAnswers: Record<Operation, string> = {
  add: '9',
  subtract: '3',
  multiply: '18',
  divide: '2',
};
const hourAnswers: Record<Operation, string> = {
  add: '3',
  subtract: '1',
  multiply: '2',
  divide: '2',
};

function route(fixture: Fixture) {
  return `?${new URLSearchParams({
    system: fixture.system,
    mode: 'calculate',
    operation: fixture.operation,
    number: fixture.first,
    second: fixture.second,
  })}`;
}

async function expectWorkedOperation(page: Page, fixture: Fixture) {
  await expect(page.locator('#exact-value')).toHaveText(fixture.exact);
  const lesson = page.locator('#math-reasoning');
  await expect(lesson.locator('[data-operation]')).toHaveAttribute(
    'data-operation',
    fixture.operation,
  );
  await expect(lesson.locator('h3')).toContainText(operationNames[fixture.operation]);
  await expect(lesson.locator('.math-steps li').first()).toBeVisible();
  await expect(
    lesson.locator('.math-step-signs svg, .math-step-signs .word-specimen').first(),
  ).toBeVisible();
  await expect(lesson.locator('.math-evidence')).toBeVisible();
  await expect(lesson.locator('.math-method-sources a').first()).toHaveAttribute(
    'href',
    /^https?:\/\//,
  );
  await expect(lesson.locator('.formation-steps')).toHaveCount(0);
  await expect(lesson).not.toContainText(
    /undefined|NaN|Infinity|Missing artwork|Evidence limit:|do not establish a specific (addition|subtraction|multiplication|division) procedure using these signs/,
  );
  await expect(page.locator('#input-error')).toBeHidden();
  await expect(page.locator('.output-panel')).toHaveAttribute('aria-busy', 'false');
}

for (const operation of Object.keys(operationNames) as Operation[]) {
  test(`every actual calculator provides a numerical ${operationNames[operation].toLowerCase()} walkthrough`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    for (const entry of systems) {
      await test.step(`${entry.name} (${entry.id})`, async () => {
        const hours = entry.id === 'cistercian-gestures';
        const fixture: Fixture = {
          system: entry.id,
          operation,
          first: hours ? '2' : '6',
          second: hours ? '1' : '3',
          exact: hours ? hourAnswers[operation] : smallAnswers[operation],
        };
        await page.goto(route(fixture));
        await expectWorkedOperation(page, fixture);
        expect(pageErrors, `${entry.id}/${operation}: browser errors`).toEqual([]);
      });
    }
  });
}

const kaktovikFixtures: Fixture[] = [
  {
    system: 'kaktovik',
    operation: 'add',
    first: '399',
    second: '1',
    exact: '400',
    workspace: 'inupiaq-abacus',
    audit: true,
  },
  {
    system: 'kaktovik',
    operation: 'subtract',
    first: '400',
    second: '1',
    exact: '399',
    workspace: 'inupiaq-abacus',
    audit: true,
  },
  {
    system: 'kaktovik',
    operation: 'multiply',
    first: '19',
    second: '21',
    exact: '399',
    workspace: 'inupiaq-abacus',
    audit: true,
  },
  {
    system: 'kaktovik',
    operation: 'divide',
    first: '400',
    second: '21',
    exact: '400/21',
    workspace: 'inupiaq-abacus',
    audit: true,
  },
];

async function expectInupiaqAbacus(page: Page) {
  const lesson = page.locator('#math-reasoning');
  const workspaces = lesson.locator('.arithmetic-workspace-inupiaq-abacus');
  await expect(workspaces.first()).toBeVisible();
  await expect(workspaces.locator('.workspace-column.is-changed').first()).toBeVisible();
  await expect(workspaces.first()).toContainText('three-upper, four-lower');
  await expect(lesson.locator('.arithmetic-workspace-suanpan')).toHaveCount(0);
  const states = await workspaces.locator('svg').evaluateAll((svgs) =>
    svgs.map((svg) => ({
      radix: svg.getAttribute('data-radix'),
      label: svg.getAttribute('aria-label') ?? '',
      columns: [...svg.querySelectorAll('.workspace-column')].map((column) => ({
        digit: Number(column.getAttribute('data-digit')),
        upper: column.querySelectorAll('[data-part="upper"]').length,
        lower: column.querySelectorAll('[data-part="lower"]').length,
        activeUpper: column.querySelectorAll('[data-part="upper"].is-active').length,
        activeLower: column.querySelectorAll('[data-part="lower"].is-active').length,
      })),
    })),
  );
  expect(states.length).toBeGreaterThan(1);
  for (const state of states) {
    expect(state.radix).toBe('20');
    expect(state.label).toMatch(/Iñupiaq base-20 abacus showing/);
    expect(state.label).toMatch(/upper beads worth/);
    for (const column of state.columns) {
      expect(column.upper).toBe(3);
      expect(column.lower).toBe(4);
      expect(column.digit).toBeGreaterThanOrEqual(0);
      expect(column.digit).toBeLessThan(20);
      expect(column.activeUpper * 5 + column.activeLower).toBe(column.digit);
    }
  }
  for (const label of ['1', '20', '400'])
    await expect(
      workspaces
        .first()
        .locator('svg')
        .first()
        .locator('.workspace-place-label')
        .filter({ hasText: new RegExp(`^${label}$`) }),
    ).toHaveCount(1);
}

test('all four Kaktovik operations use the correct Iñupiaq abacus topology and working states', async ({
  page,
}) => {
  for (const fixture of kaktovikFixtures) {
    await test.step(fixture.operation, async () => {
      await page.goto(route(fixture));
      await expectWorkedOperation(page, fixture);
      await expectInupiaqAbacus(page);
    });
  }
});

const mobileFixtures: Fixture[] = [
  ...kaktovikFixtures,
  {
    system: 'suzhou',
    operation: 'add',
    first: '58',
    second: '67',
    exact: '125',
    workspace: 'suanpan',
    audit: true,
  },
  {
    system: 'suzhou',
    operation: 'subtract',
    first: '100',
    second: '1',
    exact: '99',
    workspace: 'suanpan',
  },
  {
    system: 'suzhou',
    operation: 'multiply',
    first: '13',
    second: '24',
    exact: '312',
    workspace: 'suanpan',
  },
  {
    system: 'suzhou',
    operation: 'divide',
    first: '100',
    second: '6',
    exact: '50/3',
    workspace: 'suanpan',
  },
  ...(['greek-attic', 'roman', 'khipu'] as const).flatMap((system) =>
    (Object.keys(operationNames) as Operation[]).map((operation): Fixture => ({
      system,
      operation,
      first: '6',
      second: '3',
      exact: smallAnswers[operation],
      workspace: system === 'khipu' ? 'yupana' : 'counter-board',
      audit:
        (system === 'greek-attic' && operation === 'multiply') ||
        (system === 'khipu' && operation === 'divide'),
    })),
  ),
  { system: 'maya', operation: 'multiply', first: '13', second: '24', exact: '312' },
  { system: 'mangarevan', operation: 'multiply', first: '13', second: '24', exact: '312' },
  { system: 'mangarevan', operation: 'divide', first: '312', second: '24', exact: '13' },
  {
    system: 'coptic-epact',
    operation: 'divide',
    first: '95',
    second: '12',
    exact: '95/12',
    audit: true,
  },
];

test('worked tools and native numerals remain accessible at 320 and 390 pixels', async ({
  page,
}) => {
  test.setTimeout(120_000);
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const fixture of mobileFixtures) {
      await test.step(`${width}px: ${fixture.system}/${fixture.operation}`, async () => {
        await page.goto(route(fixture));
        await expectWorkedOperation(page, fixture);
        const lesson = page.locator('#math-reasoning');
        if (fixture.workspace) {
          const workspace = lesson.locator(`.arithmetic-workspace-${fixture.workspace}`);
          await expect(workspace.first()).toBeVisible();
          await expect(workspace.locator('svg').first()).toBeVisible();
          await expect(workspace.locator('.is-paired').first()).toBeVisible();
          await expect(workspace.locator('[data-state="before"]').first()).toBeVisible();
          await expect(workspace.locator('[data-state="after"]').first()).toBeVisible();
          await expect(workspace.locator('.workspace-column.is-changed').first()).toBeVisible();
          if (fixture.workspace === 'inupiaq-abacus') await expectInupiaqAbacus(page);
        }
        if (fixture.system === 'coptic-epact') {
          await expect(lesson.locator('.math-table table')).toBeVisible();
          await expect(lesson.locator('.math-table')).toContainText('1/2');
          await expect(lesson.locator('.math-table')).toContainText('1/3');
          await expect(lesson.locator('.math-table')).toContainText('1/12');
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${fixture.system}/${fixture.operation} overflows at ${width}px`,
        ).toBe(true);
        expect(pageErrors, `${fixture.system}/${fixture.operation}: browser errors`).toEqual([]);
        if (fixture.audit) {
          const accessibility = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze();
          expect(
            accessibility.violations.map(
              (violation) => `${violation.id}: ${violation.description}`,
            ),
            `${fixture.system}/${fixture.operation} accessibility at ${width}px`,
          ).toEqual([]);
        }
      });
    }
  }
});
