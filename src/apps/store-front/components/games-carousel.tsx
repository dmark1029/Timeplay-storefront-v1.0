import React from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { A11y, Keyboard, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import './games-carousel.css';

type CarouselProps = {
  children: React.ReactNode;
  slidesPerView?: number;
  spaceBetween?: number;
};

const Carousel: React.FC<CarouselProps> = ({ children, slidesPerView = 1, spaceBetween = 0 }) => {
  const handleScrollbarDragStart = (swiper: SwiperClass) => {
    swiper.allowSlideNext = false;
    swiper.allowSlidePrev = false;
  };

  const handleScrollbarDragEnd = (swiper: SwiperClass) => {
    swiper.allowSlideNext = true;
    swiper.allowSlidePrev = true;
  };

  const handleTouchStart = (swiper: SwiperClass, event: TouchEvent | MouseEvent | PointerEvent) => {
    if (window.TouchEvent && event instanceof TouchEvent && event.touches.length > 1) {
      swiper.allowTouchMove = false;
    } else {
      swiper.allowTouchMove = true;
    }
  };

  return (
    <Swiper
      modules={[Scrollbar, Keyboard, A11y]}
      className={`swiper-scroll-bar w-full overflow-visible px-4`}
      centeredSlides={false}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      scrollbar={{
        draggable: true,
        dragClass: 'my-swiper swiper-scrollbar-drag swiper-scroller bg-primary-700',
        enabled: true,
        horizontalClass: 'bg-primary-700',
      }}
      preventClicks={true}
      preventClicksPropagation={true}
      keyboard={{
        enabled: true,
      }}
      a11y={{
        enabled: true,
      }}
      onScrollbarDragStart={handleScrollbarDragStart}
      onScrollbarDragEnd={handleScrollbarDragEnd}
      onTouchStart={handleTouchStart}
    >
      {Array.isArray(children) &&
        children.map((child, index) => {
          return (
            <SwiperSlide className='py-2' key={index}>
              {child}
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default Carousel;
