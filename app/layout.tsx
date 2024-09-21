import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rate My Course",
  description: "A platform for students to rate and review their courses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-orange-100 text-black flex flex-col min-h-screen"}>
        <Navbar />
        <section className="flex-grow flex flex-col justify-center">
          {
            children
          }
        </section>
        
        <Footer />
      </body>
    </html>
  );
}
