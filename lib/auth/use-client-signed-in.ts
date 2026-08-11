"use client";

import { useSyncExternalStore } from "react";
import {
  getClientSignedInServerSnapshot,
  getClientSignedInSnapshot,
  subscribeClientSignedIn,
} from "@/lib/auth/client-session";

/** Live client signed-in flag from localStorage (false during SSR). */
export function useClientSignedIn(): boolean {
  return useSyncExternalStore(
    subscribeClientSignedIn,
    getClientSignedInSnapshot,
    getClientSignedInServerSnapshot,
  );
}
