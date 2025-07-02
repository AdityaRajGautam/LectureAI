const express = require('express');
const Summary = require('../models/Summary');
const auth = require('../middleware/auth');
// const { summarizeTextWithAI, extractKeyPoints } = require('../services/openaiService');

const router = express.Router();

// Simple text summarization function
function summarizeText(text) {
  // This is a basic summarization algorithm
  // In a real application, you might want to use a more sophisticated NLP library
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length <= 3) {
    return text;
  }
  
  // For now, we'll just take the first few sentences as a simple summary
  const summary = sentences.slice(0, Math.ceil(sentences.length / 3)).join('. ') + '.';
  
  // Add some key points extraction (simplified)
  const keyWords = ['important', 'key', 'main', 'primary', 'essential', 'critical'];
  const keyPoints = sentences.filter(sentence => 
    keyWords.some(word => sentence.toLowerCase().includes(word))
  );
  
  let finalSummary = summary;
  if (keyPoints.length > 0) {
    finalSummary += ' Key points: ' + keyPoints.slice(0, 2).join('. ') + '.';
  }
  
  return finalSummary;
}

// Create summary
router.post('/create', auth, async (req, res) => {
  const { transcript, useAI = true } = req.body;
  
  try {
    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({ message: 'Transcript is required' });
    }

    let summaryText;
    
    // Try to use OpenAI first, fallback to basic summarization if it fails
    if (useAI && process.env.OPENAI_API_KEY) {
      try {
        summaryText = await summarizeTextWithAI(transcript.trim());
        console.log('✅ Used OpenAI for summarization');
      } catch (aiError) {
        console.error('❌ OpenAI summarization failed, using fallback:', aiError.message);
        summaryText = summarizeText(transcript);
      }
    } else {
      summaryText = summarizeText(transcript);
      console.log('📝 Used basic summarization');
    }
    
    const summary = new Summary({
      user: req.user._id,
      transcript: transcript.trim(),
      summary: summaryText,
    });

    await summary.save();
    res.status(201).json(summary);
  } catch (error) {
    console.error('Summary creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user summaries
router.get('/user', auth, async (req, res) => {
  try {
    const summaries = await Summary.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete summary
router.delete('/:id', auth, async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);
    
    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }
    
    if (summary.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Summary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Summary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
