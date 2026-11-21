
import { useEffect, useMemo, useState } from "react";

import {
  Truck,
  Bike,
  Users,
  Clock3,
  PlusCircle,
  FileText,
  Search,
  MapPin,
  Trash2,
  Pencil,
  X,
  Phone,
  CarFront,
  Download,
  CalendarDays,
} from "lucide-react";

import "./Drivers.css";

/* =========================================
   INITIAL DEMO DRIVERS
========================================= */

const initialDrivers = [
  {
    id: 1,
    name: "safe.s",
    phone: "0933 555 901",
    city: "Homs",
    status: "Active",
    vehicleType: "Car",
    vehicleNumber: "261199",
    from: "10:00",
    to: "17:00",
  },
  {
    id: 2,
    name: "safe.s",
    phone: "0933 555 901",
    city: "Homs",
    status: "Inactive",
    vehicleType: "Car",
    vehicleNumber: "261199",
    from: "10:00",
    to: "17:00",
  },
  {
    id: 3,
    name: "Ahmad.s",
    phone: "0993 325 560",
    city: "Damascus",
    status: "Active",
    vehicleType: "Motorcycle",
    vehicleNumber: "332451",
    from: "09:00",
    to: "18:00",
  },
  {
    id: 4,
    name: "Omar.k",
    phone: "0944 221 130",
    city: "Aleppo",
    status: "Inactive",
    vehicleType: "Car",
    vehicleNumber: "445622",
    from: "11:00",
    to: "20:00",
  },
  {
    id: 5,
    name: "Mohammad.a",
    phone: "0991 456 789",
    city: "Homs",
    status: "Active",
    vehicleType: "Motorcycle",
    vehicleNumber: "552341",
    from: "08:00",
    to: "16:00",
  },
  {
    id: 6,
    name: "Khaled.m",
    phone: "0935 444 222",
    city: "Damascus",
    status: "Active",
    vehicleType: "Car",
    vehicleNumber: "664512",
    from: "12:00",
    to: "21:00",
  },
];

/* =========================================
   FORM DEFAULT VALUES
========================================= */

const emptyDriver = {
  name: "",
  phone: "",
  city: "Homs",
  status: "Active",
  vehicleType: "Car",
  vehicleNumber: "",
  from: "10:00",
  to: "17:00",
};

/* =========================================
   FORMAT TIME
========================================= */

function formatTime(time) {
  if (!time) return "-";

  const [hours, minutes] = time.split(":");
  const hour = Number(hours);

  return `${hour % 12 || 12}:${minutes}${hour >= 12 ? "PM" : "AM"}`;
}

/* =========================================
   STATUS BADGE
========================================= */

function DriverStatus({ status }) {
  return (
    <span
      className={`driver-status-badge ${
        status === "Active"
          ? "driver-active"
          : "driver-inactive"
      }`}
    >
      {status}
    </span>
  );
}

/* =========================================
   DRIVER AVATAR
========================================= */

function DriverAvatar({ name, id }) {
  const colors = [
    "avatar-orange",
    "avatar-blue",
    "avatar-purple",
    "avatar-green",
    "avatar-pink",
  ];

  const initials = name
    .split(/[.\s]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`driver-avatar ${colors[id % colors.length]}`}
    >
      {initials || "DR"}
    </div>
  );
}

/* =========================================
   MAIN COMPONENT
========================================= */

function Drivers() {
  /* Drivers State */

  const [drivers, setDrivers] = useState(() => {
    try {
      const saved = localStorage.getItem("aqavia_drivers");

      if (saved !== null) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.error("Could not load drivers:", error);
    }

    return initialDrivers;
  });

  /* Filters */

  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedVehicle, setSelectedVehicle] = useState("All");

  /* Modals */

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyDriver);
  const [formError, setFormError] = useState("");

  /* =========================================
     SAVE DATA
  ========================================= */

  useEffect(() => {
    localStorage.setItem(
      "aqavia_drivers",
      JSON.stringify(drivers)
    );
  }, [drivers]);

  /* =========================================
     STATISTICS
  ========================================= */

  const activeCount = drivers.filter(
    (driver) => driver.status === "Active"
  ).length;

  const inactiveCount = drivers.length - activeCount;

  const previousActive = initialDrivers.filter(
    (driver) => driver.status === "Active"
  ).length;

  const previousInactive = initialDrivers.length - previousActive;

  const totalDrivers = 184 + (drivers.length - initialDrivers.length);

  const workingNow = 100 + (activeCount - previousActive);

  const inactiveNow = 20 + (inactiveCount - previousInactive);

  const statistics = [
    {
      title: "Total driver",
      value: totalDrivers.toLocaleString("en-US"),
      description: "Registered",
      icon: Truck,
      color: "gray",
    },
    {
      title: "Driver working now",
      value: Math.max(0, workingNow).toLocaleString("en-US"),
      description: "On duty",
      icon: Bike,
      color: "blue",
    },
    {
      title: "Inactive on shift",
      value: Math.max(0, inactiveNow).toLocaleString("en-US"),
      description: "Idle couriers",
      icon: Users,
      color: "gray",
    },
    {
      title: "Avg response time",
      value: "04:25",
      description: "Min",
      icon: Clock3,
      color: "gray",
    },
  ];

  /* =========================================
     FILTER OPTIONS
  ========================================= */

  const cities = [
    ...new Set(drivers.map((driver) => driver.city)),
  ];

  const vehicleTypes = [
    ...new Set(drivers.map((driver) => driver.vehicleType)),
  ];

  /* =========================================
     FILTER DRIVERS
  ========================================= */

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        [
          driver.name,
          driver.phone,
          driver.city,
          driver.vehicleType,
          driver.vehicleNumber,
          driver.status,
        ].some((value) =>
          String(value).toLowerCase().includes(searchValue)
        );

      const matchesCity =
        selectedCity === "All" ||
        driver.city === selectedCity;

      const matchesVehicle =
        selectedVehicle === "All" ||
        driver.vehicleType === selectedVehicle;

      return (
        matchesSearch &&
        matchesCity &&
        matchesVehicle
      );
    });
  }, [drivers, search, selectedCity, selectedVehicle]);

  /* =========================================
     OPEN CREATE MODAL
  ========================================= */

  const handleAddDriver = () => {
    setEditingId(null);
    setFormData(emptyDriver);
    setFormError("");
    setIsModalOpen(true);
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  const handleEditDriver = (driver) => {
    setEditingId(driver.id);
    setFormData({ ...driver });
    setFormError("");
    setIsModalOpen(true);
  };

  /* =========================================
     FORM CHANGE
  ========================================= */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     SAVE DRIVER
  ========================================= */

  const handleSaveDriver = (event) => {
    event.preventDefault();

    if (formData.from >= formData.to) {
      setFormError("Ending time must be later than starting time.");
      return;
    }

    if (
      drivers.some(
        (driver) =>
          driver.vehicleNumber === formData.vehicleNumber &&
          driver.id !== editingId
      )
    ) {
      setFormError("This vehicle number is already registered.");
      return;
    }

    if (editingId !== null) {
      setDrivers((previous) =>
        previous.map((driver) =>
          driver.id === editingId
            ? { ...driver, ...formData }
            : driver
        )
      );
    } else {
      setDrivers((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }

    setIsModalOpen(false);
    setFormData(emptyDriver);
    setEditingId(null);
  };

  /* =========================================
     DELETE DRIVER
  ========================================= */

  const handleDeleteDriver = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this driver?"
    );

    if (!confirmed) return;

    setDrivers((previous) =>
      previous.filter((driver) => driver.id !== id)
    );
  };

  /* =========================================
     TOGGLE DRIVER STATUS
  ========================================= */

  const handleToggleStatus = (id) => {
    setDrivers((previous) =>
      previous.map((driver) =>
        driver.id === id
          ? {
              ...driver,
              status:
                driver.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : driver
      )
    );
  };

  /* =========================================
     DOWNLOAD REPORT
  ========================================= */

  const handleDownloadReport = () => {
    const headers = [
      "Name",
      "Phone",
      "City",
      "Status",
      "Vehicle Type",
      "Vehicle Number",
      "From",
      "To",
    ];

    const rows = drivers.map((driver) => [
      driver.name,
      driver.phone,
      driver.city,
      driver.status,
      driver.vehicleType,
      driver.vehicleNumber,
      driver.from,
      driver.to,
    ]);

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "drivers-report.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  /* =========================================
     REPORT STATISTICS
  ========================================= */

  const activePercentage =
    drivers.length > 0
      ? Math.round((activeCount / drivers.length) * 100)
      : 0;

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="drivers-page">

      {/* =================================
          HEADER
      ================================== */}

      <div className="drivers-header">

        <div className="drivers-heading-content">

          <div className="drivers-title">
            <Truck size={22} />

            <h1>Driver Dashboard</h1>
          </div>

          <p>
            Fleet Management & Real-time Courier Dispatch Queue
          </p>

        </div>

        <div className="drivers-header-actions">

          <button
            type="button"
            className="add-driver-btn"
            onClick={handleAddDriver}
          >
            <PlusCircle size={16} />
            Add driver
          </button>

          <button
            type="button"
            className="view-reports-btn"
            onClick={() => setIsReportOpen(true)}
          >
            <FileText size={16} />
            View reports
          </button>

        </div>

      </div>

      {/* =================================
          STATISTICS
      ================================== */}

      <section className="drivers-stats">

        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className={`driver-stat stat-${stat.color}`}
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

      {/* =================================
          SEARCH AND FILTERS
      ================================== */}

      <section className="drivers-filters">

        <div className="drivers-search">
          <Search size={17} />

          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search drivers"
          />
        </div>

        <div className="drivers-filter-select">
          <MapPin size={16} />

          <select
            value={selectedCity}
            onChange={(event) =>
              setSelectedCity(event.target.value)
            }
            aria-label="Filter by city"
          >
            <option value="All">City</option>

            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="drivers-filter-select">
          <Truck size={16} />

          <select
            value={selectedVehicle}
            onChange={(event) =>
              setSelectedVehicle(event.target.value)
            }
            aria-label="Filter by vehicle type"
          >
            <option value="All">Vehicle type</option>

            {vehicleTypes.map((vehicle) => (
              <option key={vehicle} value={vehicle}>
                {vehicle}
              </option>
            ))}
          </select>
        </div>

      </section>

      {/* =================================
          DRIVERS TABLE
      ================================== */}

      <section className="drivers-table-section">

        <div className="drivers-table-heading">
          <h2>Drivers</h2>

          <span>
            {filteredDrivers.length} drivers
          </span>
        </div>

        <div className="drivers-table-wrapper">

          <table className="drivers-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Status</th>
                <th>Vehicle type</th>
                <th>Vehicle number</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id}>

                    {/* NAME */}

                    <td>
                      <div className="driver-name-cell">

                        <DriverAvatar
                          name={driver.name}
                          id={driver.id}
                        />

                        <div>
                          <strong>{driver.name}</strong>
                          <span>{driver.phone}</span>
                        </div>

                      </div>
                    </td>

                    {/* CITY */}

                    <td>{driver.city}</td>

                    {/* STATUS BADGE */}

                    <td>
                      <DriverStatus status={driver.status} />
                    </td>

                    {/* VEHICLE TYPE */}

                    <td>{driver.vehicleType}</td>

                    {/* VEHICLE NUMBER */}

                    <td>{driver.vehicleNumber}</td>

                    {/* WORK HOURS */}

                    <td>{formatTime(driver.from)}</td>
                    <td>{formatTime(driver.to)}</td>

                    {/* STATUS TOGGLE */}

                    <td>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={driver.status === "Active"}
                        aria-label={`Set ${driver.name} ${
                          driver.status === "Active"
                            ? "inactive"
                            : "active"
                        }`}
                        className={`driver-toggle ${
                          driver.status === "Active"
                            ? "toggle-active"
                            : ""
                        }`}
                        onClick={() =>
                          handleToggleStatus(driver.id)
                        }
                      >
                        <span />
                      </button>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="driver-actions">

                        <button
                          type="button"
                          className="driver-delete-btn"
                          title="Delete driver"
                          aria-label="Delete driver"
                          onClick={() =>
                            handleDeleteDriver(driver.id)
                          }
                        >
                          <Trash2 size={15} />
                        </button>

                        <button
                          type="button"
                          className="driver-edit-btn"
                          title="Edit driver"
                          aria-label="Edit driver"
                          onClick={() =>
                            handleEditDriver(driver)
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
                  <td colSpan="9">

                    <div className="drivers-empty-state">
                      <Truck size={32} />

                      <h3>No drivers found</h3>

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

      {/* =================================
          ADD / EDIT DRIVER MODAL
      ================================== */}

      {isModalOpen && (
        <div
          className="driver-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="driver-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="driver-modal-header">

              <div>
                <h2>
                  {editingId !== null
                    ? "Edit Driver"
                    : "Add New Driver"}
                </h2>

                <p>
                  Enter the driver information below.
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
              className="driver-modal-form"
              onSubmit={handleSaveDriver}
            >

              <div className="driver-form-group">
                <label>Driver Name</label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter driver name"
                  required
                />
              </div>

              <div className="driver-form-group">
                <label>Phone Number</label>

                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="driver-form-group">
                <label>City</label>

                <select
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                >
                  <option value="Homs">Homs</option>
                  <option value="Damascus">Damascus</option>
                  <option value="Aleppo">Aleppo</option>
                  <option value="Latakia">Latakia</option>
                  <option value="Tartus">Tartus</option>
                </select>
              </div>

              <div className="driver-form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="driver-form-group">
                <label>Vehicle Type</label>

                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleFormChange}
                >
                  <option value="Car">Car</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Bike">Bike</option>
                  <option value="Van">Van</option>
                </select>
              </div>

              <div className="driver-form-group">
                <label>Vehicle Number</label>

                <input
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleFormChange}
                  placeholder="Enter vehicle number"
                  required
                />
              </div>

              <div className="driver-form-group">
                <label>Working From</label>

                <input
                  type="time"
                  name="from"
                  value={formData.from}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="driver-form-group">
                <label>Working To</label>

                <input
                  type="time"
                  name="to"
                  value={formData.to}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {formError && (
                <p className="driver-form-error">
                  {formError}
                </p>
              )}

              <div className="driver-modal-actions">

                <button
                  type="button"
                  className="driver-cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="driver-save-btn"
                >
                  {editingId !== null
                    ? "Save Changes"
                    : "Add Driver"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* =================================
          REPORTS MODAL
      ================================== */}

      {isReportOpen && (
        <div
          className="driver-modal-overlay"
          onClick={() => setIsReportOpen(false)}
        >
          <div
            className="driver-report-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="driver-modal-header">

              <div>
                <h2>Drivers Report</h2>
                <p>Current fleet overview</p>
              </div>

              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                aria-label="Close report"
              >
                <X size={20} />
              </button>

            </div>

            <div className="driver-report-grid">

              <div>
                <span>Total Drivers</span>
                <strong>{drivers.length}</strong>
              </div>

              <div>
                <span>Active Drivers</span>
                <strong>{activeCount}</strong>
              </div>

              <div>
                <span>Inactive Drivers</span>
                <strong>{inactiveCount}</strong>
              </div>

              <div>
                <span>Active Rate</span>
                <strong>{activePercentage}%</strong>
              </div>

            </div>

            <div className="driver-report-progress">
              <div className="driver-report-progress-heading">
                <span>Driver Availability</span>
                <strong>{activePercentage}%</strong>
              </div>

              <div className="driver-report-progress-track">
                <span
                  style={{ width: `${activePercentage}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              className="driver-report-download"
              onClick={handleDownloadReport}
            >
              <Download size={16} />
              Download CSV Report
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Drivers;
