export const TARGET_LIST = ['Book', 'Foreign', 'eBook'] as const;
export type TargetTypes = (typeof TARGET_LIST)[number];
