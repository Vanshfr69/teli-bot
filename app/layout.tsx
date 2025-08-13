import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "TG Stream — Premium",
  description: "Send a video to your Telegram bot and stream it instantly on the site."
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
