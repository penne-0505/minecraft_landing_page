import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { trackPageView } from "./analytics";

const Membership = lazy(() => import("./pages/Membership.jsx"));
const JoinLanding = lazy(() => import("./pages/JoinLanding.jsx"));
const DemoFlow = lazy(() => import("./pages/DemoFlow.jsx"));
const Contract = lazy(() => import("./pages/Contract.jsx"));
const AuthCallback = lazy(() => import("./pages/AuthCallback.jsx"));
const Legal = lazy(() => import("./pages/Legal.jsx"));
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
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <RouteAnalytics />
      <Suspense fallback={<div className="min-h-screen token-bg-main" />}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<JoinLanding />} />
          <Route path="/join" element={<JoinLanding />} />
          <Route path="/demo-flow" element={<DemoFlow />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/legal/:docKey" element={<LegalDoc />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/thanks" element={<Thanks />} />
          <Route path="/cancellation" element={<Cancellation />} />
          <Route path="/supporters" element={<Supporters />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
