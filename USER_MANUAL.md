# MiniMind User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Installation Guide](#installation-guide)
4. [Getting Started](#getting-started)
5. [Features Overview](#features-overview)
6. [Using Learning Modes](#using-learning-modes)
7. [Language Support](#language-support)
8. [Voice Features](#voice-features)
9. [Customization Options](#customization-options)
10. [Troubleshooting](#troubleshooting)
11. [FAQ](#faq)
12. [Support](#support)

## Introduction

MiniMind is an innovative AI-powered educational platform designed to explain complex concepts through multiple learning styles. With support for 25+ languages and four distinct learning modes, MiniMind adapts to your preferred way of learning, making education accessible and engaging for everyone.

Developed by a talented team of professionals, MiniMind combines expertise in AI, UI/UX design, and education to create an exceptional learning experience. [Learn more about our team](TEAM.md).

## System Requirements

### Minimum Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- JavaScript enabled
- Web Speech API support (for voice features)

### Recommended Requirements
- Latest version of Chrome, Firefox, or Edge
- High-speed internet connection
- Speakers or headphones (for voice features)

## Installation Guide

### Prerequisites
1. Node.js 18+ installed on your system
2. npm or yarn package manager
3. OpenRouter API key (get yours from [OpenRouter.ai](https://openrouter.ai/))

### Quick Installation
```bash
# Clone the repository
git clone https://github.com/Yuvibundela/Minimind2.1.git
cd Minimind2.1

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and add your API key

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Getting Started

1. After installation, open your browser and navigate to `http://localhost:5173`
2. You'll see the MiniMind interface with:
   - A chat input area
   - Learning mode selector
   - Language selector
   - Theme toggle (light/dark mode)
3. Enter your question in the input field
4. Select your preferred learning mode
5. Choose your preferred language
6. Click the send button to get your AI-powered explanation

## Features Overview

### Learning Modes
MiniMind offers four distinct learning modes:
- **Beginner**: Simple, easy-to-understand explanations for children and beginners
- **Thinker**: Analytical and detailed responses for teenagers and college students
- **Story**: Narrative-based learning with examples through storytelling
- **Mastery**: Advanced, comprehensive explanations for expert-level understanding

### Multilingual Support
Support for 25+ languages including:
- English, Hindi, Urdu, Tamil, Malayalam, Bengali, Punjabi, Gujarati, Kannada, Telugu
- Odia, Assamese, Nepali, Marathi, Sanskrit, Sindhi, Kashmiri, Dogri, Manipuri
- Santali, Maithili, Konkani, Bhojpuri, Bodo, Rajasthani, Hinglish
- Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Russian, Arabic

### Voice Features
- Ultra-realistic text-to-speech using Web Speech API
- Complete playback controls (play, pause, resume, stop)
- Clean voice output with automatic removal of markdown and special characters
- Continuous playback from exact paused position

### Professional UI/UX
- Dual theme support (seamless dark/light mode switching)
- Ultra-compact design with 35px header height
- Glass morphism effects for premium visual design
- Smooth animations and professional micro-interactions
- Responsive layout optimized for all devices

## Using Learning Modes

### Beginner Mode (🌱)
Perfect for:
- Children ages 5-10
- Beginners learning new concepts
- Anyone who prefers simple explanations

Features:
- Uses simple analogies and everyday examples
- Cheerful and encouraging tone with emojis
- Short sentences and fun approach
- Warm, encouraging questions at the end

### Thinker Mode (🧠)
Perfect for:
- Teenagers and college students
- Those who like analytical breakdowns
- People who enjoy pop culture references

Features:
- Pop culture references and real-world applications
- Casual but structured explanations
- Relatable and engaging content
- Some humor and sarcasm when appropriate

### Story Mode (📖)
Perfect for:
- Visual learners
- People who enjoy narratives
- Those who learn better through stories

Features:
- Short, fun stories that naturally explain concepts
- Everyday objects, animals, or people as characters
- Bedtime story feel - warm, simple, and easy to understand
- Sweet, simple stories that teach ideas

### Mastery Mode (🎓)
Perfect for:
- Academic researchers
- Professionals seeking comprehensive knowledge
- Anyone wanting expert-level explanations

Features:
- Comprehensive, research-level explanations
- Abstract overview followed by theory and models
- Technical terminology used appropriately
- Real-world applications in major companies and research
- Thought-provoking Socratic questions

## Language Support

### Switching Languages
1. Click the language selector in the header
2. Choose from the dropdown list of 25+ languages
3. Your preference will be saved for future sessions

### Roman Script Support
Many Indian languages support both native script and Roman script:
- Hindi (हिंदी) and Hindi (Roman)
- Urdu (اردو) and Urdu (Roman)
- Tamil (தமிழ்) and Tamil (Roman)
- And 20+ other languages with Roman script options

### Language Features
- Cultural context adaptation for regional understanding
- Dynamic switching mid-conversation
- Text-to-speech support in multiple languages
- Localized examples and references

## Voice Features

### Using Voice Synthesis
1. After receiving an AI response, click the speaker icon
2. The text will be read aloud using natural-sounding voices
3. Use playback controls to pause, resume, or stop

### Voice Controls
- **Play**: Start text-to-speech synthesis
- **Pause**: Temporarily stop playback
- **Resume**: Continue from the paused position
- **Stop**: End playback completely

### Voice Customization
Voice features automatically adapt to:
- Selected language
- Content complexity
- User preferences

## Customization Options

### Theme Switching
- Toggle between light and dark modes using the sun/moon icon
- Theme preference is saved automatically
- All UI elements adapt to the selected theme

### Interface Customization
- Ultra-compact header design (35px) for maximum content space
- Responsive layout that adapts to any screen size
- Professional glass morphism effects

### Learning Preferences
- Save preferred learning mode
- Remember language selection
- Maintain chat history

## Troubleshooting

### Common Issues and Solutions

#### AI Responses Not Loading
- Verify your OpenRouter API key is correctly set in `.env.local`
- Check browser console for any API errors
- Ensure you have sufficient API credits
- Check your internet connection

#### Voice Synthesis Not Working
- Enable Web Speech API in your browser settings
- Check if your browser supports the Speech Synthesis API
- Try refreshing the page and allow microphone permissions
- Ensure speakers or headphones are connected and unmuted

#### Theme Switching Issues
- Clear browser cache and cookies
- Ensure JavaScript is enabled
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

#### Language Translation Problems
- Check if the selected language is supported
- Verify internet connection for translation services
- Try switching to a different language and back

### Performance Tips
- Use latest Chrome, Firefox, or Edge for best performance
- Enable hardware acceleration in browser settings
- Close unnecessary browser tabs to free memory
- Ensure stable internet connection

## FAQ

### What is MiniMind?
MiniMind is an AI-powered educational platform that explains complex concepts through multiple learning styles and languages.

### How many languages does MiniMind support?
MiniMind supports 25+ languages including English, Hindi, Urdu, Tamil, Malayalam, Bengali, Punjabi, Gujarati, Kannada, Telugu, Odia, Assamese, Nepali, Marathi, Sanskrit, Sindhi, Kashmiri, Dogri, Manipuri, Santali, Maithili, Konkani, Bhojpuri, Bodo, Rajasthani, Hinglish, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Russian, and Arabic.

### Is there a mobile app?
Currently, MiniMind is a web-based application optimized for mobile browsers. Native mobile apps are planned for future development.

### How much does MiniMind cost?
MiniMind is free to use. You only need an OpenRouter API key, which offers free credits to get started.

### Can I use MiniMind offline?
MiniMind requires an internet connection for AI processing and voice synthesis. Offline mode is planned for future development.

### How do I get an API key?
Visit [OpenRouter.ai](https://openrouter.ai/) to sign up and get your API key.

## Support

### Getting Help
- **Bug Reports**: Report issues via [GitHub Issues](https://github.com/Yuvibundela/Minimind2.1/issues)
- **Questions**: Ask questions via [GitHub Discussions](https://github.com/Yuvibundela/Minimind2.1/discussions)
- **Feature Requests**: Submit requests via [GitHub Issues](https://github.com/Yuvibundela/Minimind2.1/issues)

### Community
Join our community to connect with other MiniMind users, share tips, and get help.

### Contributing
We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details on how to contribute to MiniMind.

---

**Built with ❤️ using React and AI technology**