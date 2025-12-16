import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

type FeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackFormData) => void;
  rating: boolean; // true for thumbs up, false for thumbs down
  conversationId: string;
  isSubmitting?: boolean;
};

export type FeedbackFormData = {
  feedback: string;
  reason: string;
  suggested_answer: string;
};

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  rating,
  conversationId: _conversationId,
  isSubmitting = false,
}: FeedbackModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FeedbackFormData>({
    feedback: "",
    reason: rating ? "correct" : "",
    suggested_answer: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        feedback: "",
        reason: rating ? "correct" : "",
        suggested_answer: "",
      });
    }
  }, [isOpen, rating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // For positive feedback, reason is optional and defaults to "correct"
  const isFormValid = rating 
    ? formData.feedback.trim().length > 0
    : formData.feedback.trim().length > 0 && formData.reason.trim().length > 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/25"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-[500px] max-h-[90vh] rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 shrink-0 bg-gray-50 rounded-t-lg border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {rating 
                ? t('feedback.modal_title_positive', 'Positive Feedback') 
                : t('feedback.modal_title_negative', 'Negative Feedback')}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {t('feedback.modal_help_text', 'Help us improve by sharing your feedback')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {/* Feedback Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('feedback.fields.feedback', 'Your Feedback')} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.feedback}
                onChange={(e) =>
                  setFormData({ ...formData, feedback: e.target.value })
                }
                placeholder={rating 
                  ? t('feedback.placeholders.feedback_positive', 'What did you like about this response?')
                  : t('feedback.placeholders.feedback_negative', 'What was wrong with this response?')}
                required
                rows={3}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm resize-none"
              />
            </div>

            {/* Reason - Required for negative, optional for positive */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('feedback.fields.reason', 'Reason')} 
                {!rating && <span className="text-red-500"> *</span>}
              </label>
              <select
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required={!rating}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                {rating ? (
                  <>
                    <option value="correct">{t('feedback.reasons.positive.correct', 'Correct')}</option>
                    <option value="accurate">{t('feedback.reasons.positive.accurate', 'Accurate')}</option>
                    <option value="helpful">{t('feedback.reasons.positive.helpful', 'Helpful')}</option>
                    <option value="well-formatted">{t('feedback.reasons.positive.well_formatted', 'Well Formatted')}</option>
                    <option value="complete">{t('feedback.reasons.positive.complete', 'Complete')}</option>
                    <option value="other">{t('feedback.reasons.positive.other', 'Other')}</option>
                  </>
                ) : (
                  <>
                    <option value="">{t('feedback.reasons.select', 'Select a reason...')}</option>
                    <option value="incorrect">{t('feedback.reasons.negative.incorrect', 'Incorrect')}</option>
                    <option value="incomplete">{t('feedback.reasons.negative.incomplete', 'Incomplete')}</option>
                    <option value="irrelevant">{t('feedback.reasons.negative.irrelevant', 'Irrelevant')}</option>
                    <option value="unclear">{t('feedback.reasons.negative.unclear', 'Unclear')}</option>
                    <option value="other">{t('feedback.reasons.negative.other', 'Other')}</option>
                  </>
                )}
              </select>
            </div>

            {/* Suggested Answer (for negative feedback with incorrect reason) */}
            {!rating && formData.reason === "incorrect" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('feedback.fields.suggested_answer', 'Suggested Answer')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.suggested_answer}
                  onChange={(e) =>
                    setFormData({ ...formData, suggested_answer: e.target.value })
                  }
                  placeholder={t('feedback.placeholders.suggested_answer', 'What would be the correct answer?')}
                  required
                  rows={3}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm resize-none"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 shrink-0 bg-gray-50 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
            >
              {t('general.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-gradient-brand disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {t('feedback.buttons.submit', 'Submit Feedback')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
