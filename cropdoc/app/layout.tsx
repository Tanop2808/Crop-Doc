import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CropDoc — AI Crop Disease Detector",
  description: "Upload a photo of your crop and get AI-powered diagnosis and precise treatment advice in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
