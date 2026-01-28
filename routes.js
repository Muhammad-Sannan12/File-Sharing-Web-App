const express = require("express");
const routes = express.Router();

const multer = require("multer");
const { postUpload } = require("./controller");

const upload = multer({ storage: multer.memoryStorage() });
routes.post("/upload", upload.single("file"), postUpload);
module.exports = routes;
