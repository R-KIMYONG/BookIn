'use client';
import SlideCard from './SlideCard';
import { useEffect, useState } from 'react';
import { CircleChevronLeft, CircleChevronRight, CircleSmall, Pause, Play } from 'lucide-react';
import Button from '@/components/common/ui/Button';
import { SECOND } from '@/shared/constants/time';
import { TopViewType } from '@/shared/domain/ranking/types';
import { useFetchLikeCount } from '@/hooks/like/useFetchLikeCount';

const TopViewSlide = ({ books }: { books: TopViewType[] }) => {
  const [slideIndex, setSlideIndex] = useState(1);
  const [useTransition, setUseTransition] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const slides = books.map((book, i) => ({ book, rank: i + 1 }));

  const cloneSlides = [slides[slides.length - 1], ...slides, slides[0]]; //클론해서 점프방식으로 슬라이드 구현

  const topViewIsbns = books.map((book) => book.isbn13);

  useFetchLikeCount(topViewIsbns);
  useEffect(() => {
    if (!isPlaying || books.length <= 1) return;

    const id = setInterval(() => {
      setUseTransition(true);
      setSlideIndex((prev) => prev + 1);
    }, 3 * SECOND);

    return () => clearInterval(id); // isPlaying이 false 되거나 언마운트 시 정리
  }, [isPlaying, books.length]);

  const handleSlideRight = () => {
    setUseTransition(true);
    setSlideIndex((prev) => prev + 1);
    setIsPlaying(false);
  };

  const handleSlideLeft = () => {
    setUseTransition(true);
    setSlideIndex((prev) => prev - 1);
    setIsPlaying(false);
  };

  const selectSlideDot = (index: number) => {
    setUseTransition(true);
    setSlideIndex(index + 1);
  };

  const handleToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  //클론된 위치에 도달하면 점프-> [clone5,real1,real2,real3,real4,real5,clone1]
  //                           0     1     2     3     4    5      6    :총 수량즉 cloneSlides.length는 7
  useEffect(() => {
    if (slideIndex !== 0 && slideIndex !== cloneSlides.length - 1) return; //1,2,3,4,5 구간에서 startAuto에서 정상적인 prev+1을 동작

    const timer = setTimeout(() => {
      setUseTransition(false); // transition 끄고
      setSlideIndex(
        slideIndex === 0
          ? cloneSlides.length - 2 // 클론5'(0) → 진짜5
          : 1
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [slideIndex, cloneSlides.length]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
      } else {
        setUseTransition(false); // 돌아오면
        setSlideIndex(1); // 안전하게 1번으로 리셋
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  return (
    <section className="w-full min-w-0">
      <div className="w-full h-[300px] sm:h-[350px] lg:h-[450px] overflow-hidden">
        <div
          onTouchStart={(e) => {
            const touchStartPoint = e.changedTouches[0].clientX;
            setTouchStart(touchStartPoint);
            setUseTransition(false);
            setIsPlaying(false);
          }}
          onTouchEnd={(e) => {
            const touchEndPoint = e.changedTouches[0].clientX;
            const diff = touchStart - touchEndPoint;
            setUseTransition(true);
            setDragOffset(0);
            if (Math.abs(diff) < 50) return;
            diff > 0 ? handleSlideRight() : handleSlideLeft();
          }}
          onTouchMove={(e) => {
            const touchMovePoint = e.changedTouches[0].clientX;
            const offset = touchStart - touchMovePoint;
            setDragOffset(offset);
          }}
          className={`flex h-full ${useTransition ? 'transition-transform duration-500' : ''}`}
          style={{ transform: `translateX(calc(-${slideIndex * 100}% - ${dragOffset}px))` }}
        >
          {cloneSlides.map((book, index) => (
            <SlideCard key={book.book.isbn13 + index} book={book.book} rank={book.rank} active />
          ))}
        </div>
      </div>

      {/* 네비게이션 바 */}
      <div className="w-[350px] flex justify-between items-center mt-2">
        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="ghost"
            leftIcon={<CircleChevronLeft width={20} height={20} strokeWidth={2} />}
            className="!hover:bg-gray-none"
            onClick={handleSlideLeft}
          />

          <div className="flex items-center">
            {books.map((_, i) => (
              <Button
                key={i}
                size="xs"
                variant="ghost"
                leftIcon={
                  <CircleSmall
                    width={15}
                    height={15}
                    strokeWidth={2}
                    className={`${slideIndex === i + 1 && 'fill-black text-black transition-colors'}`}
                  />
                }
                onClick={() => selectSlideDot(i)}
              />
            ))}
          </div>
          <Button
            size="xs"
            variant="ghost"
            leftIcon={<CircleChevronRight width={20} height={20} strokeWidth={2} />}
            onClick={handleSlideRight}
          />
        </div>

        <div className="flex items-center">
          <Button
            size="xs"
            variant="ghost"
            leftIcon={
              isPlaying ? (
                <Pause width={20} height={20} strokeWidth={2} /> // 재생 중 → 정지 아이콘
              ) : (
                <Play width={20} height={20} strokeWidth={2} />
              ) // 정지 중 → 재생 아이콘
            }
            onClick={handleToggle}
            aria-label={isPlaying ? '슬라이드 정지' : '슬라이드 재생'}
          />
        </div>
      </div>
    </section>
  );
};

export default TopViewSlide;
