import "./globals.css";
import { Montserrat } from "next/font/google";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Hayta Hukuk ve Danışmanlık",
  description: "Hukuk danışmanlığı ve avukatlık hizmetleri",
  icons: {
    icon: "/favicon.ico", // favicon burada tanımlandı
  },
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
