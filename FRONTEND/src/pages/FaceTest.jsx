import { useState } from "react";
import API from "../api/axios";

function FaceTest() {
  const [file, setFile] = useState(null);

  const uploadSelfie = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("selfie", file);

    try {
      const res = await API.post(
        "/faces/selfie",
        formData
      );

      console.log(res.data);

      alert("Face registered successfully");
    } catch (err) {
      console.log(err.response?.data);
      alert("Failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Face Registration Test</h2>

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <br />
      <br />

      <button onClick={uploadSelfie}>
        Upload Selfie
      </button>
    </div>
  );
}

export default FaceTest;