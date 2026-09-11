# Render Deployment Guide for WonderLust

## 🚀 Deploy to Render (Recommended)

Render is the easiest platform to deploy your WonderLust application. Follow these steps:

### **Step 1: Prepare Your Code**

1. **Run deployment checker**:
   ```bash
   node check-deployment.js
   ```

2. **Fix any issues** found by the checker

### **Step 2: Git Setup**

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - WonderLust travel platform"
   ```

2. **Create GitHub repository**:
   - Go to https://github.com/new
   - Name: `wonderlust-travel-platform`
   - Description: `A modern travel accommodation platform`
   - Make it public or private

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/wonderlust-travel-platform.git
   git branch -M main
   git push -u origin main
   ```

### **Step 3: Render Setup**

1. **Create Render Account**:
   - Go to https://render.com
   - Sign up with GitHub (recommended)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `wonderlust-travel-platform`

### **Step 4: Configure Render**

#### **Basic Settings:**
- **Name**: `wonderlust-travel-platform`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### **Environment Variables:**
Click "Advanced" and add these environment variables:

```env
MONGODB_URI=mongodb+srv://pradhanmanash614_db_user:ykkR67OQwX3TZo35@cluster0.mfyuq4q.mongodb.net/wonderlust?retryWrites=true&w=majority&appName=Cluster0

SESSION_SECRET=1443813f07da7f12faa7f81dcbeb3107955b9a3abe596f3a69aca80c0537ae11808993a1343b2e857ed4405329cd3817af6a08177c5c0fa175d4bbc1c74ed906

CLOUDINARY_CLOUD_NAME=dxyhb3klp

CLOUDINARY_API_KEY=199664627241514

CLOUDINARY_API_SECRET=LON9D7k8eXSd2momEizgCg4cwx4

NODE_ENV=production
```

### **Step 5: Deploy**

1. **Click "Create Web Service"**
2. **Wait for deployment** (5-10 minutes)
3. **Check logs** for any errors

### **Step 6: Verify Deployment**

Your app will be available at: `https://wonderlust-travel-platform.onrender.com`

**Test these features:**
- [ ] Home page loads
- [ ] User registration works
- [ ] User login works
- [ ] Create new listing
- [ ] Upload images
- [ ] View listings with maps
- [ ] Add reviews

### **Step 7: Custom Domain (Optional)**

1. **Purchase domain** (e.g., `wonderlust.com`)
2. **In Render dashboard**:
   - Go to your service
   - Click "Settings" → "Custom Domains"
   - Add your domain
   - Configure DNS as instructed

### **Step 8: Monitor Your App**

#### **Render Dashboard:**
- Monitor deployment logs
- Check resource usage
- View traffic analytics

#### **MongoDB Atlas:**
- Monitor database performance
- Check connection logs
- Review data usage

### **🔧 Troubleshooting**

#### **Build Fails:**
- Check package.json for correct start script
- Verify all dependencies are in package.json
- Check build logs for specific errors

#### **Runtime Errors:**
- Verify environment variables are set correctly
- Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
- Review application logs in Render dashboard

#### **Database Connection Issues:**
- Confirm MongoDB URI is correct
- Check Atlas user permissions
- Verify network access settings

### **📈 Scaling**

#### **Free Tier Limitations:**
- Sleeps after 15 minutes of inactivity
- 512MB RAM
- Shared CPU

#### **Upgrade Options:**
- **Starter Plan ($7/month)**:
  - Always online
  - 512MB RAM
  - Shared CPU

- **Standard Plan ($25/month)**:
  - 2GB RAM
  - Dedicated CPU
  - Custom domains

### **🎉 Success!**

Your WonderLust application is now live and accessible worldwide!

**Share your deployment:**
- URL: `https://wonderlust-travel-platform.onrender.com`
- GitHub: `https://github.com/yourusername/wonderlust-travel-platform`

### **📞 Support**

If you encounter issues:
1. Check Render documentation: https://render.com/docs
2. Review application logs in Render dashboard
3. Check MongoDB Atlas monitoring
4. Verify Cloudinary configuration

---

**🌟 Congratulations! Your travel platform is now live on the internet! 🌟**
