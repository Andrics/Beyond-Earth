# 🗄️ MongoDB Setup Guide for Beyond Earth

This guide will help you set up MongoDB for the Beyond Earth project.

## 📋 Table of Contents
1. [Installation Options](#installation-options)
2. [Database Structure](#database-structure)
3. [Connection Setup](#connection-setup)
4. [Initializing the Database](#initializing-the-database)
5. [Useful Queries](#useful-queries)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Installation Options

### Option 1: Local MongoDB Installation

#### For Ubuntu/Debian:
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### For macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### For Windows:
1. Download MongoDB from [mongodb.com/download](https://www.mongodb.com/try/download/community)
2. Run the installer
3. MongoDB will start automatically as a Windows service

#### Verify Installation:
```bash
mongod --version
mongo --version  # or mongosh for newer versions
```

### Option 2: MongoDB Atlas (Cloud - Recommended for Easy Setup)

1. **Create Account**: Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**: 
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select your region
   - Click "Create"
3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
4. **Whitelist IP Address**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your IP
5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `beyond-earth` (or your preferred name)

---

## 📊 Database Structure

MongoDB is a NoSQL database, so it uses **Collections** (similar to tables) instead of tables. Mongoose will automatically create these collections when you first insert data.

### Collections in Beyond Earth:

#### 1. **users** Collection
Stores user accounts and subscription information.

**Schema Fields:**
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (String: 'user' or 'admin', default: 'user')
- `subscription` (Object):
  - `plan` (String: 'none', 'monthly', 'yearly', 'premium')
  - `startDate` (Date)
  - `endDate` (Date)
  - `isActive` (Boolean)
- `createdAt` (Date)

#### 2. **bookings** Collection
Stores Mars trip bookings.

**Schema Fields:**
- `user` (ObjectId, reference to User)
- `tripType` (String: 'mars')
- `mainTicket` (Object):
  - `spaceship` (Boolean)
  - `landing` (Boolean)
  - `galaxyViewing` (Boolean)
  - `basicTour` (Boolean)
- `additionalActivities` (Array of Objects):
  - `activityType` (String)
  - `booked` (Boolean)
  - `bookingDate` (Date)
  - `price` (Number)
- `flightDate` (Date, required)
- `totalPrice` (Number, required)
- `status` (String: 'pending', 'confirmed', 'completed', 'cancelled')
- `paymentStatus` (String: 'pending', 'paid', 'refunded')
- `spaceshipLocation` (Object):
  - `latitude` (Number)
  - `longitude` (Number)
  - `altitude` (Number)
  - `lastUpdated` (Date)
- `createdAt` (Date)

#### 3. **landpurchases** Collection
Stores land purchases on Mars.

**Schema Fields:**
- `user` (ObjectId, reference to User)
- `booking` (ObjectId, reference to Booking)
- `landType` (String: 'residential', 'commercial', 'luxury')
- `size` (Number, required)
- `price` (Number, required)
- `coordinates` (Object):
  - `latitude` (Number)
  - `longitude` (Number)
- `ownershipCertificate` (Object):
  - `certificateNumber` (String)
  - `issueDate` (Date)
  - `registrationDetails` (String)
- `mapLocation` (String)
- `status` (String: 'pending', 'confirmed', 'registered')
- `createdAt` (Date)

#### 4. **activities** Collection
Stores available activities for booking.

**Schema Fields:**
- `name` (String, required)
- `type` (String: 'mars-walking', 'rover-ride', 'photography', 'souvenirs', 'land-purchase', 'moon-walking')
- `description` (String, required)
- `price` (Number, required)
- `duration` (String, required)
- `available` (Boolean, default: true)
- `image` (String)
- `planet` (String: 'mars', 'moon', 'venus', 'jupiter')

---

## 🔌 Connection Setup

### Step 1: Create `.env` file

In the `backend` directory, create a `.env` file:

```bash
cd backend
cp .env.example .env
```

### Step 2: Configure Connection String

#### For Local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/beyond-earth
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
```

#### For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/beyond-earth?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
```

**Important**: Replace:
- `username` with your Atlas database username
- `password` with your Atlas database password
- `cluster0.xxxxx` with your actual cluster address
- `beyond-earth` is the database name (you can change this)

### Step 3: Test Connection

Start your backend server:
```bash
cd backend
npm start
```

You should see:
```
MongoDB Connected
Server running on port 5000
```

If you see an error, check the [Troubleshooting](#troubleshooting) section.

---

## 🌱 Initializing the Database

### Step 1: Seed Activities

The project includes a seed script to populate the `activities` collection:

```bash
cd backend
npm run seed
```

This will:
- Clear existing activities
- Insert 6 default activities:
  - Mars Walking Tours ($25,000)
  - Mars Rover Ride ($50,000)
  - Galaxy Space Photography Session ($15,000)
  - Mars Souvenir Collection ($10,000)
  - Buy Land on Mars ($50,000)
  - Moon Walking Experience ($30,000)

**Expected Output:**
```
Connected to MongoDB
Cleared existing activities
Seeded activities: 6
```

### Step 2: Verify Collections

Collections are created automatically when you:
1. Run the seed script (creates `activities`)
2. Register a user (creates `users`)
3. Create a booking (creates `bookings`)
4. Purchase land (creates `landpurchases`)

---

## 🔍 Useful Queries

### Using MongoDB Shell (mongosh) or MongoDB Compass

#### Connect to Database:
```bash
# Local
mongosh mongodb://localhost:27017/beyond-earth

# Atlas (use connection string from Atlas dashboard)
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/beyond-earth"
```

### View All Collections:
```javascript
show collections
```

### View All Users:
```javascript
db.users.find().pretty()
```

### View All Bookings:
```javascript
db.bookings.find().pretty()
```

### View All Activities:
```javascript
db.activities.find().pretty()
```

### View All Land Purchases:
```javascript
db.landpurchases.find().pretty()
```

### Count Documents:
```javascript
db.users.countDocuments()
db.bookings.countDocuments()
db.activities.countDocuments()
db.landpurchases.countDocuments()
```

### Find Specific User:
```javascript
db.users.findOne({ email: "user@example.com" })
```

### Find Bookings by User:
```javascript
// First, get user ID
const user = db.users.findOne({ email: "user@example.com" })
// Then find bookings
db.bookings.find({ user: user._id }).pretty()
```

### Update Booking Status:
```javascript
db.bookings.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: "confirmed", paymentStatus: "paid" } }
)
```

### Delete All Test Data (Use with Caution!):
```javascript
db.users.deleteMany({})
db.bookings.deleteMany({})
db.landpurchases.deleteMany({})
// Keep activities - they're needed!
```

---

## 🛠️ Troubleshooting

### Error: "MongoServerError: Authentication failed"

**Solution:**
- Check your username and password in the connection string
- For Atlas: Make sure you're using the database user password, not your Atlas account password
- Verify the user has proper permissions

### Error: "MongoNetworkError: connect ECONNREFUSED"

**Solution:**
- **Local MongoDB**: Make sure MongoDB service is running
  ```bash
  # Linux
  sudo systemctl status mongod
  sudo systemctl start mongod
  
  # macOS
  brew services list
  brew services start mongodb-community
  
  # Windows: Check Services app
  ```

### Error: "MongoNetworkTimeoutError"

**Solution:**
- **Atlas**: Check your IP whitelist in Network Access
- Check your internet connection
- Verify the connection string is correct

### Error: "MongooseError: Operation `users.insertOne()` buffering timed out"

**Solution:**
- MongoDB is not running or not accessible
- Check connection string
- Verify network/firewall settings

### Database Not Found

**Solution:**
- MongoDB creates databases automatically on first write
- Make sure you've run the seed script or created at least one document
- Check connection string includes database name

### Collections Not Showing

**Solution:**
- Collections are created when first document is inserted
- Run `npm run seed` to create activities
- Register a user to create users collection
- Create a booking to create bookings collection

---

## 📝 Quick Reference

### Connection Strings:

**Local:**
```
mongodb://localhost:27017/beyond-earth
```

**Atlas:**
```
mongodb+srv://username:password@cluster.mongodb.net/beyond-earth?retryWrites=true&w=majority
```

### Environment Variables:
```env
MONGODB_URI=your_connection_string_here
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

### Common Commands:
```bash
# Start backend
cd backend && npm start

# Seed database
cd backend && npm run seed

# Check MongoDB status (Linux)
sudo systemctl status mongod

# Connect to MongoDB shell
mongosh mongodb://localhost:27017/beyond-earth
```

---

## ✅ Verification Checklist

- [ ] MongoDB installed and running (or Atlas cluster created)
- [ ] `.env` file created in `backend` directory
- [ ] Connection string configured correctly
- [ ] Backend server starts without errors
- [ ] Seed script runs successfully (`npm run seed`)
- [ ] Can see "MongoDB Connected" message
- [ ] Collections appear after seeding/using the app

---

## 🎯 Next Steps

Once MongoDB is set up:
1. ✅ Run `npm run seed` to populate activities
2. ✅ Start your backend: `npm start`
3. ✅ Start your frontend: `cd ../frontend && npm start`
4. ✅ Register a user through the web interface
5. ✅ Verify data appears in MongoDB

Happy coding! 🚀

