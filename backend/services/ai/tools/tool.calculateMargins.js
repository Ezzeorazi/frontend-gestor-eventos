export const schema = {
  name: 'calculateMargins',
  description: 'Calcula márgenes a partir de costo y precio.',
  parameters: {
    type: 'object',
    properties: {
      cost: { type: 'number' },
      price: { type: 'number' },
      taxesPct: { type: 'number', default: 0 },
      feesPct: { type: 'number', default: 0 },
    },
    required: ['cost', 'price'],
  },
};

export async function run({ cost, price, taxesPct = 0, feesPct = 0 }) {
  const taxes = (price * taxesPct) / 100;
  const fees = (price * feesPct) / 100;
  const marginAbs = price - cost - taxes - fees;
  const marginPct = (marginAbs / price) * 100;
  return { marginAbs, marginPct, breakdown: { cost, price, taxes, fees } };
}

export default { schema, run };
