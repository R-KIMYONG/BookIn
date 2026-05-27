import dayjs from './dayjs';

export const isNew = (createdAt: string, hours = 24) => {
  return dayjs().diff(dayjs(createdAt), 'hour') < hours;
};
