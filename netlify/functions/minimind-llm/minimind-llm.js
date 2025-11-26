// Netlify Function to handle AI API calls securely using OpenRouter
// This file is written in pure CommonJS for maximum Netlify compatibility.

// Environment variable: set this in Netlify UI as OPENROUTER_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Basic validation so we fail fast if the key is missing
if (!OPENROUTER_API_KEY) {
  // Logged once at cold start in Netlify logs
  console.error('OPENROUTER_API_KEY is not set. Configure it in Netlify environment variables.');
}

// Mode-specific prompts (same as in the frontend)
const modePrompts = {
  beginner: `You are a friendly, patient teacher explaining concepts to children ages 5-10. Use simple analogies, toys, cartoons, and everyday examples. Be cheerful, encouraging, and use emojis. Keep sentences short and fun. Always provide COMPLETE explanations. If you include formulas, wrap them in [brackets] like [E=mc²]. End with a warm, encouraging question like "Does that make sense, buddy?" or "Want to learn more about this?".`,

  thinker: `You are a cool, knowledgeable teacher explaining concepts to teenagers and college students. Use pop culture references, memes, and real-world applications. Be casual but structured. Explain why things matter and how they apply to real life. Use some humor and sarcasm when appropriate. Make it relatable and engaging. Always provide COMPLETE explanations. For formulas, use [formula] notation like [BDP = Bandwidth × RTT].`,

  story: `You are a friendly storyteller who explains everything through simple, fun stories. Create a very short story like you're telling it to a friend. Use everyday objects, animals, or people as characters. Keep sentences short and words simple. Start with "Once upon a time" or "Imagine if..." and tell a tiny story that naturally explains the concept. Make it feel like a bedtime story - warm, simple, and easy to understand. No complex words or long explanations. Just a sweet, simple story that teaches the idea.`,

  mastery: `You are an academic expert providing comprehensive, research-level explanations. Start with an abstract overview, then break down into theory, models, and formulas. Reference real-world applications in major companies and research. Use technical terminology appropriately. For mathematical formulas, use proper notation within [brackets] like [TCP_Throughput = (MSS/RTT) × sqrt(3/2) / sqrt(p)]. End with thought-provoking Socratic questions. Be thorough and rigorous.`
};

// Language instructions including full language and casual/roman support
// (adapted from the original frontend aiService languageInstructions)
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
  doi_casual: 'Please respond in Dogri language but write using English alphabets/Roman script. This is for users who understand Dogri who prefer Roman script.',
  mni_casual: 'Please respond in Manipuri language but write using English alphabets/Roman script. This is for users who understand Manipuri but prefer Roman script.',
  sat_casual: 'Please respond in Santali language but write using English alphabets/Roman script. This is for users who understand Santali but prefer Roman script.',
  mai_casual: 'Please respond in Maithili language but write using English alphabets/Roman script. This is for users who understand Maithili but prefer Roman script.',
  kok_casual: 'Please respond in Konkani language but write using English alphabets/Roman script. This is for users who understand Konkani but prefer Roman script.',
  bho_casual: 'Please respond in Bhojpuri language but write using English alphabets/Roman script. This is for users who understand Bhojpuri but prefer Roman script.',
  bod_casual: 'Please respond in Bodo language but write using English alphabets/Roman script. This is for users who understand Bodo but prefer Roman script.',
  // Rajasthani casual mode
  raj_casual: 'Please respond in Rajasthani language but write using English alphabets/Roman script. This is for users who understand Rajasthani but prefer Roman script.',
};

// Helper: build messages for different actions
function buildMessages({ question, mode, language, action }) {
  const systemPrompt = modePrompts[mode] || modePrompts.beginner;
  const languageInstruction = languageInstructions[language] || languageInstructions.en;

  switch (action) {
    case 'explain':
      return [
        { role: 'system', content: `${systemPrompt} ${languageInstruction}` },
        { role: 'user', content: question }
      ];

    case 'refine':
      return [
        {
          role: 'system',
          content:
            `You are a helpful assistant that improves user questions to make them clearer and more specific for better educational explanations. ` +
            `Take the user's question and rephrase it to be more detailed, specific, and optimized for learning. ` +
            `Keep the core intent but make it more educational and comprehensive. ${languageInstruction}`
        },
        {
          role: 'user',
          content: `Please improve this question to make it better for learning: "${question}"`
        }
      ];

    case 'one-word':
      return [
        {
          role: 'system',
          content:
            `You are Ekakshar, a concise AI assistant that provides quick, accurate answers. ` +
            `Respond with either (1) a single word answer when appropriate, (2) a bullet-point summary (3-5 key points) when the question asks for explanation or summary, ` +
            `(3) a brief phrase for definitions. Be precise and to the point. Format bullet points with "•" at the start of each line. ` +
            languageInstruction
        },
        { role: 'user', content: question }
      ];

    default:
      return null;
  }
}

// Main handler function
exports.handler = async (event, context) => {
  const requestId = context && context.awsRequestId ? context.awsRequestId : `req-${Date.now()}`;

  // Basic method guard
  if (event.httpMethod !== 'POST') {
    console.warn(`[${requestId}] Method not allowed: ${event.httpMethod}`);
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
    };
  }

  // Log incoming request (without body content in case it grows large)
  console.log(`[${requestId}] Incoming request`, {
    path: event.path,
    httpMethod: event.httpMethod,
    headers: {
      'user-agent': event.headers && event.headers['user-agent'],
      origin: event.headers && event.headers.origin
    }
  });

  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured on the server');
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Missing request body' })
      };
    }

    const body = JSON.parse(event.body);
    const { question, mode, language = 'en', action = 'explain' } = body;

    if (!question || !mode) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: question and mode are required'
        })
      };
    }

    const messages = buildMessages({ question, mode, language, action });
    if (!messages) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Invalid action' })
      };
    }

    const temperature = action === 'one-word' ? 0.3 : 0.7;

    // Call OpenRouter using native fetch (Node 18+)
    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://minimind-ai.netlify.app',
        'X-Title': 'MiniMind AI Learning Platform'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages,
        temperature,
        max_tokens: 2000,
        stream: false
      })
    });

    const rawText = await apiResponse.text();

    if (!apiResponse.ok) {
      console.error(`[${requestId}] OpenRouter error`, {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        body: rawText
      });

      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Upstream AI provider error',
          status: apiResponse.status,
          statusText: apiResponse.statusText
        })
      };
    }

    let completion;
    try {
      completion = JSON.parse(rawText);
    } catch (parseErr) {
      console.error(`[${requestId}] Failed to parse OpenRouter JSON`, { rawText });
      throw new Error('Failed to parse AI provider response');
    }

    let content =
      completion &&
      completion.choices &&
      completion.choices[0] &&
      completion.choices[0].message &&
      completion.choices[0].message.content;

    if (!content) {
      console.error(`[${requestId}] No content field in OpenRouter response`, { completion });
      throw new Error('No content in AI response');
    }

    // OpenRouter / OpenAI can sometimes return structured content (arrays of parts).
    // Normalize to a simple string so the frontend can safely call .replace, etc.
    if (Array.isArray(content)) {
      content = content
        .map((part) => {
          if (typeof part === 'string') return part;
          if (part && typeof part.text === 'string') return part.text;
          return JSON.stringify(part);
        })
        .join(' ');
    } else if (typeof content !== 'string') {
      content = String(content);
    }

    const responsePayload = {
      success: true,
      content,
      mode,
      language
    };

    console.log(`[${requestId}] Successful AI response`, {
      mode,
      language,
      action,
      contentPreview: String(content).slice(0, 120)
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responsePayload)
    };
  } catch (err) {
    console.error(`[${requestId}] Error in minimind-llm function`, {
      message: err.message,
      stack: err.stack
    });

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'AI service unavailable: API request failed'
      })
    };
  }
};
