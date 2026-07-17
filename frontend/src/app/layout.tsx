import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";


/* ─── Fonts ─────────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

/* ─── Metadata ───────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  try {
    const res = await fetch(`${API_BASE_URL}/personal-info`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("API failed");
    const json = await res.json();
    const info = json?.data;
    const fullName = info?.hero?.fullName || "Aditya Sahu";
    const title = `${fullName} — ${info?.hero?.professionalTitle || "Software Developer & Frontend Architect"}`;
    const description = info?.about?.aboutDescription || "Cinematic developer portfolio.";
    return {
      title,
      description,
      keywords: [
        fullName,
        "Software Developer",
        "Frontend Architect",
        "React",
        "Python",
        "AI Integration",
        "Web Development",
      ],
      authors: [{ name: fullName }],
      creator: fullName,
      openGraph: {
        type: "website",
        title,
        description,
        siteName: `${fullName} Portfolio`,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (err) {
    return {
      title: "Aditya Sahu — Software Developer & Frontend Architect",
      description:
        "Portfolio of Aditya Sahu — Software Developer and Frontend Architect specializing in Python, React, AI API Integrations, and Web Environments.",
      keywords: [
        "Aditya Sahu",
        "Software Developer",
        "Frontend Architect",
        "React",
        "Python",
        "AI Integration",
        "Web Development",
      ],
      authors: [{ name: "Aditya Sahu" }],
      creator: "Aditya Sahu",
      openGraph: {
        type: "website",
        title: "Aditya Sahu — Software Developer & Frontend Architect",
        description: "Cinematic developer portfolio.",
        siteName: "Aditya Sahu Portfolio",
      },
      twitter: {
        card: "summary_large_image",
        title: "Aditya Sahu — Software Developer & Frontend Architect",
        description: "Cinematic developer portfolio.",
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

/* ─── Root Layout ────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body>
        {/* Noise texture overlay for cinematic depth */}
        <div className="noise-overlay" aria-hidden="true" />
        <QueryProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
