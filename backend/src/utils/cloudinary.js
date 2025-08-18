import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadImageToCloudinary = async (filePath) => {
  try {
    let defaultImage = "";
    if (!filePath)
      defaultImage =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s";

    const result = await cloudinary.uploader.upload(filePath || defaultImage, {
      folder: process.env.CLOUDINARY_USER_PROFILE_FOLDER,
      resource_type: "auto",
    });

    if (result && filePath) {
      fs.unlinkSync(filePath);
      return result.secure_url;
    } else {
      return result.secure_url;
    }
  } catch (error) {
    if (filePath) fs.unlinkSync(filePath);
    return false;
  }
};

async function deleteFromCloudinary(cloudinaryImageUrl) {
  try {
    if (!cloudinaryImageUrl) return;

    // extract pathname(foldername and image public name) of cloudinary
    const splitUrl = cloudinaryImageUrl.split("/");
    const cloudinaryPathname = `${splitUrl[7]}/${splitUrl[8]}/${
      splitUrl[9].split(".")[0]
    }`;
    const destroyResponse = await cloudinary.uploader.destroy(
      cloudinaryPathname
    );

    if (destroyResponse.result === "ok") return true;
    else return false;
  } catch (error) {
    return false;
  }
}

export { uploadImageToCloudinary, deleteFromCloudinary };
