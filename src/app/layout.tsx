import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tacoma Parts Index — 3rd Gen Suspension, Sourced",
  description:
    "Fourteen upper control arms and six shocks for the 2016-2023 Tacoma, every spec sourced or marked as a gap. Answer four questions, get a ranked shortlist, then run the numbers on your own miles.",
  openGraph: {
    title: "Tacoma Parts Index",
    description:
      "Fourteen 3rd gen upper control arms and six shocks, every spec sourced or marked as a gap. Four questions to a shortlist.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/*
          The storage key stays 'uca-theme' after the rename. It predates the shock
          data and renaming it would silently reset dark mode for everyone who has
          already been here, which is a worse trade than a stale key name.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('uca-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
