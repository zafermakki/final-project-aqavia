
import { useEffect, useMemo, useState } from "react";

import {
  PlusCircle,
  Store,
  LockKeyhole,
  Clock3,
  Percent,
  Search,
  UtensilsCrossed,
  Trash2,
  Pencil,
  X,
  Phone,
  MapPin,
} from "lucide-react";

import "./Restaurants.css";
import { useNavigate } from "react-router-dom";

/* =========================================
   RESTAURANT CATEGORIES
========================================= */

const categories = [
  "All",
  "Bakeries",
  "Fast food",
  "Cafes & sweets",
  "Traditional",
];

/* =========================================
   INITIAL DEMO RESTAURANTS
========================================= */

const initialRestaurants = [
  {
    id: 1,
    name: "Alsafe",
    type: "Italian",
    category: "Fast food",
    phone: "0933 555 901",
    city: "Homs",
    status: "Open",
    from: "10:00AM",
    to: "05:00PM",
    commission: 16,
    commissionType: "Hybrid + fixed model",
  },
  {
    id: 2,
    name: "Alsafe",
    type: "Italian",
    category: "Fast food",
    phone: "0933 555 901",
    city: "Homs",
    status: "Closed",
    from: "10:00AM",
    to: "05:00PM",
    commission: 16,
    commissionType: "Hybrid + fixed model",
  },
  {
    id: 3,
    name: "Alsham",
    type: "Traditional",
    category: "Traditional",
    phone: "0993 325 560",
    city: "Damascus",
    status: "Open",
    from: "09:00AM",
    to: "11:00PM",
    commission: 15,
    commissionType: "Percentage model",
  },
  {
    id: 4,
    name: "Golden Bakery",
    type: "Bakery",
    category: "Bakeries",
    phone: "0944 221 130",
    city: "Homs",
    status: "Open",
    from: "07:00AM",
    to: "10:00PM",
    commission: 14,
    commissionType: "Fixed model",
  },
  {
    id: 5,
    name: "Coffee Time",
    type: "Cafe",
    category: "Cafes & sweets",
    phone: "0991 456 789",
    city: "Homs",
    status: "Open",
    from: "08:00AM",
    to: "12:00AM",
    commission: 18,
    commissionType: "Percentage model",
  },
  {
    id: 6,
    name: "Sweet House",
    type: "Desserts",
    category: "Cafes & sweets",
    phone: "0935 444 222",
    city: "Damascus",
    status: "Closed",
    from: "10:00AM",
    to: "10:00PM",
    commission: 17,
    commissionType: "Hybrid model",
  },
];

/* =========================================
   EMPTY FORM
========================================= */

const emptyForm = {
  name: "",
  type: "",
  category: "Fast food",
  phone: "",
  city: "",
  status: "Open",
  from: "10:00AM",
  to: "05:00PM",
  commission: "16",
  commissionType: "Hybrid + fixed model",
};

/* =========================================
   STATUS COMPONENT
========================================= */

function RestaurantStatus({ status }) {
  return (
    <span
      className={`restaurant-status ${
        status === "Open" ? "restaurant-open" : "restaurant-closed"
      }`}
    >
      {status}
    </span>
  );
}

/* =========================================
   MAIN COMPONENT
========================================= */

function Restaurants() {
  const [restaurants, setRestaurants] = useState(() => {
    try {
      const saved = localStorage.getItem("aqavia_restaurants");

      if (saved !== null) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.error("Could not load restaurants:", error);
    }

    return initialRestaurants;
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  /* =========================================
     SAVE TO LOCAL STORAGE
  ========================================= */

  useEffect(() => {
    localStorage.setItem(
      "aqavia_restaurants",
      JSON.stringify(restaurants)
    );
  }, [restaurants]);

  /* =========================================
     CALCULATE STATISTICS
  ========================================= */

  const openCount = restaurants.filter(
    (restaurant) => restaurant.status === "Open"
  ).length;

  const closedCount = restaurants.length - openCount;

  const averageCommission =
    restaurants.length > 0
      ? (
          restaurants.reduce(
            (sum, restaurant) =>
              sum + Number(restaurant.commission),
            0
          ) / restaurants.length
        ).toFixed(1)
      : "0";

  const stats = [
    {
      title: "Total restaurant",
      value: restaurants.length.toLocaleString("en-US"),
      description: "Registered restaurants",
      icon: Store,
      color: "gray",
    },
    {
      title: "Currently open",
      value: openCount.toLocaleString("en-US"),
      description: "Accepting orders",
      icon: LockKeyhole,
      color: "green",
    },
    {
      title: "Temporarily closed",
      value: closedCount.toLocaleString("en-US"),
      description: "Off-hours or on hold",
      icon: Clock3,
      color: "orange",
    },
    {
      title: "Avg commission rate",
      value: `${averageCommission}%`,
      description: "Average restaurant commission",
      icon: Percent,
      color: "blue",
    },
  ];

  /* =========================================
     CATEGORY COUNTS
  ========================================= */

  const categoryCount = (category) => {
    if (category === "All") return restaurants.length;

    return restaurants.filter(
      (restaurant) => restaurant.category === category
    ).length;
  };

  /* =========================================
     FILTER RESTAURANTS
  ========================================= */

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        [
          restaurant.name,
          restaurant.type,
          restaurant.phone,
          restaurant.city,
          restaurant.status,
        ].some((value) =>
          String(value).toLowerCase().includes(searchValue)
        );

      const matchesCategory =
        activeCategory === "All" ||
        restaurant.category === activeCategory;

      const matchesType =
        typeFilter === "All" ||
        restaurant.category === typeFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType
      );
    });
  }, [restaurants, search, activeCategory, typeFilter]);

  /* =========================================
     OPEN CREATE MODAL
  ========================================= */

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  const openEditModal = (restaurant) => {
    setEditingId(restaurant.id);

    setFormData({
      ...restaurant,
      commission: String(restaurant.commission),
    });

    setFormError("");
    setIsModalOpen(true);
  };

  /* =========================================
     HANDLE FORM CHANGE
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     SAVE RESTAURANT
  ========================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (Number(formData.commission) < 0 ||
        Number(formData.commission) > 100) {
      setFormError("Commission must be between 0 and 100.");
      return;
    }

    const restaurantData = {
      ...formData,
      commission: Number(formData.commission),
    };

    if (editingId !== null) {
      setRestaurants((previous) =>
        previous.map((restaurant) =>
          restaurant.id === editingId
            ? { ...restaurant, ...restaurantData }
            : restaurant
        )
      );
    } else {
      setRestaurants((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...restaurantData,
        },
      ]);
    }

    setIsModalOpen(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  /* =========================================
     DELETE RESTAURANT
  ========================================= */

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );

    if (!confirmed) return;

    setRestaurants((previous) =>
      previous.filter((restaurant) => restaurant.id !== id)
    );
  };
  const navigate = useNavigate();

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="restaurants-page">

      {/* PAGE HEADER */}

      <div className="restaurants-header">

        <div className="restaurants-heading-content">

          <div className="restaurants-title">
            <UtensilsCrossed size={22} />

            <h1>Restaurant</h1>
          </div>

          <p>
            Manage partner merchants, store operational hours,
            commission contracts, and account access credentials.
          </p>

        </div>
        <div className="restaurants-header-actions">

        <button
          type="button"
          className="add-restaurant-btn"
          onClick={() => navigate("/dashboard/restaurants/meals/create")}
        >
          <UtensilsCrossed size={16} />
          Add meals
        </button>

        <button
          type="button"
          className="add-restaurant-btn"
          onClick={() => navigate("/dashboard/restaurants/create")}
        >
          <PlusCircle size={16} />
          Add restaurant
        </button>

</div>


      </div>

      {/* STATISTICS */}

      <section className="restaurant-stats">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className={`restaurant-stat stat-${stat.color}`}
            >

              <div>
                <p>{stat.title}</p>

                <h3>{stat.value}</h3>

                <span>{stat.description}</span>
              </div>

              <Icon size={24} />

            </article>
          );
        })}

      </section>

      {/* CATEGORY TABS */}

      <section className="restaurant-categories">

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`restaurant-category-btn ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category)}
          >
            <span>{category}</span>

            <span>{categoryCount(category)}</span>
          </button>
        ))}

      </section>

      {/* SEARCH AND FILTER */}

      <section className="restaurant-filters">

        <div className="restaurant-search">

          <Search size={17} />

          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search restaurants"
          />

        </div>

        <div className="restaurant-type-filter">

          <UtensilsCrossed size={16} />

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter restaurant type"
          >
            <option value="All">Type restaurant</option>

            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}

          </select>

        </div>

      </section>

      {/* RESTAURANTS TABLE */}

      <section className="restaurant-table-section">

        <div className="restaurant-table-heading">
          <h2>Restaurants</h2>

          <span>
            {filteredRestaurants.length} restaurants
          </span>
        </div>

        <div className="restaurant-table-wrapper">

          <table className="restaurant-table">

            <thead>
              <tr>
                <th>Name & Type</th>
                <th>Phone</th>
                <th>City</th>
                <th>Status</th>
                <th>From</th>
                <th>To</th>
                <th>Commission & Type</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant) => (
                  <tr key={restaurant.id}>

                    {/* NAME & TYPE */}

                    <td>
                      <div className="restaurant-name-cell">

                        <div className="restaurant-avatar">
                          <Store size={21} />
                        </div>

                        <div>
                          <strong>{restaurant.name}</strong>
                          <span>{restaurant.type}</span>
                        </div>

                      </div>
                    </td>

                    <td>{restaurant.phone}</td>

                    <td>{restaurant.city}</td>

                    <td>
                      <RestaurantStatus
                        status={restaurant.status}
                      />
                    </td>

                    <td>{restaurant.from}</td>

                    <td>{restaurant.to}</td>

                    <td>
                      <div className="restaurant-commission">
                        <strong>{restaurant.commission}%</strong>
                        <span>{restaurant.commissionType}</span>
                      </div>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="restaurant-actions">

                        <button
                          type="button"
                          className="restaurant-delete-btn"
                          onClick={() => handleDelete(restaurant.id)}
                          aria-label="Delete restaurant"
                          title="Delete restaurant"
                        >
                          <Trash2 size={15} />
                        </button>

                        <button
                          type="button"
                          className="restaurant-edit-btn"
                          onClick={() => openEditModal(restaurant)}
                          aria-label="Edit restaurant"
                          title="Edit restaurant"
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

                    <div className="restaurant-empty-state">
                      <Store size={32} />

                      <h3>No restaurants found</h3>

                      <p>
                        Try changing your search or category filter.
                      </p>

                    </div>

                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* ADD / EDIT RESTAURANT MODAL */}

      {isModalOpen && (
        <div
          className="restaurant-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="restaurant-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="restaurant-modal-header">

              <div>
                <h2>
                  {editingId !== null
                    ? "Edit Restaurant"
                    : "Add Restaurant"}
                </h2>

                <p>
                  Enter restaurant information below.
                </p>
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
              className="restaurant-modal-form"
              onSubmit={handleSubmit}
            >

              <div className="restaurant-form-group">
                <label>Restaurant Name</label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter restaurant name"
                  required
                />
              </div>

              <div className="restaurant-form-group">
                <label>Restaurant Type</label>

                <input
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g. Italian"
                  required
                />
              </div>

              <div className="restaurant-form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="restaurant-form-group">
                <label>Phone Number</label>

                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="restaurant-form-group">
                <label>City</label>

                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="restaurant-form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="restaurant-form-group">
                <label>Opening Time</label>

                <input
                  name="from"
                  type="time"
                  value={formData.from}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="restaurant-form-group">
                <label>Closing Time</label>

                <input
                  name="to"
                  type="time"
                  value={formData.to}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="restaurant-form-group">
                <label>Commission (%)</label>

                <input
                  name="commission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.commission}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="restaurant-form-group">
                <label>Commission Type</label>

                <select
                  name="commissionType"
                  value={formData.commissionType}
                  onChange={handleChange}
                >
                  <option value="Hybrid + fixed model">
                    Hybrid + fixed model
                  </option>

                  <option value="Percentage model">
                    Percentage model
                  </option>

                  <option value="Fixed model">
                    Fixed model
                  </option>

                  <option value="Hybrid model">
                    Hybrid model
                  </option>
                </select>
              </div>

              {formError && (
                <p className="restaurant-form-error">
                  {formError}
                </p>
              )}

              <div className="restaurant-modal-actions">

                <button
                  type="button"
                  className="restaurant-cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="restaurant-save-btn"
                >
                  {editingId !== null
                    ? "Save Changes"
                    : "Add Restaurant"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Restaurants;
