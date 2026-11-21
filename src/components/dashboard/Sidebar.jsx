
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  Truck,
  Users,
  TicketPercent,
  Megaphone,
  Receipt,
  Settings,
  Package,
} from "lucide-react";

import "./Sidebar.css";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    title: "Order",
    path: "/dashboard/orders",
    icon: ClipboardList,
  },
  {
    title: "Restaurant",
    path: "/dashboard/restaurants",
    icon: Utensils,
  },
  {
    title: "Driver",
    path: "/dashboard/drivers",
    icon: Truck,
  },
  {
    title: "Customer",
    path: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Coupons",
    path: "/dashboard/coupons",
    icon: TicketPercent,
  },
  {
    title: "Ads",
    path: "/dashboard/ads",
    icon: Megaphone,
  },
  {
    title: "Reverts & Fee",
    path: "/dashboard/reverts-fee",
    icon: Receipt,
  },
  {
    title: "Delivery Settings",
    path: "/dashboard/delivery-settings",
    icon: Settings,
  },
];

function Sidebar() {
  return (
    <aside className="dashboard-sidebar">

      <div className="sidebar-logo">
        <Package size={21} strokeWidth={2.5} />
        <span>Drop X</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={17} strokeWidth={1.8} />

              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}

export default Sidebar;
