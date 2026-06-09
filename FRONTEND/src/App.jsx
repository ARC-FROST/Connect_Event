import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import socket from "./services/socket";

import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import UploadMedia from "./pages/UploadMedia";
import MediaGallery from "./pages/MediaGallery";
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditEvent from "./pages/EditEvent";
import ProtectedRoute from "./routes/ProtectedRoute";
import Favorites from "./pages/Favorites";
import SearchPage from "./pages/SearchPage";
import FaceTest from "./pages/FaceTest";
import MyPhotos from "./pages/MyPhotos";

function App() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/gallery" element={<MediaGallery />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/my-photos" element={<MyPhotos />} />
        <Route
  path="/search"
  element={<SearchPage />}
/>
<Route
  path="/face-test"
  element={<FaceTest />}
/>


        {/* PROTECTED ROUTES */}

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadMedia />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<h2>404 - Page Not Found</h2>}
        />
        <Route
  path="/edit-event/:id"
  element={
    <ProtectedRoute>
      <EditEvent />
    </ProtectedRoute>
  }
/>

      </Routes>
    </div>
  );
}

export default App;