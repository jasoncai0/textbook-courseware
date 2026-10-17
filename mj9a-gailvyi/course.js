'use strict';
/* 九上 4.2 等可能条件下的概率（一）· 本课互动：
 * 骰子事件点选 + 真随机掷骰；两枚硬币真随机试验（驳“三种结果各 1/3”）；可点选的树状图；可点选的表格（列表法）。
 * 随机数取自 crypto.getRandomValues；所有图形由坐标计算绘制。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
function randInt(n) {
  const buf = new Uint32Array(1);
  const lim = Math.floor(0x100000000 / n) * n;
  do crypto.getRandomValues(buf); while (buf[0] >= lim);
  return buf[0] % n;
}
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
/** m/n 的 TeX：能约分时写出约分过程 */
function fracTex(m, n) {
  if (m === 0) return `\\frac{0}{${n}}=0`;
  const g = gcd(m, n);
  if (g === 1) return `\\frac{${m}}{${n}}`;
  return n / g === 1 ? `\\frac{${m}}{${n}}=1` : `\\frac{${m}}{${n}}=\\frac{${m / g}}{${n / g}}`;
}
const setTex = (el, html) => { el.innerHTML = html; MathKit.tex(el); };

/* ---------- 频率条形图（试验用） ---------- */
function barChart(svg, bars, ymax, ticks) {
  svg.setAttribute('viewBox', '0 0 600 230');
  const left = 46;
  const H = 170;
  const top = 26;
  const Y = (v) => top + H - (v / ymax) * H;
  svgEl('line', { x1: left, x2: 600, y1: Y(0), y2: Y(0), class: 'axis' }, svg);
  ticks.forEach((v) => {
    svgEl('line', { x1: left, x2: 600, y1: Y(v), y2: Y(v), class: 'gridl' }, svg);
    svgEl('text', { x: left - 6, y: Y(v) + 5, 'text-anchor': 'end', class: 'tk' }, svg).textContent = String(v);
  });
  const slot = (600 - left) / bars.length;
  const items = bars.map((b, i) => {
    const x = left + i * slot + slot * 0.22;
    const w = slot * 0.56;
    const rect = svgEl('rect', { x, width: w, y: Y(0), height: 0, fill: b.color || '#4f9bd0', rx: 3 }, svg);
    (b.refs || []).forEach((r) => svgEl('line', { x1: x - 6, x2: x + w + 6, y1: Y(r.v), y2: Y(r.v), class: r.cls }, svg));
    const v = svgEl('text', { x: x + w / 2, y: Y(0) - 6, 'text-anchor': 'middle', class: 'bv' }, svg);
    svgEl('text', { x: x + w / 2, y: Y(0) + 24, 'text-anchor': 'middle', class: 'bn' }, svg).textContent = b.name;
    return { rect, v };
  });
  return (freqs) => items.forEach(({ rect, v }, i) => {
    const f = freqs[i];
    const y = Y(Math.min(f ?? 0, ymax));
    rect.setAttribute('y', y);
    rect.setAttribute('height', Y(0) - y);
    v.setAttribute('y', y - 6);
    v.textContent = f === null ? '' : f.toFixed(3);
  });
}

/* ---------- 骰子 ---------- */
const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
const dieSvg = (k) => `<svg viewBox="0 0 60 60"><rect x="3" y="3" width="54" height="54" rx="10" class="die-b"/>${PIPS[k].map(([a, b]) => `<circle cx="${30 + a * 15}" cy="${30 + b * 15}" r="${k === 1 ? 7 : 5.5}" class="${k === 1 ? 'pip1' : 'pip'}"/>`).join('')}</svg>`;

function initDice() {
  const faces = $('dieFaces');
  const msg = $('dieMsg');
  const EV = [{ k: 'A', name: '点数大于 4', f: (x) => x > 4 }, { k: 'B', name: '点数不大于 4', f: (x) => x <= 4 }];
  let cur = EV[0];
  faces.innerHTML = [1, 2, 3, 4, 5, 6].map((k) => `<span class="die" data-k="${k}">${dieSvg(k)}</span>`).join('');
  $('dieEv').innerHTML = EV.map((e, i) => `<button class="btn${i ? '' : ' solid'}" data-i="${i}">事件 ${e.k}：${e.name}</button>`).join('');
  const chart = barChart($('dieBars'), [
    { name: '事件 A', color: '#d9711c', refs: [{ v: 1 / 3, cls: 'pline' }] },
    { name: '事件 B', color: '#4f9bd0', refs: [{ v: 2 / 3, cls: 'pline' }] },
  ], 1, [0.5, 1]);
  const cnt = [0, 0, 0, 0, 0, 0];
  let total = 0;
  let last = 0;
  const show = () => {
    faces.querySelectorAll('.die').forEach((d) => {
      d.classList.toggle('on', cur.f(+d.dataset.k));
      d.classList.toggle('hit', +d.dataset.k === last);
    });
    const m = [1, 2, 3, 4, 5, 6].filter(cur.f).length;
    setTex(msg, `事件 ${cur.k}“${cur.name}”含 <b>${m}</b> 种结果，共 6 种等可能结果：$P(${cur.k})=${fracTex(m, 6)}$`);
    const fa = total ? (cnt[4] + cnt[5]) / total : null;
    chart([fa, total ? 1 - fa : null]);
    $('dieSt').textContent = total ? `已掷 ${total} 次，最近一次 ${last} 点；条形上是频率，虚线是 1/3 与 2/3．` : '点“掷”开始试验；虚线是 1/3 与 2/3．';
  };
  $('dieEv').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-i]');
    if (!b) return;
    cur = EV[+b.dataset.i];
    $('dieEv').querySelectorAll('button').forEach((x) => x.classList.toggle('solid', x === b));
    show();
  });
  $('dieRoll').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-n]');
    if (!b) return;
    const k = +b.dataset.n;
    if (!k) { cnt.fill(0); total = 0; last = 0; show(); return; }
    for (let i = 0; i < k; i++) { const r = randInt(6); cnt[r] += 1; last = r + 1; }
    total += k;
    show();
  });
  show();
}

/* ---------- 两枚硬币（抛 2 次） ---------- */
function initCoins() {
  const chart = barChart($('coinBars'), [
    { name: '两次正', color: '#4f9bd0', refs: [{ v: 1 / 4, cls: 'pline' }, { v: 1 / 3, cls: 'wline' }] },
    { name: '两次反', color: '#6f8191', refs: [{ v: 1 / 4, cls: 'pline' }, { v: 1 / 3, cls: 'wline' }] },
    { name: '一正一反', color: '#d9711c', refs: [{ v: 1 / 2, cls: 'pline' }, { v: 1 / 3, cls: 'wline' }] },
  ], 0.75, [0.25, 0.5]);
  const c = [0, 0, 0];
  let total = 0;
  let last = '';
  const show = () => {
    chart(c.map((x) => (total ? x / total : null)));
    $('coinSt').textContent = total ? `已抛 ${total} 轮（每轮抛 2 次），最近一轮：${last}．` : '每轮把硬币抛 2 次；点按钮开始．';
  };
  $('coinBtns').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-n]');
    if (!b) return;
    const k = +b.dataset.n;
    if (!k) { c.fill(0); total = 0; show(); return; }
    for (let i = 0; i < k; i++) {
      const a = randInt(2);
      const d = randInt(2);
      c[a + d === 2 ? 0 : a + d === 0 ? 1 : 2] += 1;
      last = `（${a ? '正' : '反'}，${d ? '正' : '反'}）`;
    }
    total += k;
    show();
  });
  show();
}

/* ---------- 可点选的树状图 ----------
 * cfg.levels: 每一层的标签数组；或 cfg.kids(path) 返回下一层的选项（不放回时用）。
 * cfg.node(label) 返回节点内的 SVG 片段；cfg.events: [{ name, f(path) }]；cfg.fmt(path) 结果文字。 */
function tree(host, cfg) {
  const depth = cfg.depth || cfg.levels.length;
  const kids = cfg.kids || ((p) => cfg.levels[p.length]);
  const leaves = [];
  const walk = (p) => { if (p.length === depth) { leaves.push(p); return; } kids(p).forEach((k) => walk([...p, k])); };
  walk([]);
  const rowH = cfg.rowH || 44;
  const H = leaves.length * rowH + 40;
  const colW = cfg.colW || 150;
  const X0 = 70;
  const W = X0 + depth * colW + (cfg.resW || 190);
  host.innerHTML = `<div class="tree-top btns" data-noswipe>
      <button class="btn" data-a="step">展开下一层</button><button class="btn" data-a="all">全部展开</button>
      ${cfg.events.map((e, i) => `<button class="btn ev" data-e="${i}">${e.name}</button>`).join('')}
      <button class="btn" data-a="clr">清除选择</button></div>
    <div class="tree-wrap"><svg class="tree-svg" viewBox="0 0 ${W} ${H}"></svg></div>
    <p class="tree-st tip"></p>`;
  const svg = host.querySelector('svg');
  const st = host.querySelector('.tree-st');
  let shown = 1;
  const sel = new Set();
  // 每个节点的 y = 它下面所有叶子的 y 的平均值
  const leafY = (i) => 30 + i * rowH + rowH / 2 - 6;
  const yOf = (prefix) => {
    const idx = leaves.map((l, i) => [l, i]).filter(([l]) => prefix.every((v, j) => l[j] === v)).map(([, i]) => leafY(i));
    return idx.reduce((a, b) => a + b, 0) / idx.length;
  };
  const xOf = (lv) => X0 + (lv - 0.5) * colW + colW * 0.15;
  const draw = () => {
    let h = `<text x="${X0 - 62}" y="${yOf([]) + 6}" class="t-start">开始</text>`;
    (cfg.heads || []).forEach((t, i) => { if (i <= shown) h += `<text x="${i < depth ? xOf(i + 1) : X0 + depth * colW + 10}" y="18" class="t-head" text-anchor="${i < depth ? 'middle' : 'start'}">${t}</text>`; });
    const seen = new Set();
    leaves.forEach((leaf) => {
      for (let lv = 1; lv <= Math.min(shown, depth); lv++) {
        const pre = leaf.slice(0, lv);
        const key = pre.join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        const x1 = lv === 1 ? X0 - 8 : xOf(lv - 1) + 26;
        const y1 = yOf(pre.slice(0, -1));
        const x2 = xOf(lv) - 26;
        const y2 = yOf(pre);
        h += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="t-edge"/>`;
        h += `<g transform="translate(${xOf(lv)},${y2})">${cfg.node(pre[lv - 1], lv)}</g>`;
      }
    });
    if (shown >= depth) {
      leaves.forEach((leaf, i) => {
        const y = leafY(i);
        h += `<g class="t-leaf${sel.has(i) ? ' on' : ''}" data-i="${i}"><rect x="${X0 + depth * colW - 10}" y="${y - rowH / 2 + 3}" width="${(cfg.resW || 190) + 6}" height="${rowH - 6}" rx="6"/><text x="${X0 + depth * colW + 4}" y="${y + 7}">${cfg.fmt(leaf)}</text></g>`;
      });
    }
    svg.innerHTML = h;
    if (shown < depth) {
      st.textContent = `已展开 ${shown} 层，共 ${depth} 层．`;
    } else if (!sel.size) {
      setTex(st, `共 <b>${leaves.length}</b> 种等可能的结果．点结果（或上面的事件按钮）选出使事件发生的结果．`);
    } else {
      setTex(st, `选中 <b>${sel.size}</b> 种，共 <b>${leaves.length}</b> 种：$P=${fracTex(sel.size, leaves.length)}$`);
    }
  };
  host.querySelector('.tree-top').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.a === 'step') shown = Math.min(depth, shown + 1);
    if (b.dataset.a === 'all' || b.dataset.e) shown = depth;
    if (b.dataset.a === 'clr') sel.clear();
    if (b.dataset.e) {
      sel.clear();
      leaves.forEach((l, i) => { if (cfg.events[+b.dataset.e].f(l)) sel.add(i); });
    }
    draw();
  });
  svg.addEventListener('click', (e) => {
    const g = e.target.closest('.t-leaf');
    if (!g) return;
    const i = +g.dataset.i;
    if (sel.has(i)) sel.delete(i); else sel.add(i);
    draw();
  });
  draw();
  return { leaves };
}

const coinNode = (t) => `<circle r="19" class="${t === '正' ? 'coin-z' : 'coin-f'}"/><text y="7" class="t-lab" fill="#fff">${t}</text>`;
const boxNode = (t) => `<rect x="-24" y="-17" width="48" height="34" rx="6" class="t-box"/><text y="7" class="t-lab">${t}</text>`;
const COLOR = { 红: '#d9534f', 黄: '#e9c13b', 蓝: '#3a8fd6', 棕: '#8b5a2b' };
const shirt = (c) => `<path d="M-16 -14 L-6 -18 Q0 -12 6 -18 L16 -14 L22 -4 L14 0 L14 18 L-14 18 L-14 0 L-22 -4 Z" fill="${COLOR[c]}" stroke="#333" stroke-width="1.2"/>`;
const pants = (c) => `<path d="M-12 -18 L12 -18 L14 18 L4 18 L0 -4 L-4 18 L-14 18 Z" fill="${COLOR[c]}" stroke="#333" stroke-width="1.2"/>`;

function initTrees() {
  tree($('treeCoin'), {
    levels: [['正', '反'], ['正', '反']], heads: ['第一次抛掷', '第二次抛掷', '所有可能出现的结果'],
    node: coinNode, fmt: (p) => `（${p.join('，')}）`, colW: 150, resW: 150,
    events: [{ name: '两次都正面朝上', f: (p) => p.every((x) => x === '正') }, { name: '一正一反', f: (p) => p[0] !== p[1] }],
  });
  tree($('treeCoin3'), {
    levels: [['正', '反'], ['正', '反'], ['正', '反']], heads: ['第一次', '第二次', '第三次', '结果'],
    node: coinNode, fmt: (p) => `（${p.join('，')}）`, colW: 110, rowH: 34, resW: 170,
    events: [{ name: '三次都正面朝上', f: (p) => p.every((x) => x === '正') }],
  });
  tree($('treeCloth'), {
    levels: [['红', '黄', '蓝'], ['蓝', '棕']], heads: ['上衣', '裤子', '所有可能出现的结果'],
    node: (t, lv) => (lv === 1 ? shirt(t) : pants(t)), fmt: (p) => `${p[0]}上衣，${p[1]}裤子`, colW: 130, rowH: 46, resW: 190,
    events: [{ name: '蓝上衣和蓝裤子', f: (p) => p[0] === '蓝' && p[1] === '蓝' }],
  });
  const balls = ['1', '−2', '3', '−4'];
  const val = (s) => +s.replace('−', '-');
  tree($('treePing'), {
    depth: 2, kids: (p) => balls.filter((b) => !p.includes(b)), heads: ['第 1 次', '第 2 次', '结果　积'],
    node: (t) => `<circle r="19" class="t-ball"/><text y="7" class="t-lab">${t}</text>`,
    fmt: (p) => `（${p.join('，')}）　${String(val(p[0]) * val(p[1])).replace('-', '−')}`, colW: 110, rowH: 36, resW: 170,
    events: [{ name: '积为偶数', f: (p) => (val(p[0]) * val(p[1])) % 2 === 0 }],
  });
}

/* ---------- 可点选的表格（列表法） ----------
 * cfg: { rows, cols, corner: [行名, 列名], cell(r, c) 文字, events: [{ name, f(r, c) }] } */
function grid(host, cfg) {
  const head = `<tr><th class="corner"><span class="c-top">${cfg.corner[1]}</span><span class="c-bot">${cfg.corner[0]}</span></th>${cfg.cols.map((c) => `<th>${c}</th>`).join('')}</tr>`;
  const body = cfg.rows.map((r, i) => `<tr><th>${r}</th>${cfg.cols.map((c, j) => `<td data-r="${i}" data-c="${j}">${cfg.cell(r, c)}</td>`).join('')}</tr>`).join('');
  host.innerHTML = `<div class="btns" data-noswipe>${cfg.events.map((e, i) => `<button class="btn ev" data-e="${i}">${e.name}</button>`).join('')}<button class="btn" data-a="clr">清除</button></div>
    <div class="grid-wrap" data-noswipe><table class="ptab">${head}${body}</table></div><p class="tip grid-st"></p>`;
  const st = host.querySelector('.grid-st');
  const n = cfg.rows.length * cfg.cols.length;
  const show = () => {
    const m = host.querySelectorAll('td.on').length;
    setTex(st, m ? `选中 <b>${m}</b> 种，共 <b>${n}</b> 种：$P=${fracTex(m, n)}$` : `共 <b>${n}</b> 种等可能的结果．点格子（或事件按钮）选出使事件发生的结果．`);
  };
  host.addEventListener('click', (e) => {
    const td = e.target.closest('td[data-r]');
    const b = e.target.closest('button');
    if (td) td.classList.toggle('on');
    if (b) {
      host.querySelectorAll('td').forEach((t) => t.classList.remove('on'));
      host.querySelectorAll('button.ev').forEach((x) => x.classList.toggle('solid', x === b));
      if (b.dataset.e) {
        const f = cfg.events[+b.dataset.e].f;
        host.querySelectorAll('td[data-r]').forEach((t) => t.classList.toggle('on', f(cfg.rows[+t.dataset.r], cfg.cols[+t.dataset.c])));
      }
    }
    if (td || b) show();
  });
  show();
}

function initGrids() {
  const b3 = ['白', '红 1', '红 2'];
  grid($('grid4'), {
    rows: b3, cols: b3, corner: ['第一次摸球', '第二次摸球'], cell: (r, c) => `（${r}，${c}）`,
    events: [{ name: '两次都摸到红球', f: (r, c) => r !== '白' && c !== '白' }],
  });
  const fw = [1, 2, 3, 4, 5];
  grid($('grid5'), {
    rows: fw, cols: fw, corner: ['第一次', '第二次'], cell: (r, c) => `（${r}，${c}）`,
    events: [
      { name: 'A：图案相同', f: (r, c) => r === c },
      { name: 'B：1 张欢欢、1 张贝贝', f: (r, c) => (r === 1 && c === 3) || (r === 3 && c === 1) },
      { name: 'C：至少 1 张欢欢', f: (r, c) => r === 3 || c === 3 },
    ],
  });
  const d6 = [1, 2, 3, 4, 5, 6];
  grid($('grid36'), {
    rows: d6, cols: d6, corner: ['第 1 次', '第 2 次'], cell: (r, c) => String(r + c),
    events: [{ name: '和为 8', f: (r, c) => r + c === 8 }, { name: '和为 7', f: (r, c) => r + c === 7 }],
  });
}

initDice();
initCoins();
initTrees();
initGrids();

/* ---------- 例 2：编号 1～5 的球（1、2、3 白，4、5 红；图 4-3） ---------- */
$('bag5').setAttribute('viewBox', '0 0 300 50');
$('bag5').innerHTML = [1, 2, 3, 4, 5].map((k, i) => `<circle cx="${50 + i * 50}" cy="25" r="19" fill="${k > 3 ? '#d9534f' : '#fff'}" stroke="#4a5a6a" stroke-width="1.5"/><text x="${50 + i * 50}" y="32" text-anchor="middle" font-size="20" font-weight="bold" fill="${k > 3 ? '#fff' : '#163a5a'}">${k}</text>`).join('');
