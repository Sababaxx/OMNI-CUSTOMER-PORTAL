import React from "react";

const headerLogoSrc = "/assets/omni-logo-white.svg";

export default function Header() {
  return (
    <header className="omni-header">
      <div className="omni-header-inner">
        <a href="#" className="header-shop">SHOP NOW</a>
        <div className="header-logo" aria-label="OMNI">
          <img src={headerLogoSrc} alt="OMNI" />
          <span className="logo-fallback">omni<span className="tm">®</span></span>
        </div>
        <div className="header-icons">
          <button className="icon-btn" aria-label="Account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button className="icon-btn" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
