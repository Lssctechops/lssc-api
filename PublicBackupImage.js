const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const axios = require('axios');
const FormData = require('form-data');
const mongoose = require('mongoose');
const configValues = require('./config.js');
const Image = require('./models/Image.js'); // Adjust path if needed

// CONFIG
const config = {
    directory: './images',
    cloudflare: {
        accountId: configValues.cloudflareImage.accountId,
        apiToken: configValues.cloudflareImage.apiToken,
        imageBaseUrl: configValues.cloudflareImage.imageBaseUrl
    },
    quality: {
        sharpQuality: 80
    },
    mongoURI: configValues.database.dbConnectionString
};

// Allowed image extensions
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

// Recursively collect image file paths
function getAllImageFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getAllImageFiles(fullPath, arrayOfFiles);
        } else if (allowedExtensions.includes(path.extname(file).toLowerCase())) {
            arrayOfFiles.push(fullPath);
        }
    }
    return arrayOfFiles;
}

// Upload a single image and save to DB
async function uploadAndSaveImage(filePath) {
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName).toLowerCase();
    const mimeType = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp'
    }[ext];

    if (!mimeType) {
        console.warn(`⚠️ Skipped unsupported file type: ${fileName}`);
        return;
    }

    try {
        // Compress with sharp but keep original format
        let buffer;
        const sharpImage = sharp(filePath);

        if (ext === '.jpg' || ext === '.jpeg') {
            buffer = await sharpImage.jpeg({ quality: config.quality.sharpQuality }).toBuffer();
        } else if (ext === '.png') {
            buffer = await sharpImage.png({ quality: config.quality.sharpQuality, compressionLevel: 9 }).toBuffer();
        } else if (ext === '.webp') {
            buffer = await sharpImage.webp({ quality: config.quality.sharpQuality }).toBuffer();
        }

        const form = new FormData();
        form.append('file', buffer, {
            filename: fileName,
            contentType: mimeType
        });

        const uploadRes = await axios.post(
            `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/images/v1`,
            form,
            {
                headers: {
                    Authorization: `Bearer ${config.cloudflare.apiToken}`,
                    ...form.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        const result = uploadRes.data.result;

        const imageDoc = new Image({
            url: `${config.cloudflare.imageBaseUrl}/${result.id}/public`,
            providerId: result.id,
            name: fileName,
            alt: fileName,
            public: true
        });

        await imageDoc.save();

        console.log(`✅ Uploaded & Saved: ${fileName}`);
    } catch (err) {
        console.error(`❌ Failed for ${fileName}:`, err.response?.data || err.message);
    }
}

// Main runner
(async () => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log('🔌 MongoDB connected');

        const imageFiles = getAllImageFiles(config.directory);
        console.log(`📂 Found ${imageFiles.length} image(s)`);

        for (const file of imageFiles) {
            await uploadAndSaveImage(file);
        }

        await mongoose.disconnect();
        console.log('✅ All images uploaded and saved. MongoDB disconnected.');
    } catch (err) {
        console.error('❌ Error in main process:', err.message);
    }
})();
