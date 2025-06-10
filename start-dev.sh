#!/bin/bash

# Motion Connect Development Startup Script

echo "🎵 Starting Motion Connect Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install backend dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server && npm install && cd ..
fi

# Start backend server in background
echo "🚀 Starting backend server on port 3001..."
cd server && npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend development server
echo "🎨 Starting frontend development server on port 5173..."
npm run dev &
FRONTEND_PID=$!

# Function to cleanup processes on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "✅ Motion Connect is running!"
echo "📚 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3001"
echo "🗄️ Database: server/motionconnect.db"
echo ""
echo "Demo credentials:"
echo "Email: demo@motionconnect.com"
echo "Password: password123"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait
