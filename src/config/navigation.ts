import {
  ClockIcon,
  Squares2X2Icon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import type { NavItem } from "../types/navigation.types";

export const navigation: NavItem[] = [
  {
    name: "Observability",
    href: "/observability",
    icon: CogIcon,
    current: true,
    children: [
      {
        name: "Dashboard",
        href: "/observability/dashboard",
        icon: Squares2X2Icon,
        current: false,
      },
      {
        name: "Metrics",
        href: "/observability/metrics",
        icon: ChartBarIcon,
        current: false,
      },
      {
        name: "Logs",
        href: "/logs",
        icon: DocumentTextIcon,
        current: false,
      },
      {
        name: "Traces",
        href: "/traces",
        icon: ClockIcon,
        current: false,
      },
    ],
  },
];

export default navigation;
