const sharp = require("sharp");

const uploadImage = async (req, res, next) => {
  const userId = req.userId;
  try {
    const fileName = `${userId}-${req.file.originalname}`;
    req.fileName = fileName;
    const fullImage = await sharp(req.file.buffer)
      .resize({ height: 400 })
      .toFile(`public/images/${fileName}`);
    const thumbnail = await sharp(req.file.buffer)
      .resize({ height: 50, width: 50 })
      .toFile(`public/images/thumbnails/${fileName}`);
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

module.exports = uploadImage;
