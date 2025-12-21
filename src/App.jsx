import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Membership from "./pages/Membership.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import JoinLanding from "./pages/JoinLanding.jsx";
import Contract from "./pages/Contract.jsx";
import Help from "./pages/Help.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import LegalDoc from "./pages/LegalDoc.jsx";
import Thanks from "./pages/Thanks.jsx";
import Cancellation from "./pages/Cancellation.jsx";
import Supporters from "./pages/Supporters.jsx";

const App = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
