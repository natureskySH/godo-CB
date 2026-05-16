export type Chip = {
  chip_id: string;
  label: string;
  answer: string;
  order: number;
  is_active: boolean;
  next_chips?: string[];
};

export type ChipsFile = {
  version: 1;
  chips: Chip[];
  main_menu: string[];
};
