import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Hayta Hukuk ve Danışmanlık",
  description: "Hukuk danışmanlığı ve avukatlık hizmetleri",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
