import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeObservationFromDataset,
  clearDataset,
  setSelectedObservationIndex,
  setIsAnalyzing,
  setAnalyzedDataset,
  setAnalysisResult,
  setAnalysisType,
  setDatasetTableError,
  clearErrors,
} from "../store";

function DatasetTable() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const dataset = useSelector((state) => state.dashboardStore.dataset);
  const activeModel = useSelector((state) => state.dashboardStore.activeModel);
  const tessFormFields = useSelector(
    (state) => state.dashboardStore.tessFormFields
  );
  const keplerFormFields = useSelector(
    (state) => state.dashboardStore.keplerFormFields
  );
  const isAnalyzing = useSelector((state) => state.dashboardStore.isAnalyzing);
  const datasetTableError = useSelector(
    (state) => state.dashboardStore.datasetTableError
  );
  const selectedObservationIndex = useSelector(
    (state) => state.dashboardStore.selectedObservationIndex
  );
  const hyperparameters = useSelector(
    (state) => state.dashboardStore.hyperparameters
  );

  // Get current fields based on active model
  const formFields =
    activeModel === "kepler" ? keplerFormFields : tessFormFields;

  const ROWS_PER_PAGE = 10; // Show more rows
  const totalPages = Math.ceil(dataset.length / ROWS_PER_PAGE);
  const startIndex = currentPage * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentRows = dataset.slice(startIndex, endIndex);

  // Get top 6 fields for display (excluding classification which will be first)
  const displayFields = formFields.slice(0, 6);

  const handleRowClick = (index) => {
    const actualIndex = startIndex + index;
    // Just select the row, don't analyze yet
    dispatch(setSelectedObservationIndex(actualIndex));
  };

  const handleAnalyzeObservation = async () => {
    if (selectedObservationIndex === null) return;

    dispatch(setIsAnalyzing(true));
    dispatch(clearErrors());

    try {
      const observation = dataset[selectedObservationIndex];
      const response = await fetch(
        "http://localhost:8000/analyze-observation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            observation: observation,
            hyperparameters: hyperparameters,
            model: activeModel,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        dispatch(setAnalyzedDataset([{ ...observation, ...result }]));
        dispatch(setAnalysisResult(result));
        dispatch(setAnalysisType("single"));
      } else {
        dispatch(
          setDatasetTableError(
            "Failed to analyze observation. Please try again."
          )
        );
      }
    } catch (err) {
      dispatch(setDatasetTableError(`Analysis failed: ${err.message}`));
    } finally {
      dispatch(setIsAnalyzing(false));
    }
  };

  const handleAnalyzeDataset = async () => {
    dispatch(setIsAnalyzing(true));
    dispatch(clearErrors());

    try {
      const response = await fetch("http://localhost:8000/analyze-dataset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          observations: dataset,
          hyperparameters: hyperparameters,
          model: activeModel,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        dispatch(setAnalyzedDataset(result.analyzed_data));
        dispatch(
          setAnalysisResult({
            summary: result.summary,
            model_metrics: result.model_metrics,
          })
        );
        dispatch(setAnalysisType("batch"));
      } else {
        dispatch(
          setDatasetTableError("Failed to analyze dataset. Please try again.")
        );
      }
    } catch (err) {
      dispatch(setDatasetTableError(`Analysis failed: ${err.message}`));
    } finally {
      dispatch(setIsAnalyzing(false));
    }
  };

  const handleDeleteRow = (index, event) => {
    event.stopPropagation(); // Prevent row selection
    const actualIndex = startIndex + index;
    dispatch(removeObservationFromDataset(actualIndex));

    // Adjust current page if needed
    if (currentRows.length === 1 && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClearAll = () => {
    dispatch(clearDataset());
    setCurrentPage(0);
    setShowClearConfirm(false);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getClassificationLabel = (classification) => {
    const labels = {
      0: "Non-Planet",
      1: "Ambiguous",
      2: "Candidate",
      3: "Confirmed",
    };
    return labels[classification] || "-";
  };

  const getClassificationColor = (classification) => {
    const colors = {
      0: "#6b7280",
      1: "#f59e0b",
      2: "#3b82f6",
      3: "#10b981",
    };
    return colors[classification] || "#6b7280";
  };

  return (
    <div
      className="glass-card"
      style={{
        // flexBasis: "70%",
        // maxWidth: "70%",
        minWidth: 0,
        overflow: "hidden",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
          Dataset Preview
        </h2>

        {dataset.length > 0 && (
          <button
            className="btn btn-secondary"
            onClick={() => setShowClearConfirm(true)}
            style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Error notification */}
      {datasetTableError && (
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
            maxWidth: "100%",
            overflowX: "scroll",
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
          {datasetTableError}
        </div>
      )}

      {/* Clear confirmation dialog */}
      {showClearConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "400px",
              border: "1px solid var(--glass-border)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Clear All Observations?</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              This will remove all {dataset.length} observation(s) from the
              dataset. This action cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleClearAll}
                style={{ backgroundColor: "var(--accent-red, #ef4444)" }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {dataset.length > 0 ? (
        <>
          <div
            style={{
              marginBottom: "1rem",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            Showing {startIndex + 1}-{Math.min(endIndex, dataset.length)} of{" "}
            {dataset.length} observation(s)
          </div>

          {/* Table with max width and horizontal scroll */}
          <div
            style={{
              overflowX: "auto",
              marginBottom: "1rem",
              maxWidth: "100%",
              border: "1px solid var(--glass-border)",
              borderRadius: "8px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "800px", // Ensure table has minimum width
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      borderBottom: "2px solid var(--glass-border)",
                      position: "sticky",
                      left: 0,
                      background: "var(--bg-card)",
                      zIndex: 1,
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      borderBottom: "2px solid var(--glass-border)",
                      minWidth: "120px",
                    }}
                  >
                    Classification
                  </th>
                  {displayFields.map((field) => (
                    <th
                      key={field.key}
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        borderBottom: "2px solid var(--glass-border)",
                        minWidth: "100px",
                      }}
                    >
                      {field.label}
                    </th>
                  ))}
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "center",
                      borderBottom: "2px solid var(--glass-border)",
                    }}
                  >
                    ...
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "center",
                      borderBottom: "2px solid var(--glass-border)",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, index) => {
                  const actualIndex = startIndex + index;
                  const isSelected = selectedObservationIndex === actualIndex;
                  return (
                    <tr
                      key={actualIndex}
                      onClick={() => handleRowClick(index)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: isSelected
                          ? "rgba(59, 130, 246, 0.15)"
                          : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected)
                          e.currentTarget.style.backgroundColor =
                            "rgba(255, 255, 255, 0.03)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected)
                          e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: "0.75rem",
                          borderBottom: "1px solid var(--glass-border)",
                          position: "sticky",
                          left: 0,
                          background: isSelected
                            ? "rgba(59, 130, 246, 0.15)"
                            : "var(--bg-card)",
                          zIndex: 1,
                        }}
                      >
                        {actualIndex + 1}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem",
                          borderBottom: "1px solid var(--glass-border)",
                        }}
                      >
                        {row.classification !== undefined ? (
                          <span
                            style={{
                              padding: "0.25rem 0.75rem",
                              borderRadius: "12px",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              backgroundColor: `${getClassificationColor(
                                row.classification
                              )}20`,
                              color: getClassificationColor(row.classification),
                              border: `1px solid ${getClassificationColor(
                                row.classification
                              )}40`,
                            }}
                          >
                            {getClassificationLabel(row.classification)}
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "var(--text-secondary)",
                              fontSize: "0.85rem",
                            }}
                          >
                            Not analyzed
                          </span>
                        )}
                      </td>
                      {displayFields.map((field) => (
                        <td
                          key={field.key}
                          style={{
                            padding: "0.75rem",
                            borderBottom: "1px solid var(--glass-border)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {typeof row[field.key] === "number"
                            ? row[field.key].toFixed(3)
                            : row[field.key] || "-"}
                        </td>
                      ))}
                      <td
                        style={{
                          padding: "0.75rem",
                          textAlign: "center",
                          borderBottom: "1px solid var(--glass-border)",
                        }}
                      >
                        ...
                      </td>
                      <td
                        style={{
                          padding: "0.75rem",
                          textAlign: "center",
                          borderBottom: "1px solid var(--glass-border)",
                        }}
                      >
                        <button
                          onClick={(e) => handleDeleteRow(index, e)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--accent-red, #ef4444)",
                            padding: "0.25rem",
                          }}
                          title="Delete observation"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
                style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}
              >
                First
              </button>
              <button
                className="btn btn-secondary"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}
              >
                Previous
              </button>
              <span
                style={{
                  padding: "0.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  color: "var(--text-secondary)",
                }}
              >
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}
              >
                Next
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
                style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}
              >
                Last
              </button>
            </div>
          )}

          {/* Analysis Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            {/* Analyze Observation Button - only show if row is selected */}
            {selectedObservationIndex !== null && (
              <button
                className="btn btn-secondary"
                onClick={handleAnalyzeObservation}
                disabled={isAnalyzing}
                style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}
              >
                {isAnalyzing ? (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ animation: "spin 1s linear infinite" }}
                    >
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    Analyze Observation
                  </>
                )}
              </button>
            )}

            {/* Analyze Dataset Button */}
            <button
              className="btn btn-primary"
              onClick={handleAnalyzeDataset}
              disabled={isAnalyzing || dataset.length === 0}
              style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}
            >
              {isAnalyzing ? (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ animation: "spin 1s linear infinite" }}
                  >
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                  Analyze Dataset
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div
          className="preview-placeholder"
          style={{
            textAlign: "center",
            padding: "3rem 1rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
          <h3
            style={{
              margin: "1rem 0 0.5rem 0",
              color: "var(--text-primary)",
            }}
          >
            No Observations Yet
          </h3>
          <p
            style={{
              color: "var(--text-secondary)",
              textAlign: "center",
              margin: 0,
            }}
          >
            Add observations using the form above or load a dataset to get
            started.
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default DatasetTable;
