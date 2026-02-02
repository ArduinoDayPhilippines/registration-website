import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Step5Props {
  eventSlug?: string;
}

export function Step5({ eventSlug }: Step5Props) {
  const router = useRouter();

  const handleReturn = () => {
    if (eventSlug) {
      router.push(`/event/${eventSlug}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-right-4">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 sm:px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans mb-4 sm:mb-6 leading-tight">
          Your Registration is now being Processed
        </h2>

        <div className="max-w-md mx-auto">
          <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed">
            Thank you for registering! You will receive a confirmation email
            shortly.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 pt-4 border-t border-white/10">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={handleReturn}
          className="shadow-[0_4px_20px_rgba(0,128,128,0.25)] text-sm sm:text-base"
        >
          Return to Event Page
        </Button>
      </div>
    </div>
  );
}
