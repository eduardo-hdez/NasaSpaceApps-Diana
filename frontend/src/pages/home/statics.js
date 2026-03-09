export const processDescriptions = [
  {
    title: "Upload",
    text: "Securely ingest TESS light curves or custom mission data with one click.",
  },
  {
    title: "AI Analysis",
    text: "Signal processing and feature extraction run on-edge with adaptive models.",
  },
  {
    title: "Results in 5min",
    text: "Ranked candidates and uncertainty metrics surface instantly for rapid vetting.",
  },
];

export const featureCards = [
  {
    title: "Single Prediction",
    text: "Instant verdicts on candidate events with calibrated confidence scores.",
    icon: "M12 4a1 1 0 0 1 .894.553l1.341 2.682 2.961.43a1 1 0 0 1 .556 1.705l-2.141 2.088.505 2.947a1 1 0 0 1-1.452 1.054L12 14.347l-2.664 1.402a1 1 0 0 1-1.452-1.054l.505-2.947-2.141-2.088a1 1 0 0 1 .556-1.705l2.961-.43 1.341-2.682A1 1 0 0 1 12 4Z",
  },
  {
    title: "Batch Analysis",
    text: "Upload mission archives and retrieve ranked results at constellation scale.",
    icon: "M5 4h3a1 1 0 0 1 1 1v3H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm0 9h3a1 1 0 0 1 1 1v5H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Zm8-9h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-6V5a1 1 0 0 1 1-1Zm0 9h6a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-6v-5a1 1 0 0 1 1-1Z",
  },
  {
    title: "Explainable AI",
    text: "Visual feature attribution highlights why candidates pass vetting.",
    icon: "M5 5h14v14H5zm2 4v6h10V9l-5 3Z",
  },
  {
    title: "Model Transparency",
    text: "Versioned pipelines, audit logs, and reproducible runs for mission assurance.",
    icon: "M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm1 14h-2v-2h2Zm0-4h-2V7h2Z",
  },
];

export const challengeCards = [
  {
    title: "1M light curves per month from TESS",
    text: "Data volume from NASA missions pushes existing workflows beyond human scale.",
    icon: "M20 5H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6l2 3 2-3h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 10H4V7h16Z",
  },
  {
    title: "Manual review takes days",
    text: "Scientists sift through thousands of signals to validate each exoplanet candidate.",
    icon: "M12 3a1 1 0 0 1 1 1v1.07a7.002 7.002 0 0 1 5.657 5.657H20a1 1 0 1 1 0 2h-1.07A7.002 7.002 0 0 1 13 18.93V20a1 1 0 1 1-2 0v-1.07A7.002 7.002 0 0 1 5.343 12.657H4a1 1 0 1 1 0-2h1.07A7.002 7.002 0 0 1 11 5.07V4a1 1 0 0 1 1-1Zm0 4a5 5 0 1 0 5 5 5.006 5.006 0 0 0-5-5Z",
  },
  {
    title: "96% are false positives",
    text: "Instrumental noise mimics planetary transits, wasting valuable telescope time.",
    icon: "M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8Zm3-11.5L10.5 15A1.5 1.5 0 0 1 8.4 13.4l4-5a1.5 1.5 0 1 1 2.4 1.8Z",
  },
];

export const teamMembers = [
  {
    name: "Alex Martinez",
    role: "Astrophysicist & Data Scientist",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60",
  },
  {
    name: "Jordan Lee",
    role: "ML Engineer & Platform Architect",
    photo:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=60",
  },
  {
    name: "Priya Singh",
    role: "Product Lead & UX Researcher",
    photo:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=400&q=60",
  },
];

export const metrics = [
  {
    label: "Recall on NASA Exoplanet Archive benchmarks.",
    target: 96,
    suffix: "%",
  },
  {
    label: "AUC score demonstrating robustness to noise.",
    target: 94.8,
    suffix: "",
  },
  {
    label: "Total training time with GPU acceleration.",
    target: 5,
    suffix: "min",
  },
];

export const techPills = [
  "TSFRESH Feature Engineering",
  "LightGBM Classifier",
  "96% Recall on Validation",
];
