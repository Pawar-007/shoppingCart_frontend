import { useEffect, useState } from "react";

const DEMO_SEEDS = ["shopcart-1", "shopcart-2", "shopcart-3", "shopcart-4", "shopcart-5", "shopcart-6"];
const DEMO_SLIDES = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
  "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
];
console.log("demo slides",DEMO_SLIDES)
export default function HeroCarousel({ images = [], intervalMs = 4000 }) {
  const [index, setIndex] = useState(0);

 // const slides = images.length > 0 ? images : DEMO_SLIDES;
  const slides =DEMO_SLIDES;
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [slides.length, intervalMs]);

  return (
    <div className="aspect-[4/3] rounded-xl border border-border overflow-hidden relative bg-primary-light">
      {slides.map((src, i) => {
        const isActive = i === index;
        return (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!isActive}
          />
        );
      })}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}