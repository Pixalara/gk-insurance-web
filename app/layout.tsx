import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import SmoothScroll from "./components/providers/SmoothScroll";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800", "900"],
});

export const metadata: Metadata = {
  title: "GK INSURANCE SOLUTIONS | Authorized Insurance Advisory",
  description: "Vizag's premier destination for bespoke insurance solutions. 20+ years of expertise in general, health, and life insurance.",
  metadataBase: new URL("https://www.gkinsurance.in"),
  icons: {
    icon: "/favicon.ico", // Ensure this is in your /public folder
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "GK INSURANCE SOLUTIONS",
    description: "Protecting your greatest assets in Visakhapatnam.",
    url: "https://www.gkinsurance.in",
    siteName: "GK INSURANCE SOLUTIONS",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${montserrat.variable} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            <SmoothScroll />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}