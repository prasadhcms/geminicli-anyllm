# Gemini CLI with Multi-LLM Support

This fork of the Gemini CLI adds support for multiple LLM providers that use OpenAI-compatible REST APIs. You can now switch between different LLM providers without modifying any code, using only environment variables or configuration.

## Supported Providers

The CLI supports any OpenAI-compatible API, including:

- OpenAI
- OpenRouter
- Anthropic (via compatible endpoints)
- Local LLMs with OpenAI-compatible endpoints (e.g., llama.cpp, text-generation-webui)
- Google Gemini (original support retained)

## Configuration

To switch between providers, set the following environment variables:

### OpenAI
```bash
export LLM_API_URL="https://api.openai.com/v1/chat/completions"
export LLM_API_KEY="your-openai-key"
export LLM_MODEL="gpt-3.5-turbo"
```

### Google Gemini (Original)
```bash
export LLM_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
export LLM_API_KEY="your-gemini-key"
export LLM_MODEL="gemini-pro"
```

### OpenRouter
```bash
export LLM_API_URL="https://openrouter.ai/api/v1/chat/completions"
export LLM_API_KEY="your-openrouter-key"
export LLM_MODEL="openai/gpt-3.5-turbo"
```

### Local LLM (llama.cpp example)
```bash
export LLM_API_URL="http://localhost:8080/v1/chat/completions"
export LLM_API_KEY="sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"  # Not used but required
export LLM_MODEL="gpt-3.5-turbo"  # Not used but required
```

## Usage

1. Set the environment variables for your desired provider
2. Run the CLI as usual:
   ```bash
   npx gemini-cli
   ```

## How It Works

The CLI automatically detects the API endpoint format and adapts the request and response handling accordingly:

- For endpoints containing `chat/completions`, it uses the OpenAI chat format with `messages`
- For other endpoints, it uses a completion format with `prompt`
- Response parsing is adapted to extract content from the `choices` array

## Authentication

The CLI automatically handles authentication headers for different providers:

- OpenAI and OpenRouter: Uses `Authorization: Bearer YOUR_API_KEY`
- Other providers: Uses `X-API-Key: YOUR_API_KEY`

## Limitations

- Embedding functionality is not yet implemented for non-Gemini providers
- Token counting is not standardized across providers and returns 0 for non-Gemini providers
- Streaming responses are not yet implemented for non-Gemini providers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Testing

To test with different providers:

1. OpenAI:
   ```bash
   export LLM_API_URL="https://api.openai.com/v1/chat/completions"
   export LLM_API_KEY="your-openai-key"
   export LLM_MODEL="gpt-3.5-turbo"
   npx gemini-cli "Hello, world!"
   ```

2. Google Gemini:
   ```bash
   export LLM_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
   export LLM_API_KEY="your-gemini-key"
   export LLM_MODEL="gemini-pro"
   npx gemini-cli "Hello, world!"
   ```

3. OpenRouter:
   ```bash
   export LLM_API_URL="https://openrouter.ai/api/v1/chat/completions"
   export LLM_API_KEY="your-openrouter-key"
   export LLM_MODEL="openai/gpt-3.5-turbo"
   npx gemini-cli "Hello, world!"
   ```

4. Local LLM (llama.cpp example):
   ```bash
   export LLM_API_URL="http://localhost:8080/v1/chat/completions"
   export LLM_API_KEY="sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"  # Not used but required
   export LLM_MODEL="gpt-3.5-turbo"  # Not used but required
   npx gemini-cli "Hello, world!"
   ```
</content>
<line_count>105</line_count>
</write_to_file>
