import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import VideoDetail from "./pages/VideoDetail";
import "./index.css";
import BasicLayout from "./components/BasicLayout";
import ShortDetail from "./pages/ShortDetail";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <BasicLayout>
                            <Home />
                        </BasicLayout>
                    }
                />
                <Route
                    path="/video/:id"
                    element={
                        <BasicLayout>
                            <VideoDetail />
                        </BasicLayout>
                    }
                />
                <Route
                    path="/shorts/:id"
                    element={
                        <BasicLayout>
                            <ShortDetail />
                        </BasicLayout>
                    }
                />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
