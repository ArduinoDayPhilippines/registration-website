
import { Button } from './button';

interface ErrorStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({
  title,
  message,
  actionLabel = 'Go to Home',
  onAction
}: ErrorStateProps) {
  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-4 px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
        {message && <p className="text-white/60 mb-6">{message}</p>}
        {onAction && (
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
