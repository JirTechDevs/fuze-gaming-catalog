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
  "Fuzevalo adalah marketplace jual beli akun Valorant dengan garansi hackback 100%, proses cepat kurang dari 10 menit, dan transaksi aman terpercaya sejak 2021.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL("https://fuzevalo.com"),
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
    url: "https://fuzevalo.com",
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
    <html lang="en" className={`${inter.variable} ${jakartasans.variable} ${rajdhani.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
