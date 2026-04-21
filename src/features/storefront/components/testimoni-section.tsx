"use client";

import Image from "next/image";
import heroIcon from "@/assets/hero-icon.webp";
import testi1 from "@/assets/testi/testi-1.webp";
import testi2 from "@/assets/testi/testi-2.webp";
import testi3 from "@/assets/testi/testi-3.webp";
import testi4 from "@/assets/testi/testi-4.webp";
import testi5 from "@/assets/testi/testi-5.webp";
import testi6 from "@/assets/testi/testi-6.webp";
import testi7 from "@/assets/testi/testi-7.webp";
import testi8 from "@/assets/testi/testi-8.webp";

const testimonials = [
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

export default function TestimoniSection() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-10 h-40 bg-[radial-gradient(circle_at_top,hsl(var(--primary)_/_0.18),transparent_62%)] blur-3xl" />

      <div className="pointer-events-none absolute -right-4 top-[55%] z-20 hidden -translate-y-1/2 xl:block 2xl:-right-6">
        <Image
          src={heroIcon}
          alt="Hero icon"
          className="h-auto w-[160px] object-contain opacity-90 drop-shadow-[0_18px_46px_hsl(var(--background)_/_0.48)] 2xl:w-[200px]"
          priority={false}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">

        <div className="mb-5 px-1 sm:mb-6">
          <div className="space-y-2">
            <span className="font-display text-[11px] tracking-[0.4em] text-primary/60">
              REAL BUYERS
            </span>
            <h2 className="font-display text-xl font-bold tracking-[0.12em] text-foreground sm:text-2xl">
              TESTIMONI
            </h2>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] border border-primary/15 bg-card/40 py-4 shadow-[0_24px_90px_hsl(var(--background)_/_0.42)] backdrop-blur-sm sm:py-5">
          <div className="relative z-10">
            <div className="testimoni-strip-mask overflow-hidden">
              <div className="testimoni-strip-track flex w-max gap-2.5 px-2.5 sm:gap-3 sm:px-3">
                {loopedTestimonials.map((item, index) => (
                  <div
                    key={`${item.alt}-${index}`}
                    className="shrink-0 overflow-hidden rounded-[1rem] border border-primary/18 bg-background/78 shadow-[0_14px_38px_hsl(var(--background)_/_0.36)]"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      className="block h-auto w-[110px] object-cover sm:w-[140px] lg:w-[170px]"
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
