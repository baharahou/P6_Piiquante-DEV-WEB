const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauceController");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.delete("/:id", auth, multer, sauceCtrl.deleteSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);

module.exports = router;
