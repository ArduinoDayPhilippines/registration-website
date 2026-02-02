import React from 'react';

interface EventSettingsSectionProps {
  requireApproval: boolean;
}

export function EventSettingsSection({ requireApproval }: EventSettingsSectionProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10">
      <h2 className="font-montserrat text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
        Settings
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
          <div>
            <p className="font-montserrat text-white font-medium text-base mb-1">
              Require Approval
            </p>
            <p className="font-montserrat text-white/60 text-sm">
              Manually approve each registration
            </p>
          </div>
          <button
            className={`relative w-12 h-6 rounded-full transition-colors ${
              requireApproval ? "bg-secondary" : "bg-white/20"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                requireApproval ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
