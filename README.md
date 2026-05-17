# MERN Ecommerce Platform

A production-like full-stack ecommerce application built with the MERN stack, TypeScript, Stripe, Cloudinary, and React Query.

This project is designed to demonstrate real-world frontend development skills, clean UI implementation, API integration, authentication flow, admin product management, cart/wishlist sync, and checkout flow.

## Live Demo

Live Website: https://mern-ecommerce-platform-two.vercel.app

The backend API is deployed separately and connected with the frontend.

## Demo Accounts

### Admin Login

Email: admin@example.com  
Password: 123456

### User Login

Email: user@example.com  
Password: 123456

## Stripe Test Payment

Use this Stripe test card during checkout:

Card Number: 4242 4242 4242 4242  
Expiry: Any future date  
CVC: Any 3 digits

## Project Overview

This is a full-stack ecommerce platform where users can browse products, filter/sort products, add items to cart and wishlist, complete checkout using Stripe, and view their orders.

Admins can manage products, upload product images, view orders, and access dashboard stats.

The main goal of this project is to build a clean, simple, and production-like ecommerce system using modern MERN stack best practices.

## Key Features

### Authentication & Security

- JWT authentication with access and refresh token flow
- Secure HTTP-only cookie based refresh token handling
- Persistent user sessions with automatic token refresh
- Protected routes for users and admins
- Role-based access control

### User Features

- User registration and login
- Protected user routes
- Product listing with search, filters, sorting, and pagination
- Product details page with image gallery
- Add to cart
- Cart local + backend sync
- Add to wishlist
- Wishlist local + backend sync
- Stripe checkout
- Order creation after successful payment
- User order history
- Responsive UI for desktop, tablet, and mobile

### Admin Features

- Admin protected routes
- Product CRUD
- Optimized parallel image uploads with real-time preview updates
- Product list with pagination
- Manage orders
- Dashboard stats
- Role-based access control

### UI/UX Features

- Clean and responsive layout
- Reusable components
- Skeleton loading states
- Error UI
- Empty states
- Toast notifications
- Product card skeletons
- Cart page skeleton
- Admin table UI
- Mobile-friendly design

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- TanStack React Query
- Context API
- React Router
- React Hook Form
- Zod
- Axios
- React Hot Toast
- Swiper.js

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Cookie-based authentication
- Stripe
- Cloudinary
- Multer

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Image Storage: Cloudinary
- Payment: Stripe Test Mode

## Folder Structure

```txt
frontend/
  src/
    api/
    assets/
    components/
    context/
    hooks/
    pages/
    types/
    utils/

backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    types/
    utils/
```
