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

const deleteAllImages = (imagesUrl) => {
  for (let imageUrl of imagesUrl) {
    const publicId = getPublicIdFromCloudinaryUrl(imageUrl);
    cloudinary.uploader.destroy(publicId);
  }
};

module.exports = {
  uploadToCloudinary,
  getPublicIdFromCloudinaryUrl,
  deleteAllImages,
};
