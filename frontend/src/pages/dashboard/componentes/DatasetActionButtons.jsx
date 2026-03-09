import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setDataset,
  setSelectedDataset,
  setIsLoadingDatasets,
  setIsUploading,
  setIsAnalyzing,
  setAnalyzedDataset,
  setAnalysisResult,
  setAnalysisType,
  setDatasetTableError,
  setCsvUploadError,
  clearErrors,
  setActiveModel,
} from "../store";
import HyperparametersModal from "./HyperparametersModal";
import ModelSelector from "./ModelSelector";

const DatasetActionButtons = () => {
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showHyperparametersModal, setShowHyperparametersModal] =
    useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const datasets = useSelector(
    (state) => state.dashboardStore.availableDatasets
  );
  const selectedDataset = useSelector(
    (state) => state.dashboardStore.selectedDataset
  );
  const isLoadingDatasets = useSelector(
    (state) => state.dashboardStore.isLoadingDatasets
  );
  const isUploading = useSelector((state) => state.dashboardStore.isUploading);
  const hyperparameters = useSelector(
    (state) => state.dashboardStore.hyperparameters
  );
  const activeModel = useSelector((state) => state.dashboardStore.activeModel);

  const handleSelectDataset = async (datasetId) => {
    dispatch(setIsLoadingDatasets(true));
    dispatch(clearErrors());
    dispatch(setSelectedDataset(datasetId));
    setShowDropdown(false);

    // Auto-switch model based on dataset
    if (datasetId === "kepler" || datasetId === "k2") {
      dispatch(setActiveModel("kepler"));
    } else if (datasetId === "tess") {
      dispatch(setActiveModel("tess"));
    }

    try {
      const response = await fetch(
        `http://localhost:8000/select-dataset/${datasetId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Load all rows (clean datasets already have classification)
        const loadedData = result.data;
        dispatch(setDataset(loadedData));

        // Auto-analyze the loaded dataset
        dispatch(setIsAnalyzing(true));
        try {
          const analyzeResponse = await fetch(
            "http://localhost:8000/analyze-dataset",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                observations: loadedData,
                hyperparameters: hyperparameters,
                model: activeModel,
              }),
            }
          );

          if (analyzeResponse.ok) {
            const analyzeResult = await analyzeResponse.json();
            dispatch(setAnalyzedDataset(analyzeResult.analyzed_data));
            dispatch(
              setAnalysisResult({
                summary: analyzeResult.summary,
                model_metrics: analyzeResult.model_metrics,
              })
            );
            dispatch(setAnalysisType("batch"));
          }
        } catch (analyzeErr) {
          console.error("Auto-analysis failed:", analyzeErr);
        } finally {
          dispatch(setIsAnalyzing(false));
        }
      } else {
        dispatch(
          setDatasetTableError("Failed to load dataset. Please try again.")
        );
      }
    } catch (err) {
      dispatch(setDatasetTableError(`Error loading dataset: ${err.message}`));
    } finally {
      dispatch(setIsLoadingDatasets(false));
    }
  };

  const handleCSVUpload = async (file) => {
    if (file && file.type === "text/csv") {
      dispatch(setIsUploading(true));
      dispatch(clearErrors());

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csv = e.target.result;
          const lines = csv.split("\n").filter((line) => line.trim() !== "");

          if (lines.length < 2) {
            dispatch(setCsvUploadError("CSV file is empty or invalid."));
            dispatch(setIsUploading(false));
            return;
          }

          const headers = lines[0].split(",").map((h) => h.trim());

          // Parse CSV rows
          const parsedData = [];
          for (let i = 1; i < Math.min(lines.length, 11); i++) {
            // Take max 10 rows
            const values = lines[i].split(",").map((v) => v.trim());
            const row = {};

            headers.forEach((header, index) => {
              const key = header.toLowerCase().replace(/\s+/g, "_");
              const value = values[index];
              // Try to parse as number, otherwise keep as string
              row[key] =
                !isNaN(value) && value !== "" ? parseFloat(value) : value;
            });

            parsedData.push(row);
          }

          dispatch(setDataset(parsedData));
          dispatch(setSelectedDataset("csv-upload"));
        } catch (err) {
          dispatch(setCsvUploadError(`Error parsing CSV file: ${err.message}`));
        } finally {
          dispatch(setIsUploading(false));
        }
      };
      reader.readAsText(file);
    } else {
      dispatch(setCsvUploadError("Please select a valid CSV file."));
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  };

  const handleButtonClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleCSVUpload(file);
    }
    // Reset input so same file can be uploaded again
    event.target.value = "";
  };

  return (
    <div className="dataset-action-buttons">
      <div className="top-row">
        {/* Choose Dataset Button with Dropdown */}
        <div className="dropdown-container" ref={dropdownRef}>
          <button
            className="btn btn-secondary dataset-btn"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleButtonClick}
            disabled={isLoadingDatasets}
          >
            {isLoadingDatasets ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    marginRight: "0.5rem",
                    animation: "spin 1s linear infinite",
                  }}
                >
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ marginRight: "0.5rem" }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Choose Dataset
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    marginLeft: "0.5rem",
                    transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <polyline points="6,9 12,15 18,9" />
                </svg>
              </>
            )}
          </button>

          {showDropdown && (
            <div
              className="dataset-dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className={`dataset-option ${
                    selectedDataset === dataset.id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectDataset(dataset.id)}
                >
                  <div className="dataset-info">
                    <h4>{dataset.name}</h4>
                    <p>{dataset.description}</p>
                  </div>
                  {selectedDataset === dataset.id && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 11l3 3L22 4" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Import CSV Button */}
        <label className="btn btn-secondary csv-upload-btn">
          {isUploading ? (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  marginRight: "0.5rem",
                  animation: "spin 1s linear infinite",
                }}
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginRight: "0.5rem" }}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
              Import CSV
            </>
          )}
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Model Selector - Bottom Row */}
      <div style={{ flexShrink: 0 }}>
        <ModelSelector />
      </div>

      {/* Advanced Options Button - Bottom Row */}
      <button
        className="btn btn-secondary settings-btn"
        onClick={() => setShowHyperparametersModal(true)}
        title="Model Hyperparameters"
      >
        <svg
          width="18"
          height="47"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ marginRight: "0.5rem" }}
        >
          <path d="M12 20v-6M6 20V10m12 10V4" />
          <circle cx="6" cy="8" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="18" cy="2" r="2" />
        </svg>
        Model Hyperparameters
      </button>

      {/* Hyperparameters Modal */}
      <HyperparametersModal
        isOpen={showHyperparametersModal}
        onClose={() => setShowHyperparametersModal(false)}
      />

      <style jsx>{`
        .dataset-action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          height: 100%;
          justify-content: flex-start;
        }

        .top-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-shrink: 0;
        }

        .dropdown-container {
          position: relative;
        }

        .dataset-btn,
        .csv-upload-btn,
        .settings-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.2rem 1.5rem;
          border-radius: var(--radius-button);
          border: 1px solid var(--glass-border);
          background: rgba(26, 31, 58, 0.5);
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          white-space: nowrap;
          height: auto;
          min-height: 60px;
        }

        .settings-btn {
          width: 100%;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dataset-btn:hover,
        .csv-upload-btn:hover,
        .settings-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: var(--accent-blue);
          /* Removed transform for better performance */
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .dataset-btn:disabled,
        .csv-upload-btn:disabled,
        .settings-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dataset-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.25rem;
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-card);
          backdrop-filter: blur(18px);
          box-shadow: var(--shadow);
          min-width: 280px;
          z-index: 1000;
          overflow: hidden;
          animation: fadeIn 0.2s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .dataset-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 1px solid var(--glass-border);
        }

        .dataset-option:last-child {
          border-bottom: none;
        }

        .dataset-option:hover {
          background: rgba(59, 130, 246, 0.1);
        }

        .dataset-option.selected {
          background: rgba(16, 185, 129, 0.1);
          border-left: 3px solid var(--accent-green);
        }

        .dataset-info h4 {
          margin: 0 0 0.25rem 0;
          color: var(--text-primary);
          font-size: 1rem;
          font-weight: 600;
        }

        .dataset-info p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .dataset-action-buttons {
            height: auto;
            justify-content: flex-start;
          }

          .top-row {
            flex-direction: column;
            width: 100%;
            flex: none;
          }

          .dataset-btn,
          .csv-upload-btn {
            width: 100%;
            justify-content: center;
            flex: none;
            min-height: 50px;
          }

          .dataset-dropdown {
            left: 0;
            right: 0;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default DatasetActionButtons;
