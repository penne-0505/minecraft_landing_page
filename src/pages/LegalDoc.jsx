import React from "react";
import { Navigate, useParams } from "react-router-dom";
import LegalDocPage from "../legal/LegalDocPage";
import { legalDocs } from "../legal/config";

const LegalDoc = () => {
  const { docKey } = useParams();
  if (!docKey || !legalDocs[docKey]) {
    return <Navigate to="/legal/terms" replace />;
  }
  return <LegalDocPage docKey={docKey} />;
};

export default LegalDoc;
