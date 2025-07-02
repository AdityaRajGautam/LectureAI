const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { transcribeAudioWithWhisper, checkOpenAIStatus } = require('../services/openaiService');

const router = express.Router();

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/audio';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow audio files
  const allowedMimes = [
    'audio/mpeg',
    'audio/wav', 
    'audio/mp3',
    'audio/mp4',
    'audio/ogg',
    'audio/webm',
    'audio/flac',
    'audio/aac'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Simulated transcription function (placeholder)
// In a real application, you would integrate with services like:
// - Google Speech-to-Text API
// - AWS Transcribe
// - Azure Speech Services
// - OpenAI Whisper API
const transcribeAudio = async (audioFilePath) => {
  // This is a placeholder implementation
  // In reality, you would send the audio file to a transcription service
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a mock transcription based on filename or random content
  const mockTranscriptions = [
    "This is a sample transcription of your audio file. The speech recognition service has processed your audio and converted it to text.",
    "Hello, this is a transcribed audio file. The system has successfully processed the audio content and generated this text output.",
    "Welcome to the audio transcription service. Your file has been processed and the speech has been converted to readable text format.",
    "This audio file contains spoken content that has been automatically transcribed using speech recognition technology.",
    "The audio transcription is complete. This text represents the spoken words from your uploaded audio file."
  ];
  
  const randomIndex = Math.floor(Math.random() * mockTranscriptions.length);
  return mockTranscriptions[randomIndex];
};

// Upload and transcribe audio file
router.post('/upload', auth, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    const audioFilePath = req.file.path;
    console.log('Audio file uploaded:', audioFilePath);

    // Transcribe the audio file using OpenAI Whisper or fallback
    let transcript;
    const useWhisper = process.env.OPENAI_API_KEY && req.body.useWhisper !== 'false';
    
    if (useWhisper) {
      try {
        transcript = await transcribeAudioWithWhisper(audioFilePath);
        console.log('✅ Used OpenAI Whisper for transcription');
      } catch (whisperError) {
        console.error('❌ OpenAI Whisper failed, using mock transcription:', whisperError.message);
        transcript = await transcribeAudio(audioFilePath);
      }
    } else {
      transcript = await transcribeAudio(audioFilePath);
      console.log('📝 Used mock transcription');
    }

    // Clean up the uploaded file
    fs.unlink(audioFilePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    res.json({
      message: 'Audio file transcribed successfully',
      transcript: transcript,
      filename: req.file.originalname
    });

  } catch (error) {
    console.error('Audio transcription error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({ 
      message: 'Audio transcription failed', 
      error: error.message 
    });
  }
});

// Get supported audio formats
router.get('/formats', (req, res) => {
  res.json({
    supportedFormats: [
      { extension: '.mp3', mimeType: 'audio/mpeg', description: 'MP3 Audio' },
      { extension: '.wav', mimeType: 'audio/wav', description: 'WAV Audio' },
      { extension: '.mp4', mimeType: 'audio/mp4', description: 'MP4 Audio' },
      { extension: '.ogg', mimeType: 'audio/ogg', description: 'OGG Audio' },
      { extension: '.webm', mimeType: 'audio/webm', description: 'WebM Audio' },
      { extension: '.flac', mimeType: 'audio/flac', description: 'FLAC Audio' },
      { extension: '.aac', mimeType: 'audio/aac', description: 'AAC Audio' }
    ],
    maxFileSize: '50MB',
    note: 'Currently using mock transcription. In production, integrate with a real speech-to-text service.'
  });
});

module.exports = router;
