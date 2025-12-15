import { memo, useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import type { KeycloakTokenParsed } from "../../../types/auth.types";

const UserDropdown = memo(function UserDropdown() {
  const { keycloak, logout } = useAuth();
  const { t } = useTranslation();
  const parsed = keycloak.tokenParsed as KeycloakTokenParsed | undefined;
  const displayName = parsed?.name || parsed?.preferred_username || "User";
  const initial = displayName?.charAt(0)?.toUpperCase() ?? "U";

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false), open);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="-m-1.5 flex items-center p-1.5"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="sr-only">{t('app.profile')}</span>
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-900">
          <span className="text-xl font-medium leading-none text-white">
            {initial}{" "}
          </span>
        </span>
        <span className="hidden lg:flex lg:items-center">
          <span
            className="ml-4 text-sm font-semibold leading-6 text-gray-900"
            aria-hidden="true"
          >
            {displayName}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="ml-2 h-5 w-5 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            ></path>
          </svg>
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-platinum  ring-opacity-5">
          <div className="py-1">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-white hover:bg-gradient-brand rounded"
              onClick={async () => {
                setOpen(false);
                logout();
              }}
            >
              {t('app.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default UserDropdown;
