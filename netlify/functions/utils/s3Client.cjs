const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
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

const uploadToS3 = async (params) => {
  const command = new PutObjectCommand(params);
  const result = await s3.send(command);

  if (result.$metadata.httpStatusCode !== 200) {
    throw new Error(
      `Failed to upload document to S3: ${result.$metadata.httpStatusCode}`,
    );
  }
  return result;
};

module.exports = { uploadToS3, bucketName, bucketRegion };
