
import { useEffect, useState } from "react";

import {
  Settings,
  MapPin,
  Wallet,
  Trash2,
  Pencil,
  Plus,
  X,
  Check,
  DollarSign,
  Truck,
} from "lucide-react";

import "./DeliverySettings.css";

/* =========================================
   INITIAL DELIVERY RATES
========================================= */

const initialRates = [
  {
    id: 1,
    distance: "0 - 5 KM",
    fee: 1.5,
  },
  {
    id: 2,
    distance: "5 - 10 KM",
    fee: 2.5,
  },
  {
    id: 3,
    distance: "10 - 15 KM",
    fee: 3.5,
  },
  {
    id: 4,
    distance: "15 + KM",
    fee: 4.5,
  },
];

/* =========================================
   INITIAL PRICING SETTINGS
========================================= */

const initialSettings = {
  pricePerKm: "",
  minimumDeliveryFee: "",
  minimumDeliveryEarnings: "",
};

/* =========================================
   STORAGE HELPER
========================================= */

function getSavedData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (
        parsed !== null &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        return parsed;
      }

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error(`Could not load ${key}:`, error);
  }

  return fallback;
}

/* =========================================
   FORMAT DELIVERY FEE
========================================= */

function formatFee(value) {
  return `${Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}$`;
}

/* =========================================
   DELIVERY SETTINGS COMPONENT
========================================= */

function DeliverySettings() {

  /* =========================================
     DELIVERY RATES STATE
  ========================================= */

  const [rates, setRates] = useState(() =>
    getSavedData("aqavia_delivery_rates", initialRates)
  );

  /* =========================================
     PRICING SETTINGS STATE
  ========================================= */

  const [settings, setSettings] = useState(() =>
    getSavedData("aqavia_delivery_settings", initialSettings)
  );

  /* =========================================
     FEEDBACK
  ========================================= */

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* =========================================
     ADD / EDIT MODAL
  ========================================= */

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    distance: "",
    fee: "",
  });

  /* =========================================
     SAVE RATES TO LOCAL STORAGE
  ========================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "aqavia_delivery_rates",
        JSON.stringify(rates)
      );
    } catch (error) {
      console.error("Could not save delivery rates:", error);
    }
  }, [rates]);

  /* =========================================
     SAVE PRICING SETTINGS
  ========================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "aqavia_delivery_settings",
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Could not save pricing settings:", error);
    }
  }, [settings]);

  /* =========================================
     HANDLE SETTINGS INPUTS
  ========================================= */

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  /* =========================================
     SAVE SETTINGS
  ========================================= */

  const handleSaveSettings = (event) => {
    event.preventDefault();

    const {
      pricePerKm,
      minimumDeliveryFee,
      minimumDeliveryEarnings,
    } = settings;

    if (
      pricePerKm.trim() === "" ||
      minimumDeliveryFee.trim() === "" ||
      minimumDeliveryEarnings.trim() === ""
    ) {
      setMessageType("error");
      setMessage("Please fill in all pricing fields.");
      return;
    }

    const values = [
      Number(pricePerKm),
      Number(minimumDeliveryFee),
      Number(minimumDeliveryEarnings),
    ];

    if (
      !values.every(Number.isFinite) ||
      values[0] <= 0 ||
      values[1] < 0 ||
      values[2] < 0
    ) {
      setMessageType("error");
      setMessage("Please enter valid pricing values.");
      return;
    }

    try {
      localStorage.setItem(
        "aqavia_delivery_settings",
        JSON.stringify(settings)
      );

      setMessageType("success");
      setMessage("Delivery pricing settings saved successfully.");
    } catch (error) {
      console.error("Could not save settings:", error);

      setMessageType("error");
      setMessage("Unable to save settings. Please try again.");
    }
  };

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  const handleAddRate = () => {
    setEditingId(null);

    setFormData({
      distance: "",
      fee: "",
    });

    setFormError("");
    setIsModalOpen(true);
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  const handleEditRate = (rate) => {
    setEditingId(rate.id);

    setFormData({
      distance: rate.distance,
      fee: String(rate.fee),
    });

    setFormError("");
    setIsModalOpen(true);
  };

  /* =========================================
     HANDLE MODAL INPUTS
  ========================================= */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  /* =========================================
     SAVE DELIVERY RATE
  ========================================= */

  const handleSaveRate = (event) => {
    event.preventDefault();

    const distance = formData.distance.trim();
    const fee = Number(formData.fee);

    if (!distance || formData.fee.trim() === "") {
      setFormError("Please complete all fields.");
      return;
    }

    if (!Number.isFinite(fee) || fee < 0) {
      setFormError("Please enter a valid delivery fee.");
      return;
    }

    const duplicate = rates.some(
      (rate) =>
        rate.distance.toLowerCase() === distance.toLowerCase() &&
        rate.id !== editingId
    );

    if (duplicate) {
      setFormError("This distance range already exists.");
      return;
    }

    if (editingId !== null) {
      setRates((previous) =>
        previous.map((rate) =>
          rate.id === editingId
            ? {
                ...rate,
                distance,
                fee,
              }
            : rate
        )
      );
    } else {
      setRates((previous) => [
        ...previous,
        {
          id: Date.now(),
          distance,
          fee,
        },
      ]);
    }

    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ distance: "", fee: "" });
    setFormError("");
  };

  /* =========================================
     DELETE DELIVERY RATE
  ========================================= */

  const handleDeleteRate = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this distance range?"
    );

    if (!confirmed) return;

    setRates((previous) =>
      previous.filter((rate) => rate.id !== id)
    );
  };

  /* =========================================
     CLOSE MODAL
  ========================================= */

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ distance: "", fee: "" });
    setFormError("");
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="delivery-settings-page">

      {/* =================================
          PAGE HEADER
      ================================== */}

      <div className="delivery-settings-header">

        <div className="delivery-settings-title">

          <Settings size={22} />

          <h1>Delivery settings</h1>

        </div>

        <p>
          Configure global distance-based rate tiers and minimum
          threshold guarantees for consumer checkout calculations
          across the operational grid.
        </p>

      </div>

      {/* =================================
          SECTION HEADING
      ================================== */}

      <div className="delivery-pricing-heading">

        <h2>Update Delivery Pricing Parameters</h2>

        <button
          type="button"
          className="add-delivery-rate-btn"
          onClick={handleAddRate}
        >
          <Plus size={15} />
          Add distance range
        </button>

      </div>

      {/* =================================
          MAIN CONTENT
      ================================== */}

      <section className="delivery-settings-grid">

        {/* LEFT: DISTANCE RATES TABLE */}

        <div className="delivery-rates-card">

          <div className="delivery-rates-table-wrapper">

            <table className="delivery-rates-table">

              <thead>
                <tr>
                  <th>Distance range</th>
                  <th>Delivery fee</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {rates.length > 0 ? (
                  rates.map((rate) => (
                    <tr key={rate.id}>

                      <td>
                        <span className="delivery-distance">
                          {rate.distance}
                        </span>
                      </td>

                      <td>
                        <span className="delivery-fee">
                          {formatFee(rate.fee)}
                        </span>
                      </td>

                      <td>
                        <div className="delivery-rate-actions">

                          <button
                            type="button"
                            className="delivery-delete-btn"
                            onClick={() =>
                              handleDeleteRate(rate.id)
                            }
                            title="Delete range"
                            aria-label="Delete distance range"
                          >
                            <Trash2 size={15} />
                          </button>

                          <button
                            type="button"
                            className="delivery-edit-btn"
                            onClick={() =>
                              handleEditRate(rate)
                            }
                            title="Edit range"
                            aria-label="Edit distance range"
                          >
                            <Pencil size={15} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">

                      <div className="delivery-empty-state">
                        <MapPin size={28} />

                        <p>No distance ranges configured.</p>
                      </div>

                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* RIGHT: PRICING PARAMETERS */}

        <div className="delivery-parameters-card">

          <form
            className="delivery-parameters-form"
            onSubmit={handleSaveSettings}
          >

            {/* PRICE PER KM */}

            <label className="delivery-setting-field">

              <MapPin size={17} />

              <span className="visually-hidden">
                Price per kilometer
              </span>

              <input
                type="number"
                name="pricePerKm"
                min="0.01"
                step="0.01"
                placeholder="Enter price per Km :"
                value={settings.pricePerKm}
                onChange={handleSettingsChange}
                required
              />

            </label>

            {/* MINIMUM DELIVERY FEE */}

            <label className="delivery-setting-field">

              <Wallet size={17} />

              <span className="visually-hidden">
                Minimum delivery fee
              </span>

              <input
                type="number"
                name="minimumDeliveryFee"
                min="0"
                step="0.01"
                placeholder="Enter minimum delivery fee :"
                value={settings.minimumDeliveryFee}
                onChange={handleSettingsChange}
                required
              />

            </label>

            {/* MINIMUM DELIVERY EARNINGS */}

            <label className="delivery-setting-field">

              <DollarSign size={17} />

              <span className="visually-hidden">
                Minimum delivery earnings
              </span>

              <input
                type="number"
                name="minimumDeliveryEarnings"
                min="0"
                step="0.01"
                placeholder="Enter minimum Delivery Earnings :"
                value={settings.minimumDeliveryEarnings}
                onChange={handleSettingsChange}
                required
              />

            </label>

            {/* SAVE BUTTON */}

            <button
              type="submit"
              className="save-delivery-settings-btn"
            >
              <Check size={17} />
              Save changes
            </button>

            {/* FEEDBACK */}

            {message && (
              <p
                className={`delivery-settings-message ${messageType}`}
                role="status"
              >
                {message}
              </p>
            )}

          </form>

        </div>

      </section>

      {/* =================================
          ADD / EDIT DISTANCE MODAL
      ================================== */}

      {isModalOpen && (
        <div
          className="delivery-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="delivery-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="delivery-modal-header">

              <div>
                <h2>
                  {editingId !== null
                    ? "Edit Distance Range"
                    : "Add Distance Range"}
                </h2>

                <p>
                  Configure the distance and its delivery fee.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="delivery-modal-form"
              onSubmit={handleSaveRate}
            >

              <div className="delivery-modal-group">

                <label>Distance Range</label>

                <input
                  type="text"
                  name="distance"
                  placeholder="e.g. 20 - 25 KM"
                  value={formData.distance}
                  onChange={handleFormChange}
                  required
                />

              </div>

              <div className="delivery-modal-group">

                <label>Delivery Fee ($)</label>

                <input
                  type="number"
                  name="fee"
                  min="0"
                  step="0.01"
                  placeholder="Enter delivery fee"
                  value={formData.fee}
                  onChange={handleFormChange}
                  required
                />

              </div>

              {formError && (
                <p className="delivery-modal-error">
                  {formError}
                </p>
              )}

              <div className="delivery-modal-actions">

                <button
                  type="button"
                  className="delivery-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="delivery-save-btn"
                >
                  <Check size={15} />

                  {editingId !== null
                    ? "Save changes"
                    : "Add range"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default DeliverySettings;
