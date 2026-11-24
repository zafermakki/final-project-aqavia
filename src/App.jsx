
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Authentication Pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Verification from "./pages/auth/Verification";

// Dashboard Layout
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";

// Dashboard Sections
import Orders from "./pages/dashboard/sections/Orders";
import Restaurants from "./pages/dashboard/sections/Restaurants";
import Drivers from "./pages/dashboard/sections/Drivers";
import DriverReports from "./pages/dashboard/sections/DriverReports";
import Customers from "./pages/dashboard/sections/Customers";
import Coupons from "./pages/dashboard/sections/Coupons";
import Ads from "./pages/dashboard/sections/Ads";
import RevertsFee from "./pages/dashboard/sections/RevertsFee";
import DeliverySettings from "./pages/dashboard/sections/DeliverySettings";
import AdForm from "./pages/dashboard/sections/AdForm";
import AddDriver from "./pages/dashboard/sections/AddDriver";
import CreateOrder from "./pages/dashboard/sections/CreateOrder";
import AddRestaurant from "./pages/dashboard/sections/AddRestaurant";
import AddMeal from "./pages/dashboard/sections/AddMeal";

function App() {
  return (
    <Routes>

      {/* Authentication */}

      <Route path="/" element={<Navigate to="/signup" replace />} />

      <Route path="/signup" element={<SignUp />} />

      <Route path="/login" element={<Login />} />

      <Route path="/verification" element={<Verification />} />

      {/* Dashboard */}

      <Route path="/dashboard" element={<DashboardLayout />}>

        <Route index element={<Dashboard />} />

        <Route path="orders" element={<Orders />} />
        <Route path="orders/create" element={<CreateOrder />}/>

        <Route path="restaurants" element={<Restaurants />} />
        <Route path="restaurants/create" element={<AddRestaurant />}/>
        <Route path="restaurants/meals/create" element={<AddMeal />}/>

        <Route path="drivers" element={<Drivers />} />
        <Route path="drivers/create" element={<AddDriver />}/>
        <Route path="drivers/reports" element={<DriverReports />}/>

        <Route path="customers" element={<Customers />} />

        <Route path="coupons" element={<Coupons />} />

        <Route path="ads" element={<Ads />} />

        <Route path="ads/create" element={<AdForm />} />

        <Route path="ads/:id/edit" element={<AdForm />} />

        <Route path="reverts-fee" element={<RevertsFee />} />

        <Route
          path="delivery-settings"
          element={<DeliverySettings />}
        />

      </Route>

      {/* Not Found */}

      <Route
        path="*"
        element={<Navigate to="/signup" replace />}
      />

    </Routes>
  );
}

export default App;
