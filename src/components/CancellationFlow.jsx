import React, { useEffect, useMemo, useState } from "react";
import Button from "./Button.jsx";

const SUPPORT_URL = "https://contact.gorgias.help/en-US/forms/0c4rzba9";
const FINAL_STEP_LABEL = "Review final step";

function trackCancellationEvent(eventName, payload = {}) {
  const detail = { event: eventName, ...payload, timestamp: new Date().toISOString() };
  window.dispatchEvent(new CustomEvent("omni:cancellation", { detail }));
  if (window.dataLayer) window.dataLayer.push(detail);
  console.info("[OMNI cancellation]", detail);
}

function getActionEventName(action) {
  const label = action.label.toLowerCase();
  if (action.action === "support" || label.includes("support")) return "support_clicked";
  if (action.branch === "pause" || label.includes("pause")) return "pause_clicked";
  if (action.branch === "skip" || label.includes("skip")) return "skip_clicked";
  if (action.branch === "cadence" || label.includes("week") || label.includes("delivery")) return "cadence_change_clicked";
  return "save_action_clicked";
}

function supportUrlWithContext(context) {
  const url = new URL(SUPPORT_URL);
  url.searchParams.set("context", context);
  return url.toString();
}

const reasonConfig = [
  {
    id: "no-results",
    title: "I haven't seen results yet",
    helper: "Give consistency, dose, and timing enough time to line up.",
    treatment: "education",
    headline: "Give your routine enough time to work",
    body: "Most members judge results too early. Creatine works best when dose, timing, and consistency line up for several weeks.",
    subReasons: ["Less than 4 weeks", "Taking inconsistently", "Not sure about dose", "Expected faster change"],
    cards: ["4 to 12 week consistency window", "Daily serving matters", "Timing should fit your routine"],
    ctas: [
      { label: "Build my consistency plan", branch: "plan" },
      { label: "Skip next order", branch: "skip" },
    ],
    plan: {
      title: "Your consistency plan",
      body: "Use a smaller, easier routine long enough to judge results.",
      options: ["Take with breakfast", "Use daily serving consistently", "Check progress at week 8"],
      note: "If your next order is too soon, skip it and keep the plan active.",
      cta: "Save my plan",
      saved: "Your consistency plan was saved.",
    },
  },
  {
    id: "habit",
    title: "Hard to remember or not consistent with routine",
    helper: "Build the habit first, then decide if the subscription fits.",
    treatment: "habit",
    headline: "Make OMNI easier to stick with",
    body: "Missing days early on is normal. The fix is not cancelling, it is making the routine easier.",
    subReasons: ["Forget most days", "Travel schedule", "No set routine", "Timing feels awkward"],
    cards: ["Pair with an existing habit", "Keep the pouch visible", "Give the habit a few weeks"],
    ctas: [
      { label: "Build my habit plan", branch: "plan" },
      { label: "Move delivery to 8 weeks", branch: "cadence", preselect: "Every 8 weeks" },
      { label: "Skip next order", branch: "skip" },
    ],
    plan: {
      title: "Your habit plan",
      body: "Tie OMNI to something you already do every day.",
      options: ["Morning reminder", "Keep pouch visible", "Pair with coffee or breakfast"],
      cta: "Save habit plan",
      saved: "Your habit plan was saved.",
    },
  },
  {
    id: "stocked",
    title: "I'm stocked up",
    helper: "Skip or slow down delivery without losing your subscription.",
    treatment: "overstock",
    headline: "You do not need to cancel to slow things down",
    body: "If you have enough product, keep member access and move the next order out.",
    subReasons: ["One extra pouch", "Multiple pouches left", "Using it slower", "Travel or schedule change"],
    cards: ["Unopened pouches keep well sealed", "Skip once without cancelling", "Move cadence to 8 or 12 weeks"],
    ctas: [
      { label: "Skip next order", branch: "skip" },
      { label: "Move to 8 weeks", branch: "cadence", preselect: "Every 8 weeks" },
      { label: "Move to 12 weeks", branch: "cadence", preselect: "Every 12 weeks" },
      { label: "Pause subscription", branch: "pause" },
    ],
  },
  {
    id: "expensive",
    title: "Too expensive to continue",
    helper: "Review a stronger member offer before cancelling.",
    treatment: "savings",
    headline: "Lower the next orders before giving up member pricing",
    body: "Keep portal control, member pricing, and your routine while reducing the next few orders.",
    subReasons: ["Monthly cost", "Shipping cost", "Budget changed", "Want fewer orders"],
    offer: "50% off next 3 orders",
    cards: ["Best if you still want OMNI", "Keeps member pricing active", "Can pair with a skipped order"],
    ctas: [
      { label: "Apply 50% off next 3 orders", branch: "savings", preselect: "50% off next 3 orders" },
      { label: "Skip and keep offer", branch: "savings", preselect: "Skip next order and keep offer" },
      { label: "Move to 8 weeks", branch: "cadence", preselect: "Every 8 weeks" },
    ],
  },
  {
    id: "trial-only",
    title: "I don't like subscriptions, I just wanted to try once",
    helper: "Keep control without pressure.",
    treatment: "control",
    headline: "Keep control without losing the better price",
    body: "The subscription only keeps your member pricing active. You can skip, pause, or slow deliveries whenever you need.",
    subReasons: ["Only wanted one order", "Prefer manual orders", "Subscription anxiety", "Need more control"],
    cards: ["Skip anytime", "Pause anytime", "Change delivery date", "Cancel from portal"],
    ctas: [
      { label: "Skip next order", branch: "skip" },
      { label: "Pause subscription", branch: "pause" },
      { label: "Move to 8 weeks", branch: "cadence", preselect: "Every 8 weeks" },
    ],
  },
  {
    id: "flavor-texture",
    title: "Flavor or texture not a fit for me",
    helper: "Switch product format before you leave.",
    treatment: "product-fit",
    headline: "Try a better fit before leaving",
    body: "If the format is the issue, switching product type can solve the experience without losing your routine.",
    subReasons: ["Too chewy", "Flavor too strong", "Aftertaste", "Prefer drink format"],
    imageKey: "product-swap",
    cards: ["Switch to electrolyte stick packs", "Try Peach gummies", "Try Watermelon gummies", "Build a product plan"],
    ctas: [
      { label: "Swap product", branch: "product" },
      { label: "Get my product plan", branch: "plan" },
    ],
    plan: {
      title: "Your product plan",
      body: "Move toward the product direction that fits your taste and routine.",
      options: ["Electrolyte stick packs", "Peach gummies", "Watermelon gummies"],
      cta: "Save product plan",
      saved: "Your product plan was saved.",
    },
  },
  {
    id: "sugar",
    title: "Too much sugar or too sweet",
    helper: "Try sugar free stick packs instead.",
    treatment: "product-fit",
    headline: "Switch to a cleaner format",
    body: "Electrolyte stick packs are sugar free and keep the daily habit simple with added hydration support.",
    subReasons: ["Too sweet", "Avoiding sugar", "Prefer sugar free", "Want stick packs"],
    imageKey: "electrolytes",
    cards: ["Zero sugar format", "Added hydration support", "Keeps the daily routine"],
    ctas: [
      { label: "Switch to stick packs", branch: "product", preselect: "Electrolyte stick packs" },
      { label: "Skip next order", branch: "skip" },
      { label: "Contact support", action: "support" },
    ],
    supportContext: "Customer selected too much sugar or too sweet during cancellation flow.",
  },
  {
    id: "digestion",
    title: "Not agreeing with my digestion",
    helper: "Try a gentler routine before cancelling.",
    treatment: "health-fit",
    headline: "Try a gentler routine first",
    body: "Some customers do better by taking OMNI with food, using a smaller serving at first, or switching formats.",
    subReasons: ["Mild stomach upset", "Too much at once", "Need food with it", "Want support advice"],
    cards: ["Take with food", "Start with fewer gummies", "Switch to stick packs"],
    ctas: [
      { label: "Build gentler routine", branch: "plan" },
      { label: "Switch product", branch: "product", preselect: "Electrolyte stick packs" },
      { label: "Contact support", action: "support" },
    ],
    plan: {
      title: "Your gentler routine",
      body: "Try a slower start and only judge fit after the routine feels consistent.",
      options: ["Take with food", "Start with fewer gummies", "Use the same time daily"],
      cta: "Save gentler routine",
      saved: "Your gentler routine was saved.",
    },
    supportContext: "Customer selected digestion discomfort during cancellation flow.",
  },
  {
    id: "fast",
    title: "Orders ship too fast or frequently",
    helper: "Slow deliveries down without cancelling.",
    treatment: "cadence",
    headline: "Slow deliveries without losing your plan",
    body: "Adjust the timing so your next order arrives when you actually need it.",
    subReasons: ["Too frequent", "Wrong next date", "Travel conflict", "Need fewer shipments"],
    cards: ["Move to 8 weeks", "Move to 12 weeks", "Choose a custom date"],
    ctas: [
      { label: "Move to 8 weeks", branch: "cadence", preselect: "Every 8 weeks" },
      { label: "Move to 12 weeks", branch: "cadence", preselect: "Every 12 weeks" },
      { label: "Choose custom date", branch: "cadence", preselect: "Custom date" },
      { label: "Skip next order", branch: "skip" },
    ],
  },
  {
    id: "no-longer-need",
    title: "I no longer need it",
    helper: "Pause or slow delivery in case your routine changes later.",
    treatment: "control",
    headline: "Keep the option open",
    body: "Pause, skip, or slow deliveries instead of closing the account.",
    subReasons: ["Routine changed", "Goal changed", "Taking a break", "Using another supplement"],
    cards: ["Pause without losing setup", "Skip once", "Move to 12 weeks"],
    ctas: [
      { label: "Pause subscription", branch: "pause" },
      { label: "Skip next order", branch: "skip" },
      { label: "Move to 12 weeks", branch: "cadence", preselect: "Every 12 weeks" },
    ],
  },
  {
    id: "product-issue",
    title: "There's an issue with my gummies",
    helper: "Share details so support can resolve it.",
    treatment: "issue",
    headline: "Let support fix the product issue",
    body: "Choose what you are seeing so the team can route it correctly.",
    issueFields: true,
    issueOptions: [
      "Melted or sticky gummies",
      "Damaged pouch or packaging",
      "Wrong flavor or item",
      "Missing item in the order",
      "Taste, smell, or texture seems off",
      "Other product issue",
    ],
    ctas: [
      { label: "Contact support about this issue", action: "support", requiresDetail: true },
      { label: "Pause subscription", branch: "pause" },
    ],
    supportContext: "Customer selected product issue during cancellation flow.",
  },
  {
    id: "packaging-issue",
    title: "Packaging issue with my order",
    helper: "Tell us what happened so support can fix it.",
    treatment: "issue",
    headline: "Let support fix the packaging issue",
    body: "Choose what happened so support can route this correctly.",
    issueFields: true,
    issueOptions: [
      "Pouch arrived damaged",
      "Seal was open",
      "Box was damaged",
      "Items were missing",
      "Label or address issue",
      "Other packaging issue",
    ],
    ctas: [
      { label: "Contact support about packaging", action: "support", requiresDetail: true },
      { label: "Pause subscription", branch: "pause" },
    ],
    supportContext: "Customer selected packaging issue during cancellation flow.",
  },
  {
    id: "alternative",
    title: "I found a better alternative or another product",
    helper: "Compare quality and convenience before making the final call.",
    treatment: "comparison",
    headline: "Check the difference before you switch",
    body: "OMNI is built for daily consistency, convenience, and tested quality. Compare the basics before you leave.",
    subReasons: ["Different brand", "Different format", "Friend recommended another", "Comparing value"],
    cards: ["Third party quality testing", "Daily format made for consistency", "Portal control for timing and skips"],
    ctas: [
      { label: "See why members stay", branch: "education" },
      { label: "Get my personalized plan", branch: "plan" },
      { label: "Apply member savings", branch: "savings", preselect: "50% off next 3 orders" },
    ],
    plan: {
      title: "Your better setup",
      body: "Keep OMNI only where it fits your current routine.",
      options: ["Move to 8 weeks", "Add electrolyte sticks", "Keep member pricing active"],
      cta: "Save better setup",
      saved: "Your better setup was saved.",
    },
  },
  {
    id: "editing",
    title: "I'm having trouble editing my subscription",
    helper: "Get help with the portal controls.",
    treatment: "portal-help",
    headline: "Your controls are still here",
    body: "Skipping, pausing, rescheduling, and changing frequency can all happen from the portal.",
    subReasons: ["Cannot find controls", "Need date change", "Need product change", "Need billing help"],
    cards: ["Change delivery frequency", "Skip next order", "Pause subscription", "Contact support"],
    ctas: [
      { label: "Change delivery frequency", branch: "cadence" },
      { label: "Skip next order", branch: "skip" },
      { label: "Pause subscription", branch: "pause" },
      { label: "Contact support", action: "support" },
    ],
    supportContext: "Trouble editing subscription in portal.",
  },
  {
    id: "other",
    title: "Other reason",
    helper: "Tell us what's missing.",
    treatment: "general",
    headline: "Tell us what is going on",
    body: "Leave a short note or choose a flexible option before making the final decision.",
    subReasons: ["Account question", "Product question", "Timing issue", "Something else"],
    noteField: true,
    ctas: [
      { label: "Contact support", action: "support" },
      { label: "Pause subscription", branch: "pause" },
      { label: "Skip next order", branch: "skip" },
    ],
    supportContext: "Customer selected other reason during cancellation flow.",
  },
];

const branchConfig = {
  cadence: {
    title: "Update delivery frequency",
    body: "Choose when future orders should arrive.",
    options: ["Every 4 weeks", "Every 8 weeks", "Every 12 weeks", "Custom date"],
    cta: "Save frequency",
    saved: "Your frequency was updated.",
  },
  skip: {
    title: "Skip your next order",
    body: "Keep your subscription active and move the next shipment out.",
    options: ["Skip 1 week", "Skip 2 weeks", "Skip 4 weeks"],
    cta: "Skip next order",
    saved: "Your next order was skipped.",
  },
  pause: {
    title: "Pause and keep your member setup",
    body: "Take a break without closing the subscription.",
    options: ["Pause 2 weeks", "Pause 4 weeks", "Pause 8 weeks", "Custom restart date"],
    note: "Your subscription stays active, and orders resume after the pause ends.",
    cta: "Pause subscription",
    saved: "Your pause was saved.",
  },
  savings: {
    title: "Lock in the member savings",
    body: "Choose how you want the offer applied.",
    options: ["50% off next 3 orders", "Skip next order and keep offer", "Keep current plan"],
    cta: "Apply savings",
    saved: "Your savings were applied.",
  },
  product: {
    title: "Choose the format that fits better",
    body: "Pick the product direction you want for future orders.",
    options: ["Electrolyte stick packs", "Peach gummies", "Watermelon gummies"],
    cta: "Save product swap",
    saved: "Your product swap was saved.",
  },
  education: {
    title: "Why members stay",
    body: "This placeholder is ready for deeper website-style content.",
    options: ["Quality testing", "How to take OMNI", "Routine tips"],
    cta: "Save and keep subscription",
    saved: "Your member setup was kept active.",
  },
};

function getBranchConfig(branch, reason) {
  if (branch === "plan" && reason.plan) return reason.plan;
  return branchConfig[branch] || branchConfig.skip;
}

function ProductVisual({ imageKey }) {
  if (!imageKey) return null;
  const productTitle = imageKey === "electrolytes" ? "Electrolyte stick packs" : "Better product fit";
  const productCopy =
    imageKey === "electrolytes"
      ? "A sugar free stick pack direction for customers who want creatine with added hydration support."
      : "A cleaner product fit area for swapping format or flavor without ending the subscription.";

  return (
    <article className={`cancel-product-visual cancel-product-visual-${imageKey}`}>
      <div className="cancel-product-thumb" aria-hidden="true" />
      <div className="cancel-product-copy">
        <span className="cancel-kicker">Product option</span>
        <h3>{productTitle}</h3>
        <p>{productCopy}</p>
      </div>
    </article>
  );
}

function CancellationReasonSelect({ selectedReasonId, onSelect, onContinue, onClose }) {
  return (
    <div className="cancel-step">
      <div className="cancel-step-head">
        <span className="cancel-kicker">Cancellation options</span>
        <h2>Want to adjust anything before you cancel?</h2>
        <p>Choose the closest option so we can show the most useful next step.</p>
      </div>

      <div className="cancel-reason-list">
        {reasonConfig.map((reason) => (
          <button
            key={reason.id}
            type="button"
            className={`cancel-reason-row ${selectedReasonId === reason.id ? "selected" : ""}`}
            onClick={() => onSelect(reason.id)}
          >
            <span className="cancel-radio" aria-hidden="true" />
            <span>
              <strong>{reason.title}</strong>
              <small>{reason.helper}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="cancel-flow-actions">
        <Button variant="outline" onClick={onClose}>Back</Button>
        <Button variant="primary" onClick={onContinue} disabled={!selectedReasonId}>Continue to next step</Button>
      </div>
    </div>
  );
}

function CancellationSavePage({ reason, onBack, onAction, onCancel }) {
  const isIssueFlow = Boolean(reason.issueFields);
  const diagnosticOptions = reason.issueOptions || reason.subReasons || [];
  const [selectedSubReason, setSelectedSubReason] = useState(
    diagnosticOptions.length > 0 && !isIssueFlow ? diagnosticOptions[0] : ""
  );
  const [note, setNote] = useState("");
  const needsDiagnosticAnswer = diagnosticOptions.length > 0;
  const engineLabel = isIssueFlow ? "Support option" : "Recommended option";
  const canContinue = !needsDiagnosticAnswer || Boolean(selectedSubReason);

  const handleAction = (action) => {
    if (!canContinue) return;
    onAction(action, { selectedSubReason, note });
  };

  const handleCancel = () => {
    if (!canContinue) return;
    onCancel();
  };

  return (
    <div className="cancel-step cancel-save-step">
      <h2>{reason.headline}</h2>
      <p>{reason.body}</p>

      <ProductVisual imageKey={reason.imageKey} />

      {reason.offer && <p className="cancel-offer-note">{reason.offer}</p>}

      {diagnosticOptions.length > 0 && (
        <div className="cancel-diagnostic-block">
          <span className="cancel-kicker">{isIssueFlow ? "Choose issue type" : "What best describes it?"}</span>
          <div className="cancel-issue-type-grid" aria-label={isIssueFlow ? "Issue type" : "Cancellation sub reason"}>
            {diagnosticOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`cancel-issue-type ${selectedSubReason === option ? "selected" : ""}`}
                onClick={() => setSelectedSubReason(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {isIssueFlow && selectedSubReason && (
        <div className="cancel-issue-fields" aria-label="Product issue details">
          <span className="cancel-kicker">Details for support</span>
          <label>
            Photo of the gummies
            <input type="file" />
          </label>
          <label>
            Lot number from the back of the sachet
            <input type="text" placeholder="Lot number" />
          </label>
          <label>
            Short description of the issue
            <textarea
              rows="3"
              placeholder={`Tell us about: ${selectedSubReason}`}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
        </div>
      )}

      {reason.noteField && (
        <label className="cancel-note-field">
          Short note
          <textarea rows="3" placeholder="Tell us what is missing" value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
      )}

      <div className={`cancel-save-card cancel-treatment-${reason.treatment} cancel-cta-count-${reason.ctas.length}`}>
        <div className="cancel-save-card-head">
          <div>
            <span className="cancel-kicker">{engineLabel}</span>
            <h3>{reason.ctas[0].label}</h3>
          </div>
          {selectedSubReason && !isIssueFlow && <p className="cancel-selected-choice">Selected: {selectedSubReason}</p>}
        </div>
        {needsDiagnosticAnswer && !selectedSubReason && (
          <p className="cancel-unlock-note">Choose one option above to unlock these actions.</p>
        )}
        {reason.cards?.length > 0 && (
          <div className="cancel-insight-grid">
            {reason.cards.map((card) => (
              <article className="cancel-insight-card" key={card}>
                <span aria-hidden="true">✓</span>
                <strong>{card}</strong>
              </article>
            ))}
          </div>
        )}
        <div className="cancel-save-grid">
          {reason.ctas.map((action, index) => (
            <button
              key={`${reason.id}-${action.label}`}
              type="button"
              className={index === 0 ? "cancel-save-primary" : "cancel-save-secondary"}
              disabled={!canContinue}
              onClick={() => handleAction(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="cancel-text-link"
        onClick={handleCancel}
        disabled={!canContinue}
      >
        {FINAL_STEP_LABEL}
      </button>
    </div>
  );
}

function CancellationBranchScreen({ branch, reason, preselect, onBack, onDone, onCancel }) {
  const config = getBranchConfig(branch, reason);
  const [choice, setChoice] = useState(preselect || config.options[0] || "");

  useEffect(() => {
    setChoice(preselect || config.options[0] || "");
  }, [preselect, config]);

  return (
    <div className="cancel-step">
      <div className="cancel-step-back-row">
        <button type="button" className="cancel-back-link" onClick={onBack}>Back to save page</button>
      </div>
      <div className="cancel-step-head cancel-stacked-head">
        <span className="cancel-selected-label">{reason.title}</span>
        <h2>{config.title}</h2>
        <p>{config.body}</p>
      </div>

      <div className="cancel-branch-card">
        {config.options.map((option) => (
          <button
            key={option}
            type="button"
            className={`cancel-option-pill ${choice === option ? "selected" : ""}`}
            onClick={() => setChoice(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {config.note && <p className="cancel-offer-note">{config.note}</p>}

      <div className="cancel-flow-actions cancel-flow-actions-sticky">
        <Button variant="primary" onClick={() => onDone(config.saved, choice)}>
          {choice ? `${config.cta}: ${choice}` : config.cta}
        </Button>
        <button type="button" className="cancel-text-link" onClick={onCancel}>{FINAL_STEP_LABEL}</button>
      </div>
    </div>
  );
}

function getRescueConfig(reason) {
  const productIssueIds = ["product-issue", "packaging-issue"];
  const overstockIds = ["stocked", "fast"];
  const priceIds = ["expensive"];
  const tasteIds = ["flavor-texture", "sugar", "digestion"];
  const noNeedIds = ["no-longer-need", "trial-only", "habit", "no-results", "alternative", "editing", "other"];

  if (productIssueIds.includes(reason.id)) {
    return {
      eyebrow: "Support first",
      title: "Route this to support before canceling",
      body: "Most product issues get routed faster when support knows what happened. Send the issue to support, pause the next order, then decide.",
      trust: "Support reviews product issues before you make a final decision.",
      actions: [
        { label: "Contact support", action: "support" },
        { label: "Pause subscription", branch: "pause" },
      ],
    };
  }

  if (overstockIds.includes(reason.id)) {
    return {
      eyebrow: "Adjust the pace",
      title: "Stretch deliveries instead of stopping completely",
      body: "Creatine works best with consistency, but your delivery schedule should match your pace. Move the cadence out and avoid overstock.",
      trust: "Changing cadence avoids overstock without losing your routine.",
      actions: [
        { label: "Switch to 12 week delivery", branch: "cadence", preselect: "Every 12 weeks" },
        { label: "Skip next order", branch: "skip" },
      ],
    };
  }

  if (priceIds.includes(reason.id)) {
    return {
      eyebrow: "Reduce commitment",
      title: "Pause your next order and keep control",
      body: "Keep the account open without taking another delivery right now. Pause or skip while timing and budget reset.",
      trust: "Pausing keeps your account open without another delivery.",
      actions: [
        { label: "Pause subscription", branch: "pause" },
        { label: "Skip next order", branch: "skip" },
      ],
    };
  }

  if (tasteIds.includes(reason.id)) {
    return {
      eyebrow: "Better fit option",
      title: "Fix the fit first, then decide",
      body: "Flavor and format issues are fixable. Route the fit issue to support or pause the next delivery while you choose the better direction.",
      trust: "Your subscription stays fully in your control.",
      actions: [
        { label: "Contact support", action: "support" },
        { label: "Pause subscription", branch: "pause" },
      ],
    };
  }

  if (noNeedIds.includes(reason.id)) {
    return {
      eyebrow: "Keep control",
      title: "Keep the door open without another delivery",
      body: "Pause the account instead of closing it. Your subscription stays inactive until you are ready again.",
      trust: "Pausing keeps your account open without another delivery.",
      actions: [
        { label: "Pause subscription", branch: "pause" },
        { label: "Skip next order", branch: "skip" },
      ],
    };
  }

  return {
    eyebrow: "One more option",
    title: "Fix the issue first, then decide",
    body: "Choose the fastest option below and we will adjust your subscription around what you actually need.",
    trust: "Your subscription stays fully in your control.",
    actions: [
      { label: "Pause subscription", branch: "pause" },
      { label: "Skip next order", branch: "skip" },
    ],
  };
}

function getRescueActionCopy(action, rescue) {
  const label = action.label.toLowerCase();
  if (label.includes("support")) return "Send this to support so the team can help before you decide.";
  if (label.includes("pause")) return "Pause deliveries and keep your account open until you are ready.";
  if (label.includes("skip")) return "Skip the next shipment while keeping the subscription active.";
  if (label.includes("12 week")) return "Stretch future deliveries so your next order matches your pace.";
  if (label.includes("8 week")) return "Slow the cadence while keeping your member setup active.";
  if (label.includes("savings") || label.includes("offer")) return "Keep your member setup while making the next orders easier.";
  if (label.includes("product") || label.includes("stick")) return "Switch the product direction without closing your subscription.";
  return rescue.trust || "Keep control of your subscription without closing the account.";
}

function CancellationModalHeader({ onClose }) {
  return (
    <div className="cancel-modal-header">
      <div className="cancel-modal-logo" aria-label="OMNI">
        <img src="/assets/omni-logo-white.svg" alt="OMNI" />
      </div>
      <button className="cancel-flow-close" type="button" onClick={onClose} aria-label="Close cancellation flow">
        ×
      </button>
    </div>
  );
}

function CancellationRescuePage({ reason, onBack, onAction, onContinue }) {
  const rescue = getRescueConfig(reason);
  const [recommendedAction, ...secondaryActions] = rescue.actions;
  const actionCards = [
    { ...recommendedAction, emphasis: "recommended" },
    ...secondaryActions.map((action) => ({ ...action, emphasis: "optional" })),
  ];

  return (
    <div className="cancel-step cancel-rescue-step">
      <div className="cancel-step-back-row">
        <button type="button" className="cancel-back-link" onClick={onBack}>Back to options</button>
      </div>
      <div className="cancel-step-head cancel-stacked-head">
        <span className="cancel-kicker">Account options</span>
        <h2>Choose what you'd like to do next</h2>
        <p>Here's the option that best matches what you selected.</p>
      </div>

      <article className={`cancel-rescue-card cancel-treatment-${reason.treatment}`}>
        <span className="cancel-kicker">{rescue.eyebrow}</span>
        <h3>{rescue.title}</h3>
        <p>{rescue.body}</p>

        <div className="cancel-rescue-action-grid">
          {actionCards.map((action) => (
            <article
              className={`cancel-action-card cancel-action-card-${action.emphasis}`}
              key={`${reason.id}-rescue-${action.label}`}
            >
              <span className="cancel-action-pill">
                {action.emphasis === "recommended" ? "Recommended" : "Optional"}
              </span>
              <strong>{action.label}</strong>
              <p>{getRescueActionCopy(action, rescue)}</p>
              <button
                type="button"
                className={action.emphasis === "recommended" ? "cancel-save-primary" : "cancel-save-secondary"}
                onClick={() => onAction(action)}
              >
                {action.label}
              </button>
            </article>
          ))}
        </div>
      </article>

      <div className="cancel-rescue-footer cancel-rescue-footer-single">
        <button type="button" className="cancel-text-link" onClick={onContinue}>Continue to final cancellation</button>
      </div>
    </div>
  );
}

function getFinalConfirmConfig(reason) {
  const productIssueIds = ["product-issue", "packaging-issue", "flavor-texture", "sugar", "digestion"];
  const overstockIds = ["stocked", "fast"];
  const priceIds = ["expensive"];
  const alternativeIds = ["alternative"];
  const noLongerUsingIds = ["no-longer-need", "trial-only"];

  if (productIssueIds.includes(reason.id)) {
    return {
      pill: "Product issue",
      title: "You can still let support review this first.",
      body: "If you continue, your subscription will be cancelled. If you want the team to review the issue before you decide, go back to the fix options.",
    };
  }

  if (overstockIds.includes(reason.id)) {
    return {
      pill: "Too much product",
      title: "You can still slow deliveries instead of cancelling.",
      body: "If you continue, your subscription will be cancelled. If timing is the issue, go back to switch cadence or skip your next order.",
    };
  }

  if (priceIds.includes(reason.id)) {
    return {
      pill: "Price concern",
      title: "You can still pause instead of cancelling.",
      body: "If you continue, your subscription will be cancelled. If now is not the right time, go back to pause or skip your next order.",
    };
  }

  if (alternativeIds.includes(reason.id)) {
    return {
      pill: "Considering another product",
      title: "You can still keep your OMNI subscription active.",
      body: "If you continue, your subscription will be cancelled. If you want to compare options first, go back to the fix options.",
    };
  }

  if (noLongerUsingIds.includes(reason.id)) {
    return {
      pill: "Not using it right now",
      title: "You can still keep control without another delivery.",
      body: "If you continue, your subscription will be cancelled. If you may come back later, go back to pause instead.",
    };
  }

  return {
    pill: "Other reason",
    title: "You can still choose a lighter option.",
    body: "If you continue, your subscription will be cancelled. If you want to pause, skip, or contact support first, go back to the fix options.",
  };
}

function CancellationFinalConfirm({ reason, onBack, onConfirm }) {
  const finalCopy = getFinalConfirmConfig(reason);

  return (
    <div className="cancel-step cancel-confirm-step">
      <div className="cancel-confirm-shell">
        <div className="cancel-step-back-row">
          <button type="button" className="cancel-back-link" onClick={onBack}>Back to options</button>
        </div>
        <div className="cancel-step-head cancel-stacked-head">
          <span className="cancel-kicker">Final choice</span>
          <h2>Choose how you'd like to finish</h2>
          <p className="cancel-final-subcopy">Your subscription can be cancelled now, or you can adjust the next order instead.</p>
        </div>

        <div className="cancel-confirm-card">
          <span className="cancel-selected-label">{finalCopy.pill}</span>
          <h3>{finalCopy.title}</h3>
          <p>{finalCopy.body}</p>
        </div>

        <div className="cancel-confirm-actions">
          <Button variant="primary" onClick={onBack}>Adjust next order</Button>
          <Button variant="outline" onClick={onConfirm}>Cancel subscription</Button>
        </div>
      </div>
    </div>
  );
}

function CancellationSavedScreen({ message, onDone }) {
  return (
    <div className="cancel-step cancel-complete-step cancel-complete-step-saved">
      <span className="cancel-kicker">Saved</span>
      <h2>{message}</h2>
      <p>Your subscription stays active. You can return to the overview and keep managing your order.</p>
      <Button variant="primary" onClick={onDone}>Return to subscription overview</Button>
    </div>
  );
}

function CancellationCompleteScreen({ onDone }) {
  return (
    <div className="cancel-step cancel-complete-step cancel-complete-step-cancelled">
      <span className="cancel-kicker">Cancelled</span>
      <h2>Your subscription has been cancelled.</h2>
      <p>You'll still have access to your account if you want to restart later.</p>
      <Button variant="primary" onClick={onDone}>Done</Button>
    </div>
  );
}

export default function CancellationFlow({ open, onClose, onKept, onSupportStarted }) {
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [step, setStep] = useState("reason");
  const [branch, setBranch] = useState("");
  const [branchPreselect, setBranchPreselect] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const selectedReason = useMemo(
    () => reasonConfig.find((reason) => reason.id === selectedReasonId),
    [selectedReasonId]
  );

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    trackCancellationEvent("flow_opened");
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const closeFlow = ({ skipAbandonedEvent = false } = {}) => {
    if (!skipAbandonedEvent && step === "confirm" && selectedReason?.id) {
      trackCancellationEvent("final_cancellation_abandoned", { reasonId: selectedReason.id, source: "close" });
    }
    setSelectedReasonId("");
    setStep("reason");
    setBranch("");
    setBranchPreselect("");
    setSavedMessage("");
    setSubmitted(false);
    onClose();
  };

  const handleBackdrop = () => {
    if (step === "reason" && !submitted && !savedMessage) closeFlow();
  };

  const handleReasonSelect = (reasonId) => {
    setSelectedReasonId(reasonId);
    trackCancellationEvent("cancellation_reason_selected", { reasonId });
  };

  const handleAction = (action, context = {}) => {
    trackCancellationEvent(getActionEventName(action), {
      reasonId: selectedReason?.id,
      action: action.label,
      subReason: context.selectedSubReason,
    });

    if (action.action === "support") {
      const supportContext = [
        selectedReason?.supportContext || `Customer selected ${selectedReason?.title} during cancellation flow.`,
        context.selectedSubReason ? `Sub reason: ${context.selectedSubReason}.` : "",
        context.note ? `Note: ${context.note}` : "",
      ].filter(Boolean).join(" ");
      window.open(supportUrlWithContext(supportContext), "_blank", "noopener,noreferrer");
      closeFlow({ skipAbandonedEvent: true });
      onSupportStarted?.("Support request started.");
      return;
    }

    setBranch(action.branch || "skip");
    setBranchPreselect(action.preselect || "");
    setStep("branch");
    trackCancellationEvent("branch_opened", { reasonId: selectedReason?.id, branch: action.branch, preselect: action.preselect });
  };

  const handleSaved = (message, choice) => {
    const finalMessage = message || "Your subscription update was saved.";
    setSavedMessage(finalMessage);
    setStep("saved");
    trackCancellationEvent("save_completed", { reasonId: selectedReason?.id, branch, choice, message: finalMessage });
  };

  const reviewFinalStep = () => {
    trackCancellationEvent("save_page_viewed", { reasonId: selectedReason?.id, step });
    setStep("rescue");
  };

  const continueToFinalConfirmation = () => {
    trackCancellationEvent("continue_to_final_cancellation_clicked", { reasonId: selectedReason?.id, step });
    setStep("confirm");
  };

  return (
    <div className="cancel-flow-backdrop" role="presentation" onClick={handleBackdrop}>
      <section
        className="cancel-flow-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Cancel subscription flow"
        onClick={(event) => event.stopPropagation()}
      >
        <CancellationModalHeader onClose={closeFlow} />

        {!submitted && !savedMessage && step === "reason" && (
          <CancellationReasonSelect
            selectedReasonId={selectedReasonId}
            onSelect={handleReasonSelect}
            onContinue={() => {
              trackCancellationEvent("save_page_viewed", { reasonId: selectedReasonId });
              setStep("save");
            }}
            onClose={closeFlow}
          />
        )}
        {!submitted && !savedMessage && step === "save" && selectedReason && (
          <CancellationSavePage
            reason={selectedReason}
            onBack={() => setStep("reason")}
            onAction={handleAction}
            onCancel={reviewFinalStep}
          />
        )}
        {!submitted && !savedMessage && step === "branch" && selectedReason && (
          <CancellationBranchScreen
            branch={branch}
            preselect={branchPreselect}
            reason={selectedReason}
            onBack={() => setStep("save")}
            onDone={handleSaved}
            onCancel={reviewFinalStep}
          />
        )}
        {!submitted && !savedMessage && step === "rescue" && selectedReason && (
          <CancellationRescuePage
            reason={selectedReason}
            onBack={() => setStep("save")}
            onAction={(action) => handleAction(action, { selectedSubReason: "Final save attempt" })}
            onContinue={continueToFinalConfirmation}
          />
        )}
        {!submitted && !savedMessage && step === "confirm" && selectedReason && (
          <CancellationFinalConfirm
            reason={selectedReason}
            onBack={() => setStep("rescue")}
            onConfirm={() => {
              trackCancellationEvent("final_cancellation_confirmed", { reasonId: selectedReason.id });
              setSubmitted(true);
            }}
          />
        )}
        {savedMessage && <CancellationSavedScreen message={savedMessage} onDone={closeFlow} />}
        {submitted && <CancellationCompleteScreen onDone={closeFlow} />}
      </section>
    </div>
  );
}
