import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import TransitionProvider from "./transition-provider";
import ScrollToTop from "@/components/ScrollToTop";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineVita",
  description: "AI-powered movie discovery",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.png",
    apple: [
      { url: "/favicon.png", sizes: "180x180" },
    ],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cinevita.netlify.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CineVita — AI-powered movie discovery",
    description: "Discover films with chic UI, smart recommendations, and curated lists.",
    url: "/",
    siteName: "CineVita",
    images: [
      { url: "/favicon.png", width: 1200, height: 630, alt: "CineVita" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineVita",
    description: "AI-powered movie discovery",
    images: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CineVita" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="192x192" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://www.omdbapi.com" />
        <link rel="dns-prefetch" href="https://www.omdbapi.com" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* JSON-LD: Organization + Website SearchAction */}
        <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "CineVita",
            "url": (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
            "logo": "/favicon.png",
          })
        }} />
        <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
            "name": "CineVita",
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })
        }} />
        <Providers>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main className="container mx-auto px-4 pb-16 pt-6">
            <TransitionProvider>
              {children}
            </TransitionProvider>
          </main>
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
