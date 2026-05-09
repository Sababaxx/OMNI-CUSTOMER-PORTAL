import React, { useState } from "react";
import ActionModal from "./ActionModal.jsx";
import PortalOfferBlock from "./PortalOfferBlock.jsx";

const offers = [
  {
    id: "stack",
    imageUrl: "/assets/omni-static-1.png",
    alt: "OMNI Creatine Gummies and Electrolytes stack offer",
    modalTitle: "Try the stack",
    actionLabel: "Add stack",
    offerCopy: {
      eyebrow: "Gummies + electrolytes",
      image: "/assets/omni-static-1.png",
      imageAlt: "OMNI Creatine Gummies with OMNI Creatine and Electrolytes",
      body: "Add OMNI Creatine Gummies and OMNI Creatine + Electrolytes stick packs to your next shipment. This stack is built for a simple daily routine: creatine support from the gummies, hydration support from electrolytes, and one delivery instead of a separate reorder.",
      bullets: ["Includes peach creatine gummies", "Adds pear electrolyte stick packs", "Ships with your next subscription order"],
      note: "Final pricing and flavor are confirmed before checkout.",
    },
    hotspot: { left: "60.5%", top: "50.7%", width: "13.7%", height: "9.8%" },
    variant: "hero",
  },
  {
    id: "upgrade",
    imageUrl: "/assets/omni-offer-2.png",
    alt: "Save 30 percent every month OMNI subscription upgrade offer",
    modalTitle: "Upgrade order",
    actionLabel: "Upgrade order",
    offerCopy: {
      eyebrow: "Subscription upgrade",
      image: "/assets/omni-offer-2.png",
      imageAlt: "Three OMNI Creatine Gummies pouches subscription offer",
      body: "Upgrade your next OMNI delivery to a larger subscription supply and keep creatine gummies stocked without coming back to reorder each time. This offer is designed for members who want a consistent routine and better subscription value.",
      bullets: ["Save 30% on the upgraded subscription offer", "Three pouches queued for recurring delivery", "Cancel or adjust from Manage Subscriptions"],
      note: "Your current next order date stays in place unless you choose to change it.",
    },
    hotspot: { left: "61.5%", top: "70.0%", width: "24.0%", height: "12.0%" },
    variant: "campaign",
  },
];

const manageOffers = [
  {
    id: "manage-quarterly",
    imageUrl: "/assets/omni-quarterly-upgrade.png",
    alt: "Upgrade to quarterly OMNI subscription and save",
    modalTitle: "Upgrade to Quarterly",
    actionLabel: "Upgrade now",
    offerCopy: {
      eyebrow: "Delicious Choice",
      image: "/assets/omni-quarterly-upgrade.png",
      imageAlt: "OMNI Creatine Gummies quarterly subscription offer",
      body: "Switch to a quarterly delivery schedule and lock in better per-order value. Fewer billing cycles, the same consistent creatine routine, and full control to skip or pause from the portal anytime.",
      bullets: ["Save more per pouch on quarterly billing", "Less to manage — fewer order cycles", "Skip, pause, or cancel anytime from the portal"],
      note: "Your next billing cycle updates after confirmation.",
    },
  },
  {
    id: "manage-electrolytes",
    imageUrl: "/assets/omni-offer-electrolytes.png",
    alt: "Add OMNI Creatine and Electrolyte stick packs to your subscription",
    modalTitle: "Add Electrolytes",
    actionLabel: "Add to subscription",
    offerCopy: {
      eyebrow: "Daily Hydration",
      image: "/assets/omni-offer-electrolytes.png",
      imageAlt: "OMNI Creatine and Electrolytes pear stick packs",
      body: "Add OMNI Creatine + Electrolytes stick packs to your next shipment. Pairs naturally with your daily gummy routine — creatine support in the morning, hydration support when you train.",
      bullets: ["Ships with your next subscription order", "Available in pear or peach", "No extra delivery fees — bundled in one box"],
      note: "Flavor and pricing are confirmed before this is added.",
    },
  },
];

const homeOffers = [
  {
    id: "home-body-needs",
    imageUrl: "/assets/omni-offer-try-today.png",
    alt: "OMNI Creatine Monohydrate Gummies watermelon pouch",
    modalTitle: "Try OMNI today",
    actionLabel: "Add gummies",
    offerCopy: {
      eyebrow: "Daily creatine gummies",
      image: "/assets/omni-offer-try-today.png",
      imageAlt: "OMNI Creatine Monohydrate Gummies watermelon pouch",
      imagePosition: "center center",
      body: "Add one pouch of OMNI Creatine Monohydrate Gummies to your next order. No scoops, no shaker, no messy powder; just a simple gummy format for a consistent creatine routine.",
      bullets: ["Choose peach or watermelon", "30 servings per pouch", "Designed for daily strength, performance, and consistency"],
      note: "Flavor choice is confirmed before this is added.",
    },
    hotspot: { left: "2.4%", top: "83.2%", width: "29.5%", height: "7.6%" },
    variant: "campaign",
    isAnimated: true,
    animationDelay: ".12s",
  },
  {
    id: "home-swap-flavor",
    imageUrl: "/assets/omni-offer-swap.png",
    alt: "Swap your OMNI gummy flavor offer",
    modalTitle: "Swap Flavor",
    actionLabel: "Swap my flavor",
    offerCopy: {
      eyebrow: "Try New Flavor",
      image: "/assets/omni-offer-swap.png",
      imageAlt: "OMNI Creatine Gummies flavor swap offer",
      imagePosition: "center 65%",
      body: "Switch your current gummy flavor to something new. Try Peach or Watermelon and keep the same routine with a fresh taste.",
      bullets: ["Switch between Peach and Watermelon", "Keeps same quantity and frequency", "Change applies to your next order"],
      note: "Flavor swap is confirmed before it reaches your next order.",
    },
    hotspot: { left: "67.7%", top: "39.3%", width: "29.7%", height: "7.3%" },
    variant: "campaign",
    isAnimated: true,
    animationDelay: ".28s",
    cardClassName: "home-offer-card-swap",
  },
  {
    id: "home-upgrade",
    imageUrl: "/assets/omni-quarterly-upgrade.png",
    alt: "Upgrade to quarterly OMNI subscription offer",
    modalTitle: "Upgrade to Quarterly",
    actionLabel: "Upgrade to quarterly",
    offerCopy: {
      eyebrow: "Delicious Choice",
      image: "/assets/omni-quarterly-upgrade.png",
      imageAlt: "OMNI Creatine Gummies quarterly subscription upgrade offer",
      body: "Move your subscription to quarterly delivery and lock in better value on every order. Ideal for members who have their routine dialed in and want fewer order cycles to manage.",
      bullets: ["Save more per order on a quarterly plan", "Keep gummies consistently stocked", "Edit, skip, or cancel from the portal anytime"],
      note: "This updates your next order after confirmation.",
    },
    hotspot: { left: "63.7%", top: "60.7%", width: "29.8%", height: "7.0%" },
    variant: "hero",
    isAnimated: false,
  },
];

export default function PortalOfferStack({
  customerName = "Debbie",
  email = "buy@omnicreatine.com",
  memberSince = "January 2026",
  showIntro = true,
  compact = false,
  variant = "manage",
}) {
  const [activeOffer, setActiveOffer] = useState(null);
  const activeOffers = variant === "home" ? homeOffers : variant === "manage" ? manageOffers : offers;

  const renderOfferCopy = (offer) => (
    <div className="offer-modal-copy">
      {offer.offerCopy.image && (
        <div className="offer-modal-image">
          <img src={offer.offerCopy.image} alt={offer.offerCopy.imageAlt} style={offer.offerCopy.imagePosition ? { objectPosition: offer.offerCopy.imagePosition } : undefined} />
        </div>
      )}
      <span className="modal-eyebrow">{offer.offerCopy.eyebrow}</span>
      <p>{offer.offerCopy.body}</p>
      <ul>
        {offer.offerCopy.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="modal-note">{offer.offerCopy.note}</p>
    </div>
  );

  // ── Home variant: premium offer cards with image + text label ──────────────
  if (variant === "home") {
    return (
      <section className="home-offers-section" aria-label="Member offers">
        <div className="home-offers-grid">
          {homeOffers.map((offer, index) => (
            <button
              key={offer.id}
              type="button"
              className={`home-offer-card${index === 0 ? " home-offer-card-hero" : " home-offer-card-compact"}${offer.id === "home-upgrade" ? " home-offer-card-square" : ""}${offer.cardClassName ? ` ${offer.cardClassName}` : ""}`}
              onClick={() => setActiveOffer(offer)}
            >
              <div className="home-offer-card-img">
                <img src={offer.imageUrl} alt={offer.alt} draggable="false" />
              </div>
              <div className="home-offer-card-body">
                <span className="home-offer-card-eyebrow">{offer.offerCopy.eyebrow}</span>
                <span className="home-offer-card-title">{offer.modalTitle}</span>
                <span className="home-offer-card-cta">{offer.actionLabel} →</span>
              </div>
            </button>
          ))}
        </div>

        {activeOffer && (
          <ActionModal
            title={activeOffer.modalTitle}
            onClose={() => setActiveOffer(null)}
            actionLabel={activeOffer.actionLabel}
            size="wide"
          >
            {renderOfferCopy(activeOffer)}
          </ActionModal>
        )}
      </section>
    );
  }

  // ── Manage variant: 2-col premium offer cards ─────────────────────────────
  if (variant === "manage") {
    return (
      <section className="manage-offers-grid-section" aria-label="Member offers">
        <div className="manage-offers-grid">
          {manageOffers.map((offer) => (
            <button
              key={offer.id}
              type="button"
              className={`manage-offer-card${offer.id === "manage-quarterly" ? " manage-offer-card-square" : ""}${offer.id === "manage-electrolytes" ? " manage-offer-card-electrolytes" : ""}`}
              onClick={() => setActiveOffer(offer)}
            >
              <div className="manage-offer-card-img">
                <img src={offer.imageUrl} alt={offer.alt} draggable="false" />
              </div>
              <div className="manage-offer-card-body">
                <span className="manage-offer-card-eyebrow">{offer.offerCopy.eyebrow}</span>
                <span className="manage-offer-card-title">{offer.modalTitle}</span>
                <span className="manage-offer-card-cta">{offer.actionLabel} →</span>
              </div>
            </button>
          ))}
        </div>

        {activeOffer && (
          <ActionModal
            title={activeOffer.modalTitle}
            onClose={() => setActiveOffer(null)}
            actionLabel={activeOffer.actionLabel}
            size="wide"
          >
            {renderOfferCopy(activeOffer)}
          </ActionModal>
        )}
      </section>
    );
  }

  return (
    <section className={`portal-offer-panel portal-offer-panel-${variant} ${compact ? "portal-offer-panel-compact" : ""}`} aria-label="Member offer blocks">
      {showIntro && (
        <div className="portal-offer-intro">
          <h2>
            Hello, {customerName}
            <span> logged in as {email}</span>
          </h2>
          <p>Thank you for being a member since {memberSince}!</p>
        </div>
      )}

      <div className="portal-offer-stack">
        {activeOffers.map((offer, index) => (
          <PortalOfferBlock
            key={offer.id}
            {...offer}
            isAnimated={offer.isAnimated ?? index === 0}
            onOpen={() => setActiveOffer(offer)}
          />
        ))}
      </div>

      {activeOffer && (
        <ActionModal
          title={activeOffer.modalTitle}
          onClose={() => setActiveOffer(null)}
          actionLabel={activeOffer.actionLabel}
          size="wide"
        >
          {renderOfferCopy(activeOffer)}
        </ActionModal>
      )}
    </section>
  );
}
