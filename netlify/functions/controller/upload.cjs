const User = require("../models/user.cjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

dotenv.config();

const bucketName = process.env.S3_BUCKET_NAME;
const bucketRegion = process.env.S3_BUCKET_REGION;
const accessKey = process.env.S3_BUCKET_ACCESS_KEY;
const secretKey = process.env.S3_BUCKET_SECRET_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: bucketRegion,
});

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .json({ message: "An error occurred", err: err.message });
};

// upload profile picture
const uploadProfile = async (req, res) => {
  try {
    const base64Image = req.body.image;
    const uploaderId = req.body.uploaderId;

    const user = await User.findById(uploaderId).exec();

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    // Decode the base64 string
    const binaryImage = Buffer.from(base64Image.split(",")[1], "base64");

    const fileName = `profile/${user.name}-${user._id}.jpg`;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: binaryImage,
      ContentType: "image/jpeg",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
    user.picture = imageUrl;
    await user.save();

    return res
      .status(201)
      .json({ message: "Profile picture added successfully", user: user });
  } catch (err) {
    handleError(res, err);
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(userId);

    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    const params = {
      Bucket: bucketName,
      Key: `profile/${user.name}-${userId}.jpg`,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    user.picture = "";
    await user.save();

    return res
      .status(201)
      .json({ message: "Profile picture removed successfully" });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  uploadProfile,
  deleteProfile,
};
