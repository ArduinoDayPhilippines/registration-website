"use client";

import { Suspense } from "react";
import BatchmailWorkspace from "@/components/batchmail/BatchmailWorkspace";

export default function Home() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <main className="mx-auto max-w-6xl p-6">
        <BatchmailWorkspace />
      </main>
    </Suspense>
  );
}
