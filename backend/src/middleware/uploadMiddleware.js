import multer from "multer";
import path from "path";



const storage = multer.memoryStorage();



const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes =
    /jpg|jpeg|png|webp/;

  const extName = allowedTypes.test(
    path.extname(file.originalname)
      .toLowerCase()
  );

  const mimeType = allowedTypes.test(
    file.mimetype
  );

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only jpg, jpeg, png, webp files allowed"
      )
    );
  }
};



const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});

const reviewMediaFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp|mp4|webm|mov|avi|mkv/i;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpg, jpeg, png, webp) and videos (mp4, webm, mov, avi, mkv) are allowed"));
  }
};

export const uploadReviewMedia = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB for video support
  },
  fileFilter: reviewMediaFilter,
});

export default upload;