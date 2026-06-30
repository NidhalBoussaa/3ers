import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Cinzel,
  Cinzel_Decorative,
  Great_Vibes,
  Amiri,
  Marcellus,
  Geist_Mono,
} from "next/font/google";
import weddingData from "@/data/wedding.json";
import { WeddingConfigSchema, pick } from "@/lib/schema";
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
  weight: ["400", "700", "900"],
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
const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const config = WeddingConfigSchema.parse(weddingData);

export const metadata: Metadata = {
  title: `${config.couple.groom.first} & ${config.couple.bride.first} — Invitation de mariage`,
  description: pick(config.i18n.labels.inviteLead, "fr"),
  openGraph: {
    title: `${config.couple.groom.first} & ${config.couple.bride.first} — Invitation de mariage`,
    description: `${pick(config.date.display, "fr")} · ${pick(config.venue.name, "fr")} · ${pick(config.venue.city, "fr")}`,
    type: "website",
    images: ["/mawazine.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: config.theme.night },
    { media: "(prefers-color-scheme: light)", color: config.theme.cream },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={config.i18n.default}
      dir={config.i18n.default === "ar" ? "rtl" : "ltr"}
      className={`${cormorant.variable} ${cinzel.variable} ${cinzelDeco.variable} ${vibes.variable} ${amiri.variable} ${marcellus.variable} ${mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className={`lang-${config.i18n.default} min-h-dvh`}>
        {/* JSON-LD Event for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: `Mariage de ${config.couple.groom.first} & ${config.couple.bride.first}`,
              startDate: config.date.iso,
              endDate: config.date.endIso,
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              location: {
                "@type": "Place",
                name: pick(config.venue.name, "fr"),
                address: {
                  "@type": "PostalAddress",
                  addressLocality: pick(config.venue.city, "fr"),
                  addressCountry: "TN",
                },
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
