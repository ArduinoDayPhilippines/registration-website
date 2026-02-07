import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LastStepProps {
  eventSlug?: string;
  onSubmit?: () => Promise<void>;
}

export function LastStep({ eventSlug, onSubmit }: LastStepProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit();
      } catch (error) {
        console.error("Submission error:", error);
        setIsSubmitting(false);
      }
    } else {
      handleReturn();
    }
  };

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
          Review and Submit
        </h2>

        <div className="max-w-md mx-auto">
          <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed">
            You're almost done! Click the button below to complete your registration.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 pt-4 border-t border-white/10 space-y-3">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="shadow-[0_4px_20px_rgba(0,128,128,0.25)] text-sm sm:text-base"
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </Button>
        <button
          onClick={handleReturn}
          className="w-full text-white/60 hover:text-white text-sm transition-colors"
        >
          Back to Event Page
        </button>
      </div>
    </div>
  );
}
