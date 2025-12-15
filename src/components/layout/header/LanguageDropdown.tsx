import { memo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";

const OPTIONS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
] as const;

type Lang = (typeof OPTIONS)[number]["code"];

const LanguageDropdown = memo(function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false), open);

  const currentLang: Lang = (i18n.resolvedLanguage as Lang) || (i18n.language as Lang) || "en";
  const current = OPTIONS.find(o => o.code === currentLang) ?? OPTIONS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t('app.language')}
      >
        <span className="sr-only">{t('app.language')}</span>
        <span className="mr-2">{current.flag}</span>
        {current.code}
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
            {OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={async () => {
                  await i18n.changeLanguage(opt.code);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-white hover:bg-gradient-brand rounded"
              >
                <span className="mr-2">{opt.flag}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default LanguageDropdown;
