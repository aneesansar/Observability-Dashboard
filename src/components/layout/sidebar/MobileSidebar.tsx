import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { NavList } from "./NavList";
import LogoWhite from "../../../assets/Logo_White.svg";
import navigation from "../../../config/navigation";

export type MobileSidebarProps = {
  open: boolean;
  onClose: (open: boolean) => void;
};

export default function MobileSidebar({
  open,
  onClose,
}: MobileSidebarProps) {
  const { t } = useTranslation();
  
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex">
        <DialogPanel
          transition
          className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
        >
          <TransitionChild>
            <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
              <button
                type="button"
                onClick={() => onClose(false)}
                className="-m-2.5 p-2.5"
              >
                <span className="sr-only">{t('nav.collapse_sidebar')}</span>
                <XMarkIcon aria-hidden className="size-6 text-white" />
              </button>
            </div>
          </TransitionChild>

          {/* Sidebar */}
          <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 dark:bg-platinum dark:ring dark:ring-white/10 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-black/10">
            <div className="relative flex h-16 shrink-0 items-center">
              <img alt={t('accessibility.logo')} src={LogoWhite} className="h-16 w-auto" />
            </div>
            <nav className="relative flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <NavList navigation={navigation} />
                </li>
              </ul>
            </nav>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
