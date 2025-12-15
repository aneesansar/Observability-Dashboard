import { NavList } from "./NavList";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { classNames } from "../../../utils/classNames";
import LogoWhite from "../../../assets/Logo_White.svg";
import navigation from "../../../config/navigation";

export type DesktopSidebarProps = {
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
};

export default function DesktopSidebar({
  isCollapsed = false,
  onToggleCollapse,
}: DesktopSidebarProps) {
  const { t } = useTranslation();
  const widthClass = isCollapsed ? "lg:w-16" : "lg:w-56";

  return (
    <div
      className={classNames(
        "hidden lg:fixed lg:left-0 lg:inset-y-0 lg:z-50 lg:flex lg:flex-col dark:bg-platinum",
        widthClass
      )}
    >
      <div
        className={classNames(
          "flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-platinum dark:border-white/10 dark:bg-black/10",
          isCollapsed ? "px-2" : "px-6"
        )}
      >
        <div
          className={classNames(
            "flex h-16 shrink-0 items-center",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <div
            className={classNames(
              "flex items-center gap-2",
              isCollapsed ? "hidden" : ""
            )}
          >
            <img
              alt={t('accessibility.logo')}
              src={LogoWhite}
              className={classNames(
                "h-20 w-auto",
                isCollapsed ? "hidden" : "block"
              )}
            />
          </div>
          <button
            type="button"
            title={isCollapsed ? t('nav.expand_sidebar') : t('nav.collapse_sidebar')}
            onClick={() => onToggleCollapse?.(!isCollapsed)}
            className="inline-flex items-center justify-center rounded-md p-1 ring-1 ring-black hover:ring-platinum hover:bg-gradient-brand dark:text-black hover:text-white"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="size-4" aria-hidden />
            ) : (
              <ChevronLeftIcon className="size-4" aria-hidden />
            )}
            {!isCollapsed && <span className="sr-only">{t('nav.toggle_sidebar')}</span>}
          </button>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <NavList navigation={navigation} isCollapsed={isCollapsed} />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
