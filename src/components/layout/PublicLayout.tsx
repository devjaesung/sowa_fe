import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import logoImage from "../../assets/sowa_icon.png";
import footerLogoImage from "../../assets/sowa_ic_white.png";
import { sowaApi } from "../../api/sowaApi";
import { resolveAssetUrl } from "../../shared/assetUrl";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium tracking-[0.02em] transition-colors ${
    isActive ? "text-text-main" : "text-text-subtle hover:text-text-main"
  }`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-14 w-full items-center border-b border-line px-1 text-base transition-colors ${
    isActive ? "font-semibold text-text-main" : "font-medium text-text-muted hover:text-text-main"
  }`;

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const settingsQuery = useQuery({
    queryKey: ["public-settings"],
    queryFn: sowaApi.public.getSettings,
  });
  const siteTitle = settingsQuery.data?.site_title || "SOWA";
  const logoSrc = resolveAssetUrl(settingsQuery.data?.logo_image) || logoImage;
  const footerLogoSrc =
    resolveAssetUrl(settingsQuery.data?.logo_image) || footerLogoImage;

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text-main">
      <header
        className={`sticky top-0 border-b border-line ${
          isMobileMenuOpen ? "z-40 bg-card" : "z-20 bg-card/75 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-310 items-center justify-between px-5 sm:px-6 md:h-20">
          <NavLink to="/" className="inline-flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logoSrc} alt={siteTitle} className="h-7 w-auto sm:h-8 md:h-10" />
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex md:gap-11">
            <NavLink to="/" end className={linkClass}>
              HOME
            </NavLink>
            <NavLink to="/story" className={linkClass}>
              STORY
            </NavLink>
            <NavLink to="/works" className={linkClass}>
              WORKS
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              CONTACT
            </NavLink>
          </nav>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center text-text-main transition-colors hover:text-text-muted md:hidden"
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            title={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          >
            {isMobileMenuOpen ? <HiX size={24} aria-hidden /> : <HiMenuAlt3 size={24} aria-hidden />}
          </button>
        </div>

      </header>

      {isMobileMenuOpen ? (
        <div
          className="fixed inset-0 z-30 flex min-h-[100svh] flex-col bg-card pt-16 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="전체 메뉴"
        >
          <nav
            id="mobile-navigation"
            className="flex flex-1 flex-col border-t border-line px-5 pt-6 sm:px-6"
          >
            <NavLink to="/" end className={mobileLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              HOME
            </NavLink>
            <NavLink to="/story" className={mobileLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              STORY
            </NavLink>
            <NavLink to="/works" className={mobileLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              WORKS
            </NavLink>
            <NavLink to="/contact" className={mobileLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              CONTACT
            </NavLink>
          </nav>
        </div>
      ) : null}

      <main className="flex-1" aria-hidden={isMobileMenuOpen || undefined}>
        <Outlet />
      </main>

      <footer
        className="bg-footer py-8 text-footer-text md:py-9"
        aria-hidden={isMobileMenuOpen || undefined}
      >
        <div className="mx-auto grid w-full max-w-310 min-w-0 gap-5 px-5 text-xs sm:px-6 sm:text-sm md:grid-cols-3 md:items-start">
          <div className="flex justify-center md:self-end md:justify-start">
            <img
              src={footerLogoSrc}
              alt={siteTitle}
              className="h-9 w-auto brightness-0 invert"
            />
          </div>

          <div className="min-w-0 text-center md:self-end">
            <p>© 2024 SOWA INTERIOR. All rights reserved.</p>
          </div>

          <div className="min-w-0 space-y-1 text-center md:text-right">
            <p>Principal designer : 이창훈</p>
            <p>ech0701@naver.com</p>
            <p>+82 10-9457-7283</p>
            <p className="break-words">서울특별시, 강남구 논현동 123-3번지, 1층</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
