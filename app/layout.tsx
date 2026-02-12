import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import InteractiveGrid from "@/components/InteractiveGrid";

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
    default: "Mahmud Ahmadov | Software & Full-stack Developer",
    template: "%s | Mahmud Ahmadov",
  },
  description: "Mahmud Ahmadov (zhmdff) is a Software & Full-stack Developer based in Baku, Azerbaijan. Specialist in high-performance systems and minimalist web design.",
  keywords: ["Mahmud Ahmadov", "Mahmud Əhmədov", "Mahmud Ehmedov", "Mahmud", "zhmdff", "backend architect", "full-stack developer", "Baku", "Azerbaijan", "software engineer"],
  authors: [{ name: "Mahmud Ahmadov" }],
  creator: "Mahmud Ahmadov",
  openGraph: {
    type: "website",
    locale: "az_AZ",
    url: "https://zhmdff.com",
    title: "Mahmud Ahmadov | Software & Full-stack Developer",
    description: "Mahmud Ahmadov (zhmdff) - Software & Full-stack Developer in Baku.",
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
    title: "Mahmud Ahmadov | Software & Full-stack Developer",
    description: "Mahmud Ahmadov (zhmdff) - Portfolio of a Software & Full-stack Developer based in Baku.",
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
    alternateName: ["Mahmud Əhmədov", "Mahmud Ehmedov", "Mahmud", "zhmdff"],
    url: "https://zhmdff.com",
    jobTitle: "Software & Full-stack Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Baku",
      addressCountry: "Azerbaijan",
    },
    sameAs: ["https://github.com/zhmdff", "https://linkedin.com/in/mahmud-ahmadov-a57bab261"],
  };

  return (
    <html lang="az" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    // Default to dark or keep saved dark theme
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  // If localStorage fails, default to dark
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <InteractiveGrid />
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
