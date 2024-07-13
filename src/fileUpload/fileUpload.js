import multer from "multer";
import { AppError } from "../utils/AppError.js";

export function fileUpload(filename) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    console.log(file.mimetype);
    if (file.mimetype.startsWith("application/pdf")) {
      cb(null, true);
    } else {
      cb(new AppError("PDF only", 401), false);
    }
  }

  const upload = multer({ storage  , fileFilter});
  return upload.single(filename)
}
