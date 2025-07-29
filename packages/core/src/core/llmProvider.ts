/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GenerateContentResponse,
  GenerateContentParameters,
  CountTokensResponse,
  CountTokensParameters,
  EmbedContentResponse,
  EmbedContentParameters,
} from '@google/genai';

/**
 * Interface for LLM providers that abstracts the core functionalities for generating content,
 * counting tokens, and embedding content.
 */
export interface LLMProvider {
  /**
   * Generate content using the LLM.
   * @param request The request parameters for content generation.
   * @returns A promise that resolves to the generated content response.
   */
  generateContent(
    request: GenerateContentParameters,
  ): Promise<GenerateContentResponse>;

  /**
   * Generate content as a stream using the LLM.
   * @param request The request parameters for content generation.
   * @returns A promise that resolves to an async generator of content responses.
   */
  generateContentStream(
    request: GenerateContentParameters,
  ): Promise<AsyncGenerator<GenerateContentResponse>>;

  /**
   * Count tokens for the given content.
   * @param request The request parameters for token counting.
   * @returns A promise that resolves to the token count response.
   */
  countTokens(request: CountTokensParameters): Promise<CountTokensResponse>;

  /**
   * Generate embeddings for the given content.
   * @param request The request parameters for embedding generation.
   * @returns A promise that resolves to the embedding response.
   */
  embedContent(request: EmbedContentParameters): Promise<EmbedContentResponse>;

  /**
   * Get the name of the provider.
   * @returns The name of the provider.
   */
  getProviderName(): string;
}

/**
 * Configuration for LLM providers.
 */
export interface LLMProviderConfig {
  /**
   * The API endpoint URL.
   */
  apiUrl: string;

  /**
   * The API key for authentication.
   */
  apiKey?: string;

  /**
   * The model name to use.
   */
  model: string;

  /**
   * Additional headers to include in requests.
   */
  headers?: Record<string, string>;

  /**
   * Proxy URL if needed.
   */
  proxy?: string;
}

/**
 * Factory function to create an LLM provider based on configuration.
 * @param config The configuration for the LLM provider.
 * @returns An instance of an LLM provider.
 */
export async function createLLMProvider(
  config: LLMProviderConfig,
): Promise<LLMProvider> {
  // For now, we'll implement a basic provider that works with OpenAI-compatible APIs
  // In the future, we can add more specific providers for different APIs
  return new OpenAICompatibleProvider(config);
}

/**
 * A basic provider that works with OpenAI-compatible APIs.
 */
class OpenAICompatibleProvider implements LLMProvider {
  private config: LLMProviderConfig;

  constructor(config: LLMProviderConfig) {
    this.config = config;
  }

  async generateContent(
    request: GenerateContentParameters,
  ): Promise<GenerateContentResponse> {
    // Determine if this is a chat completion endpoint based on the URL
    const isChatCompletion = this.config.apiUrl.includes('chat/completions');
    
    // Prepare the request body based on the API format
    const requestBody = this.prepareGenerateContentRequest(request, isChatCompletion);
    
    // Make the API call
    const response = await this.makeApiRequest(this.config.apiUrl, requestBody);
    
    // Parse the response
    return this.parseGenerateContentResponse(response, isChatCompletion);
  }

  async generateContentStream(
    request: GenerateContentParameters,
  ): Promise<AsyncGenerator<GenerateContentResponse>> {
    // For simplicity, we'll implement this as a regular generateContent call
    // A full implementation would need to handle streaming properly
    const response = await this.generateContent(request);
    return (async function* () {
      yield response;
    })();
  }

  async countTokens(
    request: CountTokensParameters,
  ): Promise<CountTokensResponse> {
    // Token counting is not standardized across APIs
    // For now, we'll return a placeholder response
    return {
      totalTokens: 0,
    };
  }

  async embedContent(
    request: EmbedContentParameters,
  ): Promise<EmbedContentResponse> {
    // Embedding is not standardized across APIs
    // For now, we'll throw an error
    throw new Error('Embedding not supported for this provider');
  }

  getProviderName(): string {
    return 'OpenAICompatible';
  }

  private prepareGenerateContentRequest(
    request: GenerateContentParameters,
    isChatCompletion: boolean,
  ): Record<string, unknown> {
    if (isChatCompletion) {
      // OpenAI chat completion format
      return {
        model: this.config.model,
        messages: this.convertContentsToMessages(request.contents),
        ...this.convertConfigToOpenAIParams(request.config),
      };
    } else {
      // Assume it's a completion endpoint
      return {
        model: this.config.model,
        prompt: this.convertContentsToPrompt(request.contents),
        ...this.convertConfigToOpenAIParams(request.config),
      };
    }
  }

  private convertContentsToMessages(contents: any): any[] {
    // Convert Gemini-style contents to OpenAI messages
    // Handle different types of content inputs
    const contentArray = Array.isArray(contents) ? contents : [contents];
    
    return contentArray.map((content) => {
      if (typeof content === 'string') {
        return { role: 'user', content: content };
      }
      if (content.role && content.parts) {
        const textParts = content.parts.filter((part: any) => part.text);
        return {
          role: content.role === 'model' ? 'assistant' : content.role,
          content: textParts.map((part: any) => part.text).join('\n'),
        };
      }
      return { role: 'user', content: JSON.stringify(content) };
    });
  }

  private convertContentsToPrompt(contents: any): string {
    // Convert contents to a single prompt string
    const contentArray = Array.isArray(contents) ? contents : [contents];
    
    return contentArray
      .map((content) => {
        if (typeof content === 'string') {
          return content;
        }
        if (content.parts) {
          return content.parts
            .map((part: any) => (part.text ? part.text : JSON.stringify(part)))
            .join('\n');
        }
        return JSON.stringify(content);
      })
      .join('\n\n');
  }

  private convertConfigToOpenAIParams(config: any = {}): Record<string, unknown> {
    const openAIParams: Record<string, unknown> = {};
    
    if (config.temperature !== undefined) {
      openAIParams.temperature = config.temperature;
    }
    if (config.maxOutputTokens !== undefined) {
      openAIParams.max_tokens = config.maxOutputTokens;
    }
    if (config.topP !== undefined) {
      openAIParams.top_p = config.topP;
    }
    if (config.stopSequences !== undefined) {
      openAIParams.stop = config.stopSequences;
    }
    
    return openAIParams;
  }

  private async makeApiRequest(
    url: string,
    body: Record<string, unknown>,
  ): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers,
    };
    
    // Add API key if provided
    if (this.config.apiKey) {
      // Check if it's an OpenAI-style API (using Bearer token)
      if (url.includes('openai.com') || url.includes('api.openai.com')) {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      } else if (url.includes('openrouter.ai')) {
        // OpenRouter uses Authorization header
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      } else {
        // Default to X-API-Key header for other providers
        headers['X-API-Key'] = this.config.apiKey;
      }
    }
    
    // Log the request for debugging
    console.log(`Making API request to: ${url}`);
    console.log(`Request headers: ${JSON.stringify(headers)}`);
    console.log(`Request body: ${JSON.stringify(body)}`);
    
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
    } catch (error) {
      throw new Error(`Network error when making API request: ${(error as Error).message}`);
    }
    
    console.log(`API response status: ${response.status}`);
    
    if (!response.ok) {
      // Try to get the error response as text
      let errorText: string;
      try {
        errorText = await response.text();
      } catch (error) {
        errorText = `Failed to read error response: ${(error as Error).message}`;
      }
      
      console.log(`API error response: ${errorText.substring(0, 200)}${errorText.length > 200 ? '...' : ''}`);
      
      // Check if the error response is JSON
      if (errorText.trim().startsWith('{') || errorText.trim().startsWith('[')) {
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorJson)}`);
        } catch (jsonError) {
          // If parsing fails, use the raw text
          throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
      } else {
        // If it's not JSON, it's likely an HTML error page
        throw new Error(`API request failed with status ${response.status}. Server returned: ${errorText.substring(0, 200)}${errorText.length > 200 ? '...' : ''}`);
      }
    }
    
    // Try to parse the response as JSON
    let responseText: string;
    try {
      responseText = await response.text();
    } catch (error) {
      throw new Error(`Failed to read response: ${(error as Error).message}`);
    }
    
    console.log(`API response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    
    // Check if the response is JSON
    if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
      try {
        return JSON.parse(responseText);
      } catch (error) {
        throw new Error(`Failed to parse JSON response: ${(error as Error).message}. Response text: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
      }
    } else {
      // If it's not JSON, it's likely an HTML error page
      throw new Error(`API returned non-JSON response. Response starts with: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    }
  }

  private parseGenerateContentResponse(
    response: any,
    isChatCompletion: boolean,
  ): GenerateContentResponse {
    // Create a new GenerateContentResponse
    const generateContentResponse = new GenerateContentResponse();
    
    if (isChatCompletion) {
      // Parse OpenAI chat completion response
      if (response.choices && response.choices.length > 0) {
        const choice = response.choices[0];
        generateContentResponse.candidates = [
          {
            content: {
              role: 'model',
              parts: [
                {
                  text: choice.message?.content || '',
                },
              ],
            },
          },
        ];
      }
    } else {
      // Parse completion response
      if (response.choices && response.choices.length > 0) {
        const choice = response.choices[0];
        generateContentResponse.candidates = [
          {
            content: {
              role: 'model',
              parts: [
                {
                  text: choice.text || '',
                },
              ],
            },
          },
        ];
      }
    }
    
    // Add usage metadata if available
    if (response.usage) {
      generateContentResponse.usageMetadata = {
        promptTokenCount: response.usage.prompt_tokens,
        candidatesTokenCount: response.usage.completion_tokens,
        totalTokenCount: response.usage.total_tokens,
      };
    }
    
    return generateContentResponse;
  }
}