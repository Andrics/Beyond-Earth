# 🚀 Quick Start Guide

Get your Beyond Earth project up and running in minutes!

## Prerequisites
- Node.js (v14+)
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn

## Step-by-Step Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and set:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A random secret key for JWT tokens
- `PORT` - Server port (default: 5000)

Seed the database:
```bash
npm run seed
```

Start the server:
```bash
npm start
# or for development:
npm run dev
```

Backend should be running on `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

(Optional) Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

Frontend should open automatically at `http://localhost:3000`

## 🎯 First Steps

1. **Register a new account** at `/register`
2. **Login** at `/login`
3. **Book a trip to Mars** at `/booking`
4. **Explore activities** at `/activities`
5. **Subscribe for premium content** at `/subscription`
6. **Purchase land on Mars** at `/land-purchase`
7. **View your dashboard** at `/dashboard`

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod` or check your MongoDB Atlas connection string
- Verify the connection string in `.env`

### Port Already in Use
- Change the PORT in backend `.env`
- Update `REACT_APP_API_URL` in frontend `.env` if changed

### CORS Errors
- Ensure backend is running before starting frontend
- Check that API URL in frontend matches backend port

### Activities Not Showing
- Run `npm run seed` in the backend directory
- Check MongoDB connection

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the API endpoints
- Customize the UI and add your own features!

Happy coding! 🚀👨‍🚀

