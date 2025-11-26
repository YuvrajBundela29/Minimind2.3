# MiniMind - Netlify Deployment Guide

This guide will walk you through deploying MiniMind on Netlify with secure serverless functions.

## Architecture Summary

- **Frontend**: React (Vite)
- **Backend**: Netlify Functions (Serverless)
- **AI Provider**: OpenRouter (via Netlify Functions)
- **Deployment**: Netlify

## Files Created or Modified

1. `netlify/functions/minimind-llm/`
   - `minimind-llm.js`: Serverless function that handles AI API calls securely
   - `package.json`: Dependencies for the Netlify Function

2. `netlify.toml`
   - Configuration for Netlify build and deployment
   - Function routing and CORS settings

3. `src/services/netlifyAIService.js`
   - New client-side service that communicates with Netlify Functions
   - Replaces direct API calls to OpenRouter

4. `src/App.jsx`
   - Updated to use the new NetlifyAIService

## Environment Variables Required

You need to set the following environment variables in your Netlify site settings:

1. `OPENROUTER_API_KEY` - Your OpenRouter API key

## How to Deploy to Netlify

### Prerequisites

1. A Netlify account (free tier is sufficient)
2. An OpenRouter API key (get it from [OpenRouter](https://openrouter.ai/))
3. A GitHub/GitLab/Bitbucket account with your MiniMind repository

### Deployment Steps

1. **Connect your repository to Netlify**
   - Log in to your Netlify account
   - Click "Add new site" > "Import an existing project"
   - Connect to your Git provider and select the MiniMind repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables:
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - Click "Deploy site"

3. **Verify deployment**
   - Once deployed, visit your site URL
   - Test the application to ensure AI functionality is working

## Local Development

To run the application locally with Netlify Functions:

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Install project dependencies:
   ```bash
   npm install
   cd netlify/functions/minimind-llm && npm install && cd ../../..
   ```

3. Create a `.env` file in the root directory with:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. Start the development server:
   ```bash
   netlify dev
   ```

5. Open your browser to `http://localhost:8888`

## Security Considerations

- **API Keys**: All API keys are now stored securely in Netlify's environment variables and are never exposed to the client.
- **Rate Limiting**: Consider implementing rate limiting in your Netlify Function to prevent abuse.
- **CORS**: CORS is configured to only allow requests from your domain.

## Troubleshooting

- **Function not found**: Ensure the function name in `netlify.toml` matches the directory name in `netlify/functions/`
- **API errors**: Check the Netlify Function logs in the Netlify dashboard for detailed error messages
- **Build failures**: Verify all dependencies are correctly installed and environment variables are set

## Next Steps

1. **Set up a custom domain** in the Netlify dashboard
2. **Enable form submissions** if your app includes any forms
3. **Set up continuous deployment** from your Git repository
4. **Monitor usage** in the Netlify dashboard to stay within free tier limits

## Support

For issues with deployment, please check the [Netlify documentation](https://docs.netlify.com/) or open an issue in the repository.
