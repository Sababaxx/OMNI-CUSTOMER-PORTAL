import React, { useState } from "react";
import ActionModal from "./ActionModal.jsx";


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
  const [selectedFlavor, setSelectedFlavor] = useState("peach");
  const [flavorSaved, setFlavorSaved] = useState(false);

  const subtotal = 115;
  const shipping = 8;
  const total = subtotal + shipping;

  const handleClaimGift = () => {
    setGiftClaimed(true);
    setModal("Gift claimed");
  };

  const [backupCards, setBackupCards] = useState([]);
  const [newCard, setNewCard] = useState({ number: "", expiry: "", name: "" });

  return (
    <section className={`workspace-grid ${compact ? "workspace-grid-compact" : ""}`} aria-label="Subscription product workspace">
      <div className="workspace-left">
        <h2 className="workspace-title">Claim Free Gift</h2>
        <div
          className={`claim-free-gift-card${giftClaimed ? " gift-claimed" : ""}`}
          role={!giftClaimed ? "button" : undefined}
          tabIndex={!giftClaimed ? 0 : undefined}
          onClick={!giftClaimed ? handleClaimGift : undefined}
          onKeyDown={!giftClaimed ? (e) => e.key === "Enter" && handleClaimGift() : undefined}
          aria-label={!giftClaimed ? "Claim your free gift" : undefined}
        >
          <img src="/assets/omni-claim-free-gift.png" alt="Claim your free gift with your next OMNI order" />
          <div className="claim-free-gift-overlay">
            {giftClaimed ? (
              <span className="claim-gift-confirmed">✓ Gift added to your next order</span>
            ) : (
              <span className="claim-gift-cta-label">Claim Free Gift →</span>
            )}
          </div>
        </div>

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
              <button type="button" className="claim-gift-btn" onClick={() => setFlavorSaved(true)}>
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
                <div className="rec-bottom"><strong>${selected.price.toFixed(2)}</strong><button type="button" onClick={() => setModal("Add to next order")}>Add</button></div>
              </div>
            </div>
          )})}
        </div>
      </aside>
      {modal && (
        <ActionModal title={modal} onClose={() => setModal(null)}>
          {modal === "Gift claimed" && (
            <div className="gift-claimed-modal">
              <div className="gift-claimed-img-wrap">
                <img src="/assets/omni-product-watermelon.png" alt="OMNI Creatine Monohydrate Gummies — your free gift" />
              </div>
              <p>Your free gift has been added to your next OMNI order. It will ship with your scheduled delivery.</p>
            </div>
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
              <button
                type="button"
                className="edit-form-save"
                onClick={() => {
                  const last4 = newCard.number.replace(/\s/g, "").slice(-4) || "0000";
                  setBackupCards(cards => [...cards, { last4, expiry: newCard.expiry || "—" }]);
                  setNewCard({ number: "", expiry: "", name: "" });
                  setModal(null);
                }}
              >
                Add card
              </button>
            </div>
          )}
        </ActionModal>
      )}
    </section>
  );
}
