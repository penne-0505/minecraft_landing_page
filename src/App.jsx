import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { trackPageView } from "./analytics";

const Membership = lazy(() => import("./pages/Membership.jsx"));
const Placeholder = lazy(() => import("./pages/Placeholder.jsx"));
const JoinLanding = lazy(() => import("./pages/JoinLanding.jsx"));
const Contract = lazy(() => import("./pages/Contract.jsx"));
const Help = lazy(() => import("./pages/Help.jsx"));
const AuthCallback = lazy(() => import("./pages/AuthCallback.jsx"));
const LegalDoc = lazy(() => import("./pages/LegalDoc.jsx"));
const Thanks = lazy(() => import("./pages/Thanks.jsx"));
const Cancellation = lazy(() => import("./pages/Cancellation.jsx"));
const Supporters = lazy(() => import("./pages/Supporters.jsx"));

const RouteAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    trackPageView(path);
  }, [location.pathname, location.search]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <RouteAnalytics />
      <Suspense fallback={<div className="min-h-screen bg-[#f0f9ff]" />}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<JoinLanding />} />
          <Route path="/join" element={<JoinLanding />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/legal" element={<Navigate to="/legal/terms" replace />} />
          <Route path="/legal/:docKey" element={<LegalDoc />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/thanks" element={<Thanks />} />
          <Route path="/cancellation" element={<Cancellation />} />
          <Route path="/supporters" element={<Supporters />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
