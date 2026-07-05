"use client";

import Image, { type StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  name: string;
  rank: string;
  stars: number;
}

const testimonials: Testimonial[] = [
  { src: testi1, alt: "Testimoni Rizky Pratama", name: "Rizky Pratama", rank: "Platinum 2", stars: 5 },
  { src: testi2, alt: "Testimoni Dimas Aditya", name: "Dimas Aditya", rank: "Diamond 1", stars: 5 },
  { src: testi3, alt: "Testimoni Fahmi Ramadhan", name: "Fahmi Ramadhan", rank: "Gold 3", stars: 5 },
  { src: testi4, alt: "Testimoni Kevin Sanjaya", name: "Kevin Sanjaya", rank: "Ascendant 1", stars: 5 },
  { src: testi5, alt: "Testimoni Andi Wijaya", name: "Andi Wijaya", rank: "Silver 3", stars: 5 },
  { src: testi6, alt: "Testimoni Bima Prakoso", name: "Bima Prakoso", rank: "Immortal 1", stars: 5 },
  { src: testi7, alt: "Testimoni Rendra Saputra", name: "Rendra Saputra", rank: "Gold 2", stars: 5 },
  { src: testi8, alt: "Testimoni Yudha Kurniawan", name: "Yudha Kurniawan", rank: "Platinum 1", stars: 5 },
];

const avatarPalettes = [
  { bg: "linear-gradient(135deg,#1B4A7A,#0E2540)", ring: "rgba(0,200,255,0.35)" },
  { bg: "linear-gradient(135deg,#7A2E1B,#3E1408)", ring: "rgba(255,138,90,0.35)" },
  { bg: "linear-gradient(135deg,#1B7A4E,#0A3820)", ring: "rgba(94,220,150,0.35)" },
  { bg: "linear-gradient(135deg,#5B1B7A,#2A0938)", ring: "rgba(190,120,255,0.35)" },
  { bg: "linear-gradient(135deg,#7A6A1B,#3A310A)", ring: "rgba(240,210,90,0.35)" },
  { bg: "linear-gradient(135deg,#1B5A7A,#08283A)", ring: "rgba(88,180,240,0.35)" },
  { bg: "linear-gradient(135deg,#7A1B4C,#3B0824)", ring: "rgba(240,110,170,0.35)" },
  { bg: "linear-gradient(135deg,#1B7A72,#083836)", ring: "rgba(90,220,215,0.35)" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function TestimoniSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByOnePage = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>("[data-testi-card]")?.offsetWidth ?? 220;
    const gap = 20;
    const delta = (cardWidth + gap) * (direction === "left" ? -3 : 3);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section
      id="testimoni"
      className="relative scroll-mt-24 overflow-hidden py-12 sm:scroll-mt-28 sm:py-14"
    >
      <div className="pointer-events-none absolute inset-x-0 top-10 h-40 bg-[radial-gradient(circle_at_top,hsl(var(--primary)_/_0.18),transparent_62%)] blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col items-center gap-2 sm:mb-8">
          <span className="font-display text-[10px] tracking-[0.36em] text-muted-foreground/60 sm:text-xs">
            APA KATA MEREKA?
          </span>
          <h2 className="text-center font-display text-2xl font-bold tracking-wide text-foreground sm:text-3xl md:text-4xl">
            TESTIMONI <span className="text-primary">CUSTOMER</span>
          </h2>
          <p className="text-center text-sm text-muted-foreground/70">
            Ratusan pembeli sudah bertransaksi aman di Fuzevalo.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByOnePage("left")}
            disabled={!canScrollLeft}
            aria-label="Testimoni sebelumnya"
            className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.08] bg-[#0A1128]/85 text-white/85 shadow-[0_10px_30px_hsl(var(--background)_/_0.4)] backdrop-blur transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/[0.08] disabled:hover:text-white/85 md:flex"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={() => scrollByOnePage("right")}
            disabled={!canScrollRight}
            aria-label="Testimoni berikutnya"
            className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 translate-x-2 items-center justify-center rounded-full border border-white/[0.08] bg-[#0A1128]/85 text-white/85 shadow-[0_10px_30px_hsl(var(--background)_/_0.4)] backdrop-blur transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/[0.08] disabled:hover:text-white/85 md:flex"
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto scroll-smooth pb-2 pl-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((item, index) => (
              <TestimonialCard
                key={item.name}
                item={item}
                palette={avatarPalettes[index % avatarPalettes.length]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  item: Testimonial;
  palette: (typeof avatarPalettes)[number];
}

function TestimonialCard({ item, palette }: TestimonialCardProps) {
  const initials = getInitials(item.name);

  return (
    <div
      data-testi-card
      className="flex w-[52%] shrink-0 snap-start flex-col gap-3 sm:w-[34%] md:w-[26%] lg:w-[19%] xl:w-[16%]"
    >
      <div className="overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#0D1530] shadow-[0_14px_38px_hsl(var(--background)_/_0.28)]">
        <Image
          src={item.src}
          alt={item.alt}
          className="block h-auto w-full object-cover"
          loading="lazy"
          priority={false}
        />
      </div>

      <div className="flex items-center gap-2.5 rounded-[12px] border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-bold tracking-wide text-white/90"
          style={{
            background: palette.bg,
            boxShadow: `inset 0 0 0 1px ${palette.ring}`,
          }}
        >
          {initials}
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate font-display text-[13px] font-semibold text-white">
            {item.name}
          </span>
          <span className="truncate text-[11px] text-muted-foreground/70">
            {item.rank}
          </span>
          <div className="mt-1 flex items-center gap-[2px]">
            {Array.from({ length: item.stars }).map((_, index) => (
              <Star
                key={index}
                size={10}
                className="fill-yellow-400 text-yellow-400"
                strokeWidth={0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
