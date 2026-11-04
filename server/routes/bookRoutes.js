const express = require("express");
const c = require("../controllers/bookController");
const { validateBook } = require("../middleware/validateBook");

const router = express.Router();

// fixed paths first, otherwise "/stats" would be read as an :id
router.get("/stats", c.getStats);
router.post("/bulk-delete", c.bulkDelete);

router.get("/", c.getBooks);
router.post("/", validateBook, c.createBook);

router.get("/:id", c.getBook);
router.put("/:id", validateBook, c.updateBook);
router.patch("/:id/favorite", c.toggleFavorite);
router.patch("/:id/status", c.updateStatus);
router.patch("/:id/progress", c.updateProgress);
router.delete("/:id", c.deleteBook);

module.exports = router;
