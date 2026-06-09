import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
  });

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);

      const event = res.data.event;

      setForm({
        title: event.title || "",
        description: event.description || "",
        category: event.category || "",
        date: event.date?.split("T")[0] || "",
        location: event.location || "",
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateEvent = async () => {
    try {
      await API.put(`/events/${id}`, form);

      alert("Event updated successfully");

      navigate(`/event/${id}`);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container">

        <h1>Edit Event</h1>

        <div className="card">

          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="input"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
          />

          <button
            className="btn"
            onClick={updateEvent}
          >
            Save Changes
          </button>

        </div>

      </div>
    </div>
  );
}

export default EditEvent;