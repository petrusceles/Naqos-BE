const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: "dqzqbgi8e",
    api_key: "524157954979946",
    api_secret: "0DIE3QPgZXHsZiC8C6EYSyGJpCw",
    secure: true
});

module.exports = cloudinary;