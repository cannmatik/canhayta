// app/layout.js

import "./globals.css";
import { Montserrat } from "next/font/google";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// The Schema.org markup is moved here
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "Hayta Hukuk ve Danışmanlık",
  "image": "https://www.haytahukuk.com.tr/logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Örnek Mah. Örnek Cad. No: 123",
    "addressLocality": "İstanbul",
    "addressRegion": "İstanbul",
    "postalCode": "34000",
    "addressCountry": "TR"
  },
  "telephone": "+902121234567",
  "url": "https://www.haytahukuk.com.tr",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  }
};

export const metadata = {
  title: "Hayta Hukuk ve Danışmanlık | Avukatlık ve Hukuki Danışmanlık Hizmetleri",
  description: "Hayta Hukuk ve Danışmanlık, alanında uzman avukatlarla müvekkillerine kapsamlı hukuki danışmanlık ve avukatlık hizmetleri sunar. Aile, ceza, gayrimenkul, miras ve ticaret hukuku başta olmak üzere çeşitli alanlarda güvenilir çözümler için bize ulaşın.",
  keywords: "avukat, hukuk, danışmanlık, avukatlık, İstanbul, hukuk bürosu, ceza hukuku, aile hukuku, miras hukuku, ticaret hukuku",
  authors: [{ name: 'Hayta Hukuk Bürosu' }],
  openGraph: {
    title: 'Hayta Hukuk ve Danışmanlık',
    description: 'Hayta Hukuk, müvekkillerine güvenilir ve etkili hukuki çözümler sunar.',
    url: 'https://www.haytahukuk.com.tr',
    siteName: 'Hayta Hukuk ve Danışmanlık',
    images: [
      {
        url: 'https://www.haytahukuk.com.tr/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hayta Hukuk ve Danışmanlık Logosu',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", rel: "apple-touch-icon" },
    ],
  },
  manifest: "/site.webmanifest",
  // ⚡️ Add the structured data here
  alternates: {
    canonical: 'https://www.haytahukuk.com.tr',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // This is the new way to add structured data
  // See https://nextjs.org/docs/app/api-reference/functions/generate-metadata#json-ld
  jsonLd: localBusinessSchema,
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body
        className={`${montserrat.variable} min-h-screen flex flex-col bg-[#FDF6E3]`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}