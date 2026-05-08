import React from "react";

const footerLogoOptions = {
  dark: "/assets/omni-logo-dark.svg",
  white: "/assets/omni-logo-white.svg",
};
const footerLogoSrc = footerLogoOptions.white;

export default function Footer({ hideNewsletter = false }) {
  return (
    <footer className="omni-footer">
      <div className="footer-grid">
        {!hideNewsletter && (
          <div className="footer-newsletter">
            <h4>Sign up for up to 47% Off</h4>
            <input type="email" placeholder="Email address" />
            <p>*By subscribing, you'll receive our wellness insights and can unsubscribe anytime.</p>
          </div>
        )}
        <div className="footer-col">
          <h4>SHOP</h4>
          <a href="#">SHOP NOW</a>
        </div>
        <div className="footer-col">
          <h4>CONNECT</h4>
          <a href="#">CONTACT US</a>
          <a href="#">ACCOUNT LOGIN</a>
        </div>
      </div>

      <div className="footer-mega" aria-label="OMNI">
        <img src={footerLogoSrc} alt="OMNI" />
        <span className="footer-logo-fallback">omni</span>
      </div>

      <div className="footer-bottom">
        <div>© 2026 OMNI Creatine. All rights reserved.</div>
        <div className="footer-socials">
          <a href="#" aria-label="TikTok">TikTok</a>
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="Facebook">Facebook</a>
        </div>
        <div className="right-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Refunds</a>
        </div>
      </div>

      <div className="footer-disclaimer">
        *These statements have not been evaluated by the Food and Drug Administration.
        This product is not intended to diagnose, treat, cure or prevent any disease.
      </div>
    </footer>
  );
}
