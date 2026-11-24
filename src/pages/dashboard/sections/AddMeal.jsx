
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  Utensils,
  UploadCloud,
  Image as ImageIcon,
  ShoppingBasket,
  Layers,
  Wallet,
  FileText,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import "./AddMeal.css";

/* =========================================
   EMPTY MEAL
========================================= */

const emptyMeal = {
  name: "",
  quantitySold: "",
  category: "Fast food",
  price: "",
  description: "",
  image: "",
  status: "Active",
};

/* =========================================
   ADD MEAL COMPONENT
========================================= */

function AddMeal() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyMeal);
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
     SAVE MEAL
  ========================================= */

  const handleSaveMeal = (event, returnToRestaurants = false) => {
    event?.preventDefault();

    const quantity = Number(formData.quantitySold);
    const price = Number(formData.price);

    if (
      !formData.name.trim() ||
      formData.quantitySold.trim() === "" ||
      !formData.category ||
      formData.price.trim() === "" ||
      !formData.description.trim() ||
      !formData.image
    ) {
      setError("Please complete all fields and upload a meal image.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Quantity sold must be a valid non-negative number.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Meal price must be greater than zero.");
      return;
    }

    try {
      const savedMeals = JSON.parse(
        localStorage.getItem("aqavia_meals") || "[]"
      );

      if (!Array.isArray(savedMeals)) {
        throw new Error("Invalid meals storage.");
      }

      const newMeal = {
        id: Date.now(),
        name: formData.name.trim(),
        quantitySold: quantity,
        category: formData.category,
        price,
        description: formData.description.trim(),
        image: formData.image,
        status: formData.status,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      localStorage.setItem(
        "aqavia_meals",
        JSON.stringify([newMeal, ...savedMeals])
      );

      if (returnToRestaurants) {
        navigate("/dashboard/restaurants", {
          state: {
            message: "Meal added successfully.",
          },
        });
      } else {
        setFormData(emptyMeal);
        setError("");
      }

    } catch (saveError) {
      console.error("Could not save meal:", saveError);

      setError(
        "Unable to save meal. Try using a smaller image."
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
      setFormData(emptyMeal);
      setError("");
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="add-meal-page">

      {/* PAGE HEADER */}

      <div className="add-meal-header">

        <div className="add-meal-heading">
          <Utensils size={22} />
          <h1>Add & Edit meals</h1>
        </div>

        <div className="add-meal-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span>›</span>
          <Link to="/dashboard/restaurants">Restaurant</Link>
          <span>›</span>
          <span>Meals</span>
        </div>

      </div>

      <p className="add-meal-description">
        Register new meals, configure meal details and pricing,
        and manage availability and menu categories.
      </p>

      <h2 className="add-meal-section-title">
        Profile information
      </h2>

      {/* MAIN FORM */}

      <form
        className="add-meal-card"
        onSubmit={(event) => handleSaveMeal(event)}
      >

        <div className="add-meal-grid">

          {/* =================================
              LEFT SIDE: FORM
          ================================== */}

          <section className="add-meal-left">

            <h3 className="meal-form-subtitle">
              Add & Edit meals
            </h3>

            {/* IMAGE UPLOAD */}

            <div className="meal-image-field">

              <span className="meal-image-label">
                Image
              </span>

              <div
                className={`meal-drop-zone ${
                  isDragging ? "dragging" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >

                {formData.image ? (
                  <div className="meal-uploaded-image">

                    <img
                      src={formData.image}
                      alt="Meal preview"
                    />

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      aria-label="Remove meal image"
                    >
                      <X size={15} />
                    </button>

                  </div>
                ) : (
                  <label
                    htmlFor="meal-image"
                    className="meal-drop-content"
                  >
                    <UploadCloud size={22} />
                    <span>Upload or drag photo</span>
                    <small>
                      JPG, PNG or WEBP · Maximum 300 KB
                    </small>
                  </label>
                )}

              </div>

              <input
                id="meal-image"
                className="meal-hidden-file"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
              />

              <label
                htmlFor="meal-image"
                className="meal-change-photo"
              >
                Change photo
              </label>

            </div>

            {/* MEAL NAME */}

            <label className="meal-form-field">
              <Utensils size={15} />

              <input
                type="text"
                name="name"
                placeholder="Enter meal name"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </label>

            {/* QUANTITY AND CATEGORY */}

            <div className="meal-form-row">

              <label className="meal-form-field">
                <ShoppingBasket size={15} />

                <input
                  type="number"
                  name="quantitySold"
                  min="0"
                  step="1"
                  placeholder="Enter daily quantity sold"
                  value={formData.quantitySold}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="meal-form-field">
                <Layers size={15} />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Fast food">Fast food</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Italian">Italian</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Healthy food">Healthy food</option>
                </select>
              </label>

            </div>

            {/* PRICE */}

            <label className="meal-form-field">
              <Wallet size={15} />

              <input
                type="number"
                name="price"
                placeholder="Enter meal price"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />

            </label>

            {/* DESCRIPTION */}

            <label className="meal-form-field meal-form-textarea">
              <FileText size={15} />

              <textarea
                name="description"
                placeholder="Enter bio"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                required
              />

            </label>

            {/* STATUS */}

            <div className="meal-status-selector">

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

          <section className="add-meal-right">

            <h3 className="meal-preview-title">
              Preview
            </h3>

            {/* IMAGE PREVIEW */}

            <div className="meal-preview-image">

              {formData.image ? (
                <img
                  src={formData.image}
                  alt={formData.name || "Meal preview"}
                />
              ) : (
                <div className="meal-preview-empty">
                  <ImageIcon size={36} />
                  <span>Meal image preview</span>
                </div>
              )}

            </div>

            {/* NAME */}

            <div className="meal-preview-field">
              <Utensils size={14} />
              <span>
                {formData.name || "Meal name"}
              </span>
            </div>

            {/* QUANTITY AND CATEGORY */}

            <div className="meal-preview-row">

              <div className="meal-preview-field">
                <ShoppingBasket size={14} />
                <span>
                  {formData.quantitySold || "0"}
                </span>
              </div>

              <div className="meal-preview-field">
                <Layers size={14} />
                <span>{formData.category}</span>
              </div>

            </div>

            {/* PRICE */}

            <div className="meal-preview-field meal-preview-price">
              <Wallet size={15} />

              <strong>
                {formData.price
                  ? `${Number(formData.price).toLocaleString("en-US")} SRY`
                  : "0 SRY"}
              </strong>
            </div>

            {/* DESCRIPTION */}

            <div className="meal-preview-field meal-preview-description">
              <FileText size={14} />

              <p>
                {formData.description ||
                  "Meal description will appear here."}
              </p>
            </div>

            {/* STATUS */}

            <div className="meal-status-selector">

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

            {/* ADD MEAL BUTTON */}

            <button
              type="button"
              className="meal-create-btn"
              onClick={() => handleSaveMeal(null, true)}
            >
              <Plus size={17} />
              Add meals
            </button>

          </section>

        </div>

        {/* ERROR */}

        {error && (
          <p className="meal-form-error" role="alert">
            {error}
          </p>
        )}

        {/* BOTTOM ACTIONS */}

        <div className="meal-bottom-actions">

          <button
            type="submit"
            className="meal-save-btn"
          >
            <Save size={16} />
            Save & Continue
          </button>

          <button
            type="button"
            className="meal-clear-btn"
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

export default AddMeal;
