import dayjs from './dayjs';

export const formatRelativeTime = (date: string | Date) => {
  return dayjs(date).fromNow();
};
