import { Navigate } from "react-router";
import { PROFILE_STORAGE_KEY } from "../../data/profiles";
import type { ProfileSlug } from "../../data/types";
import { profilePath } from "../../utils/paths";

function getStoredProfile(): ProfileSlug {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored === "business" || stored === "personal") return stored;
  } catch {
    /* ignore */
  }
  return "personal";
}

export function ProfileRedirect() {
  const slug = getStoredProfile();
  return <Navigate to={profilePath(slug)} replace />;
}
