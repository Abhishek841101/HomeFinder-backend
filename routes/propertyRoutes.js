const router = require("express").Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const {
  createProperty,
  getProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
  bookFlat,
  
} = require("../controllers/propertyController");

// =========================
// PUBLIC
// =========================
router.get("/", getProperties);
router.get("/:id", getSingleProperty);

// =========================
// ADMIN
// =========================
router.post(
  "/",
  auth,
  isAdmin,
  upload.array("images", 5),
  createProperty
);

router.put(
  "/:id",
  auth,
  isAdmin,
  upload.array("images", 5),
  updateProperty
);

router.delete("/:id", auth, isAdmin, deleteProperty);

// =========================
// USER
// =========================
router.post("/:id/book", auth, bookFlat);

module.exports = router;