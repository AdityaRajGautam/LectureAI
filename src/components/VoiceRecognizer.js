import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTranscript, createSummary, setTranscribing, clearTranscript } from '../store/slices/summarySlice';
import BrowserCompatibility from './BrowserCompatibility';
import AudioUploadInfo from './AudioUploadInfo';
import axios from 'axios';

const VoiceRecognizer = () => {
  const dispatch = useDispatch();
  const { currentTranscript, currentSummary, isTranscribing, isLoading } = useSelector((state) => state.summary);
  const { token } = useSelector((state) => state.auth);
  const [recognition, setRecognition] = React.useState(null);
  const [audioFile, setAudioFile] = React.useState(null);
  const [isTranscribingFile, setIsTranscribingFile] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);

  const handleStartRecognition = () => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech Recognition API is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Check for microphone permissions
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Microphone access is not supported in this browser.');
      return;
    }

    // Request microphone permission first
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        dispatch(setTranscribing(true));

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          console.log('Speech recognition started');
        };

        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            dispatch(setTranscript(currentTranscript + finalTranscript));
          }
          
          // Show interim results in console for debugging
          if (interimTranscript) {
            console.log('Interim:', interimTranscript);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          dispatch(setTranscribing(false));
          
          let errorMessage = 'Speech recognition error: ';
          switch(event.error) {
            case 'network':
              errorMessage += 'Network error. Please check your internet connection.';
              break;
            case 'not-allowed':
              errorMessage += 'Microphone access denied. Please allow microphone access.';
              break;
            case 'no-speech':
              errorMessage += 'No speech detected. Please try speaking again.';
              break;
            case 'audio-capture':
              errorMessage += 'Audio capture failed. Please check your microphone.';
              break;
            case 'service-not-allowed':
              errorMessage += 'Speech recognition service not allowed.';
              break;
            default:
              errorMessage += event.error;
          }
          
          alert(errorMessage);
        };

        recognition.onend = () => {
          console.log('Speech recognition ended');
          dispatch(setTranscribing(false));
        };

        try {
          recognition.start();
          setRecognition(recognition);
        } catch (error) {
          console.error('Failed to start recognition:', error);
          dispatch(setTranscribing(false));
          alert('Failed to start speech recognition. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Microphone access denied:', error);
        alert('Microphone access is required for speech recognition. Please allow microphone access and try again.');
      });
  };

  const handleSummarize = async () => {
    if (currentTranscript.trim()) {
      dispatch(createSummary({ transcript: currentTranscript.trim() }));
    }
  };

  const handleStopRecognition = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    dispatch(setTranscribing(false));
  };

  const handleClear = () => {
    dispatch(clearTranscript());
    setAudioFile(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
      } else {
        alert('Please upload an audio file.');
      }
    }
  };

  const handleAudioTranscription = async () => {
    if (!audioFile) {
      alert('Please select an audio file first.');
      return;
    }

    setIsTranscribingFile(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await axios.post(
        'http://localhost:5000/api/audio/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.transcript) {
        dispatch(setTranscript(response.data.transcript));
        alert(`Audio file "${response.data.filename}" transcribed successfully!`);
      }
    } catch (error) {
      console.error('Audio transcription error:', error);
      alert('Failed to transcribe audio file. Please try again.');
    } finally {
      setIsTranscribingFile(false);
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Voice Recognition</h2>

      <div className="mb-6">
        <p className="mb-2 text-sm text-center text-gray-600">
          Click "Start Recognition" and begin speaking. Your speech will be transcribed below.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-800">
          <p className="font-medium mb-1">📋 Requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use Chrome, Edge, or Safari for best compatibility</li>
            <li>Allow microphone access when prompted</li>
            <li>Ensure stable internet connection</li>
            <li>Speak clearly and at normal volume</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {!isTranscribing ? (
          <button
            onClick={handleStartRecognition}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            🎤 Start Recognition
          </button>
        ) : (
          <button
            onClick={handleStopRecognition}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            ⏹️ Stop Recording
          </button>
        )}
      </div>

      {/* Audio File Upload Section */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">📁 Upload Audio File</h3>
        
        {/* Drag and Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-300 ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="text-4xl text-gray-400">🎵</div>
            
            {audioFile ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-600">✓ File Selected:</p>
                <p className="text-sm text-gray-600">{audioFile.name}</p>
                <p className="text-xs text-gray-500">Size: {(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">Drag and drop your audio file here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
            )}
            
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
              id="audio-upload"
            />
            
            <label
              htmlFor="audio-upload"
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded cursor-pointer transition-colors"
            >
              Choose Audio File
            </label>
          </div>
        </div>
        
        {/* Supported Formats */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 mb-2">Supported formats:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['MP3', 'WAV', 'MP4', 'OGG', 'WebM', 'FLAC', 'AAC'].map(format => (
              <span key={format} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                {format}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Maximum file size: 50MB</p>
        </div>
        
        {/* Transcribe Button */}
        {audioFile && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={handleAudioTranscription}
              disabled={isTranscribingFile}
              className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTranscribingFile ? '🔄 Transcribing...' : '🎯 Transcribe Audio File'}
            </button>
            
            <button
              onClick={() => setAudioFile(null)}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Remove File
            </button>
          </div>
        )}
      </div>

      <div className={`mt-6 p-4 border rounded transition-colors duration-300 ${
        isTranscribing 
          ? 'border-red-400 bg-red-50' 
          : 'border-gray-300 bg-white'
      }`}>
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Transcription</h3>
          {isTranscribing && (
            <div className="ml-3 flex items-center text-red-600">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm">Listening...</span>
            </div>
          )}
        </div>
        <p className="text-gray-700 whitespace-pre-wrap min-h-[2rem]">
          {currentTranscript || (isTranscribing ? 'Start speaking...' : 'Click "Start Recognition" to begin')}
        </p>
      </div>

      {currentTranscript.trim() && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handleSummarize}
            disabled={isLoading}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Summarizing...' : 'Summarize'}
          </button>
          <button
            onClick={handleClear}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear
          </button>
        </div>
      )}

      {currentSummary && (
        <div className="mt-6 p-4 border border-green-300 rounded bg-green-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Summary</h3>
          <p className="text-gray-700">{currentSummary}</p>
        </div>
      )}
      </div>
      
      <BrowserCompatibility />
      <AudioUploadInfo />
    </div>
  );
};

export default VoiceRecognizer;

