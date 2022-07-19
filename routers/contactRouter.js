const contactController = require("../controllers/contactController");
const router = require("express").Router();

router.get("/", contactController.getContacts);

router.get("/:id", contactController.getContactById);

router.post("/add", contactController.addContact);

router.delete("/delete", contactController.removeContact);

module.exports = router;
