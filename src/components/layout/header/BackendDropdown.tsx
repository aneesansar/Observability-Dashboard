import { memo, useState, useRef } from "react";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { useAuth } from "../../../context/AuthContext";

const BackendDropdown = memo(function BackendDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { tenants, activeTenant, switchTenant } = useAuth();
  
  useOnClickOutside(ref, () => setOpen(false), open);

  // If no tenants available, show loading or default
  const displayTenant = activeTenant || "No Backend";

  // If only one tenant, show it without dropdown
  if (tenants.length <= 1) {
    return (
      <div className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm">
        <span className="font-semibold">{displayTenant}</span>
      </div>
    );
  }

  // Multiple tenants - show dropdown
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="font-semibold">{displayTenant}</span>
        <svg
          className="ml-2 h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-platinum ring-opacity-5">
          <div className="py-1">
            {tenants.map((tenant) => (
              <button
                key={tenant}
                onClick={() => {
                  if (tenant !== activeTenant) {
                    switchTenant(tenant);
                  }
                  setOpen(false);
                }}
                disabled={tenant === activeTenant}
                className={`block w-full px-4 py-2 text-left text-sm hover:text-white hover:bg-gradient-brand rounded ${
                  tenant === activeTenant
                    ? "bg-blue-50 text-blue-700 font-semibold cursor-default"
                    : "text-gray-700"
                }`}
              >
                {tenant}
                {tenant === activeTenant && (
                  <span className="ml-2 text-xs">(Active)</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default BackendDropdown;
