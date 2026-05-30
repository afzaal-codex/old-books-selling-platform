import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (
  fileBuffer,
  folder = "bookworld"
) => {
  return new Promise(
    (resolve, reject) => {
      const stream =
        cloudinary.uploader.upload_stream(
          {
            folder,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

      stream.end(fileBuffer);
    }
  );
};

const deleteFromCloudinary =
  async (publicId) => {
    return await cloudinary.uploader.destroy(
      publicId
    );
  };

export {
  uploadToCloudinary,
  deleteFromCloudinary,
};