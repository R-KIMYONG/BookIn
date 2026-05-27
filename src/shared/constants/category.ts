export const TARGET_LIST = ['Book', 'Foreign', 'eBook'] as const;
export type TargetTypes = (typeof TARGET_LIST)[number];
export const ALLOWED_TARGETS: TargetTypes[] = ['Book', 'Foreign', 'eBook'] as const;
export const DEFAULT_TARGET: TargetTypes = 'Book';
