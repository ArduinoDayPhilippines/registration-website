import { Download } from "lucide-react";

interface GuestListHeaderProps {
  guestCount: number;
  onExport: () => void;
}

export function GuestListHeader({ guestCount, onExport }: GuestListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <h2 className="font-urbanist text-lg md:text-xl font-bold text-white">
        Guest List
      </h2>
      <div className="flex gap-2">
        <button
          onClick={onExport}
          disabled={guestCount === 0}
          className="font-urbanist px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
}
