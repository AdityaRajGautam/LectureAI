// const express = require('express');
// const auth = require('../middleware/auth');
// const { 
//   generateHaiku, 
//   extractKeyPoints, 
//   checkOpenAIStatus,
//   summarizeTextWithAI 
// } = require('../services/openaiService');

// const router = express.Router();

// // Check OpenAI API status
// router.get('/status', (req, res) => {
//   try {
//     const status = checkOpenAIStatus();
//     res.json({
//       ...status,
//       timestamp: new Date().toISOString(),
//       message: status.apiKeyConfigured ? 
//         'OpenAI API is configured and ready' : 
//         'OpenAI API key not configured'
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       message: 'Error checking OpenAI status', 
//       error: error.message 
//     });
//   }
// });

// // Generate a haiku (example from your original request)
// router.post('/haiku', auth, async (req, res) => {
//   try {
//     const { topic } = req.body;
//     const haiku = await generateHaiku(topic || 'AI');
    
//     res.json({
//       haiku: haiku,
//       topic: topic || 'AI',
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     console.error('Haiku generation error:', error);
//     res.status(500).json({ 
//       message: 'Failed to generate haiku', 
//       error: error.message 
//     });
//   }
// });

// // Extract key points from text
// router.post('/key-points', auth, async (req, res) => {
//   try {
//     const { text } = req.body;
    
//     if (!text || text.trim().length === 0) {
//       return res.status(400).json({ message: 'Text is required' });
//     }

//     const keyPoints = await extractKeyPoints(text.trim());
    
//     res.json({
//       keyPoints: keyPoints,
//       originalLength: text.length,
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     console.error('Key points extraction error:', error);
//     res.status(500).json({ 
//       message: 'Failed to extract key points', 
//       error: error.message 
//     });
//   }
// });

// // Enhanced summarization endpoint
// router.post('/summarize', auth, async (req, res) => {
//   try {
//     const { text } = req.body;
    
//     if (!text || text.trim().length === 0) {
//       return res.status(400).json({ message: 'Text is required' });
//     }

//     const summary = await summarizeTextWithAI(text.trim());
    
//     res.json({
//       summary: summary,
//       originalLength: text.length,
//       summaryLength: summary.length,
//       compressionRatio: (summary.length / text.length * 100).toFixed(2) + '%',
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     console.error('AI summarization error:', error);
//     res.status(500).json({ 
//       message: 'Failed to summarize text', 
//       error: error.message 
//     });
//   }
// });

// module.exports = router;
