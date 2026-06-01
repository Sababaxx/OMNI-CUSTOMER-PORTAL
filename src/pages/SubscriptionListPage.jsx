import React, { useState } from "react";
import Button from "../components/Button.jsx";
import PortalNav from "../components/PortalNav.jsx";
import PortalOfferStack from "../components/PortalOfferStack.jsx";
import RestartFlow from "../components/RestartFlow.jsx";
import { subscription, subscriptionStatus, lastSubscription } from "../data/subscription.js";

function SubscriptionListPage({ activeView = "home", onNavigate, onOpen, onAddNew, onLogout }) {
  const isInactive = subscriptionStatus === "inactive";
  const [restartOpen, setRestartOpen] = useState(false);

  return (
    <div className="portal-shell portal-shell-dashboard">
      <div className="portal-layout">
        <PortalNav activeView={activeView} onNavigate={onNavigate} onLogout={onLogout} />

        <main className="portal-main">
          <section className="home-card" aria-label="Account overview">

            {/* ── Top greeting + CTAs — same structure, different buttons ── */}
            <div className="home-topline">
              <div className="member-greeting">
                <h1>Hello, Saba</h1>
                <span>Logged in as buy@omnicreatine.com</span>
                <p>Member since January 2026</p>
              </div>
              <div className="home-quick-actions">
                {isInactive ? (
                  <>
                    <Button variant="primary" onClick={() => setRestartOpen(true)}>Restart subscription</Button>
                    <Button variant="outline" onClick={() => onNavigate("orders")}>View past orders</Button>
                  </>
                ) : (
                  <>
                    <Button variant="primary" onClick={onOpen}>Manage subscription</Button>
                    <Button variant="outline" onClick={onAddNew}>Add product</Button>
                  </>
                )}
              </div>
            </div>

            {/* ── Summary strip — same 4-cell grid, inactive swaps cell labels ── */}
            <div className="account-summary-strip">
              {isInactive ? (
                <>
                  <div>
                    <span className="mini-label">Subscription status</span>
                    <strong>Inactive</strong>
                  </div>
                  <div>
                    <span className="mini-label">Last product</span>
                    <strong>{lastSubscription.product} · {lastSubscription.flavor}</strong>
                  </div>
                  <div>
                    <span className="mini-label">Last cadence</span>
                    <strong>{lastSubscription.cadence}</strong>
                  </div>
                  <div>
                    <span className="mini-label">Last order</span>
                    <strong>{lastSubscription.lastOrderDate} · {lastSubscription.lastOrderValue}</strong>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="mini-label">Active subscription</span>
                    <strong>Next order: {subscription.nextOrderDate}</strong>
                  </div>
                  <div>
                    <span className="mini-label">Current plan</span>
                    <strong>{subscription.frequency.replace("Deliver ", "")}</strong>
                  </div>
                  <div>
                    <span className="mini-label">Order value</span>
                    <strong>${subscription.total.toFixed(2)} + ${subscription.shippingPerDelivery.toFixed(2)} shipping</strong>
                  </div>
                  <div>
                    <span className="mini-label">Member savings</span>
                    <strong>$80 saved this cycle</strong>
                  </div>
                </>
              )}
            </div>

            {/* ── Command card — same component style, copy swapped for inactive ── */}
            <div className="home-command-card">
              {isInactive ? (
                <>
                  <div>
                    <span className="mini-label">Pick the routine that fits now</span>
                    <h2>Ready to restart?</h2>
                    <p>Your past order is saved so restarting is easy. Choose your timing before anything ships.</p>
                  </div>
                  <Button variant="outline" onClick={() => setRestartOpen(true)}>Choose a new routine</Button>
                </>
              ) : (
                <>
                  <div>
                    <span className="mini-label">Next OMNI order</span>
                    <h2>Ships {subscription.nextOrderDate}</h2>
                    <p>Three pouches are queued for your next delivery. You can adjust timing or edit products from Manage Subscriptions.</p>
                  </div>
                  <Button variant="outline" onClick={onOpen}>Open details</Button>
                </>
              )}
            </div>

            {/* ── Offer section heading ─────────────────────────────────── */}
            <div className="home-offer-heading">
              <span className="mini-label">Member offers</span>
              <h2>{isInactive ? "Ways to restart your routine" : "Fresh ways to upgrade your next order"}</h2>
            </div>

            <PortalOfferStack
              showIntro={false}
              variant={isInactive ? "inactive-home" : "home"}
              onRestartOpen={() => setRestartOpen(true)}
            />
          </section>
        </main>
      </div>

      <RestartFlow
        open={restartOpen}
        onClose={() => setRestartOpen(false)}
      />
    </div>
  );
}

SubscriptionListPage.Nav = PortalNav;
export default SubscriptionListPage;
