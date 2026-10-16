/** Enhance the native select, keeping it as the converter's source of truth. */
export function initSystemPicker(select: HTMLSelectElement) {
  const button = document.getElementById('system-picker-button') as HTMLButtonElement;
  const value = document.getElementById('system-picker-value')!;
  const popup = document.getElementById('system-picker')!;
  const search = document.getElementById('system-search') as HTMLInputElement;
  const list = document.getElementById('system-options')!;
  const status = document.getElementById('system-search-status')!;
  const wrapper = select.parentElement!;
  const normalize = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const entries = Array.from(select.options, (option) => ({
    id: option.value,
    name: option.textContent!.trim(),
    region: (option.parentElement as HTMLOptGroupElement).label,
  }));
  let visible = entries;
  let activeIndex = -1;

  function syncSelection() {
    value.textContent = entries.find((entry) => entry.id === select.value)!.name;
  }

  function setActive(index: number) {
    activeIndex = index;
    const options = list.querySelectorAll<HTMLElement>('[role="option"]');
    options.forEach((option, i) => option.classList.toggle('is-active', i === index));
    const active = options[index];
    if (active) {
      search.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    } else search.removeAttribute('aria-activedescendant');
  }

  function render() {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    visible = entries.filter((entry) => {
      const text = normalize(`${entry.name} ${entry.region} ${entry.id}`);
      return terms.every((term) => text.includes(term));
    });
    search.removeAttribute('aria-activedescendant');
    list.replaceChildren();
    let currentRegion = '';
    let group: HTMLElement;
    visible.forEach((entry) => {
      if (entry.region !== currentRegion) {
        currentRegion = entry.region;
        group = document.createElement('div');
        group.setAttribute('role', 'group');
        group.setAttribute('aria-label', entry.region);
        const heading = document.createElement('div');
        heading.className = 'system-option-region';
        heading.textContent = entry.region;
        heading.setAttribute('aria-hidden', 'true');
        group.append(heading);
        list.append(group);
      }
      const option = document.createElement('div');
      option.id = `system-option-${entry.id}`;
      option.dataset.system = entry.id;
      option.className = 'system-option';
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', String(entry.id === select.value));
      option.textContent = entry.name;
      group.append(option);
    });
    status.textContent = visible.length
      ? `${visible.length} ${visible.length === 1 ? 'system' : 'systems'} found`
      : 'No systems found. Try another name or region.';
    setActive(
      Math.max(
        0,
        visible.findIndex((entry) => entry.id === select.value),
      ),
    );
  }

  function close(restoreFocus = false) {
    popup.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    search.setAttribute('aria-expanded', 'false');
    search.removeAttribute('aria-activedescendant');
    if (restoreFocus) button.focus();
  }

  function open() {
    search.value = '';
    popup.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    search.setAttribute('aria-expanded', 'true');
    search.focus({ preventScroll: true });
    render();
  }

  function choose(id: string) {
    select.value = id;
    syncSelection();
    close(true);
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  button.addEventListener('click', () => (popup.hidden ? open() : close()));
  button.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
    }
  });
  search.addEventListener('input', render);
  search.addEventListener('keydown', (event) => {
    if (event.isComposing) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (visible.length) {
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        setActive((activeIndex + direction + visible.length) % visible.length);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (visible[activeIndex]) choose(visible[activeIndex].id);
    }
  });
  popup.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    }
  });
  // Keep focus in the combobox while clicking an option.
  list.addEventListener('mousedown', (event) => event.preventDefault());
  list.addEventListener('click', (event) => {
    const option = (event.target as Element).closest<HTMLElement>('[data-system]');
    if (option) choose(option.dataset.system!);
  });
  document.addEventListener('pointerdown', (event) => {
    if (!wrapper.contains(event.target as Node)) close();
  });
  wrapper.addEventListener('focusout', (event) => {
    if (!wrapper.contains(event.relatedTarget as Node | null)) close();
  });
  select.addEventListener('change', syncSelection);
  syncSelection();
  select.hidden = true;
  button.hidden = false;
  (document.getElementById('system-label') as HTMLLabelElement).htmlFor = button.id;
}
