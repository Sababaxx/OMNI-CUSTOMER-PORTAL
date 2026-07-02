import React, { createContext, useContext, useMemo, useState } from "react";
import { subscriptionStatus as initialStatus } from "../data/subscription.js";

// ── Single source of truth for the live subscription status ──────────────
// status: "active" | "paused" | "inactive"
//   active   → normal portal (order now, skip, pause, cancel)
//   paused   → temporarily halted, can resume anytime
//   inactive → cancelled / lapsed, winback + restart flow
//
// The three portal flows call into this context so the UI actually
// transitions instead of just showing a confirmation screen:
//   RestartFlow      → reactivate()
//   CancellationFlow → cancelSubscription() / pauseSubscription()
//   Pause modal      → pauseSubscription()
//   Resume action    → resumeSubscription()

const SubscriptionContext = createContext(null);

function computeResumeDate(weeks) {
  const d = new Date();
  d.setDate(d.getDate() + weeks * 7);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function weeksFromLabel(label) {
  const match = String(label || "").match(/(\d+)\s*week/i);
  return match ? parseInt(match[1], 10) : 4;
}

export function SubscriptionProvider({ children }) {
  const [status, setStatus] = useState(initialStatus);
  const [pauseInfo, setPauseInfo] = useState(null);      // { label, weeks, resumeDate }
  const [restartChoice, setRestartChoice] = useState(null); // { product, flavor, cadence }

  const value = useMemo(
    () => ({
      status,
      isActive: status === "active",
      isPaused: status === "paused",
      isInactive: status === "inactive",
      pauseInfo,
      restartChoice,

      reactivate: (choice) => {
        if (choice) setRestartChoice(choice);
        setPauseInfo(null);
        setStatus("active");
      },
      resumeSubscription: () => {
        setPauseInfo(null);
        setStatus("active");
      },
      pauseSubscription: (label) => {
        const weeks = weeksFromLabel(label);
        setPauseInfo({
          label: label || `${weeks} weeks`,
          weeks,
          resumeDate: computeResumeDate(weeks),
        });
        setStatus("paused");
      },
      cancelSubscription: () => {
        setPauseInfo(null);
        setStatus("inactive");
      },
    }),
    [status, pauseInfo, restartChoice]
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within a SubscriptionProvider");
  return ctx;
}
