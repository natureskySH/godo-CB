import type { Chip } from '../data/types';

const OPEN_URL_PREFIX = '__ACTION_OPEN_URL__:';
const TEL_PREFIX = '__ACTION_TEL__:';
const ALLOWED_HOST = 't.aca2000.co.kr';

export type ActionKind = 'open_url' | 'tel';

export type ChipAction = { kind: 'open_url'; url: string } | { kind: 'tel'; phoneNumber: string };

export function parseChipAction(chip: Chip): ChipAction | null {
  if (chip.answer.startsWith(OPEN_URL_PREFIX)) {
    const url = chip.answer.slice(OPEN_URL_PREFIX.length).trim();
    return { kind: 'open_url', url };
  }

  if (chip.answer.startsWith(TEL_PREFIX)) {
    const phoneNumber = chip.answer.slice(TEL_PREFIX.length).trim();
    return { kind: 'tel', phoneNumber };
  }

  return null;
}

export function handleChipAction(action: ChipAction): boolean {
  if (action.kind === 'open_url') {
    if (!isAllowedUrl(action.url)) return false;
    window.open(action.url, '_blank', 'noopener,noreferrer');
    return true;
  }

  const tel = action.phoneNumber.replace(/[^\d+-]/g, '');
  if (!tel) return false;
  window.location.href = `tel:${tel}`;
  return true;
}

export function isActionChip(chip: Chip): boolean {
  return parseChipAction(chip) !== null;
}

function isAllowedUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    return url.protocol === 'https:' && url.hostname === ALLOWED_HOST;
  } catch {
    return false;
  }
}
