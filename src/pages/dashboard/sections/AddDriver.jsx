
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  Truck,
  UploadCloud,
  UserRound,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Bike,
  Clock,
  Save,
  Trash2,
  Plus,
  Image as ImageIcon,
} from "lucide-react";

import "./AddDriver.css";

/* =========================================
   DEFAULT FORM
========================================= */

const emptyDriver = {
  name: "",
  phone: "",
  city: "",
  password: "",
  vehicleType: "Car",
  vehicleNumber: "",
  from: "10:00",
  to: "17:00",
  status: "Active",
  image: "",
};

/* =========================================
   FORMAT TIME
========================================= */

function formatTime(value) {
  if (!value) return "--:--";

  const [hours, minutes] = value.split(":");
  const hour = Number(hours);

  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
}

/* =========================================
   ADD DRIVER COMPONENT
========================================= */

function AddDriver() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyDriver);
  const [showPassword, setShowPassword] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  /* =========================================
     IMAGE UPLOAD
  ========================================= */

  const processImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 300 * 1024) {
      setError("Image size must be less than 300 KB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((previous) => ({
          ...previous,
          image: reader.result,
        }));

        setError("");
      }
    };

    reader.onerror = () => {
      setError("Could not read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    processImage(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    processImage(event.dataTransfer.files?.[0]);
  };

  /* =========================================
     REMOVE IMAGE
  ========================================= */

  const handleRemoveImage = () => {
    setFormData((previous) => ({
      ...previous,
      image: "",
    }));
  };

  /* =========================================
     SAVE DRIVER
  ========================================= */

  const handleSaveDriver = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.city.trim() ||
      !formData.password ||
      !formData.vehicleNumber.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (formData.from >= formData.to) {
      setError("Closing time must be later than opening time.");
      return;
    }

    try {
      const savedDrivers = JSON.parse(
        localStorage.getItem("aqavia_drivers") || "[]"
      );

      if (!Array.isArray(savedDrivers)) {
        throw new Error("Invalid drivers storage.");
      }

      const newDriver = {
        id: Date.now(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        status: formData.status,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber.trim(),
        from: formData.from,
        to: formData.to,
        image: formData.image,
      };

      localStorage.setItem(
        "aqavia_drivers",
        JSON.stringify([newDriver, ...savedDrivers])
      );

      navigate("/dashboard/drivers", {
        state: {
          message: "Driver added successfully.",
        },
      });

    } catch (saveError) {
      console.error("Could not save driver:", saveError);
      setError("Unable to save driver. Please try again.");
    }
  };

  /* =========================================
     CLEAR FORM
  ========================================= */

  const handleClear = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear this form?"
    );

    if (confirmed) {
      setFormData(emptyDriver);
      setError("");
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="add-driver-page">

      {/* HEADER */}

      <div className="add-driver-header">

        <div className="add-driver-heading">
          <Truck size={22} />
          <h1>Add new driver</h1>
        </div>

        <div className="add-driver-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span>›</span>
          <Link to="/dashboard/drivers">Driver</Link>
          <span>›</span>
          <span>Add</span>
        </div>

      </div>

      <p className="add-driver-description">
        Register a new fleet courier, assign vehicle credentials
        and territory hub, and configure weekly auto-dispatch
        shift settings.
      </p>

      <h2 className="add-driver-section-title">
        Profile information
      </h2>

      {/* MAIN FORM */}

      <form
        className="add-driver-card"
        onSubmit={handleSaveDriver}
      >

        <div className="add-driver-grid">

          {/* =================================
              LEFT SIDE
          ================================== */}

          <section className="add-driver-left">

            <h3>Driver photo</h3>

            {/* IMAGE UPLOAD */}

            <div
              className={`driver-drop-zone ${
                isDragging ? "dragging" : ""
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >

              {formData.image ? (
                <div className="driver-uploaded-image">

                  <img
                    src={formData.image}
                    alt="Driver preview"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    aria-label="Remove driver photo"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>
              ) : (
                <label
                  htmlFor="driver-photo"
                  className="driver-drop-content"
                >
                  <UploadCloud size={22} />
                  <span>Upload or drag photo</span>
                  <small>JPG, PNG or WEBP · Maximum 300 KB</small>
                </label>
              )}

            </div>

            <input
              id="driver-photo"
              className="driver-hidden-file"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
            />

            <label
              htmlFor="driver-photo"
              className="driver-change-photo"
            >
              Change photo
            </label>

            {/* DRIVER NAME */}

            <label className="driver-form-field">
              <UserRound size={15} />

              <input
                name="name"
                type="text"
                placeholder="Enter driver name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            {/* PHONE */}

            <label className="driver-form-field">
              <Phone size={15} />

              <input
                name="phone"
                type="tel"
                placeholder="Enter driver number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>

            {/* WORK AREA */}

            <label className="driver-form-field">
              <MapPin size={15} />

              <input
                name="city"
                type="text"
                placeholder="Work Area / City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </label>

            {/* PASSWORD */}

            <label className="driver-form-field">
              <Lock size={15} />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />

              <button
                type="button"
                className="driver-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>

            </label>

            {/* VEHICLE */}

            <div className="driver-vehicle-fields">

              <label className="driver-form-field">
                <Bike size={15} />

                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                >
                  <option value="Car">Car</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Bike">Bike</option>
                  <option value="Van">Van</option>
                </select>
              </label>

              <label className="driver-form-field">
                <Truck size={15} />

                <input
                  name="vehicleNumber"
                  type="text"
                  placeholder="Enter vehicle number"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  required
                />
              </label>

            </div>

            {/* WORK TIME */}

            <div className="driver-work-time">

              <div className="driver-work-time-title">
                <Clock size={16} />
                <span>Work time</span>
              </div>

              <div className="driver-time-labels">
                <span>Open from</span>
                <span>Close to</span>
              </div>

              <div className="driver-time-fields">

                <input
                  type="time"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  required
                  aria-label="Opening time"
                />

                <input
                  type="time"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  required
                  aria-label="Closing time"
                />

              </div>

            </div>

            {/* STATUS */}

            <div className="driver-status-selector">

              <button
                type="button"
                className={
                  formData.status === "Active" ? "selected" : ""
                }
                onClick={() =>
                  setFormData((previous) => ({
                    ...previous,
                    status: "Active",
                  }))
                }
              >
                Active
              </button>

              <button
                type="button"
                className={
                  formData.status === "Inactive" ? "selected" : ""
                }
                onClick={() =>
                  setFormData((previous) => ({
                    ...previous,
                    status: "Inactive",
                  }))
                }
              >
                Inactive
              </button>

            </div>

          </section>

          {/* =================================
              RIGHT SIDE: LIVE PREVIEW
          ================================== */}

          <section className="add-driver-right">

            <h3>Preview</h3>

            {/* IMAGE PREVIEW */}

            <div className="driver-preview-image">

              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Driver"
                />
              ) : (
                <div className="driver-preview-empty">
                  <ImageIcon size={36} />
                  <span>Driver photo preview</span>
                </div>
              )}

            </div>

            {/* NAME PREVIEW */}

            <div className="driver-preview-field">
              <UserRound size={15} />
              <span>{formData.name || "Driver name"}</span>
            </div>

            {/* PHONE PREVIEW */}

            <div className="driver-preview-field">
              <Phone size={15} />
              <span>{formData.phone || "Driver number"}</span>
            </div>

            {/* LOCATION PREVIEW */}

            <div className="driver-preview-field">
              <MapPin size={15} />
              <span>{formData.city || "Work Area"}</span>
            </div>

            {/* PASSWORD PREVIEW */}

            <div className="driver-preview-field">
              <Lock size={15} />
              <span>
                {formData.password ? "••••••••" : "Password"}
              </span>
            </div>

            {/* VEHICLE PREVIEW */}

            <div className="driver-preview-vehicle">

              <div>
                <Bike size={15} />
                <span>{formData.vehicleType}</span>
              </div>

              <div>
                <Truck size={15} />
                <span>
                  {formData.vehicleNumber || "Vehicle number"}
                </span>
              </div>

            </div>

            {/* WORK TIME PREVIEW */}

            <div className="driver-preview-work-time">

              <div className="driver-work-time-title">
                <Clock size={16} />
                <span>Work time</span>
              </div>

              <div className="driver-preview-time-labels">
                <span>Open from</span>
                <span>Close to</span>
              </div>

              <div className="driver-preview-times">
                <span>{formatTime(formData.from)}</span>
                <span>{formatTime(formData.to)}</span>
              </div>

            </div>

            {/* STATUS PREVIEW */}

            <div className="driver-preview-status">
              <button
                type="button"
                className={
                  formData.status === "Active" ? "selected" : ""
                }
                onClick={() =>
                  setFormData((previous) => ({
                    ...previous,
                    status: "Active",
                  }))
                }
              >
                Active
              </button>

              <button
                type="button"
                className={
                  formData.status === "Inactive" ? "selected" : ""
                }
                onClick={() =>
                  setFormData((previous) => ({
                    ...previous,
                    status: "Inactive",
                  }))
                }
              >
                Inactive
              </button>
            </div>

            {/* CREATE DRIVER */}

            <button
              type="submit"
              className="driver-create-btn"
            >
              <Plus size={18} />
              Create driver
            </button>

          </section>

        </div>

        {/* ERROR AND BOTTOM ACTIONS */}

        {error && (
          <p className="driver-form-error" role="alert">
            {error}
          </p>
        )}

        <div className="driver-bottom-actions">

          <button
            type="submit"
            className="driver-save-continue"
          >
            <Save size={16} />
            Save & Continue
          </button>

          <button
            type="button"
            className="driver-clear-btn"
            onClick={handleClear}
          >
            <Trash2 size={15} />
            Clear
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddDriver;
