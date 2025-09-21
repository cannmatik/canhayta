// app/layout.js

import "./globals.css";
import { Montserrat } from "next/font/google";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Head from "next/head";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// Dinamik olarak public klasöründen resim URL'si
const baseUrl = "https://canhayta.vercel.app"; // canlı site URL'si
const logoPath = "/logo.png"; // public klasöründeki logo

// Schema.org markup
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "Hayta Hukuk ve Danışmanlık",
  "image": `${baseUrl}${logoPath}`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Örnek Mah. Örnek Cad. No: 123",
    "addressLocality": "İstanbul",
    "addressRegion": "İstanbul",
    "postalCode": "34000",
    "addressCountry": "TR"
  },
  "telephone": "+902121234567",
  "url": baseUrl,
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
    url: baseUrl,
    siteName: 'Hayta Hukuk ve Danışmanlık',
    images: [
      {
        url: `${baseUrl}${logoPath}`,
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
  alternates: {
    canonical: baseUrl,
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
  jsonLd: localBusinessSchema,
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <Head>
        {/* Open Graph */}
        <meta property="og:title" content="Hayta Hukuk ve Danışmanlık" />
        <meta property="og:description" content="Hayta Hukuk, müvekkillerine güvenilir ve etkili hukuki çözümler sunar." />
        <meta property="og:image" content={`${baseUrl}${logoPath}`} />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hayta Hukuk ve Danışmanlık" />
        <meta name="twitter:description" content="Hayta Hukuk, müvekkillerine güvenilir ve etkili hukuki çözümler sunar." />
        <meta name="twitter:image" content={`${baseUrl}${logoPath}`} />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </Head>
      <body className={`${montserrat.variable} min-h-screen flex flex-col bg-[#FDF6E3]`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
