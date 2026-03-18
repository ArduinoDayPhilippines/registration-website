import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AuthLoginAlias({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : undefined;

  if (safeNext) {
    redirect(`/?next=${encodeURIComponent(safeNext)}`);
  }

  redirect("/");
}
