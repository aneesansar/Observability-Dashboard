import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { classNames } from "../../../utils/classNames";
import type { NavItem } from "../../../types/navigation.types";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

type NavListProps = {
  navigation: NavItem[];
  isCollapsed?: boolean;
};

export function NavList({ navigation, isCollapsed = false }: NavListProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    // Auto-expand parent if a child is active
    const expanded: string[] = [];
    navigation.forEach((item) => {
      if (item.children?.some((child) => location.pathname === child.href)) {
        expanded.push(item.name);
      }
    });
    return expanded;
  });

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const renderNavItem = (item: NavItem, isChild = false) => {
    const isActive = location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isChildActive = item.children?.some((child) => location.pathname === child.href);

    return (
      <li key={item.name}>
        {hasChildren ? (
          <>
            <div className="flex items-center">
              <Link
                to={item.href}
                className={classNames(
                  isActive || isChildActive
                    ? "bg-gray-50 text-indigo-600 dark:bg-white dark:text-black"
                    : "text-gray-700 hover:text-white hover:bg-gradient-brand dark:text-black",
                  "group flex flex-1 items-center gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                  isCollapsed ? "justify-center" : ""
                )}
              >
                <item.icon
                  aria-hidden
                  className={classNames(
                    isActive || isChildActive
                      ? "text-indigo-600 dark:text-black"
                      : "text-black group-hover:text-white",
                    "size-6 shrink-0"
                  )}
                />
                {!isCollapsed && (
                  <span className="flex-1">{t(`pagetitle.${item.name}`)}</span>
                )}
              </Link>
              {!isCollapsed && (
                <div className="ml-2">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.name)}
                    className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-gradient-brand"
                  >
                    {isExpanded ? (
                      <ChevronDownIcon className="size-4" aria-hidden />
                    ) : (
                      <ChevronRightIcon className="size-4" aria-hidden />
                    )}
                  </button>
                </div>
              )}
            </div>
            {!isCollapsed && isExpanded && (
              <ul role="list" className="mt-1 space-y-1 pl-6">
                {item.children?.map((child) => renderNavItem(child, true))}
              </ul>
            )}
          </>
        ) : (
          <Link
            to={item.href}
            className={classNames(
              isActive
                ? "bg-gray-50 text-indigo-600 dark:bg-white dark:text-black"
                : "text-gray-700 hover:text-white hover:bg-gradient-brand dark:text-black",
              "group flex items-center gap-x-3 rounded-md p-2 text-sm/6 font-semibold w-full",
              isCollapsed ? "justify-center" : "",
              isChild ? "text-sm" : ""
            )}
          >
            <item.icon
              aria-hidden
              className={classNames(
                isActive
                  ? "text-indigo-600 dark:text-black"
                  : "text-black group-hover:text-white",
                isChild ? "size-5 shrink-0" : "size-6 shrink-0"
              )}
            />
            {!isCollapsed && <span>{t(`pagetitle.${item.name}`)}</span>}
          </Link>
        )}
      </li>
    );
  };

  return (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map((item) => renderNavItem(item))}
    </ul>
  );
}
