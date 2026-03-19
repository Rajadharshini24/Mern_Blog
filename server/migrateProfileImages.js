const User = require("./models/User");
const cloudinary = require("./config/cloudinary");
const path = require("path");

async function migrateProfileImages() {
  const users = await User.find({ profileImage: { $exists: true } });

  for (const user of users) {
    // Skip if already a Cloudinary URL
    if (user.profileImage.includes("res.cloudinary.com")) continue;

    try {
      // If images are local, make sure you have the full path
      const localPath = path.join(__dirname, "uploads", path.basename(user.profileImage));

      const result = await cloudinary.uploader.upload(localPath, {
        folder: "profile_images",
        public_id: `user_${user._id}`,
      });

      user.profileImage = result.secure_url;
      await user.save();
      console.log(`Migrated profile image for user: ${user.name}`);
    } catch (err) {
      console.log(`Error migrating user ${user.name}: ${err.message}`);
    }
  }

  console.log("Profile image migration completed!");
}

migrateProfileImages();