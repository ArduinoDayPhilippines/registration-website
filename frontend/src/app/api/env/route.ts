import { NextResponse } from "next/server";
import { getActiveEnv, getActiveProfileName, listProfiles, getSystemVariant } from "./store";

const REQUIRED = [
  "ARDUINODAYPH_SENDER_EMAIL",
  "ARDUINODAYPH_SENDER_PASSWORD",
  "ARDUINODAYPH_SENDER_NAME",
] as const;

type RequiredKey = typeof REQUIRED[number];

export async function GET() {
  const override = getActiveEnv();
  const present: Record<RequiredKey, boolean> = {
    ARDUINODAYPH_SENDER_EMAIL: !!override.SENDER_EMAIL,
    ARDUINODAYPH_SENDER_PASSWORD: !!override.SENDER_APP_PASSWORD,
    ARDUINODAYPH_SENDER_NAME: !!override.SENDER_NAME,
  };
  const missing = REQUIRED.filter((k) => !present[k]);
  return NextResponse.json({
    ok: missing.length === 0,
    present,
    missing,
    source: Object.fromEntries(REQUIRED.map((k) => [k, override[k] ? "env" : "missing"])),
    activeProfile: getActiveProfileName(),
    profiles: listProfiles(),
    systemVariant: getSystemVariant(),
    hint: "Create a .env.local file with ARDUINODAYPH_SENDER_EMAIL, ARDUINODAYPH_SENDER_PASSWORD (e.g. Gmail App Password), and ARDUINODAYPH_SENDER_NAME. Restart the server after changes.",
    example: "ARDUINODAYPH_SENDER_EMAIL=you@example.com\nARDUINODAYPH_SENDER_PASSWORD=abcd abcd abcd abcd\nARDUINODAYPH_SENDER_NAME=Your Name",
  });
}
