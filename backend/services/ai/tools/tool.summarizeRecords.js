export const schema = {
  name: 'summarizeRecords',
  description: 'Devuelve un resumen simple de registros del CRM.',
  parameters: {
    type: 'object',
    properties: {
      entity: { type: 'string', enum: ['clientes', 'ventas', 'productos'] },
      filters: { type: 'object' },
    },
    required: ['entity'],
  },
};

export async function run({ entity }) {
  // Implementación de ejemplo, en real consultaría la DB
  return { entity, count: 0, top: [] };
}

export default { schema, run };
