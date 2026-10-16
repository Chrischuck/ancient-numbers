import { BASE_OPTIONS, convertBase, numeralBase, renderBaseLesson } from './bases';

const form = document.querySelector<HTMLFormElement>('#base-converter-form');
if (form) {
  const input = document.querySelector<HTMLInputElement>('#base-number')!;
  const source = document.querySelector<HTMLSelectElement>('#base-source')!;
  const target = document.querySelector<HTMLSelectElement>('#base-target')!;
  const help = document.querySelector<HTMLElement>('#base-input-help')!;
  const error = document.querySelector<HTMLElement>('#base-input-error')!;
  const output = document.querySelector<HTMLElement>('#base-lesson')!;
  const announcement = document.querySelector<HTMLElement>('#base-announcement')!;

  function updateHelp() {
    const option = BASE_OPTIONS.find((option) => option.value === Number(source.value))!;
    help.textContent = `Use ${option.digits}. Example: ${option.example}. Up to 16 place digits; nonnegative whole numbers only.`;
    input.placeholder = option.example;
    // Hexadecimal needs a text keyboard; comma-separated places need access to punctuation.
    input.inputMode = option.value <= 10 ? 'numeric' : 'text';
  }

  function convert() {
    updateHelp();
    try {
      const lesson = convertBase(input.value, numeralBase(source.value), numeralBase(target.value));
      error.hidden = true;
      error.textContent = '';
      input.removeAttribute('aria-invalid');
      output.innerHTML = renderBaseLesson(lesson);
      output.hidden = false;
      announcement.textContent = `${lesson.source} in base ${lesson.sourceBase} equals ${lesson.output} in base ${lesson.targetBase}. Decimal value ${lesson.decimal}.`;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Check your number and base.';
      error.textContent = message;
      error.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      output.hidden = true;
      announcement.textContent = message;
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    convert();
  });
  source.addEventListener('change', convert);
  target.addEventListener('change', convert);
  input.addEventListener('input', () => {
    error.hidden = true;
    input.removeAttribute('aria-invalid');
    output.hidden = true;
    announcement.textContent = '';
  });
  document.querySelectorAll<HTMLButtonElement>('[data-base-example]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => {
      input.value = button.dataset.baseExample!;
      source.value = button.dataset.source!;
      target.value = button.dataset.target!;
      convert();
    });
  });
  document.querySelectorAll<HTMLElement>('[data-base-interactive]').forEach((element) => {
    element.hidden = false;
  });
  updateHelp();
}
