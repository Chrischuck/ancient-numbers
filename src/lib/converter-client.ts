import { getSystem, systems } from '../data/systems';
import { calculate, parseNumber, formatNumber } from './numbers';
import { represent } from './format';
import { renderLearningGuide } from './learning-guide';
import { loadGlyphs, escapeHTML } from './glyphs';
import { renderRepresentation, copyText, exportSVG } from './render';
import { initSystemPicker } from './system-picker';
import type { GlyphSet, Representation, Rational } from './types';
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const input = el<HTMLInputElement>('number-input');
if (input) {
  const systemSelect = el<HTMLSelectElement>('system-select');
  const second = el<HTMLInputElement>('second-input'),
    operation = el<HTMLSelectElement>('operation');
  const params = new URLSearchParams(location.search);
  let mode = params.get('mode') === 'calculate' ? 'calculate' : 'translate';
  let serial = 0,
    timer: ReturnType<typeof setTimeout>,
    announcementTimer: ReturnType<typeof setTimeout>;
  let lastResult: Representation | undefined,
    lastGlyphs: GlyphSet = {},
    lastExact = '42';
  let comparisonIds: string[] = [];
  let guideSystemId = 'babylonian';
  if (getSystem(params.get('system') ?? '')) systemSelect.value = params.get('system')!;
  initSystemPicker(systemSelect);
  if (params.get('number')) input.value = params.get('number')!.slice(0, 205);
  if (params.get('second')) second.value = params.get('second')!.slice(0, 205);
  if (['add', 'subtract', 'multiply', 'divide'].includes(params.get('operation') ?? ''))
    operation.value = params.get('operation')!;
  comparisonIds = (params.get('compare') ?? '')
    .split(',')
    .filter((id) => getSystem(id))
    .slice(0, 2);
  function applyMode() {
    document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((b) => {
      const active = b.dataset.mode === mode;
      b.setAttribute('aria-selected', String(active));
      b.tabIndex = active ? 0 : -1;
    });
    el('arithmetic-fields').hidden = mode !== 'calculate';
    el('input-panel').setAttribute('aria-labelledby', `${mode}-tab`);
    el('conversion-guide-title').textContent =
      mode === 'calculate' ? 'How the calculation works' : 'How to read this number';
    const reference = el<HTMLDetailsElement>('notation-reference');
    reference.open = mode === 'translate';
    reference.classList.toggle('calculation-reference', mode === 'calculate');
  }
  function stateURL() {
    const u = new URL(location.href);
    u.search = '';
    u.searchParams.set('system', systemSelect.value);
    u.searchParams.set('number', input.value);
    if (mode === 'calculate') {
      u.searchParams.set('mode', mode);
      u.searchParams.set('second', second.value);
      u.searchParams.set('operation', operation.value);
    }
    if (comparisonIds.length) u.searchParams.set('compare', comparisonIds.join(','));
    return u;
  }
  function resetOutput(message: string) {
    lastResult = undefined;
    el('output-value').innerHTML = '';
    el('output-message').textContent = message;
    el('output-message').hidden = false;
    el('exact-value').textContent = '—';
    el('output-equation').textContent = '';
    el('conversion-guide').hidden = true;
    el<HTMLButtonElement>('copy-button').disabled = true;
    el<HTMLButtonElement>('download-button').disabled = true;
    el('comparisons').innerHTML = '';
  }
  async function update() {
    const current = ++serial;
    const system = getSystem(systemSelect.value)!;
    lastResult = undefined;
    el<HTMLButtonElement>('copy-button').disabled = true;
    el<HTMLButtonElement>('download-button').disabled = true;
    el('output-name').textContent = system.name.toLocaleUpperCase();
    el('output-base').textContent = system.baseLabel;
    el('system-summary').textContent = system.summary;
    el('system-location').replaceChildren(
      document.createTextNode(system.location),
      document.createElement('br'),
      document.createTextNode(system.period),
    );
    el<HTMLAnchorElement>('learn-link').href = `${import.meta.env.BASE_URL}systems/${system.id}/`;
    el('reading-explanation').textContent = system.howItWorks;
    el('reading-steps').replaceChildren(
      ...system.readingSteps.map((step) => {
        const item = document.createElement('li');
        item.textContent = step;
        return item;
      }),
    );
    el('system-caveat').textContent = system.caveat;
    el<HTMLAnchorElement>('system-source').href = system.sources[0].url;
    el('availability').textContent =
      system.engine === 'explainer'
        ? 'Documented specimens only'
        : system.max.length <= 12
          ? `Whole numbers · ${Number(system.min).toLocaleString('en-US')}–${Number(system.max).toLocaleString('en-US')}`
          : 'Whole numbers';
    el('example-chips').innerHTML = system.examples
      .map(
        (e) =>
          `<button type="button" data-example="${escapeHTML(e.value)}">${escapeHTML(e.value)}</button>`,
      )
      .join('');
    if (guideSystemId !== system.id) {
      el('learning-guide').hidden = true;
      try {
        const guideGlyphs = await loadGlyphs(system.region);
        if (current !== serial) return;
        el('learning-guide').innerHTML = renderLearningGuide(system, guideGlyphs);
        guideSystemId = system.id;
        el('learning-guide').hidden = false;
      } catch {
        if (current !== serial) return;
        resetOutput(
          'The artwork could not load. Check your connection and choose the system again.',
        );
        return;
      }
    } else el('learning-guide').hidden = false;
    let value: Rational;
    let firstValue: Rational;
    let secondValue: Rational | undefined;
    try {
      firstValue = parseNumber(input.value);
      value = firstValue;
      if (mode === 'calculate') {
        secondValue = parseNumber(second.value);
        value = calculate(value, secondValue, operation.value);
      }
      el('input-error').hidden = true;
      input.removeAttribute('aria-invalid');
      second.removeAttribute('aria-invalid');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Check your number.';
      el('input-error').textContent = message;
      el('input-error').hidden = false;
      input.setAttribute('aria-invalid', 'true');
      resetOutput(message);
      el('result-announcement').textContent = message;
      return;
    }
    const result = represent(value, system);
    lastExact = formatNumber(value);
    el('exact-value').textContent = lastExact;
    el('output-equation').textContent = result.explanation || 'Exact value';
    el('output-message').textContent = result.reason ?? '';
    el('output-message').hidden = !result.reason;
    if (!result.tokens.length) {
      el('output-value').innerHTML = '';
      el('output-value').hidden = true;
    } else el('output-value').hidden = false;
    document.querySelector('.output-panel')?.setAttribute('aria-busy', 'true');
    try {
      const [glyphs, { renderMathReasoning }] = await Promise.all([
        loadGlyphs(system.region),
        import('./math-methods'),
      ]);
      if (current !== serial) return;
      const symbol =
        { add: '+', subtract: '−', multiply: '×', divide: '÷' }[operation.value as 'add'] ?? '+';
      el('conversion-guide').hidden = false;
      el('math-reasoning').innerHTML = renderMathReasoning(
        system,
        value,
        mode === 'calculate'
          ? { first: firstValue, second: secondValue!, operation: operation.value }
          : undefined,
        glyphs,
      );
      const equation = el('translated-equation');
      equation.hidden = mode !== 'calculate';
      if (mode === 'calculate') {
        const operand = (v: Rational) => {
          const r = represent(v, system);
          return `<div class="equation-term">${r.tokens.length ? renderRepresentation(r, glyphs) : '<span>Not available in this notation</span>'}<small>${escapeHTML(formatNumber(v))}</small></div>`;
        };
        equation.innerHTML = `<summary>See the equation in ${escapeHTML(system.name)}</summary><div class="equation-numerals">${operand(firstValue)}<span class="equation-operator">${symbol}</span>${operand(secondValue!)}<span class="equation-operator">=</span>${operand(value)}</div><p>The numerals use the selected notation; +, −, ×, ÷ and = are modern operators. The worked method is explained above.</p>`;
      }
      lastGlyphs = glyphs;
      lastResult = result;
      el('output-value').innerHTML = renderRepresentation(result, glyphs);
      const canCopy = !!copyText(result, glyphs, system);
      el('copy-button').lastChild!.textContent =
        result.layout === 'words' ? ' Copy words' : ' Copy numeral';
      el<HTMLButtonElement>('copy-button').disabled = !canCopy;
      el('copy-button').title = canCopy
        ? 'Copy this representation'
        : 'This representation has no complete Unicode text equivalent.';
      el<HTMLButtonElement>('download-button').disabled = !exportSVG(
        result,
        glyphs,
        `${system.name}: ${lastExact}`,
      );
      el('download-button').title =
        result.layout === 'words'
          ? 'Word specimens are available through Copy words.'
          : 'Download the vector drawing.';
      await renderComparisons(value, current);
      clearTimeout(announcementTimer);
      announcementTimer = setTimeout(() => {
        el('result-announcement').textContent =
          `${system.name}. Exact value ${lastExact}. ${result.reason ?? result.explanation}`;
      }, 400);
      history.replaceState(null, '', stateURL());
    } catch {
      resetOutput('The artwork could not load. Check your connection and choose the system again.');
    } finally {
      if (current === serial)
        document.querySelector('.output-panel')?.setAttribute('aria-busy', 'false');
    }
  }
  async function renderComparisons(value: Rational, current: number) {
    const cards = await Promise.all(
      comparisonIds.map(async (id, i) => {
        const s = getSystem(id)!;
        const r = represent(value, s);
        const set = await loadGlyphs(s.region);
        return `<section class="comparison-card"><div class="comparison-heading"><label class="sr-only" for="comparison-${i}">Comparison system ${i + 1}</label><select id="comparison-${i}" data-comparison="${i}">${systems.map((s) => `<option value="${s.id}"${s.id === id ? ' selected' : ''}>${escapeHTML(s.name)}</option>`).join('')}</select><button type="button" data-remove="${i}" aria-label="Remove comparison ${i + 1}">×</button></div>${r.tokens.length ? renderRepresentation(r, set) : `<p class="comparison-message">${escapeHTML(r.reason ?? 'See the verified examples.')}</p>`}<p class="comparison-caption">${escapeHTML(s.baseLabel)}</p></section>`;
      }),
    );
    if (current !== serial) return;
    el('comparisons').innerHTML = cards.join('');
    el<HTMLButtonElement>('add-comparison').disabled = comparisonIds.length >= 2;
    el('add-comparison').textContent =
      comparisonIds.length >= 2 ? '3 systems compared' : 'Add comparison +';
  }
  function queue() {
    clearTimeout(timer);
    timer = setTimeout(update, 60);
  }
  document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((b) => {
    b.addEventListener('click', () => {
      mode = b.dataset.mode!;
      applyMode();
      void update();
    });
    b.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        mode =
          e.key === 'Home'
            ? 'translate'
            : e.key === 'End'
              ? 'calculate'
              : mode === 'translate'
                ? 'calculate'
                : 'translate';
        applyMode();
        el<HTMLButtonElement>(`${mode}-tab`).focus();
        void update();
      }
    });
  });
  [input, second].forEach((x) => x.addEventListener('input', queue));
  systemSelect.addEventListener('change', () => void update());
  operation.addEventListener('change', () => void update());
  el('example-chips').addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[data-example]');
    if (b) {
      mode = 'translate';
      applyMode();
      input.value = b.dataset.example!;
      void update();
    }
  });
  el('add-comparison').addEventListener('click', () => {
    if (comparisonIds.length >= 2) return;
    const candidate = ['maya', 'cistercian', 'medefaidrin'].find(
      (id) => id !== systemSelect.value && !comparisonIds.includes(id),
    )!;
    comparisonIds.push(candidate);
    void update();
  });
  el('comparisons').addEventListener('change', (e) => {
    const s = e.target as HTMLSelectElement;
    if (s.dataset.comparison !== undefined) {
      comparisonIds[Number(s.dataset.comparison)] = s.value;
      void update();
    }
  });
  el('comparisons').addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[data-remove]');
    if (b) {
      comparisonIds.splice(Number(b.dataset.remove), 1);
      void update();
      el('add-comparison').focus();
    }
  });
  async function clipboard(text: string) {
    await navigator.clipboard.writeText(text);
  }
  function status(message: string) {
    el('action-status').textContent = message;
    setTimeout(() => {
      el('action-status').textContent = '';
    }, 3500);
  }
  el('copy-button').addEventListener('click', async () => {
    if (!lastResult) return;
    const text = copyText(lastResult, lastGlyphs, getSystem(systemSelect.value)!);
    if (text)
      try {
        await clipboard(text);
        status(lastResult.layout === 'words' ? 'Words copied.' : 'Numeral copied.');
      } catch {
        status('Copy is unavailable in this browser.');
      }
  });
  el('download-button').addEventListener('click', () => {
    if (!lastResult) return;
    const svg = exportSVG(
      lastResult,
      lastGlyphs,
      `${getSystem(systemSelect.value)!.name}: ${lastExact}`,
    );
    if (!svg) return;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `ancient-numbers-${systemSelect.value}-${lastExact.replace(/[^\w-]/g, '_').slice(0, 40)}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status('SVG saved.');
  });
  el('share-button').addEventListener('click', async () => {
    try {
      await clipboard(stateURL().href);
      status('Link copied.');
    } catch {
      status('Copy the current address to share.');
    }
  });
  applyMode();
  void update();
}
