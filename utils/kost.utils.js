const cloudinary = require("../config/cloudinary.js");
const CloudinaryUtils = require("./cloudinary.utils.js");

const deleteRemovedPhotosUrl = async ({ photosUrl, photosOnholdUrl }) => {
  const photosToDelete = photosUrl.filter(
    (photoUrl) => !photosOnholdUrl.includes(photoUrl)
  );
  if (photosToDelete.length) {
    for (let photoToDelete of photosToDelete) {
      const publicId =
        CloudinaryUtils.getPublicIdFromCloudinaryUrl(photoToDelete);
      cloudinary.uploader.destroy(publicId);
    }
  }
};

module.exports = {
  deleteRemovedPhotosUrl,
};
