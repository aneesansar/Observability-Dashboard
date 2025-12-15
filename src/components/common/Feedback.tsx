import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

type FeedbackProps = {
  message?: string;
  status?: number;
};

export default function Feedback({ message, status }: FeedbackProps) {
  if (!message) return null;

  const isSuccess = status === 200 || status === 201;
  const isError = status && status >= 400;

  const bgColor = isSuccess
    ? "bg-green-50 border-green-200"
    : isError
    ? "bg-red-50 border-red-200"
    : "bg-blue-50 border-blue-200";

  const textColor = isSuccess
    ? "text-green-700"
    : isError
    ? "text-red-700"
    : "text-blue-700";

  const Icon = isSuccess
    ? CheckCircleIcon
    : isError
    ? ExclamationCircleIcon
    : InformationCircleIcon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${bgColor} ${textColor} text-sm`}>
      <Icon className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
