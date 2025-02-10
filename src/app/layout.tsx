//src\app\layout.tsx
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Fragments/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";

// import Footer from "@/components/Footer/Footer";
// import HashModal from "@/components/Modal/HashModal";
import AuthProviders from "@/components/ClientWrapper";
export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "NKS Gift",
    template: "NKS Gift | %s ",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  description: "The Online Shop for NKS Gift",
  authors: [{ name: "Seira", url: process.env.DOMAIN }],
  openGraph: {
    title: "NKS Gift",
    type: "website",
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        ></link>
      </head>
      <body className={(poppins.className, "bg-black/95")}>
        <AuthProviders>
          <Navbar />
          {children}
          {/* {<HashModal />} */}
          {/* <Footer /> */}
          <SpeedInsights />
        </AuthProviders>
      </body>
    </html>
  );
}
