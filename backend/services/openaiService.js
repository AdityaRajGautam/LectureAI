// const OpenAI = require('openai');

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Enhanced text summarization using OpenAI
// const summarizeTextWithAI = async (text) => {
//   try {
//     if (!text || text.trim().length === 0) {
//       throw new Error('Text is required for summarization');
//     }

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: `You are a helpful assistant that creates concise, informative summaries. 
//                    Extract the most important points and key information from the provided text. 
//                    Keep the summary clear, well-structured, and easy to understand.
//                    Focus on the main ideas, important details, and any actionable items.`
//         },
//         {
//           role: "user",
//           content: `Please summarize the following text, highlighting the most important points:\n\n${text}`
//         }
//       ],
//       max_tokens: 500,
//       temperature: 0.3,
//     });

//     return completion.choices[0].message.content.trim();
//   } catch (error) {
//     console.error('OpenAI summarization error:', error);
//     throw new Error(`AI summarization failed: ${error.message}`);
//   }
// };

// // Generate key points from text
// const extractKeyPoints = async (text) => {
//   try {
//     if (!text || text.trim().length === 0) {
//       throw new Error('Text is required for key point extraction');
//     }

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: `You are an expert at extracting key points from text. 
//                    Analyze the provided text and extract the most important points as a bulleted list.
//                    Each point should be concise but informative.
//                    Focus on main ideas, important facts, decisions, and actionable items.`
//         },
//         {
//           role: "user",
//           content: `Extract the key points from the following text:\n\n${text}`
//         }
//       ],
//       max_tokens: 300,
//       temperature: 0.2,
//     });

//     return completion.choices[0].message.content.trim();
//   } catch (error) {
//     console.error('OpenAI key points extraction error:', error);
//     throw new Error(`Key points extraction failed: ${error.message}`);
//   }
// };

// // Generate a creative haiku (example from your request)
// const generateHaiku = async (topic = "AI") => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       store: true,
//       messages: [
//         {
//           role: "user",
//           content: `Write a haiku about ${topic}`
//         }
//       ],
//       max_tokens: 100,
//       temperature: 0.7,
//     });

//     return completion.choices[0].message.content.trim();
//   } catch (error) {
//     console.error('OpenAI haiku generation error:', error);
//     throw new Error(`Haiku generation failed: ${error.message}`);
//   }
// };

// // Transcribe audio using OpenAI Whisper (for future implementation)
// const transcribeAudioWithWhisper = async (audioFilePath) => {
//   try {
//     const fs = require('fs');
    
//     if (!fs.existsSync(audioFilePath)) {
//       throw new Error('Audio file not found');
//     }

//     const transcription = await openai.audio.transcriptions.create({
//       file: fs.createReadStream(audioFilePath),
//       model: "whisper-1",
//       language: "en",
//       response_format: "text"
//     });

//     return transcription;
//   } catch (error) {
//     console.error('OpenAI Whisper transcription error:', error);
//     throw new Error(`Audio transcription failed: ${error.message}`);
//   }
// };

// // Check if OpenAI API is available
// const checkOpenAIStatus = () => {
//   return {
//     apiKeyConfigured: !!process.env.OPENAI_API_KEY,
//     clientInitialized: !!openai,
//     models: {
//       textGeneration: "gpt-4o-mini",
//       audioTranscription: "whisper-1"
//     }
//   };
// };

// module.exports = {
//   summarizeTextWithAI,
//   extractKeyPoints,
//   generateHaiku,
//   transcribeAudioWithWhisper,
//   checkOpenAIStatus
// };
