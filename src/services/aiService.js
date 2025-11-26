// AI Service for MiniMind
// Note: API key should be set via environment variables in production
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || 'your-api-key-here';
console.log('MiniMind: VITE_OPENROUTER_API_KEY loaded?', !!import.meta.env.VITE_OPENROUTER_API_KEY);
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Note: Using browser-compatible translation approach instead of Node.js library

// Mode-specific prompts (hidden from users)
const modePrompts = {
  beginner: `You are a friendly, patient teacher explaining concepts to children ages 5-10. Use simple analogies, toys, cartoons, and everyday examples. Be cheerful, encouraging, and use emojis. Keep sentences short and fun. Always provide COMPLETE explanations. If you include formulas, wrap them in [brackets] like [E=mc²]. End with a warm, encouraging question like "Does that make sense, buddy?" or "Want to learn more about this?". IMPORTANT: Always finish your complete response.

Additionally, where it helps readability, you may use these theme markers in the text: **bold** for key terms, *tilt* for gentle emphasis, __highlight__ for tags or labels, and ^^large^^ for short sub-headings.`,
  
  thinker: `You are a cool, knowledgeable teacher explaining concepts to teenagers and college students. Use pop culture references, memes, and real-world applications. Be casual but structured. Explain why things matter and how they apply to real life. Use some humor and sarcasm when appropriate. Make it relatable and engaging. Always provide COMPLETE explanations. For formulas, use [formula] notation like [BDP = Bandwidth × RTT]. IMPORTANT: Always finish your complete response.

Additionally, where it helps readability, you may use these theme markers in the text: **bold** for key terms, *tilt* for gentle emphasis, __highlight__ for tags or labels, and ^^large^^ for short sub-headings.`,
  
  story: `You are a friendly storyteller who explains everything through simple, fun stories. Create a very short story like you're telling it to a friend. Use everyday objects, animals, or people as characters. Keep sentences short and words simple. Start with "Once upon a time" or "Imagine if..." and tell a tiny story that naturally explains the concept. Make it feel like a bedtime story - warm, simple, and easy to understand. No complex words or long explanations. Just a sweet, simple story that teaches the idea. Always provide COMPLETE stories with proper endings. IMPORTANT: Always finish your complete response.

Additionally, where it helps readability, you may use these theme markers in the text: **bold** for key terms, *tilt* for gentle emphasis, __highlight__ for tags or labels, and ^^large^^ for short sub-headings.`,
  
  mastery: `You are an academic expert providing comprehensive, research-level explanations. Start with an abstract overview, then break down into theory, models, and formulas. Reference real-world applications in major companies and research. Use technical terminology appropriately. For mathematical formulas, use proper notation within [brackets] like [TCP_Throughput = (MSS/RTT) × sqrt(3/2) / sqrt(p)]. End with thought-provoking Socratic questions. Be thorough and rigorous. Always provide COMPLETE comprehensive explanations. IMPORTANT: Always finish your complete response with full details.

Additionally, where it helps readability, you may use these theme markers in the text: **bold** for key terms, *tilt* for gentle emphasis, __highlight__ for tags or labels, and ^^large^^ for short sub-headings.`
};

// Enhanced language codes with casual mode support
const languageInstructions = {
  en: '',
  hi: 'Please respond in Hindi language.',
  ur: 'Please respond in Urdu language.',
  ta: 'Please respond in Tamil language.',
  ml: 'Please respond in Malayalam language.',
  bn: 'Please respond in Bengali language.',
  pa: 'Please respond in Punjabi language.',
  gu: 'Please respond in Gujarati language.',
  kn: 'Please respond in Kannada language.',
  te: 'Please respond in Telugu language.',
  or: 'Please respond in Odia language.',
  as: 'Please respond in Assamese language.',
  ne: 'Please respond in Nepali language.',
  mr: 'Please respond in Marathi language.',
  sa: 'Please respond in Sanskrit language.',
  sd: 'Please respond in Sindhi language.',
  ks: 'Please respond in Kashmiri language.',
  doi: 'Please respond in Dogri language.',
  mni: 'Please respond in Manipuri language.',
  sat: 'Please respond in Santali language.',
  mai: 'Please respond in Maithili language.',
  kok: 'Please respond in Konkani language.',
  bho: 'Please respond in Bhojpuri language.',
  bod: 'Please respond in Bodo language.',
  hinglish: 'Please respond in Hinglish (mix of Hindi and English, commonly used in India).',
  // International languages
  es: 'Please respond in Spanish language.',
  fr: 'Please respond in French language.',
  de: 'Please respond in German language.',
  zh: 'Please respond in Chinese language.',
  ja: 'Please respond in Japanese language.',
  ko: 'Please respond in Korean language.',
  pt: 'Please respond in Portuguese language.',
  ru: 'Please respond in Russian language.',
  ar: 'Please respond in Arabic language.',
  it: 'Please respond in Italian language.',
  nl: 'Please respond in Dutch language.',
  tr: 'Please respond in Turkish language.',
  pl: 'Please respond in Polish language.',
  vi: 'Please respond in Vietnamese language.',
  th: 'Please respond in Thai language.',
  id: 'Please respond in Indonesian language.',
  ms: 'Please respond in Malay language.',
  // Rajasthani language
  raj: 'Please respond in Rajasthani language.',
  
  // Casual mode language codes (Roman script)
  hi_casual: 'Please respond in Hindi language but write using English alphabets/Roman script. For example: "Main accha hoon" instead of "मैं अच्छा हूं". This is for users who understand Hindi but prefer Roman script.',
  ur_casual: 'Please respond in Urdu language but write using English alphabets/Roman script. For example: "Main theek hoon" instead of "میں ٹھیک ہوں". This is for users who understand Urdu but prefer Roman script.',
  ta_casual: 'Please respond in Tamil language but write using English alphabets/Roman script. For example: "Naan nalla irukken" instead of "நான் நல்லா இருக்கேன்". This is for users who understand Tamil but prefer Roman script.',
  ml_casual: 'Please respond in Malayalam language but write using English alphabets/Roman script. For example: "Njan nannaayi irikkunnu" instead of "ഞാന്‍ നന്നായി ഇരിക്കുന്നു". This is for users who understand Malayalam but prefer Roman script.',
  bn_casual: 'Please respond in Bengali language but write using English alphabets/Roman script. For example: "Ami bhalo achi" instead of "আমি ভালো আছি". This is for users who understand Bengali but prefer Roman script.',
  pa_casual: 'Please respond in Punjabi language but write using English alphabets/Roman script. For example: "Main theek haan" instead of "ਮੈਂ ਠੀਕ ਹਾਂ". This is for users who understand Punjabi but prefer Roman script.',
  gu_casual: 'Please respond in Gujarati language but write using English alphabets/Roman script. For example: "Hun saaru chhu" instead of "હું સારુ છું". This is for users who understand Gujarati but prefer Roman script.',
  kn_casual: 'Please respond in Kannada language but write using English alphabets/Roman script. For example: "Naanu chennagidde" instead of "ನಾನು ಚೆನ್ನಾಗಿದ್ದೇ". This is for users who understand Kannada but prefer Roman script.',
  te_casual: 'Please respond in Telugu language but write using English alphabets/Roman script. For example: "Nenu baagunnaanu" instead of "నేను బాగున్నాను". This is for users who understand Telugu but prefer Roman script.',
  or_casual: 'Please respond in Odia language but write using English alphabets/Roman script. For example: "Mu bhala achi" instead of "ମୁ ଭଲ ଅଛି". This is for users who understand Odia but prefer Roman script.',
  as_casual: 'Please respond in Assamese language but write using English alphabets/Roman script. For example: "Moi bhal aasu" instead of "মোই ভাল আসোঁ". This is for users who understand Assamese but prefer Roman script.',
  ne_casual: 'Please respond in Nepali language but write using English alphabets/Roman script. For example: "Ma thik chhu" instead of "म ठिक छु". This is for users who understand Nepali but prefer Roman script.',
  mr_casual: 'Please respond in Marathi language but write using English alphabets/Roman script. For example: "Mi thik aahe" instead of "मी ठीक आहे". This is for users who understand Marathi but prefer Roman script.',
  sa_casual: 'Please respond in Sanskrit language but write using English alphabets/Roman script. For example: "Aham kushalah asmi" instead of "अहम् कुशलः अस्मि". This is for users who understand Sanskrit but prefer Roman script.',
  sd_casual: 'Please respond in Sindhi language but write using English alphabets/Roman script. This is for users who understand Sindhi but prefer Roman script.',
  ks_casual: 'Please respond in Kashmiri language but write using English alphabets/Roman script. This is for users who understand Kashmiri but prefer Roman script.',
  doi_casual: 'Please respond in Dogri language but write using English alphabets/Roman script. This is for users who understand Dogri but prefer Roman script.',
  mni_casual: 'Please respond in Manipuri language but write using English alphabets/Roman script. This is for users who understand Manipuri but prefer Roman script.',
  sat_casual: 'Please respond in Santali language but write using English alphabets/Roman script. This is for users who understand Santali but prefer Roman script.',
  mai_casual: 'Please respond in Maithili language but write using English alphabets/Roman script. This is for users who understand Maithili but prefer Roman script.',
  kok_casual: 'Please respond in Konkani language but write using English alphabets/Roman script. This is for users who understand Konkani but prefer Roman script.',
  bho_casual: 'Please respond in Bhojpuri language but write using English alphabets/Roman script. This is for users who understand Bhojpuri but prefer Roman script.',
  bod_casual: 'Please respond in Bodo language but write using English alphabets/Roman script. This is for users who understand Bodo but prefer Roman script.',
  // Rajasthani casual mode
  raj_casual: 'Please respond in Rajasthani language but write using English alphabets/Roman script. This is for users who understand Rajasthani but prefer Roman script.',
};

class AIService {
  constructor() {
    this.apiKey = API_KEY;
    this.apiUrl = API_URL;
    
    // Check if API key is properly configured
    if (!this.apiKey || this.apiKey === 'your-api-key-here') {
      console.error('❌ OpenRouter API key not configured on Netlify. Add VITE_OPENROUTER_API_KEY in Site settings → Environment variables.');
    }
  }

  async makeRequest(messages, temperature = 0.7) {
    // Check API key before making request
    if (!this.apiKey || this.apiKey === 'your-api-key-here') {
      throw new Error('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env.local file.');
    }
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'MiniMind AI Learning Platform'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini', // Updated to use GPT-4o-mini for better performance
          messages: messages,
          temperature: temperature,
          max_tokens: 2000, // Significantly increased for complete detailed responses
          stream: false,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      // Handle 402 Payment Required specifically
      if (response.status === 402) {
        console.error('API Error 402: Payment required for OpenRouter API');
        throw new Error('Payment required for API access. Please check your OpenRouter account and billing information.');
      }

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Response:', errorData);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from API');
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network connection error. Please check your internet connection.');
      }
      throw new Error(`AI service unavailable: ${error.message}`);
    }
  }

  async getExplanation(question, mode, language = 'en') {
    const systemPrompt = modePrompts[mode];
    const languageInstruction = languageInstructions[language] || '';
    
    const messages = [
      {
        role: 'system',
        content: `${systemPrompt} ${languageInstruction}`
      },
      {
        role: 'user',
        content: question
      }
    ];

    return await this.makeRequest(messages);
  }

  async refinePrompt(originalQuestion, language = 'en') {
    const languageInstruction = languageInstructions[language] || '';
    
    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant that improves user questions to make them clearer and more specific for better educational explanations. Take the user's question and rephrase it to be more detailed, specific, and optimized for learning. Keep the core intent but make it more educational and comprehensive.

Where appropriate, you may use these theme markers in the improved question: **bold** for key terms, *tilt* for gentle emphasis, __highlight__ for tags or labels, and ^^large^^ for short sub-headings.

${languageInstruction}`
      },
      {
        role: 'user',
        content: `Please improve this question to make it better for learning: "${originalQuestion}"`
      }
    ];

    return await this.makeRequest(messages, 0.3);
  }

  async getOneWordAnswer(question, language = 'en') {
    const languageInstruction = languageInstructions[language] || '';
    
    const messages = [
      {
        role: 'system',
        content: `You are Ekakshar, a concise AI assistant that provides quick, accurate answers. Respond with either:
        1. A single word answer when appropriate
        2. A bullet-point summary (3-5 key points) when the question asks for explanation or summary
        3. A brief phrase for definitions
        
        Be precise and to the point. Format bullet points with "•" at the start of each line.
        Where it helps clarity, you may use these theme markers in the answer: **bold** for key terms, *tilt* for gentle emphasis, __highlight__ for tags or labels, and ^^large^^ for short sub-headings.

        ${languageInstruction}`
      },
      {
        role: 'user',
        content: question
      }
    ];

    return await this.makeRequest(messages, 0.3);
  }

  async continueConversation(messages, mode, language = 'en') {
    const systemPrompt = modePrompts[mode];
    const languageInstruction = languageInstructions[language] || '';
    
    const formattedMessages = [
      {
        role: 'system',
        content: `${systemPrompt} ${languageInstruction}`
      },
      ...messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    return await this.makeRequest(formattedMessages);
  }

  // Browser-compatible translation function with improved error handling
  async translateText(text, targetLanguage, sourceLanguage = 'en') {
    try {
      // Skip translation if source and target are the same
      if (sourceLanguage === targetLanguage) {
        return text;
      }
      
      // Special handling for languages that need transliteration
      const transliterationLanguages = ['hi', 'bn', 'ta', 'te', 'ml', 'kn', 'gu', 'pa', 'or', 'as', 'mr', 'ne', 'sa', 'ur', 'sd', 'ks', 'doi', 'mni', 'sat', 'mai', 'kok', 'bho', 'bod', 'raj'];
      
      // Use AI-based translation for all languages including Indian languages
      try {
        console.log(`Translating from ${sourceLanguage} to ${targetLanguage}`);
        
        // Create translation prompt
        const translationPrompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Return only the translated text without any explanations or additional content:

${text}`;
        
        // Use the same AI service for translation
        const messages = [
          {
            role: 'system',
            content: 'You are a professional translator. Translate the given text accurately while preserving meaning and context. Return only the translated text without any explanations or additional content. Where the source text uses theme markers like **bold**, *tilt*, __highlight__, or ^^large^^, preserve those markers appropriately in the translated text.'
          },
          {
            role: 'user',
            content: translationPrompt
          }
        ];
        
        const translatedText = await this.makeRequest(messages, 0.3);
        console.log('AI Translation result:', translatedText);
        return translatedText;
      } catch (apiError) {
        console.warn('AI translation failed, trying fallback translation API:', apiError);
        
        // Fallback to MyMemory API
        try {
          const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`);
          if (response.ok) {
            const data = await response.json();
            console.log('Fallback translation response:', data);
            if (data.responseData && data.responseData.translatedText) {
              return data.responseData.translatedText;
            } else {
              console.warn('Fallback translation API returned no translated text');
            }
          } else {
            console.warn('Fallback translation API returned non-OK status:', response.status);
          }
        } catch (fallbackError) {
          console.warn('Fallback translation API error:', fallbackError);
        }
      }
      
      // If all else fails, return original text
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      // Return original text if translation fails
      return text;
    }
  }
}

export default new AIService();