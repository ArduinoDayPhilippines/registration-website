"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const startDate = formData.get("startDate") as string;
  const startTime = formData.get("startTime") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;

  
  console.log("Title:", title);
  console.log("Start Date:", startDate);
  console.log("Start Time:", startTime);
  console.log("Location:", location);
  console.log("Description:", description);

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  redirect(`/${slug}/manage`);
}