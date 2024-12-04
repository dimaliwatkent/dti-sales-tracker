const Business = require("../models/business.cjs");
const User = require("../models/user.cjs");
const Event = require("../models/event.cjs");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// aws s3
const dotenv = require("dotenv");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

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

// get business by id
const getBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({ message: "No business found" });
    }

    return res
      .status(200)
      .json({ message: "Business retrieved successfully", business });
  } catch (err) {
    handleError(res, err);
  }
};

// get archived business list
const getBusinessList = async (req, res) => {
  try {
    const isArchived = req.query.isArchived === "true";
    const business = await Business.find({ isArchived })
      .populate("user")
      .exec();

    if (!business || !business.length) {
      return res.status(404).json({ message: "No business found" });
    }

    return res
      .status(200)
      .json({ message: "Business list retrieved successfully", business });
  } catch (err) {
    handleError(res, err);
  }
};

// create business
const addBusiness = async (req, res) => {
  try {
    const {
      eventId,
      userId,
      logoFile,
      waiverFile,
      signedTermsFile,
      paymentQRFile,
      businessNameRegFile,
      validIdFile,
      menuCopyFile,
      productPhotosFile,
      ...businessData
    } = req.body;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "user") {
      return res
        .status(404)
        .json({ message: "Must be a user to add business" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const newBusiness = new Business({
      ...businessData,
      user: user._id,
      event: eventId,
    });

    // UPLOAD LOGO

    const files = [
      { file: logoFile, type: "logo" },
      { file: waiverFile, type: "waiver" },
      { file: signedTermsFile, type: "signed-terms" },
      { file: paymentQRFile, type: "payment-qr" },
      { file: businessNameRegFile, type: "business-name-reg" },
      { file: validIdFile, type: "valid-id" },
      { file: menuCopyFile, type: "menu-copy" },
      { file: productPhotosFile, type: "product-photos" },
    ];

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const binaryFile = Buffer.from(file.file.split(",")[1], "base64");
        const fileType = file.file.split(";")[0].split(":")[1];
        const fileExtension = fileType.split("/")[1];
        const fileName = `documents/${event.title}/${newBusiness.name}/${file.type}/${newBusiness.name}-${newBusiness._id}.${fileExtension}`;
        const params = {
          Bucket: bucketName,
          Key: fileName,
          Body: binaryFile,
          ContentType: fileType,
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
        return { type: file.type, url: imageUrl };
      }),
    );

    // Set the logo URL
    newBusiness.logo = uploadedFiles.find((file) => file.type === "logo").url;

    // Create the document list
    const documents = uploadedFiles
      .filter((file) => file.type !== "logo")
      .map((file) => {
        return {
          documentType: file.type,
          url: file.url,
        };
      });

    newBusiness.documentList = documents;

    await newBusiness.save();

    user.businessList = [...(user.businessList || []), newBusiness._id];
    await user.save();

    // Add the business ID to the event's applicant list
    if (!event.applicantList.includes(newBusiness._id)) {
      event.applicantList = [...(event.applicantList || []), newBusiness._id];
      await event.save();
    }

    return res.status(201).json({
      message: "Business created successfully",
      business: newBusiness,
    });
  } catch (err) {
    handleError(res, err);
  }
};

const editBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const businessData = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const updatedBusiness = { ...business.toObject(), ...businessData };

    const result = await Business.updateOne(
      { _id: id },
      { $set: updatedBusiness },
      { new: true },
    );
    if (result.nModified === 0) {
      return res.status(500).json({ message: "Failed to update business" });
    }

    return res.status(200).json({
      message: "Business updated successfully",
      business: updatedBusiness,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// edit business
// const editBusiness = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isAdmin, userId } = req.body;
//
//     if (!id || !mongoose.isValidObjectId(id)) {
//       return res.status(400).json({ message: "Invalid business ID" });
//     }
//
//     if (!userId || !mongoose.isValidObjectId(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }
//
//     const business = await Business.findById(id);
//     if (!business) {
//       return res.status(404).json({ message: "Business not found" });
//     }
//
//     if (business.applicationStatus === "approved" && !isAdmin) {
//       return res
//         .status(403)
//         .json({ message: "Only admins can edit approved businesses" });
//     }
//
//     const updatedBusinessData = {
//       ...req.body,
//       user: userId,
//     };
//     delete updatedBusinessData.isAdmin;
//
//     Object.assign(business, updatedBusinessData);
//     await business.save();
//
//     res
//       .status(200)
//       .json({ message: "Business updated successfully", business });
//   } catch (err) {
//     handleError(res, err);
//   }
// };

// business application
const applicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationStatus, statusMessage } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const existingBusiness = await Business.findById(id);

    if (!existingBusiness) {
      return res.status(404).json({ message: "No business found" });
    }

    const eventId = existingBusiness.event;

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);

    if (applicationStatus === "approved") {
      // Move the business ID from participantList to businessList
      event.applicantList = event.applicantList.filter(
        (applicantId) => applicantId.toString() !== id,
      );
      event.businessList.push(id);
      await sendEmail(
        existingBusiness.user.email,
        "Business Application Approved",
        `<p>Your business application for ${event.title} has been approved. Congratulations!</p>`,
      );
    } else {
      await sendEmail(
        existingBusiness.user.email,
        "Business Application Rejected",
        `<p>Your business application for ${event.title} has been rejected. Please contact the event organizer for more details.</p>`,
      );
    }

    existingBusiness.statusMessage = statusMessage;
    existingBusiness.applicationStatus = applicationStatus;

    await existingBusiness.save();
    await event.save();

    let newEvent = await Event.findById(eventId)
      .populate({
        path: "businessList",
        populate: {
          path: "user",
          model: "user",
        },
      })
      .populate({
        path: "applicantList",
        populate: {
          path: "user",
          model: "user",
        },
      })
      .exec();

    return res.status(200).json({
      message: "Business application status updated successfully",
      business: existingBusiness,
      event: newEvent,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// archive business
const archiveBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const existingBusiness = await Business.findById(id);

    if (!existingBusiness) {
      return res.status(404).json({ message: "No business found" });
    }

    existingBusiness.isArchived = isArchived;
    await existingBusiness.save();

    const action = isArchived ? "archived" : "unarchived";

    return res.status(200).json({
      message: `Business ${action} successfully`,
      business: existingBusiness,
    });
  } catch (err) {
    handleError(res, err);
  }
};

async function sendEmail(to, subject, htmlContent) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Expo Management System" <${process.env.EMAIL}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Email failed to send");
  }
}

module.exports = {
  getBusiness,
  getBusinessList,
  addBusiness,
  editBusiness,
  applicationStatus,
  archiveBusiness,
};
