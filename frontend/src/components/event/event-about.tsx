

interface EventAboutProps {
  description: string;
  className?: string;
}

export function EventAbout({ description, className = '' }: EventAboutProps) {
  if (!description) return null;

  return (
    <div className={className}>
      <h3 className="font-montserrat text-base font-bold mb-3 text-white">
        About
      </h3>
      <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
}
