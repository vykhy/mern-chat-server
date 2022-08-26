const sharp = require("sharp");
const fs = require('fs')

const uploadImage = async (req, res, next) => {
  const userId = req.userId;
  const folders = ['public/images', 'public/thumbnails']
  folders.forEach((folder) => {
    if(!fs.existsSync(folder)){
      fs.mkdirSync(folder)
    }
  })
  try {
    const fileName = `${userId}-${req.file.originalname}`;
    req.fileName = fileName;
    const fullImage = await sharp(req.file.buffer)
      .resize({ height: 400 })
      .toFile(`public/images/${fileName}`);
    const thumbnail = await sharp(req.file.buffer)
      .resize({ height: 50, width: 50 })
      .toFile(`public/thumbnails/${fileName}`);
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

module.exports = uploadImage;
