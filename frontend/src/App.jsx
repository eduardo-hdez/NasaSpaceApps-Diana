import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/home/index";
import Explore from "./pages/explore/index";
import Dashboard from "./pages/dashboard/index";
import GetStarted from "./pages/walkthrough/GetStarted";
import ChooseModel from "./pages/walkthrough/ChooseModel";
import EnterData from "./pages/walkthrough/EnterData";
import SelectDataset from "./pages/walkthrough/SelectDataset";
import { createDashboardStore } from "./pages/dashboard/store";
import { Provider } from "react-redux";

const App = () => {
  const dashboardStore = createDashboardStore()
  
  return (
    <Router>
      <Provider store={dashboardStore}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/walkthrough/get-started" element={<GetStarted />} />
          <Route path="/walkthrough/choose-model" element={<ChooseModel />} />
          <Route path="/walkthrough/enter-data" element={<EnterData />} />
          <Route path="/walkthrough/select-dataset" element={<SelectDataset />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Provider>
    </Router>
  );
};

export default App;
