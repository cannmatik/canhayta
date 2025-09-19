// src/app/makaleler/[seo_slug]/page.jsx
import React from "react";
import MakaleGoruntuleClient from "./MakaleGoruntuleClient";

/**
 * Next.js 15: params artık Promise döner.
 * Server Component'ta await ile unwrap ediyoruz.
 * Kaynak: https://nextjs.org/docs/messages/sync-dynamic-apis
 */
export default async function Page({ params }) {
  const { seo_slug } = await params;
  return <MakaleGoruntuleClient seo_slug={seo_slug} />;
}