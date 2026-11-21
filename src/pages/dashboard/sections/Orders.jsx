
import { useMemo, useState } from "react";

import {
  ClipboardList,
  PlusCircle,
  Users,
  UtensilsCrossed,
  Truck,
  Wallet,
  Search,
  CalendarDays,
  Trash2,
  Pencil,
  X,
  ChefHat,
} from "lucide-react";

import "./Orders.css";

/* =========================================
   INITIAL DEMO DATA
========================================= */

const initialOrders = [
  {
    id: 1,
    orderId: "6540145",
    customer: "Eissa shahla",
    restaurant: "Alsafi",
    driver: "Ahmad.s",
    status: "Out of delivery",
    total: 25000,
    payment: "Cash",
    date: "2026-10-27",
  },
  {
    id: 2,
    orderId: "6540144",
    customer: "Eissa shahla",
    restaurant: "Alsafi",
    driver: "Ahmad.s",
    status: "Delivered",
    total: 25000,
    payment: "Cash",
    date: "2026-10-27",
  },
  {
    id: 3,
    orderId: "6540143",
    customer: "Mohammad Ali",
    restaurant: "Alsham",
    driver: "Omar.k",
    status: "Out of delivery",
    total: 35000,
    payment: "Cash",
    date: "2026-10-27",
  },
  {
    id: 4,
    orderId: "6540142",
    customer: "Sara Ahmad",
    restaurant: "Alsafi",
    driver: "Ahmad.s",
    status: "Delivered",
    total: 42000,
    payment: "Cash",
    date: "2026-10-27",
  },
  {
    id: 5,
    orderId: "6540141",
    customer: "Omar Hassan",
    restaurant: "Alsham",
    driver: "Khaled.m",
    status: "Waiting",
    total: 18000,
    payment: "Cash",
    date: "2026-10-27",
  },
  {
    id: 6,
    orderId: "6540140",
    customer: "Lina Ahmad",
    restaurant: "Alsafi",
    driver: "Mohammad.a",
    status: "Rejected",
    total: 22000,
    payment: "Cash",
    date: "2026-10-27",
  },
  {
    id: 7,
    orderId: "6540139",
    customer: "Khaled Omar",
    restaurant: "Alsham",
    driver: "Ahmad.s",
    status: "In preparation",
    total: 30000,
    payment: "Cash",
    date: "2026-10-27",
  },
];

/* =========================================
   FILTER TABS
========================================= */

const statusTabs = [
  { label: "All", value: "All", count: 1200 },
  { label: "Wait", value: "Waiting", count: 6 },
  { label: "Rejected", value: "Rejected", count: 28 },
  {
    label: "In preparation",
    value: "In preparation",
    count: 9,
  },
  {
    label: "Out of delivery",
    value: "Out of delivery",
    count: 18,
  },
];

/* =========================================
   STATUS BADGE
========================================= */

function StatusBadge({ status }) {
  const statusClass = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`order-status status-${statusClass}`}>
      {status}
    </span>
  );
}

/* =========================================
   DATE FORMATTER
========================================= */

function formatDate(date) {
  if (!date) return "-";

  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

/* =========================================
   EMPTY FORM
========================================= */

const emptyForm = {
  customer: "",
  restaurant: "Alsafi",
  driver: "",
  status: "Waiting",
  total: "",
};

/* =========================================
   ORDERS COMPONENT
========================================= */

function Orders() {
  const [orders, setOrders] = useState(initialOrders);

  const [activeTab, setActiveTab] = useState("All");

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  /* =========================================
     FILTER ORDERS
  ========================================= */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        activeTab === "All" || order.status === activeTab;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        [
          order.orderId,
          order.customer,
          order.restaurant,
          order.driver,
          order.status,
        ].some((value) =>
          String(value).toLowerCase().includes(searchText)
        );

      const matchesDate =
        !selectedDate || order.date === selectedDate;

      const matchesRestaurant =
        selectedRestaurant === "All" ||
        order.restaurant === selectedRestaurant;

      return (
        matchesStatus &&
        matchesSearch &&
        matchesDate &&
        matchesRestaurant
      );
    });
  }, [
    orders,
    activeTab,
    search,
    selectedDate,
    selectedRestaurant,
  ]);

  /* =========================================
     CREATE ORDER
  ========================================= */

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  /* =========================================
     EDIT ORDER
  ========================================= */

  const openEditModal = (order) => {
    setEditingId(order.id);

    setFormData({
      customer: order.customer,
      restaurant: order.restaurant,
      driver: order.driver,
      status: order.status,
      total: String(order.total),
    });

    setIsModalOpen(true);
  };

  /* =========================================
     HANDLE FORM INPUTS
  ========================================= */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     SAVE ORDER
  ========================================= */

  const handleSaveOrder = (event) => {
    event.preventDefault();

    const today = new Date().toISOString().slice(0, 10);

    if (editingId !== null) {
      setOrders((previous) =>
        previous.map((order) =>
          order.id === editingId
            ? {
                ...order,
                ...formData,
                total: Number(formData.total),
              }
            : order
        )
      );
    } else {
      const newOrder = {
        id: Date.now(),
        orderId: String(Date.now()).slice(-7),
        ...formData,
        total: Number(formData.total),
        payment: "Cash",
        date: today,
      };

      setOrders((previous) => [newOrder, ...previous]);
    }

    setIsModalOpen(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  /* =========================================
     DELETE ORDER
  ========================================= */

  const handleDeleteOrder = (id) => {
    setOrders((previous) =>
      previous.filter((order) => order.id !== id)
    );
  };

  /* =========================================
     DASHBOARD SUMMARY
  ========================================= */

  const summaryCards = [
    {
      title: "Total customer",
      value: "12000",
      description: "Restated",
      icon: Users,
      color: "gray",
    },
    {
      title: "Pending & Preparing",
      value: "42",
      description: "12 Queued · 30 Actively cooking",
      icon: UtensilsCrossed,
      color: "orange",
    },
    {
      title: "Out of delivery",
      value: "23",
      description: "Active transit",
      icon: Truck,
      color: "purple",
    },
    {
      title: "Gross order value",
      value: "360,000,000 SRY",
      description: "(Today) · -5% Vs yesterday",
      icon: Wallet,
      color: "blue",
    },
  ];

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="orders-page">

      {/* PAGE HEADER */}

      <div className="orders-header">

        <div className="orders-header-content">
          <div className="orders-heading">
            <ClipboardList size={22} />

            <h1>Orders</h1>
          </div>

          <p>
            Live order dispatch, tracking, and fulfillment
            overview across all zones
          </p>
        </div>

        <button
          type="button"
          className="create-order-btn"
          onClick={openCreateModal}
        >
          <PlusCircle size={16} />
          Create order
        </button>

      </div>

      {/* SUMMARY CARDS */}

      <section className="orders-summary">

        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className={`orders-summary-card summary-${card.color}`}
            >
              <div className="summary-card-content">
                <p>{card.title}</p>

                <h3>{card.value}</h3>

                <span>{card.description}</span>
              </div>

              <Icon size={25} strokeWidth={1.8} />
            </article>
          );
        })}

      </section>

      {/* STATUS TABS */}

      <section className="orders-tabs">

        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`order-tab ${
              activeTab === tab.value ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            <span>{tab.label}</span>
            <span>{tab.count}</span>
          </button>
        ))}

      </section>

      {/* SEARCH AND FILTERS */}

      <section className="orders-filters">

        <div className="orders-search">
          <Search size={17} />

          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search orders"
          />
        </div>

        <div className="orders-date-filter">
          <CalendarDays size={16} />

          <input
            type="date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(event.target.value)
            }
            aria-label="Filter by date"
          />
        </div>

        <div className="orders-restaurant-filter">
          <UtensilsCrossed size={16} />

          <select
            value={selectedRestaurant}
            onChange={(event) =>
              setSelectedRestaurant(event.target.value)
            }
            aria-label="Filter by restaurant"
          >
            <option value="All">All restaurants</option>
            <option value="Alsafi">Alsafi</option>
            <option value="Alsham">Alsham</option>
          </select>
        </div>

      </section>

      {/* ORDERS TABLE */}

      <section className="orders-table-section">

        <div className="orders-table-heading">
          <h2>Customers</h2>

          <span>
            {filteredOrders.length} orders
          </span>
        </div>

        <div className="orders-table-container">

          <table className="orders-data-table">

            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>

                    <td className="order-id">
                      {order.orderId}
                    </td>

                    <td>{order.customer}</td>

                    <td>{order.restaurant}</td>

                    <td>{order.driver}</td>

                    <td>
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="order-total">
                      <strong>
                        {order.total.toLocaleString("en-US")} SRY
                      </strong>

                      <span>{order.payment}</span>
                    </td>

                    <td>{formatDate(order.date)}</td>

                    <td>
                      <div className="order-actions">

                        <button
                          type="button"
                          className="delete-order"
                          onClick={() =>
                            handleDeleteOrder(order.id)
                          }
                          aria-label={`Delete order ${order.orderId}`}
                          title="Delete order"
                        >
                          <Trash2 size={15} />
                        </button>

                        <button
                          type="button"
                          className="edit-order"
                          onClick={() => openEditModal(order)}
                          aria-label={`Edit order ${order.orderId}`}
                          title="Edit order"
                        >
                          <Pencil size={15} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="orders-empty-state">
                      <ClipboardList size={30} />

                      <h3>No orders found</h3>

                      <p>
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* CREATE / EDIT MODAL */}

      {isModalOpen && (
        <div
          className="orders-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="orders-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="orders-modal-header">
              <div>
                <h2>
                  {editingId !== null
                    ? "Edit Order"
                    : "Create New Order"}
                </h2>

                <p>Enter the order information below.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="orders-modal-form"
              onSubmit={handleSaveOrder}
            >

              <div className="orders-form-group">
                <label>Customer Name</label>

                <input
                  name="customer"
                  type="text"
                  placeholder="Enter customer name"
                  value={formData.customer}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="orders-form-group">
                <label>Restaurant</label>

                <select
                  name="restaurant"
                  value={formData.restaurant}
                  onChange={handleFormChange}
                >
                  <option value="Alsafi">Alsafi</option>
                  <option value="Alsham">Alsham</option>
                </select>
              </div>

              <div className="orders-form-group">
                <label>Driver</label>

                <input
                  name="driver"
                  type="text"
                  placeholder="Enter driver name"
                  value={formData.driver}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="orders-form-group">
                <label>Total (SRY)</label>

                <input
                  name="total"
                  type="number"
                  min="1"
                  placeholder="Enter total amount"
                  value={formData.total}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="orders-form-group">
                <label>Order Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Waiting">Waiting</option>
                  <option value="In preparation">
                    In preparation
                  </option>
                  <option value="Out of delivery">
                    Out of delivery
                  </option>
                  <option value="Delivered">Delivered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="orders-modal-actions">

                <button
                  type="button"
                  className="cancel-order-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-order-btn"
                >
                  {editingId !== null
                    ? "Save Changes"
                    : "Create Order"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Orders;
