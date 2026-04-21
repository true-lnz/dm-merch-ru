"use client";

import { useEffect } from "react";

type ClientErrorPayload = {
  kind: "error" | "unhandledrejection";
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
};

const CLIENT_ERROR_ROUTE = "/api/client-error";

function toMessage(value: unknown) {
  if (value instanceof Error) {
    return value.message;
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function sendClientError(payload: ClientErrorPayload) {
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(CLIENT_ERROR_ROUTE, blob);
    return;
  }

  void fetch(CLIENT_ERROR_ROUTE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export function ClientRuntimeMonitor() {
  useEffect(() => {
    const buildPayload = (
      kind: ClientErrorPayload["kind"],
      message: string,
      stack?: string,
    ): ClientErrorPayload => ({
      kind,
      message,
      stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    const handleError = (event: ErrorEvent) => {
      const payload = buildPayload(
        "error",
        event.message || toMessage(event.error) || "Unknown client error",
        event.error instanceof Error ? event.error.stack : undefined,
      );

      console.error("[client-runtime]", payload);
      sendClientError(payload);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const payload = buildPayload(
        "unhandledrejection",
        toMessage(reason) || "Unhandled promise rejection",
        reason instanceof Error ? reason.stack : undefined,
      );

      console.error("[client-runtime]", payload);
      sendClientError(payload);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
