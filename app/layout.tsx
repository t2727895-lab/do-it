import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://quilonix.com"),
  title: "Quilonix — AI Automation Agency",
  description:
    "Quilonix is the elite AI automation agency engineering the future. We fuse high-end design with deep-tech architecture to build unstoppable systems.",
  openGraph: {
    images: ["/opengraph.jpg"],
  },
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
