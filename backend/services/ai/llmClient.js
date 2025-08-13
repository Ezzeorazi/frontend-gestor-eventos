/* eslint-env node */
/* global process */
import OpenAI from 'openai';
import generateEmail from './tools/tool.generateEmail.js';
import calculateMargins from './tools/tool.calculateMargins.js';
import createQuote from './tools/tool.createQuote.js';
import searchNearby from './tools/tool.searchNearby.js';
import summarizeRecords from './tools/tool.summarizeRecords.js';

const TOOL_MAP = {
  generateEmail,
  calculateMargins,
  createQuote,
  searchNearby,
  summarizeRecords,
};

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function chatWithTools({ messages, tools = [], systemPrompt, temperature = 0.2, empresaId }) {
  const selected = tools.length ? tools.filter((t) => TOOL_MAP[t]).map((t) => TOOL_MAP[t]) : Object.values(TOOL_MAP);
  const toolDefs = selected.map((t) => ({ type: 'function', function: t.schema }));
  const msgs = systemPrompt ? [{ role: 'system', content: systemPrompt }, ...messages] : messages;

  let response = await client.chat.completions.create({
    model: process.env.LLM_MODEL || 'gpt-4o-mini',
    messages: msgs,
    temperature,
    tools: toolDefs,
  });

  const assistantMsg = response.choices[0].message;

  if (assistantMsg.tool_calls?.length) {
    const call = assistantMsg.tool_calls[0];
    const tool = selected.find((t) => t.schema.name === call.function.name);
    if (tool) {
      const args = JSON.parse(call.function.arguments || '{}');
      const result = await tool.run({ ...args, empresaId });
      msgs.push(assistantMsg);
      msgs.push({ role: 'tool', name: call.function.name, content: JSON.stringify(result) });
      const follow = await client.chat.completions.create({
        model: process.env.LLM_MODEL || 'gpt-4o-mini',
        messages: msgs,
        temperature,
      });
      return {
        messages: [...msgs, follow.choices[0].message],
        toolCalls: [{ name: call.function.name, args, result }],
      };
    }
  }

  return { messages: [...msgs, assistantMsg] };
}

export default { chatWithTools };
