"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (publishableKey) {
    return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
  }

  return <>{children}</>;
}
