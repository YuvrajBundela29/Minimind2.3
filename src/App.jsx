import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Settings,
  Home,
  TrendingUp,
  GraduationCap,
  Globe,
  ArrowLeft,
  Volume2,
  Wand2,
  Menu,
  X,
  Sun,
  Moon,
  Mic,
  Sparkles,
  User,
  BarChart3,
  Brain,
  History,
  Languages,
  Cog,
  ToggleLeft,
  ToggleRight,
  Download,
  Share2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
// Using the new NetlifyAIService which communicates with our secure Netlify Function
import AIService from './services/aiService.js';
import { transliterate } from 'transliteration';
import FormattedText from './components/FormattedText';
import './App.css';
import './mobile.css';
import './mobile_fullscreen.css';
import MobileApp from './MobileApp';

// Speech Controls Component
const SpeechControls = ({ onSpeak, onPause, onResume, onStop, isSpeaking, isPaused, text, mode }) => {
  return (
    <div className="speech-controls">
      {!isSpeaking ? (
        <motion.button
          className="speak-btn"
          onClick={() => onSpeak(text, mode)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Read Aloud"
        >
          <Volume2 size={16} />
        </motion.button>
      ) : (
        <div className="speech-control-group">
          {isPaused ? (
            <motion.button
              className="speech-btn resume-btn"
              onClick={onResume}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Resume"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.button>
          ) : (
            <motion.button
              className="speech-btn pause-btn"
              onClick={onPause}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Pause"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </motion.button>
          )}
          <motion.button
            className="speech-btn stop-btn"
            onClick={onStop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Stop"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            </svg>
          </motion.button>
        </div>
      )}
    </div>
  );
};

// Mode configurations
const modes = {
  beginner: {
    name: 'Beginner',
    icon: '🌱',
    color: '#CDE8D6',
    accent: '#4ECDC4',
    theme: 'beginner',
  },
  thinker: {
    name: 'Thinker',
    icon: '🧠',
    color: '#E4D9FF',
    accent: '#9C88FF',
    theme: 'thinker',
  },
  story: {
    name: 'Story',
    icon: '📖',
    color: '#FFF3CD',
    accent: '#FFB74D',
    theme: 'story',
  },
  mastery: {
    name: 'Mastery',
    icon: '🎓',
    color: '#D6E4F0',
    accent: '#42A5F5',
    theme: 'mastery',
  },
};

// Language to transliteration map
const languageTransliterationMap = {
  hi: 'hi', // Hindi
  bn: 'bn', // Bengali
  ta: 'ta', // Tamil
  te: 'te', // Telugu
  ml: 'ml', // Malayalam
  kn: 'kn', // Kannada
  gu: 'gu', // Gujarati
  pa: 'pa', // Punjabi
  or: 'or', // Odia
  as: 'as', // Assamese
  mr: 'mr', // Marathi
  ne: 'ne', // Nepali
  sa: 'sa', // Sanskrit
  ur: 'ur', // Urdu
  sd: 'sd', // Sindhi
  ks: 'ks', // Kashmiri
  doi: 'doi', // Dogri
  mni: 'mni', // Manipuri
  sat: 'sat', // Santali
  mai: 'mai', // Maithili
  kok: 'kok', // Konkani
  bho: 'bho', // Bhojpuri
  bod: 'bod', // Bodo
  raj: 'hi', // Rajasthani (using Hindi as base)
  ar: 'ar', // Arabic
  fa: 'fa', // Persian/Farsi
  ru: 'ru', // Russian
  zh: 'zh', // Chinese (pinyin)
  ja: 'ja', // Japanese (romaji)
  ko: 'ko', // Korean (romaja)
};

// Enhanced languages configuration with all Indian languages and casual mode
const languages = {
  en: { name: 'English', flag: '🇺🇸', nativeName: 'English', casual: false },
  hi: { name: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी', casual: 'Hindi (Roman)' },
  ur: { name: 'Urdu', flag: '🇵🇰', nativeName: 'اردو', casual: 'Urdu (Roman)' },
  ta: { name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்', casual: 'Tamil (Roman)' },
  ml: { name: 'Malayalam', flag: '🇮🇳', nativeName: 'മലയാളം', casual: 'Malayalam (Roman)' },
  bn: { name: 'Bengali', flag: '🇧🇩', nativeName: 'বাংলা', casual: 'Bengali (Roman)' },
  pa: { name: 'Punjabi', flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ', casual: 'Punjabi (Roman)' },
  gu: { name: 'Gujarati', flag: '🇮🇳', nativeName: 'ગુજરાતી', casual: 'Gujarati (Roman)' },
  kn: { name: 'Kannada', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ', casual: 'Kannada (Roman)' },
  te: { name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు', casual: 'Telugu (Roman)' },
  or: { name: 'Odia', flag: '🇮🇳', nativeName: 'ଓଡ଼ିଆ', casual: 'Odia (Roman)' },
  as: { name: 'Assamese', flag: '🇮🇳', nativeName: 'অসমীয়া', casual: 'Assamese (Roman)' },
  ne: { name: 'Nepali', flag: '🇳🇵', nativeName: 'नेपाली', casual: 'Nepali (Roman)' },
  mr: { name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी', casual: 'Marathi (Roman)' },
  sa: { name: 'Sanskrit', flag: '🇮🇳', nativeName: 'संस्कृतम्', casual: 'Sanskrit (Roman)' },
  sd: { name: 'Sindhi', flag: '🇮🇳', nativeName: 'سنڌي', casual: 'Sindhi (Roman)' },
  ks: { name: 'Kashmiri', flag: '🇮🇳', nativeName: 'कॉशुर', casual: 'Kashmiri (Roman)' },
  doi: { name: 'Dogri', flag: '🇮🇳', nativeName: 'डोगरी', casual: 'Dogri (Roman)' },
  mni: { name: 'Manipuri', flag: '🇮🇳', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ', casual: 'Manipuri (Roman)' },
  sat: { name: 'Santali', flag: '🇮🇳', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', casual: 'Santali (Roman)' },
  mai: { name: 'Maithili', flag: '🇮🇳', nativeName: 'मैथिली', casual: 'Maithili (Roman)' },
  kok: { name: 'Konkani', flag: '🇮🇳', nativeName: 'कोंकणी', casual: 'Konkani (Roman)' },
  bho: { name: 'Bhojpuri', flag: '🇮🇳', nativeName: 'भोजपुरी', casual: 'Bhojpuri (Roman)' },
  bod: { name: 'Bodo', flag: '🇮🇳', nativeName: 'बड़ो', casual: 'Bodo (Roman)' },
  hinglish: { name: 'Hinglish', flag: '🇮🇳', nativeName: 'Hinglish', casual: false },
  // International languages
  es: { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español', casual: false },
  fr: { name: 'French', flag: '🇫🇷', nativeName: 'Français', casual: false },
  de: { name: 'German', flag: '🇩🇪', nativeName: 'Deutsch', casual: false },
  zh: { name: 'Chinese', flag: '🇨🇳', nativeName: '中文', casual: false },
  ja: { name: 'Japanese', flag: '🇯🇵', nativeName: '日本語', casual: false },
  ko: { name: 'Korean', flag: '🇰🇷', nativeName: '한국어', casual: false },
  pt: { name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português', casual: false },
  ru: { name: 'Russian', flag: '🇷🇺', nativeName: 'Русский', casual: false },
  ar: { name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية', casual: false },
  it: { name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano', casual: false },
  nl: { name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands', casual: false },
  tr: { name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe', casual: false },
  pl: { name: 'Polish', flag: '🇵🇱', nativeName: 'Polski', casual: false },
  vi: { name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt', casual: false },
  th: { name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย', casual: false },
  id: { name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia', casual: false },
  ms: { name: 'Malay', flag: '🇲🇾', nativeName: 'Bahasa Melayu', casual: false },
  // Rajasthani language
  raj: { name: 'Rajasthani', flag: '🇮🇳', nativeName: 'राजस्थानी', casual: 'Rajasthani (Roman)' },
};

// Navigation items with professional icons for minimized view
const navigationItems = [
  { id: 'home', icon: Home, label: 'Learn', color: '#2563eb' },
  { id: 'progress', icon: BarChart3, label: 'Progress', color: '#059669' },
  { id: 'oneword', icon: Brain, label: 'Ekakshar', color: '#7c3aed' },
  { id: 'history', icon: History, label: 'History', color: '#d97706' },
  { id: 'about', icon: User, label: 'About Us', color: '#8b5cf6' },
  { id: 'faq', icon: GraduationCap, label: 'FAQ', color: '#0891b2' },
  { id: 'language', icon: Languages, label: 'Language', color: '#0891b2' },
  { id: 'settings', icon: Cog, label: 'Settings', color: '#6b7280' },
];

// Enhanced Mode switcher for fullscreen with smooth transitions
const ModeSwitcher = ({ currentMode, onModeChange, enabledModes, answers, question }) => {
  const handleModeSwitch = (newMode) => {
    if (enabledModes[newMode] && newMode !== currentMode) {
      onModeChange(newMode, answers[newMode], question);
    }
  };

  return (
    <div className="mode-switcher">
      {Object.entries(modes).map(([modeKey, modeConfig]) => (
        <motion.button
          key={modeKey}
          className={`mode-switch-btn ${currentMode === modeKey ? 'active' : ''
            } ${!enabledModes[modeKey] ? 'disabled' : ''}`}
          onClick={() => handleModeSwitch(modeKey)}
          disabled={!enabledModes[modeKey]}
          whileHover={{ scale: enabledModes[modeKey] ? 1.05 : 1 }}
          whileTap={{ scale: enabledModes[modeKey] ? 0.95 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="mode-icon">{modeConfig.icon}</span>
          <span className="mode-name">{modeConfig.name}</span>
          {answers && answers[modeKey] && (
            <motion.div
              className="answer-indicator"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

// Mode filter dropdown
const ModeFilter = ({ enabledModes, onToggleMode, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="mobile-mode-pills">
        {Object.entries(modes).map(([modeKey, modeConfig]) => (
          <button
            key={modeKey}
            className={`mode-pill ${enabledModes[modeKey] ? 'active' : ''}`}
            onClick={() => onToggleMode(modeKey)}
          >
            <span className="mode-icon">{modeConfig.icon}</span>
            <span>{modeConfig.name}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="mode-filter">
      <button
        className="filter-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Modes</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="filter-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {Object.entries(modes).map(([modeKey, modeConfig]) => (
              <label key={modeKey} className="filter-option">
                <input
                  type="checkbox"
                  checked={enabledModes[modeKey]}
                  onChange={() => onToggleMode(modeKey)}
                />
                <span className="mode-icon">{modeConfig.icon}</span>
                <span>{modeConfig.name}</span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [casualMode, setCasualMode] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [languageSearchTerm, setLanguageSearchTerm] = useState('');
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
  const [translationText, setTranslationText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translationSourceLanguage, setTranslationSourceLanguage] = useState('en');
  const [translationTargetLanguage, setTranslationTargetLanguage] = useState('hi');
  const [navExpanded, setNavExpanded] = useState(false);
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState({});
  const [fullscreenMode, setFullscreenMode] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [activeMobileMode, setActiveMobileMode] = useState('beginner');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [loadingModes, setLoadingModes] = useState({});
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [showRefinedPrompt, setShowRefinedPrompt] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [enabledModes, setEnabledModes] = useState({
    beginner: true,
    thinker: true,
    story: true,
    mastery: true,
  });
  const [theme, setTheme] = useState('light');
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    soundEnabled: true,
    defaultMode: 'beginner',
    voiceLanguage: 'en',
    emojisEnabled: true,
    autoScroll: true,
    // New settings for translator
    transliterationEnabled: true,
    scriptPreference: 'native', // 'native' or 'english'
    autoTranslation: true, // 'auto' or 'manual'
    typingTranslatorEnabled: false, // GBoard-like real-time typing translator
  });
  const [currentSpeech, setCurrentSpeech] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechPaused, setSpeechPaused] = useState(false);
  // New state for smart search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  // New state for contextual learning
  const [showContextualPanel, setShowContextualPanel] = useState(false);
  const [relatedTopics, setRelatedTopics] = useState([]);
  const [isGeneratingRelatedTopics, setIsGeneratingRelatedTopics] = useState(false);
  // New state for history features
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyFilterMode, setHistoryFilterMode] = useState('');
  const [historyFilterLanguage, setHistoryFilterLanguage] = useState('');
  const [historySortBy, setHistorySortBy] = useState('newest');
  // Suggested prompts for the hero section
  const [showSuggestedPrompts, setShowSuggestedPrompts] = useState(true);

  // FAQ Accordion State
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  // History Accordion State
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [expandedHistoryMode, setExpandedHistoryMode] = useState(null); // Tracks active tab within expanded entry

  // Generate random curiosity-testing prompts
  const generateRandomPrompts = () => {
    const promptSets = [
      [
        "What would happen if humans could photosynthesize like plants?",
        "Can AI truly understand human emotions or just simulate them?",
        "What if Earth had two moons instead of one?",
        "How would society change if we didn't need to sleep?",
        "What would happen if all humans could read minds?",
        "Why do we have different personalities and what shapes them?"
      ],
      [
        "What would the world be like if the Internet was never invented?",
        "Could we upload human consciousness to computers?",
        "What if animals could talk to humans?",
        "How would Earth be different if dinosaurs never went extinct?",
        "What would happen if gravity was twice as strong?",
        "Can we create artificial gravity without spinning?"
      ],
      [
        "What if we discovered a new color humans can see?",
        "How would civilization change if we lived 500 years instead of 80?",
        "What would happen if we could control the weather?",
        "What if humans had evolved with echolocation like bats?",
        "Could we terraform Mars to be more Earth-like?",
        "What would happen if we found a parallel universe?"
      ],
      [
        "What if money didn't exist and we used a different system?",
        "How would humans adapt if Earth's atmosphere was 50% denser?",
        "What if we could pause time for everyone except ourselves?",
        "Could we build a real lightsaber like in Star Wars?",
        "What if humans had evolved with natural armor like armadillos?",
        "What would happen if we could teleport instantly anywhere?"
      ],
      [
        "What if plants were conscious and could communicate with us?",
        "How would society change if humans could regenerate limbs like lizards?",
        "What would happen if we could see in infrared or ultraviolet?",
        "Could we create a force field like in science fiction?",
        "What if humans had evolved with natural sonar like dolphins?",
        "What would happen if we discovered a new fundamental force of physics?"
      ]
    ];

    // Get a random set of prompts
    const randomIndex = Math.floor(Math.random() * promptSets.length);
    return promptSets[randomIndex];
  };

  const [suggestedPrompts, setSuggestedPrompts] = useState(() => generateRandomPrompts());

  // Function to generate dynamic prompts based on user input
  const generateDynamicPrompts = async (userQuestion) => {
    try {
      // Use random curiosity-testing prompts instead of category-based ones
      setSuggestedPrompts(generateRandomPrompts());
    } catch (error) {
      console.error('Error generating dynamic prompts:', error);
      // Fallback to default curiosity-building prompts
      setSuggestedPrompts([
        "What would happen if all humans could read minds?",
        "Why do we have different personalities and what shapes them?",
        "What would happen if we discovered life on another planet?",
        "How would society change if we didn't need to sleep?",
        "What would happen if we could live forever?"
      ]);
    }
  };

  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Track viewport width for mobile-specific UI (accordion & nav)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const isMobileView = window.innerWidth < 768;
        setIsMobile(isMobileView);

        // Close mobile menu when resizing to desktop
        if (!isMobileView && isMobileNavOpen) {
          setIsMobileNavOpen(false);
        }
      }
    };

    // Initial check
    handleResize();

    // Add viewport meta tag for mobile devices
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover';
    document.head.appendChild(viewportMeta);

    // Add touch event detection
    document.documentElement.classList.add('has-touch-events');

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.head.removeChild(viewportMeta);
      document.documentElement.classList.remove('has-touch-events');
    };
  }, [isMobileNavOpen]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, fullscreenMode]);

  // Function to format AI answers with bold text instead of stars and hashtags
  // DEPRECATED: Using FormattedText component instead
  const formatAnswer = (answer) => {
    return answer;
  };

  // Enhanced theme and settings management
  useEffect(() => {
    // Load saved settings
    const savedTheme = localStorage.getItem('minimind-theme') || 'light';
    const savedSettings = JSON.parse(localStorage.getItem('minimind-settings') || '{}');
    const savedHistory = JSON.parse(localStorage.getItem('minimind-history') || '[]');
    const savedCasualMode = localStorage.getItem('minimind-casual-mode') === 'true';

    setTheme(savedTheme);
    setSettings(prev => ({ ...prev, ...savedSettings }));
    setHistory(savedHistory);
    setCasualMode(savedCasualMode);

    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.style.fontSize = savedSettings.fontSize === 'small' ? '14px' :
      savedSettings.fontSize === 'large' ? '18px' : '16px';
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('minimind-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('minimind-settings', JSON.stringify(updatedSettings));

    // Apply font size changes
    if (newSettings.fontSize) {
      document.documentElement.style.fontSize = newSettings.fontSize === 'small' ? '14px' :
        newSettings.fontSize === 'large' ? '18px' : '16px';
    }
  };

  const toggleCasualMode = () => {
    const newCasualMode = !casualMode;
    setCasualMode(newCasualMode);
    localStorage.setItem('minimind-casual-mode', newCasualMode.toString());
  };

  // Function to handle transliteration
  const handleTransliteration = (text) => {
    // Only transliterate if the feature is enabled and we have a mapping
    if (settings.transliterationEnabled && languageTransliterationMap[selectedLanguage]) {
      try {
        // For languages that need native script conversion
        if (settings.scriptPreference === 'native') {
          // Use the transliteration library to convert to native script
          const transliteratedText = transliterate(text, {
            locale: languageTransliterationMap[selectedLanguage]
          });
          return transliteratedText;
        }
      } catch (error) {
        console.error('Transliteration error:', error);
      }
    }
    return text;
  };

  // Enhanced question input handler with real-time transliteration (GBoard-like)
  const handleQuestionChange = (e) => {
    const inputValue = e.target.value;

    // Apply transliteration if enabled and in typing translator mode
    let processedValue = inputValue;

    // Check if typing translator is enabled (real-time conversion as user types)
    if (settings.typingTranslatorEnabled && languageTransliterationMap[selectedLanguage]) {
      try {
        // Convert English text to selected language script in real-time
        processedValue = transliterate(inputValue, {
          locale: languageTransliterationMap[selectedLanguage]
        });
      } catch (error) {
        console.error('Real-time transliteration error:', error);
      }
    }
    // Otherwise use the existing transliteration logic
    else if (settings.transliterationEnabled && settings.scriptPreference === 'native') {
      processedValue = handleTransliteration(inputValue);
    }

    setQuestion(processedValue);

    // Generate dynamic prompts based on user input (with debounce)
    if (inputValue.trim().length > 3) {
      clearTimeout(window.promptDebounce);
      window.promptDebounce = setTimeout(() => {
        generateDynamicPrompts(inputValue);
      }, 500);
    } else if (inputValue.trim().length === 0) {
      // Reset to default prompts when input is cleared
      setSuggestedPrompts([
        "Explain quantum computing like I'm 5",
        "What is a black hole?",
        "How does the internet work?",
        "Why do we dream?",
        "How do airplanes fly?",
        "What is artificial intelligence?"
      ]);
    }
  };

  // Save to history function
  const saveToHistory = (question, answers, timestamp = Date.now()) => {
    const historyEntry = {
      id: timestamp,
      question,
      answers,
      language: selectedLanguage,
      casualMode: casualMode,
      timestamp,
      date: new Date(timestamp).toLocaleDateString(),
      time: new Date(timestamp).toLocaleTimeString(),
      pinned: false,
    };

    const updatedHistory = [historyEntry, ...history.slice(0, 49)]; // Keep last 50 entries
    setHistory(updatedHistory);
    localStorage.setItem('minimind-history', JSON.stringify(updatedHistory));
  };

  // Update document language
  useEffect(() => {
    document.documentElement.lang = selectedLanguage === 'hinglish' ? 'hi' : selectedLanguage;
  }, [selectedLanguage]);

  // Add notification function
  const addNotification = (message, type = 'error') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Enhanced AI response function with casual mode support
  const getAIResponse = async (prompt, mode, isRefinement = false) => {
    try {
      // Debug logging for casual mode
      console.log('Casual Mode:', casualMode);
      console.log('Selected Language:', selectedLanguage);
      console.log('Language Config:', languages[selectedLanguage]);

      const effectiveLanguage = casualMode && languages[selectedLanguage]?.casual ?
        `${selectedLanguage}_casual` : selectedLanguage;

      console.log('Effective Language:', effectiveLanguage);

      if (isRefinement) {
        return await AIService.refinePrompt(prompt, effectiveLanguage);
      }

      // Get the AI response
      let response = await AIService.getExplanation(prompt, mode, effectiveLanguage);

      // Translate if auto-translation is enabled and language is not English
      if (settings.autoTranslation && selectedLanguage !== 'en') {
        try {
          console.log('Auto-translating response to', selectedLanguage);
          const translatedResponse = await AIService.translateText(response, selectedLanguage, 'en');
          console.log('Translated response:', translatedResponse);
          response = translatedResponse;
        } catch (translationError) {
          console.error('Translation failed:', translationError);
          // Continue with original response if translation fails
        }
      }

      return response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Provide more specific error message for payment issues
      if (error.message.includes('Payment required')) {
        return 'Sorry, there is a payment issue with the AI service. Please check your OpenRouter account and billing information.';
      }
      return `Sorry, I'm having trouble connecting right now. Please try again in a moment. ${error.message}`;
    }
  };

  // Enhanced question submission with history saving
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsAnswering(true);
    setAnswers({});
    setLoadingModes({});

    const timestamp = Date.now();

    // Get answers for all modes simultaneously
    const modeKeys = Object.keys(modes).filter(key => enabledModes[key]);
    const promises = modeKeys.map(async (modeKey) => {
      setLoadingModes(prev => ({ ...prev, [modeKey]: true }));
      try {
        const answer = await getAIResponse(question, modeKey);
        setAnswers(prev => ({ ...prev, [modeKey]: answer }));
        setLoadingModes(prev => ({ ...prev, [modeKey]: false }));
        return { [modeKey]: answer };
      } catch (error) {
        console.error(`Error for ${modeKey}:`, error);
        // Provide more specific notification for payment issues
        if (error.message.includes('Payment required')) {
          addNotification(`Payment required for ${modes[modeKey].name} mode. Please check your OpenRouter account.`, 'error');
        } else {
          addNotification(`Failed to get ${modes[modeKey].name} explanation: ${error.message}`, 'error');
        }
        const errorMessage = error.message.includes('Payment required')
          ? 'Payment required for AI service. Please check your OpenRouter account and billing information.'
          : 'Sorry, I encountered an error. Please try again.';
        setAnswers(prev => ({ ...prev, [modeKey]: errorMessage }));
        setLoadingModes(prev => ({ ...prev, [modeKey]: false }));
        return { [modeKey]: errorMessage };
      }
    });

    // Wait for all responses and save to history
    const results = await Promise.allSettled(promises);
    const allAnswers = {};
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        Object.assign(allAnswers, result.value);
      }
    });

    // Save to history
    saveToHistory(question, allAnswers, timestamp);
    setIsAnswering(false);

    // Reset dynamic prompts after submission
    setSuggestedPrompts(generateRandomPrompts());
    // Show suggested prompts again after submission
    setShowSuggestedPrompts(true);
  };

  // Handle prompt refinement
  const handleRefinePrompt = async () => {
    if (!question.trim()) return;

    setIsRefining(true);
    setShowRefinedPrompt(true);
    try {
      const refined = await getAIResponse(question, 'beginner', true);
      setRefinedPrompt(refined);
    } catch (error) {
      console.error('Error refining prompt:', error);
      addNotification(`Failed to refine prompt: ${error.message}`);
      setRefinedPrompt("Sorry, I couldn't refine your prompt right now. Please try again.");
    } finally {
      setIsRefining(false);
    }
  };

  // Toggle mode enabled/disabled
  const toggleMode = (modeKey) => {
    setEnabledModes(prev => ({
      ...prev,
      [modeKey]: !prev[modeKey]
    }));
  };

  const [onewordInput, setOnewordInput] = useState('');
  const [onewordAnswer, setOnewordAnswer] = useState('');
  const [isOnewordLoading, setIsOnewordLoading] = useState(false);

  // OneWord quick answer function
  const handleOnewordSubmit = async (e) => {
    e.preventDefault();
    if (!onewordInput.trim()) return;

    setIsOnewordLoading(true);
    try {
      const response = await AIService.getOneWordAnswer(onewordInput, selectedLanguage);
      setOnewordAnswer(response);
    } catch (error) {
      console.error('OneWord error:', error);
      // Provide more specific error message for payment issues
      if (error.message.includes('Payment required')) {
        addNotification('Payment required for OneWord feature. Please check your OpenRouter account.', 'error');
        setOnewordAnswer('Payment required for AI service. Please check your OpenRouter account and billing information.');
      } else {
        addNotification(`OneWord error: ${error.message}`, 'error');
        setOnewordAnswer('Sorry, I encountered an error.');
      }
    } finally {
      setIsOnewordLoading(false);
    }
  };

  // Function to clean text for speech (remove hashtags, markdown, emojis)
  const cleanTextForSpeech = (text) => {
    if (text == null) return '';

    // Always operate on a string to avoid .replace on non-string values
    let cleanText = typeof text === 'string' ? text : String(text);

    // Remove HTML tags
    cleanText = cleanText.replace(/<[^>]*>/g, ' ');

    // Remove markdown formatting
    cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
    cleanText = cleanText.replace(/\*(.*?)\*/g, '$1'); // Italic
    cleanText = cleanText.replace(/`(.*?)`/g, '$1'); // Code
    cleanText = cleanText.replace(/```[\s\S]*?```/g, ''); // Code blocks

    // Remove hashtags
    cleanText = cleanText.replace(/#+ /g, '');
    cleanText = cleanText.replace(/#/g, '');

    // Remove emojis
    cleanText = cleanText.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');

    // Remove special characters and extra spaces
    cleanText = cleanText.replace(/[\*\-\+\=\|\[\]\(\)]/g, ' ');
    cleanText = cleanText.replace(/\s+/g, ' ');
    cleanText = cleanText.trim();

    // Add natural pauses at periods and commas
    cleanText = cleanText.replace(/\./g, '.');
    cleanText = cleanText.replace(/,/g, ', ');

    return cleanText;
  };

  // Enhanced speech controls
  const stopSpeech = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeechPaused(false);
      setCurrentSpeech(null);
    }
  };

  const pauseSpeech = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setSpeechPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setSpeechPaused(false);
    }
  };

  // Fallback function for clipboard sharing
  const fallbackToClipboard = (content, type) => {
    const textToCopy = `MiniMind ${type}:

${content}

Shared from MiniMind AI`;

    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        addNotification('Answer copied to clipboard!', 'success');
      }).catch((error) => {
        console.error('Clipboard write failed:', error);
        // Fallback to legacy execCommand
        fallbackToLegacyCopy(textToCopy);
      });
    } else {
      // Fallback to legacy execCommand
      fallbackToLegacyCopy(textToCopy);
    }
  };

  // Legacy copy fallback
  const fallbackToLegacyCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        addNotification('Answer copied to clipboard!', 'success');
      } else {
        addNotification('Failed to copy to clipboard', 'error');
      }
    } catch (error) {
      console.error('Legacy copy failed:', error);
      addNotification('Failed to copy to clipboard', 'error');
    }

    document.body.removeChild(textArea);
  };

  // Enhanced voice input function with language and casual mode support
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Configure recognition
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // Set language for recognition based on selected language and casual mode
      let recognitionLanguage = 'en-US';

      if (selectedLanguage === 'en') {
        recognitionLanguage = 'en-US';
      } else if (selectedLanguage === 'hi') {
        recognitionLanguage = casualMode ? 'hi-IN' : 'hi-IN';
      } else if (selectedLanguage === 'bn') {
        recognitionLanguage = 'bn-IN';
      } else if (selectedLanguage === 'ta') {
        recognitionLanguage = 'ta-IN';
      } else if (selectedLanguage === 'te') {
        recognitionLanguage = 'te-IN';
      } else if (selectedLanguage === 'ml') {
        recognitionLanguage = 'ml-IN';
      } else if (selectedLanguage === 'kn') {
        recognitionLanguage = 'kn-IN';
      } else if (selectedLanguage === 'gu') {
        recognitionLanguage = 'gu-IN';
      } else if (selectedLanguage === 'pa') {
        recognitionLanguage = 'pa-IN';
      } else if (selectedLanguage === 'or') {
        recognitionLanguage = 'or-IN';
      } else if (selectedLanguage === 'as') {
        recognitionLanguage = 'as-IN';
      } else if (selectedLanguage === 'mr') {
        recognitionLanguage = 'mr-IN';
      } else if (selectedLanguage === 'ne') {
        recognitionLanguage = 'ne-NP';
      } else if (selectedLanguage === 'sa') {
        recognitionLanguage = 'sa-IN';
      } else if (selectedLanguage === 'ur') {
        recognitionLanguage = 'ur-PK';
      } else if (selectedLanguage === 'sd') {
        recognitionLanguage = 'sd-PK';
      } else if (selectedLanguage === 'ks') {
        recognitionLanguage = 'ks-IN';
      } else if (selectedLanguage === 'doi') {
        recognitionLanguage = 'doi-IN';
      } else if (selectedLanguage === 'mni') {
        recognitionLanguage = 'mni-IN';
      } else if (selectedLanguage === 'sat') {
        recognitionLanguage = 'sat-IN';
      } else if (selectedLanguage === 'mai') {
        recognitionLanguage = 'mai-IN';
      } else if (selectedLanguage === 'kok') {
        recognitionLanguage = 'kok-IN';
      } else if (selectedLanguage === 'bho') {
        recognitionLanguage = 'bho-IN';
      } else if (selectedLanguage === 'bod') {
        recognitionLanguage = 'bod-IN';
      } else if (selectedLanguage === 'raj') {
        recognitionLanguage = 'hi-IN'; // Rajasthani uses Hindi recognition
      } else if (selectedLanguage === 'hinglish') {
        recognitionLanguage = 'hi-IN'; // Hinglish uses Hindi recognition
      } else {
        // For other languages, try to map or fallback to English
        recognitionLanguage = `${selectedLanguage}-${selectedLanguage.toUpperCase()}`;
      }

      recognition.lang = recognitionLanguage;

      recognition.onstart = () => {
        addNotification(`🎤 Listening in ${languages[selectedLanguage]?.name || 'selected language'}... Speak now!`, 'success');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        addNotification('✅ Voice input captured!', 'success');
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = `❌ Voice input error: ${event.error}`;

        // Provide specific error messages
        if (event.error === 'no-speech') {
          errorMessage = '❌ No speech detected. Please try again and speak clearly.';
        } else if (event.error === 'audio-capture') {
          errorMessage = '❌ No microphone found. Please check your device.';
        } else if (event.error === 'not-allowed') {
          errorMessage = '❌ Microphone access denied. Please allow microphone access in your browser settings.';
        } else if (event.error === 'service-not-allowed') {
          errorMessage = '❌ Speech service not allowed. Please check your browser settings.';
        } else if (event.error === 'language-not-supported') {
          errorMessage = `❌ Language ${languages[selectedLanguage]?.name || selectedLanguage} not supported for voice input. Try switching to English or Hindi.`;
        }

        addNotification(errorMessage, 'error');
      };

      recognition.onend = () => {
        addNotification('🎤 Voice input ended', 'info');
      };

      try {
        recognition.start();
      } catch (error) {
        console.error('Speech recognition start error:', error);
        addNotification('❌ Failed to start voice input. Please try again.', 'error');
      }
    } else {
      addNotification('❌ Voice input not supported in your browser. Please try Chrome, Edge, or Safari.', 'error');
    }
  };

  // Manual translation function
  const handleManualTranslation = async (text, targetLanguage) => {
    try {
      const translatedText = await AIService.translateText(text, targetLanguage, 'en');
      return translatedText;
    } catch (error) {
      console.error('Manual translation error:', error);
      addNotification('❌ Translation failed. Showing original text.', 'error');
      return text;
    }
  };

  // Function to translate answer to a specific language
  const translateAnswer = async (answer, targetLanguage, setTranslatedAnswer) => {
    try {
      const translatedText = await handleManualTranslation(answer, targetLanguage);
      setTranslatedAnswer(translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      addNotification('❌ Translation failed.', 'error');
    }
  };

  // Ultra-realistic voice synthesis with advanced voice selection and controls
  const handleSpeak = (text, mode = 'beginner') => {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        addNotification('❌ Speech synthesis not supported in your browser', 'error');
        return;
      }

      // Normalize text to string in case any non-string slips through
      const rawText = text == null ? '' : (typeof text === 'string' ? text : String(text));

      // Stop any current speech (toggle behavior)
      if (isSpeaking) {
        stopSpeech();
        return;
      }

      // Clean text for natural speech
      const cleanText = cleanTextForSpeech(rawText);
      if (!cleanText.trim()) {
        addNotification('No text to speak', 'error');
        return;
      }

      console.log('🎤 handleSpeak called with text length:', cleanText.length, 'mode:', mode);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      setCurrentSpeech(utterance);
      setIsSpeaking(true);
      setSpeechPaused(false);

      // Wait for voices to load if not already loaded
      const speakWithVoice = () => {
        const voices = speechSynthesis.getVoices();

        // Enhanced language mapping for ultra-realistic voices
        const languageVoiceMap = {
          'en': ['en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN', 'en-NZ', 'en-ZA'],
          'hi': ['hi-IN', 'hi'],
          'ur': ['ur-PK', 'ur-IN', 'ur'],
          'ta': ['ta-IN', 'ta-LK', 'ta-SG', 'ta'],
          'ml': ['ml-IN', 'ml'],
          'bn': ['bn-IN', 'bn-BD', 'bn'],
          'pa': ['pa-IN', 'pa-PK', 'pa'],
          'gu': ['gu-IN', 'gu'],
          'kn': ['kn-IN', 'kn'],
          'te': ['te-IN', 'te'],
          'or': ['or-IN', 'or'],
          'as': ['as-IN', 'as'],
          'ne': ['ne-NP', 'ne-IN', 'ne'],
          'mr': ['mr-IN', 'mr'],
          'sa': ['sa-IN', 'sa'],
          'sd': ['sd-IN', 'sd-PK', 'sd'],
          'ks': ['ks-IN', 'ks'],
          'bod': ['bod-IN', 'bod'],
          'hinglish': ['hi-IN', 'en-IN', 'hi', 'en-US']
        };

        // Ultra-realistic mode-specific voice characteristics
        const voiceSettings = {
          beginner: { rate: 0.8, pitch: 1.1, volume: 0.9 }, // Slower, friendly, higher pitch
          thinker: { rate: 0.9, pitch: 0.95, volume: 0.85 }, // Natural pace, slightly lower pitch
          story: { rate: 0.85, pitch: 1.05, volume: 0.9 }, // Storytelling pace, expressive
          mastery: { rate: 0.95, pitch: 0.9, volume: 0.85 }, // Professional, confident
          oneword: { rate: 0.75, pitch: 1.15, volume: 0.9 } // Clear and precise
        };

        const settings = voiceSettings[mode] || voiceSettings.beginner;
        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;
        utterance.volume = settings.volume;

        // Get preferred languages for current selection
        const voiceLangs = languageVoiceMap[selectedLanguage] || ['en-US'];
        utterance.lang = voiceLangs[0];

        // Advanced voice selection algorithm for ultra-realistic voices
        const findUltraRealisticVoice = () => {
          const voicePreferences = [
            // Priority 1: Neural/AI voices (most realistic)
            (v) => v.name.toLowerCase().includes('neural') ||
              v.name.toLowerCase().includes('enhanced') ||
              v.name.toLowerCase().includes('premium') ||
              v.name.toLowerCase().includes('wavenet') ||
              v.name.toLowerCase().includes('studio'),

            // Priority 2: System voices (usually high quality)
            (v) => v.localService && !v.name.toLowerCase().includes('google'),

            // Priority 3: Platform-specific quality voices
            (v) => v.name.toLowerCase().includes('siri') ||
              v.name.toLowerCase().includes('cortana') ||
              v.name.toLowerCase().includes('alexa') ||
              v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('alex'),

            // Priority 4: Any native voice for the language
            (v) => v.localService,

            // Priority 5: Any voice for the language
            (v) => true
          ];

          for (const lang of voiceLangs) {
            const langCode = lang.split('-')[0];
            const languageVoices = voices.filter(v =>
              v.lang.toLowerCase().startsWith(langCode.toLowerCase()) ||
              v.lang.toLowerCase() === lang.toLowerCase()
            );

            for (const preference of voicePreferences) {
              const matchingVoices = languageVoices.filter(preference);
              if (matchingVoices.length > 0) {
                // Prefer female voices for beginner mode, male for mastery
                if (mode === 'beginner') {
                  const femaleVoices = matchingVoices.filter(v =>
                    v.name.toLowerCase().includes('female') ||
                    v.name.toLowerCase().includes('woman') ||
                    ['samantha', 'alex', 'victoria', 'zira', 'helena', 'susan', 'karen'].some(name =>
                      v.name.toLowerCase().includes(name.toLowerCase())
                    )
                  );
                  if (femaleVoices.length > 0) return femaleVoices[0];
                }

                if (mode === 'mastery') {
                  const maleVoices = matchingVoices.filter(v =>
                    v.name.toLowerCase().includes('male') ||
                    v.name.toLowerCase().includes('man') ||
                    ['david', 'mark', 'daniel', 'james', 'tom', 'fred'].some(name =>
                      v.name.toLowerCase().includes(name.toLowerCase())
                    )
                  );
                  if (maleVoices.length > 0) return maleVoices[0];
                }

                return matchingVoices[0];
              }
            }
          }

          return null;
        };

        const selectedVoice = findUltraRealisticVoice();
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log(`🎤 Ultra-realistic voice: ${selectedVoice.name} (${selectedVoice.lang}) - ${mode} mode`);
        } else {
          console.log(`🎤 Using default voice for ${mode} mode`);
        }

        // Enhanced event listeners
        utterance.addEventListener('start', () => {
          console.log(`🗣️ Speaking in ${mode} mode`);
          setIsSpeaking(true);
        });

        utterance.addEventListener('end', () => {
          console.log('🔇 Speech completed');
          setIsSpeaking(false);
          setSpeechPaused(false);
          setCurrentSpeech(null);
        });

        utterance.addEventListener('error', (e) => {
          console.error('🚫 Speech error:', e.error);
          addNotification(`Speech error: ${e.error}`, 'error');
          setIsSpeaking(false);
          setSpeechPaused(false);
          setCurrentSpeech(null);
        });

        utterance.addEventListener('pause', () => {
          setSpeechPaused(true);
        });

        utterance.addEventListener('resume', () => {
          setSpeechPaused(false);
        });

        // Speak with enhanced settings
        speechSynthesis.speak(utterance);
      };

      // Handle voice loading
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', speakWithVoice, { once: true });
      } else {
        speakWithVoice();
      }
    } catch (err) {
      console.error('🚫 Unexpected speech error:', err);
      addNotification('Speech could not be started. Please try again.', 'error');
    }
  };

  // Enhanced fullscreen mode switching with answer loading
  const handleFullscreenModeChange = (newMode, existingAnswer, currentQuestion) => {
    setFullscreenMode(newMode);

    // Initialize chat with existing answer if available
    if (existingAnswer && currentQuestion) {
      setChatMessages(prev => ({
        ...prev,
        [newMode]: [{ type: 'ai', content: existingAnswer, timestamp: Date.now() }]
      }));
    } else if (!chatMessages[newMode]) {
      // Initialize empty chat if no messages exist
      setChatMessages(prev => ({
        ...prev,
        [newMode]: []
      }));
    }
  };

  // Smart search function
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Search in history entries
    const results = history.filter(entry =>
      entry.question.toLowerCase().includes(term.toLowerCase()) ||
      Object.values(entry.answers).some(answer =>
        answer && answer.toLowerCase().includes(term.toLowerCase())
      )
    );

    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Load search result
  const loadSearchResult = (entry) => {
    setQuestion(entry.question);
    setAnswers(entry.answers);
    setCurrentPage('home');
    setSearchTerm('');
    setShowSearchResults(false);
    addNotification('Search result loaded successfully!', 'success');
  };

  // Generate related topics function (using the unified Netlify-backed AI response)
  const generateRelatedTopics = async (currentQuestion) => {
    if (!currentQuestion.trim()) return [];

    try {
      const prompt = `Based on the question "${currentQuestion}", provide 5 related topics or questions that would help deepen understanding of this subject. Format each as a concise question or topic. Number them 1-5.`;

      // Use the same AI pipeline (getAIResponse) so language & casual mode are respected
      const response = await getAIResponse(prompt, 'thinker');

      // Parse the response to extract topics
      const topics = String(response || '')
        .split('\n')
        .filter(line => /^\d+\.\s*/.test(line))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 5);

      return topics;
    } catch (error) {
      console.error('Error generating related topics:', error);
      return [];
    }
  };

  // Handle contextual learning button click
  const handleContextualLearning = async () => {
    if (!question.trim()) {
      addNotification('Please enter a question first', 'error');
      return;
    }

    setIsGeneratingRelatedTopics(true);
    setShowContextualPanel(true);

    try {
      const topics = await generateRelatedTopics(question);
      setRelatedTopics(topics);
    } catch (error) {
      console.error('Error in contextual learning:', error);
      addNotification('Failed to generate related topics', 'error');
      setRelatedTopics([]);
    } finally {
      setIsGeneratingRelatedTopics(false);
    }
  };

  // Load related topic as new question
  const loadRelatedTopic = (topic) => {
    setQuestion(topic);
    setAnswers({});
    setShowContextualPanel(false);
    setRelatedTopics([]);
    // Scroll to the input
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputRef.current.focus();
    }
  };

  // Continue chat in specific mode
  const handleContinueChat = (mode) => {
    handleFullscreenModeChange(mode, answers[mode], question);
  };

  // Load history entry
  const loadHistoryEntry = (entry) => {
    setQuestion(entry.question);
    setAnswers(entry.answers);
    setCurrentPage('home');

    // Show notification
    addNotification('History entry loaded successfully!', 'success');
  };

  // Filter and sort history
  const filteredHistory = useMemo(() => {
    let filtered = history;

    // Apply search filter
    if (historySearchTerm) {
      const term = historySearchTerm.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.question.toLowerCase().includes(term) ||
        Object.values(entry.answers).some(answer =>
          answer.toLowerCase().includes(term)
        )
      );
    }

    // Apply mode filter
    if (historyFilterMode) {
      filtered = filtered.filter(entry =>
        entry.answers[historyFilterMode]
      );
    }

    // Apply language filter
    if (historyFilterLanguage) {
      filtered = filtered.filter(entry =>
        entry.language === historyFilterLanguage
      );
    }

    // Apply sorting
    if (historySortBy === 'oldest') {
      filtered = [...filtered].sort((a, b) => a.timestamp - b.timestamp);
    } else {
      filtered = [...filtered].sort((a, b) => b.timestamp - a.timestamp);
    }

    return filtered;
  }, [history, historySearchTerm, historyFilterMode, historyFilterLanguage, historySortBy]);

  // Pin/unpin history entry
  const pinHistoryEntry = (id) => {
    const entry = history.find(e => e.id === id);
    const updatedHistory = history.map(e =>
      e.id === id ? { ...e, pinned: !e.pinned } : e
    );
    setHistory(updatedHistory);
    localStorage.setItem('minimind-history', JSON.stringify(updatedHistory));
    addNotification(entry.pinned ? 'Entry unpinned' : 'Entry pinned', 'success');
  };

  // Delete history entry
  const deleteHistoryEntry = (id) => {
    const updatedHistory = history.filter(entry => entry.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('minimind-history', JSON.stringify(updatedHistory));
    addNotification('Entry deleted', 'success');
  };

  // Clear all history
  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      setHistory([]);
      localStorage.setItem('minimind-history', JSON.stringify([]));
      addNotification('History cleared successfully!', 'success');
    }
  };

  // Export history
  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `minimind-history-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addNotification('History exported successfully!', 'success');
  };

  // Send message in chat
  const handleChatSubmit = async (e, mode) => {
    e.preventDefault();

    // Check if current mode is enabled
    if (!enabledModes[mode]) {
      addNotification(`${modes[mode].name} mode is currently disabled. Please enable it in the mode filter.`);
      return;
    }

    const input = e.target.elements.chatInput;
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    setChatMessages(prev => ({
      ...prev,
      [mode]: [...(prev[mode] || []), { type: 'user', content: message }]
    }));

    input.value = '';

    try {
      // Get AI response using conversation history
      const currentMessages = chatMessages[mode] || [];
      const allMessages = [...currentMessages, { type: 'user', content: message }];
      const response = await AIService.continueConversation(allMessages, mode, selectedLanguage);

      setChatMessages(prev => ({
        ...prev,
        [mode]: [...prev[mode], { type: 'ai', content: response }]
      }));
    } catch (error) {
      console.error('Error in chat:', error);
      // Provide more specific error message for payment issues
      if (error.message.includes('Payment required')) {
        addNotification(`Payment required for chat in ${modes[mode].name} mode. Please check your OpenRouter account.`, 'error');
        setChatMessages(prev => ({
          ...prev,
          [mode]: [...prev[mode], { type: 'ai', content: 'Payment required for AI service. Please check your OpenRouter account and billing information.' }]
        }));
      } else {
        addNotification(`Chat error: ${error.message}`, 'error');
        setChatMessages(prev => ({
          ...prev,
          [mode]: [...prev[mode], { type: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]
        }));
      }
    }
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, fullscreenMode]);

  return (
    <div className="app">
      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobile && isMobileNavOpen && (
          <>
            <motion.div
              className="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
            />
            <motion.div
              className="mobile-nav-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="mobile-nav-header">
                <div className="nav-header-brand">
                  <span className="brand-icon">🧠</span>
                  <h3>MiniMind</h3>
                </div>
                <button
                  className="mobile-nav-close"
                  onClick={() => setIsMobileNavOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mobile-nav-content">
                {/* Learning Group */}
                <div className="nav-group">
                  <h4 className="nav-group-title">Learning</h4>
                  <div className="nav-group-items">
                    {navigationItems.filter(item => ['home', 'progress', 'oneword', 'history'].includes(item.id)).map((item) => (
                      <button
                        key={item.id}
                        className={`mobile-nav-item ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentPage(item.id);
                          setIsMobileNavOpen(false);
                        }}
                        style={{ '--item-color': item.color }}
                      >
                        <div className="nav-item-icon">
                          <item.icon size={20} />
                        </div>
                        <span className="nav-item-label">{item.label}</span>
                        {currentPage === item.id && <div className="active-indicator">●</div>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* System Group */}
                <div className="nav-group">
                  <h4 className="nav-group-title">System</h4>
                  <div className="nav-group-items">
                    {navigationItems.filter(item => ['about', 'faq', 'language', 'settings'].includes(item.id)).map((item) => (
                      <button
                        key={item.id}
                        className={`mobile-nav-item ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentPage(item.id);
                          setIsMobileNavOpen(false);
                        }}
                        style={{ '--item-color': item.color }}
                      >
                        <div className="nav-item-icon">
                          <item.icon size={20} />
                        </div>
                        <span className="nav-item-label">{item.label}</span>
                        {currentPage === item.id && <div className="active-indicator">●</div>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mobile-nav-footer">
                <button className="nav-auth-btn">
                  <User size={18} />
                  <span>Login / Sign Up</span>
                </button>
                <p className="app-version">v2.3.0 • Beta</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation Sidebar */}
      <motion.div
        className={`navigation ${navExpanded ? 'expanded' : ''}`}
        onMouseEnter={() => window.innerWidth > 768 && setNavExpanded(true)}
        onMouseLeave={() => window.innerWidth > 768 && setNavExpanded(false)}
      >
        <div className="nav-content">
          {/* Logo */}
          <div className="nav-logo">
            <motion.div
              className="logo-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('home')}
            >
              {/* Logo now uses background image */}
            </motion.div>
            <AnimatePresence>
              {navExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="logo-text"
                >
                  MiniMind
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="nav-divider"></div>

          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage(item.id);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon size={24} color={item.color} />
              <AnimatePresence>
                {navExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="nav-label"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </motion.div>
      {/* Main Content */}
      <div className="main-content">
        {currentPage === 'home' ? (
          <div className="home-page">
            {/* World-Class Hero Header */}
            <div className="header">
              {/* Mobile header bar: menu, logo, theme, language */}
              <div className="header-bar">
                <button
                  className="mobile-nav-toggle"
                  onClick={() => setIsMobileNavOpen(true)}
                  aria-label="Open navigation menu"
                >
                  <Menu size={22} />
                </button>
                <div className="header-bar-center">
                  <span className="header-logo-text">MiniMind</span>
                </div>
                <div className="header-controls">
                  <button
                    className="theme-toggle-btn-mobile"
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  </button>
                  <button
                    className="language-btn-mobile"
                    onClick={() => setIsLanguageModalOpen(true)}
                  >
                    <span className="lang-code">{selectedLanguage.toUpperCase()}</span>
                  </button>
                </div>
              </div>

              <motion.div
                className="hero-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="hero-logo-container">
                  <img src="https://i.ibb.co/fGLH5Dxs/minimind-logo.png" className="hero-logo" alt="MiniMind Logo" />
                  <h1 className="logo">MiniMind</h1>
                </div>
                <p className="tagline">AI-Powered Learning Revolution</p>
              </motion.div>
            </div>

            {/* World-Class Search Section */}
            <motion.div
              className="chat-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >

              {/* Suggested Prompts removed */}

              <div className="chat-controls">
                <ModeFilter
                  enabledModes={enabledModes}
                  onToggleMode={toggleMode}
                  isMobile={isMobile}
                />
              </div>

              <form onSubmit={handleSubmit} className="chat-form">
                <div className="input-group">
                  <motion.button
                    type="button"
                    className="mic-btn"
                    onClick={handleVoiceInput}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Voice Input"
                  >
                    <Mic size={22} strokeWidth={2.5} />
                  </motion.button>

                  <textarea
                    ref={inputRef}
                    value={question}
                    onChange={(e) => {
                      handleQuestionChange(e);
                      // Auto-resize logic
                      e.target.style.height = 'auto';
                      const scrollHeight = e.target.scrollHeight;
                      e.target.style.height = `${Math.min(scrollHeight, 120)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (question.trim()) {
                          // Manually trigger submit
                          const form = e.currentTarget.closest('form');
                          if (form) form.requestSubmit();
                        }
                      }
                    }}
                    placeholder="Ask anything..."
                    className="chat-input"
                    rows={1}
                  />

                  <motion.button
                    type="button"
                    onClick={handleRefinePrompt}
                    className="refine-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!question.trim() || isRefining}
                    title="Refine Prompt"
                  >
                    {isRefining ? (
                      <div className="mini-spinner" />
                    ) : (
                      <Sparkles size={22} strokeWidth={2.5} />
                    )}
                  </motion.button>



                  <motion.button
                    type="submit"
                    className="send-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!question.trim() || isAnswering}
                    title="Send"
                  >
                    <Send size={22} strokeWidth={2.5} />
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Contextual Learning Panel */}
            <AnimatePresence>
              {showContextualPanel && (
                <motion.div
                  className="contextual-panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="contextual-panel-header">
                    <h3>Related Topics</h3>
                    <button
                      className="close-contextual-panel"
                      onClick={() => setShowContextualPanel(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="contextual-topics">
                    {relatedTopics.length > 0 ? (
                      relatedTopics.map((topic, index) => (
                        <motion.button
                          key={index}
                          className="contextual-topic"
                          onClick={() => loadRelatedTopic(topic)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <span className="topic-number">{index + 1}.</span>
                          <span className="topic-text">{topic}</span>
                        </motion.button>
                      ))
                    ) : (
                      <div className="no-topics">
                        {isGeneratingRelatedTopics ? 'Generating related topics...' : 'No related topics found.'}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Refined Question Fullscreen View (Mobile Redesign) */}
            <AnimatePresence>
              {showRefinedPrompt && (
                <motion.div
                  className="refined-fullscreen-mobile"
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  {/* Zone 1: Header */}
                  <div className="rf-header">
                    <button
                      onClick={() => setShowRefinedPrompt(false)}
                      className="rf-back-btn"
                      aria-label="Close"
                    >
                      <ArrowLeft size={22} />
                    </button>
                    <h3>Refined Question</h3>
                    <div className="rf-header-spacer" />
                  </div>

                  {/* Zone 2: Content & Context */}
                  <div className="rf-scroll-area">
                    <div className="rf-card">
                      {isRefining ? (
                        <div className="rf-loading">
                          <div className="typing-indicator">
                            <span></span><span></span><span></span>
                          </div>
                          <p>Optimizing your prompt using best practices...</p>
                        </div>
                      ) : (
                        <FormattedText
                          text={refinedPrompt}
                          className="rf-text-content"
                        />
                      )}
                    </div>

                    {/* Zone 3: Status / Context */}
                    {!isRefining && (
                      <div className="rf-context-box">
                        <Sparkles size={16} className="rf-context-icon" />
                        <p>This version is clearer, more specific, and structured for the best possible AI response.</p>
                      </div>
                    )}

                    <div className="rf-scroll-spacer" />
                  </div>

                  {/* Zone 4: Fixed Bottom Action Bar */}
                  <div className="rf-bottom-bar">
                    <button
                      onClick={() => {
                        setQuestion(refinedPrompt);
                        setShowRefinedPrompt(false);
                      }}
                      className="rf-primary-btn"
                      disabled={isRefining}
                    >
                      Use Refined Question
                    </button>
                    <button
                      onClick={() => setShowRefinedPrompt(false)}
                      className="rf-secondary-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>


            {/* Empty State */}
            {!fullscreenMode && Object.keys(answers).length === 0 && !isAnswering && !showSuggestedPrompts && (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="empty-state-content">
                  <Sparkles size={24} className="empty-icon" />
                  <p>Select modes and ask a question to begin your journey of minimized wisdom.</p>
                </div>
              </motion.div>
            )}

            {/* Enhanced Answer Capsules - 2x2 Grid on desktop, accordion on mobile */}
            <AnimatePresence>
              {!fullscreenMode && (Object.keys(answers).length > 0 || isAnswering) && (
                <motion.div
                  className={`capsules-container ${isMobile ? 'mobile-accordion' : ''}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                >
                  {Object.entries(modes)
                    .filter(([modeKey]) => enabledModes[modeKey])
                    .map(([modeKey, modeConfig], index) => {
                      const modeLabels = {
                        beginner: 'Active',
                        thinker: 'Logic',
                        story: 'Narrative',
                        mastery: 'Academic'
                      };

                      return (
                        <motion.div
                          key={modeKey}
                          className={`capsule ${modeConfig.theme}`}
                          whileHover={{ scale: 1.02 }}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div
                            className="capsule-header"
                          >
                            <span className="mode-icon">{modeConfig.icon}</span>
                            <h3>{modeConfig.name}</h3>
                            <span className="mode-tag">{modeLabels[modeKey]}</span>
                            <button
                              className="fullscreen-btn-header"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFullscreenModeChange(modeKey, answers[modeKey], question);
                              }}
                              title="View fullscreen"
                              style={{
                                marginLeft: 'auto',
                                background: 'transparent',
                                border: 'none',
                                color: 'inherit',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2-2h3" />
                              </svg>
                            </button>
                          </div>
                          <div className="capsule-content" onClick={(e) => e.stopPropagation()}>
                            {loadingModes[modeKey] ? (
                              <div className={`typing-indicator ${modeKey}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            ) : answers[modeKey] ? (
                              <>
                                <FormattedText
                                  text={answers[modeKey]}
                                  className="capsule-answer"
                                />
                                {answers[modeKey] && (
                                  <div className="capsule-controls">
                                    <SpeechControls
                                      onSpeak={handleSpeak}
                                      onPause={pauseSpeech}
                                      onResume={resumeSpeech}
                                      onStop={stopSpeech}
                                      isSpeaking={isSpeaking}
                                      isPaused={speechPaused}
                                      text={answers[modeKey]}
                                      mode={modeKey}
                                    />
                                    {!settings.autoTranslation && selectedLanguage !== 'en' && (
                                      <button
                                        className="translate-btn"
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          const translated = await handleManualTranslation(answers[modeKey], selectedLanguage);
                                          setAnswers(prev => ({ ...prev, [modeKey]: translated }));
                                        }}
                                        title="Translate to selected language"
                                      >
                                        <Globe size={16} />
                                      </button>
                                    )}
                                    {/* Translate this button for manual translation to any language */}
                                    <button
                                      className="translate-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTranslationText(answers[modeKey]);
                                        setTranslatedText('');
                                        setTranslationSourceLanguage('en');
                                        setTranslationTargetLanguage(selectedLanguage);
                                        setIsTranslationModalOpen(true);
                                      }}
                                      title="Translate this answer to another language"
                                    >
                                      <Languages size={16} />
                                    </button>
                                  </div>
                                )}
                                <div className="capsule-answer-controls">
                                  <button
                                    className="expand-to-ekakshar-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Switch to Ekakshar mode
                                      setCurrentPage('oneword');
                                      // Set the question for Ekakshar
                                      setOnewordInput(question);
                                      // Get the Ekakshar answer
                                      setTimeout(() => {
                                        const getEkaksharAnswer = async () => {
                                          try {
                                            setIsOnewordLoading(true);
                                            const response = await AIService.getOneWordAnswer(question, selectedLanguage);
                                            setOnewordAnswer(response);
                                            setIsOnewordLoading(false);
                                          } catch (error) {
                                            console.error('Ekakshar error:', error);
                                            addNotification('Failed to get Ekakshar answer', 'error');
                                            setIsOnewordLoading(false);
                                          }
                                        };
                                        getEkaksharAnswer();
                                      }, 100);
                                    }}
                                  >
                                    <Wand2 size={16} /> Get One-Word Summary
                                  </button>
                                  <button
                                    className="copy-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      fallbackToClipboard(answers[modeKey], `${modeConfig.name} Answer`);
                                    }}
                                    title="Copy answer to clipboard"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                    </svg>
                                  </button>
                                  <button
                                    className="download-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Create a Blob with the content
                                      const blob = new Blob([answers[modeKey]], { type: 'text/plain' });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `minimind-${modeKey}-answer-${Date.now()}.txt`;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      URL.revokeObjectURL(url);
                                    }}
                                    title="Download answer as text file"
                                  >
                                    <Download size={16} />
                                  </button>
                                  <button
                                    className="share-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const shareData = {
                                        title: `MiniMind ${modeConfig.name} Answer`,
                                        text: answers[modeKey].substring(0, 100) + '...',
                                        url: window.location.href
                                      };

                                      if (navigator.share) {
                                        navigator.share(shareData).catch((error) => {
                                          console.error('Share failed:', error);
                                          // Fallback to clipboard if share fails
                                          fallbackToClipboard(answers[modeKey], `${modeConfig.name} Answer`);
                                        });
                                      } else {
                                        // Fallback for browsers that don't support Web Share API
                                        fallbackToClipboard(answers[modeKey], `${modeConfig.name} Answer`);
                                      }
                                    }}
                                    title="Share answer"
                                  >
                                    <Share2 size={16} />
                                  </button>
                                </div>
                                {/* Chat input for capsule */}
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const input = e.target.elements.capsuleInput;
                                    const message = input.value.trim();
                                    if (message) {
                                      // Initialize chat for this mode if not exists
                                      if (!chatMessages[modeKey]) {
                                        setChatMessages(prev => ({
                                          ...prev,
                                          [modeKey]: [{ type: 'ai', content: answers[modeKey], timestamp: Date.now() }]
                                        }));
                                      }
                                      handleFullscreenModeChange(modeKey, answers[modeKey], question);
                                      // Add user message to chat after entering fullscreen
                                      setTimeout(() => {
                                        setChatMessages(prev => ({
                                          ...prev,
                                          [modeKey]: [...(prev[modeKey] || []), { type: 'user', content: message }]
                                        }));
                                      }, 100);
                                      input.value = '';
                                    }
                                  }}
                                  className="capsule-chat-form"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    name="capsuleInput"
                                    type="text"
                                    placeholder={`Chat with ${modeConfig.name}...`}
                                    className="capsule-chat-input"
                                  />
                                  <motion.button
                                    type="submit"
                                    className="capsule-send-btn"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Send size={14} />
                                  </motion.button>
                                </form>
                              </>
                            ) : (
                              <div className="waiting-state">
                                <p>Ready to explain...</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fullscreen Mode */}
            {/* Fullscreen Mode (Mobile Rebuild) */}
            <AnimatePresence>
              {fullscreenMode && (
                <motion.div
                  className={`fullscreen-mode-mobile ${fullscreenMode}`}
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  {/* Part 1: Sticky Top Header */}
                  <div className="fs-header">
                    <button
                      className="fs-back-btn"
                      onClick={() => setFullscreenMode(null)}
                      aria-label="Close"
                    >
                      <ArrowLeft size={22} />
                    </button>
                    <div className="fs-header-title">
                      <span className="fs-mode-icon">{modes[fullscreenMode].icon}</span>
                      <span className="fs-mode-name">{modes[fullscreenMode].name}</span>
                    </div>
                    <div className="fs-header-spacer"></div> {/* Balance layout */}
                  </div>

                  {/* Part 2: Scrollable Content Area */}
                  <div className="fs-scroll-area" ref={chatContainerRef}>
                    {chatMessages[fullscreenMode]?.map((msg, idx) => (
                      <div key={idx} className={`fs-message-wrapper ${msg.type}`}>
                        <div className="fs-message-card">
                          {msg.type === 'ai' ? (
                            <>
                              <div className="fs-content-body">
                                <FormattedText
                                  text={msg.content}
                                  className="fs-formatted-text"
                                />
                              </div>

                              {/* Part 3: Action Row (Inside Card, Bottom) */}
                              <div className="fs-actions-row">
                                <button
                                  className="fs-action-btn"
                                  onClick={() => handleSpeak(msg.content, fullscreenMode)}
                                  title="Listen"
                                >
                                  <Volume2 size={18} />
                                </button>
                                <button
                                  className="fs-action-btn"
                                  onClick={() => fallbackToClipboard(msg.content, 'Answer')}
                                  title="Copy"
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></svg>
                                </button>
                                <button
                                  className="fs-action-btn"
                                  onClick={() => {
                                    // Logic for One-Word expansion inline
                                    setFullscreenMode(null);
                                    setCurrentPage('oneword');
                                    setOnewordInput(question);
                                    setTimeout(() => {
                                      const getEkaksharAnswer = async () => {
                                        try {
                                          setIsOnewordLoading(true);
                                          const response = await AIService.getOneWordAnswer(question, selectedLanguage);
                                          setOnewordAnswer(response);
                                          setIsOnewordLoading(false);
                                        } catch (error) { setIsOnewordLoading(false); }
                                      };
                                      getEkaksharAnswer();
                                    }, 100);
                                  }}
                                  title="One Word Summary"
                                >
                                  <Wand2 size={18} />
                                </button>
                                <button
                                  className="fs-action-btn"
                                  onClick={() => {
                                    const shareData = { title: 'MiniMind Answer', text: msg.content.substring(0, 100), url: window.location.href };
                                    if (navigator.share) navigator.share(shareData).catch(console.error);
                                    else fallbackToClipboard(msg.content, 'Answer');
                                  }}
                                  title="Share"
                                >
                                  <Share2 size={18} />
                                </button>
                              </div>
                            </>
                          ) : (
                            <p className="fs-user-text">{msg.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="fs-bottom-spacer" />
                  </div>

                  {/* Part 4: Fixed Bottom Input */}
                  <div className="fs-input-bar">
                    <form
                      onSubmit={(e) => handleChatSubmit(e, fullscreenMode)}
                      className="fs-input-form"
                    >
                      <div className="fs-input-container">
                        <input
                          name="chatInput"
                          type="text"
                          placeholder="Continue chatting..."
                          className="fs-input-field"
                          autoComplete="off"
                        />
                        <button type="submit" className="fs-send-btn">
                          <Send size={18} />
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Other pages
          <div className="page">
            <div className="page-header">
              <button
                className="back-btn"
                onClick={() => setCurrentPage('home')}
                aria-label="Go back"
              >
                <ArrowLeft size={22} />
              </button>
              <h1>{navigationItems.find(item => item.id === currentPage)?.label}</h1>
            </div>

            <div className="page-content">
              {currentPage === 'progress' && (
                <div className="progress-page">
                  <div className="page-header-content">
                    <p>Track your learning journey across different modes and topics.</p>
                  </div>

                  {/* Progress Stats */}
                  <div className="progress-stats">
                    <div className="stat-card">
                      <div className="stat-value">{history.length}</div>
                      <div className="stat-label">Questions Asked</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{Object.keys(modes).filter(mode => enabledModes[mode]).length}</div>
                      <div className="stat-label">Modes Used</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{Math.round(history.length > 0 ? history.reduce((acc, entry) => acc + Object.keys(entry.answers).length, 0) / history.length : 0)}</div>
                      <div className="stat-label">Avg. Modes</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{new Set(history.map(entry => entry.question)).size}</div>
                      <div className="stat-label">Unique Topics</div>
                    </div>
                  </div>

                  {/* Mode Distribution */}
                  <div className="mode-distribution">
                    <h3>Mode Usage Distribution</h3>
                    <div className="distribution-bars">
                      {Object.entries(modes).map(([modeKey, modeConfig]) => {
                        const modeCount = history.filter(entry => entry.answers[modeKey]).length;
                        const percentage = history.length > 0 ? (modeCount / history.length) * 100 : 0;

                        return (
                          <div key={modeKey} className={`distribution-bar ${modeKey}`}>
                            <div className="mode-icon-container">
                              <span className="mode-icon">{modeConfig.icon}</span>
                            </div>
                            <div className="bar-container">
                              <div
                                className="bar-fill"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="bar-label">
                              {modeConfig.name}: {modeCount} ({percentage.toFixed(1)}%)
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Learning Timeline */}
                  <div className="timeline-section">
                    <h3>Learning Timeline</h3>
                    <div className="timeline">
                      {history.slice(0, 10).map((entry, index) => (
                        <div key={entry.id} className="timeline-item">
                          <div className="timeline-date">
                            {entry.date} at {entry.time}
                          </div>
                          <div className="timeline-question">
                            {entry.question.length > 80 ? entry.question.substring(0, 80) + '...' : entry.question}
                          </div>
                          <div className="timeline-modes">
                            {Object.keys(entry.answers).map(mode => (
                              <span key={mode} className={`timeline-mode ${mode}`}>
                                {modes[mode]?.icon} {modes[mode]?.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Badges Section */}
                  <div className="badges-section">
                    <h3>Your Achievements</h3>
                    <div className="badges-grid">
                      {/* Question Badges */}
                      <div className={`badge ${history.length >= 1 ? 'earned' : ''}`}>
                        <div className="badge-icon">❓</div>
                        <div className="badge-name">First Question</div>
                        <div className="badge-description">Ask your first question</div>
                      </div>
                      <div className={`badge ${history.length >= 5 ? 'earned' : ''}`}>
                        <div className="badge-icon">📚</div>
                        <div className="badge-name">Curious Mind</div>
                        <div className="badge-description">Ask 5 questions</div>
                      </div>
                      <div className={`badge ${history.length >= 10 ? 'earned' : ''}`}>
                        <div className="badge-icon">🎓</div>
                        <div className="badge-name">Knowledge Seeker</div>
                        <div className="badge-description">Ask 10 questions</div>
                      </div>
                      <div className={`badge ${history.length >= 25 ? 'earned' : ''}`}>
                        <div className="badge-icon">🧠</div>
                        <div className="badge-name">Scholar</div>
                        <div className="badge-description">Ask 25 questions</div>
                      </div>

                      {/* Mode Badges */}
                      <div className={`badge ${Object.keys(modes).every(mode => enabledModes[mode]) ? 'earned' : ''}`}>
                        <div className="badge-icon">🔄</div>
                        <div className="badge-name">Explorer</div>
                        <div className="badge-description">Use all learning modes</div>
                      </div>
                      <div className={`badge ${Object.values(enabledModes).filter(Boolean).length >= 3 ? 'earned' : ''}`}>
                        <div className="badge-icon">🎯</div>
                        <div className="badge-name">Versatile</div>
                        <div className="badge-description">Use 3+ modes</div>
                      </div>

                      {/* Language Badges */}
                      <div className={`badge ${selectedLanguage !== 'en' ? 'earned' : ''}`}>
                        <div className="badge-icon">🌐</div>
                        <div className="badge-name">Multilingual</div>
                        <div className="badge-description">Use a non-English language</div>
                      </div>
                      <div className={`badge ${casualMode ? 'earned' : ''}`}>
                        <div className="badge-icon">🔤</div>
                        <div className="badge-name">Roman Script</div>
                        <div className="badge-description">Use casual mode</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {currentPage === 'oneword' && (
                <div className="ekakshar-page">
                  <div className="ekakshar-header">
                    <p>Instant One-Word Answers</p>
                  </div>

                  <div className="ekakshar-content">
                    <form onSubmit={handleOnewordSubmit} className="ekakshar-form">
                      <div className="ekakshar-input-wrapper">
                        <input
                          autoFocus
                          type="text"
                          value={onewordInput}
                          onChange={(e) => setOnewordInput(e.target.value)}
                          placeholder="Ask for a definition or fact..."
                          className="ekakshar-input"
                        />
                        {onewordInput && (
                          <button
                            type="button"
                            className="clear-input-btn"
                            onClick={() => setOnewordInput('')}
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="ekakshar-submit-btn"
                        disabled={isOnewordLoading || !onewordInput.trim()}
                      >
                        {isOnewordLoading ? (
                          <div className="mini-spinner-white" />
                        ) : (
                          "Get One-Word Answer"
                        )}
                      </button>
                    </form>

                    <AnimatePresence>
                      {!onewordAnswer && !isOnewordLoading && (
                        <motion.div
                          className="ekakshar-suggestions"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <p className="suggestions-label">Quick Examples:</p>
                          <div className="suggestions-grid">
                            {[
                              "Capital of Japan?",
                              "Define 'Serendipity'",
                              "Opposite of 'Brave'",
                              "Synonym for 'Happy'",
                              "Who invented the telephone?",
                              "G20 summary"
                            ].map((text, i) => (
                              <button
                                key={i}
                                onClick={() => setOnewordInput(text)}
                                className="suggestion-chip"
                              >
                                {text}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {onewordAnswer && (
                        <motion.div
                          className="ekakshar-result-card"
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                        >
                          <div className="result-content">
                            <FormattedText text={onewordAnswer} className="ekakshar-answer-text" />
                          </div>

                          <div className="ekakshar-actions">
                            <button
                              className="ekakshar-action-btn"
                              onClick={() => handleSpeak(onewordAnswer, 'oneword')}
                              title="Speak"
                            >
                              <Volume2 size={18} /> Speak
                            </button>

                            <button
                              className="ekakshar-action-btn"
                              onClick={() => fallbackToClipboard(onewordAnswer, 'Ekakshar Answer')}
                              title="Copy"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></svg> Copy
                            </button>

                            <button
                              className="ekakshar-action-btn primary-action"
                              onClick={() => {
                                setQuestion(onewordInput);
                                setCurrentPage('home');
                                setTimeout(() => {
                                  const beginnerAnswer = async () => {
                                    try {
                                      setIsAnswering(true);
                                      const answer = await getAIResponse(onewordInput, 'beginner');
                                      setAnswers(prev => ({ ...prev, beginner: answer }));
                                      setIsAnswering(false);
                                    } catch (error) { setIsAnswering(false); }
                                  };
                                  beginnerAnswer();
                                }, 100);
                              }}
                            >
                              <Wand2 size={18} /> Expand
                            </button>

                            <button
                              className="ekakshar-action-btn"
                              onClick={() => {
                                const shareData = { title: 'Ekakshar Answer', text: onewordAnswer, url: window.location.href };
                                if (navigator.share) navigator.share(shareData).catch(console.error);
                                else fallbackToClipboard(onewordAnswer, 'Answer');
                              }}
                              title="Share"
                            >
                              <Share2 size={18} /> Share
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
              {currentPage === 'history' && (
                <div className="history-page">
                  <div className="page-header-content">
                    <p>Review your past questions and answers across all learning modes.</p>
                  </div>

                  {/* History Controls */}
                  <div className="history-controls">
                    {/* Search Bar */}
                    <div className="history-search-container">
                      <input
                        type="text"
                        placeholder="Search history..."
                        className="history-search-input"
                        value={historySearchTerm || ''}
                        onChange={(e) => setHistorySearchTerm(e.target.value)}
                      />
                      {historySearchTerm && (
                        <button
                          className="clear-history-search"
                          onClick={() => setHistorySearchTerm('')}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Filters */}
                    <div className="history-filters">
                      <select
                        className="filter-select"
                        value={historyFilterMode || ''}
                        onChange={(e) => setHistoryFilterMode(e.target.value || '')}
                      >
                        <option value="">All Modes</option>
                        {Object.entries(modes).map(([modeKey, modeConfig]) => (
                          <option key={modeKey} value={modeKey}>
                            {modeConfig.name}
                          </option>
                        ))}
                        <option value="oneword">Ekakshar</option>
                      </select>

                      <select
                        className="filter-select"
                        value={historyFilterLanguage || ''}
                        onChange={(e) => setHistoryFilterLanguage(e.target.value || '')}
                      >
                        <option value="">All Languages</option>
                        {Object.entries(languages).map(([code, lang]) => (
                          <option key={code} value={code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>

                      <select
                        className="filter-select"
                        value={historySortBy || 'newest'}
                        onChange={(e) => setHistorySortBy(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                      </select>

                      <button
                        className="clear-filters-btn"
                        onClick={() => {
                          setHistoryFilterMode('');
                          setHistoryFilterLanguage('');
                          setHistorySearchTerm('');
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>

                  {/* History Actions */}
                  <div className="history-actions">
                    <button
                      className="export-history-btn"
                      onClick={exportHistory}
                    >
                      <Download size={16} /> Export History
                    </button>
                    <button
                      className="clear-history-btn"
                      onClick={clearAllHistory}
                    >
                      <X size={16} /> Clear All History
                    </button>
                  </div>

                  {filteredHistory.length > 0 ? (
                    <div className="history-list">
                      {filteredHistory.map((entry) => (
                        <motion.div
                          key={entry.id}
                          className={`history-entry ${expandedHistoryId === entry.id ? 'expanded' : ''}`}
                          initial={false}
                          animate={{ backgroundColor: expandedHistoryId === entry.id ? 'var(--bg-surface)' : 'transparent' }}
                          transition={{ duration: 0.2 }}
                        >
                          {/* Collapsed Header / Toggle */}
                          <div
                            className="history-header-new"
                            onClick={() => {
                              if (expandedHistoryId === entry.id) {
                                setExpandedHistoryId(null);
                              } else {
                                setExpandedHistoryId(entry.id);
                                const availableModes = Object.keys(entry.answers);
                                setExpandedHistoryMode(availableModes.includes('beginner') ? 'beginner' : availableModes[0]);
                              }
                            }}
                          >
                            <div className="history-main-info">
                              <div className="history-meta-row">
                                <span className="history-timestamp">{entry.date} <span className="dot">•</span> {entry.time}</span>
                                {entry.pinned && <span className="pinned-badge">📌 Pinned</span>}
                              </div>
                              <h3 className="history-question-text">{entry.question}</h3>

                              <div className="history-overview-badges">
                                <span className="lang-badge-small">{languages[entry.language]?.flag} {languages[entry.language]?.name}</span>
                                <div className="mode-icons-row">
                                  {Object.keys(entry.answers).map(mode => (
                                    <span key={mode} className={`mode-dot ${mode}`} title={modes[mode]?.name}>
                                      {modes[mode]?.icon}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="expand-icon">
                              {expandedHistoryId === entry.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                          </div>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {expandedHistoryId === entry.id && (
                              <motion.div
                                className="history-expanded-body"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {/* Mode Tabs */}
                                <div className="history-mode-tabs">
                                  {Object.keys(entry.answers).map(mode => (
                                    <button
                                      key={mode}
                                      className={`history-tab ${expandedHistoryMode === mode ? 'active' : ''} ${mode}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedHistoryMode(mode);
                                      }}
                                    >
                                      {modes[mode]?.icon} {modes[mode]?.name}
                                    </button>
                                  ))}
                                </div>

                                {/* Active Answer */}
                                {expandedHistoryMode && entry.answers[expandedHistoryMode] && (
                                  <div className="history-answer-container">
                                    <FormattedText
                                      text={entry.answers[expandedHistoryMode]}
                                      className="history-formatted-text"
                                    />

                                    <div className="answer-mini-controls">
                                      <button onClick={() => handleSpeak(entry.answers[expandedHistoryMode], expandedHistoryMode)} title="Read Aloud">
                                        <Volume2 size={16} />
                                      </button>
                                      <button onClick={() => fallbackToClipboard(entry.answers[expandedHistoryMode], `${modes[expandedHistoryMode]?.name} Answer`)} title="Copy">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
                                      </button>
                                      <button onClick={() => {
                                        const shareData = { title: 'MiniMind Answer', text: entry.answers[expandedHistoryMode].substring(0, 100) + '...', url: window.location.href };
                                        if (navigator.share) navigator.share(shareData).catch(console.error);
                                        else fallbackToClipboard(entry.answers[expandedHistoryMode], 'Answer');
                                      }} title="Share">
                                        <Share2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Entry Actions */}
                                <div className="history-footer-actions">
                                  <button className="action-btn pin" onClick={() => pinHistoryEntry(entry.id)}>
                                    {entry.pinned ? 'Unpin' : 'Pin Entry'}
                                  </button>
                                  <button className="action-btn replay" onClick={() => loadHistoryEntry(entry)}>
                                    <Wand2 size={14} /> Replay
                                  </button>
                                  <button className="action-btn delete" onClick={() => deleteHistoryEntry(entry.id)}>
                                    <X size={14} /> Delete
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-history">
                      <h3>No history found</h3>
                      <p>{historySearchTerm || historyFilterMode || historyFilterLanguage ? 'No matching entries found. Try different filters.' : 'Start asking questions to build your learning history!'}</p>
                    </div>
                  )}
                </div>
              )}
              {currentPage === 'about' && (
                <div className="about-page">
                  <div className="page-header-content">
                    <p>At MINIMIND, we believe in creating more than just a platform — we're building an experience.</p>
                  </div>

                  <div className="team-grid">
                    <div className="team-member">
                      <div className="member-icon">🧠</div>
                      <div className="member-info">
                        <h3>Yuvraj Singh Bundela</h3>
                        <h4>Backend Developer</h4>
                        <p>Yuvraj is the powerhouse behind our backend systems. From building robust APIs to implementing secure and scalable server logic, he ensures MINIMIND performs seamlessly under the hood, so users get speed, stability, and security.</p>
                      </div>
                    </div>

                    <div className="team-member">
                      <div className="member-icon">🛡️</div>
                      <div className="member-info">
                        <h3>Ushma Talreja</h3>
                        <h4>Quality Assurance Specialist</h4>
                        <p>Ushma ensures that MINIMIND runs like a well-oiled machine. With a sharp eye for detail, she rigorously tests every feature, hunts down bugs, and proactively recommends enhancements — all to deliver a flawless and enjoyable user experience.</p>
                      </div>
                    </div>

                    <div className="team-member">
                      <div className="member-icon">🔧</div>
                      <div className="member-info">
                        <h3>Ishita Bajpai</h3>
                        <h4>Product Development Associate</h4>
                        <p>Ishita brings flexibility and curiosity to the table, contributing across various stages of product development. Her multidisciplinary approach helps drive innovation as she explores her niche within the team.</p>
                      </div>
                    </div>

                    <div className="team-member">
                      <div className="member-icon">🎨</div>
                      <div className="member-info">
                        <h3>Priyansh Gautam</h3>
                        <h4>UI Designer</h4>
                        <p>Priyansh is the creative force shaping MINIMIND's visual identity. With a keen sense of design, he crafts intuitive, modern, and user-centric interfaces that make learning not just effective — but enjoyable.</p>
                      </div>
                    </div>
                  </div>
                </div>

              )}
              {currentPage === 'faq' && (
                <div className="faq-page">
                  <div className="page-header-content">
                    <p>Find answers to common questions about MINIMIND.</p>
                  </div>

                  <div className="faq-list">
                    {[
                      {
                        q: "How can I track my learning progress on MINIMIND?",
                        a: "Our platform includes a dedicated Progress Tracker that shows your completed modules, time spent on each topic, and areas for improvement. You can set personal learning goals and monitor your achievements."
                      },
                      {
                        q: "Is there a cost associated with using MINIMIND?",
                        a: "MINIMIND offers a free tier with access to essential features. Premium content and advanced functionalities will be available through a subscription model, but we ensure that core learning remains accessible to all users."
                      },
                      {
                        q: "How does MINIMIND handle user feedback?",
                        a: "We value user input and have a dedicated team to review all feedback. Suggestions for new features or content are prioritized based on user demand and feasibility."
                      },
                      {
                        q: "Can I delete my account and data?",
                        a: "Yes, you can delete your account at any time through your profile settings. All associated data will be permanently removed from our servers."
                      },
                      {
                        q: "What if I encounter a technical issue while using MINIMIND?",
                        a: "Our support team is available 24/7 to assist you with any technical difficulties. You can reach out via the in-app support feature or our website's contact form."
                      },
                      {
                        q: "How do the learning modes differ from one another?",
                        a: "Each learning mode is tailored to specific age groups and expertise levels:\nBeginner Mode: Simplified explanations and relatable examples\nTeen Mode: Engaging content with real-world applications\nCollege Mode: In-depth analysis and technical details\nMastery Mode: Advanced concepts and critical thinking challenges"
                      },
                      {
                        q: "Are there interactive elements in the learning modules?",
                        a: "Yes! Our learning capsules include quizzes, interactive exercises, and discussion prompts to reinforce understanding and encourage active participation."
                      },
                      {
                        q: "How does MINIMIND support different learning styles?",
                        a: "We incorporate various formats, including text, audio, and visual aids, to cater to diverse learning preferences. Users can choose their preferred mode of engagement for each topic."
                      },
                      {
                        q: "What new features have been added to enhance the user experience?",
                        a: "We've recently added several enhancements including improved dark mode support, enhanced language selection dropdowns, better text visibility in input fields, and updated team information. We've also improved the progress tracking system and added more interactive elements to make learning more engaging."
                      },
                      {
                        q: "How does the OneWord feature work?",
                        a: "The OneWord feature provides quick, concise answers in just one word or bullet-point summaries. Perfect for vocabulary, definitions, and fast facts. Simply enter your question in the OneWord section and get instant concise answers."
                      },
                      {
                        q: "Can I use MINIMIND in different languages?",
                        a: "Yes, MINIMIND supports multiple languages including English, Hindi, Spanish, French, German, and many more. You can easily switch between languages in the language settings. We also offer Roman script options for Indian languages for easier typing."
                      },
                      {
                        q: "How is my data protected on MINIMIND?",
                        a: "We take data privacy seriously. All your learning data is securely stored and encrypted. You have full control over your data and can delete your account and all associated data at any time. We never sell or share your personal information with third parties."
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className={`faq-item ${expandedFaqIndex === index ? 'active' : ''}`}
                        initial={false}
                        onClick={() => setExpandedFaqIndex(expandedFaqIndex === index ? null : index)}
                      >
                        <div className="faq-question">
                          <h3>{item.q}</h3>
                          <span className="faq-icon">
                            {expandedFaqIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </span>
                        </div>
                        <AnimatePresence>
                          {expandedFaqIndex === index && (
                            <motion.div
                              className="faq-answer"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <div className="answer-content">
                                <p style={{ whiteSpace: 'pre-line' }}>{item.a}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              {currentPage === 'progress' && (
                <div className="progress-page">
                  <div className="page-header-content">
                    <h2>Your Learning Progress</h2>
                    <p>Track your learning journey across different modes and topics.</p>
                  </div>

                  {/* Progress Stats */}
                  <div className="progress-stats">
                    <div className="stat-item">
                      <h3>Total Sessions</h3>
                      <p>{history.length}</p>
                    </div>
                    <div className="stat-item">
                      <h3>Questions Asked</h3>
                      <p>{history.length}</p>
                    </div>
                    <div className="stat-item">
                      <h3>Modes Used</h3>
                      <p>{Object.keys(modes).filter(mode => enabledModes[mode]).length}</p>
                    </div>
                  </div>

                  {/* Mode Distribution */}
                  <div className="mode-distribution">
                    <h3>Learning Mode Distribution</h3>
                    <div className="distribution-bars">
                      {Object.entries(modes).map(([modeKey, modeConfig]) => {
                        const modeCount = history.filter(entry => entry.answers[modeKey]).length;
                        const percentage = history.length > 0 ? (modeCount / history.length) * 100 : 0;

                        return (
                          <div key={modeKey} className={`distribution-bar ${modeKey}`}>
                            <div className="mode-icon-container">
                              <span className="mode-icon">{modeConfig.icon}</span>
                            </div>
                            <div className="bar-container">
                              <div
                                className="bar-fill"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="bar-label">
                              {modeConfig.name}: {modeCount} ({percentage.toFixed(1)}%)
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="recent-activity">
                    <h3>Recent Learning Activity</h3>
                    <div className="activity-list">
                      {history.slice(0, 5).map((entry, index) => (
                        <div key={entry.id} className="activity-item">
                          <div className="activity-question">
                            {entry.question.length > 60 ? entry.question.substring(0, 60) + '...' : entry.question}
                          </div>
                          <div className="activity-date">
                            {entry.date} at {entry.time}
                          </div>
                          <div className="activity-modes">
                            {Object.keys(entry.answers).map(mode => (
                              <span key={mode} className={`activity-mode ${mode}`}>
                                {modes[mode]?.icon}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {currentPage === 'language' && (
                <div className="language-page">
                  <div className="page-header-content">
                    <p>Choose your preferred language and script style for AI responses.</p>
                  </div>

                  {/* Casual Mode Toggle */}
                  <div className="casual-mode-section">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h3>Casual Mode (Roman Script)</h3>
                        <p>Get responses in Indian languages written with English alphabets (e.g., "Main accha hoon" instead of "मैं अच्छा हूं")</p>
                      </div>
                      <button
                        className={`toggle-btn ${casualMode ? 'active' : ''}`}
                        onClick={toggleCasualMode}
                        disabled={!languages[selectedLanguage]?.casual}
                      >
                        <div className="toggle-slider" />
                      </button>
                    </div>
                  </div>

                  {/* Language Grid */}
                  <div className="language-grid">
                    {Object.entries(languages).map(([code, lang]) => (
                      <motion.button
                        key={code}
                        className={`language-option ${selectedLanguage === code ? 'active' : ''}`}
                        onClick={() => setSelectedLanguage(code)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="flag">{lang.flag}</span>
                        <div className="language-names">
                          <span className="name">{lang.name}</span>
                          <span className="native-name">{lang.nativeName}</span>
                          {lang.casual && (
                            <span className="casual-indicator">
                              <Sparkles size={12} /> Roman Script Available
                            </span>
                          )}
                        </div>
                        {selectedLanguage === code && (
                          <motion.div
                            className="selection-indicator"
                            layoutId="language-selection"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Current Selection Info */}
                  <div className="current-selection">
                    <h3>Current Selection:</h3>
                    <div className="selection-display">
                      <span className="flag">{languages[selectedLanguage]?.flag}</span>
                      <span className="name">{languages[selectedLanguage]?.name}</span>
                      {casualMode && languages[selectedLanguage]?.casual && (
                        <span className="casual-badge">Roman Script Enabled</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {currentPage === 'settings' && (
                <div className="settings-page">
                  <div className="page-header-content">
                    <p>Customize your MiniMind experience with these personalization options.</p>
                  </div>

                  <div className="settings-grid">
                    {/* Theme Settings */}
                    <div className="setting-group">
                      <h3>Appearance</h3>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Theme</strong>
                          <span>Choose between light and dark modes</span>
                        </div>
                        <div className="theme-selector">
                          <button
                            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => theme !== 'light' && toggleTheme()}
                          >
                            <Sun size={16} /> Light
                          </button>
                          <button
                            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => theme !== 'dark' && toggleTheme()}
                          >
                            <Moon size={16} /> Dark
                          </button>
                        </div>
                      </div>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Font Size</strong>
                          <span>Adjust text size for better readability</span>
                        </div>
                        <select
                          value={settings.fontSize}
                          onChange={(e) => updateSettings({ fontSize: e.target.value })}
                          className="setting-select"
                        >
                          <option value="small">Small (14px)</option>
                          <option value="medium">Medium (16px)</option>
                          <option value="large">Large (18px)</option>
                        </select>
                      </div>
                    </div>

                    {/* Audio Settings */}
                    <div className="setting-group">
                      <h3>Audio & Voice</h3>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Sound Responses</strong>
                          <span>Enable text-to-speech for AI answers</span>
                        </div>
                        <button
                          className={`toggle-btn ${settings.soundEnabled ? 'active' : ''}`}
                          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                        >
                          <div className="toggle-slider" />
                        </button>
                      </div>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Voice Language</strong>
                          <span>Default language for voice synthesis</span>
                        </div>
                        <select
                          value={settings.voiceLanguage}
                          onChange={(e) => updateSettings({ voiceLanguage: e.target.value })}
                          className="setting-select"
                        >
                          {Object.entries(languages).map(([code, lang]) => (
                            <option key={code} value={code}>{lang.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Learning Preferences */}
                    <div className="setting-group">
                      <h3>Learning Preferences</h3>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Default Mode</strong>
                          <span>Your preferred starting learning mode</span>
                        </div>
                        <select
                          value={settings.defaultMode}
                          onChange={(e) => updateSettings({ defaultMode: e.target.value })}
                          className="setting-select"
                        >
                          {Object.entries(modes).map(([key, mode]) => (
                            <option key={key} value={key}>{mode.icon} {mode.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Emojis in Responses</strong>
                          <span>Show emojis and visual elements in answers</span>
                        </div>
                        <button
                          className={`toggle-btn ${settings.emojisEnabled ? 'active' : ''}`}
                          onClick={() => updateSettings({ emojisEnabled: !settings.emojisEnabled })}
                        >
                          <div className="toggle-slider" />
                        </button>
                      </div>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Auto-scroll</strong>
                          <span>Automatically scroll to new content</span>
                        </div>
                        <button
                          className={`toggle-btn ${settings.autoScroll ? 'active' : ''}`}
                          onClick={() => updateSettings({ autoScroll: !settings.autoScroll })}
                        >
                          <div className="toggle-slider" />
                        </button>
                      </div>
                    </div>

                    {/* Translation Settings */}
                    <div className="setting-group">
                      <h3>Translation & Script</h3>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Transliteration</strong>
                          <span>Enable real-time typing conversion to native scripts</span>
                        </div>
                        <button
                          className={`toggle-btn ${settings.transliterationEnabled ? 'active' : ''}`}
                          onClick={() => updateSettings({ transliterationEnabled: !settings.transliterationEnabled })}
                        >
                          <div className="toggle-slider" />
                        </button>
                      </div>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Script Preference</strong>
                          <span>Choose between native script or English script (Roman)</span>
                        </div>
                        <select
                          value={settings.scriptPreference}
                          onChange={(e) => updateSettings({ scriptPreference: e.target.value })}
                          className="setting-select"
                        >
                          <option value="native">Native Script</option>
                          <option value="english">English Script (Roman)</option>
                        </select>
                      </div>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Translation Mode</strong>
                          <span>Automatic or manual translation of responses</span>
                        </div>
                        <select
                          value={settings.autoTranslation}
                          onChange={(e) => updateSettings({ autoTranslation: e.target.value === 'true' })}
                          className="setting-select"
                        >
                          <option value="true">Automatic Translation</option>
                          <option value="false">Manual Translation</option>
                        </select>
                      </div>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Typing Translator</strong>
                          <span>GBoard-like real-time typing conversion (type in English, see in selected language)</span>
                        </div>
                        <button
                          className={`toggle-btn ${settings.typingTranslatorEnabled ? 'active' : ''}`}
                          onClick={() => updateSettings({ typingTranslatorEnabled: !settings.typingTranslatorEnabled })}
                        >
                          <div className="toggle-slider" />
                        </button>
                      </div>
                    </div>

                    {/* Data & Privacy */}
                    <div className="setting-group">
                      <h3>Data & Storage</h3>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Clear History</strong>
                          <span>Remove all saved questions and answers</span>
                        </div>
                        <button
                          className="danger-btn"
                          onClick={() => {
                            setHistory([]);
                            localStorage.removeItem('minimind-history');
                            addNotification('History cleared successfully!', 'success');
                          }}
                        >
                          Clear All History
                        </button>
                      </div>

                      <div className="setting-item">
                        <div className="setting-info">
                          <strong>Reset Settings</strong>
                          <span>Restore all settings to default values</span>
                        </div>
                        <button
                          className="danger-btn"
                          onClick={() => {
                            const defaultSettings = {
                              fontSize: 'medium',
                              soundEnabled: true,
                              defaultMode: 'beginner',
                              voiceLanguage: 'en',
                              emojisEnabled: true,
                              autoScroll: true,
                              // Translation settings
                              transliterationEnabled: true,
                              scriptPreference: 'native',
                              autoTranslation: true,
                              typingTranslatorEnabled: false, // GBoard-like real-time typing translator
                            };
                            updateSettings(defaultSettings);
                            addNotification('Settings reset to defaults!', 'success');
                          }}
                        >
                          Reset to Defaults
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div >
        )
        }
      </div >

      {/* Language Modal */}
      < AnimatePresence >
        {isLanguageModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLanguageModalOpen(false)}
          >
            <motion.div
              className="language-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Choose Language</h3>
                <button
                  className="close-btn"
                  onClick={() => setIsLanguageModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              {/* Language Search Bar */}
              <div className="language-search-container">
                <input
                  type="text"
                  placeholder="Search languages..."
                  className="language-search-input"
                  value={languageSearchTerm}
                  onChange={(e) => setLanguageSearchTerm(e.target.value)}
                />
              </div>
              <div className="language-grid">
                {Object.entries(languages)
                  .filter(([code, lang]) =>
                    lang.name.toLowerCase().includes(languageSearchTerm.toLowerCase()) ||
                    lang.nativeName.toLowerCase().includes(languageSearchTerm.toLowerCase())
                  )
                  .map(([code, lang]) => (
                    <button
                      key={code}
                      className={`language-option ${selectedLanguage === code ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedLanguage(code);
                        setIsLanguageModalOpen(false);
                        setLanguageSearchTerm(''); // Clear search when language is selected
                      }}
                    >
                      <span className="flag">{lang.flag}</span>
                      <div className="language-names">
                        <span className="name">{lang.name}</span>
                        <span className="native-name">{lang.nativeName}</span>
                      </div>
                    </button>
                  ))
                }
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence >

      {/* Translation Modal */}
      < AnimatePresence >
        {isTranslationModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTranslationModalOpen(false)}
          >
            <motion.div
              className="language-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Translate Text</h3>
                <button
                  className="close-btn"
                  onClick={() => setIsTranslationModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="translation-modal-content">
                <div className="translation-controls">
                  <div className="language-selector">
                    <label>From:</label>
                    <select
                      value={translationSourceLanguage}
                      onChange={(e) => setTranslationSourceLanguage(e.target.value)}
                      className="setting-select"
                    >
                      {Object.entries(languages).map(([code, lang]) => (
                        <option key={code} value={code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="language-selector">
                    <label>To:</label>
                    <select
                      value={translationTargetLanguage}
                      onChange={(e) => setTranslationTargetLanguage(e.target.value)}
                      className="setting-select"
                    >
                      {Object.entries(languages).map(([code, lang]) => (
                        <option key={code} value={code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="translate-btn-modal"
                    onClick={async () => {
                      const translated = await handleManualTranslation(translationText, translationTargetLanguage);
                      setTranslatedText(translated);
                    }}
                  >
                    <Globe size={16} />
                    Translate
                  </button>
                </div>

                <div className="translation-text-container">
                  <div className="translation-text">
                    <h4>Original Text:</h4>
                    <FormattedText text={translationText} className="text-content" />
                  </div>

                  <div className="translation-text">
                    <h4>Translated Text:</h4>
                    <div className="text-content translated">
                      {translatedText ? (
                        <FormattedText text={translatedText} />
                      ) : (
                        'Translation will appear here...'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence >

      {/* Notifications */}
      < div className="notifications" >
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`notification ${notification.type}`}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              onClick={() => removeNotification(notification.id)}
            >
              <p>{notification.message}</p>
              <button className="close-notification">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div >
    </div >
  );
}

export default App;