import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL('https://zhmdff.com'),
  title: {
    default: "zhmdff | Backend Architect & Full-stack Developer",
    template: "%s | zhmdff"
  },
  description: "Minimalist portfolio of zhmdff, a backend architect and full-stack developer based in Baku. Specialist in high-performance backend systems and modern full-stack applications.",
  keywords: ["zhmdff", "backend architect", "full-stack developer", "Baku", "Azerbaijan", "Next.js", "C#", "Node.js", "web development"],
  authors: [{ name: "zhmdff" }],
  creator: "zhmdff",
  openGraph: {
    type: "website",
    locale: "az_AZ",
    url: "https://zhmdff.com",
    title: "zhmdff | Backend Architect & Full-stack Developer",
    description: "Minimalist portfolio of zhmdff, a backend architect and full-stack developer based in Baku.",
    siteName: "zhmdff Portfolio",
    images: [
      {
        url: "/icon.jpg",
        width: 1200,
        height: 630,
        alt: "zhmdff Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "zhmdff | Backend Architect & Full-stack Developer",
    description: "Minimalist portfolio of zhmdff, a backend architect and full-stack developer based in Baku.",
    images: ["/icon.jpg"],
    creator: "@zhmdff",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
  return (
    <html lang="az" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
