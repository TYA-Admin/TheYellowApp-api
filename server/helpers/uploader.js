const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Create an S3 client instance
const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_API,
    secretAccessKey: process.env.AWS_SECRET_KEY_API,
  },
  requestTimeout: 60000,
});

// Define a function to handle file upload
const uploadFileToS3 = async (file, folder, prefix) => {
  try {
    const filename = `${folder}/${prefix}-${Date.now().toString()}${getExtension(file.mimetype)}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Execute the PutObjectCommand to upload the file to S3
    const response = await s3Client.send(new PutObjectCommand(params))
      .catch((error) => {
        console.error('Error uploading to s3:', error);
        throw error;
      });

    const location = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${filename}`;
    console.log(`File uploaded to location: ${location}`);

    return { location, response };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

// Function to get file extension based on mimetype
const getExtension = (mimetype) => {
  switch (mimetype) {
    case 'image/png':
      return '.png';
    case 'image/gif':
      return '.gif';
    case 'image/jpeg':
      return '.jpg';
    case 'image/bmp':
      return '.bmp';
    case 'image/webp':
      return '.webp';
    case 'image/svg+xml':
      return '.svg';
    default:
      return '';
  }
};

module.exports = { uploadFileToS3 };
