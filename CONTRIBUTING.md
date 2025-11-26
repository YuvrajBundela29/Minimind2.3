# Contributing to MiniMind

Thank you for your interest in contributing to MiniMind! We welcome contributions from the community to help improve our AI-powered educational platform.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Coding Standards](#coding-standards)
6. [Pull Request Process](#pull-request-process)
7. [Reporting Issues](#reporting-issues)
8. [Feature Requests](#feature-requests)
9. [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How to Contribute

There are many ways you can contribute to MiniMind:

### Ways to Contribute
- 🐛 **Bug Reports**: Report issues via GitHub Issues
- ✨ **Feature Requests**: Suggest new features or improvements
- 📝 **Documentation**: Improve README, user manual, or add code comments
- 🌍 **Translations**: Add support for more languages
- 🎨 **UI/UX**: Enhance design and user experience
- 💻 **Code**: Submit pull requests with improvements
- 🧪 **Testing**: Help test new features and report issues
- 📢 **Community**: Help other users and spread the word

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenRouter API key (get yours from [OpenRouter.ai](https://openrouter.ai/))

### Quick Start
```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Minimind2.1.git
cd Minimind2.1

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and add your API key

# Start development server
npm run dev
```

### Project Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

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
│   └── workflows/
│       └── deploy.yml        # GitHub Actions deployment
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
└── LICENSE                   # License information
```

## Coding Standards

### JavaScript/React
- Follow modern ES6+ syntax
- Use functional components with hooks
- Prefer arrow functions
- Use meaningful variable and function names
- Comment complex logic
- Keep functions small and focused

### CSS
- Use CSS variables for consistent theming
- Follow BEM naming convention for classes
- Use rem units for scalable layouts
- Maintain responsive design principles

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters or less
- Reference issues and pull requests liberally

### Example Commit Messages
```
feat: add support for Rajasthani language
fix: resolve voice synthesis issues in Firefox
docs: update user manual with new features
style: improve glass morphism effects
test: add unit tests for AI service
```

## Pull Request Process

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Ensure your code follows our coding standards
5. Add tests if applicable
6. Update documentation as needed
7. Commit your changes with clear commit messages
8. Push to your fork
9. Create a pull request to the main repository

### Pull Request Guidelines
- Keep PRs small and focused on a single issue
- Include a clear description of the changes
- Reference any related issues
- Ensure all tests pass
- Be responsive to feedback during review

### Code Review Process
- All submissions require review before merging
- Reviews focus on code quality, functionality, and maintainability
- Constructive feedback is provided to help improve the code
- Changes may be requested before merging

## Reporting Issues

### Before Submitting an Issue
1. Check existing issues to avoid duplicates
2. Ensure you're using the latest version
3. Check the documentation for known solutions

### How to Submit a Good Bug Report
- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the issue
- Include screenshots if relevant
- Note your environment details (browser, OS, etc.)
- Explain the expected vs actual behavior

### Issue Templates
When creating an issue, please use the appropriate template:
- Bug Report
- Feature Request
- Documentation Issue

## Feature Requests

We welcome feature requests! When submitting a feature request:

1. Check if the feature has already been requested
2. Provide a clear description of the feature
3. Explain why this feature would be valuable
4. Include any relevant examples or mockups
5. Consider implementation complexity

## Community

### Communication Channels
- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and community discussion
- **Social Media**: Follow us for updates and announcements

### Recognition
Contributors are recognized in:
- Repository contributors list
- Release notes
- Documentation acknowledgments

### Getting Help
If you need help with your contribution:
1. Check the documentation
2. Ask in GitHub Discussions
3. Reach out to maintainers directly

## License

By contributing to MiniMind, you agree that your contributions will be licensed under the MIT License.

## Meet the Team

MiniMind was originally created by a dedicated team of professionals. [Learn more about our team](TEAM.md).