
import { useMemo, useState } from "react";

import {
  Tag,
  Store,
  Truck,
  Wallet,
  Search,
} from "lucide-react";

import "./RevertsFee.css";

/* =========================================
   MONTHLY REVENUE DATA
========================================= */

const monthlyData = [
  {
    id: 1,
    period: "Week 1 (Nov 1 - 7)",
    restaurantRevenue: 180000,
    driverFee: 50000,
  },
  {
    id: 2,
    period: "Week 2 (Nov 8 - 14)",
    restaurantRevenue: 260000,
    driverFee: 65000,
  },
  {
    id: 3,
    period: "Week 3 (Nov 15 - 21)",
    restaurantRevenue: 310000,
    driverFee: 70000,
  },
  {
    id: 4,
    period: "Week 4 (Nov 22 - 28)",
    restaurantRevenue: 300000,
    driverFee: 90000,
  },
  {
    id: 5,
    period: "Week 5 (Nov 29 - 30)",
    restaurantRevenue: 370000,
    driverFee: 110000,
  },
];

/* =========================================
   DAILY REVENUE DATA
========================================= */

const dailyData = [
  {
    id: 1,
    period: "09:00 - 11:00",
    restaurantRevenue: 180000,
    driverFee: 50000,
  },
  {
    id: 2,
    period: "11:00 - 13:00",
    restaurantRevenue: 200000,
    driverFee: 55000,
  },
  {
    id: 3,
    period: "13:00 - 15:00",
    restaurantRevenue: 140000,
    driverFee: 60000,
  },
  {
    id: 4,
    period: "15:00 - 17:00",
    restaurantRevenue: 250000,
    driverFee: 70000,
  },
  {
    id: 5,
    period: "17:00 - 19:00",
    restaurantRevenue: 120000,
    driverFee: 85000,
  },
];

/* =========================================
   FORMAT CURRENCY
========================================= */

function formatMoney(value) {
  return `${Number(value).toLocaleString("en-US")} SRY`;
}

/* =========================================
   STATISTICS CARD
========================================= */

function RevenueCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}) {
  return (
    <article className={`revenue-card revenue-${color}`}>

      <div className="revenue-card-info">

        <p>{title}</p>

        <h3>{formatMoney(value)}</h3>

        <span>{description}</span>

      </div>

      <div className="revenue-card-icon">
        <Icon size={25} strokeWidth={1.8} />
      </div>

    </article>
  );
}

/* =========================================
   MAIN COMPONENT
========================================= */

function RevertsFee() {
  const [periodType, setPeriodType] = useState("Monthly");
  const [search, setSearch] = useState("");

  /* =========================================
     SELECT DATA
  ========================================= */

  const revenueData =
    periodType === "Monthly"
      ? monthlyData
      : dailyData;

  /* =========================================
     CALCULATE REVENUE
  ========================================= */

  const statistics = useMemo(() => {
    const restaurantRevenue = revenueData.reduce(
      (sum, item) => sum + item.restaurantRevenue,
      0
    );

    const driverFee = revenueData.reduce(
      (sum, item) => sum + item.driverFee,
      0
    );

    return {
      restaurantRevenue,
      driverFee,
      totalRevenue: restaurantRevenue + driverFee,
    };
  }, [revenueData]);

  /* =========================================
     FILTER TABLE
  ========================================= */

  const filteredData = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return revenueData;

    return revenueData.filter((item) => {
      const total = item.restaurantRevenue + item.driverFee;

      return [
        item.period,
        item.restaurantRevenue,
        item.driverFee,
        total,
      ].some((value) =>
        String(value).toLowerCase().includes(searchValue)
      );
    });
  }, [revenueData, search]);

  /* =========================================
     SUMMARY CARDS
  ========================================= */

  const cards = [
    {
      title: "Admin revenue from restaurants",
      value: statistics.restaurantRevenue,
      description: "Commission on completed restaurant orders",
      icon: Store,
      color: "blue",
    },
    {
      title: "Admin fees from drivers",
      value: statistics.driverFee,
      description: "Platform commission retained from completed deliveries",
      icon: Truck,
      color: "blue",
    },
    {
      title: "Total admin revenue",
      value: statistics.totalRevenue,
      description: "Combined operational revenue",
      icon: Wallet,
      color: "gray",
    },
  ];

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="revenue-page">

      {/* PAGE HEADER */}

      <div className="revenue-header">

        <div className="revenue-title">
          <Tag size={22} />

          <h1>Reverts & Fee</h1>
        </div>

      </div>

      {/* REVENUE STATISTICS */}

      <section className="revenue-cards">

        {cards.map((card) => (
          <RevenueCard
            key={card.title}
            {...card}
          />
        ))}

      </section>

      {/* SEARCH AND PERIOD FILTER */}

      <section className="revenue-toolbar">

        <div className="revenue-search">

          <Search size={17} />

          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            aria-label="Search revenue periods"
          />

        </div>

        <div
          className="revenue-period-tabs"
          role="group"
          aria-label="Revenue period"
        >

          <button
            type="button"
            className={
              periodType === "Monthly" ? "active" : ""
            }
            aria-pressed={periodType === "Monthly"}
            onClick={() => setPeriodType("Monthly")}
          >
            Monthly
          </button>

          <button
            type="button"
            className={
              periodType === "Daily" ? "active" : ""
            }
            aria-pressed={periodType === "Daily"}
            onClick={() => setPeriodType("Daily")}
          >
            Daily
          </button>

        </div>

      </section>

      {/* REVENUE TABLE */}

      <section className="revenue-table-section">

        <div className="revenue-table-heading">

          <h2>Revenue by period</h2>

          <span>
            {filteredData.length} periods
          </span>

        </div>

        <div className="revenue-table-wrapper">

          <table className="revenue-table">

            <thead>
              <tr>
                <th>Period</th>
                <th>Restaurant revenue</th>
                <th>Driver fee</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>

              {filteredData.length > 0 ? (
                filteredData.map((item) => {

                  const total =
                    item.restaurantRevenue + item.driverFee;

                  return (
                    <tr key={item.id}>

                      <td>{item.period}</td>

                      <td>
                        {formatMoney(item.restaurantRevenue)}
                      </td>

                      <td>
                        {formatMoney(item.driverFee)}
                      </td>

                      <td>
                        <span className="revenue-total-badge">
                          {formatMoney(total)}
                        </span>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4">

                    <div className="revenue-empty-state">

                      <Search size={30} />

                      <h3>No revenue records found</h3>

                      <p>
                        Try searching for another period or amount.
                      </p>

                    </div>

                  </td>
                </tr>
              )}

            </tbody>

            {/* TABLE TOTAL */}

            {filteredData.length > 0 && (
              <tfoot>

                <tr>
                  <td>Subtotal</td>

                  <td>
                    {formatMoney(
                      filteredData.reduce(
                        (sum, item) =>
                          sum + item.restaurantRevenue,
                        0
                      )
                    )}
                  </td>

                  <td>
                    {formatMoney(
                      filteredData.reduce(
                        (sum, item) => sum + item.driverFee,
                        0
                      )
                    )}
                  </td>

                  <td>
                    <span className="revenue-total-badge">
                      {formatMoney(
                        filteredData.reduce(
                          (sum, item) =>
                            sum +
                            item.restaurantRevenue +
                            item.driverFee,
                          0
                        )
                      )}
                    </span>
                  </td>
                </tr>

              </tfoot>
            )}

          </table>

        </div>

      </section>

    </div>
  );
}

export default RevertsFee;
