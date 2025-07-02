# Voice Recognizer App

A full-stack React application with voice recognition, transcription, and text summarization features. Users can register, login, record speech, transcribe it, create summaries, and view their saved summaries.

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **Voice Recognition**: Real-time speech-to-text using Web Speech API
- **Text Summarization**: Automatic summarization of transcribed text
- **User Dashboard**: View and manage all personal summaries
- **Responsive Design**: Built with TailwindCSS for modern UI

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- TailwindCSS for styling
- Web Speech API for voice recognition
- Axios for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (running locally or connection to MongoDB Atlas)
- A modern web browser (Chrome recommended for Web Speech API)

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 2. Frontend Setup

```bash
# In the root directory
npm install

# Start the frontend development server
npm start
```

The React app will start on `http://localhost:3000`

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or if using MongoDB service
sudo systemctl start mongod
```

## Usage

1. **Register/Login**: Create a new account or login with existing credentials
2. **Voice Recognition**: Click "Start Recognition" and speak into your microphone
3. **View Transcription**: Your speech will be transcribed in real-time
4. **Create Summary**: Click "Summarize" to generate a summary of the transcribed text
5. **View Summaries**: Navigate to "My Summaries" to see all your saved summaries
6. **Manage Summaries**: Delete summaries you no longer need

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Summaries
- `POST /api/summaries/create` - Create new summary (protected)
- `GET /api/summaries/user` - Get user's summaries (protected)
- `DELETE /api/summaries/:id` - Delete summary (protected)

## Browser Compatibility

The Web Speech API requires:
- Chrome 25+
- Edge 79+
- Safari 14.1+
- Firefox (with flag enabled)

For best results, use Chrome or Edge.

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes requiring authentication
- User-specific data access control

## Troubleshooting

### Common Issues

1. **Microphone Access**: Ensure your browser has microphone permissions
2. **MongoDB Connection**: Verify MongoDB is running and connection string is correct
3. **CORS Issues**: Backend CORS is configured for development
4. **JWT Errors**: Check if JWT_SECRET is set in backend .env file

### Error Messages

- "Microphone not accessible": Grant microphone permission in browser settings
- "MongoDB connection failed": Check if MongoDB service is running
- "Token is not valid": Login again to refresh authentication token

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
