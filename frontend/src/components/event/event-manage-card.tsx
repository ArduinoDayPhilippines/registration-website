import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils";

interface EventManageCardProps {
  eventSlug: string;
  className?: string;
}

export function EventManageCard({
  eventSlug,
  className = "",
}: EventManageCardProps) {
  const router = useRouter();

  const handleManageClick = () => {
    router.push(`/event/${eventSlug}/manage`);
  };

  return (
    <div
      className={cn(
        "bg-orange-900/20 backdrop-blur-lg rounded-xl p-5 border border-orange-500/20 flex flex-row flex-nowrap items-center justify-between gap-4",
        className,
      )}
    >
      <p className="text-white/90 text-sm flex-shrink min-w-0">
        You have manage access for this event.
      </p>

      <button
        onClick={handleManageClick}
        className="flex flex-shrink-0 items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white text-sm font-medium transition-colors whitespace-nowrap"
      >
        Manage
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}
