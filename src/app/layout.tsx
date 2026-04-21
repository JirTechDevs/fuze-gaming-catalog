import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Fuzevalo",
  description: "Fuzevalo gaming catalog frontend mockup.",
  metadataBase: new URL("http://localhost:3000"),
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  authors: [{ name: "Fuzevalo" }],
  openGraph: {
    title: "Fuzevalo",
    description: "Fuzevalo gaming catalog frontend mockup.",
    type: "website",
    images: ["/images/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fuzevalo",
    description: "Fuzevalo gaming catalog frontend mockup.",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakartasans.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
