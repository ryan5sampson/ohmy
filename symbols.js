/* Schematic symbols for the Symbols study game: each has its symbol, a short
   description, where you'd find it, and a drawing of what the real part looks like.
   Symbols are line art in a 120 × 72 box; "real" drawings are 160 × 100. */
(function (root) {
  'use strict';

  // Symbol line art. Paths are stroked; .f fills; text labels sit inside.
  const P = d => `<path d="${d}"/>`;
  const F = d => `<path class="f" d="${d}"/>`;
  const O = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"/>`;
  const Dot = (x, y, r = 4) => `<circle class="f" cx="${x}" cy="${y}" r="${r}"/>`;
  const T = (x, y, s, size = 16) => `<text x="${x}" y="${y}" font-size="${size}">${s}</text>`;
  const LEADS = 'M4 36h26M90 36h26';
  const ZIG = 'M4 36h26l4-10 8 20 8-20 8 20 8-20 8 20 4-10h30';
  const DIODE = P('M4 36h40M76 36h40M76 20v32') + F('M44 20v32l32-16z');
  const arrow = (x, y, dx, dy) => { // a light arrow from (x, y) heading (dx, dy)
    const l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, ex = x + dx, ey = y + dy;
    return P(`M${x} ${y}L${ex} ${ey}`) + F(`M${ex} ${ey}L${(ex - 7 * ux + 3.5 * uy).toFixed(1)} ${(ey - 7 * uy - 3.5 * ux).toFixed(1)} ${(ex - 7 * ux - 3.5 * uy).toFixed(1)} ${(ey - 7 * uy + 3.5 * ux).toFixed(1)}z`);
  };
  const BJT = O(62, 36, 26) + P('M44 20v32M44 28l22-14V2M44 44l22 14v12');
  const AND = 'M20 12h30a24 24 0 0 1 0 48H20z', OR = 'M18 12q14 24 0 48h20q30 0 44-24q-14-24-44-24z';
  const COIL = (n, r) => Array(n).fill(`a${r} ${r} 0 0 1 ${2 * r} 0`).join('');
  const meter = s => P('M4 36h34M82 36h34') + O(60, 36, 22) + T(60, 43, s, 22);

  // Real-part drawings, flat colors with dark outlines.
  const K = '#13201A';
  const g = (inner, extra = '') => `<g stroke="${K}" stroke-width="2" stroke-linejoin="round"${extra}>${inner}</g>`;
  const R = (x, y, w, h, fill, rx = 0, more = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${more}/>`;
  const C = (x, y, r, fill, more = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${more}/>`;
  const L = (d, color = '#9aa0a6', w = 3) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  const W = (x, y, s, fill = '#fff', size = 10) => `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" text-anchor="middle" stroke="none" font-weight="700">${s}</text>`;
  const axial = inner => L('M6 50h148') + g(inner);
  const legs = (xs, y1 = 70, y2 = 96) => xs.map(x => L(`M${x} ${y1}V${y2}`)).join('');
  const to92 = (fill, label, txt = '#fff') => legs([68, 80, 92], 64) + g(`<path d="M58 64V34a22 12 0 0 1 44 0v30z" fill="${fill}"/>`) + W(80, 54, label, txt, 9);
  const to220 = label => legs([66, 80, 94], 68) + g(R(56, 4, 48, 36, '#c3c8cc', 2) + C(80, 18, 6, '#EEF1EC') + R(56, 34, 48, 36, '#222', 2)) + W(80, 56, label, '#fff', 9);
  const dip = (label, n) => {
    let pins = '';
    for (let i = 0; i < n / 2; i++) { const x = 32 + i * (96 / (n / 2 - 1 || 1)); pins += R(x - 3, 20, 6, 10, '#c3c8cc') + R(x - 3, 70, 6, 10, '#c3c8cc'); }
    return g(pins + R(22, 28, 116, 44, '#222', 3) + `<path d="M22 42a8 8 0 0 1 0 16" fill="#555"/>`) + W(84, 54, label, '#ddd', 11);
  };
  const can = (fill, stripe) => legs([72, 88], 72) + g(R(54, 10, 52, 62, fill, 7) + R(92, 11, 12, 60, stripe)) + W(98, 30, '−', '#13201A', 14) + W(98, 50, '−', '#13201A', 14);
  const slide = pins => legs(pins, 70) + g(R(28, 46, 104, 24, '#b9bec3', 3) + R(52, 40, 56, 8, '#555', 2) + R(70, 24, 18, 22, '#222', 3));
  const button = cap => legs([70, 90], 72) + g(R(56, 44, 48, 28, '#9aa0a6', 3) + L('M56 52h48M56 60h48', K, 1.5) + R(64, 18, 32, 28, cap, 8));
  const coilWire = n => Array.from({ length: n }, (_, i) => `<ellipse cx="${36 + i * 11}" cy="50" rx="5" ry="17" fill="none" stroke="#c47a2c" stroke-width="4"/>`).join('');
  const gate = name => dip(name, 14);
  const plate = inner => g(R(30, 6, 100, 88, '#f4f1e8', 10) + inner);
  const multimeter = sel => g(R(44, 4, 72, 92, '#F2C230', 10) + R(54, 12, 52, 22, '#12321f', 3) + C(80, 62, 16, '#333')) +
    W(80, 29, sel === 'Ω' ? '1.00k' : sel === 'A' ? '0.25' : '9.00', '#7CFC9A', 12) + L(`M80 62L${sel === 'V' ? '70 50' : sel === 'A' ? '92 52' : '80 47'}`, '#fff', 3) + W(80, 92, sel, K, 11);

  const SYMBOLS = [
    // Passive parts
    { id: 'resistor', name: 'Resistor', cat: 'Passive parts', sym: P(ZIG),
      desc: 'Limits how much current flows. Its resistance is measured in ohms (Ω) and shown with color bands.',
      uses: ['Setting the current through an LED', 'Dividing a voltage down', 'Almost every circuit board'],
      real: axial(R(50, 38, 60, 24, '#D2B98E', 10) + R(60, 38, 6, 24, '#FFE600', 0, ' stroke="none"') + R(72, 38, 6, 24, '#8a3fc2', 0, ' stroke="none"') + R(84, 38, 6, 24, '#d7261e', 0, ' stroke="none"') + R(98, 38, 6, 24, '#c9a227', 0, ' stroke="none"')) },
    { id: 'pot', name: 'Potentiometer', cat: 'Passive parts', sym: P(ZIG) + arrow(60, 66, 0, -24),
      desc: 'A resistor with a sliding contact (the wiper), so you can turn a knob to change the resistance.',
      uses: ['Volume knobs', 'Dimmer controls', 'Joysticks'],
      real: legs([64, 80, 96], 70) + g(R(40, 44, 80, 28, '#8f9aa3', 4) + R(73, 6, 14, 40, '#c3c8cc', 2) + L('M76 12h8', K, 2)) },
    { id: 'photoresistor', name: 'Photoresistor (LDR)', cat: 'Passive parts', sym: O(60, 36, 22) + P(ZIG) + arrow(14, 2, 14, 14) + arrow(4, 14, 14, 14),
      desc: 'A light-dependent resistor: more light means less resistance.',
      uses: ['Night lights that turn on in the dark', 'Light sensors in toys and projects'],
      real: legs([72, 88], 66) + g(C(80, 42, 26, '#e9dcae') + L('M64 34h32v8H64v8h32', '#b0522c', 3)) },
    { id: 'cap', name: 'Capacitor', cat: 'Passive parts', sym: P('M4 36h50M66 36h50M54 16v40M66 16v40'),
      desc: 'Stores a small electric charge between two plates. Ceramic and film capacitors work either way around.',
      uses: ['Smoothing out power supplies', 'Filtering noise', 'Timing circuits'],
      real: legs([72, 88], 62) + g(C(80, 38, 26, '#E07B2A')) + W(80, 42, '104', K, 11) },
    { id: 'pcap', name: 'Polarized capacitor', cat: 'Passive parts', sym: P('M4 36h50M54 16v40M80 36h36') + P('M74 16q-10 20 0 40') + P('M38 14h10M43 9v10'),
      desc: 'An electrolytic capacitor that stores more charge but only works one way around. The + side must face the higher voltage.',
      uses: ['Power supply filters', 'Holding up a voltage when demand jumps'],
      real: can('#2f5fd0', '#c9d6f5') },
    { id: 'vcap', name: 'Variable capacitor', cat: 'Passive parts', sym: P('M4 36h50M66 36h50M54 16v40M66 16v40') + arrow(36, 62, 46, -50),
      desc: 'A capacitor you can adjust, usually by turning a small screw or shaft.',
      uses: ['Tuning old radios to a station', 'Fine-tuning oscillators'],
      real: legs([70, 90], 70) + g(R(54, 26, 52, 44, '#e9c46a', 4) + C(80, 48, 12, '#d9d9d9') + L('M72 48h16', K, 3)) },
    { id: 'inductor', name: 'Inductor (coil)', cat: 'Passive parts', sym: P(`M4 36h20${COIL(4, 9)}h20`),
      desc: 'A coil of wire that stores energy in a magnetic field and resists changes in current.',
      uses: ['Power supply filters', 'Radio tuning circuits', 'Wireless chargers'],
      real: L('M6 50h22M132 50h22', '#c47a2c', 3) + g(R(28, 42, 104, 16, '#555', 3)) + coilWire(9) },
    { id: 'transformer', name: 'Transformer', cat: 'Passive parts', sym: P(`M30 6h14${Array(4).fill('a7.5 7.5 0 0 1 0 15').join('')}h-14`) + P('M56 6v60M64 6v60') + P(`M90 6h-14${Array(4).fill('a7.5 7.5 0 0 0 0 15').join('')}h14`),
      desc: 'Two coils on an iron core. It steps AC voltage up or down from one coil to the other.',
      uses: ['Wall chargers and power bricks', 'Power lines and substations', 'Doorbells'],
      real: L('M60 74v22', '#222', 3) + L('M72 74v22', '#d7261e', 3) + L('M88 74v22', '#e8e8e8', 3) + L('M100 74v22', '#2f5fd0', 3) + g(R(36, 10, 88, 64, '#6b6b6b', 3) + R(58, 16, 44, 52, '#c47a2c', 3) + L('M36 30h22M102 30h22M36 54h22M102 54h22', '#999', 1)) },
    { id: 'crystal', name: 'Crystal', cat: 'Passive parts', sym: P('M4 36h34M38 20v32M82 20v32M82 36h34') + P('M48 14h24v44H48z'),
      desc: 'A sliver of quartz that vibrates at one exact frequency, so circuits can keep accurate time.',
      uses: ['Clocks and watches', 'Microcontrollers and computers', 'Radios'],
      real: legs([70, 90], 70) + g(R(48, 22, 64, 48, '#cfd4d8', 22) + R(44, 64, 72, 8, '#aab0b5', 2)) + W(80, 50, '16.000', K, 10) },
    { id: 'fuse', name: 'Fuse', cat: 'Passive parts', sym: P('M4 36h24M92 36h24') + O(32, 36, 4) + O(88, 36, 4) + P('M36 36q6-16 12 0t12 0t12 0t12 0'),
      desc: 'A thin wire that melts and breaks the circuit if too much current flows, protecting the rest.',
      uses: ['Cars', 'Plugs and power strips', 'Inside appliances'],
      real: axial(R(44, 36, 72, 28, '#e3eef3', 4) + R(32, 34, 18, 32, '#c3c8cc', 3) + R(110, 34, 18, 32, '#c3c8cc', 3) + L('M50 50h60', '#8c8c8c', 1.5)) },

    // Semiconductors
    { id: 'diode', name: 'Diode', cat: 'Semiconductors', sym: DIODE + T(42, 14, 'A', 12) + T(78, 14, 'K', 12),
      desc: 'A one-way valve for current: it flows from the anode (A) to the cathode (K), the side with the bar.',
      uses: ['Turning AC into DC in power supplies', 'Protecting circuits from a battery put in backward'],
      real: axial(R(56, 40, 48, 20, '#222', 3) + R(92, 40, 7, 20, '#c3c8cc', 0, ' stroke="none"')) },
    { id: 'led', name: 'LED', cat: 'Semiconductors', sym: DIODE + arrow(62, 14, 14, -12) + arrow(74, 20, 14, -12),
      desc: 'A light-emitting diode: a diode that glows when current flows through it the right way. The arrows show light going out.',
      uses: ['Indicator lights', 'Flashlights and bulbs', 'Screens and signs'],
      real: L('M72 72v24') + L('M88 72v18') + g('<path d="M64 72V36a16 16 0 0 1 32 0v36z" fill="#e53935" fill-opacity=".9"/>' + R(60, 68, 40, 6, '#e53935', 2)) },
    { id: 'zener', name: 'Zener diode', cat: 'Semiconductors', sym: P('M4 36h40M76 36h40M68 56l8-4V20l8-4') + F('M44 20v32l32-16z'),
      desc: 'A diode built to conduct backward at one exact voltage, so it can hold a voltage steady.',
      uses: ['Simple voltage regulators', 'Protecting inputs from voltage spikes'],
      real: axial(R(58, 41, 44, 18, '#E8873A', 6, ' fill-opacity=".85"') + R(92, 41, 6, 18, '#222', 0, ' stroke="none"')) },
    { id: 'photodiode', name: 'Photodiode', cat: 'Semiconductors', sym: DIODE + arrow(90, 4, -14, 12) + arrow(102, 10, -14, 12),
      desc: 'A diode that lets current through when light hits it. The arrows point in, because light comes in.',
      uses: ['TV remote receivers (infrared)', 'Light meters', 'Fiber-optic receivers'],
      real: L('M72 72v24') + L('M88 72v24') + g('<path d="M64 72V36a16 16 0 0 1 32 0v36z" fill="#2b2b33"/>' + R(60, 68, 40, 6, '#2b2b33', 2)) },
    { id: 'npn', name: 'NPN transistor', cat: 'Semiconductors', sym: BJT + P('M4 36h40') + F('M64 57L52.8 55.9 58.2 47.5z'),
      desc: 'A switch or amplifier: a small current into the base lets a bigger current flow from collector to emitter. The arrow points out.',
      uses: ['Switching motors and LEDs from a microcontroller', 'Amplifiers'],
      real: to92('#222', '2N3904') },
    { id: 'pnp', name: 'PNP transistor', cat: 'Semiconductors', sym: BJT + P('M4 36h40') + F('M47 46L52.8 55.5 58 47.1z'),
      desc: 'Like an NPN, but turned on by pulling the base lower. The arrow points in, toward the base.',
      uses: ['Switching power on the positive side', 'Amplifiers'],
      real: to92('#222', '2N3906') },
    { id: 'ujt', name: 'UJT transistor', cat: 'Semiconductors', sym: P('M60 14v44M60 20h20V4M60 52h20v16M20 66L60 40') + F('M58 41L51.8 49.9 47.4 43.1z'),
      desc: 'A unijunction transistor: it suddenly turns on when its emitter voltage reaches a set point, which makes pulses.',
      uses: ['Simple oscillators and blinkers', 'Triggering SCRs'],
      real: to92('#222', '2N2646') },
    { id: 'phototransistor', name: 'Phototransistor', cat: 'Semiconductors', sym: BJT + F('M64 57L52.8 55.9 58.2 47.5z') + arrow(8, 4, 14, 14) + arrow(2, 18, 14, 14),
      desc: 'A transistor turned on by light instead of a base current, so it works like a more sensitive photodiode.',
      uses: ['Object counters and beam-break sensors', 'Optocouplers'],
      real: L('M72 72v24') + L('M88 72v24') + g('<path d="M64 72V36a16 16 0 0 1 32 0v36z" fill="#bfe3f5" fill-opacity=".9"/>' + R(60, 68, 40, 6, '#bfe3f5', 2)) },
    { id: 'scr', name: 'SCR', cat: 'Semiconductors', sym: DIODE + P('M76 52l16 14'),
      desc: 'A silicon-controlled rectifier: a diode that stays off until a pulse on its gate turns it on, then stays on.',
      uses: ['Motor speed controls', 'Crowbar protection circuits', 'Battery chargers'],
      real: to220('SCR') },
    { id: 'triac', name: 'Triac', cat: 'Semiconductors', sym: P('M4 36h36M80 36h36M40 12v48M80 12v48M80 58l14 12') + F('M40 14v20l40-10z') + F('M80 38v20L40 48z'),
      desc: 'Like an SCR for AC: it conducts in both directions once its gate triggers it.',
      uses: ['Light dimmers', 'AC motor speed controls', 'Solid-state relays'],
      real: to220('BT136') },
    { id: 'ic', name: 'Integrated circuit (IC)', cat: 'Semiconductors', sym: P('M30 10h60v52H30zM16 22h14M16 36h14M16 50h14M90 22h14M90 36h14M90 50h14') + T(60, 42, 'IC', 18),
      desc: 'A whole circuit, often thousands of parts, on one chip. Pins are numbered around the package.',
      uses: ['Timers like the 555', 'Microcontrollers', 'Memory and processors'],
      real: dip('NE555', 8) },
    { id: 'opamp', name: 'Operational amplifier', cat: 'Semiconductors', sym: P('M30 6v60l60-30zM8 22h22M8 50h22M90 36h22') + T(40, 28, '−', 16) + T(40, 56, '+', 16),
      desc: 'An amplifier chip with two inputs (− and +). It boosts the difference between them.',
      uses: ['Audio preamps', 'Sensor amplifiers', 'Comparators'],
      real: dip('LM358', 8) },
    { id: 'vreg', name: 'Voltage regulator', cat: 'Semiconductors', sym: P('M24 12h72v40H24zM4 24h20M96 24h20M60 52v16') + T(36, 28, 'IN', 11) + T(84, 28, 'OUT', 11) + T(60, 46, 'GND', 11),
      desc: 'Takes a higher, wobbly voltage in and puts out a steady lower one.',
      uses: ['Turning 9 V into 5 V for a microcontroller', 'Phone chargers'],
      real: to220('7805') },

    // Switches and relays
    { id: 'spst', name: 'SPST switch', cat: 'Switches and relays', sym: P('M4 46h26M90 46h26M37 44l44-22') + O(34, 46, 4) + O(86, 46, 4),
      desc: 'Single pole, single throw: a plain on-off switch.',
      uses: ['Light switches', 'Power switches on toys and gadgets'],
      real: slide([70, 90]) },
    { id: 'spdt', name: 'SPDT switch', cat: 'Switches and relays', sym: P('M4 36h26M90 18h26M90 54h26M37 34l42-14') + O(34, 36, 4) + O(86, 18, 4) + O(86, 54, 4),
      desc: 'Single pole, double throw: connects one wire to either of two others.',
      uses: ['Choosing between two modes', 'Three-way light switches'],
      real: slide([62, 80, 98]) },
    { id: 'pbno', name: 'Push button (normally open)', cat: 'Switches and relays', sym: P('M4 46h26M90 46h26M28 30h64M60 30V12M50 12h20') + O(34, 46, 4) + O(86, 46, 4),
      desc: 'Connects only while you press it. Let go and the circuit opens again.',
      uses: ['Doorbells', 'Keyboard keys', 'Game controller buttons'],
      real: button('#d7261e') },
    { id: 'pbnc', name: 'Push button (normally closed)', cat: 'Switches and relays', sym: P('M4 36h26M90 36h26M28 42h64M60 42V62M50 62h20') + O(34, 36, 4) + O(86, 36, 4),
      desc: 'Connected until you press it. Pressing breaks the circuit.',
      uses: ['Emergency stop buttons', 'Fridge door light switches'],
      real: button('#222') },
    { id: 'relay', name: 'Relay', cat: 'Switches and relays', sym: P('M14 24h28v32H14zM14 56L42 24M28 24V6M28 56v12M54 52h8M106 52h10M69 50l30-18') + O(66, 52, 4) + O(102, 52, 4) + '<path class="d" d="M42 40h40"/>',
      desc: 'An electrically controlled switch: current through a coil pulls a contact closed, so a small circuit can switch a big one.',
      uses: ['Car headlights and starters', 'Smart plugs', 'Arduino projects switching mains'],
      real: legs([50, 66, 94, 110], 78) + g(R(30, 10, 100, 68, '#1f4f9a', 4)) + W(80, 40, 'SRD-05VDC', '#fff', 10) + W(80, 56, '10A 250VAC', '#cfe0ff', 9) },

    // Power and connections
    { id: 'battery', name: 'Battery', cat: 'Power and connections', sym: P('M4 36h32M36 16v40M44 26v20M52 16v40M60 26v20M60 36h56') + T(26, 18, '+', 14),
      desc: 'Several cells together. The long plate is +, the short plate is −.',
      uses: ['9 V batteries', 'Car batteries', 'Laptop and phone battery packs'],
      real: g(R(50, 22, 60, 74, '#222', 5) + R(50, 50, 60, 20, '#F2C230') + C(66, 16, 6, '#c3c8cc') + `<path d="M88 10h12v12H88z" fill="#c3c8cc"/>`) + W(80, 64, '9V', K, 14) },
    { id: 'cell', name: 'Cell', cat: 'Power and connections', sym: P('M4 36h48M52 14v44M64 26v20M64 36h52') + T(42, 16, '+', 14),
      desc: 'A single battery cell. The long plate is +, the short plate is −.',
      uses: ['AA and AAA batteries', 'Coin cells in watches'],
      real: g(R(22, 34, 104, 32, '#222', 5) + R(22, 34, 30, 32, '#c9a227', 5) + R(126, 42, 8, 16, '#c3c8cc', 2)) + W(90, 54, 'AA 1.5V', '#fff', 11) },
    { id: 'acsource', name: 'AC voltage source', cat: 'Power and connections', sym: P('M4 36h34M82 36h34M48 36q6-14 12 0t12 0') + O(60, 36, 22),
      desc: 'A supply whose voltage swings back and forth, like the power from a wall outlet.',
      uses: ['Wall power (120 V in the US)', 'Generators', 'Signal generators in a lab'],
      real: g(R(14, 18, 132, 66, '#d9dde0', 6) + R(24, 28, 70, 34, '#12321f', 3) + C(114, 40, 9, '#555') + C(114, 66, 6, '#d7261e')) + L('M30 45q8-16 16 0t16 0t16 0t12 0', '#7CFC9A', 2) },
    { id: 'earth', name: 'Earth ground', cat: 'Power and connections', sym: P('M60 6v26M38 32h44M46 42h28M54 52h12'),
      desc: 'A connection to the earth itself, the zero-volt reference for safety.',
      uses: ['The round third prong on a plug', 'Lightning rods', 'Electrical panels'],
      real: R(0, 70, 160, 30, '#8B5A2B') + g(R(74, 8, 12, 86, '#c47a2c', 2) + R(68, 30, 24, 12, '#9aa0a6', 2)) + L('M92 36h40', '#2e9e44', 4) },
    { id: 'chassis', name: 'Chassis ground', cat: 'Power and connections', sym: P('M60 6v26M38 32h44M44 32l-8 14M60 32l-8 14M76 32l-8 14'),
      desc: 'A connection to the metal frame or case of a device.',
      uses: ['Car bodies (the negative side)', 'Metal cases of computers and amplifiers'],
      real: g(R(10, 30, 140, 64, '#b8bec4', 4) + C(80, 56, 10, '#d9d9d9') + L('M74 56h12', K, 2)) + L('M90 56q20 0 30-30t30-14', '#2e9e44', 4) },
    { id: 'acplug', name: 'AC plug', cat: 'Power and connections', sym: P('M4 36h34') + O(62, 36, 24) + F('M60 25h14v6H60zM60 41h14v6H60z') + Dot(50, 36, 3),
      desc: 'The plug end of a power cord, the part with prongs.',
      uses: ['Power cords for lamps, chargers, and appliances'],
      real: L('M6 60h40', '#222', 8) + g(R(42, 34, 52, 50, '#222', 8) + R(94, 44, 40, 8, '#c3c8cc', 1) + R(94, 66, 40, 8, '#c3c8cc', 1)) },
    { id: 'acoutlet', name: 'AC outlet', cat: 'Power and connections', sym: P('M4 36h34M60 25h14v6H60zM60 41h14v6H60z') + O(62, 36, 24) + O(50, 36, 3),
      desc: 'The socket in the wall that a plug goes into.',
      uses: ['Wall outlets', 'Power strips', 'Extension cords'],
      real: plate(R(58, 16, 44, 32, '#fffdf6', 12) + R(66, 24, 5, 14, K) + R(89, 24, 5, 14, K) + R(58, 54, 44, 32, '#fffdf6', 12) + R(66, 62, 5, 14, K) + R(89, 62, 5, 14, K)) },
    { id: 'terminal', name: 'Terminal (test point)', cat: 'Power and connections', sym: P('M60 66V30') + O(60, 24, 6),
      desc: 'A point where you connect a wire or touch a meter probe.',
      uses: ['Test points on circuit boards', 'Screw terminals'],
      real: g(R(10, 56, 140, 40, '#1d6b3a', 3)) + L('M74 58V30a6 6 0 0 1 12 0v28', '#d7261e', 4) + C(40, 76, 4, '#c3c8cc') + C(120, 76, 4, '#c3c8cc') },
    { id: 'connector', name: 'Connector', cat: 'Power and connections', sym: P('M4 36h46M66 36h50M42 24l12 12-12 12M58 24l12 12-12 12'),
      desc: 'A plug-and-socket joint so parts can be connected and taken apart.',
      uses: ['USB and headphone jacks', 'Wire harnesses', 'Header pins on boards'],
      real: g(R(20, 40, 120, 28, '#222', 3)) + [36, 56, 76, 96, 116].map(x => R(x - 3, 20, 6, 22, '#d4af37') + L(`M${x} 68v26`, '#d4af37', 4)).join('') },
    { id: 'cross', name: 'Wires crossing (not joined)', cat: 'Power and connections', sym: P('M60 4v64M14 36h92'),
      desc: 'Two wires that cross on the drawing but are not connected. No dot means no connection.',
      uses: ['Any schematic where wires have to pass each other'],
      real: L('M10 50h140', '#d7261e', 6) + L('M80 6v28a16 16 0 0 1 0 32v28', '#2f5fd0', 6) },
    { id: 'join', name: 'Wires joined', cat: 'Power and connections', sym: P('M60 4v64M14 36h92') + Dot(60, 36, 6),
      desc: 'Wires that are connected where they meet. The dot marks the joint.',
      uses: ['Any schematic where one wire splits to feed several parts'],
      real: L('M10 50h140', '#d7261e', 6) + L('M80 6v88', '#d7261e', 6) + C(80, 50, 10, '#c3c8cc', ` stroke="${K}" stroke-width="2"`) },
    { id: 'antenna', name: 'Antenna', cat: 'Power and connections', sym: P('M36 8h48L60 36zM60 36v30'),
      desc: 'Sends or picks up radio waves, turning them into electrical signals and back.',
      uses: ['Radios and TVs', 'Wi-Fi routers', 'Phones'],
      real: L('M80 92L80 10', '#c3c8cc', 4) + L('M80 60V92', '#9aa0a6', 7) + C(80, 8, 4, '#c3c8cc', ` stroke="${K}" stroke-width="2"`) + g(R(60, 88, 40, 10, '#222', 3)) },

    // Lights, sound, and motion
    { id: 'bulb', name: 'Incandescent bulb', cat: 'Lights, sound, and motion', sym: O(60, 30, 22) + P('M50 70V44a10 10 0 0 1 20 0v26'),
      desc: 'A lamp that glows because current heats a thin wire filament.',
      uses: ['Old household bulbs', 'Flashlights', 'Car brake lights'],
      real: g(C(80, 36, 30, '#fff5cc') + R(66, 62, 28, 24, '#c3c8cc', 3)) + L('M70 70h20M70 78h20', K, 1.5) + L('M74 62V44l6-8 6 8v18', '#c47a2c', 2) },
    { id: 'neon', name: 'Neon bulb', cat: 'Lights, sound, and motion', sym: O(60, 36, 22) + P('M4 36h46M70 36h46') + Dot(60, 24, 4),
      desc: 'A small glass bulb of neon gas that glows orange when the voltage is high enough.',
      uses: ['Indicator lights on power strips', 'Mains voltage testers'],
      real: L('M6 50h40M114 50h40') + g(R(40, 34, 80, 32, '#f2e6d0', 16, ' fill-opacity=".85"')) + `<ellipse cx="80" cy="50" rx="18" ry="8" fill="#ff7a1a" fill-opacity=".85"/>` },
    { id: 'speaker', name: 'Speaker', cat: 'Lights, sound, and motion', sym: P('M30 24h14v24H30zM44 24l22-16v56L44 48M10 30h20M10 42h20'),
      desc: 'Turns an electrical signal into sound by moving a paper or plastic cone.',
      uses: ['Headphones', 'Radios and TVs', 'Phones'],
      real: g(`<ellipse cx="80" cy="50" rx="44" ry="44" fill="#9aa0a6"/>` + `<ellipse cx="80" cy="50" rx="34" ry="34" fill="#333"/>` + C(80, 50, 12, '#555')) },
    { id: 'buzzer', name: 'Buzzer', cat: 'Lights, sound, and motion', sym: P('M70 10v52M70 10a26 26 0 0 0 0 52M70 26h40M70 46h40'),
      desc: 'Makes a beep or buzz when powered.',
      uses: ['Alarm clocks', 'Microwave beeps', 'Smoke detectors'],
      real: L('M72 76v20', '#d7261e', 3) + L('M88 76v20', '#222', 3) + g(R(50, 40, 60, 36, '#222', 4) + `<ellipse cx="80" cy="40" rx="30" ry="10" fill="#333"/>` + C(80, 40, 4, '#111')) },
    { id: 'mic', name: 'Microphone', cat: 'Lights, sound, and motion', sym: P('M8 28h32M8 44h32M72 14v44') + O(56, 36, 16),
      desc: 'Turns sound into an electrical signal.',
      uses: ['Phones and headsets', 'Voice-controlled speakers', 'Recording'],
      real: legs([72, 88], 74) + g(C(80, 46, 28, '#c3c8cc')) + L('M62 40h36M62 46h36M62 52h36', '#8c9196', 2) },
    { id: 'motor', name: 'Motor', cat: 'Lights, sound, and motion', sym: P('M4 36h34M82 36h34') + O(60, 36, 22) + T(60, 43, 'M', 22),
      desc: 'Turns electricity into spinning motion.',
      uses: ['Fans', 'Toy cars and drones', 'Electric toothbrushes'],
      real: L('M126 50h28', '#c3c8cc', 4) + g(R(26, 26, 100, 48, '#c3c8cc', 12) + R(14, 34, 16, 32, '#c47a2c', 4)) + L('M14 40H4M14 60H4', '#c3c8cc', 3) },

    // Logic gates
    { id: 'and', name: 'AND gate', cat: 'Logic gates', sym: P(AND + 'M4 24h16M4 48h16M74 36h40'),
      desc: 'Outputs 1 only when both inputs are 1.',
      uses: ['Digital logic: "only if this and that"', 'Inside computer chips'], real: gate('74HC08') },
    { id: 'or', name: 'OR gate', cat: 'Logic gates', sym: P(OR + 'M4 24h20M4 48h20M82 36h32'),
      desc: 'Outputs 1 when either input (or both) is 1.',
      uses: ['Digital logic: "if this or that"', 'Alarm circuits with several sensors'], real: gate('74HC32') },
    { id: 'not', name: 'NOT gate (inverter)', cat: 'Logic gates', sym: P('M30 16v40l40-20zM8 36h22M78 36h36') + O(74, 36, 4),
      desc: 'Flips its input: 1 becomes 0 and 0 becomes 1. The little circle means "not".',
      uses: ['Inverting a signal', 'Simple oscillators'], real: gate('74HC04') },
    { id: 'nand', name: 'NAND gate', cat: 'Logic gates', sym: P(AND + 'M4 24h16M4 48h16M82 36h32') + O(78, 36, 4),
      desc: 'An AND gate followed by NOT: outputs 0 only when both inputs are 1.',
      uses: ['Building any other logic gate', 'Flash memory'], real: gate('74HC00') },
    { id: 'nor', name: 'NOR gate', cat: 'Logic gates', sym: P(OR + 'M4 24h20M4 48h20M90 36h24') + O(86, 36, 4),
      desc: 'An OR gate followed by NOT: outputs 1 only when both inputs are 0.',
      uses: ['Latches that remember a bit', 'Building other gates'], real: gate('74HC02') },
    { id: 'xor', name: 'XOR gate', cat: 'Logic gates', sym: P(OR + 'M10 12q14 24 0 48M4 24h20M4 48h20M82 36h32'),
      desc: 'Exclusive OR: outputs 1 when the inputs are different.',
      uses: ['Adding binary numbers', 'Error checking'], real: gate('74HC86') },

    // Meters
    { id: 'voltmeter', name: 'Voltmeter', cat: 'Meters', sym: meter('V'),
      desc: 'Measures voltage. It connects across (in parallel with) the part you are checking.',
      uses: ['Checking a battery', 'Finding voltage drops in a circuit'], real: multimeter('V') },
    { id: 'ammeter', name: 'Ammeter', cat: 'Meters', sym: meter('A'),
      desc: 'Measures current. It goes in line (in series), so the current flows through it.',
      uses: ['Measuring how much current a circuit draws'], real: multimeter('A') },
    { id: 'ohmmeter', name: 'Ohmmeter', cat: 'Meters', sym: meter('Ω'),
      desc: 'Measures resistance. Use it with the power off.',
      uses: ['Checking a resistor', 'Testing a fuse or wire for a break'], real: multimeter('Ω') },
  ];

  const api = { SYMBOLS };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.OhmySymbols = api;
})(this);
