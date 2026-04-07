import { getAladinDetail } from '@/app/lib/aladin/getAladinDetail';
import EmptyState from '@/components/common/EmptyState';
import Image from 'next/image';
import CommentSection from './_components/CommentSection';
import { AladinItem } from '@/types/MainDetail.type';
const getCheapest = (items: { price: number; link: string }[]) => {
  if (items.length === 0) return null;
  return items.sort((a, b) => a.price - b.price)[0];
};

const getDiscountRate = (base: number, target: number) => {
  if (!base || !target) return 0;
  return Math.round(((base - target) / base) * 100);
};

const MainDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const data = await getAladinDetail(id);
  const item: AladinItem = data?.item?.[0];
  if (!item) return <EmptyState description="책 정보를 찾을 수 없습니다." />;

  //가격
  const standard = Number(item.priceStandard ?? 0);
  const sales = Number(item.priceSales ?? 0);
  const hasSale = standard > 0 && sales > 0 && sales < standard;

  const newDiscount = hasSale ? Math.round(((standard - sales) / standard) * 100) : 0;

  //신뢰 지표
  const rating = item.customerReviewRank ?? 0;
  const salesPoint = item.salesPoint ?? 0;

  //ebook
  const ebookList = item.subInfo?.ebookList;

  const ebookSources =
    ebookList?.map((e) => ({
      price: e.priceSales,
      link: e.link,
    })) ?? [];

  const cheapestEbook = getCheapest(ebookSources);

  //중고
  const usedList = item.subInfo?.usedList;

  const usedSources = [usedList?.aladinUsed, usedList?.spaceUsed, usedList?.userUsed]
    .filter((u) => (u?.itemCount ?? 0) > 0)
    .map((u) => ({
      price: u!.minPrice,
      link: u!.link,
      count: u!.itemCount,
    }));

  const cheapestUsed = getCheapest(usedSources);

  const totalUsedCount = usedSources.reduce((acc, cur) => acc + cur.count, 0);

  const minUsedPrice = usedSources.length > 0 ? Math.min(...usedSources.map((u) => u.price)) : null;

  //할인율
  const usedDiscount = cheapestUsed && standard ? getDiscountRate(standard, cheapestUsed.price) : 0;

  const ebookDiscount = cheapestEbook && standard ? getDiscountRate(standard, cheapestEbook.price) : 0;

  const category = item.categoryName?.split('>')?.pop() ?? '';

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
        <div className="rounded-2xl bg-white shadow">
          <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[260px_1fr]">
            {/* 이미지 */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[220px]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 80vw, 220px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 정보 */}
            <div className="flex flex-col gap-4">
              {/* 제목 */}
              <div>
                <h1 className="text-xl font-bold sm:text-2xl">{item.title}</h1>
                <p className="text-sm text-gray-700">{item.author}</p>
                <p className="text-xs text-gray-400">{category}</p>
              </div>

              {/* 설명 */}
              {item.description && (
                <div className="bg-gray-50 px-4 py-4 rounded-xl">
                  <p className="text-sm text-gray-700 line-clamp-5">{item.description}</p>
                </div>
              )}

              {/* 신뢰 */}
              <div className="flex gap-4 text-xs text-gray-500">
                {rating > 0 && <span>평점 {rating}</span>}
                {salesPoint > 0 && <span>판매량 {salesPoint.toLocaleString()}</span>}
              </div>

              <div className="rounded-xl border px-4 py-4 space-y-3">
                {/* 정가 */}
                {hasSale && (
                  <div className="text-sm text-gray-400 line-through">정가 {standard.toLocaleString()}원</div>
                )}

                {/* 새책 */}
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-gray-900">{sales.toLocaleString()}원</span>
                  {hasSale && <span className="text-sm font-semibold text-red-500">↓{newDiscount}%</span>}
                </div>

                {/* 적립 */}
                {item.mileage && (
                  <p className="text-xs text-gray-400">구매 시 {item.mileage.toLocaleString()}원 적립</p>
                )}

                {/* ebook 비교 */}
                {cheapestEbook && (
                  <div className="text-sm text-blue-600">
                    eBook {cheapestEbook.price.toLocaleString()}원
                    <span className="text-xs text-blue-400 ml-1">(정가 대비 ↓{ebookDiscount}%)</span>
                  </div>
                )}

                {/* 중고 요약 */}
                {totalUsedCount > 0 && minUsedPrice && (
                  <div className="text-sm text-gray-600">
                    중고 {totalUsedCount}개 · {minUsedPrice.toLocaleString()}원~
                    <span className="text-xs text-red-500 ml-1">(정가 대비 ↓{usedDiscount}%)</span>
                  </div>
                )}

                {/* CTA */}
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={item.link}
                    target="_blank"
                    className="px-3 py-1.5 rounded-md bg-[#af5858] text-white text-[11px] font-medium"
                  >
                    새책 구매
                  </a>

                  {cheapestEbook && (
                    <a href={cheapestEbook.link} target="_blank" className="text-[11px] text-blue-600 hover:underline">
                      eBook 보기
                    </a>
                  )}

                  {cheapestUsed && (
                    <a href={cheapestUsed.link} target="_blank" className="text-[11px] text-gray-600 hover:underline">
                      중고 보기
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 댓글부분 */}
        <div className="mt-8">
          <CommentSection postId={id} cover={item.cover} book_title={item.title} />
        </div>
      </div>
    </>
  );
};

export default MainDetail;
