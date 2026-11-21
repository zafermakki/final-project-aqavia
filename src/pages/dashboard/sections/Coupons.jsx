
import { useEffect, useMemo, useState } from "react";

import {
  TicketPercent,
  BadgeCheck,
  CircleX,
  ReceiptText,
  Search,
  PlusCircle,
  Trash2,
  Pencil,
  Copy,
  X,
  Percent,
  CalendarDays,
  Wallet,
  Check,
} from "lucide-react";

import "./Coupons.css";

/* =========================================
   INITIAL DEMO COUPONS
========================================= */

const couponCodes = [
  "9585", "7421", "1638", "8254",
  "3942", "6173", "2841", "5319",
  "9017", "4632", "7185", "2506",
  "8461", "3294", "6718", "1045",
  "7823", "4951", "6382", "9174",
  "3562", "8149", "2703", "5926",
];

const initialCoupons = couponCodes.map((code, index) => ({
  id: index + 1,
  code: `*${code}`,
  type: index % 4 === 0 ? "Percentage" : "Fixed",
  value: index % 4 === 0 ? 15 : 20000,
  minOrder: 500000,
  maxUses: 4,
  expirationDate: "2026-11-01",
  status: index < 16 ? "Active" : "Inactive",
  redemptions: index < 16 ? 180 + index * 12 : 0,
}));

/* =========================================
   EMPTY FORM
========================================= */

const emptyCoupon = {
  code: "",
  type: "Fixed",
  value: "20000",
  minOrder: "500000",
  maxUses: "4",
  expirationDate: "2027-01-01",
  status: "Active",
};

/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(value) {
  return `${Number(value).toLocaleString("en-US")} SRY`;
}

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(value) {
  if (!value) return "-";

  const [year, month, day] = value.split("-");

  return `${Number(day)}/${Number(month)}/${year}`;
}

/* =========================================
   COUPON STATUS BADGE
========================================= */

function CouponStatus({ status, onChange }) {
  const isActive = status === "Active";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      aria-label={`Turn coupon ${isActive ? "off" : "on"}`}
      className={`coupon-toggle ${
        isActive ? "coupon-toggle-active" : ""
      }`}
      onClick={onChange}
    >
      <span />
    </button>
  );
}

/* =========================================
   MAIN COMPONENT
========================================= */

function Coupons() {
  /* Coupon Data */

  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem("aqavia_coupons");

      if (saved !== null) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.error("Could not load coupons:", error);
    }

    return initialCoupons;
  });

  /* Filters */

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  /* Modal */

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyCoupon);
  const [formError, setFormError] = useState("");

  /* =========================================
     SAVE DATA
  ========================================= */

  useEffect(() => {
    localStorage.setItem(
      "aqavia_coupons",
      JSON.stringify(coupons)
    );
  }, [coupons]);

  /* =========================================
     STATISTICS
  ========================================= */

  const activeCount = coupons.filter(
    (coupon) => coupon.status === "Active"
  ).length;

  const inactiveCount = coupons.length - activeCount;

  const statistics = [
    {
      title: "Total coupons",
      value: coupons.length.toLocaleString("en-US"),
      description: "Configured",
      icon: TicketPercent,
      color: "gray",
    },
    {
      title: "Active coupons",
      value: activeCount.toLocaleString("en-US"),
      description: "Live & claimable",
      icon: BadgeCheck,
      color: "green",
    },
    {
      title: "Inactive coupons",
      value: inactiveCount.toLocaleString("en-US"),
      description: "Archived",
      icon: CircleX,
      color: "orange",
    },
    {
      title: "Total Redemption",
      value: "4,892",
      description: "Total Discount 12.4M",
      icon: ReceiptText,
      color: "blue",
    },
  ];

  /* =========================================
     FILTER COUNTS
  ========================================= */

  const filterTabs = [
    {
      label: "All",
      value: "All",
      count: coupons.length,
    },
    {
      label: "Active",
      value: "Active",
      count: activeCount,
    },
    {
      label: "Inactive",
      value: "Inactive",
      count: inactiveCount,
    },
  ];

  /* =========================================
     FILTER COUPONS
  ========================================= */

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        [
          coupon.code,
          coupon.type,
          coupon.value,
          coupon.minOrder,
          coupon.maxUses,
          coupon.expirationDate,
          coupon.status,
        ].some((value) =>
          String(value).toLowerCase().includes(searchValue)
        );

      const matchesStatus =
        activeFilter === "All" ||
        coupon.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, activeFilter]);

  /* =========================================
     OPEN CREATE MODAL
  ========================================= */

  const handleAddCoupon = () => {
    setEditingId(null);
    setFormData(emptyCoupon);
    setFormError("");
    setIsModalOpen(true);
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  const handleEditCoupon = (coupon) => {
    setEditingId(coupon.id);

    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      minOrder: String(coupon.minOrder),
      maxUses: String(coupon.maxUses),
      expirationDate: coupon.expirationDate,
      status: coupon.status,
    });

    setFormError("");
    setIsModalOpen(true);
  };

  /* =========================================
     HANDLE FORM CHANGE
  ========================================= */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     SAVE COUPON
  ========================================= */

  const handleSaveCoupon = (event) => {
    event.preventDefault();

    const normalizedCode = formData.code.trim().toUpperCase();

    const codeExists = coupons.some(
      (coupon) =>
        coupon.code.toUpperCase() === normalizedCode &&
        coupon.id !== editingId
    );

    if (codeExists) {
      setFormError("This coupon code already exists.");
      return;
    }

    const value = Number(formData.value);
    const minOrder = Number(formData.minOrder);
    const maxUses = Number(formData.maxUses);

    if (
      !Number.isFinite(value) ||
      value <= 0 ||
      !Number.isFinite(minOrder) ||
      minOrder < 0 ||
      !Number.isInteger(maxUses) ||
      maxUses < 1
    ) {
      setFormError("Please enter valid coupon values.");
      return;
    }

    if (
      formData.type === "Percentage" &&
      value > 100
    ) {
      setFormError("Percentage cannot exceed 100%.");
      return;
    }

    const couponData = {
      ...formData,
      code: normalizedCode,
      value,
      minOrder,
      maxUses,
    };

    if (editingId !== null) {
      setCoupons((previous) =>
        previous.map((coupon) =>
          coupon.id === editingId
            ? { ...coupon, ...couponData }
            : coupon
        )
      );
    } else {
      setCoupons((previous) => [
        {
          id: Date.now(),
          ...couponData,
          redemptions: 0,
        },
        ...previous,
      ]);
    }

    setIsModalOpen(false);
    setFormData(emptyCoupon);
    setEditingId(null);
    setFormError("");
  };

  /* =========================================
     DELETE COUPON
  ========================================= */

  const handleDeleteCoupon = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this coupon?"
    );

    if (!confirmed) return;

    setCoupons((previous) =>
      previous.filter((coupon) => coupon.id !== id)
    );
  };

  /* =========================================
     TOGGLE COUPON STATUS
  ========================================= */

  const handleToggleStatus = (id) => {
    setCoupons((previous) =>
      previous.map((coupon) =>
        coupon.id === id
          ? {
              ...coupon,
              status:
                coupon.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : coupon
      )
    );
  };

  /* =========================================
     DUPLICATE COUPON
  ========================================= */

  const handleDuplicateCoupon = (coupon) => {
    const duplicate = {
      ...coupon,
      id: Date.now(),
      code: `${coupon.code}-COPY`,
      status: "Inactive",
      redemptions: 0,
    };

    setCoupons((previous) => [
      duplicate,
      ...previous,
    ]);
  };

  /* =========================================
     CLOSE MODAL
  ========================================= */

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyCoupon);
    setFormError("");
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="coupons-page">

      {/* PAGE HEADER */}

      <div className="coupons-header">

        <div className="coupons-heading-content">

          <div className="coupons-title">
            <TicketPercent size={22} />

            <h1>Coupons</h1>
          </div>

          <p>
            Manage promo codes, redemption thresholds,
            usage limits, and expiration windows.
          </p>

        </div>

        <button
          type="button"
          className="add-coupon-btn"
          onClick={handleAddCoupon}
        >
          <PlusCircle size={16} />
          Add coupon
        </button>

      </div>

      {/* STATISTICS */}

      <section className="coupons-stats">

        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className={`coupon-stat coupon-stat--${stat.color}`}
            >

              <div>
                <p>{stat.title}</p>

                <h3>{stat.value}</h3>

                <span>{stat.description}</span>
              </div>

              <Icon size={23} strokeWidth={1.8} />

            </article>
          );
        })}

      </section>

      {/* FILTERS AND SEARCH */}

      <section className="coupons-toolbar">

        <div className="coupons-search">

          <Search size={17} />

          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search coupons"
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

        <div className="coupons-filter-tabs">

          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`coupon-filter-btn ${
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

      {/* COUPONS TABLE */}

      <section className="coupons-table-section">

        <div className="coupons-table-heading">

          <h2>Coupons</h2>

          <span>
            {filteredCoupons.length} coupons
          </span>

        </div>

        <div className="coupons-table-wrapper">

          <table className="coupons-table">

            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Min order</th>
                <th>Maximum number of uses</th>
                <th>Expiration Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.id}>

                    <td>
                      <strong className="coupon-code">
                        {coupon.code}
                      </strong>
                    </td>

                    <td>{coupon.type}</td>

                    <td>
                      {coupon.type === "Fixed"
                        ? formatMoney(coupon.value)
                        : `${coupon.value}%`}
                    </td>

                    <td>
                      {formatMoney(coupon.minOrder)}
                    </td>

                    <td>{coupon.maxUses}</td>

                    <td>
                      {formatDate(coupon.expirationDate)}
                    </td>

                    <td>
                      <CouponStatus
                        status={coupon.status}
                        onChange={() =>
                          handleToggleStatus(coupon.id)
                        }
                      />
                    </td>

                    <td>
                      <div className="coupon-actions">

                        <button
                          type="button"
                          className="coupon-delete-btn"
                          onClick={() =>
                            handleDeleteCoupon(coupon.id)
                          }
                          title="Delete coupon"
                          aria-label="Delete coupon"
                        >
                          <Trash2 size={14} />
                        </button>

                        <button
                          type="button"
                          className="coupon-duplicate-btn"
                          onClick={() =>
                            handleDuplicateCoupon(coupon)
                          }
                          title="Duplicate coupon"
                          aria-label="Duplicate coupon"
                        >
                          <Copy size={14} />
                        </button>

                        <button
                          type="button"
                          className="coupon-edit-btn"
                          onClick={() =>
                            handleEditCoupon(coupon)
                          }
                          title="Edit coupon"
                          aria-label="Edit coupon"
                        >
                          <Pencil size={14} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="coupons-empty-state">

                      <TicketPercent size={32} />

                      <h3>No coupons found</h3>

                      <p>
                        Try changing your search or status filter.
                      </p>

                    </div>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* ADD / EDIT COUPON MODAL */}

      {isModalOpen && (
        <div
          className="coupon-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="coupon-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="coupon-modal-header">

              <div>
                <h2>
                  {editingId !== null
                    ? "Edit Coupon"
                    : "Create New Coupon"}
                </h2>

                <p>
                  Configure your promotion details and usage limits.
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
              className="coupon-modal-form"
              onSubmit={handleSaveCoupon}
            >

              {/* Coupon Code */}

              <div className="coupon-form-group">
                <label>Coupon Code</label>

                <input
                  name="code"
                  type="text"
                  placeholder="e.g. SAVE20"
                  value={formData.code}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {/* Coupon Type */}

              <div className="coupon-form-group">
                <label>Discount Type</label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                >
                  <option value="Fixed">Fixed Amount</option>
                  <option value="Percentage">Percentage</option>
                </select>
              </div>

              {/* Value */}

              <div className="coupon-form-group">
                <label>
                  Discount Value
                  {formData.type === "Percentage" ? " (%)" : " (SRY)"}
                </label>

                <div className="coupon-input-icon">
                  {formData.type === "Fixed" ? (
                    <Wallet size={15} />
                  ) : (
                    <Percent size={15} />
                  )}

                  <input
                    name="value"
                    type="number"
                    min="0"
                    step="any"
                    value={formData.value}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              {/* Minimum Order */}

              <div className="coupon-form-group">
                <label>Minimum Order (SRY)</label>

                <input
                  name="minOrder"
                  type="number"
                  min="0"
                  value={formData.minOrder}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {/* Maximum Uses */}

              <div className="coupon-form-group">
                <label>Maximum Number of Uses</label>

                <input
                  name="maxUses"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.maxUses}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {/* Expiration Date */}

              <div className="coupon-form-group">
                <label>Expiration Date</label>

                <div className="coupon-input-icon">
                  <CalendarDays size={15} />

                  <input
                    name="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              {/* Status */}

              <div className="coupon-form-group full-width">
                <label>Coupon Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {formError && (
                <p className="coupon-form-error">
                  {formError}
                </p>
              )}

              <div className="coupon-modal-actions">

                <button
                  type="button"
                  className="coupon-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="coupon-save-btn"
                >
                  <Check size={16} />

                  {editingId !== null
                    ? "Save Changes"
                    : "Create Coupon"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Coupons;
