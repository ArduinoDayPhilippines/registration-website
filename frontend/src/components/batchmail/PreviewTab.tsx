import type { CsvMapping, ParsedCsv } from "@/components/ui/CsvUploader";
import PreviewPane from "@/components/ui/PreviewPane";
import type { TabId } from "@/components/batchmail/tutorial";

type PreviewTabProps = {
  csv: ParsedCsv | null;
  mapping: CsvMapping | null;
  template: string;
  onExportJson: (htmlRender: (row: Record<string, string>) => string) => Promise<void>;
  subjectConfirmed: string;
  messageContentHtml: string;
  headerConfirmed: string;
  startTabTutorial: (tabId: TabId) => void;
};

export default function PreviewTab({
  csv,
  mapping,
  template,
  onExportJson,
  subjectConfirmed,
  messageContentHtml,
  headerConfirmed,
  startTabTutorial,
}: PreviewTabProps) {
  return (
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
        subjectTemplate={subjectConfirmed}
        extraContext={{ content: messageContentHtml, header: headerConfirmed }}
        showSubjectEditor={false}
      />
    </div>
  );
}
