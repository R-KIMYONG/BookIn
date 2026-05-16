import { ResultCode } from './resultCode';

export type ActionResult<T = void> =
  | {
      ok: true;
      code: ResultCode;
      data: T;
    }
  | {
      ok: false;
      code: ResultCode;
      data?: Partial<T>;
    };
