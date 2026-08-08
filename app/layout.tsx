import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PürInstinct Games — Supplier Order & Pricing",
  description: "Supplier order and pricing request tool for PürInstinct Games",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${barlow.variable} h-full`}
    >
      <body className="min-h-full bg-offwhite text-ink antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
