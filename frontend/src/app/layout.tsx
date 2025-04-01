import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Import Poppins
import Header from "@/components/Header"; // Import Header
import Footer from "@/components/Footer"; // Import Footer
import "./globals.css";

// Configure Poppins font
const poppins = Poppins({
  weight: ["400", "500", "600", "700"], // Include desired weights
  subsets: ["latin"],
  display: "swap", // Improve font loading performance
  variable: "--font-poppins", // Define CSS variable
});

export const metadata: Metadata = {
  title: "CrownKing", // Update site title
  description: "CrownKing - Premium Men's Jewellery", // Update site description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="flex flex-col min-h-screen antialiased bg-brand-cream">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
