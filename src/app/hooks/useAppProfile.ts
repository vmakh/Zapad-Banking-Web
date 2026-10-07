import { useCallback } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import type { Profile, ProfileSlug } from "../data/types";
import { getProfileBySlug } from "../data/profiles";
import { profilePath, sanitizePathForProfile } from "../utils/paths";

export type AppOutletContext = {
  profile: Profile;
  profileSlug: ProfileSlug;
  profileId: string;
  isBusiness: boolean;
  setProfileSlug: (slug: ProfileSlug) => void;
};

export function useAppProfile(): AppOutletContext {
  const ctx = useOutletContext<AppOutletContext>();
  if (!ctx?.profile) {
    throw new Error("useAppProfile must be used within RootLayout outlet");
  }
  return ctx;
}

export function useProfileFromParams(): AppOutletContext {
  const { profile: slugParam = "personal" } = useParams<{ profile: string }>();
  const navigate = useNavigate();
  const profileSlug = (slugParam === "business" ? "business" : "personal") as ProfileSlug;
  const profile = getProfileBySlug(profileSlug);
  const isBusiness = profile.kind === "business";

  const setProfileSlug = useCallback(
    (newSlug: ProfileSlug) => {
      const path = window.location.pathname;
      const rest = path.replace(/^\/(personal|business)/, "") || "";
      const safeRest = sanitizePathForProfile(rest, newSlug);
      navigate(`${profilePath(newSlug)}${safeRest}${window.location.search}`);
    },
    [navigate],
  );

  return {
    profile,
    profileSlug,
    profileId: profile.id,
    isBusiness,
    setProfileSlug,
  };
}
