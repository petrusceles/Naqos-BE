const multer = require("multer");

const storage = multer.memoryStorage();

const uploadKostPhotos = (req, res, next) => {
  const upload = multer({ storage }).fields([
    { name: "outside_photos", maxCount: 4 },
    { name: "inside_photos", maxCount: 4 },
    { name: "room_photos", maxCount: 4 },
  ]);

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        status: "BAD_REQUEST",
        message: err.message,
        data: null,
      });
    } else if (err) {
      return res.status(500).json({
        status: "INTERNAL_SERVER_ERROR",
        message: err.message,
        data: null,
      });
    }
    next();
  });
};

module.exports = uploadKostPhotos;
