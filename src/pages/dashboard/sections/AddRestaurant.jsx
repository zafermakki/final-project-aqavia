
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  UtensilsCrossed,
  UploadCloud,
  Image as ImageIcon,
  UserRound,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  FileText,
  Wallet,
  Percent,
  Clock3,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import "./AddRestaurant.css";

/* =========================================
   EMPTY RESTAURANT
========================================= */

const emptyRestaurant = {
  name: "",
  phone: "",
  password: "",
  location: "",
  bio: "",
  image: "",
  commissionType: "Fixed",
  from: "10:00",
  to: "17:00",
  status: "Active",
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
   ADD RESTAURANT COMPONENT
========================================= */

function AddRestaurant() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyRestaurant);
  const [showPassword, setShowPassword] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  /* =========================================
     HANDLE INPUT CHANGE
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

  /* =========================================
     DRAG AND DROP
  ========================================= */

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
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
     SAVE RESTAURANT
  ========================================= */

  const handleSaveRestaurant = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.password ||
      !formData.location.trim() ||
      !formData.bio.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.from >= formData.to) {
      setError("Closing time must be later than opening time.");
      return;
    }

    try {
      const savedRestaurants = JSON.parse(
        localStorage.getItem("aqavia_restaurants") || "[]"
      );

      if (!Array.isArray(savedRestaurants)) {
        throw new Error("Invalid restaurants storage.");
      }

      const newRestaurant = {
        id: Date.now(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        image: formData.image,
        commissionType: formData.commissionType,
        from: formData.from,
        to: formData.to,
        status: formData.status,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      /*
        Password is intentionally not stored in localStorage.
        It should be sent to Laravel through a secure API.
      */

      localStorage.setItem(
        "aqavia_restaurants",
        JSON.stringify([newRestaurant, ...savedRestaurants])
      );

      navigate("/dashboard/restaurants", {
        state: {
          message: "Restaurant added successfully.",
        },
      });

    } catch (saveError) {
      console.error("Could not save restaurant:", saveError);

      setError(
        "Unable to save restaurant. Try using a smaller image."
      );
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
      setFormData(emptyRestaurant);
      setError("");
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="add-restaurant-page">

      {/* PAGE HEADER */}

      <div className="add-restaurant-header">

        <div className="add-restaurant-heading">
          <UtensilsCrossed size={22} />
          <h1>Add new restaurant</h1>
        </div>

        <div className="add-restaurant-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span>›</span>
          <Link to="/dashboard/restaurants">Restaurant</Link>
          <span>›</span>
          <span>Add</span>
        </div>

      </div>

      <p className="add-restaurant-description">
        Register a new partner restaurant merchant, configure
        operational credentials, and set commission contracts.
      </p>

      <h2 className="add-restaurant-section-title">
        Profile information
      </h2>

      {/* MAIN FORM */}

      <form
        className="add-restaurant-card"
        onSubmit={handleSaveRestaurant}
      >

        <div className="add-restaurant-grid">

          {/* =================================
              LEFT SIDE: FORM
          ================================== */}

          <section className="add-restaurant-left">

            <h3 className="restaurant-form-subtitle">
              Add restaurant
            </h3>

            {/* IMAGE UPLOAD */}

            <div className="restaurant-image-field">

              <span className="restaurant-image-label">Image</span>

              <div
                className={`restaurant-drop-zone ${
                  isDragging ? "dragging" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >

                {formData.image ? (
                  <div className="restaurant-uploaded-image">

                    <img
                      src={formData.image}
                      alt="Restaurant"
                    />

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      aria-label="Remove image"
                    >
                      <X size={15} />
                    </button>

                  </div>
                ) : (
                  <label
                    htmlFor="restaurant-image"
                    className="restaurant-drop-content"
                  >
                    <UploadCloud size={22} />
                    <span>Upload or drag photo</span>
                    <small>JPG, PNG or WEBP · Maximum 300 KB</small>
                  </label>
                )}

              </div>

              <input
                id="restaurant-image"
                className="restaurant-hidden-file"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
              />

              <label
                htmlFor="restaurant-image"
                className="restaurant-change-photo"
              >
                Change photo
              </label>

            </div>

            {/* RESTAURANT NAME */}

            <label className="restaurant-form-field">
              <UtensilsCrossed size={15} />

              <input
                type="text"
                name="name"
                placeholder="Enter restaurant name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            {/* PHONE */}

            <label className="restaurant-form-field">
              <Phone size={15} />

              <input
                type="tel"
                name="phone"
                placeholder="Enter restaurant number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>

            {/* PASSWORD */}

            <label className="restaurant-form-field">
              <Lock size={15} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />

              <button
                type="button"
                className="restaurant-password-toggle"
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

            {/* LOCATION */}

            <label className="restaurant-form-field">
              <MapPin size={15} />

              <input
                type="text"
                name="location"
                placeholder="Enter restaurant location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </label>

            {/* BIO */}

            <label className="restaurant-form-field restaurant-form-textarea">
              <FileText size={15} />

              <textarea
                name="bio"
                placeholder="Enter bio"
                value={formData.bio}
                onChange={handleChange}
                maxLength={500}
                required
              />
            </label>

            {/* COMMISSION */}

            <div className="restaurant-commission">

              <div className="restaurant-field-heading">
                <Wallet size={15} />
                <span>Restaurant commission</span>
              </div>

              <div className="restaurant-commission-selector">

                <button
                  type="button"
                  className={
                    formData.commissionType === "Fixed"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      commissionType: "Fixed",
                    }))
                  }
                >
                  Fixed
                </button>

                <button
                  type="button"
                  className={
                    formData.commissionType === "Percent"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      commissionType: "Percent",
                    }))
                  }
                >
                  Percent
                </button>

              </div>

            </div>

            {/* WORK TIME */}

            <div className="restaurant-work-time">

              <div className="restaurant-field-heading">
                <Clock3 size={15} />
                <span>Work time</span>
              </div>

              <div className="restaurant-time-labels">
                <span>Open from</span>
                <span>Close to</span>
              </div>

              <div className="restaurant-time-inputs">

                <input
                  type="time"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  required
                />

                <input
                  type="time"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* STATUS */}

            <div className="restaurant-status-selector">

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

          <section className="add-restaurant-right">

            <h3 className="restaurant-preview-title">
              Preview
            </h3>

            {/* IMAGE PREVIEW */}

            <div className="restaurant-preview-image">

              {formData.image ? (
                <img
                  src={formData.image}
                  alt={formData.name || "Restaurant preview"}
                />
              ) : (
                <div className="restaurant-preview-empty">
                  <ImageIcon size={36} />
                  <span>Restaurant image preview</span>
                </div>
              )}

            </div>

            {/* NAME PREVIEW */}

            <div className="restaurant-preview-field">
              <UtensilsCrossed size={14} />
              <span>{formData.name || "Restaurant name"}</span>
            </div>

            {/* PHONE PREVIEW */}

            <div className="restaurant-preview-field">
              <Phone size={14} />
              <span>{formData.phone || "Restaurant number"}</span>
            </div>

            {/* LOCATION PREVIEW */}

            <div className="restaurant-preview-field">
              <MapPin size={14} />
              <span>{formData.location || "Restaurant location"}</span>
            </div>

            {/* PASSWORD PREVIEW */}

            <div className="restaurant-preview-field">
              <Lock size={14} />
              <span>
                {formData.password ? "••••••••" : "Password"}
              </span>

              <Eye size={14} />
            </div>

            {/* BIO PREVIEW */}

            <div className="restaurant-preview-field restaurant-preview-bio">
              <FileText size={14} />

              <p>
                {formData.bio ||
                  "Restaurant description will appear here."}
              </p>
            </div>

            {/* COMMISSION PREVIEW */}

            <div className="restaurant-preview-commission">

              <div className="restaurant-field-heading">
                <Wallet size={15} />
                <span>Restaurant commission</span>
              </div>

              <div className="restaurant-commission-selector">

                <button
                  type="button"
                  className={
                    formData.commissionType === "Fixed"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      commissionType: "Fixed",
                    }))
                  }
                >
                  Fixed
                </button>

                <button
                  type="button"
                  className={
                    formData.commissionType === "Percent"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      commissionType: "Percent",
                    }))
                  }
                >
                  Percent
                </button>

              </div>

            </div>

            {/* WORK TIME PREVIEW */}

            <div className="restaurant-preview-work-time">

              <div className="restaurant-field-heading">
                <Clock3 size={15} />
                <span>Work time</span>
              </div>

              <div className="restaurant-time-labels">
                <span>Open from</span>
                <span>Close to</span>
              </div>

              <div className="restaurant-preview-time-values">
                <span>{formatTime(formData.from)}</span>
                <span>{formatTime(formData.to)}</span>
              </div>

            </div>

            {/* STATUS PREVIEW */}

            <div className="restaurant-status-selector">

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

            {/* CREATE BUTTON */}

            <button
              type="submit"
              className="restaurant-create-btn"
            >
              <Plus size={18} />
              Create restaurant
            </button>

          </section>

        </div>

        {/* ERROR */}

        {error && (
          <p className="restaurant-form-error" role="alert">
            {error}
          </p>
        )}

        {/* BOTTOM ACTIONS */}

        <div className="restaurant-bottom-actions">

          <button
            type="submit"
            className="restaurant-save-btn"
          >
            <Save size={16} />
            Save & Continue
          </button>

          <button
            type="button"
            className="restaurant-clear-btn"
            onClick={handleClear}
          >
            <Trash2 size={15} />
            Delete
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddRestaurant;
