
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  ClipboardList,
  Truck,
  Wallet,
  Clock3,
  Search,
  CalendarDays,
  Bike,
  Pencil,
  Trash2,
  Users,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";

import "./DriverReports.css";

/* =========================================
   DEMO CHART DATA
========================================= */

const chartData = {
  Daily: [
    { label: "Mon", current: 8, previous: 5 },
    { label: "Tue", current: 12, previous: 8 },
    { label: "Wed", current: 10, previous: 7 },
    { label: "Thu", current: 14, previous: 9 },
    { label: "Fri", current: 11, previous: 10 },
    { label: "Sat", current: 17, previous: 12 },
    { label: "Sun", current: 20, previous: 14 },
  ],

  Weekly: [
    { label: "W1", current: 12, previous: 8 },
    { label: "W2", current: 15, previous: 10 },
    { label: "W3", current: 14, previous: 12 },
    { label: "W4", current: 20, previous: 15 },
  ],

  Monthly: [
    { label: "Jan", current: 10, previous: 7 },
    { label: "Feb", current: 13, previous: 9 },
    { label: "Mar", current: 12, previous: 10 },
    { label: "Apr", current: 17, previous: 11 },
    { label: "May", current: 15, previous: 12 },
    { label: "Jun", current: 19, previous: 14 },
    { label: "Jul", current: 18, previous: 15 },
    { label: "Aug", current: 23, previous: 17 },
    { label: "Sep", current: 20, previous: 15 },
    { label: "Oct", current: 25, previous: 18 },
    { label: "Nov", current: 22, previous: 19 },
    { label: "Dec", current: 27, previous: 21 },
  ],
};

/* =========================================
   INITIAL DEMO DRIVERS
========================================= */

const initialDrivers = [
  {
    id: 1,
    name: "Ahmad abd alrhman",
    phone: "0933 555 901",
    city: "Homs",
    status: "Active",
    vehicleType: "Car",
    deliveries: 85,
    earnings: 25000,
    averageTime: "25 Min",
  },
  {
    id: 2,
    name: "Mohammad Ali",
    phone: "0993 325 560",
    city: "Damascus",
    status: "Active",
    vehicleType: "Motorcycle",
    deliveries: 85,
    earnings: 25000,
    averageTime: "25 Min",
  },
  {
    id: 3,
    name: "Omar Hassan",
    phone: "0944 221 130",
    city: "Aleppo",
    status: "Active",
    vehicleType: "Car",
    deliveries: 85,
    earnings: 25000,
    averageTime: "25 Min",
  },
  {
    id: 4,
    name: "Khaled Omar",
    phone: "0991 456 789",
    city: "Homs",
    status: "Active",
    vehicleType: "Motorcycle",
    deliveries: 85,
    earnings: 25000,
    averageTime: "25 Min",
  },
  {
    id: 5,
    name: "safe.s",
    phone: "0935 444 222",
    city: "Damascus",
    status: "Active",
    vehicleType: "Car",
    deliveries: 85,
    earnings: 25000,
    averageTime: "25 Min",
  },
];

/* =========================================
   READ DRIVERS
========================================= */

function getInitialDrivers() {
  try {
    const saved = localStorage.getItem("aqavia_drivers");

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Could not load drivers:", error);
  }

  return initialDrivers;
}

/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(value) {
  return `${Number(value).toLocaleString("en-US")} SRY`;
}

/* =========================================
   DRIVER AVATAR
========================================= */

function DriverAvatar({ driver }) {
  const initials = (driver.name || "DR")
    .split(/[.\s]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="report-driver-avatar">
      {driver.image || driver.avatar ? (
        <img
          src={driver.image || driver.avatar}
          alt={driver.name}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

/* =========================================
   STATISTIC CARD
========================================= */

function ReportStat({ title, value, description, icon: Icon, color }) {
  return (
    <article className={`driver-report-stat stat-${color}`}>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
        <span>{description}</span>
      </div>

      <Icon size={25} strokeWidth={1.8} />
    </article>
  );
}

/* =========================================
   MAIN COMPONENT
========================================= */

function DriverReports() {
  const navigate = useNavigate();

  /* DRIVERS */

  const [drivers, setDrivers] = useState(getInitialDrivers);

  /* FILTERS */

  const [selectedDriver, setSelectedDriver] = useState("All");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [periodType, setPeriodType] = useState("Monthly");
  const [chartPeriod, setChartPeriod] = useState("Monthly");

  /* EDIT MODAL */

  const [editingDriver, setEditingDriver] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    city: "",
    status: "Active",
  });

  /* =========================================
     SAVE DRIVER CHANGES
  ========================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "aqavia_drivers",
        JSON.stringify(drivers)
      );
    } catch (error) {
      console.error("Could not save drivers:", error);
    }
  }, [drivers]);

  /* =========================================
     NORMALIZE REPORT ROWS
  ========================================= */

  const reportDrivers = useMemo(() => {
    return drivers.map((driver, index) => ({
      ...driver,
      deliveries: Number(
        driver.deliveries ??
        driver.orders ??
        (85 - index * 5)
      ),
      earnings: Number(
        driver.earnings ??
        25000
      ),
      averageTime:
        driver.averageTime ??
        driver.averageDeliveryTime ??
        "25 Min",
    }));
  }, [drivers]);

  /* =========================================
     FILTER DRIVER TABLE
  ========================================= */

  const filteredDrivers = useMemo(() => {
    if (selectedDriver === "All") {
      return reportDrivers;
    }

    return reportDrivers.filter(
      (driver) => String(driver.id) === selectedDriver
    );
  }, [reportDrivers, selectedDriver]);

  /* =========================================
     SUMMARY STATISTICS
  ========================================= */

  const selectedDriverData =
    selectedDriver === "All"
      ? null
      : reportDrivers.find(
          (driver) => String(driver.id) === selectedDriver
        );

  const summary = useMemo(() => {
    if (selectedDriverData) {
      return {
        orders: selectedDriverData.deliveries,
        fee: selectedDriverData.earnings,
        earnings: Math.round(
          selectedDriverData.earnings * 0.8
        ),
      };
    }

    if (periodType === "Daily") {
      return {
        orders: 14,
        fee: 28000,
        earnings: 22400,
      };
    }

    return {
      orders: 14,
      fee: 28000,
      earnings: 22400,
    };
  }, [periodType, selectedDriverData]);

  const statistics = [
    {
      title: "Compiled order",
      value: summary.orders.toLocaleString("en-US"),
      description: "+ 12% Vs yesterday",
      icon: ClipboardList,
      color: "green",
    },
    {
      title: "Total delivery fee",
      value: formatMoney(summary.fee),
      description: "Active transit",
      icon: Truck,
      color: "gray",
    },
    {
      title: "Delivery earnings",
      value: formatMoney(summary.earnings),
      description: "-5% Vs yesterday",
      icon: Wallet,
      color: "blue",
    },
  ];

  /* =========================================
     CHART DATA
  ========================================= */

  const currentChartData = chartData[chartPeriod];

  const maximumValue = Math.max(
    ...currentChartData.map((item) =>
      Math.max(item.current, item.previous)
    ),
    1
  );

  /* =========================================
     PERFORMANCE DATA
  ========================================= */

  const performanceDrivers = reportDrivers.slice(0, 5);

  const performanceColors = [
    "#f16b70",
    "#68bdd7",
    "#5976d1",
    "#8acb72",
    "#ffbf4f",
  ];

  const performancePercentages = [22, 18, 20, 20, 20];

  const donutGradient = performancePercentages.reduce(
    (result, percentage, index) => {
      const start = performancePercentages
        .slice(0, index)
        .reduce((sum, value) => sum + value, 0);

      const end = start + percentage;

      return [
        ...result,
        `${performanceColors[index]} ${start}% ${end}%`,
      ];
    },
    []
  ).join(", ");

  /* =========================================
     EDIT DRIVER
  ========================================= */

  const handleEdit = (driver) => {
    setEditingDriver(driver);

    setEditData({
      name: driver.name || "",
      phone: driver.phone || "",
      city: driver.city || "",
      status: driver.status || "Active",
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();

    setDrivers((previous) =>
      previous.map((driver) =>
        String(driver.id) === String(editingDriver.id)
          ? { ...driver, ...editData }
          : driver
      )
    );

    setEditingDriver(null);
  };

  /* =========================================
     DELETE DRIVER
  ========================================= */

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this driver?"
    );

    if (!confirmed) return;

    setDrivers((previous) =>
      previous.filter(
        (driver) => String(driver.id) !== String(id)
      )
    );

    if (String(selectedDriver) === String(id)) {
      setSelectedDriver("All");
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="driver-reports-page">

      {/* =================================
          PAGE HEADER
      ================================== */}

      <div className="driver-report-header">

        <div className="driver-report-title">
          <ClipboardList size={22} />

          <h1>Driver report</h1>
        </div>

        <Link
          to="/dashboard/drivers"
          className="driver-report-back"
        >
          <ArrowLeft size={15} />
          Back to drivers
        </Link>

      </div>

      {/* =================================
          STATISTICS
      ================================== */}

      <section className="driver-report-stats">

        {statistics.map((stat) => (
          <ReportStat
            key={stat.title}
            {...stat}
          />
        ))}

      </section>

      {/* =================================
          FILTERS
      ================================== */}

      <section className="driver-report-filters">

        <div className="report-filter-field">

          <Bike size={16} />

          <select
            value={selectedDriver}
            onChange={(event) =>
              setSelectedDriver(event.target.value)
            }
            aria-label="Choose driver"
          >
            <option value="All">Choose driver</option>

            {reportDrivers.map((driver) => (
              <option
                key={driver.id}
                value={String(driver.id)}
              >
                {driver.name}
              </option>
            ))}

          </select>

        </div>

        <div className="report-date-field">

          <CalendarDays size={16} />

          <input
            type="date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(event.target.value)
            }
            aria-label="Select report date"
          />

        </div>

        <div className="report-period-tabs">

          <button
            type="button"
            className={periodType === "Monthly" ? "active" : ""}
            onClick={() => setPeriodType("Monthly")}
          >
            Monthly
          </button>

          <button
            type="button"
            className={periodType === "Daily" ? "active" : ""}
            onClick={() => setPeriodType("Daily")}
          >
            Daily
          </button>

        </div>

      </section>

      {/* =================================
          CHARTS
      ================================== */}

      <section className="driver-report-charts">

        {/* DELIVERY OVERVIEW */}

        <div className="delivery-overview-card">

          <div className="report-chart-heading">

            <div>
              <h2>Deliveries overview</h2>

              <p>
                Completed deliveries during the selected period
              </p>
            </div>

            <div className="chart-period-tabs">

              {["Daily", "Weekly", "Monthly"].map((period) => (
                <button
                  key={period}
                  type="button"
                  className={
                    chartPeriod === period ? "active" : ""
                  }
                  onClick={() => setChartPeriod(period)}
                >
                  {period}
                </button>
              ))}

            </div>

          </div>

          {/* BAR CHART */}

          <div className="driver-bar-chart">

            <div className="driver-chart-y-axis">
              {[30, 25, 20, 15, 10, 5, 0].map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>

            <div className="driver-chart-main">

              <div className="driver-chart-grid-lines">
                {Array.from({ length: 7 }, (_, index) => (
                  <span key={index} />
                ))}
              </div>

              <div className="driver-chart-bars">

                {currentChartData.map((item) => (
                  <div
                    className="driver-chart-group"
                    key={item.label}
                  >

                    <div className="driver-bars">

                      <div
                        className="driver-bar previous"
                        style={{
                          height: `${(item.previous / maximumValue) * 100}%`,
                        }}
                        title={`Previous: ${item.previous}`}
                      />

                      <div
                        className="driver-bar current"
                        style={{
                          height: `${(item.current / maximumValue) * 100}%`,
                        }}
                        title={`Current: ${item.current}`}
                      />

                    </div>

                    <span className="driver-chart-label">
                      {item.label}
                    </span>

                  </div>
                ))}

              </div>

            </div>

          </div>

          <div className="driver-chart-legend">

            <span>
              <i className="legend-current" />
              Current year
            </span>

            <span>
              <i className="legend-previous" />
              Previous year
            </span>

          </div>

        </div>

        {/* DRIVER PERFORMANCE */}

        <div className="driver-performance-card">

          <div className="report-chart-heading performance-heading">

            <div>
              <h2>Driver performance</h2>

              <p>Top drivers by completed deliveries</p>
            </div>

          </div>

          <div className="driver-performance-content">

            <div className="driver-donut-area">

              <div
                className="driver-donut-chart"
                style={{
                  background: `conic-gradient(${donutGradient})`,
                }}
              >

                <div className="driver-donut-center">
                  <strong>2500</strong>
                  <span>Total deliveries</span>
                </div>

              </div>

            </div>

            <div className="driver-performance-legend">

              {performanceDrivers.length > 0 ? (
                performanceDrivers.map((driver, index) => (
                  <div
                    className="performance-legend-item"
                    key={driver.id}
                  >

                    <i
                      style={{
                        background: performanceColors[
                          index % performanceColors.length
                        ],
                      }}
                    />

                    <span>{driver.name}</span>

                  </div>
                ))
              ) : (
                <span>No driver data available</span>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =================================
          DRIVERS TABLE
      ================================== */}

      <section className="report-drivers-section">

        <div className="report-drivers-heading">

          <h2>Drivers</h2>

          <span>
            {filteredDrivers.length} drivers
          </span>

        </div>

        <div className="report-drivers-table-wrapper">

          <table className="report-drivers-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Deliveries</th>
                <th>Status</th>
                <th>Earnings</th>
                <th>Average delivery time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id}>

                    <td>
                      <div className="report-driver-name">

                        <DriverAvatar driver={driver} />

                        <div>
                          <strong>{driver.name}</strong>
                          <span>{driver.phone}</span>
                        </div>

                      </div>
                    </td>

                    <td>{driver.deliveries}</td>

                    <td>
                      <span
                        className={`report-driver-status ${
                          driver.status === "Active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {driver.status}
                      </span>
                    </td>

                    <td className="report-driver-earnings">
                      {formatMoney(driver.earnings)}
                    </td>

                    <td>{driver.averageTime}</td>

                    <td>
                      <div className="report-driver-actions">

                        <button
                          type="button"
                          className="report-edit-btn"
                          title="Edit driver"
                          aria-label="Edit driver"
                          onClick={() => handleEdit(driver)}
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          className="report-delete-btn"
                          title="Delete driver"
                          aria-label="Delete driver"
                          onClick={() => handleDelete(driver.id)}
                        >
                          <Trash2 size={14} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">

                    <div className="report-drivers-empty">
                      <Users size={30} />

                      <h3>No drivers found</h3>

                      <p>There are no drivers to display.</p>
                    </div>

                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =================================
          EDIT DRIVER MODAL
      ================================== */}

      {editingDriver && (
        <div
          className="report-edit-overlay"
          onClick={() => setEditingDriver(null)}
        >

          <div
            className="report-edit-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="report-edit-header">

              <div>
                <h2>Edit Driver</h2>
                <p>Update driver information.</p>
              </div>

              <button
                type="button"
                onClick={() => setEditingDriver(null)}
                aria-label="Close modal"
              >
                <X size={19} />
              </button>

            </div>

            <form onSubmit={handleSaveEdit}>

              <label>
                Driver Name

                <input
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label>
                Phone Number

                <input
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label>
                City

                <input
                  name="city"
                  value={editData.city}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label>
                Status

                <select
                  name="status"
                  value={editData.status}
                  onChange={handleEditChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              <div className="report-edit-actions">

                <button
                  type="button"
                  onClick={() => setEditingDriver(null)}
                >
                  Cancel
                </button>

                <button type="submit">
                  <Save size={15} />
                  Save changes
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default DriverReports;
