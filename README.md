# INFINTYY.CREWW

A guest-only e-commerce storefront experience for the brand INFINTYY.CREWW.

## What’s included
- Responsive storefront with brand-driven hero, product listing, search, filters, cart, wishlist, and recently viewed products
- Guest checkout flow with shipping details, order creation, and WhatsApp order notification
- Protected admin login for future CRUD and order management workflows
- Dynamic branding placeholder for a logo image file

## Run locally
- Frontend: `cd client && npm run dev`
- Backend: `cd server && npm run dev`

## Default access
- Storefront: http://localhost:3000
- API health check: http://localhost:5000/api/health
- Admin login: http://localhost:3000/admin
  - Email: `admin@infintyy.com`
  - Password: `admin123`

## Notes
- The current build uses in-memory demo data so the app runs immediately without a configured Neon/Prisma database.
- For production, connect Prisma to Neon, add Cloudinary and Razorpay credentials, and swap the placeholder logo with a real asset.
