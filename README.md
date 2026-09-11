# WonderLust - Travel Listing Platform

A modern travel accommodation platform built with Node.js, Express, and MongoDB Atlas.

## 🌟 Features

- **User Authentication**: Secure login/signup with session management
- **Listing Management**: Create, edit, and manage travel accommodations
- **Interactive Maps**: Real location mapping with Leaflet + OpenStreetMap
- **Image Uploads**: Cloudinary integration for image storage
- **Reviews & Ratings**: User reviews with interactive rating system
- **Responsive Design**: Mobile-friendly interface
- **Search & Filter**: Find accommodations by location and preferences

## 🚀 Live Demo

**Deployed Application**: [Your Deployment URL Here]

## 🛠️ Technology Stack

### **Backend:**
- Node.js & Express.js
- MongoDB Atlas & Mongoose
- Passport.js Authentication
- Express Sessions (MongoDB Store)

### **Frontend:**
- EJS Templates & Bootstrap 5
- JavaScript (ES6+) & Leaflet Maps

### **Services:**
- Cloudinary (Image Storage)
- MongoDB Atlas (Database)
- OpenStreetMap (Mapping)

## 🏗️ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory with the following variables:

```env
# Cloudinary Configuration (Sign up at https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# MongoDB Connection
MONGODB_URI=mongodb://127.0.0.1:27017/project

# Session Secret
SESSION_SECRET=your-secret-key

# Port
PORT=8000
```

### 3. Cloudinary Setup
1. Sign up for a free account at [Cloudinary](https://cloudinary.com)
2. Go to your Dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to your `.env` file

### 4. Run the Application
```bash
npm start
```

## Features
- **Cloud Image Storage**: Images are stored securely on Cloudinary
- **Automatic Image Optimization**: Images are automatically resized and optimized
- **File Upload Validation**: Supports JPEG, PNG, WebP formats up to 10MB
- **Image Management**: Old images are automatically deleted when updated

## Image Upload Features
- **Auto-resize**: Images are resized to 1200x800 pixels maximum
- **Quality optimization**: Automatic quality adjustment for faster loading
- **Format support**: JPEG, JPG, PNG, WebP
- **Cloud delivery**: Fast global CDN delivery
- **Secure storage**: Images stored securely with Cloudinary
