import { useCallback } from "react";
import { driver } from "driver.js";
import type { DriveStep } from "driver.js";

export type TabId = "guests" | "message" | "preview" | "docs";

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

export const useBatchmailTutorial = () =>
  useCallback((tabId: TabId) => {
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
