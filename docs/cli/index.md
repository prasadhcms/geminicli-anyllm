# Gemini CLI with Multi-LLM Support

This is a fork of the original Gemini CLI that adds support for multiple LLM providers. Within this CLI, `packages/cli` is the frontend for users to send and receive prompts with various LLM providers and their associated tools. For a general overview of the CLI, see the [main documentation page](../index.md).

Supported providers include:
- Google Gemini (original functionality)
- OpenAI
- OpenRouter
- Anthropic (via compatible endpoints)
- Local LLMs with OpenAI-compatible endpoints

## Navigating this section

- **[Authentication](./authentication.md):** A guide to setting up authentication with Google's AI services.
- **[Commands](./commands.md):** A reference for Gemini CLI commands (e.g., `/help`, `/tools`, `/theme`).
- **[Configuration](./configuration.md):** A guide to tailoring Gemini CLI behavior using configuration files.
- **[Token Caching](./token-caching.md):** Optimize API costs through token caching.
- **[Themes](./themes.md)**: A guide to customizing the CLI's appearance with different themes.
- **[Tutorials](tutorials.md)**: A tutorial showing how to use Gemini CLI to automate a development task.

## Non-interactive mode

Gemini CLI can be run in a non-interactive mode, which is useful for scripting and automation. In this mode, you pipe input to the CLI, it executes the command, and then it exits.

The following example pipes a command to Gemini CLI from your terminal:

```bash
echo "What is fine tuning?" | geminicli-anyllm
```

Gemini CLI executes the command and prints the output to your terminal. Note that you can achieve the same behavior by using the `--prompt` or `-p` flag. For example:

```bash
geminicli-anyllm -p "What is fine tuning?"
```
