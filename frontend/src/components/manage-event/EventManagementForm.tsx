"use client";

import React, { useState } from "react";
import { EventData } from "@/types/event";
import { eventManage } from "../../app/event/[slug]/manage/actions";
import { Check, Pencil, Trash2 } from "lucide-react";

interface EventManagementFormProps {
  event: EventData;
  slug: string;
  onCancel: () => void;
  onSuccess: () => void;
}

async function updateEventDetailsFormAction(
  slug: string,
  formData: FormData
): Promise<void> {
  formData.append("slug", slug);
  formData.append("operation", "updateEventDetails");
  await eventManage(formData);
}

async function addRegistrationQuestionFormAction(
  slug: string,
  formData: FormData
): Promise<void> {
  formData.append("slug", slug);
  formData.append("operation", "addRegistrationQuestion");
  await eventManage(formData);
}

async function updateRegistrationQuestionFormAction(
  slug: string,
  formData: FormData
): Promise<void> {
  formData.append("slug", slug);
  formData.append("operation", "updateRegistrationQuestion");
  await eventManage(formData);
}

async function removeRegistrationQuestionFormAction(
  slug: string,
  formData: FormData
): Promise<void> {
  formData.append("slug", slug);
  formData.append("operation", "removeRegistrationQuestion");
  await eventManage(formData);
}

async function updateEventSettingsFormAction(
  slug: string,
  formData: FormData
): Promise<void> {
  formData.append("slug", slug);
  formData.append("operation", "updateEventSettings");
  await eventManage(formData);
}

export function EventManagementForm({
  event,
  slug,
  onCancel,
  onSuccess,
}: EventManagementFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSuccess = () => {
    setSuccessMessage("Changes saved successfully.");
    onSuccess();
  };

  const updateEventDetailsAction = async (formData: FormData) => {
    await updateEventDetailsFormAction(slug, formData);
    handleSuccess();
  };

  const addQuestionAction = async (formData: FormData) => {
    await addRegistrationQuestionFormAction(slug, formData);
    handleSuccess();
  };

  const updateQuestionAction = async (formData: FormData) => {
    await updateRegistrationQuestionFormAction(slug, formData);
    handleSuccess();
  };

  const removeQuestionAction = async (formData: FormData) => {
    await removeRegistrationQuestionFormAction(slug, formData);
    handleSuccess();
  };

  const updateSettingsAction = async (formData: FormData) => {
    await updateEventSettingsFormAction(slug, formData);
    handleSuccess();
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#0a1520] border border-emerald-400/40 rounded-2xl px-6 py-5 max-w-sm w-[90%] text-center shadow-xl shadow-emerald-500/30">
            <h3 className="font-urbanist text-lg font-bold text-emerald-300 mb-2">
              Success
            </h3>
            <p className="font-urbanist text-sm text-emerald-100 mb-4">
              {successMessage}
            </p>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="font-montserrat px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10">
        <h2 className="font-urbanist text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
          Event Details
        </h2>

        <form action={updateEventDetailsAction} className="space-y-6">
          <div>
            <label className="font-urbanist block text-sm font-medium text-white/80 mb-2">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={event.title}
              required
              className="font-urbanist w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="font-urbanist block text-sm font-medium text-white/80 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={event.description}
              className="font-urbanist w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-urbanist block text-sm font-medium text-white/80 mb-2">
                Date
              </label>
              <input
                type="date"
                name="startDate"
                defaultValue={event.startDate}
                required
                className="font-urbanist w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="font-urbanist block text-sm font-medium text-white/80 mb-2">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                defaultValue={event.startTime}
                required
                className="font-urbanist w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="font-urbanist block text-sm font-medium text-white/80 mb-2">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                defaultValue={event.endTime}
                className="font-urbanist w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="font-urbanist block text-sm font-medium text-white/80 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              defaultValue={event.location}
              placeholder="Enter event location"
              className="font-urbanist w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-urbanist block text-sm font-medium text-white/80 mb-2">
                Capacity
              </label>
              <input
                type="text"
                name="capacity"
                defaultValue={event.capacity}
                className="font-urbanist w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="font-urbanist block text-sm font-medium text-white/80 mb-2">
                Ticket Price
              </label>
              <input
                type="text"
                name="ticketPrice"
                defaultValue={event.ticketPrice}
                className="font-urbanist w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="font-montserrat px-6 py-2.5 md:py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm md:text-base font-medium transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="font-montserrat px-6 py-2.5 md:py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-sm md:text-base font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
          <h2 className="font-urbanist text-lg md:text-xl font-bold text-white">
            Registration Questions
          </h2>
        </div>

        <details className="mb-4 group">
          <summary className="font-urbanist px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-sm font-medium transition-colors whitespace-nowrap w-fit cursor-pointer list-none">
            + Add Question
          </summary>
          <div className="mt-3 p-4 bg-white/5 border border-cyan-500/50 rounded-lg">
            <form action={addQuestionAction}>
              <input
                type="text"
                name="text"
                placeholder="Enter question text..."
                className="font-urbanist w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors mb-3"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="required"
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="font-urbanist text-white/80 text-sm">
                    Required
                  </span>
                </label>
                <button
                  type="submit"
                  className="font-urbanist px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </details>

        <div className="space-y-4">
          {event.questions && event.questions.length > 0 ? (
            event.questions.map((question) => (
              <div
                key={question.id}
                className="p-4 bg-white/5 border border-white/10 rounded-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-urbanist text-white font-medium text-base mb-1 break-words">
                      {question.text}
                    </p>
                    <p className="font-urbanist text-white/60 text-sm">
                      {question.required ? "Required" : "Optional"}
                    </p>
                  </div>

                  <div className="flex gap-2 items-start">
                    <details className="group">
                      <summary className="font-urbanist text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors cursor-pointer list-none">
                        <Pencil size={14} />
                        Edit
                      </summary>
                      <div className="mt-3 p-4 bg-white/5 border border-white/10 rounded-lg w-[min(420px,80vw)]">
                        <form
                          action={updateQuestionAction}
                          className="space-y-3"
                        >
                          <input
                            type="hidden"
                            name="questionId"
                            value={question.id}
                          />
                          <input
                            type="text"
                            name="text"
                            defaultValue={question.text}
                            className="font-urbanist w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
                          />
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                name="required"
                                defaultChecked={question.required}
                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-600 focus:ring-cyan-500"
                              />
                              <span className="font-urbanist text-white/80 text-sm">
                                Required
                              </span>
                            </label>
                            <button
                              type="submit"
                              className="font-urbanist px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 rounded text-white text-sm transition-colors flex items-center gap-1"
                            >
                              <Check size={14} />
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </details>

                    <form action={removeQuestionAction}>
                      <input
                        type="hidden"
                        name="questionId"
                        value={question.id}
                      />
                      <button
                        type="submit"
                        className="font-urbanist text-red-400/60 hover:text-red-400 text-sm flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="font-urbanist text-white/60 text-base">
                No custom questions added yet
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10">
        <h2 className="font-urbanist text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
          Settings
        </h2>

        <form action={updateSettingsAction} className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg gap-4">
            <div className="min-w-0">
              <p className="font-urbanist text-white font-medium text-base mb-1">
                Require Approval
              </p>
              <p className="font-urbanist text-white/60 text-sm">
                Manually approve each registration
              </p>
            </div>

            <label className="flex items-center gap-3 select-none">
              <input
                type="checkbox"
                name="requireApproval"
                defaultChecked={event.requireApproval}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="font-urbanist text-white/80 text-sm">
                Enabled
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="font-montserrat px-6 py-2.5 md:py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-sm md:text-base font-medium transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
