// Environment variables for AI services
// In a real app, these would be set in .env.local or through Vercel environment variables

export const AI_CONFIG = {
  // Check if OpenAI API key is available
  hasOpenAIKey: typeof process !== "undefined" && process.env && !!process.env.OPENAI_API_KEY,

  // Default model to use when OpenAI API key is not available
  defaultModel: "gpt-3.5-turbo",

  // Interview configuration
  interview: {
    defaultDuration: 20, // minutes
    silenceThreshold: 3, // seconds
    maxQuestions: 10,
  },

  // Speech-to-text configuration
  speechToText: {
    language: "en-US",
    continuous: true,
    interimResults: true,
  },

  // Simulation mode settings
  simulation: {
    // Whether to force simulation mode regardless of API key availability
    forceSimulation: false,
    // Delay between simulated responses (ms)
    responseDelay: 2000,
  },
}
