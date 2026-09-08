"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function Carousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-sand">
        <Image src={images[0]} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  const go = (delta: number) => {
    setIndex((current) => (current + delta + images.length) % images.length);
  };

  return (
    <div className="mt-4">
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-sand"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 40) go(delta > 0 ? -1 : 1);
          touchStartX.current = null;
        }}
      >
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${alt} — ${i + 1}/${images.length}`}
            fill
            className={`object-cover transition-opacity duration-300 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            sizes="(min-width: 768px) 700px, 100vw"
            priority={i === 0}
            loading={i === 0 ? undefined : "eager"}
          />
        ))}

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Vorige foto"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-cream-soft/80 p-2 text-wood-dark shadow hover:bg-cream-soft"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Volgende foto"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-cream-soft/80 p-2 text-wood-dark shadow hover:bg-cream-soft"
        >
          →
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ga naar foto ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-terracotta" : "w-1.5 bg-wood/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
