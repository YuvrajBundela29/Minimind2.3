# 🧠 MiniMind 2.3 - AI-Powered Learning Platform

An innovative educational platform that explains complex concepts in multiple learning styles using advanced AI technology. Experience personalized learning with ultra-realistic voice synthesis, professional UI design, and comprehensive multilingual support.

## ✨ Key Features

### 🎓 **Learning Modes**
- **4 Distinct Learning Styles**: 
  - 🌱 **Beginner**: Simple, easy-to-understand explanations
  - 🧠 **Thinker**: Analytical and detailed responses
  - 📖 **Story**: Narrative-based learning with examples
  - 🎓 **Mastery**: Advanced, comprehensive explanations
  
Each mode now supports rich text *themes* inside answers using markdown-style markers:

- `**bold**` → Gradient bold highlight for key terms
- `*tilt*` → Tilted/italic emphasis
- `__highlight__` → Bold with soft pill background for tags/labels
- `^^large^^` → Slightly larger sub-headings inside answers

### 🌐 **Multilingual Support**
- **25+ Languages**: English, Hindi, Urdu, Tamil, Malayalam, Bengali, Punjabi, Gujarati, Kannada, Telugu, Odia, Assamese, Nepali, Marathi, Sanskrit, Sindhi, Kashmiri, Dogri, Manipuri, Santali, Maithili, Konkani, Bhojpuri, Bodo, Rajasthani, and Hinglish
- **Dynamic Language Switching**: Seamless transition between languages
- **Localized Content**: AI responses adapted to cultural context

### 🔊 **Advanced Voice Features**
- **Ultra-Realistic Text-to-Speech**: Natural-sounding voices using Web Speech API
- **Complete Playback Controls**: Play, pause, resume, and stop functionality
- **Filtered Audio**: Clean voice output with automatic removal of markdown, hashtags, and special characters
- **Continuous Playback**: Resume from exact paused position

### 🎨 **Professional UI/UX**
- **Dual Theme Support**: Seamless dark/light mode switching with proper color adaptation
- **Ultra-Compact Design**: 35px header height for maximum content space
- **Glass Morphism Effects**: Premium visual design with blur effects and gradients
- **Smooth Animations**: Professional micro-interactions and transitions
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Mobile-First Redesign (2.3)**:
  - Hamburger navigation with slide-in drawer on mobile
  - Accordion-style layout for the 4 learning modes on small screens
  - Touch-friendly controls and no horizontal scrolling on iPhone sizes

### ⚡ **Ekakshar – One-Word & Bullet Answers (2.3)**
- **Ekakshar Mode** for:
  - One-word answers
  - Short bullet summaries (3–5 points)
  - Quick definitions and vocab
- Gradient + glassmorphism answer card with copy, download, share, and "Expand Answer" actions.

## 👥 Meet Our Team

Learn about the talented individuals who built MiniMind: [Team Overview](TEAM.md)

## 🚀 Live Demo

MiniMind 2.3 is designed to be deployed on **Netlify** using Vite’s production build.

- After you connect this repo to Netlify, your live URL will look like: `https://<your-site-name>.netlify.app`
- Update this section with your actual Netlify URL once deployed.

## 🛠️ Technology Stack

### **Frontend Technologies**
- **React 18**: Modern component-based architecture
- **Vite**: Lightning-fast build tool and development server
- **CSS3**: Advanced styling with custom properties and animations
- **Framer Motion**: Smooth animations and micro-interactions
- **Lucide React**: Beautiful, consistent iconography

### **AI & Voice Integration**
- **OpenRouter API**: Advanced AI model integration for intelligent responses
- **Web Speech API**: Natural text-to-speech synthesis
- **Custom AI Service**: Optimized API handling with 2000 token limit
- **Netlify Function (minimind-llm)**: Optional serverless endpoint for unified AI access

### **Deployment & Performance**
- **Netlify**: Optimized for Vite builds and serverless functions
- **GitHub Actions (optional)**: Existing workflows for CI and alternative deployment
- **Progressive Enhancement**: Works across all modern browsers

## 📖 Documentation

- [User Manual](USER_MANUAL.md) - Complete guide to using MiniMind
- [Contributing Guide](CONTRIBUTING.md) - How to contribute to the project
- [Changelog](CHANGELOG.md) - Version history and release notes
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines
- [Security Policy](SECURITY.md) - Security practices and reporting
- [Team Overview](TEAM.md) - Meet the minds behind MiniMind

## 🧪 Development Setup

### **Prerequisites**
- **Node.js 18+**: Latest LTS version recommended
- **npm or yarn**: Package manager
- **OpenRouter API Key**: Get yours from [OpenRouter.ai](https://openrouter.ai/)
- **Git**: Version control system

### **Quick Start**

```bash
# Clone the repository
git clone https://github.com/YuvrajBundela29/Minimind2.3.git
cd Minimind2.3

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and add your API key

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### **Build Commands**

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Netlify (recommended)
# 1. Connect this repo (Minimind2.3) in the Netlify dashboard
# 2. Set build command: npm run build
# 3. Set publish directory: dist
## OR use the Netlify CLI from the project root:
## npm install -g netlify-cli
## netlify init
## netlify deploy --build --prod
```

## 📁 Project Structure

```
minimind/
│
├── src/
│   ├── services/
│   │   └── aiService.js      # AI API integration
│   ├── App.jsx               # Main application component
│   ├── App.css               # Global styles and themes
│   └── main.jsx              # Application entry point
│
├── .github/
│   ├── workflows/
│   │   └── deploy.yml        # GitHub Actions deployment
│   └── ISSUE_TEMPLATE/       # Issue templates
│
├── public/
│   └── assets/               # Static assets and images
│
├── package.json              # Project dependencies
├── vite.config.js            # Vite configuration
├── .env.example              # Environment template
├── README.md                 # Project documentation
├── USER_MANUAL.md            # User guide
├── CONTRIBUTING.md           # Contribution guidelines
├── CHANGELOG.md              # Version history
├── LICENSE                   # License information
└── CODE_OF_CONDUCT.md        # Community guidelines
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

### **Ways to Contribute**
- 🐛 **Bug Reports**: Report issues via GitHub Issues
- ✨ **Feature Requests**: Suggest new features or improvements
- 📝 **Documentation**: Improve README or add code comments
- 🌍 **Translations**: Add support for more languages
- 🎨 **UI/UX**: Enhance design and user experience
- 💻 **Code**: Submit pull requests with improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/YuvrajBundela29/Minimind2.3/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YuvrajBundela29/Minimind2.3/discussions)
- **Maintainer**: [YuvrajBundela29](https://github.com/YuvrajBundela29)

---

**Built with ❤️ using React and AI technology**