import { CHIPS_URL } from '../config';
import { FALLBACK_CHIPS_FILE } from './fallback-chips';
import type { Chip, ChipsFile } from './types';

export class ChipsRepository {
  private cache: ChipsFile | null = null;
  private fetchPromise: Promise<ChipsFile> | null = null;
  private fallback = false;

  get usedFallback() {
    return this.fallback;
  }

  async getChipsFile(): Promise<ChipsFile> {
    if (this.cache) return this.cache;
    if (this.fetchPromise) return this.fetchPromise;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 4000);

    this.fetchPromise = fetch(CHIPS_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then((data) => {
        const parsed = assertChipsFile(data);
        this.cache = parsed;
        this.fallback = false;
        return parsed;
      })
      .catch(() => {
        this.cache = FALLBACK_CHIPS_FILE;
        this.fallback = true;
        return FALLBACK_CHIPS_FILE;
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
      });

    return this.fetchPromise;
  }
}

function assertChipsFile(data: unknown): ChipsFile {
  if (!isRecord(data) || data.version !== 1 || !Array.isArray(data.chips)) {
    throw new Error('Invalid chips file');
  }

  if (!Array.isArray(data.main_menu) || !data.main_menu.every((id) => typeof id === 'string')) {
    throw new Error('Invalid main_menu');
  }

  const chips = data.chips.map(assertChip);
  return { version: 1, main_menu: data.main_menu, chips };
}

function assertChip(value: unknown): Chip {
  if (!isRecord(value)) throw new Error('Invalid chip');

  const chip = value as Partial<Chip>;
  if (
    typeof chip.chip_id !== 'string' ||
    typeof chip.label !== 'string' ||
    typeof chip.answer !== 'string' ||
    typeof chip.order !== 'number' ||
    typeof chip.is_active !== 'boolean'
  ) {
    throw new Error('Invalid chip fields');
  }

  return {
    chip_id: chip.chip_id,
    label: chip.label,
    answer: chip.answer,
    order: chip.order,
    is_active: chip.is_active,
    next_chips: Array.isArray(chip.next_chips) ? chip.next_chips : undefined,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
