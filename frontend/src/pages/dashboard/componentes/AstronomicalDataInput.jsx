import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateFormValue,
  addObservationToDataset,
  setFormDataError,
  clearErrors,
} from "../store";
import "../styles/formStyles.css";

const AstronomicalDataInput = () => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const activeModel = useSelector((state) => state.dashboardStore.activeModel);
  const tessFormFields = useSelector(
    (state) => state.dashboardStore.tessFormFields
  );
  const keplerFormFields = useSelector(
    (state) => state.dashboardStore.keplerFormFields
  );
  const tessFormValues = useSelector(
    (state) => state.dashboardStore.tessFormValues
  );
  const keplerFormValues = useSelector(
    (state) => state.dashboardStore.keplerFormValues
  );
  const formDataError = useSelector(
    (state) => state.dashboardStore.formDataError
  );

  // Get current fields and values based on active model
  const formFields =
    activeModel === "kepler" ? keplerFormFields : tessFormFields;
  const formValues =
    activeModel === "kepler" ? keplerFormValues : tessFormValues;

  // Split fields into top 10 and the rest
  const topFields = formFields.slice(0, 8);
  const secondaryFields = formFields.slice(8);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormValue({ key: name, value: parseFloat(value) || 0 }));
    // Clear error when user starts editing
    if (formDataError) {
      dispatch(clearErrors());
    }
  };

  const validateForm = () => {
    // Check if all required fields have values
    const requiredFields = formFields.filter((field) => field.required);
    for (let field of requiredFields) {
      if (!formValues[field.key] && formValues[field.key] !== 0) {
        dispatch(setFormDataError(`${field.label} is required`));
        return false;
      }
    }
    return true;
  };

  const handleAddToDataset = () => {
    dispatch(clearErrors());

    if (!validateForm()) {
      return;
    }

    // Create a copy of the current form values
    const observation = { ...formValues };

    // Add to dataset
    dispatch(addObservationToDataset(observation));

    // Show success notification
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Optionally clear form or keep values for quick entry
    // For now, keeping values to allow similar observations to be added quickly
  };

  const renderField = (field) => (
    <div key={field.key} className="form-group">
      <label htmlFor={field.key}>
        <strong>{field.label}</strong>
        {field.required && (
          <span
            style={{ color: "var(--accent-red, #ef4444)", marginLeft: "4px" }}
          >
            *
          </span>
        )}
      </label>
      <input
        type="number"
        id={field.key}
        name={field.key}
        value={formValues[field.key] || ""}
        onChange={handleInputChange}
        placeholder=""
        step={field.step}
      />
    </div>
  );

  return (
    <div className="glass-card">
      {/* Success notification */}
      {showSuccess && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "8px",
            color: "var(--accent-green, #10b981)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          Observation added to dataset successfully!
        </div>
      )}

      {/* Error notification */}
      {formDataError && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
            color: "var(--accent-red, #ef4444)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {formDataError}
        </div>
      )}

      <div className="form-content">
        {/* Top priority fields - always visible */}
        <div className="top-fields-grid">{topFields.map(renderField)}</div>

        {/* Expandable secondary fields */}
        <div
          className={`secondary-fields ${
            isExpanded ? "expanded" : "collapsed"
          }`}
        >
          {isExpanded && (
            <div className="secondary-fields-grid">
              {secondaryFields.map(renderField)}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <div
          style={{
            maxWidth: "65%",
            margin: "auto auto auto 0",
            paddingTop: "1rem",
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              margin: "auto 0",
              fontSize: "1rem",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Astronomical Data Input
          </h2>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          {isExpanded ? "Show Less" : "Show More Fields"}
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddToDataset}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add to Dataset
        </button>
      </div>
    </div>
  );
};

export default AstronomicalDataInput;
