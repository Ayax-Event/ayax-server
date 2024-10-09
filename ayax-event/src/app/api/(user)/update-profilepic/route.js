import cloudinary from "@/lib/cloudinary";
import User from "../../../../../db/models/User";

export const POST = async (request) => {
  try {
    const userId = request.headers.get("x-user-id");
    const formData = await request.formData();
    console.log(formData, "<<<<<<<<<<< FORM DATA");

    const profilePict = formData.get("profilePict");
    console.log(profilePict, "<<<<<<<<<<< PROFILE PICT");
    let profilePictUrl = null;

    if (profilePict) {
      const uploadResult = await cloudinary.uploader.upload(profilePict, {
        folder: "profile-picts",
      });
      profilePictUrl = uploadResult.secure_url;
    }

    await User.updateProfilePic(userId, profilePictUrl);

    return Response.json({ profilePictUrl }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
};
