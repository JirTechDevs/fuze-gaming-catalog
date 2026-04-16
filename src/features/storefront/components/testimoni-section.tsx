"use client";

import Image from "next/image";
import testi1 from "@/assets/testi/testi-1.webp";
import testi2 from "@/assets/testi/testi-2.webp";
import testi3 from "@/assets/testi/testi-3.webp";
import testi4 from "@/assets/testi/testi-4.webp";
import testi5 from "@/assets/testi/testi-5.webp";
import testi6 from "@/assets/testi/testi-6.webp";
import testi7 from "@/assets/testi/testi-7.webp";

const testimonials = [
  { src: testi1, alt: "Testimoni customer 1" },
  { src: testi2, alt: "Testimoni customer 2" },
  { src: testi3, alt: "Testimoni customer 3" },
  { src: testi4, alt: "Testimoni customer 4" },
  { src: testi5, alt: "Testimoni customer 5" },
  { src: testi6, alt: "Testimoni customer 6" },
  { src: testi7, alt: "Testimoni customer 7" },
];

const loopedTestimonials = [...testimonials, ...testimonials];

export default function TestimoniSection() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 px-1 sm:mb-8">
          <span className="font-display text-[11px] tracking-[0.4em] text-primary/60">
            REAL BUYERS
          </span>
          <h2 className="font-display text-3xl font-bold tracking-[0.12em] text-foreground md:text-4xl">
            TESTIMONI
          </h2>
        </div>

        <div className="testimoni-strip-mask -mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="testimoni-strip-track flex w-max gap-3 sm:gap-5 lg:gap-6">
            {loopedTestimonials.map((item, index) => (
              <div
                key={`${item.alt}-${index}`}
                className="shrink-0 overflow-hidden rounded-[1.5rem] border border-border/30 bg-card/60 shadow-[0_18px_60px_hsl(var(--background)_/_0.36)]"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  className="h-auto w-[190px] object-cover sm:w-[320px] lg:w-[380px] xl:w-[420px]"
                  priority={index < testimonials.length}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
