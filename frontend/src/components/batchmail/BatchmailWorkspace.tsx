"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { driver } from "driver.js";
import type { DriveStep } from "driver.js";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { CsvMapping, ParsedCsv } from "@/components/ui/CsvUploader";
import PreviewPane from "@/components/ui/PreviewPane";
import Tabs from "@/components/ui/Tabs";
import Docs from "@/components/sections/Docs";
import type { Guest } from "@/types/guest";

type RenderedEmail = {
  to: string;
  name?: string;
  subject?: string;
  html: string;
};

type TabId = "guests" | "preview" | "docs";

type StepConfig = {
  selector: string;
  title: string;
  description: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
};

const tabSelector = (id: string) =>
  `[role="tab"][aria-controls="panel-${id}"]`;

const TAB_TUTORIALS: Record<TabId, StepConfig[]> = {
  guests: [
    {
      selector: tabSelector("guests"),
      title: "Recipients",
      description: "Batchmail now pulls directly from your guest list for this event.",
      side: "bottom",
      align: "start",
    },
    {
      selector: "#tutorial-guest-table",
      title: "Guest Snapshot",
      description: "Review the recipients pulled from the Guests tab before templating your message.",
      side: "right",
      align: "center",
    },
  ],
  preview: [
    {
      selector: tabSelector("preview"),
      title: "Preview Tab",
      description: "Everything before send lives here: env checks, recipients, subjects, previews, and batches.",
      side: "bottom",
      align: "center",
    },
    {
      selector: "#tutorial-env-controls",
      title: "Sender Environment",
      description: "Select your system variant, upload/paste a .env override, or reupload credentials before sending.",
      side: "bottom",
      align: "start",
    },
    {
      selector: "#tutorial-recipient-list",
      title: "Recipient Snapshot",
      description: "Double-check who will receive the run—scroll this list to verify every mapped email.",
      side: "right",
      align: "center",
    },
    {
      selector: "#tutorial-subject-editor",
      title: "Subject Controls",
      description: "Change the subject to anything you want and inject variables like {{ name }} on the fly.",
      side: "left",
      align: "start",
    },
    {
      selector: "#tutorial-preview-frame",
      title: "Live Preview",
      description: "Flip through rows to see exactly what each recipient will receive before exporting or sending.",
      side: "left",
      align: "center",
    },
    {
      selector: "#tutorial-batch-preview",
      title: "Batch Planner",
      description: "Batch size adapts automatically so you can pace sends and review recipient grouping.",
      side: "top",
      align: "start",
    },
  ],
  docs: [
    {
      selector: tabSelector("docs"),
      title: "Documentation Tab",
      description: "Need reminders? This section aggregates tips, FAQ, and troubleshooting steps.",
      side: "bottom",
      align: "center",
    },
    {
      selector: "#tutorial-docs",
      title: "Docs Stack",
      description: "Skim release notes, watch demos, or follow links to advanced workflows.",
      side: "right",
      align: "start",
    },
  ],
};

const buildSteps = (configs: StepConfig[]): DriveStep[] =>
  configs.reduce<DriveStep[]>((acc, { selector, title, description, side, align }) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) return acc;
    acc.push({
      element,
      popover: {
        title,
        description,
        side,
        align,
      },
    });
    return acc;
  }, []);

type BatchmailWorkspaceProps = {
  guests: Guest[];
};

const buildGuestCsv = (guests: Guest[]): ParsedCsv | null => {
  if (!guests || guests.length === 0) return null;
  const headers = [
    "registrant_id",
    "event_id",
    "email",
    "first_name",
    "last_name",
    "name",
    "terms_approval",
    "is_registered",
  ];
  const rows = guests.map((guest) => ({
    registrant_id: guest.registrant_id,
    event_id: guest.event_id,
    email: guest.email,
    first_name: guest.first_name,
    last_name: guest.last_name,
    name: `${guest.first_name} ${guest.last_name}`.trim(),
    terms_approval: guest.terms_approval ? "true" : "false",
    is_registered: guest.is_registered ? "true" : "false",
  }));
  return { headers, rows, rowCount: rows.length };
};

export default function BatchmailWorkspace({ guests }: BatchmailWorkspaceProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const csv = useMemo(() => buildGuestCsv(guests), [guests]);
  const mapping = useMemo<CsvMapping | null>(() => {
    if (!csv) return null;
    return { recipient: "email", name: "name", subject: null };
  }, [csv]);
  const [template, setTemplate] = useState<string>("");
  const [subjectTemplate, setSubjectTemplate] = useState<string>("{{ subject }}");
  const totalCount = useMemo(() => (csv?.rowCount ?? 0), [csv]);
  const templateReady = template.trim().length > 0;

  const startTabTutorial = useCallback((tabId: TabId) => {
    if (typeof window === "undefined") return;
    const configs = TAB_TUTORIALS[tabId];
    if (!configs || configs.length === 0) return;
    const tabButton = document.querySelector<HTMLButtonElement>(tabSelector(tabId));
    if (tabButton && tabButton.getAttribute("aria-selected") !== "true") {
      tabButton.click();
    }
    requestAnimationFrame(() => {
      const steps = buildSteps(configs);
      if (!steps.length) return;
      driver({
        showProgress: true,
        allowClose: true,
        overlayOpacity: 0.55,
        animate: true,
        steps,
      }).drive();
    });
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/email-template/adph.html")
      .then((res) => res.text())
      .then((html) => {
        if (!active) return;
        setTemplate(html);
      })
      .catch(() => {
        if (!active) return;
        setTemplate("");
      });
    return () => {
      active = false;
    };
  }, []);

  const onExportJson = async (htmlRender: (row: Record<string, string>) => string) => {
    if (!csv || !mapping) return;
    const nunjucks = await import("nunjucks");
    const payload: RenderedEmail[] = csv.rows
      .filter((r: Record<string, string>) => r[mapping.recipient])
      .map((r: Record<string, string>) => ({
        to: String(r[mapping.recipient]),
        name: r[mapping.name] ? String(r[mapping.name]) : undefined,
        subject: subjectTemplate?.trim()
          ? nunjucks.renderString(subjectTemplate, { ...r, name: r[mapping.name], recipient: r[mapping.recipient] })
          : (mapping.subject ? String(r[mapping.subject]) : undefined),
        html: htmlRender(r),
      }));

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "batchmail-payload.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="batchmail-dark space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3 text-primary font-morganite">
          BatchMail
          <span className="keep-light-pill text-[12px] font-semibold px-2.5 py-1 rounded bg-white-100 text-slate-900 border border-slate-300 tracking-widest uppercase font-urbanist">
            ADPH
          </span>
        </h1>
        <p className="text-sm text-secondary">
          Use the Guests tab list with the ADPH template, preview, and export. {totalCount ? `(${totalCount} recipients)` : ""}
        </p>
      </header>

      <div id="tutorial-tabs" className="rounded-xl border border-primary/20 bg-white p-4 shadow-sm">
        <Tabs
          items={[
            {
              id: "guests",
              label: "Guests",
              content: (
                <div className="space-y-4" id="tutorial-guests-stack">
                  <section className="rounded-lg border border-primary/20 bg-white p-4" id="tutorial-guest-summary">
                    <h2 className="text-lg font-semibold text-primary">Recipients</h2>
                    <p className="text-sm text-secondary">
                      This list is pulled directly from the Guests tab for the current event. Update guests there, then return here to send.
                    </p>
                    <div className="text-xs text-secondary mt-2">Total recipients: {totalCount}</div>
                  </section>
                  <section className="rounded-lg border border-primary/20 bg-white overflow-hidden" id="tutorial-guest-table">
                    {guests.length === 0 ? (
                      <div className="p-6 text-sm text-secondary">No guests yet. Add or import guests in the Guests tab to enable batch mail.</div>
                    ) : (
                      <div className="max-h-[380px] overflow-auto">
                        <table className="min-w-full text-sm">
                          <thead className="sticky top-0 bg-white-100">
                            <tr>
                              <th className="px-4 py-2 text-left font-semibold text-primary">Name</th>
                              <th className="px-4 py-2 text-left font-semibold text-primary">Email</th>
                              <th className="px-4 py-2 text-left font-semibold text-primary">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {guests.map((guest) => (
                              <tr key={guest.registrant_id} className="border-t border-primary/10">
                                <td className="px-4 py-2 text-secondary">
                                  {guest.first_name} {guest.last_name}
                                </td>
                                <td className="px-4 py-2 text-secondary">{guest.email}</td>
                                <td className="px-4 py-2 text-secondary">
                                  {guest.is_registered ? "Registered" : "Pending"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                </div>
              ),
            },
            {
              id: "preview",
              label: "Preview & Export",
              content: (
                <div id="tutorial-preview-pane">
                  <div className="flex justify-end pb-3">
                    <button
                      type="button"
                      onClick={() => startTabTutorial("preview")}
                      className="text-xs font-semibold rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-primary hover:bg-primary/10"
                    >
                      Preview Tutorial
                    </button>
                  </div>
                  <PreviewPane
                    csv={csv}
                    mapping={mapping}
                    template={template}
                    onExportJson={onExportJson}
                    subjectTemplate={subjectTemplate}
                    onSubjectChange={setSubjectTemplate}
                  />
                </div>
              ),
            },
            {
              id: "docs",
              label: "Documentation",
              content: (
                <div className="space-y-4" id="tutorial-docs">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => startTabTutorial("docs")}
                      className="text-xs font-semibold rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-primary hover:bg-primary/10"
                    >
                      Docs Tutorial
                    </button>
                  </div>
                  <Docs />
                </div>
              ),
            },
          ]}
          initialId={(() => {
            const raw = searchParams.get("tab") || "guests";
            if (raw === "csv") return "guests";
            if (raw === "template") return "preview";
            if (raw === "preview" || raw === "docs" || raw === "guests") return raw;
            return "guests";
          })()}
          isDisabled={(id) => {
            if (id === "preview") {
              return !csv || !mapping || !templateReady;
            }
            return false;
          }}
          getDisabledTitle={(id) => {
            if (id === "preview" && (!csv || !mapping)) return "Add guests first to preview or send.";
            if (id === "preview" && !templateReady) return "Loading the ADPH template.";
            return undefined;
          }}
          onChange={(id) => {
            const usp = new URLSearchParams(Array.from(searchParams.entries()));
            usp.set("tab", id);
            router.replace(`${pathname}?${usp.toString()}`);
          }}
        />
      </div>
    </div>
  );
}
