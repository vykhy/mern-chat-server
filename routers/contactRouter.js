const contactController = require("../controllers/contactController");
const router = require("express").Router();

router.post("/add", contactController.addContact);

router.delete("/delete", contactController.removeContact);

module.exports = router;
