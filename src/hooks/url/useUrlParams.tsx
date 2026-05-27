'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type SetOptions = {
  scroll?: boolean;
  replace?: boolean;
};
const useUrlParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParams = (key: string) => searchParams.get(key);
  const getOrDefault = (key: string, fallback: string) => searchParams.get(key) ?? fallback;

  const getInt = (key: string, fallback = 1) => {
    const num = Number(searchParams.get(key));
    return Number.isFinite(num) && num >= 1 ? num : fallback;
  };

  const getAllParams = () => {
    const obj: Record<string, string | null> = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  };

  const setParams = (
    next: Record<string, string | number | null | undefined>,
    options: SetOptions = { scroll: false, replace: false }
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextArray = Object.entries(next); // [ [page,2],[target,'Book'],[target,'ebook'] ]이런형태로 변경

    for (const [key, value] of nextArray) {
      // [key,value]는 nextArray중의 각요소를 뜻함 [page,2]  / [target,'Book']이렇게해서 아래 if문에 진입
      if (value === null || value === undefined || value === '') params.delete(key);
      else params.set(key, String(value));
      //최종목적은 URL에 없으면 지우고 있으면 설정하는거임
    }

    const url = `${pathname}?${params.toString()}`; //현재pathname을 기초로 새로운URL을 만든다 즉 반복문으로 set하거나 delte한 최신버전의 url로 업데이트
    const nav = options.replace ? router.replace : router.push;
    nav(url, { scroll: options.scroll ?? false });
  };

  return { getParams, getOrDefault, getInt, setParams, getAllParams };
};

export default useUrlParams;
