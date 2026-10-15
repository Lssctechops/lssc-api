const mongoose = require('mongoose');
const sharp = require('sharp');
const axios = require('axios');
const FormData = require('form-data');

const config = require('./config.js');
const Image = require('./models/Image.js');
const Course = require('./models/Course.js');
const Blog = require('./models/Blog.js');
const Banner = require('./models/Banner.js');
const ResourcePdf = require('./models/ResourcePdf.js');

const DB_URI = config.database.dbConnectionString;

const cloudflareConfig = {
  accountId: config.cloudflareImage.accountId,
  apiToken: config.cloudflareImage.apiToken,
  imageBaseUrl: config.cloudflareImage.imageBaseUrl
};

function isCloudinaryUrl(url) {
  return typeof url === 'string' && url.includes('cloudinary');
}

async function downloadImage(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(res.data);
}

async function uploadToCloudflare(buffer, fileName) {
  const form = new FormData();
  form.append('file', buffer, {
    filename: fileName,
    contentType: 'image/jpeg'
  });

  const response = await axios.post(
    `https://api.cloudflare.com/client/v4/accounts/${cloudflareConfig.accountId}/images/v1`,
    form,
    {
      headers: {
        Authorization: `Bearer ${cloudflareConfig.apiToken}`,
        ...form.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }
  );

  return response.data.result;
}

async function compressBuffer(buffer) {
  return await sharp(buffer).jpeg({ quality: 80 }).toBuffer();
}

async function migrateImageAndUpdate(doc, fieldPath, altText = '') {
  const [topField, nestedField] = fieldPath.split('.');
  const currentUrl = nestedField ? doc[topField]?.[nestedField] : doc[topField];
  if (!isCloudinaryUrl(currentUrl)) return;

  try {
    const originalBuffer = await downloadImage(currentUrl);
    const compressedBuffer = await compressBuffer(originalBuffer);

    const fileName = `${doc._id}-${fieldPath.replace('.', '_')}.jpg`;
    const cloudflareRes = await uploadToCloudflare(compressedBuffer, fileName);

    const newImage = await Image.create({
      url: `${cloudflareConfig.imageBaseUrl}/${cloudflareRes.id}/public`,
      providerId: cloudflareRes.id,
      name: fileName,
      alt: altText || fileName,
      public: true
    });

    // Update the URL and publicId
    if (nestedField) {
      doc[topField][nestedField] = newImage.url;
      if ('publicId' in doc[topField]) {
        doc[topField].publicId = newImage.providerId;
      }
    } else {
      doc[topField] = newImage.url;
      if ('publicId' in doc) {
        doc.publicId = newImage.providerId;
      }
    }

    await doc.save();
    console.log(`✅ Updated ${doc.constructor.modelName}:${doc._id} -> ${fieldPath}`);
  } catch (err) {
    console.error(`❌ Error processing ${doc.constructor.modelName}:${doc._id} -> ${fieldPath}`, err.message);
  }
}

async function processModel(model, fields) {
  const docs = await model.find();
  for (const doc of docs) {
    for (const field of fields) {
      await migrateImageAndUpdate(doc, field, doc.title || doc.name || '');
    }
  }
}

(async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('🔌 Connected to MongoDB');

    await processModel(Course, ['thumbnail.url']);
    await processModel(Blog, ['thumbnail.url']);
    await processModel(Banner, ['thumbnail']);
    await processModel(ResourcePdf, ['coverImage']);

    await mongoose.disconnect();
    console.log('🎉 Migration completed and MongoDB disconnected');
  } catch (err) {
    console.error('❌ Script failed:', err);
    process.exit(1);
  }
})();
