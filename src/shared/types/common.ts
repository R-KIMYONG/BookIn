export type Nullable<T> = T | null; // string | null , number|null 와 같음

export type Optional<T> = T | undefined; //string | undefined, number | undefined와 같음

export type ValueOf<T> = T[keyof T]; //객체의 value들을 유니온 타입으로 변환
