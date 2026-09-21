import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "MONROE Luxury Restobar | Alta Cocina de Autor & Coctelería Contemporánea • Chimbote",
  description: "Experiencia gastronómica de autor en Chimbote, Perú. Pastas frescas artesanales, cortes Prime Dry-Aged 45 días, coctelería sensorial y carta digital interactiva en 3D/AR.",
  keywords: [
    "Monroe Restobar",
    "Restobar Chimbote",
    "Pastas artesanales Chimbote",
    "Cortes de carne Wagyu Perú",
    "Coctelería de autor Chimbote",
    "Carta digital interactiva 3D",
    "Restaurante de lujo Chimbote",
    "Malecón Chimbote gastronomía"
  ],
  authors: [{ name: "Monroe Culinary Group" }],
  openGraph: {
    title: "MONROE Luxury Restobar | Chimbote, Perú",
    description: "La cumbre de la alta cocina y coctelería contemporánea frente a la brisa de Chimbote. Explora nuestra carta digital 3D y reserva tu mesa VIP.",
    url: "https://monroerestobar.pe",
    siteName: "MONROE Restobar",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
        width: 1200,
        height: 630,
        alt: "Monroe Luxury Restobar - Tomahawk Gold Edition",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0A0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="bg-obsidian-900 text-ivory antialiased min-h-screen relative selection:bg-gold-500 selection:text-obsidian-900">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
