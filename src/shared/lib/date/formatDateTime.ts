import dayjs from './dayjs';

export const formatDateTime = (date: string | Date) => {
  return dayjs(date).format('YYYY.MM.DD HH:mm');
};
