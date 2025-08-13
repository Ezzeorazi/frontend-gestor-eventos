export const schema = {
  name: 'generateEmail',
  description: 'Redacta un email breve para clientes o presupuestos.',
  parameters: {
    type: 'object',
    properties: {
      toName: { type: 'string' },
      tone: { type: 'string', enum: ['cordial', 'formal', 'persuasivo'], default: 'cordial' },
      topic: { type: 'string' },
      context: { type: 'string' },
    },
    required: ['topic'],
  },
};

export async function run({ toName = '', tone = 'cordial', topic, context = '' }) {
  const greeting = toName ? `Hola ${toName},` : 'Hola,';
  const toneSign = { cordial: 'Saludos cordiales', formal: 'Atentamente', persuasivo: 'Quedo a disposición' }[tone] || 'Saludos';
  const body = `${greeting}\n\n${context}\n\n${topic}.\n\n${toneSign}.`;
  return { subject: `Sobre ${topic}`, body };
}

export default { schema, run };
