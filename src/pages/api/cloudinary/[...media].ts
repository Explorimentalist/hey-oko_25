import { NextApiRequest, NextApiResponse } from 'next'
import {
  createMediaHandler,
} from 'next-tinacms-cloudinary/dist/handlers'
import { isAuthorized } from '@tinacms/auth'

// Define a static API config instead of importing from the package
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
}

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('Missing required Cloudinary environment variables')
}

export default createMediaHandler({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  authorized: async (req: NextApiRequest, _res: NextApiResponse) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        return true
      }

      const user = await isAuthorized(req)
      return Boolean(user && user.verified)
    } catch (e) {
      console.error(e)
      return false
    }
  },
}) 