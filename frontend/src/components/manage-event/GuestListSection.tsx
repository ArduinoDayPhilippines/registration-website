"use client";

import React, { useState, useTransition } from "react";
import {
  Users,
  Download,
  Eye,
  Trash2,
  Check,
  X,
  XCircle,
} from "lucide-react";
import { Guest } from "@/types/guest";
import { EventData } from "@/types/event";
import { eventManage } from "../../app/event/[slug]/manage/actions";

interface GuestListSectionProps {
  guests: Guest[];
  slug: string;
  onRefresh: () => void;
  event: EventData;
}

// Registrants from the table - removed status update since registrants table
// doesn't have a status column. This can be re-implemented if needed.
async function updateGuestStatus(
  guestId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  // Placeholder - implement if status tracking is needed
  console.log("Update guest status:", guestId, status);
  return { success: true };
}

async function deleteGuest(
  guestId: string
): Promise<{ success: boolean; error?: string }> {
  const formData = new FormData();
  formData.append("operation", "deleteGuest");
  formData.append("guestId", guestId);

  await eventManage(formData);
  return { success: true };
}

async function exportGuestsToCSV(
  slug: string
): Promise<{ success: boolean; error?: string; csvData?: string }> {
  const formData = new FormData();
  formData.append("operation", "exportGuestsToCSV");
  formData.append("slug", slug);

  // The server action is expected to eventually return CSV data.
  // Until then, we just call it and return a failure so the UI
  // can display a friendly error instead of crashing.
  try {
    const result = (await eventManage(formData)) as
      | { success: boolean; error?: string; csvData?: string }
      | undefined;
    if (result?.success && result.csvData) {
      return result;
    }
    return { success: false, error: result?.error ?? "Export not implemented" };
  } catch (error) {
    console.error("Error exporting guests:", error);
    return { success: false, error: "Failed to export guests" };
  }
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

  // Create a map of answer keys (a1, a2, a3) to question text
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
      const result = await deleteGuest(guestId);

      if (result.success) {
        onRefresh();
      } else {
        alert(result.error || "Failed to delete guest");
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

  // Filter guests
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase());

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setShowAnswersModal(false);
              setSelectedGuest(null);
            }}
          />

          {/* Modal */}
          <div className="relative w-full max-w-3xl bg-gradient-to-br from-[#0a1f14] via-[#0a1520] to-[#120c08] border border-white/10 rounded-3xl max-h-[85vh] overflow-hidden flex flex-col">
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-start justify-between p-6 md:p-8 border-b border-white/10">
              <div className="flex-1 pr-4">
                <h3 className="font-urbanist text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                  Form Answers
                </h3>
                <p className="font-urbanist text-sm text-white/60">
                  {selectedGuest.first_name} {selectedGuest.last_name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAnswersModal(false);
                  setSelectedGuest(null);
                }}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <XCircle size={20} className="text-white/70" />
              </button>
            </div>

            {/* Content */}
            <div className="relative flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
              {selectedGuest.form_answers &&
              typeof selectedGuest.form_answers === "object" &&
              Object.keys(selectedGuest.form_answers).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(selectedGuest.form_answers).map(
                    ([answerKey, answer], index) => {
                      const questionText = getQuestionText(answerKey);
                      return (
                        <div
                          key={index}
                          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-primary/30 transition-all group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 border border-primary/30 flex items-center justify-center text-white text-sm font-bold shadow-[0_0_15px_rgba(0,128,128,0.3)]">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-urbanist text-sm font-medium text-white/60 mb-2">
                                {questionText}
                              </p>
                              <p className="font-urbanist text-base text-white leading-relaxed">
                                {String(answer)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-white/30" />
                  </div>
                  <p className="font-urbanist text-white/50 text-sm">
                    No form answers available
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="relative p-6 md:p-8 border-t border-white/10 bg-black/20">
              <button
                onClick={() => {
                  setShowAnswersModal(false);
                  setSelectedGuest(null);
                }}
                className="w-full font-urbanist px-6 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl text-white text-sm font-bold uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(0,128,128,0.3)] hover:shadow-[0_0_30px_rgba(0,128,128,0.4)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
              <option value="all">All Status</option>
              <option value="registered">Registered</option>
              <option value="pending">Pending</option>
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
                          {guest.first_name} {guest.last_name}
                        </p>
                        <p className="text-xs text-white/60 md:hidden">
                          {guest.email}
                        </p>
                      </div>
                    </td>
                    <td className="font-urbanist text-white/80 text-sm py-4 px-2 hidden md:table-cell">
                      {guest.email}
                    </td>
                    <td className="font-urbanist text-white/80 text-sm py-4 px-2 hidden lg:table-cell">
                      {guest.terms_approval ? (
                        <span className="text-green-400">Yes</span>
                      ) : (
                        <span className="text-red-400">No</span>
                      )}
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          guest.is_registered
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {guest.is_registered ? "Registered" : "Pending"}
                      </span>
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
