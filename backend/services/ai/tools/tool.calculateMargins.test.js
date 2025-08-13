import test from 'node:test';
import assert from 'node:assert';
import { run } from './tool.calculateMargins.js';

test('calculateMargins basic', async () => {
  const res = await run({ cost: 50, price: 100 });
  assert.equal(res.marginAbs, 50);
  assert.ok(Math.abs(res.marginPct - 50) < 1e-6);
});
