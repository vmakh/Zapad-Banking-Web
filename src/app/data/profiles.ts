import type { Profile, ProfileSlug } from "./types";

export const profiles: Profile[] = [
  {
    id: "p1",
    slug: "personal",
    kind: "personal",
    name: "Alex Demo",
    greetingName: "Alex",
    subtitle: "Personal account",
    initials: "AD",
  },
  {
    id: "b1",
    slug: "business",
    kind: "business",
    name: "Demo Corp DOO",
    greetingName: "Demo Corp",
    subtitle: "Podgorica · Director",
    initials: "DC",
  },
];

export function getProfileBySlug(slug: string): Profile {
  return profiles.find((p) => p.slug === slug) ?? profiles[0];
}

export function getProfileById(id: string): Profile | undefined {
  return profiles.find((p) => p.id === id);
}

export function isValidProfileSlug(slug: string): slug is ProfileSlug {
  return slug === "personal" || slug === "business";
}

export const PROFILE_STORAGE_KEY = "zapadbanka-profile-slug";
