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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://celebrio-digital.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "3ers — Invitations de mariage haute couture",
  description:
    "Des invitations de mariage numériques cousues main : un film d'entrée, vos prénoms en feuille d'or, trois langues, un seul lien à partager.",
  openGraph: {
    title: "3ers — Invitations de mariage haute couture",
    description:
      "Un film d'entrée, vos prénoms en feuille d'or, trois langues, un seul lien à partager.",
    type: "website",
    locale: "fr_TN",
    images: ["/mawazine.jpg"],
  },
  twitter: { card: "summary_large_image" },
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
      <body className="min-h-dvh">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "3ers",
              description:
                "Atelier d'invitations de mariage numériques haute couture — Tunis.",
              url: SITE_URL,
              logo: `${SITE_URL}/logo-gold.png`,
              areaServed: ["TN", "MA", "DZ", "FR"],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
