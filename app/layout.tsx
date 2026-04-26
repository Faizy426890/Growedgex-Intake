import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrowEdgeX | Home Health Scheduling & Intake Coordination",
  description:
    "GrowEdgeX provides dedicated remote scheduling and intake coordination for home health agencies. Reduce missed visits, speed up referrals, and cut admin overload.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}