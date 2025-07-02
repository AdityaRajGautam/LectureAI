#!/bin/bash

echo "Starting Voice Recognizer Application..."
echo "======================================="

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   sudo systemctl start mongod"
    echo "   or"
    echo "   mongod"
    echo ""
fi

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🚀 Starting frontend server..."
cd ..
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Application started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo ""
echo "To stop the application, press Ctrl+C or run:"
echo "kill $BACKEND_PID $FRONTEND_PID"

# Wait for user to stop
wait
