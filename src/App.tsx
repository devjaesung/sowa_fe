import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import PublicLayout from "./components/layout/PublicLayout";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import InquiryPage from "./pages/InquiryPage";
import PortfolioPage from "./pages/PortfolioPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
        </Route>

        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
