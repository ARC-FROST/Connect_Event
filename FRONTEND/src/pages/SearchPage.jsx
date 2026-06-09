import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q");

  const [results, setResults] = useState({
    users: [],
    events: [],
    media: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    try {
      const res = await API.get(
        `/search?query=${query}`
      );

      setResults({
        users: res.data.users || [],
        events: res.data.events || [],
        media: res.data.media || [],
      });
    } catch (err) {
      console.log(
        "Search error:",
        err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container">

        <h1>
          🔍 Search Results for "{query}"
        </h1>

        {loading ? (
          <p>Searching...</p>
        ) : (
          <>
            {/* USERS */}
            <div className="card">
              <h2>
                👤 Users ({results.users.length})
              </h2>

              {results.users.map((user) => (
                <div key={user._id}>
                  <p>
                    <b>{user.name}</b>
                  </p>
                  <p>{user.email}</p>
                </div>
              ))}
            </div>

            {/* EVENTS */}
            <div className="card">
              <h2>
                🎉 Events ({results.events.length})
              </h2>

              {results.events.map((event) => (
                <div
                  key={event._id}
                  style={{
                    marginBottom: "15px",
                  }}
                >
                  <h3>{event.title}</h3>

                  <p>
                    {event.description}
                  </p>

                  <button
                    className="btn"
                    onClick={() =>
                      navigate(
                        `/event/${event._id}`
                      )
                    }
                  >
                    View Event
                  </button>
                </div>
              ))}
            </div>

            {/* MEDIA */}
            <div className="card">
              <h2>
                📸 Media ({results.media.length})
              </h2>

              <div className="gallery-grid">
                {results.media.map((item) => (
                  <div
                    key={item._id}
                    className="gallery-item"
                  >
                    <img
                      src={item.mediaUrl}
                      alt="media"
                    />

                    <div
                      style={{
                        marginTop: "5px",
                      }}
                    >
                      {item.tags?.map(
                        (tag, index) => (
                          <span
                            key={index}
                            className="tag"
                          >
                            #{tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;