import "./globals.css";

export const metadata = {
  title: "Telegram Video Stream",
  description: "Send a video to your Telegram bot and stream it on the site."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}