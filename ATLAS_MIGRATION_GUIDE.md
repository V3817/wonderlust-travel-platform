# MongoDB Atlas Migration Guide

## 🚀 Complete Guide to Migrate from Local MongoDB to MongoDB Atlas

### Step 1: Create MongoDB Atlas Account

1. **Visit**: https://www.mongodb.com/atlas
2. **Sign up** for a free account
3. **Verify** your email address

### Step 2: Create a Cluster

1. **Create a new project** (or use existing)
2. **Click "Build a Database"**
3. **Choose "Free" tier** (M0 Sandbox)
4. **Select cloud provider** (AWS recommended)
5. **Choose region** (closest to your users)
6. **Name your cluster** (e.g., "WonderLust-Cluster")
7. **Click "Create Cluster"**

### Step 3: Configure Database Access

1. **Go to "Database Access"** in the left sidebar
2. **Click "Add New Database User"**
3. **Choose "Password" authentication**
4. **Create username and password** (remember these!)
5. **Set privileges to "Built-in Role: Atlas admin"**
6. **Click "Add User"**

### Step 4: Configure Network Access

1. **Go to "Network Access"** in the left sidebar
2. **Click "Add IP Address"**
3. **Choose "Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add your specific IP for security
4. **Click "Confirm"**

### Step 5: Get Connection String

1. **Go to "Clusters"** in the left sidebar
2. **Click "Connect"** on your cluster
3. **Choose "Connect your application"**
4. **Select "Node.js" and latest version**
5. **Copy the connection string**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Your .env File

Replace the connection string in your `.env` file:

```env
# Replace with your actual Atlas connection string
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/wonderlust?retryWrites=true&w=majority
```

**Important**: 
- Replace `<username>` with your database username
- Replace `<password>` with your database password
- Replace `your-cluster` with your actual cluster name
- Add `/wonderlust` before the `?` to specify database name

### Step 7: Run Migration Script

1. **Make sure your local MongoDB is running**
2. **Update .env with your Atlas connection string**
3. **Run the migration**:
   ```bash
   node migrate-to-atlas.js
   ```

### Step 8: Test Your Application

1. **Start your application**:
   ```bash
   node app.js
   ```
2. **Check the console** - you should see:
   ```
   ✅ Connected to MongoDB Atlas successfully
   📍 Database: MongoDB Atlas (Cloud)
   ```

## 🔧 Troubleshooting

### Common Issues:

1. **Authentication Error**
   - Double-check username/password in connection string
   - Ensure user has proper permissions

2. **Network Error**
   - Check if your IP is whitelisted in Network Access
   - Try allowing access from anywhere (0.0.0.0/0)

3. **Connection Timeout**
   - Check your internet connection
   - Verify cluster is running

4. **Database Not Found**
   - Make sure you added the database name to connection string
   - Example: `/wonderlust?retryWrites=true&w=majority`

## 🎉 Benefits of MongoDB Atlas

- ✅ **Automatic Backups**: Your data is automatically backed up
- ✅ **High Availability**: 99.995% uptime SLA
- ✅ **Global Deployment**: Deploy closer to your users
- ✅ **Security**: Built-in security features
- ✅ **Monitoring**: Real-time performance insights
- ✅ **Scalability**: Easy to scale as your app grows

## 📱 Next Steps

After successful migration:

1. **Test all features** of your application
2. **Monitor performance** in Atlas dashboard
3. **Set up alerts** for important metrics
4. **Consider backup strategies** for production
5. **Update deployment scripts** to use Atlas

Your WonderLust application is now cloud-ready! 🚀
