import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  Printer,
  XCircle,
  UserRound,
  Phone,
  MapPin,
  UtensilsCrossed,
  CarFront,
  Clock3,
  Wallet,
  Navigation,
  ChevronDown,
  CheckCircle2,
  Truck,
  CreditCard,
  X,
} from "lucide-react";

import "./CreateOrder.css";

/* =========================================
   ORDER DATA
========================================= */

const initialOrder = {
  id: "1205495",
  status: "On delivery",
  placedAt: "Today, 14:32 (Homs Standard)",

  customer: {
    name: "Eissa shahla",
    email: "Eissashahla@gmail.com",
    completedOrders: 18,
    vip: true,
    phone: "0995 135 622",
    address: "Homs / Arman / Main road",
  },

  restaurant: {
    name: "Al safe",
    dispatchContact: "0999 325 560",
    preparation: 13,
    target: 15,
    handedToDriver: "14:51:22",
  },

  driver: {
    name: "Al safe",
    vehicle: "Car",
    phone: "0999 325 560",
  },

  items: [
    {
      id: 1,
      name: "Double Cheeseburger Combo",
      description:
        "Extra cheddar, caramelized onions, brioche bun, curly fries side",
      price: 20000,
      quantity: 1,
    },
    {
      id: 2,
      name: "Double Cheeseburger Combo",
      description:
        "Extra cheddar, caramelized onions, brioche bun, curly fries side",
      price: 20000,
      quantity: 1,
    },
    {
      id: 3,
      name: "Double Cheeseburger Combo",
      description:
        "Extra cheddar, caramelized onions, brioche bun, curly fries side",
      price: 20000,
      quantity: 1,
    },
    {
      id: 4,
      name: "Double Cheeseburger Combo",
      description:
        "Extra cheddar, caramelized onions, brioche bun, curly fries side",
      price: 20000,
      quantity: 1,
    },
  ],

  deliveryFee: 8000,
  serviceCharge: 2000,
  voucherDiscount: 12000,
};

/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(value) {
  return `${Number(value).toLocaleString("en-US")} SRY`;
}

/* =========================================
   INFORMATION CARD
========================================= */

function InformationCard({ icon: Icon, title, children, className = "" }) {
  return (
    <section className={`order-info-card ${className}`}>

      <div className="order-info-heading">
        <Icon size={17} />
        <h3>{title}</h3>
      </div>

      {children}

    </section>
  );
}

/* =========================================
   MAIN COMPONENT
========================================= */

function CreateOrder() {
  const [orderStatus, setOrderStatus] = useState(initialOrder.status);

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [showAllItems, setShowAllItems] = useState(false);

  const [showTracking, setShowTracking] = useState(false);

  const [cancelled, setCancelled] = useState(false);

  const order = initialOrder;

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total =
    subtotal +
    order.deliveryFee +
    order.serviceCharge -
    order.voucherDiscount;

  const visibleItems = showAllItems
    ? order.items
    : order.items.slice(0, 3);

  /* =========================================
     PRINT ORDER
  ========================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =========================================
     CANCEL ORDER
  ========================================= */

  const handleCancelOrder = () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    setCancelled(true);
    setOrderStatus("Cancelled");
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="order-details-page">

      {/* =================================
          ORDER HEADER
      ================================== */}

      <div className="order-details-header">

        <div className="order-details-heading">

          <Link
            to="/dashboard/orders"
            className="order-back-btn"
            aria-label="Back to orders"
          >
            <ArrowLeft size={19} />
          </Link>

          <div className="order-title-content">

            <div className="order-breadcrumb">
              <Link to="/dashboard/orders">Orders</Link>
              <span>/</span>
              <span>{order.id}</span>
            </div>

            <div className="order-number-row">
              <h1>Order {order.id}</h1>

              <span
                className={`order-main-status ${
                  orderStatus === "Cancelled"
                    ? "status-cancelled"
                    : ""
                }`}
              >
                {orderStatus}
              </span>
            </div>

            <p>Placed: {order.placedAt}</p>

          </div>

        </div>

        <div className="order-header-actions">

          <button
            type="button"
            className="order-print-btn"
            onClick={handlePrint}
          >
            <Printer size={17} />
            Print order
          </button>

          <button
            type="button"
            className="order-cancel-btn"
            onClick={handleCancelOrder}
            disabled={cancelled}
          >
            <XCircle size={16} />
            {cancelled ? "Order cancelled" : "Cancel order"}
          </button>

        </div>

      </div>

      {/* =================================
          MAIN ORDER CONTENT
      ================================== */}

      <div className="order-details-layout">

        {/* =================================
            LEFT COLUMN
        ================================== */}

        <main className="order-main-column">

          {/* ORDER ITEMS */}

          <section className="order-items-section">

            <div className="order-items-heading">

              <h2>
                Order item ({order.items.length})
              </h2>

              <button
                type="button"
                onClick={() => setShowAllItems(!showAllItems)}
              >
                {showAllItems ? "Show less" : "See all"}
                <ChevronDown
                  size={13}
                  className={showAllItems ? "rotate-icon" : ""}
                />
              </button>

            </div>

            <div className="order-items-table-wrapper">

              <table className="order-items-table">

                <thead>
                  <tr>
                    <th>Meal & Configuration</th>
                    <th>Unit price</th>
                    <th>QTY</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>

                  {visibleItems.map((item) => (
                    <tr key={item.id}>

                      <td className="order-meal-cell">

                        <strong>{item.name}</strong>

                        <span>{item.description}</span>

                      </td>

                      <td className="order-unit-price">
                        {formatMoney(item.price).replace(" SRY", "")}
                        <small>SRY</small>
                      </td>

                      <td className="order-quantity">
                        {item.quantity}
                      </td>

                      <td>
                        <span className="order-item-total">
                          {formatMoney(item.price * item.quantity)}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </section>

          {/* PAYMENT AND TOTALS */}

          <section className="order-bottom-section">

            {/* PAYMENT METHOD */}

            <div className="order-payment-wrapper">

              <div className="order-payment-select">

                <Wallet size={17} />

                <select
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                  aria-label="Payment method"
                >
                  <option value="Cash">Payment method - Cash</option>
                  <option value="Card">Payment method - Card</option>
                  <option value="Online">Payment method - Online</option>
                </select>

                <ChevronDown size={13} />

              </div>

            </div>

            {/* PRICE SUMMARY */}

            <div className="order-summary-card">

              <div className="order-summary-row">
                <span>Items Subtotal:</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>

              <div className="order-summary-row">
                <span>Delivery Fee (Shaalan Zone 1):</span>
                <strong>{formatMoney(order.deliveryFee)}</strong>
              </div>

              <div className="order-summary-row">
                <span>Platform Service Charge:</span>
                <strong>{formatMoney(order.serviceCharge)}</strong>
              </div>

              <div className="order-summary-row">
                <span>Voucher Promo (RAMADAN10):</span>
                <strong className="order-discount">
                  -{formatMoney(order.voucherDiscount)}
                </strong>
              </div>

              <div className="order-summary-total">
                <span>Total</span>
                <strong>{formatMoney(total)}</strong>
              </div>

            </div>

          </section>

        </main>

        {/* =================================
            RIGHT COLUMN
        ================================== */}

        <aside className="order-sidebar-column">

          {/* CUSTOMER */}

          <InformationCard
            icon={UserRound}
            title="Customer"
            className="order-customer-card"
          >

            <div className="order-customer-name-box">

              <div>
                <strong>{order.customer.name}</strong>

                <span>
                  Repeat customer ({order.customer.completedOrders} completed orders)
                </span>
              </div>

              {order.customer.vip && (
                <span className="customer-vip-badge">VIP</span>
              )}

            </div>

            <div className="order-contact-row">
              <Phone size={16} />
              <span>{order.customer.phone}</span>
            </div>

            <div className="order-contact-row">
              <MapPin size={16} />
              <span>{order.customer.address}</span>
            </div>

          </InformationCard>

          {/* RESTAURANT */}

          <InformationCard
            icon={UtensilsCrossed}
            title="Restaurant"
            className="order-restaurant-card"
          >

            <div className="order-contact-row restaurant-name-row">
              <span>{order.restaurant.name}</span>
            </div>

            <div className="order-restaurant-details">

              <div>
                <span>Dispatch Contact:</span>
                <strong>{order.restaurant.dispatchContact}</strong>
              </div>

              <div>
                <span>Prep Duration:</span>
                <strong>
                  {order.restaurant.preparation} mins
                  (Target: {order.restaurant.target})
                </strong>
              </div>

              <div>
                <span>Handed to driver:</span>
                <strong>{order.restaurant.handedToDriver}</strong>
              </div>

            </div>

          </InformationCard>

          {/* DRIVER */}

          <InformationCard
            icon={Truck}
            title="Driver"
            className="order-driver-card"
          >

            <div className="order-driver-profile">

              <div className="order-driver-avatar">
                <UserRound size={21} />
              </div>

              <div>
                <strong>{order.driver.name}</strong>
                <span>{order.driver.vehicle}</span>
              </div>

            </div>

            <div className="order-contact-row driver-phone-row">
              <Phone size={15} />
              <span>Phone:</span>
              <strong>{order.driver.phone}</strong>
            </div>

            <a
              href={`tel:${order.driver.phone.replace(/\s/g, "")}`}
              className="order-driver-action"
            >
              <Phone size={15} />
              <span>Call courier</span>
            </a>

            <button
              type="button"
              className="order-driver-action"
              onClick={() => setShowTracking(true)}
            >
              <Navigation size={15} />
              <span>Track GPS</span>
            </button>

          </InformationCard>

        </aside>

      </div>

      {/* =================================
          TRACKING MODAL
      ================================== */}

      {showTracking && (
        <div
          className="order-tracking-overlay"
          onClick={() => setShowTracking(false)}
        >

          <div
            className="order-tracking-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="order-tracking-header">
              <div>
                <h2>Driver tracking</h2>
                <p>Order #{order.id}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowTracking(false)}
                aria-label="Close tracking"
              >
                <X size={19} />
              </button>
            </div>

            <div className="order-tracking-content">
              <Navigation size={35} />

              <h3>Live GPS tracking</h3>

              <p>
                Live GPS tracking will be available after connecting
                the driver location API.
              </p>

              <strong>{order.driver.name}</strong>
              <span>{order.driver.phone}</span>
            </div>

            <button
              type="button"
              className="order-tracking-close-btn"
              onClick={() => setShowTracking(false)}
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default CreateOrder;