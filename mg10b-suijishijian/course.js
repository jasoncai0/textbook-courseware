'use strict';
/* 高一下 15.1 随机事件和样本空间 · 本课互动：点选样本点组成事件（并、积、包含）、抽球树形图。通用部分见 ../shared/math.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* 均匀随机整数 [0, k)：crypto 拒绝采样，没有 crypto 时退回 Math.random */
function randInt(k) {
  if (!window.crypto || !crypto.getRandomValues) return Math.floor(Math.random() * k);
  const lim = Math.floor(0x100000000 / k) * k;
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf); while (buf[0] >= lim);
  return buf[0] % k;
}

/* ---------- 第 8 页：点选样本点组成事件 ---------- */
const range6 = [1, 2, 3, 4, 5, 6];
const ONE = range6.map((k) => ({ id: `${k}`, k, html: `ω<sub>${k}</sub>`, tex: `\\omega_${k}` }));
const TWO = range6.flatMap((i) => range6.map((j) => ({ id: `${i}${j}`, i, j, html: `(${i},${j})`, tex: `(${i},${j})` })));
const SPACES = {
  two: {
    pts: TWO,
    axis: '行：第一颗骰子的点数 i；列：第二颗骰子的点数 j；样本点 (i, j)',
    // 两颗骰子：预设作用在“正在点选”的事件上
    presets: [
      ['点数之和为 2', (p) => p.i + p.j === 2],
      ['点数之和为 6', (p) => p.i + p.j === 6],
      ['点数之和为 7', (p) => p.i + p.j === 7],
      ['第一颗是偶数', (p) => p.i % 2 === 0],
      ['两颗点数相同', (p) => p.i === p.j],
      ['点数之和为 13', (p) => p.i + p.j === 13],
      ['点数之和不超过 12', (p) => p.i + p.j <= 12],
    ],
  },
  one: {
    pts: ONE,
    axis: 'ω<sub>k</sub>：向上的点数是 k（k = 1, 2, …, 6）',
    // 一颗骰子：预设成对给出，重现课本例题
    pairs: [
      ['例 2', ['点数是偶数', (p) => p.k % 2 === 0], ['点数是 2', (p) => p.k === 2]],
      ['例 3', ['点数是偶数', (p) => p.k % 2 === 0], ['点数大于 4', (p) => p.k > 4]],
      ['例 4', ['点数是偶数', (p) => p.k % 2 === 0], ['点数不小于 4', (p) => p.k >= 4]],
      ['练习 2', ['点数是偶数', (p) => p.k % 2 === 0], ['点数是奇数', (p) => p.k % 2 === 1]],
      ['习题 3', ['点数大于 3', (p) => p.k > 3], ['点数小于 5', (p) => p.k < 5]],
    ],
  },
};

const MAX_LIST = 6; // 样本点超过 6 个时只报个数，避免公式过长

function setTex(sp, set) {
  if (set.size === 0) return '\\varnothing';
  const ids = sp.pts.filter((p) => set.has(p.id));
  if (ids.length === sp.pts.length) return '\\Omega';
  if (ids.length > MAX_LIST) return `\\{${ids.slice(0, 3).map((p) => p.tex).join(',')},\\cdots\\}`;
  return `\\{${ids.map((p) => p.tex).join(',')}\\}`;
}

function kindOf(sp, set) {
  if (set.size === 0) return '不可能事件';
  if (set.size === sp.pts.length) return '必然事件';
  if (set.size === 1) return '基本事件';
  return '';
}

function relation(A, B) {
  if (!A.size || !B.size) return '';
  const aInB = [...A].every((x) => B.has(x));
  const bInA = [...B].every((x) => A.has(x));
  const parts = [];
  if (aInB && bInA) parts.push('$A=B$');
  else if (bInA) parts.push('$B\\subseteq A$：$B$ 发生必导致 $A$ 发生');
  else if (aInB) parts.push('$A\\subseteq B$：$A$ 发生必导致 $B$ 发生');
  else parts.push('$A$、$B$ 互不包含');
  if (![...A].some((x) => B.has(x))) parts.push('$AB=\\varnothing$：$A$、$B$ 不可能同时发生');
  return parts.join('；');
}

function initEvents() {
  const st = { space: 'two', who: 'A', A: new Set(), B: new Set(), name: { A: '自选', B: '自选' }, view: null, hit: null };
  const sp = () => SPACES[st.space];
  const sum = () => new Set([...st.A, ...st.B]);
  const prod = () => new Set([...st.A].filter((x) => st.B.has(x)));

  const line = (label, set, name) => {
    const k = kindOf(sp(), set);
    return `<div class="ev-line"><span class="ev-k">${label}</span><span>$${setTex(sp(), set)}$`
      + `<small>${name ? `${name}，` : ''}${set.size} 个样本点${k ? `　<b class="ev-tag">${k}</b>` : ''}</small></span></div>`;
  };
  const renderOut = () => {
    const rel = relation(st.A, st.B);
    $('evOut').innerHTML = line('$A=$', st.A, st.name.A) + line('$B=$', st.B, st.name.B)
      + line('$A+B=$', sum(), '至少一个发生') + line('$AB=$', prod(), '同时发生')
      + `<p class="ev-rel">${rel || '先点选（或用预设）组成 $A$ 和 $B$。'}</p>`;
    tex($('evOut'));
  };
  const renderGrid = () => {
    const ring = st.view === 'sum' ? sum() : st.view === 'prod' ? prod() : new Set();
    $('evGrid').querySelectorAll('.ev-cell').forEach((c) => {
      const id = c.dataset.id;
      c.classList.toggle('a', st.A.has(id));
      c.classList.toggle('b', st.B.has(id));
      c.classList.toggle('ring', ring.has(id));
      c.classList.toggle('hit', st.hit === id);
    });
    document.querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('solid', b.dataset.view === st.view));
  };
  const refresh = () => { renderGrid(); renderOut(); };

  const buildGrid = () => {
    const s = sp();
    const g = $('evGrid');
    g.classList.toggle('one', st.space === 'one');
    const cell = (p) => `<button type="button" class="ev-cell" data-id="${p.id}">${p.html}</button>`;
    g.innerHTML = st.space === 'two'
      ? `<span class="ev-h">i \\ j</span>${range6.map((j) => `<span class="ev-h">${j}</span>`).join('')}`
        + range6.map((i) => `<span class="ev-h">${i}</span>${s.pts.filter((p) => p.i === i).map(cell).join('')}`).join('')
      : s.pts.map(cell).join('');
    $('evAxis').innerHTML = s.axis;
    $('evPre').innerHTML = s.presets
      ? `<span class="lbl">预设：</span>${s.presets.map(([t], n) => `<button type="button" class="btn" data-pre="${n}">${t}</button>`).join('')}`
      : `<span class="lbl">课本：</span>${s.pairs.map(([t], n) => `<button type="button" class="btn" data-pair="${n}">${t}</button>`).join('')}`;
  };
  const setSpace = (key) => {
    Object.assign(st, { space: key, A: new Set(), B: new Set(), name: { A: '自选', B: '自选' }, view: null, hit: null });
    document.querySelectorAll('[data-space]').forEach((b) => b.classList.toggle('solid', b.dataset.space === key));
    $('evMsg').className = 'tip feedback';
    $('evMsg').textContent = '点“做一次试验”随机抛掷，看看哪些事件发生了。';
    buildGrid();
    refresh();
  };
  const setWho = (w) => {
    st.who = w;
    document.querySelectorAll('[data-who]').forEach((b) => b.classList.toggle('solid', b.dataset.who === w));
  };
  const pick = (f) => new Set(sp().pts.filter(f).map((p) => p.id));

  $('evGrid').addEventListener('click', (e) => {
    const c = e.target.closest('.ev-cell');
    if (!c) return;
    const set = new Set(st[st.who]);
    if (set.has(c.dataset.id)) set.delete(c.dataset.id); else set.add(c.dataset.id);
    st[st.who] = set;
    st.name = { ...st.name, [st.who]: '自选' };
    refresh();
  });
  $('evPre').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.pre !== undefined) {
      const [t, f] = sp().presets[+b.dataset.pre];
      st[st.who] = pick(f);
      st.name = { ...st.name, [st.who]: t };
    } else {
      const [, [ta, fa], [tb, fb]] = sp().pairs[+b.dataset.pair];
      Object.assign(st, { A: pick(fa), B: pick(fb), name: { A: ta, B: tb } });
    }
    refresh();
  });
  document.querySelectorAll('[data-space]').forEach((b) => b.addEventListener('click', () => setSpace(b.dataset.space)));
  document.querySelectorAll('[data-who]').forEach((b) => b.addEventListener('click', () => setWho(b.dataset.who)));
  document.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => { st.view = st.view === b.dataset.view ? null : b.dataset.view; renderGrid(); }));
  $('evClear').addEventListener('click', () => { st[st.who] = new Set(); st.name = { ...st.name, [st.who]: '自选' }; refresh(); });
  $('evRoll').addEventListener('click', () => {
    const pts = sp().pts;
    const p = pts[randInt(pts.length)];
    st.hit = p.id;
    const occ = (set, name) => (set.has(p.id) ? `$${p.tex}\\in ${name}$，<b>${name} 发生</b>` : `$${p.tex}\\notin ${name}$，${name} 不发生`);
    const res = st.space === 'two' ? `第一颗 ${p.i} 点，第二颗 ${p.j} 点` : `向上的点数是 ${p.k}`;
    $('evMsg').className = 'tip feedback fb-ok';
    $('evMsg').innerHTML = `试验结果：${res}。<br>${occ(st.A, 'A')}；${occ(st.B, 'B')}；`
      + `$A+B$ ${sum().has(p.id) ? '<b>发生</b>' : '不发生'}，$AB$ ${prod().has(p.id) ? '<b>发生</b>' : '不发生'}。`;
    tex($('evMsg'));
    renderGrid();
  });
  setSpace('two');
}

/* ---------- 第 12 页：抽球树形图 ---------- */
const TREE = {
  put: {
    kids: () => [1, 2, 3],
    events: [
      ['Ω', () => true, '样本空间'],
      ['A', (i, j) => j > i, '第二个球的号码大于第一个球的号码'],
      ['B', (i, j) => j === 2, '第二个球的号码是 2'],
      ['A+B', (i, j) => j > i || j === 2, 'A 与 B 至少有一个发生'],
    ],
  },
  nop: {
    kids: (i) => [1, 2, 3].filter((j) => j !== i),
    events: [
      ['Ω', () => true, '样本空间'],
      ['A', (i) => i === 1, '第一个球的号码是 1'],
      ['B', (i, j) => j === 2, '第二个球的号码是 2'],
      ['AB', (i, j) => i === 1 && j === 2, 'A 与 B 同时发生'],
    ],
  },
};
const T = { rootY: 26, y1: 128, y2: 236, leafY: 282, centers: [160, 340, 520], r: 17, gapPut: 60, gapNop: 56 };

function initTree() {
  const st = { mode: 'put', ev: 0 };
  const svg = $('tree');
  const draw = () => {
    const cfg = TREE[st.mode];
    const [, f] = cfg.events[st.ev];
    const gap = st.mode === 'put' ? T.gapPut : T.gapNop;
    let out = `<text x="8" y="${T.y1 + 6}" class="tl">第1个</text><text x="8" y="${T.y2 + 6}" class="tl">第2个</text>`;
    let nodes = `<circle cx="340" cy="${T.rootY}" r="7" class="tn root"/>`;
    [1, 2, 3].forEach((i, gi) => {
      const cx = T.centers[gi];
      const kids = cfg.kids(i);
      const on1 = kids.some((j) => f(i, j));
      out += `<line x1="340" y1="${T.rootY}" x2="${cx}" y2="${T.y1}" class="te${on1 ? ' on' : ''}"/>`;
      nodes += `<circle cx="${cx}" cy="${T.y1}" r="${T.r}" class="tn${on1 ? ' on' : ''}"/><text x="${cx}" y="${T.y1 + 7}" class="tt">${i}</text>`;
      kids.forEach((j, k) => {
        const x = cx + (k - (kids.length - 1) / 2) * gap;
        const on = f(i, j);
        out += `<line x1="${cx}" y1="${T.y1}" x2="${x}" y2="${T.y2}" class="te${on ? ' on' : ''}"/>`;
        nodes += `<circle cx="${x}" cy="${T.y2}" r="${T.r}" class="tn${on ? ' on' : ''}"/><text x="${x}" y="${T.y2 + 7}" class="tt">${j}</text>`
          + `<text x="${x}" y="${T.leafY}" class="tf${on ? ' on' : ''}">(${i},${j})</text>`;
      });
    });
    svg.innerHTML = out + nodes;
    const pts = [1, 2, 3].flatMap((i) => cfg.kids(i).filter((j) => f(i, j)).map((j) => `(${i},${j})`));
    const [name, , desc] = cfg.events[st.ev];
    const nm = name === 'Ω' ? '\\Omega' : name;
    $('trMsg').innerHTML = `<b>${desc}</b><br>$${nm}=\\{$${pts.map((x) => `$${x}$`).join('，')}$\\}$，共 ${pts.length} 个样本点。`;
    $('trMsg').className = 'tip feedback fb-ok';
    tex($('trMsg'));
    $('trEv').innerHTML = cfg.events.map(([n], k) => `<button type="button" class="btn${k === st.ev ? ' solid' : ''}" data-ev="${k}">${n === 'Ω' ? '$\\Omega$' : `$${n}$`}</button>`).join('');
    tex($('trEv'));
  };
  $('trMode').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (!b) return;
    st.mode = b.dataset.mode; st.ev = 0;
    $('trMode').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    draw();
  });
  $('trEv').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ev]');
    if (!b) return;
    st.ev = +b.dataset.ev;
    draw();
  });
  draw();
}

window.LESSON = {
  init() {
    initEvents();
    initTree();
  },
};
