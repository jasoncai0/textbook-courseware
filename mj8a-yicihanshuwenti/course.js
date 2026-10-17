'use strict';
/* 八上 6.4 用一次函数解决问题 · 本课互动：雪线上升、盈亏费用条、出租车分段计费、方案比较器（图 6-14）、
 * 蔬菜运输两直线、图像讲故事（图 6-15 + 骑车路线同步）、汽车站比例图。数值一律由表达式计算。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;
const num = (v) => fmt(v).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'); // 千位空格（KaTeX）
const plain = (v) => fmt(v).replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009'); // 千位空格（普通文字）

/* ---------- 第 3 页：雪线 y = 4500 + 10x ---------- */
function initSnow() {
  const [h0, h1, top, bot] = [4000, 5700, 20, 240];
  const Y = (h) => bot - ((h - h0) * (bot - top)) / (h1 - h0);
  // 山的轮廓（示意），主峰顶点的海拔精确为 5 596 m
  const ridge = [[60, 4000], [110, 4600], [150, 4950], [185, 5250], [230, 5596], [265, 5300], [300, 5420], [335, 5050], [380, 4500], [410, 4000]];
  const P = ridge.map(([x, h]) => `${x},${Y(h)}`).join(' ');
  const ticks = [4000, 4400, 4800, 5200, 5600].map((h) => `<line x1="44" x2="50" y1="${Y(h)}" y2="${Y(h)}" stroke="#6f8191"/><text x="41" y="${Y(h) + 4}" font-size="11" text-anchor="end" fill="#6f8191">${h}</text>`).join('');
  const draw = (x) => {
    const y = 4500 + 10 * x;
    const gone = y >= 5596;
    $('mtSvg').innerHTML = `<defs><clipPath id="snowClip"><rect x="0" y="0" width="420" height="${Y(Math.min(y, 5700))}"/></clipPath></defs>`
      + `<polygon points="${P}" fill="#4e7a4a"/><polygon points="${P}" fill="#f4f8fb" clip-path="url(#snowClip)"/><polygon points="${P}" fill="none" stroke="#2f4a35" stroke-width="1.5"/>`
      + `<line x1="50" x2="50" y1="${bot}" y2="${top - 8}" stroke="#6f8191"/>${ticks}<text x="52" y="${top - 10}" font-size="11" fill="#6f8191">海拔/m</text>`
      + `<line x1="50" x2="415" y1="${Y(5596)}" y2="${Y(5596)}" stroke="#9fb0bf" stroke-dasharray="2 3"/><text x="236" y="${Y(5596) - 5}" font-size="11" fill="#556575">主峰 5 596</text>`
      + (gone ? '' : `<line x1="50" x2="415" y1="${Y(y)}" y2="${Y(y)}" stroke="#d9711c" stroke-width="2" stroke-dasharray="6 4"/><text x="412" y="${Y(y) - 5}" font-size="12" text-anchor="end" fill="#d9711c">雪线 ${fmt(y)} m</text>`);
    $('mtXV').textContent = x;
    const msg = $('mtMsg');
    msg.className = `tip feedback ${gone ? 'fb-warn' : 'fb-ok'}`;
    msg.innerHTML = gone
      ? `$x=${x}$：$4\\,500+10\\times${x}=${num(y)}\\ge5\\,596$，雪线已退至山顶，消失了．`
      : `$x=${x}$ 年后：雪线海拔 $y=4\\,500+10\\times${x}=${num(y)}$ m，离山顶还有 $${num(5596 - y)}$ m．`;
    tex(msg);
  };
  MathKit.slider($('mtX'), draw);
}

/* ---------- 第 4 页：问题 1 收入与成本 ---------- */
function initBreakEven() {
  const max = 1200 * 80;
  const draw = (x) => {
    const y1 = 900 * x + 12000;
    const y2 = 1200 * x;
    const row = (name, v, color) => `<span>${name}</span><span class="bar"><i style="width:${(100 * v) / max}%;background:${color}"></i></span><span class="v">${plain(v)} 元</span>`;
    $('bzBars').innerHTML = row('成本 $y_1$', y1, '#1d6fa5') + row('收入 $y_2$', y2, '#d9711c');
    $('bzXV').textContent = x;
    const d = y2 - y1;
    const msg = $('bzMsg');
    msg.className = `tip feedback ${d > 0 ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = d > 0 ? `赢利 $${num(d)}$ 元．` : d === 0 ? '收入恰好等于成本：<b>不赚不亏</b>（$x=40$）．' : `亏损 $${num(-d)}$ 元．`;
    tex($('bzBars')); tex(msg);
  };
  MathKit.slider($('bzX'), draw);
}

/* ---------- 第 5 页：出租车分段计费 ---------- */
const fare = (x) => (x <= 3 ? 7 : 2.4 * x - 0.2);
function initTaxi() {
  const s = { x: 8 };
  const b = board($('taxiBoard'), { x: [-0.8, 12.6], y: [-2.5, 30], w: 520, h: 300, ticks: [1, 5], labels: ['x/千米', 'y/元'] });
  b.fn(fare, { from: 0.0001, to: 12, cls: 'c1' });
  b.pt([0, 7], { r: 5, hollow: true });
  b.seg(() => [[s.x, 0], [s.x, fare(s.x)]], { cls: 'dash' });
  b.seg(() => [[0, fare(s.x)], [s.x, fare(s.x)]], { cls: 'dash' });
  b.drag(() => [s.x, fare(s.x)], (x) => { s.x = snap(clamp(x, 0.5, 12), 0.5); });
  b.onUpdate = () => {
    const msg = $('taxiMsg');
    msg.className = `tip feedback ${fare(s.x) === 19 ? 'fb-ok' : ''}`;
    msg.innerHTML = s.x <= 3
      ? `$x=${fmt(s.x)}$：不超过 3 千米，车费 $7$ 元．`
      : `$x=${fmt(s.x)}$：$y=7+2.4\\times(${fmt(s.x)}-3)=${fmt(fare(s.x))}$ 元${fare(s.x) === 19 ? '——正好 19 元！' : ''}`;
    tex(msg);
  };
  b.update();
}

/* ---------- 方案比较器：两条直线 + 拖动自变量 ---------- */
function comparer(cfg) {
  const s = { x: cfg.x0 };
  const [f1, f2] = cfg.fs;
  const b = board($(cfg.board), cfg.box);
  b.fn(f1, { cls: 'c1', from: 0, to: cfg.xmax });
  b.fn(f2, { cls: 'c2', from: 0, to: cfg.xmax });
  b.seg(() => [[s.x, 0], [s.x, Math.max(f1(s.x), f2(s.x))]], { cls: 'dash' });
  b.pt(() => [s.x, f1(s.x)], { cls: 'c1', r: 7 });
  b.pt(() => [s.x, f2(s.x)], { cls: 'c2', r: 7 });
  b.pt(cfg.cross, { r: 6 });
  b.seg([[cfg.cross[0], 0], cfg.cross], { cls: 'dash' });
  b.seg([[0, cfg.cross[1]], cfg.cross], { cls: 'dash' });
  cfg.labels.forEach(([p, t], i) => b.text(p, t, { cls: `lb up ${i ? 'o' : 'bl'}` }));
  b.drag(() => [s.x, 0], (x) => { s.x = snap(clamp(x, 0, cfg.xmax), cfg.step); });
  b.onUpdate = () => {
    const [y1, y2] = [f1(s.x), f2(s.x)];
    const max = Math.max(f1(cfg.xmax), f2(cfg.xmax));
    const col = (me, other) => (me < other ? '#2f7d6b' : me > other ? '#c9d3dc' : '#4f9bd0');
    const row = (name, v, o) => `<span>${name}</span><span class="bar"><i style="width:${(100 * v) / max}%;background:${col(v, o)}"></i></span><span class="v">${plain(v)} 元</span>`;
    if (cfg.bars) { $(cfg.bars).innerHTML = row(cfg.names[0], y1, y2) + row(cfg.names[1], y2, y1); tex($(cfg.bars)); }
    const msg = $(cfg.msg);
    if (!msg) return;
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$x=${num(s.x)}$：${y1 < y2 ? cfg.say[0] : y1 > y2 ? cfg.say[2] : cfg.say[1]}`;
    tex(msg);
  };
  b.update();
}

/* ---------- 第 8 页：图像讲故事（图 6-15） ---------- */
const STORY = [[0, 0], [8, 2], [14, 2], [24, 0]];
function storyAt(x) {
  const i = clamp(STORY.findIndex(([a], k) => k > 0 && x <= a) - 1, 0, 2);
  const [[x0, y0], [x1, y1]] = [STORY[i], STORY[i + 1]];
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}
function initStory() {
  const s = { x: 0, timer: 0 };
  const b = board($('storyBoard'), { x: [-1.5, 26], y: [-0.35, 2.6], w: 560, h: 260, ticks: [2, 0.5], labels: ['x', 'y'] });
  b.fn(storyAt, { from: 0, to: 24, cls: 'c1' });
  [8, 14].forEach((a) => b.seg([[a, 0], [a, 2]], { cls: 'dash' }));
  b.seg(() => [[s.x, 0], [s.x, storyAt(s.x)]], { cls: 'dash' });
  b.drag(() => [s.x, storyAt(s.x)], (x) => { s.x = snap(clamp(x, 0, 24), 0.5); sync(); });
  const road = () => {
    const y = storyAt(s.x);
    const X = (km) => 40 + km * 220; // 2 km 画成 440 px
    const phase = s.x < 8 ? '去：250 m/min' : s.x <= 14 ? '休息' : '返回：200 m/min';
    $('roadSvg').innerHTML = `<line x1="${X(0)}" x2="${X(2)}" y1="40" y2="40" stroke="#9fb0bf" stroke-width="6" stroke-linecap="round"/>`
      + [0, 0.5, 1, 1.5, 2].map((k) => `<line x1="${X(k)}" x2="${X(k)}" y1="46" y2="52" stroke="#6f8191"/><text x="${X(k)}" y="66" font-size="13" text-anchor="middle" fill="#6f8191">${k} km</text>`).join('')
      + `<text x="${X(0)}" y="22" font-size="13" fill="#556575">出发地</text><text x="${X(2)}" y="22" font-size="13" text-anchor="middle" fill="#556575">某地</text>`
      + `<circle cx="${X(y)}" cy="40" r="10" fill="#d9711c"/><text x="${X(1)}" y="20" font-size="15" text-anchor="middle" fill="#9a4a0b">${phase}</text>`;
    $('storyXV').textContent = fmt(s.x);
  };
  const sync = () => { $('storyX').value = s.x; road(); };
  b.onUpdate = road;
  MathKit.slider($('storyX'), (v) => { s.x = v; b.update(); });
  $('storyPlay').addEventListener('click', () => {
    cancelAnimationFrame(s.timer);
    const t0 = performance.now();
    const tick = (t) => {
      s.x = Math.min(24, ((t - t0) / 1000) * 3); // 每秒 3 min，8 秒播完
      $('storyX').value = s.x;
      b.update();
      if (s.x < 24) s.timer = requestAnimationFrame(tick);
    };
    s.timer = requestAnimationFrame(tick);
  });
  b.update();
}

/* ---------- 第 10 页：A、P、B、C 按比例 ---------- */
function drawABC() {
  const X = (km) => 30 + km * 2.6; // 310 km 画成 806 px
  const st = [['A', 0], ['P', 10], ['B', 250], ['C', 310]];
  $('abcSvg').innerHTML = `<line x1="${X(0)}" x2="${X(310)}" y1="40" y2="40" stroke="#1f2d3a" stroke-width="2.5"/>`
    + st.map(([n, k]) => `<circle cx="${X(k)}" cy="40" r="5" fill="#c0392b"/><text x="${X(k)}" y="${n === 'P' ? 66 : 28}" font-size="18" font-style="italic" font-family="Times New Roman, serif" text-anchor="middle" fill="#1f2d3a">${n}</text>`).join('')
    + `<text x="${X(5)}" y="74" font-size="13" text-anchor="middle" fill="#556575" dx="34">10 km</text><text x="${X(130)}" y="66" font-size="14" text-anchor="middle" fill="#556575">250 km</text><text x="${X(280)}" y="66" font-size="14" text-anchor="middle" fill="#556575">60 km</text>`;
}

window.LESSON = {
  init() {
    initSnow();
    initBreakEven();
    initTaxi();
    comparer({
      board: 'cmpBoard', bars: 'cmpBars', msg: 'cmpMsg', x0: 1000, xmax: 4500, step: 100, cross: [2000, 2000],
      fs: [(x) => x, (x) => 0.5 * x + 1000], names: ['甲 $y_1$', '乙 $y_2$'],
      box: { x: [-450, 4900], y: [-350, 4700], w: 520, h: 460, ticks: [1000, 1000], labels: ['x', 'y'] },
      labels: [[[3600, 4500], 'y₁ = k₁x'], [[3700, 2650], 'y₂ = k₂x + 1000']],
      say: ['<b>甲公司</b>的租车费少．', '两家公司的租车费<b>相等</b>．', '<b>乙公司</b>的租车费少．'],
    });
    comparer({
      board: 'vegBoard', x0: 60, xmax: 200, step: 5, cross: [100, 650],
      fs: [(x) => 4.5 * x + 200, (x) => 2.4 * x + 410],
      box: { x: [-20, 220], y: [-90, 1200], w: 520, h: 300, ticks: [20, 200], labels: ['x', 'y'] },
      labels: [[[150, 1150], '汽车 y₁'], [[165, 690], '火车 y₂']],
      say: ['', '', ''],
    });
    initStory();
    drawABC();
  },
};
