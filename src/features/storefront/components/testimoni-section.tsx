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

function CrosshairDoodle() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full" aria-hidden="true">
      <circle cx="80" cy="80" r="28" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle
        cx="80" cy="80" r="50" fill="none" stroke="currentColor"
        strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="6 10"
      />
      <path d="M80 12 V40 M80 120 V148 M12 80 H40 M120 80 H148" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldDoodle() {
  return (
    <svg viewBox="0 0 120 140" className="h-full w-full" aria-hidden="true">
      <path
        d="M60 10 L105 35 V80 C105 105 85 125 60 135 C35 125 15 105 15 80 V35 Z"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"
      />
      <path
        d="M45 72 L55 82 L78 58"
        fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function StarDoodle() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <path
        d="M60 8 L72 44 H110 L79 66 L90 102 L60 80 L30 102 L41 66 L10 44 H48 Z"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatBubbleDoodle() {
  return (
    <svg viewBox="0 0 140 120" className="h-full w-full" aria-hidden="true">
      <path
        d="M20 20 H120 C125 20 130 25 130 30 V75 C130 80 125 85 120 85 H55 L30 105 V85 H20 C15 85 10 80 10 75 V30 C10 25 15 20 20 20 Z"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"
      />
      <path d="M35 45 H105 M35 60 H85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

export default function TestimoniSection() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-10 h-40 bg-[radial-gradient(circle_at_top,hsl(var(--primary)_/_0.18),transparent_62%)] blur-3xl" />

      {/* Hero icon sticker — commented out, kept for future use */}
      {/* <div className="pointer-events-none absolute right-[7%] top-[55%] z-20 hidden -translate-y-1/2 xl:block">
        <Image
          src={heroIcon}
          alt="Hero icon"
          className="h-auto w-[160px] object-contain opacity-90 drop-shadow-[0_18px_46px_hsl(var(--background)_/_0.48)] 2xl:w-[200px]"
          priority={false}
        />
      </div> */}




      <div className="relative mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">

        <div className="mb-5 px-1 sm:mb-6">
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-display text-3xl font-bold tracking-wide text-foreground md:text-4xl text-center">
              TESTIMONIAL <span className="text-primary">CUSTOMER</span>
            </h2>
          </div>
        </div>

        <div className="relative mx-auto w-[75%] overflow-hidden rounded-[1.5rem] border border-primary/15 bg-card/40 py-4 backdrop-blur-sm sm:py-5">
          <div className="relative z-10">
            <div className="overflow-hidden">
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
