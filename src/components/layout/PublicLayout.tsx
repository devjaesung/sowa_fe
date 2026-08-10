import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { NavLink, Outlet } from "react-router";
import logoImage from "../../assets/sowa_icon.png";
import footerLogoImage from "../../assets/sowa_ic_white.png";
import { sowaApi } from "../../api/sowaApi";
import { resolveAssetUrl } from "../../shared/assetUrl";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium tracking-[0.02em] transition-colors ${
    isActive ? "text-text-main" : "text-text-subtle hover:text-text-main"
  }`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block border-b border-line py-5 text-left text-xl font-medium tracking-[0.04em] ${
    isActive ? "text-text-main" : "text-text-muted"
  }`;

export default function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const logoSrc = resolveAssetUrl(settingsQuery.data?.logo_image) || logoImage;
  const footerLogoSrc =
    resolveAssetUrl(settingsQuery.data?.logo_image) || footerLogoImage;
  const navItems = [
    { to: "/", label: "HOME", end: true },
    { to: "/story", label: "STORY" },
    { to: "/works", label: "WORKS" },
    { to: "/contact", label: "CONTACT" },
    ...(adminSessionQuery.isSuccess ? [{ to: "/admin", label: "ADMIN" }] : []),
  ];

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-surface text-text-main">
      <header className="sticky top-0 z-30 border-b border-line bg-card/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-310 items-center justify-between px-4 sm:px-6 md:h-20">
          <NavLink to="/" className="inline-flex items-center" onClick={() => setIsMenuOpen(false)}>
            <img src={logoSrc} alt={siteTitle} className="h-8 w-auto md:h-10" />
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex lg:gap-11">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-2xl md:hidden"
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>
      </header>

      {isMenuOpen ? (
        <nav className="fixed inset-x-0 bottom-0 top-16 z-20 overflow-y-auto bg-card px-6 py-6 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={mobileLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      ) : null}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-footer py-8 text-footer-text md:py-9">
        <div className="mx-auto grid w-full max-w-310 gap-6 px-4 text-sm sm:px-6 md:grid-cols-3 md:items-start">
          <div className="flex justify-start md:self-end">
            <img src={footerLogoSrc} alt={siteTitle} className="h-9 w-auto brightness-0 invert" />
          </div>
          <div className="text-left md:self-end md:text-center">
            <p>© 2024 SOWA INTERIOR. All rights reserved.</p>
          </div>
          <div className="space-y-1 text-left md:text-right">
            <p>Principal designer : 이창훈</p>
            <p>ech0701@naver.com</p>
            <p>+82 10-9457-7283</p>
            <p>서울특별시, 강남구 논현동 123-3번지, 1층</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
