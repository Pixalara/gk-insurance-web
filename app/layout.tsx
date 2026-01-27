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
  // Updated to match your official uppercase brand name
  title: "GK INSURANCE SOLUTIONS | Authorized Insurance Advisory",
  description: "Vizag's premier destination for bespoke insurance solutions. With 20+ years of expertise, we protect your greatest assets with reliable general, health, and life insurance.",
  metadataBase: new URL("https://www.gkinsurance.in"),
  
  // Professional Favicon Configuration
  icons: {
    icon: "/favicon.ico", // Points to your new umbrella icon in the public folder
    shortcut: "/favicon.ico",
    apple: "/favicon.ico", // Ensures the umbrella icon appears on iPhone home screens
  },

  alternates: {
    canonical: "/",
  },
  
  openGraph: {
    title: "GK INSURANCE SOLUTIONS",
    description: "Reliable general insurance solutions for your assets in Visakhapatnam.",
    url: "https://www.gkinsurance.in",
    siteName: "GK INSURANCE SOLUTIONS",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* FontAwesome for the UI icons used in Navbar and Footer */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        className={`${montserrat.variable} font-sans antialiased bg-white text-slate-900`}
        suppressHydrationWarning
      >
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