import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PlanDetailsPage } from "./pages/PlanDetailsPage";
import { DestinationPage } from "./pages/DestinationPage";
import { ActivityPage } from "./pages/ActivityPage";
import { ChecklistPage } from "./pages/ChecklistPage";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/plans/:id" element={<PlanDetailsPage />} />
        <Route path="/plans/:id/destinations" element={<DestinationPage />} />
        <Route path="/plans/:id/activities" element={<ActivityPage />} />
        <Route path="/plans/:id/checklist" element={<ChecklistPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
