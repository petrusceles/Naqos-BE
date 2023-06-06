const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (image, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, { folder: folder }, (err, url) => {
      if (err) return reject(err);
      return resolve(url);
    });
  });
};

const getPublicIdFromCloudinaryUrl = (image_url) => {
  return image_url.match(/\/([^/]+\/[^/]+)\.[^.]+$/)[1];
};

module.exports = {
  uploadToCloudinary,
  getPublicIdFromCloudinaryUrl,
};
