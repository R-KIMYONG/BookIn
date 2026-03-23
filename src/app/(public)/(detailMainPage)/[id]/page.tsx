import { getAladinDetail } from '@/app/lib/aladin/getAladinDetail';
import EmptyState from '@/components/common/EmptyState';
import Image from 'next/image';
import CommentSection from './_components/CommentSection';
import Comment from './_components/Comment';

const MainDetail = async ({ params }: { params: { id: string } }) => {
  const data = await getAladinDetail(params.id);

  const item = data?.item?.[0];

  if (!item) return <EmptyState description="책 정보를 찾을 수 없습니다." />;

  const standard = Number(item.priceStandard ?? 0);
  const sales = Number(item.priceSales ?? 0);
  const hasSale = standard > 0 && sales > 0 && sales < standard;
  const discountRate = hasSale ? Math.round(((standard - sales) / standard) * 100) : 0;

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
        <div className="rounded-2xl bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[360px_1fr]">
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[320px]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 400px, 720px"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                    {item.publisher ?? '출판사 정보 없음'}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      item.adult
                        ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                        : 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                    }`}
                  >
                    {item.adult ? '성인' : '일반'}
                  </span>
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-col gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-extrabold leading-snug text-gray-900 sm:text-2xl lg:text-3xl">
                    {item.title}
                  </h1>
                  <p className="mt-2 text-sm text-gray-700 sm:text-base">{item.author ?? '저자 정보 없음'}</p>

                  <p className="mt-2 text-xs text-gray-500 sm:text-sm">{item.categoryName ?? ''}</p>
                </div>

                {item.description ? (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                    <p className="text-sm leading-6 text-gray-700 line-clamp-6">{item.description}</p>
                  </div>
                ) : null}
                {/* 가격 */}
                <div className="rounded-2xl border border-gray-200 px-4 py-4">
                  {hasSale ? (
                    <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                      <p className="text-sm text-gray-400 line-through">{standard.toLocaleString()}원</p>
                      <p className="text-2xl font-extrabold text-gray-900">{sales.toLocaleString()}원</p>
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700 ring-1 ring-red-200">
                        {discountRate}% 할인
                      </span>
                    </div>
                  ) : (
                    <p className="text-2xl font-extrabold text-gray-900">{standard.toLocaleString()}원</p>
                  )}

                  <p className="mt-2 text-[11px] text-gray-400">
                    가격 정보는 제공처 기준이며, 실제 판매가와 다를 수 있어요.
                  </p>
                </div>

                {/* 버튼 */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#af5858] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#8f4646] sm:w-auto"
                  >
                    구매 바로가기
                  </a>

                  <a
                    href="/"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 sm:w-auto"
                  >
                    목록으로
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 댓글부분 */}
        <div className="mt-8">
          <CommentSection postId={params.id} cover={item.cover} book_title={item.title} />
        </div>
      </div>
    </>
  );
};

export default MainDetail;
