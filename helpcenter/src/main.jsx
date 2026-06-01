import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HelpCenter from "./pages/HelpCenter";
import ArticleDetail from "./pages/ArticleDetail";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HelpCenter />} />
        <Route path="/article/:slug" element={<ArticleDetail />} />
        <Route path="/category/:category" element={<HelpCenter />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
