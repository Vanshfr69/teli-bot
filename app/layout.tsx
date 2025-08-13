
import './globals.css';

export const metadata = {
  title: 'Telegram Video Stream',
  description: 'Stream Telegram videos sent to your bot',
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
