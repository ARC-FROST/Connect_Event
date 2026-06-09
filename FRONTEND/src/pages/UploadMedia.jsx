import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function UploadMedia() {
  const [file, setFile] = useState(null);
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState([]);
  const [uploading, setUploading] = useState(false);

  // LOAD EVENTS 
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/events/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setEvents(res.data.events || []);
  } catch (err) {
    console.log("Fetch events error:", err.response?.data || err.message);
  }
};
  // HANDLE UPLOAD
  const handleUpload = async () => {
    if (!file || !eventId) {
      alert("Select file and event");
      return;
    }

    const formData = new FormData();
    formData.append("media", file);
    formData.append("eventId", eventId);

    try {
      setUploading(true);

      const res = await API.post("/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Upload successful 🎉");
      console.log(res.data);
      setFile(null);
    } catch (err) {
      console.log("Upload error:", err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container">
        <h1>📤 Upload Media</h1>

        {/* EVENT SELECT */}
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="input"
        >
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.title}
            </option>
          ))}
        </select>

        {/* FILE INPUT */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="input"
        />

        {/* UPLOAD BUTTON */}
        <button
          className="btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}

export default UploadMedia;