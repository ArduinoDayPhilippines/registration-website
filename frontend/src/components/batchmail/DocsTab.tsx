import Docs from "@/components/sections/Docs";
import type { TabId } from "@/components/batchmail/tutorial";

type DocsTabProps = {
  startTabTutorial: (tabId: TabId) => void;
};

export default function DocsTab({ startTabTutorial }: DocsTabProps) {
  return (
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
  );
}
