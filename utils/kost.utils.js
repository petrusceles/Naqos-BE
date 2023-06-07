const cloudinary = require("../config/cloudinary.js");
const CloudinaryUtils = require("./cloudinary.utils.js");

const deleteRemovedPhotosUrl = async ({
  outsidePhotosUrl,
  outsidePhotosOnholdUrl,
}) => {
  const outsidePhotosToDelete = outsidePhotosUrl.filter(
    (outsidePhotoUrl) => !outsidePhotosOnholdUrl.includes(outsidePhotoUrl)
  );

  if (outsidePhotosToDelete.length) {
    for (const outsidePhotoToDelete in outsidePhotosToDelete) {
      const publicId =
        CloudinaryUtils.getPublicIdFromCloudinaryUrl(outsidePhotoToDelete);
      cloudinary.uploader.destroy(publicId);
    }
  }
};

module.exports = {
  deleteRemovedPhotosUrl,
};
