"use client";

import { useState } from "react";
import { Eye, Trash2, Check, X, QrCode, Loader2 } from "lucide-react";
import { Guest } from "@/types/guest";
import { generateQRCodeDataUrl } from "@/services/qrService";

interface GuestTableRowProps {
  guest: Guest;
  isSelected: boolean;
  isPending: boolean;
  onSelectGuest: (guestId: string, checked: boolean) => void;
  onStatusChange: (
    guestId: string,
    newStatus: "registered" | "pending" | "not-going",
  ) => void;
  onViewAnswers: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
}

export function GuestTableRow({
  guest,
  isSelected,
  isPending,
  onSelectGuest,
  onStatusChange,
  onViewAnswers,
  onDelete,
}: GuestTableRowProps) {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  const handleOpenQrModal = async () => {
    if (!guest.qr_data || isGeneratingQr) return;

    if (!qrCodeUrl) {
      setIsGeneratingQr(true);
      try {
        const nextQrCodeUrl = await generateQRCodeDataUrl(guest.qr_data);
        setQrCodeUrl(nextQrCodeUrl);
      } catch (error) {
        console.error("Failed to generate guest QR code:", error);
        return;
      } finally {
        setIsGeneratingQr(false);
      }
    }

    setIsQrModalOpen(true);
  };

  const attendeeName =
    `${guest.users?.first_name || ""} ${guest.users?.last_name || ""}`.trim() ||
    "Guest";

  return (
    <>
      <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
        <td className="py-4 px-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) =>
              onSelectGuest(guest.registrant_id, e.target.checked)
            }
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer"
          />
        </td>
        <td className="font-urbanist text-white text-sm py-4 px-2">
          <div>
            <p className="font-medium">
              {guest.users?.first_name || "N/A"} {guest.users?.last_name || ""}
            </p>
            <p className="text-xs text-white/60 md:hidden">
              {guest.users?.email || "No email"}
            </p>
          </div>
        </td>
        <td className="font-urbanist text-white/80 text-sm py-4 px-2 hidden md:table-cell">
          {guest.users?.email || "No email"}
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
            value={
              !guest.is_registered
                ? "pending"
                : guest.is_going === false
                  ? "not-going"
                  : "registered"
            }
            onChange={(e) =>
              onStatusChange(
                guest.registrant_id,
                e.target.value as "registered" | "pending" | "not-going",
              )
            }
            disabled={isPending}
            className={`font-urbanist px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
              !guest.is_registered
                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
                : guest.is_going === false
                  ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                  : "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
            }`}
          >
            <option value="registered" className="bg-[#0a1520] text-green-400">
              Registered
            </option>
            <option value="pending" className="bg-[#0a1520] text-yellow-400">
              Pending
            </option>
            <option value="not-going" className="bg-[#0a1520] text-red-400">
              Not Going
            </option>
          </select>
        </td>
        <td className="py-4 px-2 hidden md:table-cell">
          {guest.is_registered ? (
            guest.is_going === false ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                <X size={11} />
                Not Going
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                <Check size={11} />
                Going
              </span>
            )
          ) : (
            <span className="text-xs text-white/30">—</span>
          )}
        </td>
        <td className="py-4 px-2 hidden lg:table-cell">
          <div className="flex justify-center">
            {guest.is_registered && guest.is_going && guest.qr_data ? (
              <button
                onClick={handleOpenQrModal}
                disabled={isGeneratingQr}
                className="p-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
                title="View Ticket QR"
              >
                {isGeneratingQr ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <QrCode size={15} />
                )}
              </button>
            ) : (
              <span className="text-xs text-white/30">—</span>
            )}
          </div>
        </td>
        <td className="py-4 px-2">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onViewAnswers(guest)}
              disabled={isPending}
              className="p-1.5 hover:bg-cyan-500/20 rounded text-cyan-400 transition-colors disabled:opacity-50"
              title="View Answers"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onDelete(guest.registrant_id)}
              disabled={isPending}
              className="p-1.5 hover:bg-red-500/20 rounded text-red-400 transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      {isQrModalOpen && qrCodeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsQrModalOpen(false)}
          />

          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a1f14] via-[#0a1520] to-[#120c08] p-6">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close QR modal"
            >
              <X size={16} />
            </button>

            <h3 className="font-urbanist text-lg font-bold text-white mb-1">
              Ticket QR Code
            </h3>
            <p className="font-urbanist text-sm text-white/70 mb-4">
              {attendeeName}
            </p>
            {guest.users?.email && (
              <p className="font-urbanist text-xs text-white/50 mb-4 break-all">
                {guest.users.email}
              </p>
            )}

            <div className="mx-auto w-fit rounded-xl border-4 border-primary bg-white p-3">
              <img
                src={qrCodeUrl}
                alt={`QR ticket for ${attendeeName}`}
                width={220}
                height={220}
                className="block"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
