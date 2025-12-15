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
  Share2
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
  const [showModeCards, setShowModeCards] = useState(true);
  const contentRef = useRef(null);
  const inputRef = useRef(null);

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

  // Render mode cards
  const renderModeCards = () => (
    <div className="mode-cards-container">
      {Object.entries(modes).map(([id, mode]) => (
        <motion.div
          key={id}
          className={`mode-card ${currentMode === id ? 'active' : ''}`}
          onClick={() => handleModeSelect(id)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mode-card-header">
            <div 
              className="mode-card-icon" 
              style={{ 
                background: mode.color || 'var(--bg-tertiary)',
                color: mode.textColor || 'var(--text-primary)'
              }}
            >
              {mode.icon || '✨'}
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="mode-card-title">{mode.name}</h3>
            </div>
            <span 
              className="mode-tag"
              style={{
                background: mode.color ? `${mode.color}20` : 'var(--bg-tertiary)',
                color: mode.color || 'var(--text-secondary)'
              }}
            >
              {mode.type?.toUpperCase() || 'MODE'}
            </span>
          </div>
          <p className="mode-card-description">
            {mode.description || 'Ask me anything in this mode'}
          </p>
          <div className="mode-card-actions">
            <button 
              className="mobile-btn secondary"
              onClick={(e) => {
                e.stopPropagation();
                onSpeak(mode.example || 'Ask me anything in this mode', currentMode);
              }}
            >
              <Volume2 size={16} />
            </button>
            <button 
              className="mobile-btn secondary"
              onClick={(e) => {
                e.stopPropagation();
                setQuestion(mode.example || '');
                inputRef.current?.focus();
              }}
            >
              <Sparkles size={16} />
              <span>Example</span>
            </button>
          </div>
        </motion.div>
      ))}
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
    <div className="mobile-container" data-theme={theme}>
      {/* Header */}
      <header className="mobile-header">
        {!showModeCards ? (
          <button className="mobile-header-btn" onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>
        ) : (
          <button className="mobile-header-btn" onClick={toggleMenu}>
            <Menu size={24} />
          </button>
        )}
        
        <h1 className="mobile-header-title">
          {showModeCards ? 'MiniMind' : modes[currentMode]?.name || 'Chat'}
        </h1>
        
        <div className="mobile-header-actions">
          <button 
            className="mobile-header-btn" 
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          {!showModeCards && (
            <button 
              className="mobile-header-btn"
              onClick={() => onSpeak(answers[currentMode] || '', currentMode)}
              disabled={!answers[currentMode]}
            >
              <Volume2 size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mobile-content">
        <AnimatePresence mode="wait">
          {showModeCards ? renderModeCards() : renderChat()}
        </AnimatePresence>
      </main>

      {/* Input Area */}
      <div className="mobile-input-container">
        <button 
          className="mobile-input-btn secondary"
          onClick={() => onSpeak('', currentMode)}
        >
          <Mic size={20} />
        </button>
        
        <input
          ref={inputRef}
          type="text"
          className="mobile-input"
          placeholder={`Ask ${modes[currentMode]?.name || 'MiniMind'}...`}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        
        <button 
          className="mobile-input-btn"
          onClick={handleSend}
          disabled={!question.trim()}
          style={{ opacity: question.trim() ? 1 : 0.5 }}
        >
          <Send size={20} />
        </button>
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
