import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "tech",
    date: "",
    location: "",
    coverImage: "",
    status: "upcoming",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  // FETCH MY EVENTS
  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");

      const myEvents = res.data.events.filter(
        (e) => e.createdBy?._id === user?._id
      );

      setEvents(myEvents);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  // CREATE EVENT
  const createEvent = async () => {
    try {
      await API.post("/events", form);

      alert("Event created successfully!");

      setForm({
        title: "",
        description: "",
        category: "tech",
        date: "",
        location: "",
        coverImage: "",
        status: "upcoming",
      });

      fetchEvents();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // DELETE EVENT
  const deleteEvent = async (id) => {
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.log(err.message);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/events/${id}`, {
        status: newStatus,
      });

      fetchEvents();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container">
        <h1>🚀 My Dashboard</h1>
        <p className="muted">Create and manage your events</p>

        {/* STATS  */}
        <div className="stats-grid">
          <div className="stat-card">
            <h2>{events.length}</h2>
            <p>Events Created</p>
          </div>

          <div className="stat-card">
            <h2>
              {events.reduce((sum, e) => sum + (e.likes?.length || 0), 0)}
            </h2>
            <p>Total Likes</p>
          </div>

          <div className="stat-card">
            <h2>
              {events.reduce((sum, e) => sum + (e.attendees?.length || 0), 0)}
            </h2>
            <p>Total Attendees</p>
          </div>
        </div>

        {/* CREATE EVENT  */}
        <div className="card">
          <h3>Create Event</h3>

          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="input"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            className="input"
            placeholder="Cover Image URL"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          />

          <select
            className="input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="tech">Tech</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="education">Education</option>
            <option value="social">Social</option>
          </select>

          {/* STATUS (CREATE TIME) */}
          <select
            className="input"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <input
            type="date"
            className="input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <input
            className="input"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <button className="btn" onClick={createEvent}>
            Create Event
          </button>
        </div>

        {/* MY EVENTS */}
        <h3 style={{ marginTop: "25px" }}>My Events</h3>

        {events.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          events.map((e) => (
            <div className="card" key={e._id} style={{ marginTop: "12px" }}>
              <h3>{e.title}</h3>
              <p className="muted">{e.description}</p>

              <div className="flex-between">
                <span className="badge">{e.category}</span>

                {/* STATUS EDITOR */}
                <select
                  className="input"
                  value={e.status}
                  onChange={(ev) => updateStatus(e._id, ev.target.value)}
                  style={{ width: "140px", padding: "6px" }}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>

                <div className="dashboard-actions">
                  <button
                    className="btn"
                    onClick={() => navigate(`/event/${e._id}`)}
                  >
                    View
                  </button>

                  <button
                    className="btn"
                    onClick={() => navigate(`/edit-event/${e._id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn delete-btn"
                    onClick={() => deleteEvent(e._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;