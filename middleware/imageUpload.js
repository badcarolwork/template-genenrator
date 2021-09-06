const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let processFile = multer({
  storage: multer.memoryStorage()
}).fields([{ name: "image_backup" }, { name: "image_banner" }])

let processFileMiddleware = util.promisify(processFile);
module.exports = processFileMiddleware;