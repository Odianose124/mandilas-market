import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import slides from "../../data/slides";

function HeroSlider() {
  return (
    <div className="rounded-xl overflow-hidden shadow-md">

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        className="h-[250px] md:h-[350px] lg:h-[430px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">

              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/45"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center">

                <div className="px-6 md:px-10 lg:px-14 text-white max-w-2xl">

                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    {slide.title}
                  </h1>

                  <p className="mt-4 text-sm md:text-lg text-gray-200">
                    {slide.subtitle}
                  </p>

                  <button className="mt-6 bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-lg font-semibold">
                    {slide.button}
                  </button>

                </div>

              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}

export default HeroSlider;