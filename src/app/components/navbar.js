"use client";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </div>

          {/* Menü (Desktop) */}
          <div className="hidden md:flex md:space-x-8 items-center">
            <a href="/" className="text-black hover:text-[--primary-gold]">Ana Sayfa</a>
            <a href="/about" className="text-black hover:text-[--primary-gold]">Hakkımızda</a>
            <a href="/services" className="text-black hover:text-[--primary-gold]">Hizmetler</a>
            <a href="/contact" className="text-black hover:text-[--primary-gold]">İletişim</a>
          </div>

          {/* Hamburger Menü (Mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-[--primary-gold] focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menü */}
      {open && (
        <div className="md:hidden bg-white/90 py-4 space-y-2 text-center">
          <a href="/" className="block text-black hover:text-[--primary-gold] py-2">Ana Sayfa</a>
          <a href="/about" className="block text-black hover:text-[--primary-gold] py-2">Hakkımızda</a>
          <a href="/services" className="block text-black hover:text-[--primary-gold] py-2">Hizmetler</a>
          <a href="/contact" className="block text-black hover:text-[--primary-gold] py-2">İletişim</a>
        </div>
      )}
    </nav>
  );
}