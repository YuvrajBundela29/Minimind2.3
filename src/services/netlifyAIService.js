// Netlify AI Service for MiniMind
// This service handles all AI-related API calls through Netlify Functions

const NETLIFY_FUNCTION_URL = '/.netlify/functions/minimind-llm';

class NetlifyAIService {
  constructor() {
    this.baseUrl = NETLIFY_FUNCTION_URL;
  }

  // Generic request handler
  async _makeRequest(payload) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request was not successful');
      }
      
      return data;
    } catch (error) {
      console.error('NetlifyAIService Error:', error);
      throw new Error(`AI service unavailable: ${error.message}`);
    }
  }

  // Get an explanation for a question in a specific mode and language
  async getExplanation(question, mode, language = 'en') {
    const data = await this._makeRequest({
      question,
      mode,
      language,
      action: 'explain'
    });
    return data.content;
  }

  // Refine a question to make it better for learning
  async refinePrompt(question, language = 'en') {
    const data = await this._makeRequest({
      question,
      mode: 'thinker', // Default mode for refinement
      language,
      action: 'refine'
    });
    return data.content;
  }

  // Get a concise answer (one word or bullet points)
  async getOneWordAnswer(question, language = 'en') {
    const data = await this._makeRequest({
      question,
      mode: 'thinker', // Default mode for one-word answers
      language,
      action: 'one-word'
    });
    return data.content;
  }

  // Continue a conversation with context
  async continueConversation(messages, mode, language = 'en') {
    // For simplicity, we'll just send the last user message
    // In a real implementation, you might want to handle the full conversation history
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.role === 'user');

    if (!lastUserMessage) {
      throw new Error('No user message found in conversation history');
    }

    const data = await this._makeRequest({
      question: lastUserMessage.content,
      mode,
      language,
      action: 'explain' // Use explain action for conversation continuation
    });
    return data.content;
  }

  // Translation function - this is now handled on the client side
  // as it doesn't require any API keys
  async translateText(text, targetLanguage, sourceLanguage = 'en') {
    // This is a simplified version that doesn't make any API calls
    // In a real implementation, you might want to use a client-side translation library
    // or make a call to a translation API through your Netlify function
    console.log(`Translation requested: ${sourceLanguage} -> ${targetLanguage}`);
    return text; // Return the original text as a fallback
  }
}

export default new NetlifyAIService();
