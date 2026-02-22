"use client";

import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { RegistrationFlow } from "@/components/registration/RegistrationFlow";
import { useEvent } from "@/hooks/event/use-event";

export default function EventRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { event, loading, error } = useEvent(slug);

  if (loading) {
    return <LoadingSpinner message="Loading event..." />;
  }

  if (error || !event) {
    return (
      <ErrorState
        title="Event not found"
        message="The event you're looking for doesn't exist or has been removed."
        onAction={() => router.push("/")}
      />
    );
  }

  return (
    <RegistrationFlow eventSlug={slug} formQuestions={event.questions || []} />
  );
}
