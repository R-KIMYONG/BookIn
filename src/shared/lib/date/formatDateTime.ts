import dayjs, { KST } from './dayjs';

export const formatDateTime = (date: string | Date) => {
  return dayjs(date).tz(KST).format('YYYY.MM.DD HH:mm');
};
