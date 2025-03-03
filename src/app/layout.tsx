import type { Metadata } from "next";
import "@/app/globals.css";

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
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
