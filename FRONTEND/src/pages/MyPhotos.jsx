import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function MyPhotos() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [searched, setSearched] = useState(false);

  // =========================
  // SEARCH MY PHOTOS
  // =========================
  const handleSearch = async () => {
    if (!file) {
      alert("Please upload your selfie");
      return;
    }

    try {
      setLoading(true);
      setPhotos([]);
      setSearched(true);

      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");

      const res = await API.post("/faces/find", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPhotos(res.data.media || []);
    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
      alert("Face search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container">
        <h2>📸 My Photos (Face Search)</h2>

        {/* UPLOAD SECTION */}
        <div className="card" style={{ marginBottom: "20px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="btn" onClick={handleSearch}>
            🔍 Find My Photos
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <p style={{ textAlign: "center" }}>
            Searching faces...
          </p>
        )}

        {!loading && searched && photos.length === 0 && (
          <p className="muted">
            No photos found yet
          </p>
        )}

        {/* PHOTO GRID */}
        <div className="gallery-grid">
          {photos.map((m) => (
            <div key={m._id} className="gallery-item">
              <img src={m.mediaUrl} alt="matched" />

              <div className="photo-info">
                <p>📌 {m.eventId?.title || "Event"}</p>
                <p className="muted">
                  👤 {m.uploadedBy?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyPhotos;