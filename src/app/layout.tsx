import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Manoj Kumar Sharma | Security Analyst & Cybersecurity Professional",
  description: "Portfolio of Manoj Kumar Sharma, Security Analyst specializing in Vulnerability Assessment, Threat Detection, Incident Response, and Security Monitoring.",
  keywords: ["Security Analyst", "SOC Analyst", "Cybersecurity Portfolio", "Threat Detection", "Incident Response", "Penetration Tester", "Google Certified Cybersecurity Professional"],
};

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Crucial for iOS/Android safe area blending
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-soc-background text-foreground antialiased selection:bg-soc-accent/30 selection:text-soc-accent",
          spaceGrotesk.variable,
          inter.variable,
          jetbrainsMono.variable
        )}
      >
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <main className="relative flex min-h-screen flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          {children}
        </main>
        <Script src="https://platform.linkedin.com/badges/js/profile.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
