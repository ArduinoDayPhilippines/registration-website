import { NextRequest, NextResponse } from "next/server";
import { renderCertificateImage } from "@/services/certificateService";
import { CertificateConfig } from "@/types/event";
import { DEFAULT_CERTIFICATE_CONFIG } from "@/config/certificateConfig";
import { canManageEvent } from "@/services/authService";

/**
 * POST /api/cert-preview
 * Body: { name: string, config: CertificateConfig, slug: string }
 * Returns: { base64: string }
 *
 * Used by the CertificateBuilder admin UI to preview the actual generated output
 * without saving the config to the database first.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, config, slug } = body as {
      name: string;
      config: CertificateConfig;
      slug: string;
    };

    if (!name || !config || !slug) {
      return NextResponse.json({ error: "Missing name, config, or slug" }, { status: 400 });
    }

    // Only event organizers can generate preview certs
    if (!(await canManageEvent(slug))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!config.templateUrl) {
      return NextResponse.json(
        { error: "No template URL in config. Please upload a background image first." },
        { status: 400 }
      );
    }

    // Deep-merge with defaults to ensure all properties exist
    const mergedConfig: CertificateConfig = {
      ...DEFAULT_CERTIFICATE_CONFIG,
      ...config,
      text: {
        ...DEFAULT_CERTIFICATE_CONFIG.text,
        ...config.text,
      },
      isEnabled: true,
    };

    const base64 = await renderCertificateImage(name, mergedConfig);
    return NextResponse.json({ base64 });
  } catch (error: any) {
    console.error("cert-preview error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate preview" }, { status: 500 });
  }
}
