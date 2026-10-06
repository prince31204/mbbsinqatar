"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/lib/modalContext";
import { GlobalDownloadModal } from "@/components/modals/DownloadFormPopup";
import { useState } from "react";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: any;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      }),
  );

  return (
    <SessionProvider session={session}>
      <ModalProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <GlobalDownloadModal />
          <Toaster position="top-right" richColors />
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </ModalProvider>
    </SessionProvider>
  );
}
