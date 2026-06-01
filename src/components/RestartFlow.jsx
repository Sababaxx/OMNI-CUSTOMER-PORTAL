import React, { useState } from "react";
import Button from "./Button.jsx";
import { lastSubscription } from "../data/subscription.js";

const PRODUCTS = [
  { id: "gummies-1", label: "Daily Creatine Gummies", detail: "1 pouch · 30 servings", price: 42.0, hasFlavor: true },
  { id: "gummies-2", label: "Daily Creatine Gummies", detail: "2 pouches · 60 servings", price: 80.0, hasFlavor: true },
  { id: "electrolytes", label: "OMNI Electrolytes", detail: "Stick packs · 30 servings", price: 38.0, hasFlavor: true, flavors: ["Pear", "Peach"] },
];

const GUMMY_FLAVORS = ["Peach", "Watermelon"];

const CADENCES = [
  { id: "4w", label: "Every 4 weeks", note: "Most popular" },
  { id: "8w", label: "Every 8 weeks", note: "" },
  { id: "12w", label: "Every 12 weeks", note: "" },
  { id: "quarterly", label: "Quarterly", note: "Best value" },
];

const STEPS = ["product", "flavor", "cadence", "review"];

export default function RestartFlow({ open, onClose, onRestarted }) {
  const [step, setStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedCadence, setSelectedCadence] = useState(null);

  if (!open) return null;

  const product = selectedProduct || PRODUCTS[0];
  const flavors = product.flavors || GUMMY_FLAVORS;
  const stepId = STEPS[step];

  const advance = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const reset = () => {
    setStep(0);
    setSelectedProduct(null);
    setSelectedFlavor(null);
    setSelectedCadence(null);
  };

  const handleClose = () => { reset(); onClose(); };
  const handleConfirm = () => { reset(); onClose(); if (onRestarted) onRestarted(); };

  const cadence = selectedCadence || CADENCES[0];
  const totalEstimate = product.price + 8.0;

  return (
    /* Backdrop — click to close, but stop propagation inside modal */
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Restart subscription"
      onClick={handleClose}
    >
      <div
        className="action-modal restart-flow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={handleClose} aria-label="Close">×</button>

        {/* Step dots */}
        <div className="restart-step-indicator" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`restart-step-dot${i === step ? " active" : i < step ? " done" : ""}`}
            />
          ))}
        </div>

        {/* ── Step 0: Choose product ─────────────────────────────── */}
        {stepId === "product" && (
          <>
            <h3>Choose your product</h3>
            <p className="restart-sub">Nothing ships until you confirm on the review screen.</p>
            <div className="restart-option-list">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="restart-option-card"
                  onClick={() => { setSelectedProduct(p); setSelectedFlavor(null); advance(); }}
                >
                  <div className="restart-option-main">
                    <span className="restart-option-label">{p.label}</span>
                    <span className="restart-option-detail">{p.detail}</span>
                  </div>
                  <span className="restart-option-price">${p.price.toFixed(2)}/order</span>
                  <span className="restart-option-arrow">→</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Step 1: Choose flavor ──────────────────────────────── */}
        {stepId === "flavor" && (
          <>
            <h3>Choose your flavor</h3>
            <p className="restart-sub">Pick the routine that fits now. You can change it anytime.</p>
            <div className="restart-option-list">
              {flavors.map((f) => (
                <button
                  key={f}
                  type="button"
                  className="restart-option-card"
                  onClick={() => { setSelectedFlavor(f); advance(); }}
                >
                  <div className="restart-option-main">
                    <span className="restart-option-label">{f}</span>
                  </div>
                  <span className="restart-option-arrow">→</span>
                </button>
              ))}
            </div>
            <button type="button" className="restart-back-link" onClick={back}>← Back</button>
          </>
        )}

        {/* ── Step 2: Choose cadence ─────────────────────────────── */}
        {stepId === "cadence" && (
          <>
            <h3>Choose your timing</h3>
            <p className="restart-sub">Choose your timing before anything ships. Change it anytime from the portal.</p>
            <div className="restart-option-list">
              {CADENCES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="restart-option-card"
                  onClick={() => { setSelectedCadence(c); advance(); }}
                >
                  <div className="restart-option-main">
                    <span className="restart-option-label">{c.label}</span>
                    {c.note && <span className="restart-option-note">{c.note}</span>}
                  </div>
                  <span className="restart-option-arrow">→</span>
                </button>
              ))}
            </div>
            <button type="button" className="restart-back-link" onClick={back}>← Back</button>
          </>
        )}

        {/* ── Step 3: Review & confirm ───────────────────────────── */}
        {stepId === "review" && (
          <>
            <h3>Review your restart</h3>
            <p className="restart-sub">Your past order is saved so restarting is easy. Nothing ships until you confirm.</p>

            <div className="restart-review-card">
              <div className="restart-review-row">
                <span className="mini-label">Product</span>
                <strong>{product.label}</strong>
              </div>
              <div className="restart-review-row">
                <span className="mini-label">Flavor</span>
                <strong>{selectedFlavor || flavors[0]}</strong>
              </div>
              <div className="restart-review-row">
                <span className="mini-label">Cadence</span>
                <strong>{cadence.label}</strong>
              </div>
              <div className="restart-review-row">
                <span className="mini-label">Estimated total</span>
                <strong>${product.price.toFixed(2)} + $8.00 shipping</strong>
              </div>
              <div className="restart-review-row">
                <span className="mini-label">Payment</span>
                <strong>{lastSubscription.payment.method}</strong>
              </div>
              <div className="restart-review-row">
                <span className="mini-label">Ships to</span>
                <strong>{lastSubscription.shipping.line1}, {lastSubscription.shipping.cityRegion}</strong>
              </div>
            </div>

            <div className="restart-review-actions">
              <Button variant="primary" onClick={handleConfirm}>Restart subscription</Button>
              <Button variant="outline" onClick={back}>Back</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
