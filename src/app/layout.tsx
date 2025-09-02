import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProvisioningTSEL",
  description: "Provisioning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-sidebar">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full m-0 p-0 bg-sidebar`}
        style={{ 
          overscrollBehavior: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}


