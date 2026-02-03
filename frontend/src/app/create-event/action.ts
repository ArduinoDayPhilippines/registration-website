"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const startDate = formData.get("startDate") as string;
  const startTime = formData.get("startTime") as string;
  const endDate = formData.get("endDate") as string;
  const endTime = formData.get("endTime") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const coverImage = formData.get("coverImage") as string;
  const ticketPrice = formData.get("ticketPrice") as string;
  const requireApproval = formData.get("requireApproval") as string;
  const capacity = formData.get("capacity") as string;
  const registrationQuestions = formData.get("registrationQuestions") as string;

  
  console.log("Title:", title);
  console.log("Start Date:", startDate);
  console.log("Start Time:", startTime);
  console.log("End Date:", endDate);
  console.log("End Time:", endTime);
  console.log("Location:", location);
  console.log("Description:", description);
  console.log("Cover Image:", coverImage ? "Uploaded" : "None");
  console.log("Ticket Price:", ticketPrice);
  console.log("Require Approval:", requireApproval);
  console.log("Capacity:", capacity);
  console.log("Registration Questions:", registrationQuestions);

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  redirect(`/${slug}/manage`);
}