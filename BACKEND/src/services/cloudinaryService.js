const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (file, resourceType) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
  {
    folder: "event-management",
    resource_type: "auto",
    use_filename: true,
    unique_filename: true,
    overwrite: false
  },
  (error, result) => {
  if (error) reject(error);

  console.log(result);

  resolve(result);
}
);
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;