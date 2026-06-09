import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { getAllEvents } from "../api/eventApi";
import socket from "../services/socket";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingUsers, setFollowingUsers] = useState(new Set());

  const navigate = useNavigate();
  const { user } = useAuth();

  // FETCH EVENTS
  useEffect(() => {
  fetchEvents();
  fetchFollowing(); 

  const handleLikeUpdate = (data) => {
    setEvents((prev) =>
      prev.map((event) =>
        event._id === data.eventId
          ? {
              ...event,
              likes: new Array(data.totalLikes).fill("x"),
            }
          : event
      )
    );
  };

  socket.on("like-updated", handleLikeUpdate);

  return () => {
    socket.off("like-updated", handleLikeUpdate);
  };
}, []);

  useEffect(() => {
    events.forEach((event) => {
      socket.emit("join-event", event._id);
    });
  }, [events]);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data.events);
    } catch (err) {
      console.log("Error fetching events:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // LIKE
  const toggleLike = async (eventId) => {
    try {
      await API.post(`/likes/${eventId}`);
      fetchEvents();
    } catch (err) {
      console.log("Like error:", err.message);
    }
  };
  // FAVORITE
  const toggleFavorite = async (eventId) => {
    try {
      await API.post(`/favorites/${eventId}`);
      fetchEvents();
    } catch (err) {
      console.log("Favorite error:", err.message);
    }
  };
  // FOLLOW
  const toggleFollow = async (userId) => {
  try {
    await API.post(`/follow/${userId}`);

    setFollowingUsers((prev) => {
      const updated = new Set(prev);

      if (updated.has(userId)) {
        updated.delete(userId);
      } else {
        updated.add(userId);
      }

      return updated;
    });
  } catch (err) {
    console.log(err.message);
  }
};
const fetchFollowing = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/follow/my-following", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setFollowingUsers(new Set(res.data.followingIds));
  } catch (err) {
    console.log(err.message);
  }
};


  // SHARE
  const shareEvent = async (eventId) => {
    try {
      const eventLink = `${window.location.origin}/event/${eventId}`;
      await navigator.clipboard.writeText(eventLink);
      alert("🔗 Event link copied!");
    } catch (err) {
      console.log("Share error:", err);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container">
        <h1 className="title">All Events</h1>

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events found</p>
        ) : (
          <div className="grid">
            {events.map((event) => (
              <div className="card" key={event._id}>
                
                {/* COVER */}
                {event.coverImage && (
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="event-cover"
                  />
                )}

                {/* CATEGORY */}
                <div className="badge">{event.category}</div>

                {/* TITLE */}
                <h3>{event.title}</h3>

                {/* CREATOR + FOLLOW */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p>
                    by {event.createdBy?.name || "Unknown"}
                  </p>

                  <button
  className="btn"
  onClick={() => toggleFollow(event.createdBy?._id)}
>
  {followingUsers.has(event.createdBy?._id)
    ? "Following"
    : "Follow"}
</button>
                </div>

                {/* DESCRIPTION */}
                <p className="muted">{event.description}</p>

                {/* META */}
                <div className="meta">
                  <p>📍 {event.location}</p>
                  <p>
                    📅{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="event-stats">
                  
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleLike(event._id)}
                  >
                    ❤️ {event.likes?.length || 0}
                  </span>

                  <span>💬 {event.comments?.length || 0}</span>

                  <span>📸 {event.media?.length || 0}</span>


                  {/* FAVORITE */}
                  <span
                    style={{
                      cursor: "pointer",
                      color: "#f5b301",
                    }}
                    onClick={() => toggleFavorite(event._id)}
                  >
                    ⭐ Favorite
                  </span>
                </div>

                {/* FOOTER */}
                <div className="footer">
                  <button
                    className="btn"
                    onClick={() => shareEvent(event._id)}
                  >
                    🔗 Share
                  </button>

                  <button
                    className="btn"
                    onClick={() =>
                      navigate(`/event/${event._id}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;