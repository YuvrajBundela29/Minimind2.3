import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Menu, 
  X,
  Sun,
  Moon,
  Mic,
  User,
  Settings,
  ArrowLeft,
  Volume2,
  Sparkles,
  Brain,
  History,
  Languages,
  Download,
  Share2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './mobile.css';

const MobileApp = ({ 
  modes, 
  currentMode, 
  onModeChange, 
  onSendMessage, 
  question, 
  setQuestion, 
  answers, 
  theme, 
  toggleTheme,
  selectedLanguage,
  setSelectedLanguage,
  isSpeaking,
  isPaused,
  onSpeak,
  onPause,
  onResume,
  onStop,
  onDownload,
  onShare,
  onShowHistory,
  onShowSettings,
  onShowLanguages
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [expandedModes, setExpandedModes] = useState({});
  const contentRef = useRef(null);
  const inputRef = useRef(null);
  const [selectedMode, setSelectedMode] = useState(currentMode);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [answers, currentMode]);

  // Handle send message
  const handleSend = () => {
    if (question.trim()) {
      onSendMessage(question, currentMode);
      setQuestion('');
      setShowModeCards(false);
      // Focus input after sending
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Handle mode selection
  const handleModeSelect = (modeId) => {
    onModeChange(modeId);
    setShowModeCards(false);
    inputRef.current?.focus();
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle back button
  const handleBack = () => {
    if (!showModeCards) {
      setShowModeCards(true);
    }
  };

  // Toggle mode expansion
  const toggleModeExpansion = (modeId) => {
    setExpandedModes(prev => ({
      ...prev,
      [modeId]: !prev[modeId]
    }));
  };

  // Render mode cards with expandable content
  const renderModeCards = () => (
    <div className="mode-cards-container">
      {Object.entries(modes).map(([id, mode]) => {
        const isExpanded = expandedModes[id] || false;
        const hasAnswer = answers[id] && answers[id].trim() !== '';
        
        return (
          <motion.div
            key={id}
            className={`mode-card ${currentMode === id ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mode-card-content">
              <div 
                className="mode-card-header"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModeExpansion(id);
                }}
              >
                <div className="mode-icon">
                  {mode.icon || <Sparkles size={20} />}
                </div>
                <h3 className="mode-title">{mode.name}</h3>
                <div className="mode-badge">{mode.badge}</div>
                <button 
                  className={`expand-button ${isExpanded ? 'expanded' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleModeExpansion(id);
                  }}
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              
              <div className={`mode-card-body ${isExpanded ? 'expanded' : ''}`}>
                <p className="mode-description">{mode.description}</p>
                
                {hasAnswer && (
                  <div className="mode-answer">
                    <div className="answer-content" dangerouslySetInnerHTML={{ __html: answers[id] }} />
                  </div>
                )}
                
                {currentMode === id && isSpeaking && (
                  <div className="speech-controls">
                    {isPaused ? (
                      <button onClick={onResume} className="control-button">
                        <Volume2 size={16} /> Resume
                      </button>
                    ) : (
                      <button onClick={onPause} className="control-button">
                        <Volume2 size={16} /> Pause
                      </button>
                    )}
                    <button onClick={onStop} className="control-button">
                      <X size={16} /> Stop
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  // Render chat interface
  const renderChat = () => (
    <div className="chat-container">
      <div className="chat-messages" ref={contentRef}>
        {question && (
          <div className="message user">
            <div className="message-content">{question}</div>
          </div>
        )}
        
        {answers[currentMode] && (
          <div className="message ai">
            <div className="message-content">
              {answers[currentMode]}
            </div>
            <div className="message-actions">
              <button 
                className="action-btn"
                onClick={() => onSpeak(answers[currentMode], currentMode)}
              >
                <Volume2 size={16} />
              </button>
              <button 
                className="action-btn"
                onClick={() => onDownload(answers[currentMode], currentMode)}
              >
                <Download size={16} />
              </button>
              <button 
                className="action-btn"
                onClick={() => onShare(answers[currentMode], currentMode)}
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mobile-app">
      {/* Header */}
      <header className="mobile-header">
        <button 
          className="menu-button" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="app-title">MiniMind</h1>
        <div className="header-actions">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mobile-content" ref={contentRef}>
        <div className="mode-selection">
          {renderModeCards()}
        </div>
      </main>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Ask me anything..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            aria-label="Type your question"
          />
          {question ? (
            <button 
              className="send-button"
              onClick={handleSend}
              disabled={!question.trim()}
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          ) : (
            <button 
              className="mic-button"
              onClick={() => {}}
              aria-label="Use voice input"
            >
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          >
            <motion.div 
              className="mobile-menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-menu-header">
                <h3>Menu</h3>
                <button className="mobile-menu-close" onClick={toggleMenu}>
                  <X size={24} />
                </button>
              </div>
              
              <nav className="mobile-nav">
                <button 
                  className="mobile-nav-item"
                  onClick={() => {
                    onShowHistory();
                    toggleMenu();
                  }}
                >
                  <History size={20} />
                  <span>History</span>
                </button>
                
                <button 
                  className="mobile-nav-item"
                  onClick={() => {
                    onShowSettings();
                    toggleMenu();
                  }}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
                
                <button 
                  className="mobile-nav-item"
                  onClick={() => {
                    onShowLanguages();
                    toggleMenu();
                  }}
                >
                  <Languages size={20} />
                  <span>Languages</span>
                </button>
                
                <div className="mobile-nav-divider"></div>
                
                <div className="mobile-nav-footer">
                  <p>MiniMind v2.3</p>
                  <p>© {new Date().getFullYear()} MiniMind AI</p>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileApp;
