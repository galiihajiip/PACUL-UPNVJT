import type { Metadata } from "next";
import StepTrackerClient from "./StepTrackerClient";

export const metadata: Metadata = {
  title: "Langkah Hijau — PACUL",
  description: "Lacak langkah kakimu secara real-time dan konversi ke penghematan karbon",
};

export default function StepTrackerPage() {
  return <StepTrackerClient />;
}
