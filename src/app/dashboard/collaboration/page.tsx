import type { Metadata } from "next";
import CollaborationPageClient from "./CollaborationPageClient";

export const metadata: Metadata = {
  title: "Collaboration Wall — PACUL",
  description: "Bagikan ide hijau, ikuti gerakan komunitas, dan berkolaborasi bersama aktivis lingkungan di Jawa Timur.",
};

export default function CollaborationPage() {
  return <CollaborationPageClient />;
}
