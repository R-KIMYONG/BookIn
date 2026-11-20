import dayjs, { KST } from './dayjs';

export const formatDate = (date: string | Date) => {
  return dayjs(date).tz(KST).format('YYYY.MM.DD');
};
