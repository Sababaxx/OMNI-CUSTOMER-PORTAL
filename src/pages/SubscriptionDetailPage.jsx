import React, { useState } from "react";
import ActionModal from "../components/ActionModal.jsx";
import Button from "../components/Button.jsx";
import CancelIntroVideoModal from "../components/CancelIntroVideoModal.jsx";
import CancellationFlow from "../components/CancellationFlow.jsx";
import PortalNav from "../components/PortalNav.jsx";
import PortalOfferStack from "../components/PortalOfferStack.jsx";
import ProductWorkspace from "../components/ProductWorkspace.jsx";
import RestartFlow from "../components/RestartFlow.jsx";
import { ChevronLeft } from "../components/Icons.jsx";
import { subscription, lastSubscription } from "../data/subscription.js";
import { useSubscription } from "../context/SubscriptionContext.jsx";

export default function SubscriptionDetailPage({ activeView = "manage", onNavigate, onLogout, onBack }) {
  const sub = subscription;
  const { isInactive, isPaused, pauseInfo, pauseSubscription, resumeSubscription } = useSubscription();

  const [modal, setModal] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isCancelIntroOpen, setIsCancelIntroOpen] = useState(false);
  const [isCancellationOpen, setIsCancellationOpen] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [skipSuccess, setSkipSuccess] = useState(false);
  const [skipConfirm, setSkipConfirm] = useState(false);
  const [nextOrderDate, setNextOrderDate] = useState("2026-06-26");

  const openModal = (title) => { setMoreOpen(false); setModal(title); };
  const openCancelIntro = () => { setMoreOpen(false); setIsCancelIntroOpen(true); };
  const continueToCancellationFlow = () => { setIsCancelIntroOpen(false); setIsCancellationOpen(true); };

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 2600);
  };

  const saveNextOrderDate = () => { showToast("Next order date updated."); setModal(null); };
  const handleSkip = () => { setMoreOpen(false); setSkipConfirm(true); };
  const confirmSkip = () => { setSkipConfirm(false); setSkipSuccess(true); };
  const handlePause = (label) => { pauseSubscription(label); setModal(null); showToast(`Subscription paused for ${label}.`); };
  const handleResume = () => { resumeSubscription(); showToast("Subscription resumed. Your next order is scheduled."); };

  const displayDate = nextOrderDate
    ? new Date(nextOrderDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : sub.nextOrderDate.replace(", 2026", "");

  // ── Skip success (active only) ─────────────────────────────────────────────
  if (!isInactive && skipSuccess) {
    return (
      <div className="portal-shell portal-shell-dashboard">
        <div className="portal-layout detail-layout">
          <PortalNav activeView={activeView} onNavigate={onNavigate} onLogout={onLogout} />
          <main className="portal-main">
            <div className="skip-success-screen">
              <div className="skip-success-check" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M4.5 11.5L9 16L17.5 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="cancel-kicker">Saved</span>
              <h2>Your order has been skipped</h2>
              <p>Your subscription stays active.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-shell portal-shell-dashboard">
      <div className="portal-layout detail-layout">
        <PortalNav activeView={activeView} onNavigate={onNavigate} onLogout={onLogout} />

        <main className="portal-main">
          {/* ── Hero: same grid skeleton for both active and inactive ──── */}
          <section className="manage-hero" aria-label={isInactive ? "Inactive subscription" : "Subscription controls"}>
            <div className="manage-title-area">
              <Button variant="outline" size="sm" className="back-btn" onClick={onBack}>
                <ChevronLeft /> Back
              </Button>
              {isInactive ? (
                <>
                  <h1>Your subscription</h1>
                  <p className="manage-inactive-sub">Restart when you're ready. Choose your timing before anything ships.</p>
                </>
              ) : isPaused ? (
                <>
                  <h1>Paused</h1>
                  <p className="manage-inactive-sub">
                    {pauseInfo?.resumeDate
                      ? `Your subscription is paused and resumes ${pauseInfo.resumeDate}. Resume anytime.`
                      : "Your subscription is paused. Resume anytime."}
                  </p>
                </>
              ) : (
                <>
                  <h1>Every 4 weeks</h1>
                  <p><strong>${sub.total.toFixed(2)}</strong> · <span>Next on {displayDate}</span></p>
                </>
              )}
            </div>

            {/* ── Action row — inactive replaces active controls ─────── */}
            <div className={`manage-action-row${isInactive || isPaused ? " manage-action-row-inactive" : ""}`}>
              {isInactive ? (
                <>
                  <Button variant="primary" onClick={() => setRestartOpen(true)}>Restart subscription</Button>
                  <Button variant="outline" onClick={() => setRestartOpen(true)}>Change products</Button>
                  <Button variant="outline" onClick={() => openModal("Update shipping")}>Update shipping</Button>
                  <Button variant="outline" onClick={() => openModal("Update payment")}>Update payment</Button>
                </>
              ) : isPaused ? (
                <>
                  <Button variant="primary" onClick={handleResume}>Resume subscription</Button>
                  <Button variant="outline" onClick={() => openModal("Update shipping")}>Update shipping</Button>
                  <Button variant="outline" onClick={() => openModal("Update payment")}>Update payment</Button>
                  <Button variant="outline" onClick={openCancelIntro}>Cancel subscription</Button>
                </>
              ) : (
                <>
                  <Button variant="primary" onClick={() => openModal("Order now")}>Order now</Button>
                  <Button variant="outline" onClick={() => openModal("Change next order date")}>Next order date</Button>
                  <Button variant="outline" onClick={handleSkip}>Skip</Button>
                  <div className="more-menu-wrap">
                    <Button variant="outline" onClick={() => setMoreOpen((o) => !o)}>More</Button>
                    {moreOpen && (
                      <div className="more-menu">
                        <button type="button" onClick={() => openModal("Pause subscription")}>Pause subscription</button>
                        <button type="button" onClick={openCancelIntro}>Cancel subscription</button>
                        <button type="button" onClick={() => openModal("Manage payment")}>Manage payment</button>
                        <button type="button" onClick={() => openModal("Update shipping")}>Update shipping</button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ── Current / last product card ───────────────────────────── */}
          <section className="manage-current-section" aria-label={isInactive ? "Last subscription" : "Current subscription"}>
            <h2 className="workspace-title">{isInactive ? "Last subscription" : "Your subscription"}</h2>
            <div className="manage-current-product-card">
              <div className="manage-product-img">
                <img src="/assets/omni-product-peach.png" alt="OMNI Creatine Monohydrate Gummies Peach" />
              </div>
              <div className="manage-product-info">
                <span className="manage-product-name">{isInactive ? lastSubscription.product : "Daily Creatine Gummy"}</span>
                <span className="manage-product-detail">
                  {isInactive
                    ? `${lastSubscription.flavor} · ${lastSubscription.cadence}`
                    : "Peach · 1 pouch · every 4 weeks"}
                </span>
                <div className="manage-product-meta">
                  <span className={`manage-status-badge${isInactive || isPaused ? " manage-status-badge-inactive" : ""}`}>
                    {isInactive ? "Inactive" : isPaused ? "Paused" : "Active"}
                  </span>
                  {isInactive
                    ? <span className="manage-next-label">Last ordered {lastSubscription.lastOrderDate}</span>
                    : isPaused
                    ? <span className="manage-next-label">Resumes {pauseInfo?.resumeDate || "when you're ready"}</span>
                    : <span className="manage-next-label">Next {displayDate}</span>}
                </div>
              </div>
              <div className="manage-product-price">
                <strong>{isInactive ? lastSubscription.lastOrderValue : "$42.00"}</strong>
                <span className="manage-price-per">/order</span>
              </div>
            </div>
          </section>

          {/* ── Member / restart offers ───────────────────────────────── */}
          <section className="manage-offers-section" aria-label={isInactive ? "Restart options" : "Member offers"}>
            <h2 className="workspace-title">{isInactive ? "Pick the routine that fits now" : "Member offers"}</h2>
            <PortalOfferStack
              variant={isInactive ? "inactive-manage" : "manage"}
              showIntro={false}
              onRestartOpen={() => setRestartOpen(true)}
            />
          </section>

          <ProductWorkspace />
        </main>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      {modal && (
        <ActionModal
          title={modal}
          onClose={() => setModal(null)}
          onAction={modal === "Change next order date" ? saveNextOrderDate : undefined}
          actionLabel={modal === "Change next order date" ? "Save date" : undefined}
          actionVariant="primary"
        >
          {modal === "Order now" && (
            <p>Your next OMNI order is ready to process today. This would charge the saved payment method and move the queued gummies into fulfillment.</p>
          )}
          {modal === "Change next order date" && (
            <div className="edit-form modal-date-form">
              <p>Choose a new delivery date for the next OMNI shipment. Your products and subscription frequency stay the same.</p>
              <div className="modal-calendar-wrap">
                <input type="date" className="modal-date-input" value={nextOrderDate} min="2026-05-07" onChange={(e) => setNextOrderDate(e.target.value)} />
              </div>
            </div>
          )}
          {modal === "Pause subscription" && (
            <>
              <p>Pause deliveries for a short break without canceling your OMNI subscription. Pick a pause length.</p>
              <div className="modal-option-row">
                <button type="button" onClick={() => handlePause("4 weeks")}>4 weeks</button>
                <button type="button" onClick={() => handlePause("8 weeks")}>8 weeks</button>
                <button type="button" onClick={() => handlePause("12 weeks")}>12 weeks</button>
              </div>
            </>
          )}
          {modal === "Manage payment" && <p>Update the saved payment method for future OMNI orders. No card changes are made here.</p>}
          {modal === "Update shipping" && <p>Update the shipping address for future OMNI deliveries. These changes will apply when your subscription is active.</p>}
          {modal === "Update payment" && <p>Update the saved payment method. No charges are made until you restart your subscription and confirm the first order.</p>}
        </ActionModal>
      )}

      <CancelIntroVideoModal
        open={isCancelIntroOpen}
        onClose={() => setIsCancelIntroOpen(false)}
        onContinue={continueToCancellationFlow}
        onSkipNextOrder={(choice) => { setIsCancelIntroOpen(false); showToast(`${choice} selected.`); }}
      />
      <CancellationFlow
        open={isCancellationOpen}
        onClose={() => setIsCancellationOpen(false)}
        onKept={() => showToast("Subscription kept active.")}
      />

      {!isInactive && skipConfirm && (
        <ActionModal title="Skip this order?" onClose={() => setSkipConfirm(false)} hideFooter>
          <p>Your next order scheduled for <strong>{displayDate}</strong> will be skipped. Your subscription stays active — the order after that will ship on the usual schedule.</p>
          <div className="modal-actions modal-actions-row">
            <Button variant="primary" onClick={confirmSkip}>Yes, skip it</Button>
            <Button variant="outline" onClick={() => setSkipConfirm(false)}>Keep my order</Button>
          </div>
        </ActionModal>
      )}

      <RestartFlow
        open={restartOpen}
        onClose={() => setRestartOpen(false)}
        onRestarted={() => showToast("Subscription restarted. Your first order is scheduled.")}
      />

      {toastMessage && <div className="portal-toast" role="status">{toastMessage}</div>}
    </div>
  );
}
