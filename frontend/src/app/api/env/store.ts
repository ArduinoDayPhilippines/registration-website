// Simple in-memory store for uploaded env overrides.
// NOTE: In production you should persist securely and encrypt secrets.

export type SenderEnv = {
  SENDER_EMAIL?: string;
  SENDER_APP_PASSWORD?: string;
  SENDER_NAME?: string;
  HOST_DOMAIN?: string;
  PORT?: string;
};

// In-memory multi-profile store
let profiles: Record<string, SenderEnv> = {};
let activeProfile: string | null = null;
type SystemVariant = "arduino";
let systemVariant: SystemVariant = "arduino";

export function setProfile(name: string, values: SenderEnv) {
  const clean = name.trim();
  if (!clean) return;
  profiles[clean] = { ...values };
  activeProfile = clean;
}

export function listProfiles(): string[] {
  return Object.keys(profiles);
}

export function getProfile(name: string): SenderEnv | undefined {
  return profiles[name];
}

export function setActiveProfile(name: string | null) {
  if (name === null || name.trim() === "") {
    activeProfile = null;
    return;
  }
  if (profiles[name]) activeProfile = name;
}

export function getActiveProfileName(): string | null {
  return activeProfile;
}

export function getSystemVariant(): SystemVariant {
  return systemVariant;
}
export function setSystemVariant(variant: SystemVariant) {
  systemVariant = variant;
}

export function getActiveEnv(): SenderEnv {
  // If a named profile is active, use it
  if (activeProfile && profiles[activeProfile]) {
    return { ...profiles[activeProfile] };
  }
  // Otherwise, derive from process.env
  const env = process.env as Record<string, string | undefined>;
  return {
    SENDER_EMAIL: env.ARDUINODAYPH_SENDER_EMAIL,
    SENDER_APP_PASSWORD: env.ARDUINODAYPH_SENDER_PASSWORD,
    SENDER_NAME: env.ARDUINODAYPH_SENDER_NAME,
  };
}

export function clearProfile(name: string) {
  delete profiles[name];
  if (activeProfile === name) {
    activeProfile = listProfiles()[0] || null;
  }
}

export function clearAllProfiles() {
  profiles = {};
  activeProfile = null;
}
