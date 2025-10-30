import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme-provider";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { ComponentShowcase } from "./components/component-showcase";

export function App() {
    return (
        <ThemeProvider defaultTheme="light">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/showcase" element={<ComponentShowcase />} />
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </Router>
        </ThemeProvider>
    )
}