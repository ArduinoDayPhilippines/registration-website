"use client";

import React, { useState, useTransition } from "react";
import {
  Users,
  Download,
  Eye,
  Trash2,
  QrCode,
} from "lucide-react";
import { Guest } from "@/types/guest";
import { EventData } from "@/types/event";
import { updateGuestStatus, deleteGuest, exportGuestsToCSV } from "./guest-actions";
import { generateQRCodeTicket } from "./qr-generator";
import { GuestAnswersModal } from "./GuestAnswersModal";

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
  const getQuestionText = (answerKey: string): string => {
    const match = answerKey.match(/\d+$/);
    if (match && event.questions && Array.isArray(event.questions)) {
      const index = parseInt(match[0]) - 1; // Convert 1-based to 0-based index
      if (index >= 0 && index < event.questions.length) {
        return event.questions[index].text;
      }
    }
    return answerKey; 
  };

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

      // Create QR code data - can include registrant_id and other info
      const qrData = JSON.stringify({
        registrant_id: guest.registrant_id,
        email: guest.users.email,
        name: `${guest.users.first_name || ''} ${guest.users.last_name || ''}`.trim(),
        event_slug: slug,
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="font-urbanist text-lg md:text-xl font-bold text-white">
            Guest List
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={guests.length === 0}
              className="font-urbanist px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search guests by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-urbanist w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="font-urbanist px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="all" style={{ backgroundColor: '#0a1520', color: '#ffffff' }}>All Status</option>
              <option value="registered" style={{ backgroundColor: '#0a1520', color: '#ffffff' }}>Registered</option>
              <option value="pending" style={{ backgroundColor: '#0a1520', color: '#ffffff' }}>Pending</option>
            </select>
            <button
              onClick={handleExport}
              disabled={isPending || guests.length === 0}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} className="text-white/60" />
            </button>
          </div>
        </div>
      </div>

      {/* Guest List Content */}
      <div className="p-4 md:p-6">
        {filteredGuests.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Users size={24} className="text-white/40 md:w-8 md:h-8" />
            </div>
            <h3 className="font-urbanist text-sm md:text-base font-medium text-white mb-2">
              {guests.length === 0 ? "No Guests Yet" : "No Matching Guests"}
            </h3>
            <p className="font-urbanist text-white/60 text-xs md:text-sm max-w-md mb-4 px-4">
              {guests.length === 0
                ? "Share the event or invite people to get started!"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          /* Guest Table */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="font-urbanist text-left text-xs md:text-sm font-medium text-white/60 pb-3 px-2">
                    Name
                  </th>
                  <th className="font-urbanist text-left text-xs md:text-sm font-medium text-white/60 pb-3 px-2 hidden md:table-cell">
                    Email
                  </th>
                  <th className="font-urbanist text-left text-xs md:text-sm font-medium text-white/60 pb-3 px-2 hidden lg:table-cell">
                    Terms Accepted
                  </th>
                  <th className="font-urbanist text-left text-xs md:text-sm font-medium text-white/60 pb-3 px-2">
                    Status
                  </th>
                  <th className="font-urbanist text-right text-xs md:text-sm font-medium text-white/60 pb-3 px-2">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest) => (
                  <tr
                    key={guest.registrant_id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="font-urbanist text-white text-sm py-4 px-2">
                      <div>
                        <p className="font-medium">
                          {guest.users?.first_name || 'N/A'} {guest.users?.last_name || ''}
                        </p>
                        <p className="text-xs text-white/60 md:hidden">
                          {guest.users?.email || 'No email'}
                        </p>
                      </div>
                    </td>
                    <td className="font-urbanist text-white/80 text-sm py-4 px-2 hidden md:table-cell">
                      {guest.users?.email || 'No email'}
                    </td>
                    <td className="font-urbanist text-white/80 text-sm py-4 px-2 hidden lg:table-cell">
                      {guest.terms_approval ? (
                        <span className="text-green-400">Yes</span>
                      ) : (
                        <span className="text-red-400">No</span>
                      )}
                    </td>
                    <td className="py-4 px-2">
                      <select
                        value={guest.is_registered ? "registered" : "pending"}
                        onChange={(e) => handleStatusChange(guest.registrant_id, e.target.value)}
                        disabled={isPending}
                        className={`font-urbanist px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                          guest.is_registered
                            ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
                        }`}
                      >
                        <option value="registered" className="bg-[#0a1520] text-green-400">
                          Registered
                        </option>
                        <option value="pending" className="bg-[#0a1520] text-yellow-400">
                          Pending
                        </option>
                      </select>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedGuest(guest);
                            setShowAnswersModal(true);
                          }}
                          disabled={isPending}
                          className="p-1.5 hover:bg-cyan-500/20 rounded text-cyan-400 transition-colors disabled:opacity-50"
                          title="View Answers"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleGenerateQR(guest)}
                          disabled={isPending}
                          className="p-1.5 hover:bg-purple-500/20 rounded text-purple-400 transition-colors disabled:opacity-50"
                          title="Generate QR Code Ticket"
                        >
                          <QrCode size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest.registrant_id)}
                          disabled={isPending}
                          className="p-1.5 hover:bg-red-500/20 rounded text-red-400 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
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
