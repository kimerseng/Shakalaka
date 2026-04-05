'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Tag } from 'lucide-react';

const promotions = [
  {
    id: 1,
    title: "50% OFF",
    subtitle: "Private Movie Experience",
    description: "Limited time offer on all private screenings",
    image: "/uploads/02_SHAKALAKA_50OFF_02.jpg",
    badge: "SALE",
    endTime: "12:00 AM",
    gradient: "from-orange-500 to-red-600"
  },
  {
    id: 2,
    title: "WE ARE OPEN",
    subtitle: "Private Movie Theater",
    description: "Book your exclusive cinema experience",
    image: "/uploads/SHAKALAKA_WEAREOPEN_02.jpg",
    badge: "OPEN",
    endTime: "12:00 AM",
    gradient: "from-purple-500 to-pink-600"
  }
];

export default function PromotionSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl">
      {/* Main Slider Container */}
      <div className="relative h-96 md:h-[500px]">
        {/* Slides */}
        <div className="relative h-full">
          {promotions.map((promotion, index) => (
            <div
              key={promotion.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={promotion.image}
                  alt={promotion.title}
                  className="w-full h-full object-scale-down"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/30 to-transparent" />
              </div>

              {/* Content */}
              {/* <div className="relative z-10 flex h-full items-center">
                <div className="container mx-auto px-6 md:px-12">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 mb-4 border border-white/20">
                      <Tag size={16} className="text-white" />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">
                        {promotion.badge}
                      </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 leading-tight">
                      {promotion.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-200 mb-4">
                      {promotion.subtitle}
                    </p>

                    <p className="text-base md:text-lg text-zinc-300 mb-6 max-w-lg">
                      {promotion.description}
                    </p>

                    <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 max-w-fit">
                      <Clock size={18} className="text-orange-400" />
                      <span className="text-white font-medium">
                        Valid until {promotion.endTime}
                      </span>
                    </div>

                  </div>
                </div>
              </div> */}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
       

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {promotions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
      
      </div>

      {/* Bottom Gradient Bar */}
      <div className={`h-2 bg-gradient-to-r ${promotions[currentIndex].gradient}`} />
    </div>
  );
}
