import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css"; 
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer"; 

const inter = Inter({ subsets: ["latin"] }); 

export const metadata: Metadata = {
  title: "Nosso Casamento",
  description: "Venha celebrar conosco o nosso grande dia!",
  keywords: "casamento, wedding, celebração",
  robots: "index, follow"
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#8B3A62" />
        <link rel="preload" href="/Background.png" as="image" />
      </head>
      <body className={inter.className}>
        <div className="main-container">
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}