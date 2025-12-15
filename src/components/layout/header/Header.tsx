import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { FeedbackContext } from "../../../context/FeedbackContext";
import Feedback from "../../common/Feedback";
import BackendDropdown from "./BackendDropdown";
import LanguageDropdown from "./LanguageDropdown";
import UserDropdown from "./UserDropdown";

type HeaderProps = {
  setSidebarOpen: (open: boolean) => void;
};

export default function Header({ setSidebarOpen }: HeaderProps) {
  const feedbackCtx = useContext(FeedbackContext);
  const feedbackMessage = feedbackCtx?.feedbackMessage;
  const feedbackStatus = feedbackCtx?.feedbackStatus;
  return (
    <div className="sticky top-0 z-40 w-full flex h-16 items-center border-b border-transparent text-white shadow-sm sm:gap-x-6 px-2 sm:px-4 bg-anti-flash-white">
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-black lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator (mobile) */}
      <div className="h-6 w-px bg-white/30 lg:hidden" aria-hidden="true" />

      {/* Left grow area with feedback messages */}
      <div className="flex flex-1 items-center">
        <Feedback message={feedbackMessage} status={feedbackStatus} />
      </div>

      {/* Actions */}
      <div className="relative flex items-center gap-x-4 lg:gap-x-4">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-900 hover:text-white/90"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div
          className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/30"
          aria-hidden="true"
        />
        <BackendDropdown />
        <div
          className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/30"
          aria-hidden="true"
        />
        <LanguageDropdown />
        <div
          className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/30"
          aria-hidden="true"
        />
        <UserDropdown />
      </div>
    </div>
  );
}
