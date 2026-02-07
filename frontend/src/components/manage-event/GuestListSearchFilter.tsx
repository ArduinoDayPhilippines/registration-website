import { Download } from "lucide-react";

interface GuestListSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onExport: () => void;
  isPending: boolean;
  guestCount: number;
}

export function GuestListSearchFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onExport,
  isPending,
  guestCount,
}: GuestListSearchFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search guests by name or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="font-urbanist w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="font-urbanist px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
        >
          <option value="all" style={{ backgroundColor: '#0a1520', color: '#ffffff' }}>All Status</option>
          <option value="registered" style={{ backgroundColor: '#0a1520', color: '#ffffff' }}>Registered</option>
          <option value="pending" style={{ backgroundColor: '#0a1520', color: '#ffffff' }}>Pending</option>
        </select>
        <button
          onClick={onExport}
          disabled={isPending || guestCount === 0}
          className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} className="text-white/60" />
        </button>
      </div>
    </div>
  );
}
