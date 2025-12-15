import { createContext, useEffect, useState, type ReactNode } from "react";

export type FeedbackContextType = {
  feedbackMessage: string;
  setFeedbackMessage: (msg: string) => void;
  feedbackStatus?: number;
  setFeedbackStatus: (status?: number) => void;
};

export const FeedbackContext = createContext<FeedbackContextType | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [feedbackStatus, setFeedbackStatus] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as CustomEvent<{ status?: number; message?: string }>;
      if (evt.detail) {
        if (typeof evt.detail.message === 'string') setFeedbackMessage(evt.detail.message);
        setFeedbackStatus(evt.detail.status);
      }
    };
    window.addEventListener('app-feedback', handler as EventListener);
    return () => window.removeEventListener('app-feedback', handler as EventListener);
  }, []);

  return (
    <FeedbackContext.Provider value={{ feedbackMessage, setFeedbackMessage, feedbackStatus, setFeedbackStatus }}>
      {children}
    </FeedbackContext.Provider>
  );
}
