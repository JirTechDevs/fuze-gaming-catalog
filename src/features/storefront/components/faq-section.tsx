"use client";

import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apakah akun aman?",
    answer: `Semua akun sudah dicek sebelum dijual.
Kami juga memberikan garansi hackback 100%, jadi jika terjadi masalah, akan kami bantu sampai selesai.`,
  },
  {
    question: "Bagaimana cara membeli akun?",
    answer: `Pilih akun → klik Beli via WhatsApp → langsung chat admin dengan format otomatis → lanjut proses pembayaran & pengiriman.`,
  },

  {
    question: "Metode pembayaran apa saja?",
    answer: `Transfer bank (BCA, dll), e-wallet, QRIS (sesuai request).
Detail akan diberikan saat di WhatsApp.`,
  },
  {
    question: "Apakah bisa tukar tambah akun?",
    answer: `Bisa. Kamu bisa tukar tambah akun lama ke akun yang lebih bagus dengan biaya tambahan yang lebih murah.`,
  },

  {
    question: "Kenapa harus beli di FuzeValo?",
    answer: `✔ 1000+ transaksi berhasil
✔ Garansi hackback
✔ Proses cepat
✔ Banyak pilihan akun`,
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="relative scroll-mt-24 overflow-hidden py-12 sm:scroll-mt-28 sm:py-14">
      <div className="relative mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 px-1 sm:mb-10">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-center font-display text-2xl font-bold tracking-wide text-foreground sm:text-3xl md:text-4xl">
              FAQ
            </h2>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-none"
              >
                <AccordionTrigger className="flex items-start justify-between rounded-xl border border-primary/30 bg-gradient-to-r from-background via-primary/20 to-primary px-4 py-3.5 text-left text-sm font-medium text-foreground shadow-[0_4px_20px_hsl(var(--background)_/_0.5)] transition-all hover:no-underline data-[state=open]:rounded-b-none sm:items-center sm:px-5 sm:py-4 sm:text-base [&>svg]:mt-1 [&>svg]:shrink-0 [&>svg]:text-black sm:[&>svg]:mt-0">
                  <div className="flex min-w-0 items-start gap-3">
                    <Image src="/images/logo.png" alt="Fuze Logo" width={24} height={24} className="shrink-0 object-contain" />
                    <span className="break-words pr-3">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="whitespace-pre-line rounded-b-xl border border-t-0 border-primary/20 bg-background/50 px-4 py-4 leading-relaxed text-muted-foreground sm:px-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
