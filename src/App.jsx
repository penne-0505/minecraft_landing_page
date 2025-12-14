import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Legal from "./pages/Legal.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import Join from "./pages/Join.jsx";
import Contract from "./pages/Contract.jsx";
import Help from "./pages/Help.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import LegalDoc from "./pages/LegalDoc.jsx";
import Tokusho from "./pages/Tokusho.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<Join />} />
        <Route path="/join" element={<Join />} />
        <Route path="/membership" element={<Home />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/legal/tokusho" element={<Tokusho />} />
        <Route path="/legal/:docKey" element={<LegalDoc />} />
        <Route path="/contract" element={<Contract />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/cancellation" element={<Cancellation />} />
        <Route
          path="/community"
          element={
            <Placeholder
              title="Join / Community LP"
              description="コミュニティ誘導用の独立LPを近日公開予定です。"
            />
          }
        />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
