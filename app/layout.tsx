import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zhmdff.com"),
  title: {
    default: "Mahmud Ahmadov | Backend Architect & Full-stack Developer",
    template: "%s | Mahmud Ahmadov",
  },
  description: "Mahmud Ahmadov (zhmdff) is a Backend Architect and Full-stack Developer based in Baku, Azerbaijan. Specialist in high-performance systems and minimalist web design.",
  keywords: ["Mahmud Ahmadov", "Mahmud Əhmədov", "Mahmud Ehmedov", "Mahmud", "zhmdff", "backend architect", "full-stack developer", "Baku", "Azerbaijan", "software engineer"],
  authors: [{ name: "Mahmud Ahmadov" }],
  creator: "Mahmud Ahmadov",
  openGraph: {
    type: "website",
    locale: "az_AZ",
    url: "https://zhmdff.com",
    title: "Mahmud Ahmadov | Backend Architect & Full-stack Developer",
    description: "Mahmud Ahmadov (zhmdff) - Backend Architect and Full-stack Developer in Baku.",
    siteName: "Mahmud Ahmadov Portfolio",
    images: [
      {
        url: "/icon.jpg",
        width: 1200,
        height: 630,
        alt: "Mahmud Ahmadov - Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahmud Ahmadov | Backend Architect & Full-stack Developer",
    description: "Mahmud Ahmadov (zhmdff) - Portfolio of a Backend Architect based in Baku.",
    images: ["/icon.jpg"],
    creator: "@zhmdff",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mahmud Ahmadov",
    alternateName: ["Mahmud Əhmədov", "Mahmud Ehmedov", "zhmdff"],
    url: "https://zhmdff.com",
    jobTitle: "Backend Architect & Full-stack Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Baku",
      addressCountry: "Azerbaijan",
    },
    sameAs: ["https://github.com/zhmdff", "https://linkedin.com/in/mahmud-ahmadov-a57bab261"],
  };

  return (
    <html lang="az" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
