import { Guest } from "@/types/guest";
import { GuestTableHeader } from "./GuestTableHeader";
import { GuestTableRow } from "./GuestTableRow";

interface GuestTableProps {
  guests: Guest[];
  selectedGuestIds: Set<string>;
  isPending: boolean;
  allSelected: boolean;
  someSelected: boolean;
  showSelectMenu: boolean;
  selectedCount: number;
  onSelectAll: (checked: boolean) => void;
  onSelectGuest: (guestId: string, checked: boolean) => void;
  onToggleSelectMenu: () => void;
  onSelectByStatus: (status: "all" | "registered" | "pending") => void;
  onDeselectAll: () => void;
  onStatusChange: (guestId: string, newStatus: string) => void;
  onViewAnswers: (guest: Guest) => void;
  onGenerateQR: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
  onBulkGenerateQR: () => void;
}

/**
 * Guest table component
 * Responsibilities: Render the table structure with header and rows
 */
export function GuestTable({
  guests,
  selectedGuestIds,
  isPending,
  allSelected,
  someSelected,
  showSelectMenu,
  selectedCount,
  onSelectAll,
  onSelectGuest,
  onToggleSelectMenu,
  onSelectByStatus,
  onDeselectAll,
  onStatusChange,
  onViewAnswers,
  onGenerateQR,
  onDelete,
  onBulkGenerateQR,
}: GuestTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <GuestTableHeader
          allSelected={allSelected}
          someSelected={someSelected}
          onSelectAll={onSelectAll}
          showSelectMenu={showSelectMenu}
          onToggleSelectMenu={onToggleSelectMenu}
          onSelectByStatus={onSelectByStatus}
          onDeselectAll={onDeselectAll}
          selectedCount={selectedCount}
          onBulkGenerateQR={onBulkGenerateQR}
        />
        <tbody>
          {guests.map((guest) => (
            <GuestTableRow
              key={guest.registrant_id}
              guest={guest}
              isSelected={selectedGuestIds.has(guest.registrant_id)}
              isPending={isPending}
              onSelectGuest={onSelectGuest}
              onStatusChange={onStatusChange}
              onViewAnswers={onViewAnswers}
              onGenerateQR={onGenerateQR}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
