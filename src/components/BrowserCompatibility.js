import React from 'react';

const BrowserCompatibility = () => {
  const checkBrowserSupport = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasMediaDevices = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    const isSecureContext = window.isSecureContext || window.location.protocol === 'https:';
    
    return {
      speechRecognition: !!SpeechRecognition,
      mediaDevices: !!hasMediaDevices,
      secureContext: isSecureContext,
      userAgent: navigator.userAgent
    };
  };

  const support = checkBrowserSupport();
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  const isEdge = /Edg/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
  const isFirefox = /Firefox/.test(navigator.userAgent);

  const getBrowserRecommendation = () => {
    if (isChrome) return { name: 'Chrome', status: 'excellent', color: 'green' };
    if (isEdge) return { name: 'Edge', status: 'excellent', color: 'green' };
    if (isSafari) return { name: 'Safari', status: 'good', color: 'yellow' };
    if (isFirefox) return { name: 'Firefox', status: 'limited', color: 'orange' };
    return { name: 'Unknown', status: 'unsupported', color: 'red' };
  };

  const browser = getBrowserRecommendation();

  return (
    <div className="max-w-2xl mx-auto mt-4 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">🔧 Browser Compatibility Status</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${support.speechRecognition ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">Speech Recognition API: {support.speechRecognition ? 'Supported' : 'Not Supported'}</span>
          </div>
          
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${support.mediaDevices ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">Microphone Access: {support.mediaDevices ? 'Available' : 'Not Available'}</span>
          </div>
          
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${support.secureContext ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">Secure Context: {support.secureContext ? 'Yes (HTTPS)' : 'No (HTTP)'}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 bg-${browser.color}-500`}></span>
            <span className="text-sm">Browser: {browser.name} ({browser.status})</span>
          </div>
        </div>
      </div>

      {(!support.speechRecognition || !support.mediaDevices) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ Compatibility Issues Detected</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {!support.speechRecognition && (
              <li>• Speech Recognition API is not supported in this browser</li>
            )}
            {!support.mediaDevices && (
              <li>• Microphone access is not available</li>
            )}
            {!support.secureContext && (
              <li>• Secure context (HTTPS) required for microphone access</li>
            )}
          </ul>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <h4 className="font-medium text-blue-800 mb-2">💡 Troubleshooting Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use Chrome or Edge for best compatibility</li>
          <li>• Ensure you're on HTTPS (not HTTP)</li>
          <li>• Check microphone permissions in browser settings</li>
          <li>• Make sure your microphone is working and not muted</li>
          <li>• Try refreshing the page and allowing permissions again</li>
          <li>• Check if other applications are using your microphone</li>
        </ul>
      </div>
    </div>
  );
};

export default BrowserCompatibility;
