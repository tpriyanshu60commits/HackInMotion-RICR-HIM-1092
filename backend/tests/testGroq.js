import dotenv from 'dotenv';
dotenv.config();
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  console.log('Testing Groq with llama-3.3-70b-versatile...');
  try {
    const res = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say hello in JSON {"greeting": "hello"}' }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });
    console.log('llama-3.3-70b-versatile response:', res.choices[0]?.message?.content);
  } catch (e) {
    console.error('llama-3.3-70b-versatile error:', e.message);
  }

  console.log('Testing Groq with llama-3.1-8b-instant...');
  try {
    const res = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say hello in JSON {"greeting": "hello"}' }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
    });
    console.log('llama-3.1-8b-instant response:', res.choices[0]?.message?.content);
  } catch (e) {
    console.error('llama-3.1-8b-instant error:', e.message);
  }

  console.log('Testing Groq with openai/gpt-oss-20b...');
  try {
    const res = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say hello in JSON {"greeting": "hello"}' }],
      model: 'openai/gpt-oss-20b',
      response_format: { type: 'json_object' },
    });
    console.log('openai/gpt-oss-20b response:', res.choices[0]?.message?.content);
  } catch (e) {
    console.error('openai/gpt-oss-20b error:', e.message);
  }
}

test();
