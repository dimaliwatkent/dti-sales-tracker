const Business = require("../models/business.cjs");
const User = require("../models/user.cjs");
const Event = require("../models/event.cjs");
const mongoose = require("mongoose");

const { sendEmail } = require("../utils/sendEmail.cjs");

const {
  uploadToS3,
  bucketName,
  bucketRegion,
} = require("../utils/s3Client.cjs");
const {
  applicationSchema,
  editApplicationSchema,
} = require("../zod/applicationSchema.cjs");

// get business by id
const getBusiness = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

// get archived business list
const getBusinessList = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

// create business
const addBusiness = async (req, res, next) => {
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
      birPermit,
      mayorPermit,
      ...businessData
    } = req.body;

    const parsedBody = applicationSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(422).json({
        message: "Invalid request body",
        errors: parsedBody.error.issues,
      });
    }

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

    const files = [
      { file: logoFile, type: "logo" },
      { file: waiverFile, type: "waiver" },
      { file: signedTermsFile, type: "signed-terms" },
      { file: paymentQRFile, type: "payment-qr" },
      { file: businessNameRegFile, type: "business-name-reg" },
      { file: validIdFile, type: "valid-id" },
      { file: menuCopyFile, type: "menu-copy" },
      { file: birPermit, type: "bir-permit" },
      { file: mayorPermit, type: "mayor-permit" },
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

        try {
          await uploadToS3(params);
        } catch (error) {
          return res.status(500).json({
            message: "Failed to upload document",
            error: error.name,
          });
        }
        const docUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
        return { type: file.type, url: docUrl };
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

    // upload product image picture

    if (newBusiness.productList && newBusiness.productList.length > 0) {
      const productImagePromises = newBusiness.productList.map(
        async (product) => {
          if (product.picture) {
            const binaryFile = Buffer.from(
              product.picture.split(",")[1],
              "base64",
            );
            const fileType = product.picture.split(";")[0].split(":")[1];
            const fileExtension = fileType.split("/")[1];

            const fileName = `products/${event.title}/${newBusiness.name}/${product.name}.${fileExtension}`;

            const params = {
              Bucket: bucketName,
              Key: fileName,
              Body: binaryFile,
              ContentType: fileType,
            };

            try {
              await uploadToS3(params);
            } catch (error) {
              return res.status(500).json({
                message: "Failed to upload product image",
                error: error.name,
              });
            }

            const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
            product.picture = imageUrl;
          }
        },
      );

      await Promise.all(productImagePromises);
    }

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
  } catch (error) {
    next(error);
  }
};

const editBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const businessData = req.body;

    const parsedBody = editApplicationSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(422).json({
        message: "Invalid request body",
        errors: parsedBody.error.issues,
      });
    }

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
  } catch (error) {
    next(error);
  }
};

// business application status "forcompletion", "pending", "approved", "rejected", "complied",
const applicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { applicationStatus, statusMessage } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const existingBusiness = await Business.findById(id)
      .populate("user")
      .exec();

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
    } else if (applicationStatus === "forcompletion") {
      await sendEmail(
        existingBusiness.user.email,
        "Business Application Incomplete",
        `<p>Your business application for ${event.title} needs completion. ${statusMessage}.</p>`,
      );
    } else if (applicationStatus === "rejected") {
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
  } catch (error) {
    next(error);
  }
};

// get business by id
const getBusinessProductList = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const business = await Business.findById(id).select("_id productList");

    if (!business) {
      return res.status(404).json({ message: "No business found" });
    }

    return res
      .status(200)
      .json({ message: "Business retrieved successfully", business });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusiness,
  getBusinessList,
  addBusiness,
  editBusiness,
  applicationStatus,
  getBusinessProductList,
};
