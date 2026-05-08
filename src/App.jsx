import React, { useState } from "react";
import ActionModal from "./components/ActionModal.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import ReferFriendPage from "./pages/ReferFriendPage.jsx";
import SubscriptionListPage from "./pages/SubscriptionListPage.jsx";
import SubscriptionDetailPage from "./pages/SubscriptionDetailPage.jsx";
import "./styles.css";

export default function App() {
  const [view, setView] = useState("home");
  const [modal, setModal] = useState(null);

  const pageProps = {
    activeView: view,
    onNavigate: setView,
    onLogout: () => setModal("Log out"),
  };

  const renderPage = () => {
    if (view === "manage") return <SubscriptionDetailPage {...pageProps} onBack={() => setView("home")} />;
    if (view === "orders") return <OrderHistoryPage onOpenModal={setModal} />;
    if (view === "refer") return <ReferFriendPage onOpenModal={setModal} />;
    if (view === "account") return <AccountPage onOpenModal={setModal} />;
    return <SubscriptionListPage {...pageProps} onOpen={() => setView("manage")} onAddNew={() => setModal("Add new subscription")} />;
  };

  return (
    <>
      <Header />
      {["orders", "refer", "account"].includes(view) ? (
        <div className="portal-shell portal-shell-dashboard">
          <div className="portal-layout">
            <SubscriptionListPage.Nav {...pageProps} />
            <main className="portal-main">{renderPage()}</main>
          </div>
        </div>
      ) : (
        renderPage()
      )}
      <Footer hideNewsletter={true} />
      {modal && (
        <ActionModal title={modal} onClose={() => setModal(null)}>
          {modal === "Log out" && <p>Confirm that this OMNI portal session should be logged out. No account data changes are made here.</p>}
          {modal === "Add new subscription" && <p>Start a new OMNI subscription with gummies, electrolytes, or a combined routine. Product selection can be connected to checkout later.</p>}
          {modal === "Copy referral code" && <p>Your referral code OMNI-SABA-47 is ready to copy and share with a friend.</p>}
          {modal === "Referral eligibility" && <p>We can review this referral submission for eligibility and connect rewards once the final referral workflow is live.</p>}
          {modal === "Referral status" && <p>If you already submitted a referral, this area can show its current eligibility status in the finished flow.</p>}
          {modal && !["Log out", "Add new subscription", "Copy referral code", "Referral eligibility", "Referral status"].includes(modal) && <p>This OMNI action is ready to connect to the final account flow.</p>}
        </ActionModal>
      )}
    </>
  );
}
