'use strict';
/* 九下 8.5 概率帮你做估计 · 本课互动：
 * 神秘袋子摸球（球数随机设定、真随机有放回摸球、每组 20 次 / 全班 400 次，估计白∶红后揭晓）；
 * 鱼塘捉—放—捉（青鱼条数随机，放 60 条白鱼，每网随机捞 50 条，频率 → 解方程估计 N）；撒米估计 π（正方形内真随机投点）。
 * 随机数取自 crypto.getRandomValues。 */
const $ = (id) => document.getElementById(id);

function randInt(n) {
  const buf = new Uint32Array(1);
  const lim = Math.floor(0x100000000 / n) * n;
  do crypto.getRandomValues(buf); while (buf[0] >= lim);
  return buf[0] % n;
}
const rand = () => { const b = new Uint32Array(1); crypto.getRandomValues(b); return b[0] / 0x100000000; };
const tex = (el) => MathKit.tex(el);

/* ---------- 第 3 页：神秘袋子 ---------- */
const BAGS = [[1, 3], [2, 3], [3, 5], [1, 4], [3, 2], [2, 5]];
function initBag() {
  const st = { bag: BAGS[randInt(BAGS.length)], w: 0, n: 0, groups: 0, last: [], shown: false };
  const drawSvg = () => {
    let h = '<path d="M30 40 Q20 140 90 140 H150 Q220 140 210 40 Q170 20 120 30 Q70 20 30 40Z" fill="#6f5a8a"/><path d="M60 36 Q120 10 180 36" fill="none" stroke="#4b3c60" stroke-width="6"/>';
    h += `<text x="120" y="95" text-anchor="middle" font-size="40" fill="#fff">?</text>`;
    if (st.shown) h = h.replace('>?<', `>${st.bag[0]}白${st.bag[1]}红<`).replace('font-size="40"', 'font-size="26"');
    st.last.forEach((c, i) => {
      const x = 250 + (i % 10) * 26;
      const y = 50 + Math.floor(i / 10) * 30;
      h += `<circle cx="${x}" cy="${y}" r="11" fill="${c ? '#fff' : '#d23b3b'}" stroke="#556575" stroke-width="1.5"/>`;
    });
    if (st.last.length) h += '<text x="250" y="122" font-size="15" fill="#556575">最近一组的 20 次结果</text>';
    $('bagSvg').innerHTML = h;
  };
  const render = () => {
    const f = (x) => (st.n ? (x / st.n).toFixed(3) : '');
    $('bagTab').innerHTML = '<tr><th>球的颜色</th><th>白色</th><th>红色</th></tr>'
      + `<tr><th>频数</th><td>${st.n ? st.w : ''}</td><td>${st.n ? st.n - st.w : ''}</td></tr>`
      + `<tr><th>频率</th><td>${f(st.w)}</td><td>${f(st.n - st.w)}</td></tr>`;
    const msg = $('bagMsg');
    if (!st.n) { msg.className = 'tip feedback'; msg.textContent = '袋子里有几个白球、几个红球？先摸摸看。'; } else {
      const fw = st.w / st.n;
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = `已摸 ${st.groups} 组共 ${st.n} 次，摸到白球的频率约 ${fw.toFixed(3)}，估计 白球数∶红球数 ≈ ${fw.toFixed(2)}∶${(1 - fw).toFixed(2)}`
        + (fw > 0 && fw < 1 ? ` ≈ 1∶${((1 - fw) / fw).toFixed(2)}` : '') + '．'
        + (st.shown ? `<br>实际：白 ${st.bag[0]} 个、红 ${st.bag[1]} 个，白∶红 = 1∶${(st.bag[1] / st.bag[0]).toFixed(2)}，$P(\\text{白})=\\dfrac{${st.bag[0]}}{${st.bag[0] + st.bag[1]}}\\approx${(st.bag[0] / (st.bag[0] + st.bag[1])).toFixed(3)}$．` : '');
      tex(msg);
    }
    drawSvg();
  };
  const group = () => {
    const p = st.bag[0] / (st.bag[0] + st.bag[1]);
    const total = st.bag[0] + st.bag[1];
    st.last = Array.from({ length: 20 }, () => randInt(total) < st.bag[0]);
    st.w += st.last.filter(Boolean).length;
    st.n += 20;
    st.groups += 1;
    return p;
  };
  $('bag20').addEventListener('click', () => { if (st.groups < 20) group(); render(); });
  $('bagAll').addEventListener('click', () => { while (st.groups < 20) group(); render(); });
  $('bagNew').addEventListener('click', () => { Object.assign(st, { bag: BAGS[randInt(BAGS.length)], w: 0, n: 0, groups: 0, last: [], shown: false }); render(); });
  $('bagShow').addEventListener('click', () => { st.shown = true; render(); });
  render();
}

/* ---------- 第 5 页：鱼塘 ---------- */
function initPond() {
  const cv = $('pond');
  const ctx = cv.getContext('2d');
  const W = cv.width;
  const H = cv.height;
  const st = {};
  const spot = () => {
    // 椭圆形鱼塘内的均匀随机点
    for (;;) {
      const x = rand() * 2 - 1;
      const y = rand() * 2 - 1;
      if (x * x + y * y <= 1) return [W / 2 + x * (W / 2 - 30), H / 2 + y * (H / 2 - 24), rand() < 0.5 ? 1 : -1];
    }
  };
  const reset = () => {
    const N = 800 + randInt(1201);
    Object.assign(st, { N, green: Array.from({ length: N }, spot), white: [], nets: 0, caught: 0, cw: 0, hit: [], shown: false });
  };
  const fish = ([x, y, d], color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, 7, 3.2, 0, 0, 2 * Math.PI);
    ctx.moveTo(x - 6 * d, y);
    ctx.lineTo(x - 11 * d, y - 3.5);
    ctx.lineTo(x - 11 * d, y + 3.5);
    ctx.fill();
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#9fcbdc';
    ctx.beginPath();
    ctx.ellipse(W / 2, H / 2, W / 2 - 8, H / 2 - 8, 0, 0, 2 * Math.PI);
    ctx.fill();
    st.green.forEach((p) => fish(p, '#3f6b4f'));
    st.white.forEach((p) => fish(p, '#ffffff'));
    ctx.strokeStyle = '#f2c230';
    ctx.lineWidth = 2.5;
    st.hit.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 11, 0, 2 * Math.PI); ctx.stroke(); });
  };
  const read = () => {
    const f = st.caught ? st.cw / st.caught : 0;
    let h = `<p>鱼塘里：青鱼 <b>${st.shown ? st.N : '?'}</b> 条${st.white.length ? '，白鱼 60 条' : ''}</p>`;
    h += st.nets ? `<p>已捞 ${st.nets} 网，共 ${st.caught} 条，其中白鱼 ${st.cw} 条，频率 $\\dfrac{${st.cw}}{${st.caught}}\\approx${f.toFixed(4)}$</p>` : '<p>先放白鱼，再捕捞．</p>';
    if (st.cw) h += `<p>由 $\\dfrac{60}{N+60}\\approx${f.toFixed(4)}$ 得 $N\\approx${Math.round(60 / f - 60)}$ 条</p>`;
    else if (st.nets) h += '<p>还没捞到白鱼，多捞几网．</p>';
    if (st.shown && st.cw) h += `<p>实际 ${st.N} 条，估计误差 ${(((60 / f - 60) - st.N) / st.N * 100).toFixed(1)}%</p>`;
    $('pondRead').innerHTML = h;
    tex($('pondRead'));
  };
  const net = () => {
    const total = st.N + 60;
    const idx = new Set();
    while (idx.size < 50) idx.add(randInt(total));
    const all = [...idx];
    const w = all.filter((i) => i >= st.N).length;
    st.nets += 1;
    st.caught += 50;
    st.cw += w;
    st.hit = all.map((i) => (i >= st.N ? st.white[i - st.N] : st.green[i]));
  };
  $('pondPut').addEventListener('click', () => { if (!st.white.length) st.white = Array.from({ length: 60 }, spot); st.hit = []; draw(); read(); });
  $('pondNet').addEventListener('click', () => { if (!st.white.length) return; net(); draw(); read(); });
  $('pondNet10').addEventListener('click', () => { if (!st.white.length) return; for (let k = 0; k < 20; k++) net(); draw(); read(); });
  $('pondNew').addEventListener('click', () => { reset(); draw(); read(); });
  $('pondShow').addEventListener('click', () => { st.shown = true; read(); });
  reset();
  draw();
  read();
}

/* ---------- 第 8 页：撒米估计 π ---------- */
function initPi() {
  const cv = $('piCanvas');
  const ctx = cv.getContext('2d');
  const S = cv.width;
  let n = 0;
  let m = 0;
  const frame = () => {
    ctx.clearRect(0, 0, S, S);
    ctx.strokeStyle = '#1f2d3a';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, S - 3, S - 3);
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, S / 2 - 1.5, 0, 2 * Math.PI);
    ctx.stroke();
  };
  const read = () => {
    $('piRead').innerHTML = n
      ? `<p>正方形内 $n=${n}$ 粒，圆内 $m=${m}$ 粒，$\\dfrac mn\\approx${(m / n).toFixed(4)}$</p><p>$\\pi\\approx\\dfrac{4m}{n}\\approx${(4 * m / n).toFixed(4)}$（与 3.141 6 相差 ${Math.abs(4 * m / n - Math.PI).toFixed(4)}）</p>`
      : '<p>点按钮撒米．$\\dfrac{\\pi}{4}\\approx0.785\\,4$．</p>';
    tex($('piRead'));
  };
  const throwRice = (k) => {
    const r = k > 2000 ? 1.6 : 2.6;
    for (let i = 0; i < k; i++) {
      const x = rand() * 30;
      const y = rand() * 30;
      const inC = (x - 15) ** 2 + (y - 15) ** 2 <= 225;
      n += 1;
      if (inC) m += 1;
      ctx.fillStyle = inC ? '#d9711c' : '#8a98a6';
      ctx.beginPath();
      ctx.arc((x / 30) * S, (y / 30) * S, r, 0, 2 * Math.PI);
      ctx.fill();
    }
    read();
  };
  $('pi100').addEventListener('click', () => throwRice(100));
  $('pi1000').addEventListener('click', () => throwRice(1000));
  $('pi10000').addEventListener('click', () => throwRice(10000));
  $('piClr').addEventListener('click', () => { n = 0; m = 0; frame(); read(); });
  frame();
  read();
}

window.LESSON = {
  init() {
    initBag();
    initPond();
    initPi();
  },
};
