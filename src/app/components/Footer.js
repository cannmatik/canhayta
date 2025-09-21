import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[--primary-gold] text-[--secondary-brown] py-2 mt-2 text-sm">
      <div className="max-w-7xl mx-auto px-2 text-center space-y-0.5">
        <p>© {new Date().getFullYear()} Av. Hüseyin Can Hayta. Tüm hakları saklıdır.</p>
        <Link
          href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x14cab9ab76e30bcd:0x42c8ab10f7fa01a5?sa=X&ved=1t:8290&ictx=111"
          target="_blank"
          className="underline hover:text-[--secondary-brown] text-sm"
        >
          Toraman İş Hanı, Osmanağa, Kuşdili Cd. No:43 Kat:1 Büro:1, 34714 Kadıköy/İstanbul
        </Link>
      </div>
    </footer>
  );
}
