/* Ohmy puzzle engine: share codes, a seeded circuit generator, and the logic
   solver that decides whether a puzzle can be solved without guessing.
   Loaded by index.html in the browser and by check.js under Node. */
(function (root) {
  'use strict';

  const ABC = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford base32: no I, L, O, U
  const DP = { E: 0, M: 1, H: 2 };                // decimal places per difficulty
  const SPEC = {                                  // resistor count, widest parallel span
    E: { n: [2, 3], w: 2, need: () => true },
    M: { n: [3, 5], w: 3, need: t => some(t, x => x.t === 'P') },
    H: { n: [5, 7], w: 3, need: t => some(t, x => x.t === 'P' && x.kids.some(k => k.t === 'S')) },
  };
  const R_WHOLE = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30];
  const R_HALF = R_WHOLE.concat([0.5, 1.5, 2.5, 7.5]);
  const RES = { E: R_WHOLE, M: R_HALF, H: R_HALF.concat([1.2, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2]) };
  const AMPS = { E: r => int(r, 1, 6), M: r => int(r, 1, 40) / 10, H: r => int(r, 1, 300) / 100 };
  const DROP = { E: 1, M: 2, H: 2 }; // meter puzzles: clues removed past the minimum
  const HINTS = 3;                   // meter charges in a normal puzzle
  const UNIT = { V: 'V', I: 'A', R: 'Ω' };
  const Q = { V: 'voltage', I: 'current', R: 'resistance' };

  function mulberry32(a) {
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), a | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
  const pick = (r, a) => a[Math.floor(r() * a.length)];
  const sum = a => a.reduce((s, x) => s + x, 0);
  const some = (n, f) => f(n) || (n.kids || []).some(k => some(k, f));
  function shuffle(r, a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const fits = (x, dp) => x > 0 && x < 1000 && Math.abs(x * 10 ** dp - Math.round(x * 10 ** dp)) < 1e-6;
  const round = (x, dp) => Math.round(x * 10 ** dp) / 10 ** dp;

  // Codes look like MX-7K3Q9: difficulty (E/M/H), style (C classic, X mixed,
  // P meter puzzle), then a 25-bit seed.
  function parseCode(raw) {
    const s = String(raw || '').toUpperCase().replace(/[IL]/g, '1').replace(/O/g, '0').replace(/[^0-9A-Z]/g, '');
    const m = /^([EMH])([CXP])([0-9A-Z]{5})$/.exec(s);
    return m && [...m[3]].every(c => ABC.includes(c)) ? `${m[1]}${m[2]}-${m[3]}` : null;
  }
  function encode(n) {
    let s = '';
    for (let i = 0; i < 5; i++) { s = ABC[n & 31] + s; n >>>= 5; }
    return s;
  }
  const randomCode = (diff, style) => `${diff}${style}-${encode(Math.floor(Math.random() * 2 ** 25))}`;
  function dailyCode(date, diff) { // date as YYYY-MM-DD; same three puzzles for everyone
    let h = 0x811C9DC5;
    for (const c of `${date}|${diff}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
    return `${diff}${diff !== 'E' || h >>> 31 ? 'X' : 'C'}-${encode(h)}`; // Medium and Hard are always Mixed
  }

  // Circuit tree: {t:'R'} resistor, {t:'S', kids} series, {t:'P', kids} parallel.
  function shape(r, n, t) {
    if (n === 1) return { t: 'R' };
    const k = int(r, 2, Math.min(3, n)), parts = Array(k).fill(1);
    for (let i = k; i < n; i++) parts[int(r, 0, k - 1)]++;
    return { t, kids: parts.map(p => shape(r, p, t === 'S' ? 'P' : 'S')) };
  }
  const width = n => !n.kids ? 1 : n.t === 'S' ? Math.max(...n.kids.map(width)) : sum(n.kids.map(width));
  const flat = n => [n].concat(...(n.kids || []).map(flat));

  function req(n) {
    if (!n.kids) return n.R;
    const rs = n.kids.map(req);
    return (n.R = n.t === 'S' ? sum(rs) : 1 / sum(rs.map(x => 1 / x)));
  }
  function assign(n, I) {
    n.I = I; n.V = I * n.R;
    (n.kids || []).forEach(k => assign(k, n.t === 'S' ? I : n.V / k.R));
  }

  // Pick a shape, then values, until every value, including each group's
  // combined resistance, lands on the difficulty's decimal places.
  function build(r, diff) {
    const sp = SPEC[diff], dp = DP[diff];
    for (;;) {
      const tree = shape(r, int(r, sp.n[0], sp.n[1]), r() < 0.5 ? 'S' : 'P');
      if (width(tree) > sp.w || !sp.need(tree)) continue;
      const nodes = flat(tree), leaves = nodes.filter(n => !n.kids);
      for (let a = 0; a < 300; a++) {
        leaves.forEach(l => { l.R = pick(r, RES[diff]); });
        req(tree);
        assign(tree, AMPS[diff](r));
        if (!nodes.every(n => fits(n.R, dp) && fits(n.V, dp) && fits(n.I, dp))) continue;
        const shown = [tree.V, tree.I].concat(...leaves.map(l => [l.V, l.I, l.R]));
        if (dp && shown.every(x => fits(x, dp - 1))) continue; // Medium and Hard must use their decimals
        nodes.forEach(n => { n.R = round(n.R, dp); n.V = round(n.V, dp); n.I = round(n.I, dp); });
        leaves.forEach((l, i) => { l.name = `R${i + 1}`; });
        return tree;
      }
    }
  }

  // Every node has V, I, R variables; equations are the rules a player uses.
  function system(tree) {
    let nv = 0;
    const eqs = [];
    (function walk(n) {
      n.v = nv++; n.i = nv++; n.r = nv++;
      eqs.push(['ohm', n.v, n.i, n.r]);
      if (!n.kids) return;
      n.kids.forEach(walk);
      const [same, adds] = n.t === 'S' ? ['i', 'v'] : ['v', 'i'];
      n.kids.forEach(k => eqs.push(['eq', n[same], k[same]]));
      eqs.push(['sum', n[adds], ...n.kids.map(k => k[adds])]);
      eqs.push([n.t === 'S' ? 'sum' : 'par', n.r, ...n.kids.map(k => k.r)]);
    })(tree);
    return eqs;
  }

  // Fill in any variable that is the only unknown in some equation, until
  // nothing changes. Parallel resistance only runs forward (parts to total).
  function solve(eqs, x) {
    x = x.slice();
    for (let changed = true; changed;) {
      changed = false;
      for (const [op, a, ...b] of eqs) {
        const miss = [a, ...b].filter(v => x[v] === undefined);
        if (miss.length !== 1) continue;
        const m = miss[0];
        if (op === 'eq') x[m] = x[m === a ? b[0] : a];
        else if (op === 'ohm') x[m] = m === a ? x[b[0]] * x[b[1]] : m === b[0] ? x[a] / x[b[1]] : x[a] / x[b[0]];
        else if (op === 'sum') { const s = sum(b.filter(v => v !== m).map(v => x[v])); x[m] = m === a ? s : x[a] - s; }
        else if (m === a) x[a] = 1 / sum(b.map(v => 1 / x[v]));
        else continue;
        changed = true;
      }
    }
    return x;
  }

  function combos(a, k, from = 0) {
    if (!k) return [[]];
    const out = [];
    for (let i = from; i <= a.length - k; i++) combos(a, k - 1, i + 1).forEach(c => out.push([a[i], ...c]));
    return out;
  }

  function puzzle(raw) {
    const code = parseCode(raw);
    if (!code) return null;
    const diff = code[0], style = code[1], dp = DP[diff];
    const r = mulberry32([...code.slice(3)].reduce((n, c) => n * 32 + ABC.indexOf(c), 0));
    const tree = build(r, diff), eqs = system(tree), leaves = flat(tree).filter(n => !n.kids);

    const cells = [
      { id: 'B.V', part: 'B', q: 'V', v: tree.v, value: tree.V },
      { id: 'B.I', part: 'B', q: 'I', v: tree.i, value: tree.I },
    ];
    for (const l of leaves) for (const q of 'VIR') cells.push({ id: `${l.name}.${q}`, part: l.name, q, v: l[q.toLowerCase()], value: l[q] });
    const ok = set => { const x = []; for (const c of set) x[c.v] = c.value; const s = solve(eqs, x); return cells.every(c => s[c.v] !== undefined); };

    let given;
    if (style === 'C') given = new Set(cells.filter(c => c.id === 'B.V' || c.q === 'R'));
    else {
      given = new Set(cells);
      for (const c of shuffle(r, cells.slice())) { given.delete(c); if (!ok(given)) given.add(c); }
    }
    // Total resistance sits on the battery card. It's added after the clues
    // are picked so existing codes keep their clues; it's never a clue itself.
    cells.splice(2, 0, { id: 'B.R', part: 'B', q: 'R', v: tree.r, value: tree.R });
    let par = 0;
    if (style === 'P') {
      shuffle(r, [...given]).slice(0, DROP[diff]).forEach(c => given.delete(c));
      const open = cells.filter(c => !given.has(c));
      do par++; while (!combos(open, par).some(extra => ok([...given, ...extra])));
    }
    return {
      code, diff, style, dp, tree, par,
      meter: style === 'P' ? par + 2 : HINTS,
      cells: cells.map(c => ({ id: c.id, part: c.part, q: c.q, value: c.value, given: given.has(c) })),
      // for check.js: can these clues be solved by logic alone?
      solvable: ids => ok(cells.filter(c => ids.includes(c.id))),
    };
  }

  const api = { parseCode, randomCode, dailyCode, puzzle, fits, round, DP, UNIT, Q };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Ohmy = api;
})(this);
