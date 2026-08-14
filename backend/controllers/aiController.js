import Conversation from '../models/Conversation.js';
import { askAI, askAIStream } from '../services/aiService.js';

export const getHistory = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ user: req.user.id });
    if (!conversation) {
      return res.status(200).json({ success: true, data: [] });
    }
    res.status(200).json({ success: true, data: conversation.messages });
  } catch (error) {
    console.error('AI History Error:', error);
    next(error);
  }
};

export const clearHistory = async (req, res, next) => {
  try {
    await Conversation.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('AI Clear History Error:', error);
    next(error);
  }
};

export const askQuestion = async (req, res, next) => {
  try {
    const { message, contextData, stream } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Get or create conversation
    let conversation = await Conversation.findOne({ user: req.user.id });
    if (!conversation) {
      conversation = new Conversation({ user: req.user.id, messages: [] });
    }

    // Add user message
    conversation.messages.push({ role: 'user', content: message });
    
    // We only send the last 20 messages to Groq to keep context window reasonable
    const contextMessages = conversation.messages.slice(-20);

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const chatStream = await askAIStream(message, contextData, contextMessages.slice(0, -1), req.user.healthProfile);
        
        let fullResponse = '';
        
        for await (const chunk of chatStream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }

        res.write('data: [DONE]\n\n');
        res.end();

        // Save the complete response to history
        conversation.messages.push({ role: 'assistant', content: fullResponse });
        // Keep only last 100 messages in DB to prevent infinite growth
        if (conversation.messages.length > 100) {
          conversation.messages = conversation.messages.slice(-100);
        }
        await conversation.save();

      } catch (streamError) {
        console.error('Streaming error:', streamError);
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ error: 'Failed to generate response' })}\n\n`);
          res.end();
        }
      }
    } else {
      // Non-streaming response
      const responseText = await askAI(message, contextData, contextMessages.slice(0, -1), req.user.healthProfile);
      
      conversation.messages.push({ role: 'assistant', content: responseText });
      if (conversation.messages.length > 100) {
        conversation.messages = conversation.messages.slice(-100);
      }
      await conversation.save();

      res.status(200).json({
        success: true,
        data: {
          role: 'assistant',
          content: responseText
        }
      });
    }

  } catch (error) {
    console.error('AI Ask Error:', error);
    next(error);
  }
};
