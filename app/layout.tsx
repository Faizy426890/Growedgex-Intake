import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* ─── FONTS ─── */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* ─── SITE CONFIG ─── */
const SITE = {
  name:        "GrowEdgeX",
  url:         "https://www.growedgex.com",
  phone:       "+14699292524",
  email:       "info@growedgex.com",
  title:       "GrowEdgeX | Home Health Scheduling & Intake Coordination",
  description:
    "GrowEdgeX provides dedicated remote scheduling and intake coordination built exclusively for home health agencies. Reduce missed visits, speed up referrals, and cut admin overload — starting day one.",
  keywords: [
    "home health scheduling agency",
    "remote intake coordination",
    "SOC scheduling service",
    "home health back office support",
    "clinician visit coordination",
    "referral intake processing",
    "home health agency staffing",
    "EMR scheduling support",
    "GrowEdgeX",
  ],
  ogImage:        "https://www.growedgex.com/og-image.jpg",
  twitterHandle:  "@GrowEdgeX",
};

/* ─── VIEWPORT (separate export — Next.js 14+) ─── */
export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor:   "#4451f4",
};

/* ─── METADATA ─── */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),

  /* ── Title ── */
  title: {
    default:  SITE.title,
    template: `%s | ${SITE.name}`,
  },

  /* ── Core ── */
  description:      SITE.description,
  keywords:         SITE.keywords,
  authors:          [{ name: SITE.name, url: SITE.url }],
  creator:          SITE.name,
  publisher:        SITE.name,
  applicationName:  SITE.name,

  /* ── Canonical ── */
  alternates: {
    canonical: "/",
  },

  /* ── Robots ── */
  robots: {
    index:   true,
    follow:  true,
    nocache: false,
    googleBot: {
      index:              true,
      follow:             true,
      noimageindex:       false,
      "max-video-preview":  -1,
      "max-image-preview":  "large",
      "max-snippet":        -1,
    },
  },

  /* ── Open Graph ── */
  openGraph: {
    type:        "website",
    url:         SITE.url,
    title:       SITE.title,
    description: SITE.description,
    siteName:    SITE.name,
    locale:      "en_US",
    images: [
      {
        url:    SITE.ogImage,
        width:  1200,
        height: 630,
        alt:    "GrowEdgeX — Home Health Scheduling & Intake Coordination",
      },
    ],
  },

  /* ── Twitter / X ── */
  twitter: {
    card:        "summary_large_image",
    site:        SITE.twitterHandle,
    creator:     SITE.twitterHandle,
    title:       SITE.title,
    description: SITE.description,
    images:      [SITE.ogImage],
  },

  /* ── Google Search Console verification ── */
  verification: {
    google: "REPLACE_WITH_GSC_TOKEN",
  },

  /* ── Apple / PWA ── */
  appleWebApp: {
    capable:         true,
    statusBarStyle:  "default",
    title:           SITE.name,
  },
  formatDetection: {
    telephone: true,
    email:     true,
    address:   true,
  },
};

/* ─── JSON-LD SCHEMAS ─── */

const organizationSchema = {
  "@context": "https://schema.org",
  "@type":    "Organization",
  name:       SITE.name,
  url:        SITE.url,
  logo:       `${SITE.url}/logo.png`,
  description: SITE.description,
  email:      SITE.email,
  telephone:  SITE.phone,
  address: {
    "@type":          "PostalAddress",
    addressLocality:  "Dallas",
    addressRegion:    "TX",
    addressCountry:   "US",
  },
  contactPoint: [
    {
      "@type":           "ContactPoint",
      telephone:         SITE.phone,
      contactType:       "customer service",
      availableLanguage: "English",
      areaServed:        "US",
    },
  ],
  sameAs: [
    "https://www.linkedin.com/company/growedgex",
    "https://twitter.com/growedgex",
  ],
};

const localBusinessSchema = {
  "@context":  "https://schema.org",
  "@type":     "LocalBusiness",
  "@id":       `${SITE.url}/#business`,
  name:        SITE.name,
  url:         SITE.url,
  telephone:   SITE.phone,
  email:       SITE.email,
  description: SITE.description,
  priceRange:  "$$",
  areaServed: {
    "@type": "Country",
    name:    "United States",
  },
  address: {
    "@type":          "PostalAddress",
    addressLocality:  "Dallas",
    addressRegion:    "TX",
    postalCode:       "75201",
    addressCountry:   "US",
  },
  openingHoursSpecification: [
    {
      "@type":    "OpeningHoursSpecification",
      dayOfWeek:  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens:      "08:00",
      closes:     "18:00",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type":    "Service",
  name:       "Home Health Scheduling & Intake Coordination",
  provider: {
    "@type": "Organization",
    name:    SITE.name,
    url:     SITE.url,
  },
  serviceType:  "Medical Administrative Service",
  areaServed: {
    "@type": "Country",
    name:    "United States",
  },
  description:
    "Dedicated remote scheduling, SOC coordination, referral intake, clinician management, documentation tracking, and patient communication for home health agencies.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name:    "Home Health Coordination Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type":      "Service",
          name:         "Scheduling & Visit Coordination",
          description:  "SOC, revisit, recertification, and discharge scheduling with real-time calendar management.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type":      "Service",
          name:         "Intake & Referral Coordination",
          description:  "Referral intake processing, patient onboarding, and insurance authorization coordination.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type":      "Service",
          name:         "Agency & Clinician Coordination",
          description:  "Coordination with DONs, case managers, and field staff with proactive daily communication.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type":      "Service",
          name:         "Documentation & EMR Tracking Support",
          description:  "Monitoring overdue notes, SOC tracking, cancellation logs, and EMR update support.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type":      "Service",
          name:         "Patient Communication Support",
          description:  "Appointment confirmations, schedule reminders, and change notifications to reduce no-shows.",
        },
      },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name:    "What is home health scheduling coordination?",
      acceptedAnswer: {
        "@type": "Answer",
        text:    "Home health scheduling coordination is the management of patient visit schedules, clinician assignments, intake referrals, and EMR documentation for home health agencies. Dedicated coordinators ensure visits are confirmed, conflicts are resolved, and referrals are processed quickly.",
      },
    },
    {
      "@type": "Question",
      name:    "How quickly can GrowEdgeX integrate with my agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text:    "GrowEdgeX typically integrates within days, not months. We learn your EMR system, team channels, and scheduling workflows during a custom setup phase so your dedicated coordinator can begin managing schedules immediately.",
      },
    },
    {
      "@type": "Question",
      name:    "Does GrowEdgeX work with my existing EMR system?",
      acceptedAnswer: {
        "@type": "Answer",
        text:    "Yes. GrowEdgeX coordinators are trained to work inside your existing EMR platform — whether that is Kinnser, MatrixCare, WellSky, Homecare Homebase, or others — so there is no need to switch software.",
      },
    },
    {
      "@type": "Question",
      name:    "Is there a long-term contract required?",
      acceptedAnswer: {
        "@type": "Answer",
        text:    "No. GrowEdgeX does not require long-term contracts. You can scale support up or down as your patient census changes without the commitment of hiring full-time staff.",
      },
    },
    {
      "@type": "Question",
      name:    "What types of home health agencies does GrowEdgeX serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text:    "GrowEdgeX serves home health agencies of all sizes — from small independent agencies to multi-location operations — including skilled nursing, therapy staffing (PT, OT, ST), and general home health care providers across the United States.",
      },
    },
  ],
};

const websiteSchema = {
  "@context":  "https://schema.org",
  "@type":     "WebSite",
  url:         SITE.url,
  name:        SITE.name,
  description: SITE.description,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type":    "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",     item: SITE.url },
    { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/#services` },
    { "@type": "ListItem", position: 3, name: "Contact",  item: `${SITE.url}/#cta` },
  ],
};

const schemas = [
  organizationSchema,
  localBusinessSchema,
  serviceSchema,
  faqSchema,
  websiteSchema,
  breadcrumbSchema,
];

/* ─── ROOT LAYOUT ─── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect — avoids render-blocking font requests */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicons */}
        <link rel="icon"             href="/favicon.ico" sizes="any" />
        <link rel="icon"             href="/icon.svg"    type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest"         href="/site.webmanifest" />

        {/* Hero image preload — improves LCP score */}
        <link
          rel="preload"
          as="image"
          href="https://cdn.prod.website-files.com/646676446cb9dc8974098e5d/68dfe523cf88621047bfa804_thumbnail.jpeg"
          // @ts-expect-error — fetchpriority is valid but not yet in React types
          fetchpriority="high"
        />

        {/* JSON-LD Structured Data */}
        {schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>

      <body className="min-h-full flex flex-col">
        {/*
          Skip navigation — first focusable element on the page.
          Improves keyboard accessibility AND helps Googlebot
          identify the main content landmark directly.
        */}
        <a
          href="#main-content"
          className="
            sr-only focus:not-sr-only
            focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
            focus:px-5 focus:py-3 focus:rounded-lg
            focus:bg-[#4451f4] focus:text-white focus:font-bold
            focus:shadow-lg focus:outline-none
          "
        >
          Skip to main content
        </a>

        {children}
      </body>
    </html>
  );
}