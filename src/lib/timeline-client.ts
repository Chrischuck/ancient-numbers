const formatYear = (year: number) =>
  year < 0 ? `${Math.abs(year).toLocaleString('en-US')} BCE` : `${year.toLocaleString('en-US')} CE`;

const app = document.getElementById('timeline-app');
if (app) {
  const search = app.querySelector<HTMLInputElement>('#timeline-search')!;
  const kind = app.querySelector<HTMLSelectElement>('#timeline-kind')!;
  const status = app.querySelector<HTMLSelectElement>('#timeline-status')!;
  const from = app.querySelector<HTMLInputElement>('#timeline-from')!;
  const to = app.querySelector<HTMLInputElement>('#timeline-to')!;
  const list = app.querySelector<HTMLElement>('#timeline-list')!;
  const count = app.querySelector<HTMLElement>('#timeline-count')!;
  const error = app.querySelector<HTMLElement>('#timeline-date-error')!;
  const eventsButton = app.querySelector<HTMLButtonElement>('#events-view')!;
  const periodsButton = app.querySelector<HTMLButtonElement>('#periods-view')!;
  const entries = [...app.querySelectorAll<HTMLElement>('[data-entry]')];
  const eraButtons = [...app.querySelectorAll<HTMLButtonElement>('[data-era]')];
  const windowButtons = [...app.querySelectorAll<HTMLButtonElement>('[data-window]')];
  let start = -3000;
  let end = 2026;
  let periods = false;
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();
  const text = new Map(entries.map((entry) => [entry, normalize(entry.dataset.search ?? '')]));

  function persist() {
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries({
      q: search.value.trim(),
      type: kind.value === 'all' ? '' : kind.value,
      use: status.value === 'all' ? '' : status.value,
      from: start === -3000 ? '' : String(start),
      to: end === 2026 ? '' : String(end),
      view: periods ? 'periods' : '',
    })) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, '', url);
  }

  function render(save = true) {
    const query = normalize(search.value.trim());
    let visible = 0;
    for (const entry of entries) {
      const year = Number(entry.dataset.year);
      const periodEnd = entry.dataset.end
        ? Number(entry.dataset.end)
        : entry.dataset.status === 'living'
          ? 2026
          : year;
      const inRange = periods ? year <= end && periodEnd >= start : year >= start && year <= end;
      const show =
        inRange &&
        (!query || text.get(entry)!.includes(query)) &&
        (kind.value === 'all' || kind.value === entry.dataset.kind) &&
        (status.value === 'all' || status.value === entry.dataset.status) &&
        (!periods || entry.dataset.kind !== 'milestone');
      entry.hidden = !show;
      if (show) visible++;
    }
    const era = eraButtons.find(
      (button) => Number(button.dataset.start) === start && Number(button.dataset.end) === end,
    );
    eraButtons.forEach((button) => button.setAttribute('aria-pressed', String(button === era)));
    windowButtons.forEach((button) =>
      button.setAttribute(
        'aria-pressed',
        String(Number(button.dataset.start) === start && Number(button.dataset.end) === end),
      ),
    );
    count.textContent =
      `${visible} ${periods ? (visible === 1 ? 'period' : 'periods') : visible === 1 ? 'entry' : 'entries'}` +
      ` · ${era?.dataset.era === 'all' ? 'all history' : `${formatYear(start)}–${formatYear(end)}`}`;
    app!.querySelector<HTMLElement>('#timeline-empty')!.hidden = visible > 0;
    list.classList.toggle('periods', periods);
    app!.querySelector<HTMLElement>('#period-explainer')!.hidden = !periods;
    eventsButton.setAttribute('aria-pressed', String(!periods));
    periodsButton.setAttribute('aria-pressed', String(periods));
    kind.querySelector<HTMLOptionElement>('option[value="milestone"]')!.disabled = periods;
    if (save) persist();
  }

  function setDates(first: number, last: number) {
    start = first;
    end = last;
    from.value = String(first);
    to.value = String(last);
    error.hidden = true;
    render();
  }

  function reset() {
    search.value = '';
    kind.value = 'all';
    status.value = 'all';
    periods = false;
    setDates(-3000, 2026);
  }

  search.addEventListener('input', () => render());
  kind.addEventListener('change', () => render());
  status.addEventListener('change', () => render());
  for (const button of [...eraButtons, ...windowButtons])
    button.addEventListener('click', () =>
      setDates(Number(button.dataset.start), Number(button.dataset.end)),
    );
  eventsButton.addEventListener('click', () => {
    periods = false;
    render();
  });
  periodsButton.addEventListener('click', () => {
    periods = true;
    if (kind.value === 'milestone') kind.value = 'all';
    render();
  });
  app.querySelector('#timeline-reset')!.addEventListener('click', reset);
  app.querySelector('#timeline-empty-reset')!.addEventListener('click', reset);
  app.querySelector('#timeline-dates')!.addEventListener('submit', (event) => {
    event.preventDefault();
    const first = from.valueAsNumber;
    const last = to.valueAsNumber;
    if (
      ![first, last].every(
        (year) => Number.isInteger(year) && year !== 0 && year >= -3000 && year <= 2026,
      ) ||
      first > last
    ) {
      error.textContent =
        'Enter whole years from −3000 to 2026, with the starting year first. There is no year zero; use −1 for 1 BCE or 1 for 1 CE.';
      error.hidden = false;
      return;
    }
    setDates(first, last);
  });

  function revealHash(scroll: boolean) {
    const entry = entries.find((item) => `#${item.id}` === window.location.hash);
    if (!entry) return;
    if (entry.hidden) reset();
    entry.querySelector<HTMLDetailsElement>('details')!.open = true;
    if (scroll) entry.scrollIntoView({ block: 'start' });
  }
  window.addEventListener('hashchange', () => revealHash(true));
  app.querySelectorAll<HTMLAnchorElement>('[data-permalink]').forEach((link) =>
    link.addEventListener('click', () => {
      link.closest('details')!.open = true;
    }),
  );

  const params = new URLSearchParams(window.location.search);
  search.value = params.get('q') ?? '';
  if (['numerals', 'notation', 'milestone'].includes(params.get('type') ?? ''))
    kind.value = params.get('type')!;
  if (['living', 'historical'].includes(params.get('use') ?? '')) status.value = params.get('use')!;
  periods = params.get('view') === 'periods';
  if (periods && kind.value === 'milestone') kind.value = 'all';
  const first = params.has('from') ? Number(params.get('from')) : -3000;
  const last = params.has('to') ? Number(params.get('to')) : 2026;
  if (
    [first, last].every(
      (year) => Number.isInteger(year) && year !== 0 && year >= -3000 && year <= 2026,
    ) &&
    first <= last
  ) {
    start = first;
    end = last;
  }
  from.value = String(start);
  to.value = String(end);
  app.querySelectorAll<HTMLElement>('[data-interactive]').forEach((control) => {
    control.hidden = false;
  });
  render(false);
  revealHash(true);
}
