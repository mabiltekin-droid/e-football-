import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EFootball Lig",
  description: "EFootball Mobile Lig Sayfası",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 animate-fadeIn">
          {children}
        </main>
        <footer className="bg-[#0a0a18] border-t border-[#D4AF37]/10 text-center py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">👑</span>
              <p className="text-sm font-medium text-[#D4AF37]/60">&copy; 2026 EFootball Lig &bull; Tüm hakları saklıdır</p>
              <p className="text-xs text-[#D4AF37]/30">Premium Football League Platform</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
