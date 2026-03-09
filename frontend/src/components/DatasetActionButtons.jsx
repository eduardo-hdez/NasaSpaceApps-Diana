import React, { useState, useRef, useEffect } from "react";

const DatasetActionButtons = ({
  onDatasetSelect,
  onCSVUpload,
  isLoadingDatasets = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const datasets = [
    {
      id: "kepler",
      name: "Kepler",
      description: "Kepler mission exoplanet data",
    },
    { id: "tess", name: "TESS", description: "TESS mission exoplanet data" },
  ];

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
    }, 150); // Small delay before hiding
  };

  const handleDatasetClick = (dataset) => {
    onDatasetSelect(dataset);
    setShowDropdown(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      onCSVUpload(file);
    } else {
      alert("Please select a valid CSV file.");
    }
  };

  return (
    <div className="dataset-action-buttons">
      {/* Choose Dataset Button with Dropdown */}
      <div className="dropdown-container" ref={dropdownRef}>
        <button
          className="btn btn-secondary dataset-btn"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
                  animation: "spin 1s linear infinite",
                  marginRight: "0.5rem",
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
                style={{ marginLeft: "0.5rem" }}
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
                className="dataset-option"
                onClick={() => handleDatasetClick(dataset)}
              >
                <div className="dataset-info">
                  <h4>{dataset.name}</h4>
                  <p>{dataset.description}</p>
                </div>
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Import CSV Button */}
      <label className="btn btn-secondary csv-upload-btn">
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
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </label>

      <style jsx>{`
        .dataset-action-buttons {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .dropdown-container {
          position: relative;
        }

        .dataset-btn,
        .csv-upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1rem;
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
        }

        .dataset-btn:hover,
        .csv-upload-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: var(--accent-blue);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .dataset-btn:disabled,
        .csv-upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
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
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .dataset-action-buttons {
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
          }

          .dataset-btn,
          .csv-upload-btn {
            width: 100%;
            justify-content: center;
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
