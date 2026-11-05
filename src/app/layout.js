import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: { default: "StudioSpace | Rent creative studios by the hour", template: "%s | StudioSpace" },
  description: "StudioSpace is a peer-to-peer marketplace where creators book photo studios, sound stages, podcast rooms, music suites and art workshops by the hour.",
};

// Runs before the page paints, so the saved theme never flashes
const themeScript = `try{var t=localStorage.getItem("studio-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"studiodark":"studiolight"}document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="studiolight" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
