import type { Metadata } from "next";
import "@/app/globals.css";
import { ScrollRestoration } from "@/components/shared/ScrollRestoration";

export const metadata: Metadata = {
  title: "Hey-Oko | Design Portfolio",
  description: "The pure unadulterated design portfolio of Ngatye Brian Oko",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ScrollRestoration />
        {children}
      </body>
    </html>
  );
}
