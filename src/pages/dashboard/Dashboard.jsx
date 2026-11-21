
import {
  Car,
  Utensils,
  Users,
} from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";

import "./Dashboard.css";

const statistics = [
  {
    title: "Driver fees (Today)",
    value: "2,500,000 SRY",
    subtitle: "50,000 SRY yesterday",
    icon: Car,
    color: "blue",
  },
  {
    title: "Driver fees (This month)",
    value: "25,000,000 SRY",
    subtitle: "2,200 completed drivers",
    icon: Car,
    color: "blue",
  },
  {
    title: "Restaurant Comm (Today)",
    value: "2,500,000 SRY",
    subtitle: "15% avg. commission rate",
    icon: Utensils,
    color: "blue",
  },
  {
    title: "Restaurant Comm (This month)",
    value: "25,000,000 SRY",
    subtitle: "389 active merchant partners",
    icon: Utensils,
    color: "blue",
  },
  {
    title: "Total customers",
    value: "12,000",
    subtitle: "+84 newly registered today",
    icon: Users,
    color: "gray",
  },
  {
    title: "Restaurant Comm (Today)",
    value: "12,000",
    subtitle: "398 open & orders",
    icon: Utensils,
    color: "green",
  },
  {
    title: "Active Drivers",
    value: "12,000",
    subtitle: "142 currently on duty",
    icon: Car,
    color: "blue",
  },
];

const activeDrivers = [
  { name: "Ahmad.s", id: "3332646", status: "Car" },
  { name: "Mohammad.a", id: "3332647", status: "Car" },
  { name: "Omar.k", id: "3332648", status: "Car" },
];

function Dashboard() {
  const today = new Date().toLocaleDateString("en-GB");

  return (
    <div className="dashboard-page">

      {/* Page Heading */}

      <div className="dashboard-heading">

        <div className="dashboard-title">
          <Car size={22} />

          <h1>Dashboard</h1>
        </div>

        <h2>Overview of your logistic operation</h2>

        <p>
          Today : <span>{today}</span>
        </p>

      </div>

      {/* Statistics */}

      <section className="statistics-grid">

        {statistics.map((item, index) => (
          <StatCard
            key={index}
            {...item}
          />
        ))}

      </section>

      {/* Bottom Dashboard Content */}

      <section className="dashboard-bottom">

        {/* Last Orders */}

        <div className="orders-panel">

          <h3 className="panel-title">Last Order</h3>

          <div className="orders-table-wrapper">
            <table className="orders-table">

              <thead>
                <tr>
                  <th>Order ID</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>#3332646</td>
                </tr>
              </tbody>

            </table>
          </div>

        </div>

        {/* Active Drivers */}

        <div className="drivers-panel">

          <div className="drivers-panel-heading">
            <h3>Active driver</h3>

            <span className="online-badge">
              48 Online
            </span>
          </div>

          <p className="drivers-description">
            Drivers currently available for delivery
          </p>

          <div className="active-drivers-list">

            {activeDrivers.map((driver) => (
              <div
                className="active-driver"
                key={driver.id}
              >

                <div className="driver-information">
                  <strong>{driver.name}</strong>
                  <span>{driver.id}</span>
                </div>

                <div className="driver-actions">
                  <span className="driver-car">
                    {driver.status}
                  </span>

                  <span className="driver-busy">
                    Busy
                  </span>
                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;
