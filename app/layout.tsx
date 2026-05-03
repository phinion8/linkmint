import type { Metadata } from "next";
import { Poppins, Fira_Code } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkMint | Free URL Shortener That Pays You",
  description:
    "LinkMint is a free URL shortener that pays you for every click. Shorten links, track analytics, and earn money instantly. Sign up free today.",
  other: {
    "admaven-placement": "Bqjs6qTgG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className={`${poppins.className} min-h-full flex flex-col bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
