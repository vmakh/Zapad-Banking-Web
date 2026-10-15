import { useI18n } from "../../i18n/I18nProvider";
import { Outlet, useNavigation, useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState, useRef } from "react";
import { Sidebar, SidebarContent } from "../zapad/Sidebar";
import { TopBar } from "../zapad/TopBar";
import { PrivacyProvider } from "../../contexts/PrivacyContext";
import { InboxProvider } from "../../contexts/InboxContext";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../ui/sheet";
import { getProfileBySlug, isValidProfileSlug, PROFILE_STORAGE_KEY } from "../../data/profiles";
import type { AppOutletContext } from "../../hooks/useAppProfile";
import type { ProfileSlug } from "../../data/types";
import { navIdFromPathname, profilePath, sanitizePathForProfile } from "../../utils/paths";

export function RootLayout() {
  const { t, intlLocale } = useI18n();
  const { profile: profileParam } = useParams<{ profile: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const sectionPath = location.pathname.split("/").slice(0, 3).join("/");
  useEffect(() => { mainRef.current?.scrollTo(0, 0); window.scrollTo(0, 0); }, [sectionPath]);
  const navigation = useNavigation();
  const focusedSection = useRef(sectionPath);
  const mobileRouteChange = useRef(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => {
    if (!location.hash || navigation.state !== "idle") return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(location.hash.slice(1));
      if (!target || !mainRef.current?.contains(target)) return;
      target.scrollIntoView({ block: "start" });
      target.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, navigation.state]);
  useEffect(() => {
    if (navigation.state !== "idle" || focusedSection.current === sectionPath) return;
    focusedSection.current = sectionPath;
    if (!mobileNavOpen && !document.querySelector('[role="dialog"]')) mainRef.current?.focus({ preventScroll: true });
  }, [sectionPath, navigation.state, mobileNavOpen]);

  const profileSlug: ProfileSlug = profileParam && isValidProfileSlug(profileParam)
    ? profileParam
    : "personal";

  useEffect(() => {
    if (!isValidProfileSlug(profileParam ?? "")) {
      navigate(profilePath("personal"), { replace: true });
      return;
    }
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, profileSlug);
    } catch {
      /* ignore */
    }
  }, [profileParam, profileSlug, navigate]);

  const profile = getProfileBySlug(profileSlug);
  const isBusiness = profile.kind === "business";
  const pathToNavId = navIdFromPathname(location.pathname);

  const setProfileSlug = (slug: ProfileSlug) => {
    const rest = location.pathname.replace(/^\/(personal|business)/, "") || "";
    const safeRest = sanitizePathForProfile(rest, slug);
    navigate(`${profilePath(slug)}${safeRest}`);
  };

  const handleNavChange = (id: string) => {
    const segment = id === "dashboard" ? "" : id;
    mobileRouteChange.current = mobileNavOpen && location.pathname !== profilePath(profileSlug, segment);
    navigate(profilePath(profileSlug, segment));
    setMobileNavOpen(false);
  };

  const outletContext: AppOutletContext = {
    profile,
    profileSlug,
    profileId: profile.id,
    isBusiness,
    setProfileSlug,
  };

  return (
    <PrivacyProvider>
      <InboxProvider profileKind={profile.kind}>
      <div data-bank-profile={profileSlug} className="bank-workspace size-full min-h-screen bg-background flex">
        <a href="#main-content" onClick={event => { event.preventDefault(); mainRef.current?.focus({ preventScroll: true }); }} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-foreground focus:shadow-lg focus:outline focus:outline-ring">{t("Skip to main content")}</a>
        <Sidebar
          active={pathToNavId}
          onChange={handleNavChange}
          profileSlug={profileSlug}
          isBusiness={isBusiness}
        />

        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent
            side="left"
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              const menu = document.querySelector('[data-slot="sheet-content"] .bank-sidebar');
              const current = menu?.querySelector<HTMLAnchorElement>('a[aria-current="page"]') ?? menu?.querySelector<HTMLAnchorElement>("a");
              current?.focus();
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (mobileRouteChange.current) {
                mobileRouteChange.current = false;
                mainRef.current?.focus({ preventScroll: true });
              } else document.querySelector<HTMLButtonElement>("[data-navigation-trigger]")?.focus();
            }}
            className="w-72 max-w-dialog-viewport gap-0 border-white/5 bg-neutral-950 p-0 text-white [&>button]:text-foreground [&>button]:bg-secondary [&>button]:hover:bg-accent [&>button]:opacity-80"
          >
            <SheetTitle className="sr-only">{t("Main navigation")}</SheetTitle>
            <SheetDescription className="sr-only">{t("Choose a banking section or open settings and support.")}</SheetDescription>
            <SidebarContent
              active={pathToNavId}
              onChange={handleNavChange}
              profileSlug={profileSlug}
              isBusiness={isBusiness}
              onItemClick={() => setMobileNavOpen(false)}
              className="h-full"
            />
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            profile={profile}
            profileSlug={profileSlug}
            onProfileChange={setProfileSlug}
            onMenuClick={() => setMobileNavOpen(true)}
          />
          <main id="main-content" ref={mainRef} tabIndex={-1} aria-label={t("Main content")} className="flex-1 overflow-y-auto" aria-busy={navigation.state !== "idle"}>
            {navigation.state !== "idle" && <p role="status" className="px-6 py-3 text-sm text-muted-foreground">{t("Loading screen…")}</p>}
            <Outlet key={profileSlug} context={outletContext} />
          </main>
        </div>
      </div>
      </InboxProvider>
    </PrivacyProvider>
  );
}
