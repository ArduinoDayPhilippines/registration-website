"use server";

import { redirect } from "next/navigation";

export async function eventManage(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startDate = formData.get("startDate") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const location = formData.get("location") as string;
  const capacity = formData.get("capacity") as string;
  const ticketPrice = formData.get("ticketPrice") as string;
  const slug = formData.get("slug") as string;
  const requireApproval = formData.get("requireApproval") as unknown as boolean;
  const theme = formData.get("theme") as string;
  const questions = formData.get("questions") as string;
  const coverImage = formData.get("coverImage") as string;

  if (!title?.trim()) {
    return { success: false, error: "Title is required" };
  }

  if (!startDate || !startTime) {
    return { success: false, error: "Start date and time are required" };
  }

  console.log("Updating event details:", {
    title,
    description,
    startDate,
    startTime,
    endTime,
    location,
    capacity,
    ticketPrice,
    slug,
    requireApproval,
    theme,
    questions,
    coverImage,
  });

  redirect(`/event/${slug}/manage`);

  return { success: true };
}
