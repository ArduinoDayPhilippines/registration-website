import { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Step0Props {
  onNext: () => void;
}

export function Step0({ onNext }: Step0Props) {
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-2 sm:mb-3">
          <Shield size={20} className="text-primary sm:w-6 sm:h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans">Privacy Policy</h2>
      </div>
      
      <p className="text-white/70 mb-3 sm:mb-4 leading-relaxed text-xs sm:text-sm text-center">
        Please read and understand our privacy policy before proceeding with registration.
      </p>

      {/* Scrollable Content Box */}
      <div className="h-[280px] sm:h-[320px] md:h-[360px] bg-black/40 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-y-auto custom-scrollbar mb-3 sm:mb-4">
        <div className="space-y-6 text-sm md:text-base">
          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-primary" />
              Data Collection
            </h3>
            <p className="text-white/70 leading-relaxed ml-7">
              We collect personal information including your name, email address, mobile number, 
              occupation, and institution for event registration and communication purposes.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-primary" />
              How We Use Your Data
            </h3>
            <p className="text-white/70 leading-relaxed ml-7">
              Your information will be used to process your event registration, send event updates, 
              and communicate important information. We may also use your data to improve our services 
              and future events.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-primary" />
              Data Security
            </h3>
            <p className="text-white/70 leading-relaxed ml-7">
              We implement appropriate security measures to protect your personal information from 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-primary" />
              Data Sharing
            </h3>
            <p className="text-white/70 leading-relaxed ml-7">
              We do not sell or rent your personal information to third parties. Your data may be 
              shared with event sponsors only if you explicitly consent to scholarship or career opportunities.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-primary" />
              Your Rights
            </h3>
            <p className="text-white/70 leading-relaxed ml-7">
              You have the right to access, correct, or delete your personal information at any time. 
              You may also opt out of communications by contacting us directly.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-primary" />
              Contact Us
            </h3>
            <p className="text-white/70 leading-relaxed ml-7">
              If you have questions about this privacy policy or how we handle your data, 
              please contact us through our official channels.
            </p>
          </section>
        </div>
      </div>

      {/* Checkbox */}
      <label className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 mb-3 sm:mb-4 group cursor-pointer hover:bg-white/5 rounded-xl transition-colors">
        <div className="relative flex items-center pt-0.5">
          <input 
            type="checkbox" 
            className="peer sr-only"
            checked={agreedToPolicy}
            onChange={(e) => setAgreedToPolicy(e.target.checked)}
          />
          <div className="w-5 h-5 border-2 border-white/30 rounded transition-all peer-checked:bg-primary peer-checked:border-primary peer-hover:border-primary/70 bg-transparent flex items-center justify-center">
             {agreedToPolicy && <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white rotate-[-45deg] translate-y-[-1px]" />}
          </div>
        </div>
        <span className="text-xs sm:text-sm text-white/70 leading-tight group-hover:text-white transition-colors select-none">
          I have read and agree to the Privacy Policy
        </span>
      </label>

      <div className="pt-1 sm:pt-2">
        <Button 
          onClick={onNext}
          variant="primary" 
          fullWidth
          size="lg"
          disabled={!agreedToPolicy}
          className="shadow-[0_0_30px_rgba(0,128,128,0.4)] text-sm sm:text-base"
        >
          Accept & Continue
        </Button>
      </div>
    </div>
  );
}
