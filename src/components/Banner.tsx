"use client";

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Banner() {
  const mainBanners = [
    "/banner/Banner-quang-cao-la-gi.jpg",
    "/banner/final-sale-banner.png",
    "/banner/mau-banner-quang-cao-dep-1.jpg",
  ];

  const smallBanners = [
    "/banner/trungthu.jpg",
    "/banner/final-sale-banner.png",
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
    pauseOnHover: true,
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 gap-4 flex flex-col md:flex-row">
      {/* Banner lớn bên trái */}
      <div className="md:w-2/3 rounded-lg overflow-hidden shadow-md">
        <Slider {...settings}>
          {mainBanners.map((src, idx) => (
            <div key={idx} className="relative h-[250px] sm:h-[300px] md:h-[400px] w-full">
              <Image
                src={src}
                alt={`banner-main-${idx}`}
                fill
                style={{ objectFit: "cover" }} // cover để ảnh phủ toàn khung
                sizes="(max-width: 768px) 100vw, 66vw" // responsive
                priority
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* 2 banner nhỏ bên phải */}
      <div className="md:w-1/3 flex flex-col gap-4">
        {smallBanners.map((src, idx) => (
          <div
            key={idx}
            className="relative h-[120px] sm:h-[150px] md:h-[195px] w-full rounded-lg overflow-hidden shadow-md"
          >
            <Image
              src={src}
              alt={`banner-small-${idx}`}
              fill
              style={{ objectFit: "cover" }} // cover hoặc contain tùy bạn
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}
