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
    <section className="relative overflow-hidden py-12 sm:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-10 h-40 bg-[radial-gradient(circle_at_top,hsl(var(--primary)_/_0.18),transparent_62%)] blur-3xl" />

      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="mb-5 px-1 sm:mb-6">
          <div className="space-y-2">
            <span className="font-display text-[11px] tracking-[0.4em] text-primary/60">
              REAL BUYERS
            </span>
            <h2 className="font-display text-2xl font-bold tracking-[0.12em] text-foreground sm:text-[2rem]">
              TESTIMONI
            </h2>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-card/40 px-4 py-5 shadow-[0_24px_90px_hsl(var(--background)_/_0.42)] backdrop-blur-sm sm:px-6 sm:py-6 lg:px-7">
          <div className="relative z-10">
            <div className="testimoni-strip-mask -mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              <div className="testimoni-strip-track flex w-max gap-3 sm:gap-4">
                {loopedTestimonials.map((item, index) => (
                  <div
                    key={`${item.alt}-${index}`}
                    className="shrink-0 overflow-hidden rounded-[1.2rem] border border-primary/18 bg-background/78 p-1 shadow-[0_14px_38px_hsl(var(--background)_/_0.36)]"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      className="h-auto w-[138px] rounded-[0.95rem] object-cover sm:w-[176px] lg:w-[212px]"
                      priority={index < testimonials.length}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-40 bg-[radial-gradient(circle_at_center,hsl(var(--primary)_/_0.16),transparent_72%)] blur-2xl lg:block" />
        </div>
      </div>
    </section>
  );
}
