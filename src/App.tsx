import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import PublicLayout from "./components/layout/PublicLayout";
import ScrollToTop from "./components/ScrollToTop";

const AdminPage = lazy(() => import("./pages/AdminPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const InquiryPage = lazy(() => import("./pages/InquiryPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const PortfolioDetailPage = lazy(() => import("./pages/PortfolioDetailPage"));
const StoryPage = lazy(() => import("./pages/StoryPage"));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-[#f5f3ef]" />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/story" element={<StoryPage />} />
            <Route path="/works" element={<PortfolioPage />} />
            <Route path="/works/:id" element={<PortfolioDetailPage />} />
            <Route path="/contact" element={<InquiryPage />} />
          </Route>

          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
