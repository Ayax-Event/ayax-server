import "./globals.css";

export const metadata = {
  title: "Ayax System",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/ayax-logo.png" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
