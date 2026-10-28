import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "rabi — Find your way",
  description: "A fresh approach to getting around. Rabi is building a smarter mobility experience for Nigeria.",
  applicationName: "rabi",
  themeColor: "#6d42e8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
