
import { useEffect, useMemo, useState } from "react";

import {
  Megaphone,
  BadgeCheck,
  CircleX,
  Search,
  PlusCircle,
  Trash2,
  Pencil,
  Eye,
  X,
  Upload,
  Image as ImageIcon,
  Check,
} from "lucide-react";

import "./Ads.css";

/* =========================================
   DEMO IMAGES
========================================= */

const demoImages = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=160&h=160&fit=crop",
];

/* =========================================
   INITIAL DEMO ADVERTISEMENTS
========================================= */

const initialAds = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,

  title: [
    "Craving Something Delicious?",
    "Fresh Meals Delivered To Your Door",
    "Discover Our Special Offers",
    "Enjoy Your Favorite Pizza Today",
  ][index % 4],

  description: [
    "Discover your favorite meals, enjoy irresistible flavors, and get fresh, delicious food delivered straight to your door.",
    "Order your favorite dishes and enjoy fast delivery right to your home.",
    "Explore our latest offers and discover something delicious today.",
    "Enjoy amazing food, great prices, and convenient delivery.",
  ][index % 4],

  image: demoImages[index % demoImages.length],

  status: index < 16 ? "Active" : "Inactive",

  createdAt: "2026-11-01",
}));

/* =========================================
   EMPTY FORM
========================================= */

const emptyAd = {
  title: "",
  description: "",
  image: "",
  status: "Active",
};

/* =========================================
   AD IMAGE COMPONENT
========================================= */

function AdImage({ src, className = "" }) {
  return (
    <div className={`ad-image-wrapper ${className}`}>
      <Megaphone size={20} />

      {src && (
        <img
          src={src}
          alt="Advertisement"
          onError={(event) => {
            event.currentTarget.classList.add("ad-image-hidden");
          }}
        />
      )}
    </div>
  );
}

/* =========================================
   STATUS TOGGLE
========================================= */

function AdStatusToggle({ status, onChange }) {
  const isActive = status === "Active";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      aria-label={`Turn advertisement ${isActive ? "off" : "on"}`}
      className={`ad-status-toggle ${
        isActive ? "is-active" : ""
      }`}
      onClick={onChange}
    >
      <span />
    </button>
  );
}

/* =========================================
   MAIN COMPONENT
========================================= */

function Ads() {
  /* =========================================
     ADVERTISEMENTS STATE
  ========================================= */

  const [ads, setAds] = useState(() => {
    try {
      const saved = localStorage.getItem("aqavia_ads");

      if (saved !== null) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.error("Could not load advertisements:", error);
    }

    return initialAds;
  });

  /* =========================================
     FILTERS
  ========================================= */

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  /* =========================================
     FORM MODAL
  ========================================= */

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyAd);
  const [formError, setFormError] = useState("");

  /* =========================================
     PREVIEW MODAL
  ========================================= */

  const [previewAd, setPreviewAd] = useState(null);

  /* =========================================
     SAVE TO LOCAL STORAGE
  ========================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "aqavia_ads",
        JSON.stringify(ads)
      );
    } catch (error) {
      console.error("Could not save advertisements:", error);
    }
  }, [ads]);

  /* =========================================
     STATISTICS
  ========================================= */

  const activeCount = ads.filter(
    (ad) => ad.status === "Active"
  ).length;

  const inactiveCount = ads.length - activeCount;

  const statistics = [
    {
      title: "Total Advertisements",
      value: ads.length.toLocaleString("en-US"),
      description: "Configured",
      icon: Megaphone,
      color: "gray",
    },
    {
      title: "Active advertisements",
      value: activeCount.toLocaleString("en-US"),
      description: "Live & visible",
      icon: BadgeCheck,
      color: "green",
    },
    {
      title: "Inactive advertisements",
      value: inactiveCount.toLocaleString("en-US"),
      description: "Archived or paused",
      icon: CircleX,
      color: "dark",
    },
  ];

  /* =========================================
     FILTER TABS
  ========================================= */

  const filterTabs = [
    {
      label: "All",
      value: "All",
      count: ads.length,
    },
    {
      label: "Active",
      value: "Active",
      count: activeCount,
    },
    {
      label: "Inactive",
      value: "Inactive",
      count: inactiveCount,
    },
  ];

  /* =========================================
     SEARCH AND FILTER
  ========================================= */

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        [ad.title, ad.description, ad.status].some(
          (value) =>
            String(value).toLowerCase().includes(searchValue)
        );

      const matchesStatus =
        activeFilter === "All" ||
        ad.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [ads, search, activeFilter]);

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  const handleAddAd = () => {
    setEditingId(null);
    setFormData(emptyAd);
    setFormError("");
    setIsModalOpen(true);
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  const handleEditAd = (ad) => {
    setEditingId(ad.id);

    setFormData({
      title: ad.title,
      description: ad.description,
      image: ad.image || "",
      status: ad.status,
    });

    setFormError("");
    setIsModalOpen(true);
  };

  /* =========================================
     HANDLE FORM CHANGE
  ========================================= */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     UPLOAD IMAGE
  ========================================= */

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    // Keep localStorage usage reasonable
    if (file.size > 400 * 1024) {
      setFormError("Image size must be less than 400 KB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((previous) => ({
          ...previous,
          image: reader.result,
        }));

        setFormError("");
      }
    };

    reader.onerror = () => {
      setFormError("Could not read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  /* =========================================
     SAVE ADVERTISEMENT
  ========================================= */

  const handleSaveAd = (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError("Please complete the advertisement information.");
      return;
    }

    const adData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    if (editingId !== null) {
      setAds((previous) =>
        previous.map((ad) =>
          ad.id === editingId
            ? { ...ad, ...adData }
            : ad
        )
      );
    } else {
      setAds((previous) => [
        {
          id: Date.now(),
          ...adData,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...previous,
      ]);
    }

    closeFormModal();
  };

  /* =========================================
     DELETE ADVERTISEMENT
  ========================================= */

  const handleDeleteAd = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this advertisement?"
    );

    if (!confirmed) return;

    setAds((previous) =>
      previous.filter((ad) => ad.id !== id)
    );

    if (previewAd?.id === id) {
      setPreviewAd(null);
    }
  };

  /* =========================================
     TOGGLE STATUS
  ========================================= */

  const handleToggleStatus = (id) => {
    setAds((previous) =>
      previous.map((ad) =>
        ad.id === id
          ? {
              ...ad,
              status:
                ad.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : ad
      )
    );
  };

  /* =========================================
     CLOSE FORM
  ========================================= */

  const closeFormModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyAd);
    setFormError("");
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="ads-page">

      {/* PAGE HEADER */}

      <div className="ads-header">

        <div className="ads-heading-content">

          <div className="ads-title">
            <Megaphone size={22} />

            <h1>Advertisements</h1>
          </div>

          <p>
            Manage advertisements, campaign schedules,
            target audiences, and display settings.
          </p>

        </div>

        <button
          type="button"
          className="add-ad-btn"
          onClick={handleAddAd}
        >
          <PlusCircle size={16} />
          Add advertisement
        </button>

      </div>

      {/* STATISTICS */}

      <section className="ads-stats">

        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className={`ads-stat-card ads-stat-${stat.color}`}
            >

              <div>
                <p>{stat.title}</p>
                <h3>{stat.value}</h3>
                <span>{stat.description}</span>
              </div>

              <Icon size={24} strokeWidth={1.8} />

            </article>
          );
        })}

      </section>

      {/* SEARCH AND FILTERS */}

      <section className="ads-toolbar">

        <div className="ads-search">

          <Search size={17} />

          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search advertisements"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}

        </div>

        <div className="ads-filter-tabs">

          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`ads-filter-btn ${
                activeFilter === tab.value ? "active" : ""
              }`}
              onClick={() => setActiveFilter(tab.value)}
            >
              <span>{tab.label}</span>
              <span>{tab.count}</span>
            </button>
          ))}

        </div>

      </section>

      {/* ADVERTISEMENTS TABLE */}

      <section className="ads-table-section">

        <div className="ads-table-heading">
          <h2>Advertisements</h2>

          <span>{filteredAds.length} advertisements</span>
        </div>

        <div className="ads-table-wrapper">

          <table className="ads-table">

            <thead>
              <tr>
                <th>Photo</th>
                <th>Name & Bio</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredAds.length > 0 ? (
                filteredAds.map((ad) => (
                  <tr key={ad.id}>

                    {/* IMAGE */}

                    <td>
                      <AdImage src={ad.image} />
                    </td>

                    {/* TITLE AND DESCRIPTION */}

                    <td className="ad-info-cell">
                      <h3>{ad.title}</h3>
                      <p>{ad.description}</p>
                    </td>

                    {/* STATUS */}

                    <td>
                      <AdStatusToggle
                        status={ad.status}
                        onChange={() => handleToggleStatus(ad.id)}
                      />
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="ad-actions">

                        <button
                          type="button"
                          className="ad-delete-btn"
                          onClick={() => handleDeleteAd(ad.id)}
                          title="Delete advertisement"
                          aria-label="Delete advertisement"
                        >
                          <Trash2 size={14} />
                        </button>

                        <button
                          type="button"
                          className="ad-preview-btn"
                          onClick={() => setPreviewAd(ad)}
                          title="Preview advertisement"
                          aria-label="Preview advertisement"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          type="button"
                          className="ad-edit-btn"
                          onClick={() => handleEditAd(ad)}
                          title="Edit advertisement"
                          aria-label="Edit advertisement"
                        >
                          <Pencil size={14} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">

                    <div className="ads-empty-state">

                      <Megaphone size={34} />

                      <h3>No advertisements found</h3>

                      <p>
                        Try changing your search or status filter.
                      </p>

                    </div>

                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* ADD / EDIT ADVERTISEMENT MODAL */}

      {isModalOpen && (
        <div
          className="ad-modal-overlay"
          onClick={closeFormModal}
        >

          <div
            className="ad-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="ad-modal-header">

              <div>
                <h2>
                  {editingId !== null
                    ? "Edit Advertisement"
                    : "Create Advertisement"}
                </h2>

                <p>
                  Add your campaign details and display image.
                </p>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="ad-modal-form"
              onSubmit={handleSaveAd}
            >

              {/* TITLE */}

              <div className="ad-form-group full-width">
                <label>Advertisement Title</label>

                <input
                  name="title"
                  type="text"
                  placeholder="Enter advertisement title"
                  value={formData.title}
                  onChange={handleFormChange}
                  maxLength={100}
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div className="ad-form-group full-width">
                <label>Advertisement Description</label>

                <textarea
                  name="description"
                  placeholder="Describe your advertisement"
                  value={formData.description}
                  onChange={handleFormChange}
                  maxLength={500}
                  required
                />
              </div>

              {/* IMAGE URL */}

              <div className="ad-form-group full-width">
                <label>Image URL (optional)</label>

                <input
                  name="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={
                    formData.image.startsWith("data:")
                      ? ""
                      : formData.image
                  }
                  onChange={handleFormChange}
                />
              </div>

              {/* IMAGE UPLOAD */}

              <div className="ad-form-group full-width">

                <label>Upload Advertisement Image</label>

                <div className="ad-upload-area">

                  <div className="ad-upload-preview">

                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Advertisement preview"
                      />
                    ) : (
                      <ImageIcon size={25} />
                    )}

                  </div>

                  <div className="ad-upload-control">

                    <label htmlFor="ad-image-upload">
                      <Upload size={14} />
                      Choose image
                    </label>

                    <input
                      id="ad-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />

                    <small>
                      JPG, PNG or WEBP. Maximum 400 KB.
                    </small>

                  </div>

                </div>

              </div>

              {/* STATUS */}

              <div className="ad-form-group full-width">
                <label>Advertisement Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {formError && (
                <p className="ad-form-error">
                  {formError}
                </p>
              )}

              {/* ACTIONS */}

              <div className="ad-modal-actions">

                <button
                  type="button"
                  className="ad-cancel-btn"
                  onClick={closeFormModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="ad-save-btn"
                >
                  <Check size={16} />

                  {editingId !== null
                    ? "Save Changes"
                    : "Create Advertisement"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ADVERTISEMENT PREVIEW MODAL */}

      {previewAd && (
        <div
          className="ad-modal-overlay"
          onClick={() => setPreviewAd(null)}
        >

          <div
            className="ad-preview-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="ad-preview-image">

              {previewAd.image ? (
                <img
                  src={previewAd.image}
                  alt={previewAd.title}
                />
              ) : (
                <Megaphone size={40} />
              )}

            </div>

            <div className="ad-preview-content">

              <h2>{previewAd.title}</h2>

              <p>{previewAd.description}</p>

              <div className="ad-preview-footer">

                <span>
                  Status: <strong>{previewAd.status}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => setPreviewAd(null)}
                >
                  Close preview
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Ads;
