"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SafeImg from "./SafeImg";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=2000&q=80",
    category: "Photo Studio",
    title: "Find the light your shoot has been waiting for.",
    text: "Cyc walls, daylight lofts and strobe-ready sets, listed by the people who run them and bookable by the hour.",
  },
  {
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=2000&q=80",
    category: "Podcast Lounge",
    title: "Press record in a room that already sounds great.",
    text: "Treated podcast rooms and recording suites with the mics, mixers and monitors already set up.",
  },
  {
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2000&q=80",
    category: "Film Stage",
    title: "Earn from your space, or rent the stage you need.",
    text: "List an empty studio in minutes, or book a sound stage for the weekend. Prices and deposits are always upfront.",
  },
];

export default function HeroSlider() {
  return (
    <section aria-label="Featured studio spaces">
      <Swiper
        className="hero-swiper h-[78vh] min-h-[560px] bg-neutral"
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        loop
        speed={900}
        autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation
        pagination={{ clickable: true }}
      >
        {slides.map((s, i) => (
          <SwiperSlide key={s.title}>
            <div className="relative h-full w-full overflow-hidden bg-neutral">
              <SafeImg src={s.image} alt="" category={s.category} eager={i === 0} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d1c] via-[#0a0d1c]/70 to-[#0a0d1c]/10" />
              <div className="container-x relative flex h-full items-center">
                <div className="max-w-2xl pb-8 text-white">
                  <span className="tape-badge mb-5">{s.category}</span>
                  <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">{s.title}</h1>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{s.text}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/studios" className="btn btn-primary btn-lg rounded-full">Explore Studios</Link>
                    <Link href="/add-studio" className="btn btn-lg rounded-full border-white/60 bg-transparent text-white hover:border-white hover:bg-white/15">Host Your Space</Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
