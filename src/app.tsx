import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VehicleList from "@/pages/Vehicles/VehicleList";
import UserList from "@/pages/Users";
import InstitutionList from "@/pages/Institutions";
import { ComponentShowcase } from "./components/component-showcase";

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Toaster position="top-right" expand={false} richColors />
          <Routes>
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/showcase"
              element={
                <ProtectedRoute>
                  <ComponentShowcase />
                </ProtectedRoute>
              }
            />

            {/* Vehicle Routes */}
            <Route
              path="/vehicles"
              element={
                <ProtectedRoute>
                  <VehicleList />
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UserList />
                </ProtectedRoute>
              }
            />

            {/* Institution Routes */}
            <Route
              path="/universities"
              element={
                <ProtectedRoute>
                  <InstitutionList />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 404 */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}