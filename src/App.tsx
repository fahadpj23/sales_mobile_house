import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SalesUpload from "./pages/salesUpload";
import Navigation from "./components/navigation";
import DashBoard from "./pages/dashBoard";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          {/* Navigation */}
          <Navigation />

          {/* Main Content */}
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/sales-form" element={<SalesUpload />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
