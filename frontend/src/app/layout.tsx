import type { Metadata, Viewport } from "next";
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
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  preload: false,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
  preload: false,
});

/* ─── Site Defaults ─────────────────────────────────────── */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://adityasahu.dev";
const DEFAULT_TITLE = "Aditya Sahu — Full Stack Developer & AI Engineer";
const DEFAULT_DESCRIPTION =
  "Portfolio of Aditya Sahu — Full Stack Developer, AI Engineer, React Developer, and MERN Stack Developer. Specializing in React.js, Next.js, Node.js, Python, and Machine Learning integrations. Open to internship and freelance opportunities.";
const DEFAULT_KEYWORDS = [
  "Aditya Sahu",
  "Full Stack Developer",
  "AI Developer",
  "AI Engineer",
  "React Developer",
  "MERN Stack Developer",
  "Machine Learning",
  "Artificial Intelligence",
  "Software Developer Portfolio",
  "Freelance Developer",
  "Next.js Developer",
  "Node.js Developer",
  "Python Developer",
  "Web Developer India",
  "Frontend Architect",
  "JavaScript Developer",
  "TypeScript Developer",
  "React.js",
  "Express.js",
  "MongoDB",
];

/* ─── Viewport & Theme (exported separately per Next.js 14+ requirement) ─ */
export const viewport: Viewport = {
  themeColor: "#030718",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ─── Metadata ───────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL &&
    !process.env.NEXT_PUBLIC_API_URL.includes("localhost:5000") &&
    !process.env.NEXT_PUBLIC_API_URL.includes("onrender.com")
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1`
      : "";

  if (!API_BASE_URL) {
    return buildMetadata({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      fullName: "Aditya Sahu",
    });
  }

  try {
    const res = await fetch(`${API_BASE_URL}/personal-info`, {
      next: { revalidate: 3600 }, // revalidate every hour
    });
    if (!res.ok) throw new Error("API failed");
    const json = await res.json();
    const info = json?.data;

    const fullName: string = info?.hero?.fullName || "Aditya Sahu";
    const professionalTitle: string =
      info?.hero?.professionalTitle ||
      "Full Stack Developer & AI Engineer";
    const title = `${fullName} — ${professionalTitle}`;
    const description: string =
      info?.about?.aboutDescription ||
      info?.hero?.heroDescription ||
      DEFAULT_DESCRIPTION;

    return buildMetadata({ title, description, fullName });
  } catch {
    return buildMetadata({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      fullName: "Aditya Sahu",
    });
  }
}

function buildMetadata({
  title,
  description,
  fullName,
}: {
  title: string;
  description: string;
  fullName: string;
}): Metadata {
  return {
    /* ── Base URL (required for relative OG/Twitter images) ── */
    metadataBase: new URL(SITE_URL),

    /* ── Core ──────────────────────────────────────────────── */
    title: {
      default: title,
      template: `%s | ${fullName}`,
    },
    description,
    keywords: DEFAULT_KEYWORDS,
    authors: [{ name: fullName, url: SITE_URL }],
    creator: fullName,
    publisher: fullName,
    generator: "Next.js",
    applicationName: `${fullName} Portfolio`,
    referrer: "origin-when-cross-origin",

    /* ── Canonical ─────────────────────────────────────────── */
    alternates: {
      canonical: "/",
    },

    /* ── Robots ────────────────────────────────────────────── */
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    /* ── Open Graph ────────────────────────────────────────── */
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: `${fullName} Portfolio`,
      title,
      description,
      images: [
        {
          url: "/hero-card.png",
          width: 1200,
          height: 630,
          alt: `${fullName} — Full Stack Developer & AI Engineer Portfolio Preview`,
          type: "image/png",
        },
      ],
    },

    /* ── Twitter / X Cards ─────────────────────────────────── */
    twitter: {
      card: "summary_large_image",
      site: "@adityasahu_dev",
      creator: "@adityasahu_dev",
      title,
      description,
      images: [
        {
          url: "/hero-card.png",
          alt: `${fullName} — Full Stack Developer & AI Engineer Portfolio`,
        },
      ],
    },

    /* ── Verification ──────────────────────────────────────── */
    // Uncomment and populate after verifying in Google / Bing Search Console:
    // verification: {
    //   google: "your-google-site-verification-token",
    //   yandex: "your-yandex-token",
    //   bing: "your-bing-token",
    // },

    /* ── Additional ────────────────────────────────────────── */
    category: "technology",
    classification: "Portfolio",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
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
      dir="ltr"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Preconnect for Google Fonts CDN (fonts already loaded via next/font but this speeds up any dynamic font loading) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/as-logo.png" />
        {/* Additional icon sizes for broader compatibility */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
      </head>
      <body>
        {/* Skip to main content — keyboard accessibility (WCAG 2.1 Level A) */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {/* Noise texture overlay for cinematic depth */}
        <div className="noise-overlay" aria-hidden="true" />
        <QueryProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
