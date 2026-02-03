"use client";

import React, { useState, useTransition } from "react";
import {
  Users,
  Download,
  MoreVertical,
  Check,
  X,
  UserCheck,
} from "lucide-react";
import { Guest } from "@/types/guest";
import { eventManage } from "../../app/event/[slug]/manage/actions";

interface GuestListSectionProps {
  guests: Guest[];
  slug: string;
  onRefresh: () => void;
}

// Guest-related mutations are funneled through the shared
// `eventManage` server action. For now we treat them as
// fire-and-forget operations and assume success so the UI
// can be exercised while the server-side logic is developed.
async function updateGuestStatus(
  guestId: string,
  status: Guest["status"]
): Promise<{ success: boolean; error?: string }> {
  const formData = new FormData();
  formData.append("operation", "updateGuestStatus");
  formData.append("guestId", guestId);
  formData.append("status", status);

  await eventManage(formData);
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
}: GuestListSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleUpdateStatus = (guestId: string, status: Guest["status"]) => {
    startTransition(async () => {
      const result = await updateGuestStatus(guestId, status);

      if (result.success) {
        onRefresh();
      } else {
        alert(result.error || "Failed to update guest status");
      }
    });
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
      guest.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || guest.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  return (
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
              <option value="approved">Going</option>
              <option value="rejected">Not Going</option>
              <option value="pending">Pending</option>
              <option value="checked_in">Checked In</option>
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
                    Institution
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
                    key={guest.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="font-urbanist text-white text-sm py-4 px-2">
                      <div>
                        <p className="font-medium">
                          {guest.firstName} {guest.lastName}
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
                      {guest.institution || "-"}
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          guest.status === "approved"
                            ? "bg-green-500/20 text-green-400"
                            : guest.status === "checked_in"
                            ? "bg-blue-500/20 text-blue-400"
                            : guest.status === "rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {guest.status === "approved"
                          ? "Going"
                          : guest.status === "checked_in"
                          ? "Checked In"
                          : guest.status === "rejected"
                          ? "Not Going"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex justify-end gap-2">
                        {guest.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateStatus(guest.id, "approved")
                              }
                              disabled={isPending}
                              className="p-1.5 hover:bg-green-500/20 rounded text-green-400 transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(guest.id, "rejected")
                              }
                              disabled={isPending}
                              className="p-1.5 hover:bg-red-500/20 rounded text-red-400 transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        {guest.status === "approved" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(guest.id, "checked_in")
                            }
                            disabled={isPending}
                            className="p-1.5 hover:bg-blue-500/20 rounded text-blue-400 transition-colors disabled:opacity-50"
                            title="Check In"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          disabled={isPending}
                          className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <MoreVertical size={16} />
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
  );
}
