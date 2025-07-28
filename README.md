# Geminicli-AnyLLM (GCAL) with Multi-LLM Support

[![NPM Version](https://img.shields.io/npm/v/geminicli-anyllm.svg)](https://npmjs.org/package/geminicli-anyllm)
[![License](https://img.shields.io/npm/l/geminicli-anyllm.svg)](https://github.com/prasadhcms/geminicli-anyllm/blob/main/LICENSE)

This fork of the Geminicli-AnyLLM adds support for multiple LLM providers that use OpenAI-compatible REST APIs. You can now switch between different LLM providers without modifying any code, using only environment variables or configuration.

## Features

- **Multi-LLM Support**: Works with OpenAI, OpenRouter, Anthropic, and local LLMs
- **No Code Changes**: Switch providers using environment variables only
- **Backward Compatible**: Retains all original Geminicli-AnyLLM functionality
- **Easy Configuration**: Simple environment variable setup
- **Dynamic Authentication**: Change authentication methods at runtime with the `/auth` command
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

## Authentication

The CLI automatically handles authentication headers for different providers:

- OpenAI and OpenRouter: Uses `Authorization: Bearer YOUR_API_KEY`
- Other providers: Uses `X-API-Key: YOUR_API_KEY`

### Changing Authentication Methods

You can change the authentication method at any time by using the `/auth` command within the CLI. This will open a dialog that lets you select a different authentication method without restarting the CLI.

This will give you 4 Options like below. use arrow keys to choose.

How would you like to authenticate for this project?

   1. Login with Google                                  
   2. Use Gemini API Key                                 
   3. Vertex AI
● 4. Configure Multi-LLM Provider                       

(Use Arrow Key to Change) 
(Press Enter Key to select) 

Then you can Copy paste the 
1. API URL
2. API Key
3. Model

(Press Enter Key to Set) 


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

### Multi-LLM Provider Issues

If you see an error message during authentication that says "Error creating contentGenerator: Unsupported authType: multi-llm", you can ignore this error if the multi-LLM provider is working correctly. This error occurs during the initial authentication process but does not affect the actual content generation.

To ensure the multi-LLM provider works correctly across CLI restarts, make sure to save your configuration to a `.env` file as described in the [Configuration Files](#configuration-files) section.
</content>
<line_count>215</line_count>
</write_to_file>

### Getting Help

- Check the [documentation](docs/index.md)
- File an issue on [GitHub](https://github.com/prasadhcms/geminicli-anyllm/issues)
- Use the `/bug` command within the CLI to report issues
- Use the `/auth` command within the CLI to change authentication methods

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

- Based on the original [Google Geminicli-AnyLLM](https://github.com/google-gemini/gemini-cli)
- Thanks to all contributors who have helped expand LLM provider support
