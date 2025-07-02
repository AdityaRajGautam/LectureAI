import React from 'react';

const AudioUploadInfo = () => {
  return (
    <div className="max-w-2xl mx-auto mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800 mb-3">📄 Audio Upload Information</h3>
      
      <div className="space-y-3 text-sm text-yellow-700">
        <div>
          <p className="font-medium mb-1">🎯 How it works:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Upload an audio file using the drag-and-drop area or file picker</li>
            <li>Click "Transcribe Audio File" to process the audio</li>
            <li>The transcription will appear in the same text area as live speech</li>
            <li>You can then summarize the transcribed text normally</li>
          </ul>
        </div>

        <div>
          <p className="font-medium mb-1">⚡ Current Implementation:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Uses mock transcription for demonstration purposes</li>
            <li>In production, would integrate with real speech-to-text services like:</li>
            <li className="ml-4">• Google Speech-to-Text API</li>
            <li className="ml-4">• OpenAI Whisper API</li>
            <li className="ml-4">• AWS Transcribe</li>
            <li className="ml-4">• Azure Speech Services</li>
          </ul>
        </div>

        <div>
          <p className="font-medium mb-1">💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use clear, high-quality audio files for best results</li>
            <li>Shorter files (under 10 minutes) typically process faster</li>
            <li>WAV and MP3 formats generally work best</li>
            <li>Files are automatically deleted after processing for privacy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AudioUploadInfo;
