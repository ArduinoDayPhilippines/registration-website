"use client";

import { Guest } from "@/types/guest";
import { EventData } from "@/types/event";
import { useGuestFiltering } from "@/hooks/guest/use-guest-filtering";
import { useGuestSelection } from "@/hooks/guest/use-guest-selection";
import { useGuestActions } from "@/hooks/guest/use-guest-actions";
import { useGuestModal } from "@/hooks/guest/use-guest-modal";
import { GuestAnswersModal } from "./modals/GuestAnswersModal";
import { GuestListHeader } from "./list/GuestListHeader";
import { GuestListSearchFilter } from "./list/GuestListSearchFilter";
import { GuestTable } from "./list/GuestTable";
import { GuestListEmpty } from "./list/GuestListEmpty";

interface GuestListSectionProps {
  guests: Guest[];
  slug: string;
  onRefresh: () => void;
  event: EventData;
}

export function GuestListSection({
  guests,
  slug,
  onRefresh,
  event,
}: GuestListSectionProps) {
  const {
    searchQuery,
    statusFilter,
    filteredGuests,
    setSearchQuery,
    setStatusFilter,
  } = useGuestFiltering(guests);

  const {
    selectedGuestIds,
    showSelectMenu,
    allSelected,
    someSelected,
    selectedCount,
    handleSelectAll,
    handleSelectGuest,
    handleSelectByStatus,
    handleDeselectAll,
    toggleSelectMenu,
    getSelectedGuests,
  } = useGuestSelection(filteredGuests, guests);

  const {
    selectedGuest,
    showAnswersModal,
    openAnswersModal,
    closeAnswersModal,
  } = useGuestModal();

  const {
    isPending,
    handleStatusChange,
    handleDelete,
    handleExport,
    handleGenerateQR,
    handleBulkGenerateQR,
  } = useGuestActions({ slug, onRefresh, getSelectedGuests });

  return (
    <>
      {showAnswersModal && selectedGuest && (
        <GuestAnswersModal
          guest={selectedGuest}
          event={event}
          onClose={closeAnswersModal}
        />
      )}

      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-white/10">
          <GuestListHeader guestCount={guests.length} onExport={handleExport} />

          <GuestListSearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onExport={handleExport}
            isPending={isPending}
            guestCount={guests.length}
          />
        </div>

        <div className="p-4 md:p-6">
          {filteredGuests.length === 0 ? (
            <GuestListEmpty hasGuests={guests.length > 0} />
          ) : (
            <GuestTable
              guests={filteredGuests}
              selectedGuestIds={selectedGuestIds}
              isPending={isPending}
              allSelected={allSelected}
              someSelected={someSelected}
              showSelectMenu={showSelectMenu}
              selectedCount={selectedCount}
              onSelectAll={handleSelectAll}
              onSelectGuest={handleSelectGuest}
              onToggleSelectMenu={toggleSelectMenu}
              onSelectByStatus={handleSelectByStatus}
              onDeselectAll={handleDeselectAll}
              onStatusChange={handleStatusChange}
              onViewAnswers={openAnswersModal}
              onGenerateQR={handleGenerateQR}
              onDelete={handleDelete}
              onBulkGenerateQR={handleBulkGenerateQR}
            />
          )}
        </div>
      </div>
    </>
  );
}
