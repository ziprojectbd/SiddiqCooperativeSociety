import { MongoClient } from 'mongodb'
import jwt from 'jsonwebtoken'
import cloudinary from 'cloudinary'

const uri = process.env.MONGODB_URI

function verifyToken(req) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req) {
  const user = verifyToken(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: 'Image size should be less than 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        {
          folder: 'somobay-somiti/members',
          transformation: [
            { width: 300, height: 300, crop: 'fill' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return Response.json({
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
