
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
  Megaphone,
  Clock3,
  BadgePercent,
  FileText,
  UploadCloud,
  Image as ImageIcon,
  X,
  Trash2,
  Save,
  Plus,
  Eye,
  CalendarDays,
} from "lucide-react";

import "./AdForm.css";

/* =========================================
   DEFAULT FORM DATA
========================================= */

const emptyAd = {
  title: "",
  description: "",
  image: "",
  duration: "3",
  discount: "25",
  status: "Active",
};

/* =========================================
   LOAD ADVERTISEMENT
========================================= */
function getAdvertisement(id) {
  if (!id) return emptyAd;

  try {
    const saved = JSON.parse(
      localStorage.getItem("aqavia_ads") || "[]"
    );

    const ad = saved.find(
      (item) => String(item.id) === String(id)
    );

    if (!ad) return emptyAd;

    return {
      ...emptyAd,
      ...ad,
      duration: String(ad.duration ?? 3),
      discount: String(ad.discount ?? 25),
    };
  } catch (error) {
    console.error("Could not load advertisement:", error);
    return emptyAd;
  }
}

/* =========================================
   ADVERTISEMENT FORM
========================================= */

function AdForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(
    () => getAdvertisement(id)
  );

  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  /* =========================================
     FORM INPUT CHANGE
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
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 400 * 1024) {
      setError("Image size must be less than 400 KB.");
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
      setError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    processImage(event.target.files?.[0]);
    event.target.value = "";
  };

  /* =========================================
     DRAG & DROP
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
     SAVE ADVERTISEMENT
  ========================================= */

  const handleSave = (event) => {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.image
    ) {
      setError("Please complete the title, image and description.");
      return;
    }

    const duration = Number(formData.duration);
    const discount = Number(formData.discount);

    if (!Number.isInteger(duration) || duration < 1) {
      setError("Display duration must be at least one day.");
      return;
    }

    if (
      !Number.isFinite(discount) ||
      discount < 0 ||
      discount > 100
    ) {
      setError("Discount must be between 0 and 100%.");
      return;
    }

    try {
      const savedAds = JSON.parse(
        localStorage.getItem("aqavia_ads") || "[]"
      );

      if (!Array.isArray(savedAds)) {
        throw new Error("Invalid advertisement storage.");
      }

      const advertisementData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image,
        duration,
        discount,
        status: formData.status,
      };

      let updatedAds;

      if (isEditing) {
        const exists = savedAds.some(
          (ad) => String(ad.id) === String(id)
        );

        if (!exists) {
          setError("Advertisement not found. Please return to Ads.");
          return;
        }

        updatedAds = savedAds.map((ad) =>
          String(ad.id) === String(id)
            ? {
                ...ad,
                ...advertisementData,
              }
            : ad
        );
      } else {
        const newAd = {
          id: Date.now(),
          ...advertisementData,
          createdAt: new Date().toISOString().slice(0, 10),
        };

        updatedAds = [newAd, ...savedAds];
      }

      localStorage.setItem(
        "aqavia_ads",
        JSON.stringify(updatedAds)
      );

      navigate("/dashboard/ads", {
        state: {
          message: isEditing
            ? "Advertisement updated successfully."
            : "Advertisement created successfully.",
        },
      });
    } catch (saveError) {
      console.error("Could not save advertisement:", saveError);
      setError("Unable to save advertisement. Please try again.");
    }
  };

  /* =========================================
     DELETE / CANCEL
  ========================================= */

  const handleDelete = () => {
    if (isEditing) {
      const confirmed = window.confirm(
        "Are you sure you want to delete this advertisement?"
      );

      if (!confirmed) return;

      try {
        const savedAds = JSON.parse(
          localStorage.getItem("aqavia_ads") || "[]"
        );

        const updatedAds = savedAds.filter(
          (ad) => String(ad.id) !== String(id)
        );

        localStorage.setItem(
          "aqavia_ads",
          JSON.stringify(updatedAds)
        );

        navigate("/dashboard/ads");
      } catch (deleteError) {
        console.error("Could not delete advertisement:", deleteError);
        setError("Unable to delete advertisement.");
      }

      return;
    }

    const confirmed = window.confirm(
      "Discard this new advertisement?"
    );

    if (confirmed) {
      setFormData(emptyAd);
      setError("");
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="ad-form-page">

      {/* PAGE HEADER */}

      <div className="ad-form-page-header">

        <div className="ad-form-page-title">
          <Megaphone size={22} />

          <h1>
            {isEditing
              ? "Edit Advertisements"
              : "Add & Edit Advertisements"}
          </h1>
        </div>

        <div className="ad-form-breadcrumb">
          <Link to="/dashboard/ads">Advertisements</Link>
          <span>›</span>
          <span>{isEditing ? "Edit" : "Add & Edit"}</span>
        </div>

      </div>

      <div className="ad-form-section-title">
        <h2>Advertisements information</h2>
      </div>

      {/* MAIN FORM */}

      <form
        className="ad-editor-card"
        onSubmit={handleSave}
      >

        <div className="ad-editor-inner">

          {/* =================================
              LEFT: EDITOR
          ================================== */}

          <section className="ad-editor-left">

            <h3 className="ad-editor-subtitle">
              Profile information
            </h3>

            <div className="ad-editor-box">

              <h4>Add & Edit Advertisements</h4>

              {/* IMAGE UPLOAD */}

              <div className="ad-image-field">

                <label>Image</label>

                <div
                  className={`ad-drop-zone ${
                    isDragging ? "dragging" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >

                  {formData.image ? (
                    <div className="ad-uploaded-image">

                      <img
                        src={formData.image}
                        alt="Uploaded advertisement"
                      />

                      <button
                        type="button"
                        className="remove-uploaded-image"
                        onClick={handleRemoveImage}
                        aria-label="Remove image"
                      >
                        <X size={15} />
                      </button>

                    </div>
                  ) : (
                    <label
                      className="ad-drop-content"
                      htmlFor="advertisement-image"
                    >
                      <UploadCloud size={22} />

                      <span>Up lode or drag photo</span>
                      <small>JPG, PNG or WEBP · Maximum 400 KB</small>
                    </label>
                  )}

                  <input
                    id="advertisement-image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                  />

                </div>

                <label
                  htmlFor="advertisement-image"
                  className="ad-change-photo-btn"
                >
                  Change photo
                </label>

              </div>

              {/* AD TITLE */}

              <div className="ad-editor-field">
                <Megaphone size={15} />

                <input
                  name="title"
                  type="text"
                  placeholder="Enter advertisement title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={100}
                />
              </div>

              {/* DURATION */}

              <div className="ad-editor-field">
                <Clock3 size={15} />

                <input
                  name="duration"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ad Display Duration (Days)"
                  value={formData.duration}
                  onChange={handleChange}
                />

                <span className="ad-input-suffix">Days</span>
              </div>

              {/* DISCOUNT */}

              <div className="ad-editor-field">
                <BadgePercent size={15} />

                <input
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="Discount Amount"
                  value={formData.discount}
                  onChange={handleChange}
                />

                <span className="ad-input-suffix">%</span>
              </div>

              {/* BIO */}

              <div className="ad-editor-field ad-editor-textarea">
                <FileText size={15} />

                <textarea
                  name="description"
                  placeholder="Enter advertisement bio"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={500}
                />

              </div>

              {/* STATUS */}

              <div className="ad-status-selector">

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

              {/* ERROR */}

              {error && (
                <p className="ad-editor-error" role="alert">
                  {error}
                </p>
              )}

              {/* BOTTOM ACTIONS */}

              <div className="ad-editor-actions">

                <button
                  type="submit"
                  className="ad-save-continue-btn"
                >
                  <Save size={15} />

                  Save & Continue
                </button>

                <button
                  type="button"
                  className="ad-delete-form-btn"
                  onClick={handleDelete}
                >
                  <Trash2 size={15} />
                  {isEditing ? "Delete" : "Clear"}
                </button>

              </div>

            </div>

          </section>

          {/* =================================
              RIGHT: LIVE PREVIEW
          ================================== */}

          <section className="ad-editor-right">

            <div className="ad-preview-heading">
              <Eye size={15} />
              <h3>Preview</h3>
            </div>

            <div className="ad-form-preview-image">

              {formData.image ? (
                <img
                  src={formData.image}
                  alt={formData.title || "Advertisement preview"}
                />
              ) : (
                <div className="ad-preview-image-empty">
                  <ImageIcon size={36} />
                  <span>Advertisement image preview</span>
                </div>
              )}

            </div>

            {/* PREVIEW TITLE */}

            <div className="ad-preview-field">
              <Megaphone size={14} />

              <span>
                {formData.title || "Advertisement title"}
              </span>
            </div>

            {/* PREVIEW DISCOUNT */}

            <div className="ad-preview-field">
              <BadgePercent size={14} />

              <strong>
                {formData.discount || "0"} %
              </strong>
            </div>

            {/* PREVIEW DURATION */}

            <div className="ad-preview-field">
              <Clock3 size={14} />

              <span>
                {formData.duration || "0"} Days
              </span>
            </div>

            {/* PREVIEW DESCRIPTION */}

            <div className="ad-preview-field ad-preview-description">
              <FileText size={14} />

              <p>
                {formData.description ||
                  "Advertisement description will appear here."}
              </p>
            </div>

            {/* PREVIEW STATUS */}

            <div className="ad-preview-status">
              <span>
                {formData.status}
              </span>

              <span
                className={
                  formData.status === "Active"
                    ? "preview-active-dot"
                    : "preview-inactive-dot"
                }
              />
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="ad-create-submit-btn"
            >
              <Plus size={17} />
              {isEditing
                ? "Update advertisement"
                : "Create advertisement"}
            </button>

          </section>

        </div>

      </form>

    </div>
  );
}

export default AdForm;
