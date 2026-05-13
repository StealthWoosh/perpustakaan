import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Perpustakaan Sekolah | Sistem Manajemen Buku",
  description: "Sistem manajemen perpustakaan sekolah digital",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
