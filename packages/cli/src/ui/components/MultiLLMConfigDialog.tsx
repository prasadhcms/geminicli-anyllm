/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Colors } from '../colors.js';
import { LoadedSettings, SettingScope } from '../../config/settings.js';
import { AuthType } from '@google/gemini-cli-core';
import * as fs from 'fs';
import * as path from 'path';

interface MultiLLMConfigDialogProps {
  onSelect: (authMethod: AuthType | undefined, scope: SettingScope) => void;
  settings: LoadedSettings;
}

export function MultiLLMConfigDialog({
  onSelect,
  settings,
}: MultiLLMConfigDialogProps): React.JSX.Element {
  const [llmApiUrl, setLlmApiUrl] = useState<string>(process.env.LLM_API_URL || '');
  const [llmApiKey, setLlmApiKey] = useState<string>(process.env.LLM_API_KEY || '');
  const [llmModel, setLlmModel] = useState<string>(process.env.LLM_MODEL || '');
  const [currentField, setCurrentField] = useState<'url' | 'key' | 'model'>('url');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = () => {
    if (!llmApiUrl || !llmApiKey || !llmModel) {
      setErrorMessage('All fields are required to configure Multi-LLM provider.');
      return;
    }

    // Set the environment variables
    process.env.LLM_API_URL = llmApiUrl;
    process.env.LLM_API_KEY = llmApiKey;
    process.env.LLM_MODEL = llmModel;

    // Save the environment variables to a .env file
    try {
      const envContent = `LLM_API_URL="${llmApiUrl}"\nLLM_API_KEY="${llmApiKey}"\nLLM_MODEL="${llmModel}"\n`;
      const envPath = path.join(process.cwd(), '.env');
      fs.writeFileSync(envPath, envContent);
    } catch (error) {
      console.error('Error saving .env file:', error);
      setErrorMessage('Failed to save configuration to .env file. Configuration will only persist for this session.');
    }

    // Return to the main auth dialog with the multi-LLM auth type
    onSelect(AuthType.USE_MULTI_LLM, SettingScope.User);
  };

  const handleCancel = () => {
    onSelect(undefined, SettingScope.User);
  };

  useInput((input, key) => {
    if (key.escape) {
      handleCancel();
      return;
    }

    if (key.tab) {
      // Cycle through fields
      if (currentField === 'url') {
        setCurrentField('key');
      } else if (currentField === 'key') {
        setCurrentField('model');
      } else {
        setCurrentField('url');
      }
      return;
    }

    if (key.return) {
      if (currentField === 'model') {
        handleSave();
      } else {
        // Move to next field
        if (currentField === 'url') {
          setCurrentField('key');
        } else if (currentField === 'key') {
          setCurrentField('model');
        }
      }
      return;
    }

    // Handle text input for the current field
    if (currentField === 'url') {
      if (key.backspace) {
        setLlmApiUrl(prev => prev.slice(0, -1));
      } else if (input.length > 0) {
        // Handle both single character input and pasted text
        setLlmApiUrl(prev => prev + input);
      }
    } else if (currentField === 'key') {
      if (key.backspace) {
        setLlmApiKey(prev => prev.slice(0, -1));
      } else if (input.length > 0) {
        // Handle both single character input and pasted text
        setLlmApiKey(prev => prev + input);
      }
    } else if (currentField === 'model') {
      if (key.backspace) {
        setLlmModel(prev => prev.slice(0, -1));
      } else if (input.length > 0) {
        // Handle both single character input and pasted text
        setLlmModel(prev => prev + input);
      }
    }
  });

  return (
    <Box
      borderStyle="round"
      borderColor={Colors.Gray}
      flexDirection="column"
      padding={1}
      width="100%"
    >
      <Text bold>Configure Multi-LLM Provider</Text>
      <Box marginTop={1}>
        <Text>Enter the details for your LLM provider:</Text>
      </Box>
      
      <Box marginTop={1} flexDirection="column">
        <Text>API URL {currentField === 'url' ? '(*)' : ''}:</Text>
        <Box marginTop={1}>
          <Text>{llmApiUrl || '(empty)'}</Text>
        </Box>
      </Box>
      
      <Box marginTop={1} flexDirection="column">
        <Text>API Key {currentField === 'key' ? '(*)' : ''}:</Text>
        <Box marginTop={1}>
          <Text>{llmApiKey ? '*'.repeat(llmApiKey.length) : '(empty)'}</Text>
        </Box>
      </Box>
      
      <Box marginTop={1} flexDirection="column">
        <Text>Model {currentField === 'model' ? '(*)' : ''}:</Text>
        <Box marginTop={1}>
          <Text>{llmModel || '(empty)'}</Text>
        </Box>
      </Box>
      
      {errorMessage && (
        <Box marginTop={1}>
          <Text color={Colors.AccentRed}>{errorMessage}</Text>
        </Box>
      )}
      
      <Box marginTop={1}>
        <Text color={Colors.Gray}>
          (Use Tab to switch fields, Enter to confirm, Esc to cancel)
        </Text>
      </Box>
      
      <Box marginTop={1}>
        <Text color={Colors.Gray}>
          Supported providers: OpenAI, OpenRouter, Anthropic, local LLMs
        </Text>
      </Box>
    </Box>
  );
}