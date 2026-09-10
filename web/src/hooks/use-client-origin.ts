"use client";

import { useSyncExternalStore } from "react";

function subscribeNoop() {
  return () => {};
}

function getClientOrigin() {
  return window.location.origin;
}

function getServerOrigin() {
  return "";
}

/** Hydration-safe browser origin for absolute card URLs. */
export function useClientOrigin() {
  return useSyncExternalStore(subscribeNoop, getClientOrigin, getServerOrigin);
}
