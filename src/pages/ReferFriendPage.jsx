import React from "react";
import Button from "../components/Button.jsx";
import { subscriptionStatus } from "../data/subscription.js";

export default function ReferFriendPage({ onOpenModal, onRestartOpen }) {
  const isInactive = subscriptionStatus === "inactive";

  return (
    <section className="referral-program-page" aria-label="Refer a friend">
      <div className="referral-program-head">
        <h1>Check your referral eligibility</h1>
        <p>
          Submit your details to check whether the referral can qualify for rewards.
          Share your personal link with friends and let OMNI review the submission.
        </p>
      </div>

      {isInactive && (
        <div className="referral-inactive-notice">
          <p>Referral rewards may require an active OMNI account in good standing.</p>
          <Button variant="outline" size="sm" onClick={onRestartOpen}>Restart subscription</Button>
        </div>
      )}

      <form className="referral-program-form" onSubmit={(event) => { event.preventDefault(); onOpenModal("Referral eligibility"); }}>
        <label>
          <span>First Name:<sup>*</sup></span>
          <input type="text" aria-label="First name" />
        </label>
        <label>
          <span>Last Name:<sup>*</sup></span>
          <input type="text" aria-label="Last name" />
        </label>
        <label>
          <span>Email:<sup>*</sup></span>
          <input type="email" aria-label="Email" />
        </label>
        <label>
          <span>Phone:</span>
          <div className="referral-phone-field">
            <span aria-hidden="true">🇺🇸</span>
            <input type="tel" aria-label="Phone" />
          </div>
        </label>

        <button type="submit">Check eligibility</button>
        <button className="referral-login-link" type="button" onClick={() => onOpenModal("Referral status")}>
          Already submitted a referral? Review status.
        </button>
      </form>

      <p className="referral-policy-note">
        Referral rewards are designed for personal, unpaid referrals only. Paid advertising,
        arbitrage, or misuse of referral links may make rewards ineligible.
      </p>
    </section>
  );
}
