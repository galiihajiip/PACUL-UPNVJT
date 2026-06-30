import {
  LayoutDashboard,
  Activity,
  Zap,
  Footprints,
  ShoppingBag,
  Trash2,
  Map,
  Users,
  User,
} from "lucide-react";

export const DASHBOARD_NAV = [
  { href: "/dashboard",                label: "Dashboard",       icon: LayoutDashboard, exact: true  },
  { href: "/dashboard/tracker",        label: "Carbon Tracker",  icon: Activity,        exact: false },
  { href: "/dashboard/eco-action",     label: "EcoAction",       icon: Zap,             exact: false },
  { href: "/dashboard/step-tracker",   label: "Langkah Hijau",   icon: Footprints,      exact: false, live: true },
  { href: "/dashboard/marketplace",    label: "Green Market",    icon: ShoppingBag,     exact: false },
  { href: "/dashboard/laporan-sampah", label: "Laporan Sampah",  icon: Trash2,          exact: false },
  { href: "/dashboard/map",            label: "Impact Map",      icon: Map,             exact: false },
  { href: "/dashboard/collaboration",  label: "Collaboration",   icon: Users,           exact: false },
  { href: "/dashboard/profile",        label: "Profil",          icon: User,            exact: false },
] as const;

export const PUBLIC_NAV = [
  { href: "/",                         label: "Home"        },
  { href: "/dashboard/tracker",        label: "Tracker"     },
  { href: "/dashboard/eco-action",     label: "EcoAction"   },
  { href: "/dashboard/step-tracker",   label: "Langkah Hijau" },
  { href: "/dashboard/map",            label: "Impact Map"  },
  { href: "/dashboard/collaboration",  label: "Kolaborasi"  },
] as const;
