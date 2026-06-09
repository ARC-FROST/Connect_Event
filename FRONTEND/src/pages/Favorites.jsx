import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const res = await API.get("/favorites");
      setFavorites(res.data.favorites);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container">
        <h1>❤️ My Favorites</h1>

        {favorites.length === 0 ? (
          <p>No favorites yet</p>
        ) : (
          favorites.map((e) => (
            <div key={e._id} className="card">
              <h3>{e.title}</h3>
              <p>{e.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Favorites;