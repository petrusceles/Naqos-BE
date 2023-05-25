const fileEncoder = async (req,res,next) => {
    try {
        if (req.file) {
            const fileToUpload = req.file;
            const fileBase64 = fileToUpload.buffer.toString("base64");
            req.fileEncoded = `data:${fileToUpload.mimetype};base64,${fileBase64}`;
        }
        next();
    } catch (error) {
        res.status(500).json({
            message:err,
            data:{}
        })
    }
}

module.exports = {fileEncoder}