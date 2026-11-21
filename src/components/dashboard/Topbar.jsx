
import { useLocation, Link } from "react-router-dom";

import {
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import "./Topbar.css";

const pageNames = {
  "/dashboard": "Dashboard",
  "/dashboard/orders": "Order",
  "/dashboard/restaurants": "Restaurant",
  "/dashboard/drivers": "Driver",
  "/dashboard/customers": "Customer",
  "/dashboard/coupons": "Coupons",
  "/dashboard/ads": "Ads",
  "/dashboard/reverts-fee": "Reverts & Fee",
  "/dashboard/delivery-settings": "Delivery settings",
};

function Topbar() {
  const location = useLocation();

  const currentPage =
    pageNames[location.pathname] || "Dashboard";

  return (
    <header className="dashboard-topbar">

      <div className="topbar-breadcrumb">
        <Link to="/dashboard">Dashboard</Link>

        {currentPage !== "Dashboard" && (
          <>
            <ChevronRight size={13} />

            <span>{currentPage}</span>
          </>
        )}
      </div>

      <div className="topbar-actions">

        <div className="topbar-search">
          <Search size={16} />

          <input
            type="search"
            placeholder="Search"
            aria-label="Search dashboard"
          />

          <kbd>⌘ K</kbd>
        </div>

        <button
          type="button"
          className="topbar-notification"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span className="notification-dot" />
        </button>

        <button
          type="button"
          className="topbar-profile"
          aria-label="User profile"
        >
          <div className="profile-avatar">A</div>

          <ChevronDown size={14} />
        </button>

      </div>

    </header>
  );
}

export default Topbar;
