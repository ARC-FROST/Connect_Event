const axios = require("axios");

// COMPARE  IMAGES
exports.compareFaces = async (image1, image2) => {
  try {
    const response = await axios.post(
      "https://api-us.faceplusplus.com/facepp/v3/compare",
      null,
      {
        params: {
          api_key: process.env.FACEPP_API_KEY,
          api_secret: process.env.FACEPP_API_SECRET,
          image_url1: image1,
          image_url2: image2,
        },
      }
    );

    return response.data.confidence || 0;
  } catch (error) {
    console.log(
      "Face++ Compare Error:",
      error.response?.data || error.message
    );

    return 0;
  }
};