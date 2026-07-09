"use client";

import Image, { type StaticImageData } from "next/image";
import testi1 from "@/assets/testi/testi-1.webp";
import testi2 from "@/assets/testi/testi-2.webp";
import testi3 from "@/assets/testi/testi-3.webp";
import testi4 from "@/assets/testi/testi-4.webp";
import testi5 from "@/assets/testi/testi-5.webp";
import testi6 from "@/assets/testi/testi-6.webp";
import testi7 from "@/assets/testi/testi-7.webp";
import testi8 from "@/assets/testi/testi-8.webp";

interface Testimonial {
  src: StaticImageData;
  alt: string;
}

const testimonials: Testimonial[] = [
  { src: testi1, alt: "Testimoni customer 1" },
  { src: testi2, alt: "Testimoni customer 2" },
  { src: testi3, alt: "Testimoni customer 3" },
  { src: testi4, alt: "Testimoni customer 4" },
  { src: testi5, alt: "Testimoni customer 5" },
  { src: testi6, alt: "Testimoni customer 6" },
  { src: testi7, alt: "Testimoni customer 7" },
  { src: testi8, alt: "Testimoni customer 8" },
];

const loopedTestimonials = [...testimonials, ...testimonials];

interface TestimoniSectionProps {
  isLiteMode?: boolean;
}

export default function TestimoniSection({ isLiteMode = false }: TestimoniSectionProps) {
  // Marquee keyframe translates -50%, so content must be doubled to loop seamlessly on both modes.
  const visibleTestimonials = loopedTestimonials;

  return (
    <section
      id="testimoni"
      className="relative scroll-mt-24 overflow-hidden py-12 sm:scroll-mt-28 sm:py-14"
    >
      {!isLiteMode && (
        <div className="pointer-events-none absolute inset-x-0 top-10 h-40 bg-[radial-gradient(circle_at_top,hsl(var(--primary)_/_0.18),transparent_62%)] blur-3xl" />
      )}

      <div className="relative mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col items-center gap-2 sm:mb-8">
          <span className="font-display text-[10px] tracking-[0.36em] text-muted-foreground/60 sm:text-xs">
            APA KATA MEREKA?
          </span>
          <h2 className="text-center font-display text-2xl font-bold tracking-wide text-foreground sm:text-3xl md:text-4xl">
            TESTIMONI PEMBELI <span className="text-primary">FUZEVALO</span>
          </h2>
          <p className="text-center text-sm text-muted-foreground/70">
            Ribuan pembeli sudah bertransaksi aman di Fuzevalo.
          </p>
        </div>

        {/* ponytail: drop mask-image on lite so mask + animating child doesn't force per-frame recomposite on iOS. Marquee itself is pure translateX — cheap. */}
        <div className={`${isLiteMode ? "" : "testimoni-strip-mask"} relative overflow-hidden`}>
          <div className="testimoni-strip-track flex w-max gap-4 sm:gap-5">
            {visibleTestimonials.map((item, index) => (
              <div
                key={`${item.alt}-${index}`}
                className="w-[180px] shrink-0 overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#0D1530] shadow-[0_14px_38px_hsl(var(--background)_/_0.28)] sm:w-[220px] md:w-[240px]"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  className="block h-auto w-full object-cover"
                  loading="lazy"
                  priority={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
