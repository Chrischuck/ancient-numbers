export type CalculationWorkspace = {
  kind: 'suanpan' | 'inupiaq-abacus' | 'counter-board' | 'yupana' | 'written';
  value: string;
  previous?: string;
  caption: string;
  radix?: number;
};

type WorkspaceKind = CalculationWorkspace['kind'];
const escape = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });

const metadata: Record<WorkspaceKind, { name: string; scope: string; legend: string }> = {
  suanpan: {
    name: 'Chinese suanpan',
    scope:
      'Two upper beads and five lower beads per column. Beads touching the middle beam are active; an upper bead counts five and a lower bead counts one.',
    legend:
      'Filled beads = active · outlined beads = inactive · outline and triangle = changed place',
  },
  'inupiaq-abacus': {
    name: 'Iñupiaq base-20 abacus',
    scope:
      'A teaching diagram of the documented three-upper, four-lower bead arrangement. An upper bead counts five and a lower bead one within its column; columns are worth 1, 20, 400, and so on. Active beads touch the middle beam. Native place digits lead; the small decimal hint labels the same state total.',
    legend:
      'Filled beads = active · outlined beads = inactive · outline and triangle = changed place',
  },
  'counter-board': {
    name: 'Reconstructed counter board',
    scope:
      'Teaching reconstruction of decimal counter places: one five-counter and up to four one-counters per column. This is a simplified working layout.',
    legend:
      'Filled counters = counted · outlined positions = empty · outline and triangle = changed place',
  },
  yupana: {
    name: 'Reconstructed decimal kernel workspace',
    scope:
      'Teaching reconstruction: each column groups kernels in two rows of five. This does not assert an original yupana layout or historical cell weights.',
    legend:
      'Filled kernels = counted · outlined positions = empty · outline and triangle = changed place',
  },
  written: {
    name: 'Written calculation workspace',
    scope:
      'Decimal quantities in a modern teaching layout for written calculation or recording. Each box holds a working digit at its labeled place value.',
    legend: 'Each box holds a working digit · outline and triangle = changed place',
  },
};

function quantity(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!/^\d{1,18}$/.test(trimmed)) return undefined;
  return BigInt(trimmed).toString();
}

function formatted(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function placeLabel(exponent: number, radix: number): string {
  return exponent < 4 ? (BigInt(radix) ** BigInt(exponent)).toString() : `${radix}^${exponent}`;
}

function placeName(exponent: number, radix: number): string {
  if (exponent === 0) return 'ones';
  if (radix === 20) {
    if (exponent === 1) return 'twenties';
    if (exponent === 2) return 'four-hundreds';
    if (exponent === 3) return 'eight-thousands';
    return `20 to the power ${exponent}`;
  }
  if (exponent === 1) return 'tens';
  if (exponent === 2) return 'hundreds';
  if (exponent === 3) return 'thousands';
  return `10 to the power ${exponent}`;
}

function positionDigits(value: string, radix: number, columns = 0): number[] {
  let remaining = BigInt(value);
  const digits: number[] = [];
  const base = BigInt(radix);
  do {
    digits.unshift(Number(remaining % base));
    remaining /= base;
  } while (remaining !== 0n);
  return Array(Math.max(0, columns - digits.length))
    .fill(0)
    .concat(digits);
}

function activeClass(active: boolean): string {
  return active ? 'workspace-piece is-active' : 'workspace-piece is-inactive';
}

function suanpanColumn(x: number, y: number, digit: number): string {
  const upper = Math.floor(digit / 5);
  const lower = digit % 5;
  const upperBeads = Array.from({ length: 2 }, (_, index) => {
    const active = index === 0 && upper === 1;
    const beadY = active ? 76 : index === 0 ? 50 : 34;
    return `<ellipse class="${activeClass(active)}" data-part="upper" cx="${x}" cy="${y + beadY}" rx="14" ry="6" aria-hidden="true" />`;
  }).join('');
  const lowerBeads = Array.from({ length: 5 }, (_, index) => {
    const active = index < lower;
    const beadY = active ? 108 + index * 16 : 196 - (4 - index) * 16;
    return `<ellipse class="${activeClass(active)}" data-part="lower" cx="${x}" cy="${y + beadY}" rx="14" ry="6" aria-hidden="true" />`;
  }).join('');
  return `<path class="workspace-rod" d="M${x} ${y + 23}V${y + 204}" />${upperBeads}${lowerBeads}`;
}

// Three upper and four lower beads: Unicode L2/21-058, Figure 9 (PDF page 9).
function inupiaqAbacusColumn(x: number, y: number, digit: number): string {
  const upper = Math.floor(digit / 5);
  const lower = digit % 5;
  const upperBeads = Array.from({ length: 3 }, (_, index) => {
    const active = index < upper;
    const beadY = active ? 76 - index * 16 : 66 - index * 16;
    return `<ellipse class="${activeClass(active)}" data-part="upper" cx="${x}" cy="${y + beadY}" rx="14" ry="6" aria-hidden="true" />`;
  }).join('');
  const lowerBeads = Array.from({ length: 4 }, (_, index) => {
    const active = index < lower;
    const beadY = active ? 108 + index * 16 : 196 - (3 - index) * 16;
    return `<ellipse class="${activeClass(active)}" data-part="lower" cx="${x}" cy="${y + beadY}" rx="14" ry="6" aria-hidden="true" />`;
  }).join('');
  return `<path class="workspace-rod" d="M${x} ${y + 23}V${y + 204}" />${upperBeads}${lowerBeads}`;
}

function counterColumn(x: number, y: number, digit: number): string {
  const five = digit >= 5;
  const ones = digit % 5;
  return `<circle class="${activeClass(five)}" data-part="five-counter" cx="${x}" cy="${y + 64}" r="11" aria-hidden="true" />
    <text class="workspace-piece-value" x="${x + 17}" y="${y + 68}">5</text>
    ${Array.from({ length: 4 }, (_, index) => `<circle class="${activeClass(index < ones)}" data-part="one-counter" cx="${x}" cy="${y + 115 + index * 24}" r="8" aria-hidden="true" />`).join('')}
    <text class="workspace-piece-value" x="${x + 17}" y="${y + 119}">1</text>`;
}

function kernelColumn(x: number, y: number, digit: number): string {
  return Array.from({ length: 10 }, (_, index) => {
    const kernelX = x - 26 + (index % 5) * 13;
    const kernelY = y + 91 + Math.floor(index / 5) * 32;
    return `<ellipse class="${activeClass(index < digit)}" data-part="kernel" cx="${kernelX}" cy="${kernelY}" rx="4.8" ry="7" transform="rotate(-15 ${kernelX} ${kernelY})" aria-hidden="true" />`;
  }).join('');
}

function columnDescription(
  kind: WorkspaceKind,
  digit: number,
  exponent: number,
  radix: number,
): string {
  const place = placeName(exponent, radix);
  if (kind === 'inupiaq-abacus') {
    const unitWeight = BigInt(radix) ** BigInt(exponent);
    return `${place}: digit ${digit}, ${Math.floor(digit / 5)} active upper beads worth ${formatted((5n * unitWeight).toString())} each and ${digit % 5} active lower beads worth ${formatted(unitWeight.toString())} each`;
  }
  if (kind === 'suanpan')
    return `${place}: ${digit}, ${Math.floor(digit / 5)} active upper five-bead and ${digit % 5} active lower one-beads`;
  if (kind === 'counter-board')
    return `${place}: ${digit}, ${Math.floor(digit / 5)} five-counter and ${digit % 5} one-counters`;
  if (kind === 'yupana') return `${place}: ${digit} counted kernels`;
  return `${place}: digit ${digit}`;
}

function renderState(
  kind: WorkspaceKind,
  value: string,
  other: string | undefined,
  columns: number,
  label: string,
): string {
  const radix = kind === 'inupiaq-abacus' ? 20 : 10;
  const digits = positionDigits(value, radix, columns);
  const otherDigits = other === undefined ? undefined : positionDigits(other, radix, columns);
  const perRow = kind === 'yupana' ? 3 : 6;
  const columnWidth = kind === 'yupana' ? 84 : 56;
  const rowHeight = kind === 'written' ? 168 : kind === 'yupana' ? 208 : 278;
  const rows = Math.ceil(columns / perRow);
  const visibleColumns = Math.min(columns, perRow);
  const width = visibleColumns * columnWidth + 28;
  const height = rows * rowHeight + 10;
  const descriptions: string[] = [];
  const drawings: string[] = [];
  for (let row = 0; row < rows; row += 1) {
    const start = row * perRow;
    const count = Math.min(columns - start, perRow);
    const y = row * rowHeight;
    if (kind === 'suanpan' || kind === 'inupiaq-abacus' || kind === 'counter-board') {
      drawings.push(
        `<rect class="workspace-frame" x="14" y="${y + 20}" width="${count * columnWidth}" height="190" rx="3" />`,
      );
      drawings.push(
        `<path class="workspace-beam" d="M14 ${y + 92}H${14 + count * columnWidth}" />`,
      );
    }
    for (let local = 0; local < count; local += 1) {
      const index = start + local;
      const digit = digits[index];
      const exponent = columns - index - 1;
      const changed = otherDigits !== undefined && digits[index] !== otherDigits[index];
      const x = 14 + local * columnWidth + columnWidth / 2;
      const pieceDrawing =
        kind === 'suanpan'
          ? suanpanColumn(x, y, digit)
          : kind === 'inupiaq-abacus'
            ? inupiaqAbacusColumn(x, y, digit)
            : kind === 'counter-board'
              ? counterColumn(x, y, digit)
              : kind === 'yupana'
                ? kernelColumn(x, y, digit)
                : `<rect class="workspace-digit-box" x="${x - 21}" y="${y + 34}" width="42" height="66" rx="4" /><text class="workspace-written-digit" x="${x}" y="${y + 77}">${digit}</text>`;
      const labelY = y + rowHeight - 39;
      const digitY = y + rowHeight - 17;
      descriptions.push(
        `${columnDescription(kind, digit, exponent, radix)}${changed ? ', changed place' : ''}`,
      );
      drawings.push(`<g class="workspace-column${changed ? ' is-changed' : ''}" data-place="${exponent}" data-digit="${digit}" data-upper-active="${Math.floor(digit / 5)}" data-lower-active="${digit % 5}" data-changed="${changed}">
        <rect class="workspace-column-outline" x="${x - columnWidth / 2 + 3}" y="${y + 15}" width="${columnWidth - 6}" height="${rowHeight - 20}" rx="5" />
        ${changed ? `<path class="workspace-change-marker" d="M${x - 4} ${y + 8}h8l-4 5Z" />` : ''}
        ${pieceDrawing}
        <text class="workspace-place-label" x="${x}" y="${labelY}">${placeLabel(exponent, radix)}</text>
        ${kind === 'written' ? '' : `<text class="workspace-digit-label" x="${x}" y="${digitY}">${digit}</text>`}
      </g>`);
    }
  }
  const svgLabel = `${label}: ${metadata[kind].name} showing ${formatted(value)}. ${descriptions.join('; ')}. Larger places are on the left${rows > 1 ? '; rows continue from the highest places at the top to the lowest at the bottom' : ''}.`;
  return `<div class="arithmetic-workspace-state" data-state="${label.toLowerCase()}">
    <p class="arithmetic-workspace-state-label">${label}<strong>${kind === 'inupiaq-abacus' ? `[${positionDigits(value, 20).join(', ')}]` : formatted(value)}</strong>${kind === 'inupiaq-abacus' ? `<small>Decimal hint: ${formatted(value)}</small>` : ''}</p>
    <svg class="arithmetic-workspace-svg" role="img" aria-label="${escape(svgLabel)}" data-radix="${radix}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><g aria-hidden="true">${drawings.join('')}</g></svg>
  </div>`;
}

/** A bounded diagram of the working quantity, independent of numeral-rendering engines. */
export function renderArithmeticWorkspace(workspace: CalculationWorkspace): string {
  const caption = escape(typeof workspace.caption === 'string' ? workspace.caption : '');
  const kind = workspace.kind;
  const supportedKind = Object.prototype.hasOwnProperty.call(metadata, kind);
  const radix = kind === 'inupiaq-abacus' ? 20 : 10;
  const value = quantity(workspace.value);
  if (
    !supportedKind ||
    value === undefined ||
    (workspace.radix !== undefined && workspace.radix !== radix)
  ) {
    return `<figure class="arithmetic-workspace arithmetic-workspace-unavailable"><p>The workspace illustration supports nonnegative decimal whole numbers up to 18 digits.</p><figcaption>${caption}</figcaption></figure>`;
  }
  const suppliedPrevious = workspace.previous !== undefined;
  const previous = quantity(workspace.previous);
  const paired = previous !== undefined;
  const columns = Math.max(
    3,
    positionDigits(value, radix).length,
    previous === undefined ? 0 : positionDigits(previous, radix).length,
  );
  const before = paired ? renderState(kind, previous, value, columns, 'Before') : '';
  const after = renderState(
    kind,
    value,
    paired ? previous : undefined,
    columns,
    paired ? 'After' : 'State',
  );
  const unavailablePrevious =
    suppliedPrevious && !paired
      ? '<p class="arithmetic-workspace-note">The earlier state is outside this illustration’s whole-number range.</p>'
      : '';
  return `<figure class="arithmetic-workspace arithmetic-workspace-${kind}">
    <p class="arithmetic-workspace-title">${metadata[kind].name}</p>
    <p class="arithmetic-workspace-scope">${metadata[kind].scope}</p>
    ${unavailablePrevious}
    <div class="arithmetic-workspace-states${paired ? ' is-paired' : ''}">${before}${paired ? '<span class="arithmetic-workspace-arrow" aria-hidden="true">→</span>' : ''}${after}</div>
    <p class="arithmetic-workspace-legend">${metadata[kind].legend}</p>
    <figcaption>${caption}</figcaption>
  </figure>`;
}
