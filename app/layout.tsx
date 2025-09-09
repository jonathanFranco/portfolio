import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Archivo, Inter_Tight, JetBrains_Mono } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jonathan Franco — Desenvolvedor Front-End Sênior",
  description:
    "Portais de suporte, governo e educação em React, Vue e Angular. Portfólio de Jonathan Franco, desenvolvedor front-end em Fortaleza, Brasil.",
  authors: [
    { name: "Jonathan Franco", url: "https://jonfr-portfolio.netlify.app/" },
  ],
  keywords: [
    "Jonathan Franco",
    "Desenvolvedor Front-End",
    "Front-End Sênior",
    "Portfólio",
    "React",
    "Next.js",
    "Vue",
    "Nuxt",
    "Angular",
    "TypeScript",
    "Design System",
    "Acessibilidade",
    "Performance Web",
    "Fortaleza",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body
        className={`font-sans ${archivo.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
      >
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
