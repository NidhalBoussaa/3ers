import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Cinzel,
  Cinzel_Decorative,
  Great_Vibes,
  Amiri,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const cinzelDeco = Cinzel_Decorative({
  variable: "--font-cinzel-deco",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
const vibes = Great_Vibes({
  variable: "--font-vibes",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mon espace — 3ers",
  description: "Votre atelier privé : suivez, personnalisez et partagez votre invitation.",
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0805",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${cinzel.variable} ${cinzelDeco.variable} ${vibes.variable} ${amiri.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
