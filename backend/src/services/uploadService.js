import {
  uploadToCloudinary,
} from "./cloudinaryService.js";

const uploadSingleImage =
  async (file) => {
    if (!file) {
      throw new Error(
        "No file uploaded"
      );
    }

    const uploadedImage =
      await uploadToCloudinary(
        file.buffer,
        "bookworld"
      );

    return {
      url: uploadedImage.secure_url,

      publicId:
        uploadedImage.public_id,
    };
  };

const uploadMultipleImages =
  async (files) => {
    const uploadedFiles = [];

    for (const file of files) {
      const uploadedImage =
        await uploadToCloudinary(
          file.buffer,
          "bookworld"
        );

      uploadedFiles.push({
        url: uploadedImage.secure_url,

        publicId:
          uploadedImage.public_id,
      });
    }

    return uploadedFiles;
  };

export {
  uploadSingleImage,
  uploadMultipleImages,
};