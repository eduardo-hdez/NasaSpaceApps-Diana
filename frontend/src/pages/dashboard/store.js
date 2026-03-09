import { configureStore, createSlice } from "@reduxjs/toolkit";

const dashboardStoreSlice = createSlice({
  name: "dashboardStore",
  initialState: {
    // Active model selection
    activeModel: "tess", // "tess" or "kepler"

    // Field definitions for TESS model
    tessFormFields: [
      {
        key: "pl_radeerr1",
        label: "Transit Midpoint",
        step: "0.0001",
        required: true,
      },
      { key: "st_rad", label: "Star Radius", step: "0.01", required: true },
      {
        key: "pl_orbper",
        label: "Orbital Period",
        step: "0.01",
        required: true,
      },
      { key: "st_dist", label: "Star Distance", step: "0.1", required: true },
      {
        key: "st_disterr2",
        label: "Star Distance Error Lower",
        step: "0.1",
        required: false,
      },
      {
        key: "pl_trandep",
        label: "Transit Depth",
        step: "0.001",
        required: true,
      },
      { key: "pl_rade", label: "Planet Radius", step: "0.01", required: true },
      {
        key: "st_pmra",
        label: "Star Angular Motion",
        step: "0.01",
        required: false,
      },
      {
        key: "pl_orbpererr2",
        label: "Orbit Period Error Lower",
        step: "0.01",
        required: false,
      },
      {
        key: "pl_tranmiderr",
        label: "Transit Midpoint Uncertainty Lower",
        step: "0.01",
        required: false,
      },
      {
        key: "pl_tranmid",
        label: "Transit Midpoint Time",
        step: "0.1",
        required: true,
      },
      { key: "pl_eqt", label: "Equilibrium Temp", step: "1", required: true },
      { key: "st_tmag", label: "Star Brightness", step: "0.1", required: true },
      { key: "starTemp", label: "Star Temp", step: "1", required: true },
      {
        key: "pl_trandeperr1",
        label: "Transit Depth Error Upper",
        step: "0.1",
        required: false,
      },
      {
        key: "pl_trandeperr2",
        label: "Transit Depth Error Lower",
        step: "0.1",
        required: false,
      },
      {
        key: "pl_orbpererr1",
        label: "Orbit Period Error Upper",
        step: "0.01",
        required: false,
      },
      { key: "st_logg", label: "Surface Gravity", step: "0.1", required: true },
      {
        key: "pl_insol",
        label: "Stellar Irradiance",
        step: "0.1",
        required: true,
      },
      {
        key: "st_tefferr2",
        label: "Temp Error Lower",
        step: "0.1",
        required: false,
      },
      {
        key: "st_teff",
        label: "Effective Star Temp",
        step: "0.1",
        required: true,
      },
      {
        key: "st_disterr1",
        label: "Star Distance Error Upper",
        step: "0.1",
        required: false,
      },
      {
        key: "pl_trandurh",
        label: "Transit Duration",
        step: "0.1",
        required: true,
      },
      {
        key: "pl_trandurherr1",
        label: "Transit Duration Error",
        step: "0.1",
        required: false,
      },
      {
        key: "pl_tranmiderr1",
        label: "Transit Midpoint Error Upper",
        step: "0.1",
        required: false,
      },
    ],

    // Field definitions for Kepler model
    keplerFormFields: [
      {
        key: "koi_fpflag_nt",
        label: "Not Transit-Like Flag",
        step: "1",
        required: true,
      },
      {
        key: "koi_score",
        label: "Disposition Score",
        step: "0.01",
        required: true,
      },
      {
        key: "koi_period",
        label: "Orbital Period",
        step: "0.01",
        required: true,
      },
      {
        key: "koi_dikco_msky",
        label: "Diff Image Sky Offset",
        step: "0.01",
        required: false,
      },
      {
        key: "koi_fpflag_co",
        label: "Centroid Offset Flag",
        step: "1",
        required: false,
      },
      {
        key: "koi_fpflag_ss",
        label: "Stellar Eclipse Flag",
        step: "1",
        required: false,
      },
      {
        key: "koi_num_transits",
        label: "Number of Transits",
        step: "1",
        required: true,
      },
      { key: "koi_count", label: "KOI Count", step: "1", required: false },
      {
        key: "koi_steff_err1",
        label: "Stellar Temp Error Upper",
        step: "1",
        required: false,
      },
      {
        key: "koi_fpflag_ec",
        label: "Ephemeris Match Flag",
        step: "1",
        required: false,
      },
      {
        key: "koi_srho_err2",
        label: "Stellar Density Error Lower",
        step: "0.01",
        required: false,
      },
      { key: "kepid", label: "Kepler ID", step: "1", required: true },
      {
        key: "koi_fwm_sdeco",
        label: "FW Stat Depth Offset",
        step: "0.01",
        required: false,
      },
      {
        key: "koi_depth",
        label: "Transit Depth",
        step: "0.01",
        required: true,
      },
      {
        key: "koi_dikco_mra_err",
        label: "RA Offset Error",
        step: "0.01",
        required: false,
      },
      {
        key: "koi_fwm_stat_sig",
        label: "FW Stat Significance",
        step: "0.01",
        required: false,
      },
    ],

    // Current form values for TESS (with default values)
    tessFormValues: {
      pl_radeerr1: 0.0,
      st_rad: 1.0,
      pl_orbper: 10.0,
      st_dist: 100.0,
      st_disterr2: 0.0,
      pl_trandep: 0.01,
      pl_rade: 1.0,
      st_pmra: 0.0,
      pl_orbpererr2: 0.0,
      pl_tranmiderr: 0.0,
      pl_tranmid: 2450000.0,
      pl_eqt: 300,
      st_tmag: 10.0,
      starTemp: 5500,
      pl_trandeperr1: 0.0,
      pl_trandeperr2: 0.0,
      pl_orbpererr1: 0.0,
      st_logg: 4.5,
      pl_insol: 1.0,
      st_tefferr2: 0.0,
      st_teff: 5500,
      st_disterr1: 0.0,
      pl_trandurh: 3.0,
      pl_trandurherr1: 0.0,
      pl_tranmiderr1: 0.0,
    },

    // Current form values for Kepler (with default values)
    keplerFormValues: {
      koi_fpflag_nt: 0,
      koi_score: 0.5,
      koi_period: 10.0,
      koi_dikco_msky: 0.0,
      koi_fpflag_co: 0,
      koi_fpflag_ss: 0,
      koi_num_transits: 10,
      koi_count: 1,
      koi_steff_err1: 0.0,
      koi_fpflag_ec: 0,
      koi_srho_err2: 0.0,
      kepid: 10000000,
      koi_fwm_sdeco: 0.0,
      koi_depth: 100.0,
      koi_dikco_mra_err: 0.0,
      koi_fwm_stat_sig: 0.0,
    },

    // Available datasets from backend
    availableDatasets: [
      {
        id: "kepler",
        name: "Kepler",
        description: "Kepler mission exoplanet data",
      },
      {
        id: "k2",
        name: "K2",
        description: "K2 mission extended data",
      },
      {
        id: "tess",
        name: "TESS",
        description: "TESS mission exoplanet data",
      },
    ],

    // Currently selected/loaded dataset ID
    selectedDataset: "",

    // The working dataset (array of observation objects)
    dataset: [],

    // Track which observation is selected for single analysis (index in dataset array)
    selectedObservationIndex: null,

    // Results from backend analysis
    analyzedDataset: null, // Full dataset with classifications OR single observation
    analysisResult: null, // Summary statistics (batch) OR detailed explanation (single)
    analysisType: null, // "single" or "batch" - helps Results component know what to display

    // Loading states
    isLoadingDatasets: false,
    isUploading: false,
    isAnalyzing: false,

    // Error states
    formDataError: "",
    datasetTableError: "",
    csvUploadError: "",
    resultsError: "",

    // Hyperparameters (shared by both models)
    hyperparameters: {
      bagging_fraction: 0.8,
      feature_fraction: 0.8,
      lambda_l1: 0.0,
      lambda_l2: 0.0,
      learning_rate: 0.05,
      max_depth: 10,
      min_child_samples: 20,
      n_estimators: 300,
      num_leaves: 63,
    },
  },
  reducers: {
    // Model selection
    setActiveModel: (state, action) => {
      state.activeModel = action.payload;
    },

    // Form management
    setFormValues: (state, action) => {
      if (state.activeModel === "kepler") {
        state.keplerFormValues = action.payload;
      } else {
        state.tessFormValues = action.payload;
      }
    },
    updateFormValue: (state, action) => {
      const { key, value } = action.payload;
      if (state.activeModel === "kepler") {
        state.keplerFormValues[key] = value;
      } else {
        state.tessFormValues[key] = value;
      }
    },

    // Dataset management
    setAvailableDatasets: (state, action) => {
      state.availableDatasets = action.payload;
    },
    setSelectedDataset: (state, action) => {
      state.selectedDataset = action.payload;
    },
    setDataset: (state, action) => {
      state.dataset = action.payload;
    },
    addObservationToDataset: (state, action) => {
      state.dataset.push(action.payload);
    },
    removeObservationFromDataset: (state, action) => {
      state.dataset.splice(action.payload, 1);
      // Reset selected index if it was the removed item
      if (state.selectedObservationIndex === action.payload) {
        state.selectedObservationIndex = null;
      }
    },
    clearDataset: (state) => {
      state.dataset = [];
      state.selectedObservationIndex = null;
      state.analyzedDataset = null;
      state.analysisResult = null;
      state.analysisType = null;
    },

    // Observation selection
    setSelectedObservationIndex: (state, action) => {
      state.selectedObservationIndex = action.payload;
    },

    // Analysis results
    setAnalyzedDataset: (state, action) => {
      state.analyzedDataset = action.payload;
    },
    setAnalysisResult: (state, action) => {
      state.analysisResult = action.payload;
    },
    setAnalysisType: (state, action) => {
      state.analysisType = action.payload;
    },

    // Loading states
    setIsLoadingDatasets: (state, action) => {
      state.isLoadingDatasets = action.payload;
    },
    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setIsAnalyzing: (state, action) => {
      state.isAnalyzing = action.payload;
    },

    // Error states
    setFormDataError: (state, action) => {
      state.formDataError = action.payload;
    },
    setDatasetTableError: (state, action) => {
      state.datasetTableError = action.payload;
    },
    setCsvUploadError: (state, action) => {
      state.csvUploadError = action.payload;
    },
    setResultsError: (state, action) => {
      state.resultsError = action.payload;
    },
    clearErrors: (state) => {
      state.formDataError = "";
      state.datasetTableError = "";
      state.csvUploadError = "";
      state.resultsError = "";
    },

    // Hyperparameters management
    setHyperparameters: (state, action) => {
      state.hyperparameters = action.payload;
    },
    resetAll: (state) => {
      return {
        ...state,
        dataset: [],
        selectedObservationIndex: null,
        analyzedDataset: null,
        analysisResult: null,
        analysisType: null,
        selectedDataset: "",
        formDataError: "",
        datasetTableError: "",
        csvUploadError: "",
        resultsError: "",
      };
    },
  },
});

export const {
  setActiveModel,
  setFormValues,
  updateFormValue,
  setAvailableDatasets,
  setIsLoadingDatasets,
  setSelectedDataset,
  setDataset,
  addObservationToDataset,
  removeObservationFromDataset,
  clearDataset,
  setSelectedObservationIndex,
  setAnalysisResult,
  setAnalyzedDataset,
  setAnalysisType,
  setFormDataError,
  setDatasetTableError,
  setCsvUploadError,
  setResultsError,
  clearErrors,
  setIsUploading,
  setIsAnalyzing,
  setHyperparameters,
  resetAll,
} = dashboardStoreSlice.actions;

export const createDashboardStore = () =>
  configureStore({
    reducer: { dashboardStore: dashboardStoreSlice.reducer },
  });

export default dashboardStoreSlice.reducer;
