import { Input2 } from "@/components/ui/input-2";
import { Button } from "@/components/ui/button";
import { RegistrationFormData } from "./types";
import { cn } from "@/lib/utils";

interface Step3Props {
  formData: RegistrationFormData;
  updateData: (data: Partial<RegistrationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3({ formData, updateData, onNext, onBack }: Step3Props) {
  const isValid =
    formData.occupation && formData.institution && formData.isPartnered;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-right-4"
    >
      <div className="flex-1">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 font-sans">
          Professional Information
        </h2>
        <p className="text-white/50 mb-6 sm:mb-8 ml-1 text-sm sm:text-base">
          Tell us about your work or school
        </p>

        <div className="space-y-3 sm:space-y-4">
          {/* Work/School */}
          <Input2
            label="Occupation *"
            value={formData.occupation}
            onChange={(e) => updateData({ occupation: e.target.value })}
            required
          />
          <Input2
            label="Company/School/Institution *"
            value={formData.institution}
            onChange={(e) => updateData({ institution: e.target.value })}
            required
          />

          {/* Radio Questions */}
          <div className="space-y-1 mt-4 sm:mt-6">
            <span className="text-xs sm:text-sm font-semibold text-primary block mb-2">
              Are you a member of a partnered organization? *
            </span>
            <div className="flex gap-4 sm:gap-6">
              {["Yes", "No"].map((opt) => {
                const isSelected = formData.isPartnered === opt;
                return (
                  <label
                    key={opt}
                    className="flex items-center gap-2 cursor-pointer group relative"
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name="isPartnered"
                      checked={isSelected}
                      onChange={() =>
                        updateData({ isPartnered: opt as "Yes" | "No" })
                      }
                    />
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected
                          ? "border-primary"
                          : "border-white/30 group-hover:border-primary/70"
                      )}
                    >
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full bg-primary transition-transform",
                          isSelected ? "scale-100" : "scale-0"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm sm:text-base text-white/80 transition-colors",
                        isSelected ? "text-white" : "group-hover:text-white"
                      )}
                    >
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 pt-4 border-t border-white/10">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 text-sm sm:text-base"
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid}
          className="flex-1 text-sm sm:text-base"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
