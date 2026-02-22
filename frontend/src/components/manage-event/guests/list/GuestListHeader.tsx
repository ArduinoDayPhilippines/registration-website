interface GuestListHeaderProps {
  guestCount: number;
}

export function GuestListHeader({ guestCount }: GuestListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-urbanist text-lg md:text-xl font-bold text-white">
          Guest List
        </h2>
        <p className="font-urbanist text-xs md:text-sm text-white/60 mt-1">
          {guestCount} {guestCount === 1 ? 'guest' : 'guests'} total
        </p>
      </div>
    </div>
  );
}
