"use client";

import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apakah akun Valorant di Fuzevalo aman?",
    answer: `Semua akun sudah dicek sebelum dijual.
Kami juga memberikan garansi hackback 100%, jadi jika terjadi masalah, akan kami bantu sampai selesai.`,
  },
  {
    question: "Bagaimana cara membeli akun di Fuzevalo?",
    answer: `Pilih akun → klik Beli via WhatsApp → langsung chat admin dengan format otomatis → lanjut proses pembayaran & pengiriman.`,
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer: `Transfer bank (BCA, dll), e-wallet, QRIS (sesuai request).
Detail akan diberikan saat di WhatsApp.`,
  },
  {
    question: "Apakah bisa tukar tambah akun lama?",
    answer: `Bisa. Kamu bisa tukar tambah akun lama ke akun yang lebih bagus dengan biaya tambahan yang lebih murah.`,
  },
  {
    question: "Apa itu garansi hackback?",
    answer: `Garansi hackback adalah jaminan jika akun kamu di-hackback (ditarik kembali) oleh pemilik lama. Kami akan bantu recovery atau ganti akun setara sesuai kesepakatan.`,
  },
  {
    question: "Kenapa harus beli akun di Fuzevalo?",
    answer: `✔ 5000+ transaksi berhasil
✔ Garansi hackback
✔ Proses cepat
✔ Banyak pilihan akun`,
  },
];

export default function FAQSection() {
  const leftFaqs = faqs.filter((_, index) => index % 2 === 0);
  const rightFaqs = faqs.filter((_, index) => index % 2 === 1);

  return (
    <section id="faq" className="relative scroll-mt-24 overflow-hidden py-12 sm:scroll-mt-28 sm:py-14">
      <div className="relative mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 px-1 sm:mb-10">
          <div className="flex flex-col items-center gap-2">
            <span className="font-display text-[10px] tracking-[0.36em] text-muted-foreground/90 sm:text-xs">
              PUNYA PERTANYAAN?
            </span>
            <h2 className="text-center font-display text-2xl font-bold tracking-wide text-foreground sm:text-3xl md:text-4xl">
              FAQ JUAL BELI AKUN <span className="text-primary">VALORANT</span>
            </h2>
            <p className="text-center text-sm text-muted-foreground">
              Temukan jawaban dari pertanyaan yang sering ditanyakan.
            </p>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-2 lg:gap-5">
          <FAQColumn items={leftFaqs} columnKey="left" />
          <FAQColumn items={rightFaqs} columnKey="right" />
        </div>
      </div>
    </section>
  );
}

interface FAQColumnProps {
  items: typeof faqs;
  columnKey: string;
}

function FAQColumn({ items, columnKey }: FAQColumnProps) {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {items.map((faq, index) => (
        <AccordionItem
          key={`${columnKey}-${index}`}
          value={`${columnKey}-item-${index}`}
          className="border-none"
        >
          <AccordionTrigger className="flex items-start justify-between rounded-[12px] border border-white/[0.07] bg-[#0A1128] px-4 py-3.5 text-left text-sm font-medium text-white shadow-[0_4px_20px_hsl(var(--background)_/_0.28)] transition-all hover:no-underline data-[state=open]:rounded-b-none sm:items-center sm:px-5 sm:py-4 sm:text-base [&>svg]:mt-1 [&>svg]:shrink-0 [&>svg]:text-[#00C8FF] sm:[&>svg]:mt-0">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00C8FF]/12 text-[#00C8FF]">
                <HelpCircle size={16} strokeWidth={2.4} />
              </span>
              <span className="break-words pr-3">{faq.question}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="whitespace-pre-line rounded-b-[12px] border border-t-0 border-white/[0.07] bg-[#0D1530] px-4 py-4 leading-relaxed text-white/72 sm:px-5">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
