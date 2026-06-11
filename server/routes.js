// const express = require("express");
// const routes = express.Router();

// const multer = require("multer");
// const { postUpload } = require("./controller");

// const upload = multer({ storage: multer.memoryStorage() });
// routes.post("/upload", upload.array("files", 10), postUpload);
// module.exports = routes;

// In a file named multerConfig.js
const express = require("express");
const routes = express.Router();
const { postUpload } = require("./controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

// In your routes file
routes.post("/upload", upload.array("files", 10), postUpload);
module.exports = routes;
