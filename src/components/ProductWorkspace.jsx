import React, { useState } from "react";
import ActionModal from "./ActionModal.jsx";

const GIFT_LOCK_KEY = "omni-free-gift-lock";

const recs = [
  {
    name: "Daily Creatine Gummy",
    desc: "One pouch of OMNI creatine gummies from the product export.",
    options: [
      { label: "Peach / 1x", price: 42, image: "/assets/omni-product-peach.png" },
      { label: "Watermelon / 1x", price: 42, image: "/assets/omni-product-watermelon.png" },
    ],
    tone: "peach",
  },
  {
    name: "Two Pouches",
    desc: "A 60-day gummy supply with Peach or Watermelon options.",
    options: [
      { label: "Peach / 2x", price: 79, image: "/assets/omni-product-peach.png" },
      { label: "Watermelon / 2x", price: 79, image: "/assets/omni-product-watermelon.png" },
    ],
    tone: "watermelon",
  },
  {
    name: "OMNI Electrolytes",
    desc: "Creatine and electrolyte stick packs in Pear or Peach.",
    options: [
      { label: "Pear / 1x", price: 67, image: "/assets/omni-product-electrolytes-pear.png" },
      { label: "Peach / 1x", price: 67, image: "/assets/omni-product-3x-peach.png" },
      { label: "Pear / 2x", price: 134, image: "/assets/omni-product-electrolytes-pear.png" },
      { label: "Peach / 2x", price: 134, image: "/assets/omni-product-3x-peach.png" },
    ],
    tone: "electrolytes",
  },
];

export default function ProductWorkspace({ compact = false }) {
  const [recSelections, setRecSelections] = useState(() => Object.fromEntries(recs.map((item) => [item.name, item.options[0].label])));
  const [modal, setModal] = useState(null);
  const [giftClaimed, setGiftClaimed] = useState(false);
  const [giftClaimMode, setGiftClaimMode] = useState(null);
  const [giftClaimLockedUntil, setGiftClaimLockedUntil] = useState(0);
  const [giftFlowStep, setGiftFlowStep] = useState("choice");
  const [giftFlowBusy, setGiftFlowBusy] = useState(false);
  const [giftFlowBusyMode, setGiftFlowBusyMode] = useState(null);
  const [giftFriend, setGiftFriend] = useState({ name: "", address1: "", address2: "", city: "", state: "", zip: "", contact: "" });
  const [selectedFlavor, setSelectedFlavor] = useState("peach");
  const [flavorSaved, setFlavorSaved] = useState(false);
  const [swapConfirmOpen, setSwapConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [friendOverlay, setFriendOverlay] = useState(null);

  const subtotal = 115;
  const shipping = 8;
  const total = subtotal + shipping;

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 5000);
  };

  const handleClaimGift = () => {
    if (giftClaimed) return;
    setGiftFlowStep("choice");
    setGiftFlowBusy(false);
    setGiftFlowBusyMode(null);
    setModal("Claim Free Gift");
  };

  const openSwapConfirm = () => setSwapConfirmOpen(true);

  const confirmSwapFlavor = () => {
    setFlavorSaved(true);
    setSwapConfirmOpen(false);
  };

  const [backupCards, setBackupCards] = useState([]);
  const [newCard, setNewCard] = useState({ number: "", expiry: "", name: "" });

  const persistGiftClaim = (mode) => {
    const until = Date.now() + 60000;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(GIFT_LOCK_KEY, String(until));
      window.localStorage.setItem(`${GIFT_LOCK_KEY}:mode`, mode);
    }
    setGiftClaimed(true);
    setGiftClaimMode(mode);
    setGiftClaimLockedUntil(until);
  };

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const storedUntil = Number(window.localStorage.getItem(GIFT_LOCK_KEY) || 0);
    const storedMode = window.localStorage.getItem(`${GIFT_LOCK_KEY}:mode`);
    if (storedUntil > Date.now()) {
      setGiftClaimed(true);
      setGiftClaimMode(storedMode === "friend" ? "friend" : "self");
      setGiftClaimLockedUntil(storedUntil);
    } else {
      window.localStorage.removeItem(GIFT_LOCK_KEY);
      window.localStorage.removeItem(`${GIFT_LOCK_KEY}:mode`);
      setGiftClaimed(false);
      setGiftClaimMode(null);
      setGiftClaimLockedUntil(0);
      setGiftFlowBusyMode(null);
    }
    return undefined;
  }, []);

  React.useEffect(() => {
    if (!giftClaimLockedUntil || giftClaimLockedUntil <= Date.now()) return undefined;
    const timeout = window.setTimeout(() => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(GIFT_LOCK_KEY);
        window.localStorage.removeItem(`${GIFT_LOCK_KEY}:mode`);
      }
      setGiftClaimed(false);
      setGiftClaimMode(null);
      setGiftClaimLockedUntil(0);
    }, giftClaimLockedUntil - Date.now());
    return () => window.clearTimeout(timeout);
  }, [giftClaimLockedUntil]);

  React.useEffect(() => {
    if (!modal) {
      setGiftFlowStep("choice");
      setGiftFlowBusy(false);
      setGiftFlowBusyMode(null);
    }
  }, [modal]);

  const handleGiftSelfConfirm = () => {
    if (giftFlowBusy || giftClaimed) return;
    setGiftFlowBusy(true);
    setGiftFlowBusyMode("self");
    window.setTimeout(() => {
      persistGiftClaim("self");
      setGiftFlowBusy(false);
      setGiftFlowBusyMode(null);
      setModal(null);
      showToast("Your free gift is locked in — it'll ship with your next OMNI order.");
    }, 700);
  };

  const handleGiftFriendSubmit = (event) => {
    event.preventDefault();
    if (giftFlowBusy || giftClaimed) return;
    setGiftFlowBusy(true);
    setGiftFlowBusyMode("friend");
    window.setTimeout(() => {
      const friendName = giftFriend.name || "your friend";
      persistGiftClaim("friend");
      setGiftFlowBusy(false);
      setGiftFlowBusyMode(null);
      setModal(null);
      setFriendOverlay(friendName);
      window.setTimeout(() => setFriendOverlay(null), 5000);
    }, 900);
  };

  return (
    <section className={`workspace-grid ${compact ? "workspace-grid-compact" : ""}`} aria-label="Subscription product workspace">
      {toast && (
        <div className="workspace-toast" role="status" aria-live="polite">
          <svg width="16" height="16" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M4.5 11.5L9 16L17.5 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {toast}
        </div>
      )}

      {friendOverlay && (
        <div className="friend-gift-overlay" role="dialog" aria-modal="true">
          <div className="friend-gift-card">
            <span className="friend-gift-icon">🎁❤️</span>
            <h3>That's a kind move.</h3>
            <p>
              Gift confirmed, and we'll take care of getting it to {friendOverlay}.
            </p>
            <button type="button" className="friend-gift-dismiss" onClick={() => setFriendOverlay(null)}>
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="workspace-left">
        {!giftClaimed && (
          <>
            <h2 className="workspace-title">Claim Free Gift</h2>
            <div
              className="claim-free-gift-card"
              role="button"
              tabIndex={0}
              onClick={handleClaimGift}
              onKeyDown={(e) => e.key === "Enter" && handleClaimGift()}
              aria-label="Claim your free gift"
            >
              <img src="/assets/omni-claim-free-gift.png" alt="Claim your free gift with your next OMNI order" />
              <div className="claim-free-gift-overlay">
                <span className="claim-gift-cta-label">Claim Free Gift →</span>
              </div>
            </div>
          </>
        )}

        <h2 className="workspace-title">Swap Flavor</h2>
        <div className="workspace-card swap-flavor-card">
          <p className="swap-flavor-desc">Change your current gummy flavor. Takes effect on your next order.</p>
          <div className="swap-flavor-options">
            <button
              type="button"
              className={`swap-flavor-btn${selectedFlavor === "peach" ? " selected" : ""}`}
              onClick={() => { setSelectedFlavor("peach"); setFlavorSaved(false); }}
            >
              <img src="/assets/omni-product-peach.png" alt="Peach gummies" />
              <span>Peach</span>
            </button>
            <button
              type="button"
              className={`swap-flavor-btn${selectedFlavor === "watermelon" ? " selected" : ""}`}
              onClick={() => { setSelectedFlavor("watermelon"); setFlavorSaved(false); }}
            >
              <img src="/assets/omni-product-watermelon.png" alt="Watermelon gummies" />
              <span>Watermelon</span>
            </button>
          </div>
          <div className="swap-flavor-action">
            {flavorSaved ? (
              <span className="claim-gift-confirmed">Flavor updated — applies to your next order</span>
            ) : (
              <button type="button" className="claim-gift-btn" onClick={openSwapConfirm}>
                Confirm swap to {selectedFlavor === "peach" ? "Peach" : "Watermelon"}
              </button>
            )}
          </div>
        </div>

        <h2 className="workspace-title">Shipping information</h2>
        <div className="workspace-card info-workspace-card">
          <div>
            <h3>Saba Bakhtadze</h3>
            <p>595 North Main street<br />Hiawassee, Georgia 30546<br />United States</p>
          </div>
          <button type="button" className="card-edit-btn" onClick={() => setModal("Edit shipping")}>Edit</button>
        </div>

        <h2 className="workspace-title">Billing</h2>
        <div className="workspace-card billing-workspace-card">
          <div className="billing-row">
            <div>
              <h3>Saba B</h3>
              <p><span className="mastercard-dot red" /><span className="mastercard-dot orange" />•••• 6047</p>
            </div>
            <div className="billing-meta"><button type="button" className="card-edit-btn" onClick={() => setModal("Edit billing")}>Edit</button><span>11/26</span></div>
          </div>
          {backupCards.map((card, i) => (
            <div className="billing-row backup-card-row" key={i}>
              <div>
                <p className="backup-card-label">Backup card</p>
                <p><span className="mastercard-dot red" /><span className="mastercard-dot orange" />•••• {card.last4}</p>
              </div>
              <div className="billing-meta"><span>{card.expiry}</span></div>
            </div>
          ))}
          <button type="button" className="add-product-wide" onClick={() => setModal("Add backup card")}>+ Add backup card</button>
        </div>

        <h2 className="workspace-title">Summary</h2>
        <div className="workspace-card summary-workspace-card">
          <div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
          <div><span>Shipping</span><strong>${shipping.toFixed(2)}</strong></div>
          <label className="promo-row"><input placeholder="Enter promo code" /><button type="button">Apply</button></label>
          <div className="summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
        </div>
      </div>

      <aside className="workspace-right" aria-label="Recommended products">
        <h2 className="workspace-title">You might also like</h2>
        <div className="workspace-card rec-card-list">
          {recs.map((item) => {
            const selected = item.options.find((option) => option.label === recSelections[item.name]) || item.options[0];
            return (
              <div className="rec-product" key={item.name}>
                <div className={`rec-image ${item.tone}`}>
                  {selected.image ? <img src={selected.image} alt={`${item.name} ${selected.label}`} /> : <span>{selected.tile}</span>}
                </div>
                <div className="rec-copy">
                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>
                  <select
                    value={recSelections[item.name]}
                    onChange={(event) => setRecSelections((plans) => ({ ...plans, [item.name]: event.target.value }))}
                  >
                    {item.options.map((option) => (
                      <option key={option.label}>{option.label}</option>
                    ))}
                  </select>
                  <div className="rec-bottom"><strong>${selected.price.toFixed(2)}</strong><button type="button" className="rec-add-btn" onClick={() => setModal("Add to next order")}>Add</button></div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {modal && (
        <ActionModal
          title={modal === "Claim Free Gift" ? "Claim Free Gift" : modal}
          onClose={() => setModal(null)}
          onAction={
            modal === "Add backup card"
              ? () => {
                  const last4 = newCard.number.replace(/\s/g, "").slice(-4) || "0000";
                  setBackupCards((cards) => [...cards, { last4, expiry: newCard.expiry || "—" }]);
                  setNewCard({ number: "", expiry: "", name: "" });
                  setModal(null);
                }
              : undefined
          }
          actionLabel={modal === "Add backup card" ? "Add card" : undefined}
          actionVariant="primary"
          hideFooter={modal === "Claim Free Gift"}
          className={modal === "Claim Free Gift" ? "gift-flow-modal" : ""}
          size={modal === "Claim Free Gift" || modal === "Add backup card" ? "wide" : "default"}
        >
          {modal === "Claim Free Gift" && giftFlowStep === "choice" && (
            <div className="gift-flow-modal-body">
              <p className="gift-flow-kicker">Nice choice. Want this added to your next order, or sent to someone else?</p>
              <div className="gift-flow-choice-grid">
                <button type="button" className="gift-flow-choice-card" onClick={handleGiftSelfConfirm} disabled={giftFlowBusy}>
                  <span className="gift-flow-choice-title">
                    {giftFlowBusy && giftFlowBusyMode === "self" ? "Adding..." : "Ship with my next order"}
                  </span>
                  <span className="gift-flow-choice-copy">
                    Keeps your free gift attached to your next scheduled OMNI shipment.
                  </span>
                </button>
                <button type="button" className="gift-flow-choice-card" onClick={() => setGiftFlowStep("friend-form")}>
                  <span className="gift-flow-choice-title">Send to a friend</span>
                  <span className="gift-flow-choice-copy">
                    Add a shipping address and we'll send the free gift their way.
                  </span>
                </button>
              </div>
            </div>
          )}
          {modal === "Claim Free Gift" && giftFlowStep === "friend-form" && (
            <form className="gift-friend-form" onSubmit={handleGiftFriendSubmit}>
              <p className="gift-flow-kicker">Nice choice. Add your friend's address and we'll send the gift their way.</p>
              <div className="gift-flow-form-grid">
                <label>
                  <span>Name</span>
                  <input value={giftFriend.name} onChange={(e) => setGiftFriend((p) => ({ ...p, name: e.target.value }))} placeholder="Friend's name" required />
                </label>
                <label>
                  <span>Address line 1</span>
                  <input value={giftFriend.address1} onChange={(e) => setGiftFriend((p) => ({ ...p, address1: e.target.value }))} placeholder="Street address" required />
                </label>
                <label>
                  <span>Address line 2 optional</span>
                  <input value={giftFriend.address2} onChange={(e) => setGiftFriend((p) => ({ ...p, address2: e.target.value }))} placeholder="Apartment, suite, etc." />
                </label>
                <div className="gift-flow-form-row">
                  <label>
                    <span>City</span>
                    <input value={giftFriend.city} onChange={(e) => setGiftFriend((p) => ({ ...p, city: e.target.value }))} placeholder="City" required />
                  </label>
                  <label>
                    <span>State</span>
                    <input value={giftFriend.state} onChange={(e) => setGiftFriend((p) => ({ ...p, state: e.target.value }))} placeholder="State" required />
                  </label>
                  <label>
                    <span>Zip code</span>
                    <input value={giftFriend.zip} onChange={(e) => setGiftFriend((p) => ({ ...p, zip: e.target.value }))} placeholder="ZIP" required />
                  </label>
                </div>
                <label>
                  <span>Phone or email</span>
                  <input value={giftFriend.contact} onChange={(e) => setGiftFriend((p) => ({ ...p, contact: e.target.value }))} placeholder="For delivery updates" />
                </label>
              </div>
              <div className="gift-flow-actions">
                <button type="submit" className="btn btn-primary btn-block" disabled={giftFlowBusy} aria-busy={giftFlowBusy}>
                  {giftFlowBusy && giftFlowBusyMode === "friend" ? "Sending..." : "Send gift"}
                </button>
                <button type="button" className="gift-flow-back" onClick={() => setGiftFlowStep("choice")} disabled={giftFlowBusy}>
                  Back
                </button>
              </div>
            </form>
          )}
          {modal === "Add to next order" && (
            <p>Add the selected recommended OMNI product to the upcoming shipment. Pricing and flavor are confirmed before final checkout.</p>
          )}
          {modal === "Edit shipping" && (
            <div className="edit-form">
              <label>Full name<input defaultValue="Saba Bakhtadze" /></label>
              <label>Address<input defaultValue="595 North Main street" /></label>
              <label>City<input defaultValue="Hiawassee" /></label>
              <label>State / ZIP<input defaultValue="Georgia 30546" /></label>
              <label>Country<input defaultValue="United States" /></label>
              <button type="button" className="edit-form-save" onClick={() => setModal(null)}>Save address</button>
            </div>
          )}
          {modal === "Edit billing" && (
            <div className="edit-form">
              <p className="modal-note" style={{marginBottom: 12}}>Updating payment details would connect to the payment provider in the live flow.</p>
              <label>Cardholder name<input defaultValue="Saba B" /></label>
              <label>Card number<input placeholder="•••• •••• •••• ••••" disabled /></label>
              <div className="edit-form-row">
                <label>Expiry<input defaultValue="11/26" /></label>
                <label>CVV<input placeholder="•••" disabled /></label>
              </div>
              <button type="button" className="edit-form-save" onClick={() => setModal(null)}>Save changes</button>
            </div>
          )}
          {modal === "Add backup card" && (
            <div className="edit-form">
              <p className="modal-note" style={{marginBottom: 12}}>Add a backup payment method. It will be charged if your primary card fails.</p>
              <label>Cardholder name<input value={newCard.name} onChange={e => setNewCard(c => ({...c, name: e.target.value}))} placeholder="Name on card" /></label>
              <label>Card number<input value={newCard.number} onChange={e => setNewCard(c => ({...c, number: e.target.value}))} placeholder="1234 5678 9012 3456" maxLength={19} /></label>
              <div className="edit-form-row">
                <label>Expiry<input value={newCard.expiry} onChange={e => setNewCard(c => ({...c, expiry: e.target.value}))} placeholder="MM/YY" maxLength={5} /></label>
                <label>CVV<input placeholder="•••" maxLength={4} /></label>
              </div>
            </div>
          )}
        </ActionModal>
      )}
      {swapConfirmOpen && (
        <ActionModal
          title="Confirm swap flavor"
          onClose={() => setSwapConfirmOpen(false)}
          onAction={confirmSwapFlavor}
          actionLabel={`Confirm ${selectedFlavor === "peach" ? "Peach" : "Watermelon"} swap`}
          actionVariant="primary"
          size="wide"
        >
          <div className="swap-confirm-modal">
            <p className="modal-note">Review the flavor change before it applies to your next order.</p>
            <div className="swap-confirm-card">
              <img
                src={selectedFlavor === "peach" ? "/assets/omni-product-peach.png" : "/assets/omni-product-watermelon.png"}
                alt={`${selectedFlavor === "peach" ? "Peach" : "Watermelon"} gummies preview`}
              />
              <div>
                <span className="modal-eyebrow">Selected flavor</span>
                <strong>{selectedFlavor === "peach" ? "Peach" : "Watermelon"}</strong>
                <p>This change keeps your same product and frequency. Only the flavor switches, and it applies to the next shipment.</p>
              </div>
            </div>
          </div>
        </ActionModal>
      )}
    </section>
  );
}
