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
  title: "LinkMint - Turn Your Links Into Revenue",
  description:
    "Shorten URLs, add monetization steps, and earn revenue from every click. The modern link monetization platform.",
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
