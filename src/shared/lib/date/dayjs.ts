import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('ko');

export const KST = 'Asia/Seoul';

export default dayjs;
