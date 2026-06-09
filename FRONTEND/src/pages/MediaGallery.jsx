import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function MediaGallery() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // FETCH MEDIA
  useEffect(() => {
    fetchMedia();
  }, []);
  const handleDownload = (url) => {
  if (!url) {
    console.log("No URL provided");
    return;
  }

  console.log("Downloading:", url);

  const downloadUrl =
    `http://localhost:2001/api/media/download?url=` +
    encodeURIComponent(url);

  window.location.href = downloadUrl;
};
  const fetchMedia = async () => {
    try {
      const res = await API.get("/media");
      setMedia(res.data.media);
    } catch (err) {
      console.log("Error fetching media:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container">
        <h1>🖼️ Media Gallery</h1>

        {loading ? (
          <p>Loading media...</p>
        ) : media.length === 0 ? (
          <p>No media found</p>
        ) : (
          <div className="gallery-grid">
            {media.map((item) => (
              <div className="gallery-item" key={item._id}>
  
  {/* IMAGE */}
  <img
    src={item.mediaUrl}
    alt="media"
    onClick={() => setSelectedImage(item.mediaUrl)}
  />

  {/* TAGS */}
  {item.tags?.length > 0 && (
    <div className="tag-container">
      {item.tags.slice(0, 3).map((tag, i) => (
        <span key={i} className="tag">
          #{tag}
        </span>
      ))}
    </div>
  )}

  {/* DOWNLOAD BUTTON  */}
  <button onClick={() => handleDownload(item.mediaUrl)}>
  Download
</button>

</div>
            ))}
          </div>
        )}

        {/* IMAGE MODAL */}
        {selectedImage && (
          <div
            className="modal"
            onClick={() => setSelectedImage(null)}
          >
            <img src={selectedImage} alt="preview" />
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaGallery;