"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { title: "Ana Sayfa", href: "/" },
    { title: "Hakkımızda", href: "/hakkinda" },
    { title: "Hizmetler", href: "/hizmetler" },
    { title: "Makaleler", href: "/makaleler" },
    { title: "İletişim", href: "/contact" },
  ];

  const bgColor = "bg-[#FFF9EB]"; // Mevcut #FFF5E0 yerine hafif daha açık ton
  const textColor = "text-[#6B4E31]";
  const hoverColor = "hover:text-[#D4A017]";
  const activeClass = "font-bold shadow-md";

  const isActiveLink = (href) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-50 ${bgColor} shadow-md backdrop-blur-sm`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={69}
            height={69}
            className="transition-transform duration-300 hover:scale-110"
          />
        </Link>

        <div className="hidden md:flex gap-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2 py-1 rounded-md transition-all duration-300 ${textColor} ${hoverColor} ${
                isActiveLink(item.href) ? activeClass : "font-medium"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="md:hidden">
          <button
            type="button"
            className={`${textColor} p-2 ${hoverColor}`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <Dialog
            as="div"
            className="md:hidden fixed inset-0 z-50"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className={`fixed top-0 right-0 h-full w-full max-w-sm ${bgColor} shadow-xl flex flex-col p-6`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-8">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={60}
                  height={60}
                  className="transition-transform duration-300 hover:scale-110"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${textColor} p-2 ${hoverColor}`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-md transition-all duration-300 ${textColor} ${hoverColor} ${
                      isActiveLink(item.href) ? activeClass : "font-medium"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </header>
  );
}
