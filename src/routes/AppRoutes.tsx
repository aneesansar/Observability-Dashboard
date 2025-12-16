import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ObservabilityDashboardPage from "../pages/ObservabilityDashboardPage";
import ObservabilityMetricsPage from "../pages/ObservabilityMetricsPage";
import LogsPage from "../pages/LogsPage";
import TracesPage from "../pages/TracesPage";
import RagQueryPage from "../pages/RagQueryPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to observability dashboard */}
        <Route
          path="/"
          element={<Navigate to="/observability/dashboard" replace />}
        />
        <Route
          path="/observability"
          element={<Navigate to="/observability/dashboard" replace />}
        />
        <Route
          path="/observability/dashboard"
          element={
            <ProtectedRoute>
              <ObservabilityDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/observability/metrics"
          element={
            <ProtectedRoute>
              <ObservabilityMetricsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <LogsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/traces"
          element={
            <ProtectedRoute>
              <TracesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rag-query"
          element={
            <ProtectedRoute>
              <RagQueryPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/observability/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
