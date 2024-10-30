import { Refine, type IRefineOptions } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  RefineSnackbarProvider,
  useNotificationProvider,
} from "@refinedev/mui";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

import { ColorModeContextProvider } from "@contexts/color-mode";
import DevtoolsProvider from "@providers/devtools";

export const metadata: Metadata = {
  title: "Memposit NextJS + Refine Test",
};

const refineOptions: IRefineOptions = {
  syncWithLocation: true,
  warnWhenUnsavedChanges: true,
  useNewQueryKeys: true,
  title: {
    text: "Memposit NextJS + Refine Test",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en">
      <body>
        <Suspense>
          <RefineKbarProvider>
            <DevtoolsProvider>
              <ColorModeContextProvider defaultMode={defaultMode}>
                <RefineSnackbarProvider>
                  <Refine
                    routerProvider={routerProvider}
                    notificationProvider={useNotificationProvider}
                    options={refineOptions}
                    resources={[
                      {
                        name: "candidates",
                        list: "/candidates",
                        create: "/candidates/create",
                        show: "/candidates/:id",
                      },
                    ]}
                  >
                    {children}
                    <RefineKbar />
                  </Refine>
                </RefineSnackbarProvider>
              </ColorModeContextProvider>
            </DevtoolsProvider>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
