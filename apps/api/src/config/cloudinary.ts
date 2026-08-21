// ============================================
// Cloudinary Configuration
// ============================================
// Handles image uploads to Cloudinary CDN.
// We only store the returned URL in our database
// — never the raw image bytes.
// ============================================

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary