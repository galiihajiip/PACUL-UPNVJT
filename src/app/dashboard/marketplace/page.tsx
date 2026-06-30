import type { Metadata } from "next";
import MarketplaceClient from "./MarketplaceClient";

export const metadata: Metadata = {
  title: "Green Marketplace — PACUL",
  description: "Tukarkan EcoPoints kamu dengan reward nyata dari partner PACUL",
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
