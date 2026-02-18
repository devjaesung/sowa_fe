import { NavLink, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import logoImage from "../../assets/sowa_icon.png";
import footerLogoImage from "../../assets/sowa_ic_white.png";
import { sowaApi } from "../../api/sowaApi";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium tracking-[0.02em] transition-colors ${
    isActive ? "text-text-main" : "text-text-subtle hover:text-text-main"
  }`;

export default function PublicLayout() {
  const adminSessionQuery = useQuery({
    queryKey: ["admin-session-check-public-nav"],
    queryFn: sowaApi.admin.getStats,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const settingsQuery = useQuery({
    queryKey: ["public-settings"],
    queryFn: sowaApi.public.getSettings,
  });
  const siteTitle = settingsQuery.data?.site_title || "SOWA";
  const logoSrc = settingsQuery.data?.logo_image || logoImage;
  const footerLogoSrc = settingsQuery.data?.logo_image || footerLogoImage;

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text-main">
      <header className="sticky top-0 z-20 border-b border-line bg-card/75 backdrop-blur-sm">
        <div className="mx-auto flex h-20 w-full max-w-310 items-center justify-between px-6">
          <NavLink to="/" className="inline-flex items-center">
            <img src={logoSrc} alt={siteTitle} className="h-9 w-auto md:h-10" />
          </NavLink>

          <nav className="flex items-center gap-8 md:gap-11">
            <NavLink to="/" end className={linkClass}>
              홈
            </NavLink>
            <NavLink to="/portfolio" className={linkClass}>
              포트폴리오
            </NavLink>
            <NavLink to="/inquiry" className={linkClass}>
              문의하기
            </NavLink>
            {adminSessionQuery.isSuccess ? (
              <NavLink to="/admin" className={linkClass}>
                관리자
              </NavLink>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-footer py-9 text-footer-text">
        <div className="mx-auto grid w-full max-w-310 gap-6 px-6 text-sm md:grid-cols-3 md:items-start">
          <div className="flex justify-center md:self-end md:justify-start">
            <img
              src={footerLogoSrc}
              alt={siteTitle}
              className="h-9 w-auto brightness-0 invert"
            />
          </div>

          <div className="text-center md:self-end">
            <p>© 2024 SOWA INTERIOR. All rights reserved.</p>
          </div>

          <div className="space-y-1 text-center md:text-right">
            <p>이창훈</p>
            <p>ech0701@naver.com</p>
            <p>+82 10-9457-7283</p>
            <p>서울특별시, 강남구 논현동 123-3번지, 1층</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
