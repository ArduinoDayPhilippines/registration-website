"use client";

import React, { useState, useTransition, useOptimistic } from "react";
import { EventData, Question } from "@/types/event";
import {
  updateEventDetails,
  addRegistrationQuestion,
  updateRegistrationQuestion,
  removeRegistrationQuestion,
  updateEventSettings,
} from "@/app/event/[slug]/manage/actions";
import { Check, Pencil, Trash2 } from "lucide-react";

interface EventManagementFormProps {
  event: EventData;
  slug: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EventManagementForm({
  event,
  slug,
  onCancel,
  onSuccess,
}: EventManagementFormProps) {
  const [isPending, startTransition] = useTransition();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editQuestionRequired, setEditQuestionRequired] = useState(false);

  const [optimisticRequireApproval, setOptimisticRequireApproval] =
    useOptimistic(event.requireApproval);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateEventDetails(slug, formData);

      if (result.success) {
        alert("Event details updated successfully!");
        onSuccess();
      } else {
        alert(result.error || "Failed to update event details");
      }
    });
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;

    startTransition(async () => {
      const result = await addRegistrationQuestion(slug, {
        text: newQuestionText,
        required: newQuestionRequired,
      });

      if (result.success) {
        setNewQuestionText("");
        setNewQuestionRequired(false);
        setShowAddForm(false);
      } else {
        alert(result.error || "Failed to add question");
      }
    });
  };

  const handleEditQuestion = (question: Question) => {
    setEditingId(question.id);
    setEditQuestionText(question.text);
    setEditQuestionRequired(question.required);
  };

  const handleSaveEdit = (questionId: number) => {
    if (!editQuestionText.trim()) return;

    startTransition(async () => {
      const result = await updateRegistrationQuestion(slug, questionId, {
        text: editQuestionText,
        required: editQuestionRequired,
      });

      if (result.success) {
        setEditingId(null);
      } else {
        alert(result.error || "Failed to update question");
      }
    });
  };

  const handleDeleteQuestion = (questionId: number) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    startTransition(async () => {
      const result = await removeRegistrationQuestion(slug, questionId);

      if (!result.success) {
        alert(result.error || "Failed to delete question");
      }
    });
  };

  const handleToggleRequireApproval = () => {
    const newValue = !optimisticRequireApproval;

    setOptimisticRequireApproval(newValue);

    startTransition(async () => {
      const result = await updateEventSettings(slug, {
        requireApproval: newValue,
      });

      if (!result.success) {
        alert(result.error || "Failed to update settings");
        setOptimisticRequireApproval(!newValue);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10">
        <h2 className="font-urbanist text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
          Event Details
        </h2>

        <div className="space-y-6">
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
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
          <h2 className="font-urbanist text-lg md:text-xl font-bold text-white">
            Registration Questions
          </h2>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={isPending}
            className="font-urbanist px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors whitespace-nowrap self-start md:self-auto"
          >
            {showAddForm ? "Cancel" : "+ Add Question"}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 bg-white/5 border border-cyan-500/50 rounded-lg">
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Enter question text..."
              className="font-urbanist w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors mb-3"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newQuestionRequired}
                  onChange={(e) => setNewQuestionRequired(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="font-urbanist text-white/80 text-sm">
                  Required
                </span>
              </label>
              <button
                type="button"
                onClick={handleAddQuestion}
                disabled={isPending || !newQuestionText.trim()}
                className="font-urbanist px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors"
              >
                {isPending ? "Adding..." : "Add Question"}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {event.questions && event.questions.length > 0 ? (
            event.questions.map((question) => (
              <div
                key={question.id}
                className="p-4 bg-white/5 border border-white/10 rounded-lg"
              >
                {editingId === question.id ? (
                  <div>
                    <input
                      type="text"
                      value={editQuestionText}
                      onChange={(e) => setEditQuestionText(e.target.value)}
                      className="font-urbanist w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors mb-3"
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editQuestionRequired}
                          onChange={(e) =>
                            setEditQuestionRequired(e.target.checked)
                          }
                          className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="font-urbanist text-white/80 text-sm">
                          Required
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          disabled={isPending}
                          className="font-urbanist px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed rounded text-white text-sm transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(question.id)}
                          disabled={isPending || !editQuestionText.trim()}
                          className="font-urbanist px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed rounded text-white text-sm transition-colors flex items-center gap-1"
                        >
                          <Check size={14} />
                          {isPending ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-urbanist text-white font-medium text-base mb-1">
                        {question.text}
                      </p>
                      <p className="font-urbanist text-white/60 text-sm">
                        {question.required ? "Required" : "Optional"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditQuestion(question)}
                        disabled={isPending}
                        className="font-urbanist text-white/60 hover:text-white disabled:text-white/30 disabled:cursor-not-allowed text-sm flex items-center gap-1 transition-colors"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(question.id)}
                        disabled={isPending}
                        className="font-urbanist text-red-400/60 hover:text-red-400 disabled:text-red-400/30 disabled:cursor-not-allowed text-sm flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
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

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
            <div>
              <p className="font-urbanist text-white font-medium text-base mb-1">
                Require Approval
              </p>
              <p className="font-urbanist text-white/60 text-sm">
                Manually approve each registration
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleRequireApproval}
              disabled={isPending}
              className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                optimisticRequireApproval ? "bg-cyan-600" : "bg-white/20"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  optimisticRequireApproval ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="font-montserrat px-6 py-2.5 md:py-3 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm md:text-base font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="font-montserrat px-6 py-2.5 md:py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed rounded-lg text-white text-sm md:text-base font-medium transition-colors"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
