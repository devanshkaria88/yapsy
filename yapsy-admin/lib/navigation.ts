import {
  LayoutDashboard,
  Users,
  CreditCard,
  Tag,
  BarChart3,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  children?: { name: string; href: string }[];
  superAdminOnly?: boolean;
}

export const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Promo Codes", href: "/promo-codes", icon: Tag },
  {
    name: "Analytics",
    icon: BarChart3,
    children: [
      { name: "Overview", href: "/analytics" },
      { name: "Retention", href: "/analytics/retention" },
      { name: "Conversion", href: "/analytics/conversion" },
      { name: "Mood & Themes", href: "/analytics/mood" },
    ],
  },
  {
    name: "System",
    icon: Settings,
    children: [
      { name: "Health", href: "/system" },
      { name: "API Costs", href: "/system/costs" },
      { name: "Error Log", href: "/system/errors" },
      { name: "Webhooks", href: "/system/webhooks" },
    ],
  },
  {
    name: "Admin Users",
    href: "/admin-users",
    icon: ShieldCheck,
    superAdminOnly: true,
  },
];
