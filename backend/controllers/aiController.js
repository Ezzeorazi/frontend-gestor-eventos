import llmClient from '../services/ai/llmClient.js';
import rag from '../services/ai/rag/ragClient.js';

const SYSTEM_PROMPT = 'Sos Nimbus Assistant. Respondé breve y accionable. Usá herramientas cuando corresponda. Nunca expongas secretos. Siempre respetá empresaId.';

export async function chat(req, res) {
  try {
    const { messages = [], toolsAllowed = [] } = req.body;
    const empresaId = req.empresaId;
    const lastUser = messages.filter((m) => m.role === 'user').slice(-1)[0];
    let contextDocs = [];
    try {
      contextDocs = await rag.search(empresaId, lastUser?.content || '', 4);
    } catch (e) {
      console.warn('RAG search failed', e);
    }
    const contextBlock = contextDocs.map((d) => d.text).join('\n');
    const msgs = [
      { role: 'system', content: SYSTEM_PROMPT + (contextBlock ? `\n\nContexto:\n${contextBlock}` : '') },
      ...messages,
    ];
    const result = await llmClient.chatWithTools({ messages: msgs, tools: toolsAllowed, empresaId });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'AI_ERROR' });
  }
}

export async function embed(req, res) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' });
  }
  try {
    const { docs = [] } = req.body;
    const empresaId = req.empresaId;
    await rag.upsertDocs(empresaId, docs);
    res.json({ inserted: docs.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'EMBED_ERROR' });
  }
}

export default { chat, embed };
