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
  ChevronRight
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
  const contentRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      const height = contentRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      contentRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [answers]);

  // Handle send message
  const handleSend = () => {
    if (question.trim()) {
      onSendMessage(question, currentMode);
      setQuestion('');
      // Keep focus on input after sending
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Handle mode selection
  const handleModeSelect = (modeId) => {
    onModeChange(modeId);
    inputRef.current?.focus();
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          style={{
            borderLeft: currentMode === id ? '4px solid var(--primary-color)' : '1px solid var(--border-color)'
          }}
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

  // Render all mode responses
  const renderModeResponses = () => {
    return Object.entries(modes).map(([modeId, mode]) => {
      const answer = answers[modeId];
      if (!answer) return null;
      
      return (
        <motion.div 
          key={modeId}
          className={`mode-response ${currentMode === modeId ? 'active' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mode-header" onClick={() => handleModeSelect(modeId)}>
            <div className="mode-icon">{mode.icon}</div>
            <div className="mode-name">{mode.name}</div>
            <ChevronRight size={20} className="chevron" />
          </div>
          <div 
            className="mode-answer"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
          <div className="message-actions">
            <button 
              className="action-btn" 
              onClick={() => onSpeak(answer, modeId)}
              aria-label="Listen to response"
            >
              <Volume2 size={16} />
            </button>
            <button 
              className="action-btn" 
              onClick={() => onShare(answer)}
              aria-label="Share response"
            >
              <Share2 size={16} />
            </button>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <div className="mobile-app" data-theme={theme}>
      {/* Header */}
      <header className="mobile-header">
        <button 
          className="menu-button" 
          onClick={toggleMenu}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="app-title">MiniMind</h1>
      </header>

      {/* Main Content */}
      <main className="mobile-content" ref={contentRef}>
        {/* Always show mode cards */}
        <div className="mode-selection">
          {renderModeCards()}
        </div>
        
        {/* Show all mode responses */}
        <div className="mode-responses">
          {renderModeResponses()}
        </div>
      </main>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <button 
            className="mic-button"
            onClick={() => {}}
            aria-label="Voice input"
          >
            <Mic size={20} />
          </button>
          <input
            ref={inputRef}
            type="text"
            className="input-field"
            placeholder={`Ask me anything in ${modes[currentMode]?.name || 'Beginner'} mode...`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            aria-label="Type your question"
          />
        </div>
        <button 
          className={`send-button ${!question.trim() ? 'disabled' : ''}`}
          onClick={handleSend}
          disabled={!question.trim()}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />
            <motion.div 
              className="mobile-menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="menu-content">
                <div className="menu-header">
                  <h2 className="menu-title">Menu</h2>
                  <button 
                    className="menu-close" 
                    onClick={toggleMenu}
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="menu-section">
                  <button 
                    className="menu-item" 
                    onClick={() => {
                      onShowHistory();
                      toggleMenu();
                    }}
                  >
                    <div className="menu-icon"><History size={20} /></div>
                    <span className="menu-item-text">History</span>
                  </button>
                  <button 
                    className="menu-item" 
                    onClick={() => {
                      onShowLanguages();
                      toggleMenu();
                    }}
                  >
                    <div className="menu-icon"><Languages size={20} /></div>
                    <span className="menu-item-text">Languages</span>
                  </button>
                  <button 
                    className="menu-item" 
                    onClick={() => {
                      onShowSettings();
                      toggleMenu();
                    }}
                  >
                    <div className="menu-icon"><Settings size={20} /></div>
                    <span className="menu-item-text">Settings</span>
                  </button>
                  <button 
                    className="menu-item" 
                    onClick={() => {
                      toggleTheme();
                      toggleMenu();
                    }}
                  >
                    <div className="menu-icon">
                      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </div>
                    <span className="menu-item-text">
                      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="mobile-nav-divider"></div>
              
              <div className="mobile-nav-footer">
                <p>MiniMind v2.3</p>
                <p>© {new Date().getFullYear()} MiniMind AI</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileApp;
