#!/usr/bin/env node

// Test script to verify multi-LLM functionality
import { spawn } from 'child_process';

console.log('Testing Multi-LLM functionality...');

// Test 1: Default Gemini (should work if GEMINI_API_KEY is set)
console.log('\n1. Testing default Gemini API...');
const geminiTest = spawn('node', ['bundle/gemini.js', '--prompt', 'What is 2+2?'], {
  env: { ...process.env }
});

geminiTest.stdout.on('data', (data) => {
  console.log(`Gemini output: ${data}`);
});

geminiTest.stderr.on('data', (data) => {
  console.error(`Gemini error: ${data}`);
});

geminiTest.on('close', (code) => {
  console.log(`Gemini test exited with code ${code}`);
  
  // Test 2: OpenAI format (won't actually connect without real API key, but tests the code path)
  console.log('\n2. Testing OpenAI format configuration...');
  const openaiTest = spawn('node', ['bundle/gemini.js', '--prompt', 'What is 2+2?'], {
    env: {
      ...process.env,
      LLM_API_URL: 'https://api.openai.com/v1/chat/completions',
      LLM_API_KEY: 'test-key',
      LLM_MODEL: 'gpt-3.5-turbo'
    }
  });

  openaiTest.stdout.on('data', (data) => {
    console.log(`OpenAI format output: ${data}`);
  });

  openaiTest.stderr.on('data', (data) => {
    console.error(`OpenAI format error: ${data}`);
  });

  openaiTest.on('close', (code) => {
    console.log(`OpenAI format test exited with code ${code}`);
    
    // Test 3: Local LLM format
    console.log('\n3. Testing local LLM format configuration...');
    const localTest = spawn('node', ['bundle/gemini.js', '--prompt', 'What is 2+2?'], {
      env: {
        ...process.env,
        LLM_API_URL: 'http://localhost:8080/v1/chat/completions',
        LLM_API_KEY: 'test-key',
        LLM_MODEL: 'llama-3'
      }
    });

    localTest.stdout.on('data', (data) => {
      console.log(`Local LLM format output: ${data}`);
    });

    localTest.stderr.on('data', (data) => {
      console.error(`Local LLM format error: ${data}`);
    });

    localTest.on('close', (code) => {
      console.log(`Local LLM format test exited with code ${code}`);
      console.log('\nMulti-LLM testing completed!');
    });
  });
});