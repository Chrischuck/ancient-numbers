/** Enhance the native select, keeping it as the converter's source of truth. */
export function initSystemPicker(select: HTMLSelectElement) {
  const button = document.getElementById('system-picker-button') as HTMLButtonElement;
  const value = document.getElementById('system-picker-value')!;
  const popup = document.getElementById('system-picker') as HTMLDialogElement;
  const closeButton = document.getElementById('system-picker-close') as HTMLButtonElement;
  const search = document.getElementById('system-search') as HTMLInputElement;
  const list = document.getElementById('system-options')!;
  const status = document.getElementById('system-search-status')!;
  const wrapper = select.parentElement!;
  const mobile = window.matchMedia('(max-width: 760px)');
  const viewport = window.visualViewport;
  const normalize = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const entries = Array.from(select.options, (option) => ({
    id: option.value,
    name: option.textContent!.trim(),
    region: (option.parentElement as HTMLOptGroupElement).label,
  }));
  let visible = entries;
  let activeIndex = -1;
  let scrollPosition: { x: number; y: number } | undefined;

  function updateViewport() {
    if (!scrollPosition) return;
    // iOS keyboards resize the visual viewport without resizing the page.
    popup.style.setProperty(
      '--system-picker-height',
      `${viewport?.height ?? window.innerHeight}px`,
    );
    popup.style.setProperty('--system-picker-top', `${viewport?.offsetTop ?? 0}px`);
  }

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
      // Scroll only the results, keeping the page and search field in place.
      const optionBounds = active.getBoundingClientRect();
      const listBounds = list.getBoundingClientRect();
      if (optionBounds.top < listBounds.top) list.scrollTop -= listBounds.top - optionBounds.top;
      else if (optionBounds.bottom > listBounds.bottom)
        list.scrollTop += optionBounds.bottom - listBounds.bottom;
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
      : 'No systems found. Try another name or group.';
    setActive(
      Math.max(
        0,
        visible.findIndex((entry) => entry.id === select.value),
      ),
    );
  }

  function close(restoreFocus = false) {
    if (!popup.open) return;
    popup.close();
    popup.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    search.setAttribute('aria-expanded', 'false');
    search.removeAttribute('aria-activedescendant');
    if (scrollPosition) {
      document.body.classList.remove('system-picker-open');
      document.body.style.removeProperty('--system-picker-scroll-y');
      window.scrollTo({ left: scrollPosition.x, top: scrollPosition.y, behavior: 'instant' });
      scrollPosition = undefined;
    }
    popup.style.removeProperty('--system-picker-height');
    popup.style.removeProperty('--system-picker-top');
    if (restoreFocus) button.focus({ preventScroll: true });
  }

  function open() {
    if (popup.open) return;
    search.value = '';
    popup.hidden = false;
    if (mobile.matches) {
      scrollPosition = { x: window.scrollX, y: window.scrollY };
      document.body.style.setProperty('--system-picker-scroll-y', `${-scrollPosition.y}px`);
      document.body.classList.add('system-picker-open');
      updateViewport();
      popup.showModal();
    } else popup.show();
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
    } else if (event.key === 'Tab' && popup.matches(':modal')) {
      const wrapToSearch = event.shiftKey && document.activeElement === closeButton;
      const wrapToCancel = !event.shiftKey && document.activeElement === search;
      if (wrapToSearch || wrapToCancel) {
        event.preventDefault();
        (wrapToSearch ? search : closeButton).focus({ preventScroll: true });
      }
    }
  });
  popup.addEventListener('cancel', (event) => {
    event.preventDefault();
    close(true);
  });
  closeButton.addEventListener('click', () => close(true));
  viewport?.addEventListener('resize', updateViewport);
  viewport?.addEventListener('scroll', updateViewport);
  window.addEventListener('resize', updateViewport);
  mobile.addEventListener('change', () => close(true));
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
    if (!popup.matches(':modal') && !wrapper.contains(event.relatedTarget as Node | null)) close();
  });
  select.addEventListener('change', syncSelection);
  syncSelection();
  select.hidden = true;
  button.hidden = false;
  (document.getElementById('system-label') as HTMLLabelElement).htmlFor = button.id;
}
