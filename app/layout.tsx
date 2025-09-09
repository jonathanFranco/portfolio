import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type React from "react";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jonathan Franco - Front-End Developer",
  description: "Portfólio de Jonathan Franco, desenvolvedor front-end.",
  authors: [
    { name: "Jonathan Franco", url: "https://jonfr-portfolio.netlify.app/" },
  ],
  keywords: [
    "Jonathan Franco",
    "Desenvolvedor Front-End",
    "Portfólio",
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "Desenvolvimento Web",
    "CSS",
    "HTML",
    "Tailwind CSS",
    "Desenvolvedor de Software",
    "Programador",
    "Freelancer",
    "Tecnologia",
    "Inovação",
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
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
