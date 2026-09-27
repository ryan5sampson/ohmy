// Self-check for the puzzle engine. Run: node check.js
const assert = require('assert');
const O = require('./ohmy.js');

const near = (a, b) => Math.abs(a - b) < 1e-6;
const flat = n => [n].concat(...(n.kids || []).map(flat));

// Physics, checked straight from the tree without the solver.
function physics(n) {
  assert(near(n.V, n.I * n.R), `Ohm's law at ${n.name || n.t}`);
  if (!n.kids) return;
  n.kids.forEach(physics);
  const s = f => n.kids.reduce((t, k) => t + f(k), 0);
  if (n.t === 'S') {
    assert(n.kids.every(k => near(k.I, n.I)) && near(s(k => k.V), n.V) && near(s(k => k.R), n.R), 'series');
  } else {
    assert(n.kids.every(k => near(k.V, n.V)) && near(s(k => k.I), n.I) && near(1 / s(k => 1 / k.R), n.R), 'parallel');
  }
}

const t0 = Date.now();
let count = 0;
for (const d of 'EMH') for (const s of 'CXP') for (let k = 0; k < 60; k++) {
  const code = O.randomCode(d, s), p = O.puzzle(code);
  try {
    assert.strictEqual(JSON.stringify(O.puzzle(code).cells), JSON.stringify(p.cells), 'same code, same puzzle');
    physics(p.tree);
    for (const n of flat(p.tree)) for (const x of [n.V, n.I, n.R]) assert(O.fits(x, p.dp), `value ${x} fits ${p.dp} dp`);
    if (p.dp) assert(p.cells.some(c => !O.fits(c.value, p.dp - 1)), 'uses its decimal places');
    const given = p.cells.filter(c => c.given).map(c => c.id);
    if (s === 'P') {
      assert(!p.solvable(given) && p.par >= 1 && p.meter === p.par + 2, 'meter puzzle needs measuring');
    } else {
      assert(p.solvable(given), 'solvable by logic');
      assert(given.every(id => !p.solvable(given.filter(g => g !== id))) || s === 'C', 'mixed clues are minimal');
    }
    count++;
  } catch (e) { console.error(code, e.message); process.exit(1); }
}
assert.strictEqual(O.parseCode('mx-7k3q9'), 'MX-7K3Q9');
assert.strictEqual(O.parseCode('MXOIL00'), 'MX-01100');
assert.strictEqual(O.parseCode('ZX-12345'), null);
assert.strictEqual(O.dailyCode('2026-09-27', 'H'), O.dailyCode('2026-09-27', 'H'));
console.log(`ok: ${count} puzzles in ${Date.now() - t0} ms`);
