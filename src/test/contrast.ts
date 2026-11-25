import colors from 'tailwindcss/colors';

type ColorGroup = Record<string, string>;
type Palette = Record<string, string | ColorGroup>;

const palette = colors as unknown as Palette;

const CUSTOM_COLORS: Record<string, string> = {
  background: '#F8FAFC',
  'slate-850': '#15202B',
};

export interface LowContrastText {
  text: string;
  foreground: string;
  background: string;
  ratio: number;
  className: string;
}

/** Relative luminance of an sRGB hex color (WCAG 2.1). */
function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((offset) => {
    const channel = Number.parseInt(value.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

/** WCAG contrast ratio between two sRGB hex colors. */
export function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function tokenToColor(token: string): string | undefined {
  const normalized = token.replace(/^\[|\]$/g, '');
  if (/^#[0-9a-f]{3,8}$/i.test(normalized)) return normalized;
  if (normalized === 'white') return '#ffffff';
  if (normalized === 'black') return '#000000';

  const custom = CUSTOM_COLORS[normalized];
  if (custom) return custom;

  const separator = normalized.lastIndexOf('-');
  if (separator === -1) return undefined;
  const family = normalized.slice(0, separator);
  const shade = normalized.slice(separator + 1);
  const entry = palette[family];
  if (typeof entry === 'string' && shade === 'DEFAULT') return entry;
  if (entry && typeof entry === 'object') return entry[shade];
  return undefined;
}

/** Resolve the first solid Tailwind color for the given class prefixes. */
function colorFromClasses(element: HTMLElement, prefixes: string[]): string | undefined {
  const classValue = typeof element.className === 'string' ? element.className : '';
  for (const name of classValue.split(/\s+/)) {
    if (name.includes(':')) continue;
    for (const prefix of prefixes) {
      if (!name.startsWith(`${prefix}-`)) continue;
      const token = name.slice(prefix.length + 1);
      if (token.includes('/')) continue;
      const color = tokenToColor(token);
      if (color) return color;
    }
  }
  return undefined;
}

function nearestColor(element: HTMLElement, prefixes: string[]): string | undefined {
  let current: HTMLElement | null = element;
  while (current) {
    const color = colorFromClasses(current, prefixes);
    if (color) return color;
    current = current.parentElement;
  }
  return undefined;
}

function hasDirectText(element: HTMLElement): boolean {
  return Array.from(element.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim())
  );
}

/** Find rendered text whose nearest solid foreground/background pair is below 4.5:1. */
export function findLowContrastText(root: HTMLElement): LowContrastText[] {
  const violations: LowContrastText[] = [];
  const elements = Array.from(root.querySelectorAll<HTMLElement>('*'));

  for (const element of elements) {
    if (!hasDirectText(element)) continue;
    if (element.closest('[aria-hidden="true"], button[disabled], input[disabled]')) continue;
    if (['SCRIPT', 'STYLE', 'TITLE'].includes(element.tagName)) continue;

    const foreground = nearestColor(element, ['text']) ?? '#0F172A';
    const background = nearestColor(element, ['bg', 'from', 'via', 'to']) ?? '#F8FAFC';
    const ratio = contrastRatio(foreground, background);
    if (ratio < 4.5) {
      violations.push({
        text: element.textContent?.trim().slice(0, 60) ?? '',
        foreground,
        background,
        ratio: Number(ratio.toFixed(2)),
        className: typeof element.className === 'string' ? element.className : '',
      });
    }
  }

  return violations;
}
