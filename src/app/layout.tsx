import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Rajdhani } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const jakartasans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-rajdhani",
});

const siteTitle = "Jual Beli Akun Valorant Aman & Bergaransi | Fuzevalo";
const siteDescription =
  "Fuzevalo: Jual Beli Akun Valorant murah, aman, dan bergaransi hackback 100%. Katalog akun ready, proses cepat, transaksi terpercaya.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL("https://www.fuzevalo.com"),
  alternates: { canonical: "https://www.fuzevalo.com/" },
  keywords: [
    "jual akun valorant",
    "jual beli akun valorant",
    "beli akun valorant",
    "akun valorant murah",
    "akun valorant garansi",
    "marketplace valorant",
    "fuzevalo",
  ],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  authors: [{ name: "Fuzevalo" }],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    url: "https://www.fuzevalo.com/",
    siteName: "Fuzevalo",
    images: ["/images/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jakartasans.variable} ${rajdhani.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
