"use client";

import React, { useState, useTransition } from "react";
import { Guest } from "@/types/guest";
import { EventData } from "@/types/event";
import { updateGuestStatus, deleteGuest, exportGuestsToCSV } from "./guest-actions";
import { GuestAnswersModal } from "./GuestAnswersModal";
import { GuestListHeader } from "./GuestListHeader";
import { GuestListSearchFilter } from "./GuestListSearchFilter";
import { GuestTableHeader } from "./GuestTableHeader";
import { GuestTableRow } from "./GuestTableRow";
import { GuestListEmpty } from "./GuestListEmpty";

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
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showAnswersModal, setShowAnswersModal] = useState(false);
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const handleDeleteGuest = (guestId: string) => {
    if (!confirm("Are you sure you want to remove this guest?")) return;

    startTransition(async () => {
      const result = await deleteGuest(guestId, slug);

      if (result.success) {
        onRefresh();
      } else {
        alert(result.error || "Failed to delete guest");
      }
    });
  };

  const handleStatusChange = (guestId: string, newStatus: string) => {
    const isRegistered = newStatus === "registered";
    
    startTransition(async () => {
      const result = await updateGuestStatus(guestId, isRegistered, slug);

      if (result.success) {
        onRefresh();
      } else {
        alert(result.error || "Failed to update status");
      }
    });
  };

  const handleExport = async () => {
    const result = await exportGuestsToCSV(slug);

    if (result.success && result.csvData) {
      const blob = new Blob([result.csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `event-guests-${slug}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert(result.error || "Failed to export guests");
    }
  };

  const handleGenerateQR = async (guest: Guest) => {
    try {
      // Check if users data exists
      if (!guest.users) {
        throw new Error('User data not available');
      }

      // Create QR code data
      const qrData = JSON.stringify({
        name: `${guest.users.first_name || ''} ${guest.users.last_name || ''}`.trim(),
        email: guest.users.email,
        registrant_id: guest.registrant_id,
        event_id: guest.event_id
      });

      // Use QRCode library to generate QR code
      const QRCode = (await import('qrcode')).default;
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      // Create a download link
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `ticket-${guest.users.first_name || 'guest'}-${guest.users.last_name || ''}-${guest.registrant_id.slice(0, 8)}.png`;
      link.click();
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
    }
  };

  const handleBulkGenerateQR = async () => {
    try {
      const selectedGuests = guests.filter(g => selectedGuestIds.has(g.registrant_id));
      
      if (selectedGuests.length === 0) {
        alert('No guests selected');
        return;
      }

      const QRCode = (await import('qrcode')).default;
      
      // Generate QR codes for all selected guests
      for (const guest of selectedGuests) {
        if (!guest.users) continue;

        // Create unique QR code data based on registrant_id and event_id
        const qrData = JSON.stringify({
          registrant_id: guest.registrant_id,
          event_id: guest.event_id,
          email: guest.users.email,
          name: `${guest.users.first_name || ''} ${guest.users.last_name || ''}`.trim(),
          event_slug: slug,
        });

        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });

        // Create a download link for each QR code
        const link = document.createElement('a');
        link.href = qrCodeDataUrl;
        link.download = `ticket-${guest.users.first_name || 'guest'}-${guest.users.last_name || ''}-${guest.registrant_id.slice(0, 8)}.png`;
        link.click();
        
        // Small delay between downloads to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      alert(`Generated ${selectedGuests.length} QR code${selectedGuests.length > 1 ? 's' : ''} successfully!`);
    } catch (error) {
      console.error('Error generating bulk QR codes:', error);
      alert('Failed to generate QR codes');
    }
  };

  // Filter guests
  const filteredGuests = guests.filter((guest) => {
    // Check if users data exists
    if (!guest.users) return false;

    const matchesSearch =
      guest.users.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.users.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.users.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || 
      (statusFilter === "registered" && guest.is_registered) ||
      (statusFilter === "pending" && !guest.is_registered);

    return matchesSearch && matchesStatus;
  });

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredGuests.map(g => g.registrant_id));
      setSelectedGuestIds(allIds);
    } else {
      setSelectedGuestIds(new Set());
    }
  };

  // Handle select by status
  const handleSelectByStatus = (status: 'all' | 'registered' | 'pending') => {
    let guestsToSelect: Guest[] = [];
    
    if (status === 'all') {
      guestsToSelect = filteredGuests;
    } else if (status === 'registered') {
      guestsToSelect = filteredGuests.filter(g => g.is_registered);
    } else if (status === 'pending') {
      guestsToSelect = filteredGuests.filter(g => !g.is_registered);
    }
    
    const selectedIds = new Set(guestsToSelect.map(g => g.registrant_id));
    setSelectedGuestIds(selectedIds);
    setShowSelectMenu(false);
  };

  // Handle individual selection
  const handleSelectGuest = (guestId: string, checked: boolean) => {
    const newSelected = new Set(selectedGuestIds);
    if (checked) {
      newSelected.add(guestId);
    } else {
      newSelected.delete(guestId);
    }
    setSelectedGuestIds(newSelected);
  };

  // Check if all filtered guests are selected
  const allSelected = filteredGuests.length > 0 && 
    filteredGuests.every(g => selectedGuestIds.has(g.registrant_id));
  
  const someSelected = selectedGuestIds.size > 0 && !allSelected;

  return (
    <>
      {/* Answers Modal */}
      {showAnswersModal && selectedGuest && (
        <GuestAnswersModal
          guest={selectedGuest}
          event={event}
          onClose={() => {
            setShowAnswersModal(false);
            setSelectedGuest(null);
          }}
        />
      )}

      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-white/10">
          <GuestListHeader 
            guestCount={guests.length}
            onExport={handleExport}
          />

          {/* Search and Filter Bar */}
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

        {/* Guest List Content */}
        <div className="p-4 md:p-6">
          {filteredGuests.length === 0 ? (
            <GuestListEmpty hasGuests={guests.length > 0} />
          ) : (
            /* Guest Table */
            <div className="overflow-x-auto">
              <table className="w-full">
                <GuestTableHeader
                  allSelected={allSelected}
                  someSelected={someSelected}
                  onSelectAll={handleSelectAll}
                  showSelectMenu={showSelectMenu}
                  onToggleSelectMenu={() => setShowSelectMenu(!showSelectMenu)}
                  onSelectByStatus={handleSelectByStatus}
                  onDeselectAll={() => {
                    setSelectedGuestIds(new Set());
                    setShowSelectMenu(false);
                  }}
                  selectedCount={selectedGuestIds.size}
                  onBulkGenerateQR={handleBulkGenerateQR}
                />
                <tbody>
                  {filteredGuests.map((guest) => (
                    <GuestTableRow
                      key={guest.registrant_id}
                      guest={guest}
                      isSelected={selectedGuestIds.has(guest.registrant_id)}
                      isPending={isPending}
                      onSelectGuest={handleSelectGuest}
                      onStatusChange={handleStatusChange}
                      onViewAnswers={(g) => {
                        setSelectedGuest(g);
                        setShowAnswersModal(true);
                      }}
                      onGenerateQR={handleGenerateQR}
                      onDelete={handleDeleteGuest}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
