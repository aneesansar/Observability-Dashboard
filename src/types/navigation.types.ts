import type { ComponentType } from "react";

export type IconType = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

export type NavItem = {
  name: string;
  href: string;
  icon: IconType;
  current?: boolean;
  children?: NavItem[];
};

export type TeamItem = {
  id: number | string;
  name: string;
  href: string;
  initial: string;
  current?: boolean;
};
