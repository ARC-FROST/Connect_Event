import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import socket from "../services/socket";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  // FETCH EVENT
  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);
      setEvent(res.data.event);
    } catch (err) {
      console.log("Error loading event:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // FETCH COMMENTS
  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${id}`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.log("Error loading comments:", err.message);
    }
  };

  // INIT + SOCKET
  useEffect(() => {
    fetchEvent();
    fetchComments();

    socket.emit("join-event", id);

    const handleNewComment = (data) => {
      setComments((prev) => {
        const exists = prev.find((c) => c._id === data.comment._id);
        if (exists) return prev;
        return [data.comment, ...prev];
      });
    };

    socket.on("new-comment", handleNewComment);

    return () => {
      socket.off("new-comment", handleNewComment);
    };
  }, [id]);

  // SEND COMMENT
  const sendComment = async () => {
    if (!text.trim()) return;

    try {
      const res = await API.post(`/comments/${id}`, { text });
      setComments((prev) => [res.data.comment, ...prev]);
      setText("");
    } catch (err) {
      console.log("Comment error:", err.message);
    }
  };
  // DOWNLOAD MEDIA
const handleDownload = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch media");
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;

    const filename =
      url.split("/").pop().split("?")[0] || "media";

    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.log("Download error:", err.message);
    alert("Download failed");
  }
};

  // LOADING
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div>
        <Navbar />
        <div className="container">Event not found</div>
      </div>
    );
  }
  const downloadImage = (mediaId) => {
  const link = document.createElement("a");

  link.href =
    `${import.meta.env.VITE_API_URL}/media/download/${mediaId}`;

  link.download = "event-photo.jpg";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div>
      <Navbar />

      <div className="container">

        {/* BACK BUTTON */}
        <button
          className="btn"
          style={{ marginBottom: "15px" }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* COVER IMAGE */}
        {event.coverImage && (
          <img
            src={event.coverImage}
            alt={event.title}
            className="event-detail-cover"
          />
        )}

        {/* TITLE HEADER */}
        <div className="flex-between">
          <h1>{event.title}</h1>
          <span className="badge">{event.category}</span>
        </div>

        <p className="muted">{event.description}</p>

        {/* INFO GRID */}
        <div className="info-grid">
          <div className="info-box">
            📍 <b>Location</b>
            <p>{event.location || "Not specified"}</p>
          </div>

          <div className="info-box">
            📅 <b>Date</b>
            <p>{new Date(event.date).toDateString()}</p>
          </div>

          <div className="info-box">
            👤 <b>Organizer</b>
            <p>{event.createdBy?.name}</p>
          </div>

          <div className="info-box">
            📌 <b>Status</b>
            <p className="status">{event.status}</p>
          </div>
        </div>

        {/* EVENT MEDIA GALLERY*/}
        <div className="card" style={{ marginTop: "20px" }}>
          <h3>📸 Event Photos</h3>

          {!event.media || event.media.length === 0 ? (
            <p className="muted">No media uploaded yet</p>
          ) : (
           <div className="gallery-grid">
  {event.media.map((m) => (
  <div
  key={m._id}
  className="gallery-item"
  style={{
    position: "relative",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    background: "#fff",
  }}
>
  <img
    src={m.mediaUrl}
    alt="event media"
    style={{
      width: "100%",
      borderRadius: "8px",
    }}
  />

  {/* AI TAGS */}
  {m.tags && m.tags.length > 0 && (
    <div
      style={{
        marginTop: "10px",
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
      }}
    >
      {m.tags.map((tag, index) => (
        <span
          key={index}
          style={{
            background: "#e3f2fd",
            color: "#1976d2",
            padding: "4px 8px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          #{tag}
        </span>
      ))}
    </div>
  )}

  <button
    className="btn"
    style={{ marginTop: "10px" }}
    onClick={() => downloadImage(m._id)}
  >
    ⬇ Download
  </button>
</div>
))}
</div>
          )}
        </div>

        {/* COMMENTS */}
        <div className="card" style={{ marginTop: "20px" }}>
          <h3>💬 Comments</h3>

          <div className="comment-box">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
            />

            <button className="btn" onClick={sendComment}>
              Send
            </button>
          </div>

          <div style={{ marginTop: "15px" }}>
            {comments.map((c) => (
              <div key={c._id} className="comment">
                <b>{c.user?.name}</b>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default EventDetails;