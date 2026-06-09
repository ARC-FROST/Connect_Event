import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      setProfile(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  if (!profile) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="container">

        <h1>👤 {profile.user.name}</h1>
        <p>{profile.user.email}</p>

        <div className="stats-grid">

  <div className="stat-card">
    <h2>{profile.eventCount}</h2>
    <p>Events Created</p>
  </div>

  <div className="stat-card">
    <h2>{profile.uploadCount}</h2>
    <p>Photos Uploaded</p>
  </div>

  <div className="stat-card">
    <h2>{profile.user.followers?.length || 0}</h2>
    <p>Followers</p>
  </div>

  <div className="stat-card">
    <h2>{profile.user.following?.length || 0}</h2>
    <p>Following</p>
  </div>

</div>
<h2>Followers</h2>

{profile.user.followers?.length === 0 ? (
  <p>No followers yet</p>
) : (
  profile.user.followers.map((follower) => (
    <div key={follower._id} className="card">
      <p>{follower.name}</p>
    </div>
  ))
)}
<h2>Following</h2>

{profile.user.following?.length === 0 ? (
  <p>Not following anyone yet</p>
) : (
  profile.user.following.map((person) => (
    <div key={person._id} className="card">
      <p>{person.name}</p>
    </div>
  ))
)}

        <h2>My Events</h2>

        {profile.events.map((event) => (
          <div className="card" key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Profile;