
import { useEffect, useMemo, useState } from "react";

import {
  Users,
  BadgeCheck,
  CircleX,
  Sprout,
  Search,
  PlusCircle,
  Trash2,
  Pencil,
  X,
  UserRound,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Wallet,
  Check,
} from "lucide-react";

import "./Customers.css";

/* =========================================
   INITIAL DEMO CUSTOMERS
========================================= */

const initialCustomers = [
  {
    id: 1,
    name: "Eissa shahla",
    email: "Eissashahla@gmail.com",
    phone: "0933 555 901",
    location: "Zidal/main road",
    status: "Active",
    orders: 24,
    spend: 400000,
    createdAt: "2026-10-20",
  },
  {
    id: 2,
    name: "Mohammad Ali",
    email: "mohammad.ali@gmail.com",
    phone: "0993 325 560",
    location: "Homs / Alhamra",
    status: "Active",
    orders: 18,
    spend: 320000,
    createdAt: "2026-10-22",
  },
  {
    id: 3,
    name: "Sara Ahmad",
    email: "sara.ahmad@gmail.com",
    phone: "0944 221 130",
    location: "Damascus / Mazzeh",
    status: "Inactive",
    orders: 24,
    spend: 400000,
    createdAt: "2026-10-25",
  },
  {
    id: 4,
    name: "Omar Hassan",
    email: "omar.hassan@gmail.com",
    phone: "0991 456 789",
    location: "Homs / Alwaer",
    status: "Active",
    orders: 32,
    spend: 520000,
    createdAt: "2026-11-01",
  },
  {
    id: 5,
    name: "Lina Ahmad",
    email: "lina.ahmad@gmail.com",
    phone: "0935 444 222",
    location: "Aleppo / New City",
    status: "Active",
    orders: 12,
    spend: 185000,
    createdAt: "2026-11-03",
  },
  {
    id: 6,
    name: "Khaled Omar",
    email: "khaled.omar@gmail.com",
    phone: "0932 111 456",
    location: "Damascus / Baramkeh",
    status: "Inactive",
    orders: 8,
    spend: 95000,
    createdAt: "2026-11-05",
  },
];

/* =========================================
   EMPTY CUSTOMER FORM
========================================= */

const emptyCustomer = {
  name: "",
  email: "",
  phone: "",
  location: "",
  status: "Active",
};

/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(value) {
  return `${Number(value).toLocaleString("en-US")} SRY`;
}

/* =========================================
   CUSTOMER STATUS
========================================= */

function CustomerStatus({ status, onClick }) {
  const isActive = status === "Active";

  return (
    <button
      type="button"
      className={`customer-status ${
        isActive ? "customer-status-active" : "customer-status-inactive"
      }`}
      onClick={onClick}
      title="Click to change account status"
      aria-label={`Change customer status from ${status}`}
    >
      {status}
    </button>
  );
}

/* =========================================
   MAIN COMPONENT
========================================= */

function Customers() {

  /* =========================================
     CUSTOMERS STATE
  ========================================= */

  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem("aqavia_customers");

      if (saved !== null) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.error("Could not load customers:", error);
    }

    return initialCustomers;
  });

  /* =========================================
     FILTERS
  ========================================= */

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  /* =========================================
     MODAL
  ========================================= */

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyCustomer);
  const [formError, setFormError] = useState("");

  /* =========================================
     SAVE CUSTOMERS
  ========================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "aqavia_customers",
        JSON.stringify(customers)
      );
    } catch (error) {
      console.error("Could not save customers:", error);
    }
  }, [customers]);

  /* =========================================
     CALCULATE STATISTICS
  ========================================= */

  const activeCount = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const inactiveCount = customers.length - activeCount;

  const initialActiveCount = initialCustomers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const initialInactiveCount =
    initialCustomers.length - initialActiveCount;

  // Demo platform totals, adjusted when sample records change.
  const totalMetric =
    12000 + customers.length - initialCustomers.length;

  const activeMetric =
    11400 + activeCount - initialActiveCount;

  const inactiveMetric =
    360 + inactiveCount - initialInactiveCount;

  const newThisWeek = customers.filter(
    (customer) => customer.createdAt === new Date().toISOString().slice(0, 10)
  ).length;

  const statistics = [
    {
      title: "Total customer",
      value: totalMetric.toLocaleString("en-US"),
      description: "Registered customers",
      icon: Users,
      color: "gray",
      extra: "",
    },
    {
      title: "Active account",
      value: activeMetric.toLocaleString("en-US"),
      description: "Customers can access the platform",
      icon: BadgeCheck,
      color: "green",
      extra: "94 %",
    },
    {
      title: "Inactive account",
      value: inactiveMetric.toLocaleString("en-US"),
      description: "Blocked or inactive customers",
      icon: CircleX,
      color: "dark",
      extra: "6 %",
    },
    {
      title: "New this week",
      value: (360 + newThisWeek).toLocaleString("en-US"),
      description: "+ 12% Vs than last week",
      icon: Sprout,
      color: "teal",
      extra: "",
    },
  ];

  /* =========================================
     FILTER TABS
  ========================================= */

  const filterTabs = [
    {
      label: "All",
      value: "All",
      count: customers.length,
    },
    {
      label: "Online",
      value: "Active",
      count: activeCount,
    },
    {
      label: "Block",
      value: "Inactive",
      count: inactiveCount,
    },
  ];

  /* =========================================
     FILTER CUSTOMERS
  ========================================= */

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        [
          customer.name,
          customer.email,
          customer.phone,
          customer.location,
          customer.status,
          customer.id,
        ].some((value) =>
          String(value).toLowerCase().includes(searchValue)
        );

      const matchesStatus =
        activeFilter === "All" ||
        customer.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, activeFilter]);

  /* =========================================
     OPEN ADD CUSTOMER MODAL
  ========================================= */

  const handleAddCustomer = () => {
    setEditingId(null);
    setFormData(emptyCustomer);
    setFormError("");
    setIsModalOpen(true);
  };

  /* =========================================
     OPEN EDIT CUSTOMER MODAL
  ========================================= */

  const handleEditCustomer = (customer) => {
    setEditingId(customer.id);

    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      location: customer.location,
      status: customer.status,
    });

    setFormError("");
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

    setFormError("");
  };

  /* =========================================
     SAVE CUSTOMER
  ========================================= */

  const handleSaveCustomer = (event) => {
    event.preventDefault();

    const normalizedEmail = formData.email.trim().toLowerCase();

    const emailExists = customers.some(
      (customer) =>
        customer.email.toLowerCase() === normalizedEmail &&
        customer.id !== editingId
    );

    if (emailExists) {
      setFormError("This email is already registered.");
      return;
    }

    const customerData = {
      ...formData,
      name: formData.name.trim(),
      email: normalizedEmail,
      phone: formData.phone.trim(),
      location: formData.location.trim(),
    };

    if (editingId !== null) {
      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id === editingId
            ? { ...customer, ...customerData }
            : customer
        )
      );
    } else {
      setCustomers((previous) => [
        {
          id: Date.now(),
          ...customerData,
          orders: 0,
          spend: 0,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...previous,
      ]);
    }

    closeModal();
  };

  /* =========================================
     DELETE CUSTOMER
  ========================================= */

  const handleDeleteCustomer = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    setCustomers((previous) =>
      previous.filter((customer) => customer.id !== id)
    );
  };

  /* =========================================
     TOGGLE CUSTOMER STATUS
  ========================================= */

  const handleToggleStatus = (id) => {
    setCustomers((previous) =>
      previous.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              status:
                customer.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : customer
      )
    );
  };

  /* =========================================
     CLOSE MODAL
  ========================================= */

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyCustomer);
    setFormError("");
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="customers-page">

      {/* PAGE HEADER */}

      <div className="customers-header">

        <div className="customers-heading-content">

          <div className="customers-title">
            <UserRound size={22} />

            <h1>Customers Management</h1>
          </div>

          <p>
            Manage registered platform customers, view account
            status and verification.
          </p>

        </div>

        <button
          type="button"
          className="add-customer-btn"
          onClick={handleAddCustomer}
        >
          <PlusCircle size={16} />
          Add customer
        </button>

      </div>

      {/* STATISTICS */}

      <section className="customers-stats">

        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className={`customer-stat customer-stat-${stat.color}`}
            >

              <div className="customer-stat-info">

                <p>{stat.title}</p>

                <h3>{stat.value}</h3>

                <span>{stat.extra || stat.description}</span>

              </div>

              <Icon size={27} strokeWidth={1.8} />

            </article>
          );
        })}

      </section>

      {/* SEARCH AND FILTERS */}

      <section className="customers-toolbar">

        <div className="customers-search">

          <Search size={17} />

          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search customers"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}

        </div>

        <div className="customers-filter-tabs">

          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`customer-filter-btn ${
                activeFilter === tab.value ? "active" : ""
              }`}
              onClick={() => setActiveFilter(tab.value)}
            >
              <span>{tab.label}</span>
              <span>{tab.count}</span>
            </button>
          ))}

        </div>

      </section>

      {/* CUSTOMERS TABLE */}

      <section className="customers-table-section">

        <div className="customers-table-heading">

          <h2>Customers</h2>

          <span>{filteredCustomers.length} customers</span>

        </div>

        <div className="customers-table-wrapper">

          <table className="customers-table">

            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Default location</th>
                <th>Status</th>
                <th>Order</th>
                <th>Spend</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>

                    {/* CUSTOMER */}

                    <td>
                      <div className="customer-name-cell">

                        <strong>{customer.name}</strong>

                        <span>{customer.email}</span>

                        <small>{customer.id}</small>

                      </div>
                    </td>

                    {/* PHONE */}

                    <td className="customer-phone">
                      {customer.phone}
                    </td>

                    {/* LOCATION */}

                    <td className="customer-location">
                      {customer.location}
                    </td>

                    {/* STATUS */}

                    <td>
                      <CustomerStatus
                        status={customer.status}
                        onClick={() =>
                          handleToggleStatus(customer.id)
                        }
                      />
                    </td>

                    {/* ORDERS */}

                    <td>{customer.orders}</td>

                    {/* SPENDING */}

                    <td className="customer-spend">
                      {formatMoney(customer.spend)}
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="customer-actions">

                        <button
                          type="button"
                          className="customer-delete-btn"
                          title="Delete customer"
                          aria-label="Delete customer"
                          onClick={() =>
                            handleDeleteCustomer(customer.id)
                          }
                        >
                          <Trash2 size={15} />
                        </button>

                        <button
                          type="button"
                          className="customer-edit-btn"
                          title="Edit customer"
                          aria-label="Edit customer"
                          onClick={() =>
                            handleEditCustomer(customer)
                          }
                        >
                          <Pencil size={15} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">

                    <div className="customers-empty-state">

                      <Users size={34} />

                      <h3>No customers found</h3>

                      <p>
                        Try changing your search or account filter.
                      </p>

                    </div>

                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* ADD / EDIT CUSTOMER MODAL */}

      {isModalOpen && (
        <div
          className="customer-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="customer-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="customer-modal-header">

              <div>
                <h2>
                  {editingId !== null
                    ? "Edit Customer"
                    : "Add New Customer"}
                </h2>

                <p>
                  Enter customer account information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="customer-modal-form"
              onSubmit={handleSaveCustomer}
            >

              <div className="customer-form-group">
                <label>Full Name</label>

                <div className="customer-form-input">
                  <UserRound size={15} />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="customer-form-group">
                <label>Email Address</label>

                <div className="customer-form-input">
                  <Mail size={15} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="customer-form-group">
                <label>Phone Number</label>

                <div className="customer-form-input">
                  <Phone size={15} />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="customer-form-group">
                <label>Default Location</label>

                <div className="customer-form-input">
                  <MapPin size={15} />

                  <input
                    type="text"
                    name="location"
                    placeholder="Enter customer location"
                    value={formData.location}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="customer-form-group full-width">
                <label>Account Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive / Blocked</option>
                </select>
              </div>

              {formError && (
                <p className="customer-form-error">
                  {formError}
                </p>
              )}

              <div className="customer-modal-actions">

                <button
                  type="button"
                  className="customer-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="customer-save-btn"
                >
                  <Check size={16} />

                  {editingId !== null
                    ? "Save Changes"
                    : "Add Customer"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Customers;
