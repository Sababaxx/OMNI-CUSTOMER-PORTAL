import React from "react";
import Button from "../components/Button.jsx";
import { useSubscription } from "../context/SubscriptionContext.jsx";

const orders = [
  { number: "#OMNI-1048", date: "April 17, 2026", status: "Fulfilled", product: "OMNI Creatine Gummy / Peach", total: "$52.62" },
  { number: "#OMNI-0992", date: "March 2, 2026", status: "Fulfilled", product: "OMNI Creatine Gummy / Watermelon", total: "$50.00" },
  { number: "#OMNI-0937", date: "January 30, 2026", status: "Fulfilled", product: "OMNI Creatine Gummy / Peach", total: "$50.00" },
];

export default function OrderHistoryPage({ onOpenModal, onRestartOpen }) {
  const { isInactive } = useSubscription();

  return (
    <section className="portal-page-panel" aria-label="Order history">
      <div className="portal-page-head">
        <h1>Order History</h1>
        <p>Review recent OMNI orders and fulfillment details.</p>
      </div>

      {isInactive && (
        <div className="orders-inactive-callout">
          <span>Want to restart your OMNI routine?</span>
          <Button variant="outline" size="sm" onClick={onRestartOpen}>Restart subscription</Button>
        </div>
      )}

      <div className="order-history-list">
        {orders.map((order) => (
          <article className="portal-info-card order-history-card" key={order.number}>
            <div>
              <span className="mini-label">Order</span>
              <strong>{order.number}</strong>
            </div>
            <div>
              <span className="mini-label">Date</span>
              <p>{order.date}</p>
            </div>
            <div>
              <span className="mini-label">Status</span>
              <p>{order.status}</p>
            </div>
            <div>
              <span className="mini-label">Product</span>
              <p>{order.product}</p>
            </div>
            <div>
              <span className="mini-label">Total</span>
              <strong>{order.total}</strong>
            </div>
            <Button variant="outline" onClick={() => onOpenModal("Order details")}>View details</Button>
          </article>
        ))}
      </div>
    </section>
  );
}
