'use client';
import Comment from '@/components/comment/Comment';
import { Book } from '@/types/book.type';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

const fetchAladinDetailPage = async (isbn13: string): Promise<Book> => {
  const response = await fetch(`/api/AladinApi/${isbn13}`);
  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const msg = json?.message ?? json?.error ?? 'Network response was not ok';
    throw new Error(msg);
  }

  return json as Book;
};
const MainDetail = ({ params }: { params: { id: string } }) => {
  const { id: paramsId } = params;
  const { data, error, isPending } = useQuery<Book>({
    queryKey: ['aladinDetailPage', paramsId],
    queryFn: () => fetchAladinDetailPage(paramsId),
    staleTime: 300000,
  });
  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
        Loading...
      </div>
    );
  if (error)
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;
  const items = data?.item?.[0];

  if (!items) {
    return <div className="flex justify-center items-center h-screen text-gray-600">책 정보를 찾을 수 없습니다.</div>;
  }
  const standard = Number(items.priceStandard ?? 0);
  const sales = Number(items.priceSales ?? 0);
  const hasSale = standard > 0 && sales > 0 && sales < standard;

  const discountRate = hasSale ? Math.round(((standard - sales) / standard) * 100) : 0;

  return (
    <>
      <div className="w-[1280px] container mx-auto">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg p-8">
          {/* 좌측 책 표지 이미지 */}
          <div className="md:w-1/4 flex justify-center items-center mb-6 md:mb-0">
            <Image
              src={items.cover}
              alt={items.title}
              className="rounded-lg shadow-md object-cover transition duration-200 hover:scale-[1.02]"
              height={500}
              width={500}
              objectFit="cover"
            />
          </div>

          {/* 우측 책 정보 */}
          <div className="md:w-2/3 md:pl-8 text-lg flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4">{items.title}</h1>
              <p className="text-xl mb-2 text-gray-700">{items.author}</p>
              <p className="text-md text-gray-600 mb-2 font-semibold">
                출판사: <span className="text-md font-normal">{items.publisher}</span>
              </p>
              <p className="text-md text-gray-600 mb-2 font-semibold">{items.categoryName}</p>

              <p className="text-md font-semibold text-gray-600 mb-4">
                등급:{' '}
                {items.adult ? (
                  <span className="text-red-600 border border-red-600 rounded px-2">성인</span>
                ) : (
                  <span className="text-blue-600 border border-blue-600 rounded px-2">일반</span>
                )}
              </p>

              <p className="text-md font-semibold mb-4">
                <span className="font-normal text-gray-700">{items.description}</span>
              </p>
            </div>

            <div className="mb-4">
              {hasSale ? (
                <div className="flex items-end gap-3">
                  <p className="text-sm text-gray-400 line-through">{standard.toLocaleString()}원</p>

                  <p className="text-2xl font-semibold">{sales.toLocaleString()}원</p>

                  <p className="text-sm font-semibold text-red-600">{discountRate}%</p>
                </div>
              ) : (
                <p className="text-2xl font-semibold">{standard.toLocaleString()}원</p>
              )}
            </div>
            <a
              href={items.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full px-6 py-3 rounded-lg shadow-md bg-[#af5858] text-white hover:bg-[#8f4646] text-center transition-colors block"
            >
              구매 바로가기
            </a>
          </div>
        </div>
      </div>
      <Comment />
    </>
  );
};

export default MainDetail;
