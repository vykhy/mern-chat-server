const router = require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const userController = require("../controllers/userController");
const uploadImage = require("../middleware/imageUpload");

router.get("/:id", userController.getUser);
router.post(
  "/profile-image",
  upload.single("image"),
  uploadImage,
  userController.updateProfileImage
);
router.delete("/profile-image", userController.removeProfileImage);

module.exports = router;
