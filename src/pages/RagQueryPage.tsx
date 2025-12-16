import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { AppLayout } from "@/components/Layout";
import PageTitle from "@/components/common/PageTitle";
import FavButtonGroup from "@/components/common/FavButtonGroup";
import SearchBar from "@/components/common/SearchBar";
import Table from "@/components/common/Table";
import StatsCard from "@/components/common/StatsCard";
import FeedbackModal from "@/components/features/rag/FeedbackModal";
import type { FeedbackFormData } from "@/components/features/rag/FeedbackModal";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  StarIcon,
  ClipboardIcon,
  CheckIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { ragService, feedbackService } from "@/services/api";
import type { RagResultItem, RagQueryResponse } from "@/services/api";

export default function RagQueryPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const responseEndRef = useRef<HTMLDivElement>(null);

  // API response state
  const [response, setResponse] = useState<RagQueryResponse | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [topK, setTopK] = useState(5);

  // Feedback state
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<boolean>(true);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<'positive' | 'negative' | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setIsLoading(true);
    setResponse(null);
    setFeedbackSubmitted(null);

    try {
      const result = await ragService.query({
        query,
        top_k: topK,
      });
      
      setResponse(result);
      
      // Scroll to response
      setTimeout(() => {
        responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      console.error("RAG query error:", err);
      window.dispatchEvent(
        new CustomEvent('app-feedback', {
          detail: { 
            status: 500, 
            message: err instanceof Error ? err.message : "Failed to query RAG system"
          },
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedbackClick = (rating: boolean) => {
    setFeedbackRating(rating);
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async (formData: FeedbackFormData) => {
    if (!response?.conversation_id) {
      window.dispatchEvent(
        new CustomEvent('app-feedback', {
          detail: { 
            status: 400, 
            message: t('feedback.error.no_conversation', 'No conversation ID available')
          },
        })
      );
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      await feedbackService.create({
        conversation_id: response.conversation_id,
        feedback: formData.feedback,
        rating: feedbackRating,
        reason: formData.reason || (feedbackRating ? 'correct' : undefined),
        suggested_answer: formData.suggested_answer || undefined,
        metadata: {
          query: response.query_result.query,
          results_count: response.query_result.retrieved_count,
        },
      }, response.query_result.tenant_id);

      setFeedbackSubmitted(feedbackRating ? 'positive' : 'negative');
      setIsFeedbackModalOpen(false);

      window.dispatchEvent(
        new CustomEvent('app-feedback', {
          detail: { 
            status: 200, 
            message: t('feedback.success', 'Thank you for your feedback!')
          },
        })
      );
    } catch (err: unknown) {
      console.error('Feedback submission error:', err);
      window.dispatchEvent(
        new CustomEvent('app-feedback', {
          detail: { 
            status: 500, 
            message: err instanceof Error ? err.message : t('feedback.error.submit', 'Failed to submit feedback')
          },
        })
      );
    } finally {
      setIsSubmittingFeedback(false);
    }
  };


  return (
    <AppLayout padded={true}>
      {/* Header */}
      <div className="flex items-center justify-between mt-1 space-x-2">
        <PageTitle>{t("pagetitle.RAG Query", "RAG Query")}</PageTitle>
        <FavButtonGroup
          onFavoriteClick={() => {}}
          onCopyClick={() => response && handleCopy(response.text_explanation)}
          onFolderClick={() => {}}
        />
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder={t("rag.search_placeholder", "Enter your travel query...")}
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* Settings Row */}
      <div className="mt-4 flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <span>{t("rag.top_k", "Results:")}</span>
          <select
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary focus:ring-primary"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </label>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-8 flex flex-col items-center justify-center py-12">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="mt-4 text-sm text-gray-500">{t("rag.searching", "Searching...")}</p>
        </div>
      )}

      {/* Response Area */}
      {response && !isLoading && (
        <div className="mt-6 space-y-6">
          {/* Query Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title={t("rag.query", "Query")}
              subtitle={t("rag.your_search", "Your search")}
              value={response.query_result.query.length > 30 
                ? response.query_result.query.substring(0, 30) + "..." 
                : response.query_result.query}
              icon={<MagnifyingGlassIcon className="h-4 w-4" />}
              borderColor="border-blue-200"
            />
            <StatsCard
              title={t("rag.results_found", "Results Found")}
              subtitle={t("rag.matching_trips", "Matching trips")}
              value={String(response.query_result.retrieved_count)}
              icon={<GlobeAltIcon className="h-4 w-4" />}
              borderColor="border-green-200"
            />
            <StatsCard
              title={t("rag.tenant", "Tenant")}
              subtitle={t("rag.data_source", "Data source")}
              value={response.query_result.tenant_id}
              icon={<MapPinIcon className="h-4 w-4" />}
              borderColor="border-purple-200"
            />
            <StatsCard
              title={t("rag.filters", "Filters")}
              subtitle={t("rag.applied", "Applied")}
              value={response.query_result.has_filters ? t("general.yes", "Yes") : t("general.no", "No")}
              icon={<StarIcon className="h-4 w-4" />}
              borderColor="border-yellow-200"
            />
          </div>

          {/* Answer Section - Text Explanation */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-3">
              <img
                src="/favicon.png"
                alt="AI"
                className="rounded-full w-10 h-10 shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-3">{t("rag.answer", "Answer")}</h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-semibold text-gray-900 mt-3 mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-semibold text-gray-900 mt-2 mb-1">{children}</h3>,
                      p: ({ children }) => <p className="text-gray-700 mb-2 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-700">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-secondary underline inline-flex items-center gap-1"
                        >
                          {children}
                          <LinkIcon className="h-3 w-3" />
                        </a>
                      ),
                      hr: () => <hr className="my-4 border-gray-200" />,
                    }}
                  >
                    {response.text_explanation}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
            
            {/* Action Buttons: Copy & Feedback */}
            <div className="mt-4 flex items-center gap-2 ml-13">
              {/* Copy Button */}
              <button
                onClick={() => handleCopy(response.text_explanation)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                title={t('general.copy_clipboard')}
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <ClipboardIcon className="h-4 w-4 text-gray-600" />
                )}
              </button>

              {/* Thumbs Up Button */}
              <button
                onClick={() => handleFeedbackClick(true)}
                disabled={feedbackSubmitted === 'positive'}
                className={`p-2 rounded-full transition-colors ${
                  feedbackSubmitted === 'positive'
                    ? 'bg-green-100 text-green-600 cursor-default'
                    : 'bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600'
                }`}
                title={t('feedback.positive', 'Helpful response')}
              >
                <HandThumbUpIcon className="h-4 w-4" />
              </button>

              {/* Thumbs Down Button */}
              <button
                onClick={() => handleFeedbackClick(false)}
                disabled={feedbackSubmitted === 'negative'}
                className={`p-2 rounded-full transition-colors ${
                  feedbackSubmitted === 'negative'
                    ? 'bg-red-100 text-red-600 cursor-default'
                    : 'bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600'
                }`}
                title={t('feedback.negative', 'Not helpful')}
              >
                <HandThumbDownIcon className="h-4 w-4" />
              </button>

              {/* Feedback submitted indicator */}
              {feedbackSubmitted && (
                <span className="text-xs text-gray-500 ml-2">
                  {t('feedback.thanks', 'Thanks for your feedback!')}
                </span>
              )}
            </div>
          </div>

          {/* Reasoning Section */}
          {response.reasoning && response.reasoning.length > 0 && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 overflow-hidden">
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-amber-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LightBulbIcon className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-800">
                    {t("rag.reasoning", "Reasoning")} ({response.reasoning.length} {t("rag.steps", "steps")})
                  </span>
                </div>
                {showReasoning ? (
                  <ChevronUpIcon className="h-5 w-5 text-amber-600" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-amber-600" />
                )}
              </button>
              
              {showReasoning && (
                <div className="px-6 pb-4">
                  <ol className="list-decimal list-inside space-y-2">
                    {response.reasoning.map((reason, idx) => (
                      <li key={idx} className="text-sm text-amber-900">
                        {reason}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* Results Table */}
          {response.results && response.results.length > 0 && (
            <div className="space-y-4">
              {/* Toggle Button */}
              <button
                onClick={() => setShowResults(!showResults)}
                className="bg-gray-200 text-charcoal font-bold px-4 py-2 rounded-md w-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                {showResults ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
                <span className="ml-2">
                  {showResults 
                    ? t("rag.hide_results", "Hide Results") 
                    : t("rag.show_results", `Show Results (${response.results.length})`)}
                </span>
              </button>

              {/* Results Cards */}
              {showResults && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {response.results.map((result, idx) => (
                    <ResultCard key={result.trip_id || idx} result={result} />
                  ))}
                </div>
              )}

              {/* Results Table Alternative */}
              {showResults && (
                <div className="mt-6">
                  <Table
                    data={response.results}
                    columns={[
                      {
                        key: "name",
                        header: t("rag.trip_name", "Trip Name"),
                        render: (item: RagResultItem) => (
                          <div className="font-medium text-gray-900 max-w-xs truncate" title={item.name}>
                            {item.name}
                          </div>
                        ),
                      },
                      {
                        key: "country",
                        header: t("rag.country", "Country"),
                        render: (item: RagResultItem) => (
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4 text-gray-400" />
                            <span>{item.country}</span>
                          </div>
                        ),
                      },
                      {
                        key: "duration",
                        header: t("rag.duration", "Duration"),
                        render: (item: RagResultItem) => (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4 text-gray-400" />
                            <span>{item.trip_duration} {t("rag.days", "days")}</span>
                          </div>
                        ),
                      },
                      {
                        key: "provider",
                        header: t("rag.provider", "Provider"),
                        render: (item: RagResultItem) => (
                          <span className="text-sm">{item.provider}</span>
                        ),
                      },
                      {
                        key: "score",
                        header: t("rag.score", "Score"),
                        render: (item: RagResultItem) => (
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{(item.score * 100).toFixed(1)}%</span>
                          </div>
                        ),
                      },
                      {
                        key: "url",
                        header: t("rag.link", "Link"),
                        render: (item: RagResultItem) => (
                          item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-secondary underline"
                            >
                              {t("rag.view", "View")}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )
                        ),
                      },
                    ]}
                    getRowKey={(item) => item.trip_id || item.name}
                    emptyMessage={t("rag.no_results", "No results found")}
                  />
                </div>
              )}
            </div>
          )}

          <div ref={responseEndRef} />
        </div>
      )}

      {/* Empty State */}
      {!response && !isLoading && (
        <div className="mt-12 flex flex-col items-center justify-center py-12 text-center">
          <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("rag.start_searching", "Start Searching")}
          </h3>
          <p className="text-sm text-gray-500 max-w-md">
            {t("rag.search_description", "Enter a travel query to find matching trips and get AI-powered recommendations.")}
          </p>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
        rating={feedbackRating}
        conversationId={response?.conversation_id || ""}
        isSubmitting={isSubmittingFeedback}
      />
    </AppLayout>
  );
}

// Result Card Component
function ResultCard({ result }: { result: RagResultItem }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate" title={result.name}>
              {result.name}
            </h4>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                {result.country}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {result.trip_duration} {t("rag.days", "days")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            <StarIcon className="h-3 w-3" />
            {(result.score * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {result.description && (
          <p className="text-sm text-gray-600 line-clamp-2" title={result.description}>
            {result.description}
          </p>
        )}
        
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{t("rag.provider", "Provider")}: {result.provider}</span>
          {result.url && (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary font-medium"
            >
              {t("rag.view_details", "View Details")} →
            </a>
          )}
        </div>

        {/* Schedules */}
        {result.schedules && result.schedules.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary hover:text-secondary font-medium flex items-center gap-1"
            >
              {expanded ? (
                <>
                  <ChevronUpIcon className="h-4 w-4" />
                  {t("rag.hide_schedules", "Hide Schedules")}
                </>
              ) : (
                <>
                  <ChevronDownIcon className="h-4 w-4" />
                  {t("rag.show_schedules", `Show Schedules (${result.schedules.length})`)}
                </>
              )}
            </button>

            {expanded && (
              <div className="mt-2 space-y-2">
                {result.schedules.map((schedule, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-lg p-3 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-500">{t("rag.start", "Start")}:</span>{" "}
                        <span className="font-medium">{schedule.start_date}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">{t("rag.end", "End")}:</span>{" "}
                        <span className="font-medium">{schedule.end_date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CurrencyDollarIcon className="h-3 w-3 text-green-600" />
                        <span className="font-medium text-green-700">{schedule.price}</span>
                      </div>
                      {schedule.airport && schedule.airport !== "None" && (
                        <div>
                          <span className="text-gray-500">{t("rag.airport", "Airport")}:</span>{" "}
                          <span className="font-medium">{schedule.airport}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
