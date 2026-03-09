import React from "react";
import { useSelector } from "react-redux";

function Results() {
  const analysisResult = useSelector(
    (state) => state.dashboardStore.analysisResult
  );
  const analyzedDataset = useSelector(
    (state) => state.dashboardStore.analyzedDataset
  );
  const analysisType = useSelector(
    (state) => state.dashboardStore.analysisType
  );
  const resultsError = useSelector(
    (state) => state.dashboardStore.resultsError
  );
  const isAnalyzing = useSelector((state) => state.dashboardStore.isAnalyzing);

  const getClassificationLabel = (classification) => {
    const labels = {
      0: "Non-Planet",
      1: "Ambiguous",
      2: "Candidate",
      3: "Confirmed Planet",
    };
    return labels[classification] || "Unknown";
  };

  const getClassificationColor = (classification) => {
    const colors = {
      0: "#6b7280", // gray
      1: "#f59e0b", // yellow
      2: "#3b82f6", // blue
      3: "#10b981", // green
    };
    return colors[classification] || "#6b7280";
  };

  const renderSingleObservationAnalysis = () => {
    if (!analysisResult) return null;

    const classification = analysisResult.classification;
    const confidence = analysisResult.confidence || 0;
    const explanation =
      analysisResult.explanation || "No explanation available.";
    const featureImportance = analysisResult.feature_importance || [];
    const probabilities = analysisResult.probabilities || [];

    return (
      <div className="analysis-results">
        {/* Classification Result */}
        <div
          className="result-card"
          style={{
            backgroundColor: `${getClassificationColor(classification)}15`,
            border: `2px solid ${getClassificationColor(classification)}`,
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            className="result-header"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div className="result-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke={getClassificationColor(classification)}
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <h3
                style={{
                  margin: "0 0 0.25rem 0",
                  color: getClassificationColor(classification),
                }}
              >
                {getClassificationLabel(classification)}
              </h3>
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                Confidence: {(confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Explanation */}
          <div style={{ marginBottom: "1rem" }}>
            <h4 style={{ margin: "0 0 0.5rem 0" }}>Why this classification?</h4>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
              {explanation}
            </p>
          </div>

          {/* Feature Importance */}
          {featureImportance.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <h4 style={{ margin: "0 0 0.5rem 0" }}>
                Key Influencing Features
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {featureImportance.slice(0, 7).map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        minWidth: "150px",
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {feature.name}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "8px",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${feature.importance * 100}%`,
                          height: "100%",
                          backgroundColor:
                            getClassificationColor(classification),
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        minWidth: "50px",
                        textAlign: "right",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {(feature.importance * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Probabilities for all classes */}
          {probabilities.length > 0 && (
            <div>
              <h4 style={{ margin: "0 0 0.5rem 0" }}>
                Classification Probabilities
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {probabilities.map((prob, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "0.75rem",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {getClassificationLabel(index)}
                    </div>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        color: getClassificationColor(index),
                      }}
                    >
                      {(prob * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBatchAnalysis = () => {
    if (!analysisResult) return null;

    const summary = analysisResult.summary || {};
    const modelMetrics = analysisResult.model_metrics || {};

    const total = summary.total || 0;
    const isBinary = summary.is_binary || false;
    
    // For binary classification
    const candidates = summary.candidates || 0;
    const nonPlanets = summary.non_planets || 0;
    
    // For multi-class classification
    const planets = summary.planets || 0;
    const multiCandidates = summary.candidates || 0;
    const ambiguous = summary.ambiguous || 0;

    const avgConfidence = modelMetrics.average_confidence || 0;
    const lowConfidenceCount = modelMetrics.low_confidence_count || 0;
    const highConfidenceCount = modelMetrics.high_confidence_count || 0;

    return (
      <div className="analysis-results">
        {/* Summary Statistics */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem 0" }}>Classification Summary</h3>
          
          {isBinary ? (
            // Binary Classification Display (Clean Datasets)
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: `${getClassificationColor(3)}15`,
                  border: `2px solid ${getClassificationColor(3)}`,
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: getClassificationColor(3),
                  }}
                >
                  {candidates}
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.5rem",
                  }}
                >
                  Possible Candidates
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.25rem",
                  }}
                >
                  {total > 0 ? ((candidates / total) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: `${getClassificationColor(0)}15`,
                  border: `2px solid ${getClassificationColor(0)}`,
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: getClassificationColor(0),
                  }}
                >
                  {nonPlanets}
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.5rem",
                  }}
                >
                  Non-Candidates
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.25rem",
                  }}
                >
                  {total > 0 ? ((nonPlanets / total) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          ) : (
            // Multi-Class Classification Display (Model Predictions)
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: `${getClassificationColor(3)}15`,
                  border: `2px solid ${getClassificationColor(3)}`,
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: getClassificationColor(3),
                  }}
                >
                  {planets}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.25rem",
                  }}
                >
                  Confirmed Planets
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.25rem",
                  }}
                >
                  {total > 0 ? ((planets / total) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div
                style={{
                  padding: "1rem",
                  backgroundColor: `${getClassificationColor(2)}15`,
                  border: `2px solid ${getClassificationColor(2)}`,
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: getClassificationColor(2),
                  }}
                >
                  {multiCandidates}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.25rem",
                  }}
                >
                  Candidates
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.25rem",
                  }}
                >
                  {total > 0 ? ((multiCandidates / total) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div
                style={{
                  padding: "1rem",
                  backgroundColor: `${getClassificationColor(1)}15`,
                  border: `2px solid ${getClassificationColor(1)}`,
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: getClassificationColor(1),
                  }}
                >
                  {ambiguous}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.25rem",
                  }}
                >
                  Ambiguous
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.25rem",
                  }}
                >
                  {total > 0 ? ((ambiguous / total) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div
                style={{
                  padding: "1rem",
                  backgroundColor: `${getClassificationColor(0)}15`,
                  border: `2px solid ${getClassificationColor(0)}`,
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: getClassificationColor(0),
                  }}
                >
                  {nonPlanets}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.25rem",
                  }}
                >
                  Non-Planets
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.25rem",
                  }}
                >
                  {total > 0 ? ((nonPlanets / total) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Model Performance Metrics */}
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ margin: "0 0 1rem 0" }}>Model Performance</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem",
                }}
              >
                Average Confidence
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                {(avgConfidence * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem",
                }}
              >
                High Confidence (≥90%)
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: getClassificationColor(3),
                }}
              >
                {highConfidenceCount}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem",
                }}
              >
                Low Confidence (&lt;70%)
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: getClassificationColor(1),
                }}
              >
                {lowConfidenceCount}
              </div>
            </div>
            {modelMetrics.model_version && (
              <div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Model Version
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                  {modelMetrics.model_version}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Insight */}
        <div
          style={{
            padding: "1rem",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
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
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <strong>Summary</strong>
          </div>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            {isBinary ? (
              <>
                Out of {total} observations analyzed, {candidates} (
                {total > 0 ? ((candidates / total) * 100).toFixed(1) : 0}%) are
                possible exoplanet candidates. The average confidence is{" "}
                {(avgConfidence * 100).toFixed(1)}%.
                {lowConfidenceCount > 0 &&
                  ` ${lowConfidenceCount} observation(s) had low confidence and may require further review.`}
              </>
            ) : (
              <>
                Out of {total} observations analyzed, {planets + multiCandidates} (
                {total > 0
                  ? (((planets + multiCandidates) / total) * 100).toFixed(1)
                  : 0}
                %) are likely planets or candidates. The model showed an average
                confidence of {(avgConfidence * 100).toFixed(1)}%.
                {lowConfidenceCount > 0 &&
                  ` ${lowConfidenceCount} observation(s) had low confidence and may require further review.`}
              </>
            )}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className="glass-card"
      style={{
        flexBasis: "30%",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          marginBottom: "1.5rem",
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
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        Analysis Results
      </h2>

      {/* Error State */}
      {resultsError && (
        <div
          style={{
            padding: "1rem",
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
          {resultsError}
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <svg
            width="48"
            height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
            style={{ animation: "spin 2s linear infinite", margin: "0 auto" }}
                  >
            <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
          <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
            Analyzing data...
          </p>
        </div>
      )}

      {/* Results Display */}
      {!isAnalyzing &&
        analysisResult &&
        analysisType === "single" &&
        renderSingleObservationAnalysis()}
      {!isAnalyzing &&
        analysisResult &&
        analysisType === "batch" &&
        renderBatchAnalysis()}

      {/* Empty State */}
      {!isAnalyzing && !analysisResult && !resultsError && (
        <div
          className="no-results"
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <h3 style={{ margin: "1rem 0 0.5rem 0" }}>No Analysis Results Yet</h3>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            Add observations and click "Analyze Dataset" or click on a row to
            analyze a single observation.
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

export default Results;
