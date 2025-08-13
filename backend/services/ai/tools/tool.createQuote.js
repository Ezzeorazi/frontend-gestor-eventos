/* eslint-env node */
export const schema = {
  name: 'createQuote',
  description: 'Crea un presupuesto en la base de datos.',
  parameters: {
    type: 'object',
    properties: {
      clienteId: { type: 'string' },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            productoId: { type: 'string' },
            qty: { type: 'number' },
            price: { type: 'number' },
          },
          required: ['productoId', 'qty', 'price'],
        },
      },
      notas: { type: 'string' },
    },
    required: ['clienteId', 'items'],
  },
};

export async function run({ clienteId, items, notas = '' }) {
  const total = items.reduce((sum, it) => sum + it.qty * it.price, 0);
  const presupuestoId = `pres-${Date.now()}`;
  // Aquí se insertaría en MongoDB
  return { presupuestoId, total, clienteId, notas };
}

export default { schema, run };
