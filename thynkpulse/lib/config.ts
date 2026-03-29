export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Thynk Pulse',
    tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || "India's Education Community Platform",
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    parentSite: 'https://thynksuccess.com',
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
  auth: {
    secret: process.env.JWT_SECRET || 'change-this-in-production',
    expiresIn: '7d',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@thynkpulse.in',
  },
  db: {
    url: process.env.DATABASE_URL || '',
  },
  upload: {
    maxSizeMb: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
}
