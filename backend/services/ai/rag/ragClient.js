/* eslint-env node */
/* global process */
import { MongoClient } from 'mongodb';
import { embed } from './embedder.js';

const client = new MongoClient(process.env.MONGODB_URI);
const COLLECTION = 'tenant_docs';

export async function upsertDocs(empresaId, docs = []) {
  await client.connect();
  const col = client.db().collection(COLLECTION);
  const ops = await Promise.all(
    docs.map(async (d) => ({
      updateOne: {
        filter: { empresaId, id: d.id },
        update: { $set: { ...d, empresaId, embedding: await embed(d.text) } },
        upsert: true,
      },
    }))
  );
  if (ops.length) await col.bulkWrite(ops);
}

function cosine(a, b) {
  const dot = a.reduce((s, x, i) => s + x * b[i], 0);
  const na = Math.sqrt(a.reduce((s, x) => s + x * x, 0));
  const nb = Math.sqrt(b.reduce((s, x) => s + x * x, 0));
  return dot / (na * nb);
}

export async function search(empresaId, query, k = 3) {
  await client.connect();
  const col = client.db().collection(COLLECTION);
  const qEmb = await embed(query);
  const all = await col.find({ empresaId }).toArray();
  const scored = all.map((d) => ({ ...d, score: cosine(qEmb, d.embedding) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((d) => ({ id: d.id, text: d.text, score: d.score }));
}

export default { upsertDocs, search };
