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

type TabId = "guests" | "message" | "preview" | "docs";

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
  message: [],
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
      description: "Sender uses the Arduino Day Philippines account configured in the app env.",
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
    email: guest.users?.email || '',
    first_name: guest.users?.first_name || '',
    last_name: guest.users?.last_name || '',
    name: `${guest.users?.first_name || ''} ${guest.users?.last_name || ''}`.trim(),
    terms_approval: guest.terms_approval ? "true" : "false",
    is_registered: guest.is_registered ? "true" : "false",
  }));
  return { headers, rows, rowCount: rows.length };
};

export default function BatchmailWorkspace({ guests }: BatchmailWorkspaceProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [recipientScope, setRecipientScope] = useState<"all" | "registered" | "pending">("all");
  const filteredGuests = useMemo(() => {
    if (recipientScope === "all") return guests;
    if (recipientScope === "registered") {
      return guests.filter((guest) => guest.is_registered);
    }
    return guests.filter((guest) => !guest.is_registered);
  }, [guests, recipientScope]);
  const recipientCountLabel = useMemo(() => {
    if (recipientScope === "registered") return "Registered";
    if (recipientScope === "pending") return "Pending";
    return "All";
  }, [recipientScope]);
  const csv = useMemo(() => buildGuestCsv(filteredGuests), [filteredGuests]);
  const mapping = useMemo<CsvMapping | null>(() => {
    if (!csv) return null;
    return { recipient: "email", name: "name", subject: null };
  }, [csv]);
  const [template, setTemplate] = useState<string>("");
  const [subjectTemplate, setSubjectTemplate] = useState<string>("{{ subject }}");
  const [headerContent, setHeaderContent] = useState<string>("Hi {{ recipient }},");
  const [messageContent, setMessageContent] = useState<string>("");
  const messageContentHtml = useMemo(
    () => messageContent.replace(/\n/g, "<br />"),
    [messageContent]
  );
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
          ? nunjucks.renderString(subjectTemplate, {
              ...r,
              content: messageContentHtml,
              header: headerContent,
              name: r[mapping.name],
              recipient: r[mapping.recipient],
            })
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
                    {filteredGuests.length === 0 ? (
                      <div className="p-6 text-sm text-secondary">
                        {guests.length === 0
                          ? "No guests yet. Add or import guests in the Guests tab to enable batch mail."
                          : "No guests match the selected recipient filters."}
                      </div>
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
                            {filteredGuests.map((guest) => (
                              <tr key={guest.registrant_id} className="border-t border-primary/10">
                                <td className="px-4 py-2 text-secondary">
                                  {guest.users?.first_name || 'N/A'} {guest.users?.last_name || ''}
                                </td>
                                <td className="px-4 py-2 text-secondary">{guest.users?.email || 'No email'}</td>
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
              id: "message",
              label: "Message",
              content: (
                <div className="space-y-4">
                  <section className="rounded-lg border border-primary/20 bg-white p-4">
                    <h2 className="text-lg font-semibold text-primary">Recipients</h2>
                    <p className="text-sm text-secondary">
                      Choose which guests should receive this message.
                    </p>
                    <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                      <div className="relative">
                        <select
                          value={recipientScope}
                          onChange={(event) =>
                            setRecipientScope(event.target.value as "all" | "registered" | "pending")
                          }
                          className="w-full appearance-none rounded-xl border border-primary/30 bg-white px-3 py-2.5 pr-11 text-sm text-primary shadow-sm transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 focus:outline-none hover:border-primary/50"
                        >
                          <option value="all">All guests</option>
                          <option value="registered">Registered only</option>
                          <option value="pending">Pending only</option>
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary/60">
                          ▾
                        </span>
                      </div>
                      <div className="flex items-center justify-start md:justify-end">
                        <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                          {recipientCountLabel} · {totalCount}
                        </span>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-lg border border-primary/20 bg-white p-4">
                    <h2 className="text-lg font-semibold text-primary">Subject</h2>
                    <p className="text-xs text-secondary mb-2">
                      You can use variables like {"{{ name }}"} or {"{{ recipient }}"}.
                    </p>
                    <input
                      type="text"
                      value={subjectTemplate}
                      onChange={(event) => setSubjectTemplate(event.target.value)}
                      placeholder="Enter subject line"
                      className="w-full rounded border border-primary/20 px-3 py-2 text-sm text-primary"
                    />
                  </section>

                  <section className="rounded-lg border border-primary/20 bg-white p-4">
                    <h2 className="text-lg font-semibold text-primary">Header</h2>
                    <p className="text-xs text-secondary mb-2">
                      This line appears at the top of the email body. You can use
                      variables like {"{{ recipient }}"}.
                    </p>
                    <input
                      type="text"
                      value={headerContent}
                      onChange={(event) => setHeaderContent(event.target.value)}
                      placeholder="Hi {{ recipient }},"
                      className="w-full rounded border border-primary/20 px-3 py-2 text-sm text-primary"
                    />
                  </section>

                  <section className="rounded-lg border border-primary/20 bg-white p-4">
                    <h2 className="text-lg font-semibold text-primary">Message</h2>
                    <p className="text-xs text-secondary mb-2">
                      The message is injected into the ADPH template. New lines are preserved.
                    </p>
                    <textarea
                      value={messageContent}
                      onChange={(event) => setMessageContent(event.target.value)}
                      placeholder="Write the email content here."
                      rows={8}
                      className="w-full rounded border border-primary/20 px-3 py-2 text-sm text-primary"
                    />
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
                    extraContext={{ content: messageContentHtml, header: headerContent }}
                    showSubjectEditor={false}
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
            if (raw === "preview" || raw === "docs" || raw === "guests" || raw === "message") return raw;
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
