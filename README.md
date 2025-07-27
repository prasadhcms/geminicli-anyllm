# Gemini CLI with Multi-LLM Support

[![NPM Version](https://img.shields.io/npm/v/geminicli-anyllm.svg)](https://npmjs.org/package/geminicli-anyllm)
[![License](https://img.shields.io/npm/l/geminicli-anyllm.svg)](https://github.com/prasadhcms/geminicli-anyllm/blob/main/LICENSE)

This fork of the Gemini CLI adds support for multiple LLM providers that use OpenAI-compatible REST APIs. You can now switch between different LLM providers without modifying any code, using only environment variables or configuration.

![Gemini CLI Demo](docs/assets/gemini-screenshot.png)

## Features

- **Multi-LLM Support**: Works with OpenAI, OpenRouter, Anthropic, and local LLMs
- **No Code Changes**: Switch providers using environment variables only
- **Backward Compatible**: Retains all original Gemini CLI functionality
- **Easy Configuration**: Simple environment variable setup
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Supported Providers

The CLI supports any OpenAI-compatible API, including:

- OpenAI
- OpenRouter
- Anthropic (via compatible endpoints)
- Local LLMs with OpenAI-compatible endpoints (e.g., llama.cpp, text-generation-webui)
- Google Gemini (original support retained)

## Quick Start

### Installation

Install the CLI globally:

```bash
npm install -g geminicli-anyllm
```

Or run directly with npx:

```bash
npx geminicli-anyllm
```

### Basic Usage

Start an interactive chat session:

```bash
npx geminicli-anyllm
```

Ask a quick question:

```bash
npx geminicli-anyllm "What is the capital of France?"
```

Pipe content for analysis:

```bash
cat document.txt | npx geminicli-anyllm "Summarize this document"
```

## Configuration

### Setting Up Your First Provider

1. Choose your preferred LLM provider
2. Get an API key from that provider
3. Set the environment variables as shown below

### OpenAI Configuration

```bash
export LLM_API_URL="https://api.openai.com/v1/chat/completions"
export LLM_API_KEY="your-openai-key"
export LLM_MODEL="gpt-3.5-turbo"
```

### Google Gemini (Original) Configuration

```bash
export LLM_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
export LLM_API_KEY="your-gemini-key"
export LLM_MODEL="gemini-pro"
```

### OpenRouter Configuration

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

### Switching Providers

To switch between providers, simply change the environment variables and run the CLI again:

```bash
# Switch to OpenAI
export LLM_API_URL="https://api.openai.com/v1/chat/completions"
export LLM_API_KEY="your-openai-key"
export LLM_MODEL="gpt-4"

npx geminicli-anyllm "Hello, what model are you?"

# Switch to local LLM
export LLM_API_URL="http://localhost:8080/v1/chat/completions"
export LLM_API_KEY="local-key"
export LLM_MODEL="llama-3"

npx geminicli-anyllm "Hello, what model are you?"
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

## Advanced Usage

### Non-Interactive Mode

For scripting and automation:

```bash
# Simple question
npx geminicli-anyllm "What is 2+2?"

# With file input
cat myfile.txt | npx geminicli-anyllm "Summarize this"

# With specific model
LLM_MODEL="gpt-4" npx geminicli-anyllm "Explain quantum computing"
```

### Configuration Files

You can also create a `.env` file in your project directory:

```bash
# .env
LLM_API_URL="https://api.openai.com/v1/chat/completions"
LLM_API_KEY="your-openai-key"
LLM_MODEL="gpt-3.5-turbo"
```

Then run:
```bash
npx geminicli-anyllm
```

The CLI will automatically load the environment variables from the `.env` file.

## Limitations

- Embedding functionality is not yet implemented for non-Gemini providers
- Token counting is not standardized across providers and returns 0 for non-Gemini providers
- Streaming responses are not yet implemented for non-Gemini providers

## Troubleshooting

### Common Issues

1. **"No versions available" error**: Make sure you're using `npx geminicli-anyllm` not `npx gemini-cli`

2. **Authentication errors**: Verify your API key is correct and has proper permissions

3. **Connection errors**: Check that your API endpoint URL is correct and accessible

### Getting Help

- Check the [documentation](docs/index.md)
- File an issue on [GitHub](https://github.com/prasadhcms/geminicli-anyllm/issues)
- Use the `/bug` command within the CLI to report issues

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on the original [Google Gemini CLI](https://github.com/google-gemini/gemini-cli)
- Thanks to all contributors who have helped expand LLM provider support
