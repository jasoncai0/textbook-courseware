'use strict';
/* 高一下 14.2 抽样 · 本课互动：抽签箱、随机数表读数（课本附录第 6～10 行）、按比例的分层示意、
 * 简单随机抽样与分层抽样的重复抽样模拟、例 1 计算表。判对错见 ../shared/mcheck.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const sd = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))); };
const pad2 = (n) => String(n).padStart(2, '0');

/* ---------- 第 3 页：抽签法 ---------- */
const N_STU = 45;
const K_STU = 10;
function initLots() {
  const s = { left: [], got: [] };
  const reset = () => { s.left = Array.from({ length: N_STU }, (_, i) => i + 1); s.got = []; };
  const draw = () => {
    $('lots').innerHTML = Array.from({ length: N_STU }, (_, i) => `<span class="lot${s.got.includes(i + 1) ? ' on' : ''}">${i + 1}</span>`).join('');
    $('lotMsg').innerHTML = s.got.length ? `抽到：<b>${s.got.join('，')}</b>（${s.got.length}/${K_STU}）${s.got.length === K_STU ? '——这 10 名同学的视力组成样本。' : ''}` : '箱中 45 个号签已搅匀。';
  };
  const one = () => {
    if (s.got.length >= K_STU) return;
    const j = Math.floor(Math.random() * s.left.length); // 在剩下的签里等可能地抽一个（不放回）
    s.got.push(s.left.splice(j, 1)[0]);
  };
  $('lotOne').addEventListener('click', () => { one(); draw(); });
  $('lotGo').addEventListener('click', () => { reset(); for (let i = 0; i < K_STU; i += 1) one(); draw(); });
  $('lotReset').addEventListener('click', () => { reset(); draw(); });
  reset();
  draw();
}

/* ---------- 第 4 页：随机数表（课本 p215 摘录的附录第 6～10 行，每行 50 个数字） ---------- */
const RT = [
  '16227794394954435482173793237887352096438426349164',
  '84421753315724550688770474476721763350258392120676',
  '63016378591695556719981050717512867358074439523879',
  '33211234297864560782524207443815510013429966027954',
  '57608632440947279654491746096290528477270802734328',
];
const ROW0 = 6;
function readTable(r0, c0, N = N_STU, K = K_STU) {
  const digits = RT.join('');
  const L = digits.length;
  let pos = r0 * 50 + c0;
  const out = [];
  const marks = [];
  for (let guard = 0; out.length < K && guard < L; guard += 1) {
    const a = digits[pos % L];
    const b = digits[(pos + 1) % L];
    const v = +(a + b);
    const kind = v >= 1 && v <= N ? (out.includes(v) ? 'rep' : 'ok') : 'out';
    if (kind === 'ok') out.push(v);
    marks.push({ pos: pos % L, kind });
    pos += 2;
  }
  return { out, marks };
}
function initTable() {
  const box = $('rtab');
  const cell = (r, c) => `<span class="d" data-r="${r}" data-c="${c}">${RT[r][c]}</span>`;
  box.innerHTML = '<div class="rt-head"><span></span>' + Array.from({ length: 50 }, (_, c) => `<i>${(c + 1) % 5 === 0 ? c + 1 : ''}</i>`).join('') + '</div>'
    + RT.map((row, r) => `<div class="rt-row"><b>第 ${ROW0 + r} 行</b>${[...row].map((_, c) => cell(r, c)).join('')}</div>`).join('');
  const apply = (r, c) => {
    box.querySelectorAll('.d').forEach((d) => { d.className = 'd'; });
    const { out, marks } = readTable(r, c);
    marks.forEach(({ pos, kind }, i) => {
      [pos, (pos + 1) % 250].forEach((p) => {
        const d = box.querySelector(`.d[data-r="${Math.floor(p / 50)}"][data-c="${p % 50}"]`);
        d.classList.add(kind);
        if (i === 0 && p === pos) d.classList.add('start');
      });
    });
    $('rtMsg').innerHTML = `从第 ${ROW0 + r} 行第 ${c + 1} 列的“${RT[r][c]}”开始，依次得到：<b>${out.map(pad2).join('，')}</b>`;
  };
  box.addEventListener('click', (e) => {
    const d = e.target.closest('.d');
    if (d) apply(+d.dataset.r, +d.dataset.c);
  });
  $('rtBook').addEventListener('click', () => apply(8 - ROW0, 28));
  $('rtClear').addEventListener('click', () => { box.querySelectorAll('.d').forEach((d) => { d.className = 'd'; }); $('rtMsg').textContent = '点表中任意一个数字作为开始。'; });
  $('rtMsg').textContent = '点表中任意一个数字作为开始。';
}

/* ---------- 第 6 页：三个年级按人数比例的方块图（每块 25 人） ---------- */
const GRADES = [['高一', 1000, 'g1'], ['高二', 800, 'g2'], ['高三', 700, 'g3']];
function initStrat() {
  const PER = 25;
  $('strat').innerHTML = GRADES.map(([n, c, k]) => `<div class="srow"><b>${n} ${c} 名</b><div>${`<i class="${k}"></i>`.repeat(c / PER)}</div></div>`).join('');
}

/* ---------- 第 7 页：重复抽样模拟（模拟数据，固定种子） ---------- */
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const GRADE_MEAN = [4.9, 4.7, 4.5]; // 五分记录法，示意
const GRADE_SD = 0.15;
const SEED = 20261017;
function makePopulation() {
  const rnd = mulberry32(SEED);
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
  const pop = [];
  GRADES.forEach(([, cnt], g) => { for (let i = 0; i < cnt; i += 1) pop.push({ g, v: Math.round((GRADE_MEAN[g] + GRADE_SD * gauss()) * 10) / 10 }); });
  return pop;
}
const SAMPLE_N = 100;
const QUOTA = [40, 32, 28];
function sampleIdx(n, k, rnd = Math.random) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = 0; i < k; i += 1) { const j = i + Math.floor(rnd() * (n - i)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, k);
}
function initSim() {
  const pop = makePopulation();
  const mu = mean(pop.map((p) => p.v));
  const byG = [0, 1, 2].map((g) => pop.map((p, i) => [p, i]).filter(([p]) => p.g === g).map(([, i]) => i));
  const srs = () => sampleIdx(pop.length, SAMPLE_N);
  const strat = () => byG.flatMap((ids, g) => sampleIdx(ids.length, QUOTA[g]).map((j) => ids[j]));
  const s = { res: { srs: [], st: [] }, last: null };
  // 2500 个小方块：50 × 50
  const COLS = 50;
  const SZ = 10;
  $('pop').innerHTML = `<svg viewBox="0 0 ${COLS * SZ} ${(pop.length / COLS) * SZ}">${pop.map((p, i) => `<rect x="${(i % COLS) * SZ + 0.5}" y="${Math.floor(i / COLS) * SZ + 0.5}" width="${SZ - 1}" height="${SZ - 1}" class="pc g${p.g + 1}" data-i="${i}"/>`).join('')}</svg>`;
  const rects = [...$('pop').querySelectorAll('rect')];
  const b = board($('smPlot'), { x: [4.6, 4.85], y: [-1.6, 18], w: 560, h: 300, axes: false, grid: false });
  b.seg([[4.6, 0], [4.85, 0]], { cls: 'thin' });
  b.seg([[4.6, 9], [4.85, 9]], { cls: 'thin' });
  for (let t = 4.6; t <= 4.851; t += 0.05) { b.seg([[t, 0], [t, -0.25]], { cls: 'thin' }); b.text([t, 0], fmt(t, 2), { cls: 'tk', dx: -14, dy: 18 }); }
  b.seg([[mu, -0.3], [mu, 17.5]], { cls: 'c1' });
  b.text([4.6, 8.2], '简单随机抽样', { cls: 'lb up', dx: 4, dy: 0 });
  b.text([4.6, 17.2], '分层抽样', { cls: 'lb up', dx: 4, dy: 0 });
  const BIN = 0.005;
  const MAX = 200;
  const pos = { srs: [], st: [] };
  const place = (key, m, base) => {
    const bin = Math.round(m / BIN) * BIN;
    const h = pos[key].filter((p) => Math.abs(p[0] - bin) < 1e-9).length;
    pos[key].push([bin, base + 0.25 + h * 0.2]);
  };
  ['srs', 'st'].forEach((key) => { for (let i = 0; i < MAX; i += 1) b.pt(() => pos[key][i] || null, { cls: key === 'srs' ? 'c2' : 'c3', r: 3 }); });
  const run = (key) => {
    const idx = key === 'srs' ? srs() : strat();
    const m = mean(idx.map((i) => pop[i].v));
    if (s.res[key].length < MAX) { s.res[key].push(m); place(key, m, key === 'srs' ? 0 : 9); }
    return { idx, m };
  };
  const show = (key, r) => {
    if (r) {
      const set = new Set(r.idx);
      rects.forEach((el, i) => el.classList.toggle('on', set.has(i)));
      s.last = { key, m: r.m, cnt: [0, 1, 2].map((g) => r.idx.filter((i) => pop[i].g === g).length) };
    }
    const L = s.last;
    const line = (key2, name) => (s.res[key2].length ? `${name} ${s.res[key2].length} 次：样本平均数的标准差 $${fmt(sd(s.res[key2]), 4)}$` : '');
    $('smMsg').innerHTML = `全校平均视力 $\\mu=${fmt(mu, 3)}$。`
      + (L ? `<br>本次${L.key === 'srs' ? '简单随机抽样' : '分层抽样'}：三个年级各抽到 ${L.cnt.join('、')} 人，样本平均 $${fmt(L.m, 3)}$。` : '')
      + [line('srs', '<br>简单随机抽样'), line('st', '<br>分层抽样')].join('');
    tex($('smMsg'));
    b.update();
  };
  $('smSRS').addEventListener('click', () => show('srs', run('srs')));
  $('smST').addEventListener('click', () => show('st', run('st')));
  $('sm200').addEventListener('click', () => { let r = null; for (let i = 0; i < MAX; i += 1) { run('srs'); r = run('st'); } show('st', r); });
  $('smClr').addEventListener('click', () => { s.res = { srs: [], st: [] }; pos.srs = []; pos.st = []; s.last = null; rects.forEach((el) => el.classList.remove('on')); show(null, null); });
  show(null, null);
}

/* ---------- 第 9 页：例 1 计算表 ---------- */
const EX1 = [['很喜爱', 2435], ['喜爱', 4567], ['一般', 3926], ['不喜爱', 1072]];
function initEx1() {
  const TOTAL = EX1.reduce((s, [, c]) => s + c, 0);
  const K = 60;
  const rows = EX1.map(([n, c]) => { const x = (K * c) / TOTAL; return [n, c, x, Math.round(x)]; });
  $('ex1Tab').innerHTML = `<tr><th>态度</th><th>人数</th><th>$60\\times\\dfrac{\\text{人数}}{${TOTAL}}$</th><th>应取</th></tr>`
    + rows.map(([n, c, x, r]) => `<tr><td>${n}</td><td>${c}</td><td>${fmt(x, 2)}</td><td><b>${r}</b></td></tr>`).join('')
    + `<tr><td>合计</td><td>${TOTAL}</td><td>${fmt(rows.reduce((s, r) => s + r[2], 0), 2)}</td><td><b>${rows.reduce((s, r) => s + r[3], 0)}</b></td></tr>`;
  tex($('ex1Tab'));
}

window.LESSON = {
  init() {
    initLots();
    initTable();
    initStrat();
    initSim();
    initEx1();
  },
};
