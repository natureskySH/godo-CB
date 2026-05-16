import { ChipsRepository } from '../data/chips-repository';
import type { Chip, ChipsFile } from '../data/types';
import { isActionChip, parseChipAction, type ChipAction } from './action-handler';

export type ChipRoute =
  | { type: 'answer'; chip: Chip }
  | { type: 'action'; chip: Chip; action: ChipAction }
  | { type: 'missing'; chipId: string };

export class ChipRouter {
  private repository = new ChipsRepository();
  private chipsFile: ChipsFile | null = null;

  get usedFallback() {
    return this.repository.usedFallback;
  }

  async load(): Promise<ChipsFile> {
    this.chipsFile = await this.repository.getChipsFile();
    return this.chipsFile;
  }

  getMainChips(): Chip[] {
    if (!this.chipsFile) return [];
    const active = new Map(
      this.chipsFile.chips.filter((chip) => chip.is_active).map((chip) => [chip.chip_id, chip]),
    );
    return this.chipsFile.main_menu.flatMap((chipId) => {
      const chip = active.get(chipId);
      return chip ? [chip] : [];
    });
  }

  getChip(chipId: string): Chip | null {
    return this.chipsFile?.chips.find((chip) => chip.chip_id === chipId && chip.is_active) ?? null;
  }

  route(chipId: string): ChipRoute {
    const chip = this.getChip(chipId);
    if (!chip) return { type: 'missing', chipId };

    const action = parseChipAction(chip);
    if (action) return { type: 'action', chip, action };

    return { type: 'answer', chip };
  }

  getFaqChips(): Chip[] {
    return this.getMainChips().filter((chip) => !isActionChip(chip));
  }
}
