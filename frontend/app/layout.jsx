import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { AppShell } from "../components/goldnoir/AppShell";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "GoldNoir | Perfumería de lujo",
  description: "Landing page elegante para GoldNoir con catálogo, quiz inteligente, admin y WhatsApp.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${cormorant.variable} ${manrope.variable} bg-black text-stone-100 antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}