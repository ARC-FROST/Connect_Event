import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery().get("q");

  const [events, setEvents] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) searchData();
  }, [query]);

  const searchData = async () => {
    try {
      setLoading(true);

      const [eventRes, mediaRes] = await Promise.all([
        API.get(`/search/events?query=${query}`),
        API.get(`/search/media?query=${query}`),
      ]);

      setEvents(eventRes.data.events || []);
      setMedia(mediaRes.data.media || []);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container">
        <h1>🔍 Search Results</h1>
        <p>Query: <b>{query}</b></p>

        {loading ? (
          <p>Searching...</p>
        ) : (
          <>
            {/* EVENTS */}
            <h3>📅 Events</h3>
            {events.length === 0 ? (
              <p>No events found</p>
            ) : (
              events.map((e) => (
                <div className="card" key={e._id}>
                  <h3>{e.title}</h3>
                  <p>{e.location}</p>
                </div>
              ))
            )}

            {/* MEDIA */}
            <h3 style={{ marginTop: "20px" }}>🖼️ Media</h3>
            {media.length === 0 ? (
              <p>No media found</p>
            ) : (
              <div className="grid">
                {media.map((m) => (
                  <div className="card" key={m._id}>
                    <img
                      src={m.mediaUrl}
                      alt=""
                      style={{ width: "100%", borderRadius: "10px" }}
                    />
                    <div style={{ marginTop: "5px" }}>
                      {m.tags?.slice(0, 3).map((t, i) => (
                        <span key={i} className="badge">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchResults;