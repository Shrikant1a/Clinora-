import type { Metadata } from "next";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#8B1E3F",
};

export const metadata: Metadata = {
  title: "Clinora: Appointments That Book Themselves | WhatsApp AI Scheduling",
  description:
    "Clinora is a per-clinic one-time setup (Rs. 25,000) that automates your appointment lifecycle over WhatsApp, n8n, Google Calendar, and Sheets with zero double bookings.",
  keywords: [
    "clinora",
    "clinic automation",
    "whatsapp appointment booking",
    "n8n clinic workflow",
    "google calendar doctor scheduling",
    "doctor whatsapp bot",
    "medical practice automation india",
  ],
  authors: [{ name: "Clinora Team" }],
  openGraph: {
    title: "Clinora: Appointments That Book Themselves",
    description: "Save 6 hours of receptionist stress daily. Turnkey WhatsApp scheduling pipeline.",
    url: "https://clinora.com",
    siteName: "Clinora",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
