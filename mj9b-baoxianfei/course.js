'use strict';
/* 九下 8.6 收取多少保险费才合理 · 本课互动：
 * 平均次数模拟（奖券 100 张一组 p=0.01 / 罚球 10 次一组 p=0.8，真随机，各组次数分布 + 平均数 vs n×P）；
 * 保险公司账本（保险费滑块 + 失事概率，10 万次航班真随机，累计盈亏折线与平均盈亏虚线）；孟德尔豌豆随机授粉。
 * 随机数取自 crypto.getRandomValues。 */
const $ = (id) => document.getElementById(id);
const tex = (el) => MathKit.tex(el);

const BUF = new Uint32Array(4096);
let bi = BUF.length;
const rand = () => { if (bi >= BUF.length) { crypto.getRandomValues(BUF); bi = 0; } return BUF[bi++] / 0x100000000; };

/* ---------- 第 3 页：平均发生次数 ---------- */
const CASES = [
  { name: '奖券：100 张一组，中奖概率 0.01', n: 100, p: 0.01, unit: '张中奖', max: 7 },
  { name: '罚球：10 次一组，命中概率 0.8', n: 10, p: 0.8, unit: '次投中', max: 10 },
];
function initAvg() {
  const st = { c: 0, counts: [], last: [] };
  $('avgCase').innerHTML = CASES.map((c, i) => `<button class="btn" type="button" data-k="${i}">${c.name}</button>`).join('');
  const render = () => {
    const C = CASES[st.c];
    $('avgCase').querySelectorAll('.btn').forEach((b) => b.classList.toggle('on', +b.dataset.k === st.c));
    const hist = Array(C.max + 1).fill(0);
    st.counts.forEach((k) => { hist[Math.min(k, C.max)] += 1; });
    const G = st.counts.length;
    const top = Math.max(...hist, 1);
    const L = 50; const B = 230; const T = 30; const bw = (540 - L) / (C.max + 1);
    let h = `<line x1="${L}" y1="${B}" x2="550" y2="${B}" stroke="#6f8191" stroke-width="2"/><text x="${L}" y="18" font-size="15" fill="#556575">组数</text>`;
    hist.forEach((v, k) => {
      const x = L + k * bw;
      const hh = (v / top) * (B - T);
      const mean = Math.round(C.n * C.p);
      h += `<rect x="${x + 4}" y="${B - hh}" width="${bw - 8}" height="${hh}" fill="${k === mean ? '#d9711c' : '#4f9bd0'}"/>`
        + `<text x="${x + bw / 2}" y="${B + 20}" text-anchor="middle" font-size="16">${k === C.max && C.max < C.n ? `${k}+` : k}</text>`
        + (v ? `<text x="${x + bw / 2}" y="${B - hh - 6}" text-anchor="middle" font-size="14">${v}</text>` : '');
    });
    h += `<text x="550" y="${B + 42}" text-anchor="end" font-size="15" fill="#556575">每组${C.unit}的个数</text>`;
    $('avgSvg').innerHTML = h;
    const avg = G ? st.counts.reduce((s, k) => s + k, 0) / G : 0;
    $('avgRead').innerHTML = G
      ? `<p>已模拟 ${G} 组．最近几组：${st.last.join('，')}</p><p>平均每组 <b>${avg.toFixed(3)}</b> ${C.unit}；$n\\times P(A)=${C.n}\\times${C.p}=${+(C.n * C.p).toFixed(2)}$</p>`
        + `<p>恰好 ${Math.round(C.n * C.p)} ${C.unit}的组只占 ${((hist[Math.round(C.n * C.p)] / G) * 100).toFixed(1)}%</p>`
      : `<p>${C.name}．点“模拟”开始．</p>`;
    tex($('avgRead'));
  };
  const sim = (g) => {
    const C = CASES[st.c];
    for (let i = 0; i < g; i++) {
      let k = 0;
      for (let j = 0; j < C.n; j++) if (rand() < C.p) k += 1;
      st.counts.push(k);
      st.last = [...st.last, k].slice(-10);
    }
    render();
  };
  $('avgCase').addEventListener('click', (e) => { const t = e.target.closest('button'); if (t) { st.c = +t.dataset.k; st.counts = []; st.last = []; render(); } });
  $('avg10').addEventListener('click', () => sim(10));
  $('avg1000').addEventListener('click', () => sim(1000));
  $('avgClr').addEventListener('click', () => { st.counts = []; st.last = []; render(); });
  render();
}

/* ---------- 第 6 页：保险公司账本 ---------- */
const PS = [0.00005, 0.00001, 0.000001];
const FLIGHTS = 100000;
const STEP = 1000;
const PAY = 400000 * 100; // 每次失事赔偿（元）
function initBook() {
  const st = { x: 20, p: PS[0], runs: [] };
  $('pBtns').innerHTML = '<span class="muted">失事概率 $p$：</span>' + PS.map((p, i) => `<button class="btn" type="button" data-k="${i}">${i ? '' : '课本 '}${p.toFixed(6).replace(/0+$/, '')}</button>`).join('');
  tex($('pBtns'));
  const draw = () => {
    const exp = (k) => k * 100 * (st.x - 400000 * st.p); // k 次航班的平均盈亏（元）
    const all = st.runs.flatMap((r) => r.path);
    const yi = [...all, exp(0), exp(FLIGHTS), 0].map((v) => v / 1e8);
    const lo = Math.min(...yi) - 0.3;
    const hi = Math.max(...yi) + 0.3;
    const L = 60; const R = 590; const T = 20; const B = 260;
    const X = (k) => L + (k / FLIGHTS) * (R - L);
    const Y = (v) => B - ((v / 1e8 - lo) / (hi - lo)) * (B - T);
    const stp = (hi - lo) > 6 ? 2 : (hi - lo) > 2.5 ? 1 : 0.5;
    let h = '';
    for (let v = Math.ceil(lo / stp) * stp; v <= hi; v += stp) h += `<line x1="${L}" x2="${R}" y1="${Y(v * 1e8)}" y2="${Y(v * 1e8)}" stroke="${Math.abs(v) < 1e-9 ? '#6f8191' : '#e3eaf0'}" stroke-width="${Math.abs(v) < 1e-9 ? 2 : 1}"/><text x="${L - 6}" y="${Y(v * 1e8) + 5}" text-anchor="end" font-size="14">${+v.toFixed(1)}</text>`;
    h += `<text x="${L}" y="14" font-size="14" fill="#556575">累计盈亏/亿元</text>`;
    [0, 25000, 50000, 75000, 100000].forEach((k) => { h += `<text x="${X(k)}" y="${B + 20}" text-anchor="middle" font-size="13">${k ? `${k / 10000} 万` : 0}</text>`; });
    h += `<text x="${R}" y="${B + 38}" text-anchor="end" font-size="13" fill="#556575">航班次数</text>`;
    h += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(FLIGHTS)}" y2="${Y(exp(FLIGHTS))}" stroke="#c0392b" stroke-width="2" stroke-dasharray="7 5"/>`;
    st.runs.forEach((r, i) => {
      const last = i === st.runs.length - 1;
      h += `<polyline points="${r.path.map((v, j) => `${X(j * STEP).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="${last ? '#1d6fa5' : '#b9c4ce'}" stroke-width="${last ? 2.5 : 1.5}"/>`;
    });
    $('bookSvg').innerHTML = h;
    const r = st.runs[st.runs.length - 1];
    const e = exp(FLIGHTS);
    let t = `<p>$x=${st.x}$ 元，$p=${st.p}$：10 万次航班平均失事 $np=${+(FLIGHTS * st.p).toFixed(2)}$ 次，平均盈亏 ${(e / 1e8).toFixed(2)} 亿元（红虚线）</p>`;
    if (r) t += `<p>本次模拟：失事 <b>${r.crash}</b> 次，收入 ${(r.inc / 1e8).toFixed(2)} 亿元，赔偿 ${(r.crash * PAY / 1e8).toFixed(2)} 亿元，<b>${r.path[r.path.length - 1] >= 0 ? '盈利' : '亏损'} ${Math.abs(r.path[r.path.length - 1] / 1e8).toFixed(2)} 亿元</b></p>`;
    if (st.runs.length > 1) t += `<p>已模拟 ${st.runs.length} 次，平均盈亏 ${(st.runs.reduce((s, q) => s + q.path[q.path.length - 1], 0) / st.runs.length / 1e8).toFixed(2)} 亿元</p>`;
    $('bookRead').innerHTML = t;
    tex($('bookRead'));
    $('pBtns').querySelectorAll('.btn').forEach((b) => b.classList.toggle('on', PS[+b.dataset.k] === st.p));
  };
  const run = () => {
    let cum = 0;
    let crash = 0;
    const path = [0];
    for (let k = 1; k <= FLIGHTS; k++) {
      cum += 100 * st.x;
      if (rand() < st.p) { cum -= PAY; crash += 1; }
      if (k % STEP === 0) path.push(cum);
    }
    st.runs = [...st.runs, { path, crash, inc: 100 * st.x * FLIGHTS }].slice(-6);
    draw();
  };
  MathKit.slider($('xSlide'), (v) => { st.x = v; $('xVal').textContent = `${v} 元`; st.runs = []; draw(); });
  $('pBtns').addEventListener('click', (e) => { const t = e.target.closest('button'); if (t) { st.p = PS[+t.dataset.k]; st.runs = []; draw(); } });
  $('bookRun').addEventListener('click', run);
  $('bookClr').addEventListener('click', () => { st.runs = []; draw(); });
  draw();
}

/* ---------- 第 9 页：豌豆 ---------- */
function initPea() {
  const HIST = [141, 291, 132];
  let sim = null;
  const draw = () => {
    const names = ['白花', '粉红花', '红花'];
    const col = ['#d8d8d8', '#f5a6d4', '#e84a3c'];
    const B = 200; const T = 20; const top = 320;
    const Y = (v) => B - (v / top) * (B - T);
    let h = `<line x1="40" y1="${B}" x2="550" y2="${B}" stroke="#6f8191" stroke-width="2"/>`;
    [100, 200, 300].forEach((v) => { h += `<line x1="40" x2="550" y1="${Y(v)}" y2="${Y(v)}" stroke="#e3eaf0"/><text x="34" y="${Y(v) + 5}" text-anchor="end" font-size="13">${v}</text>`; });
    h += `<line x1="40" x2="550" y1="${Y(141)}" y2="${Y(141)}" stroke="#c0392b" stroke-dasharray="5 4"/><line x1="40" x2="550" y1="${Y(282)}" y2="${Y(282)}" stroke="#c0392b" stroke-dasharray="5 4"/>`
      + `<text x="550" y="${Y(282) - 5}" text-anchor="end" font-size="13" fill="#c0392b">564×2/4=282</text><text x="550" y="${Y(141) - 5}" text-anchor="end" font-size="13" fill="#c0392b">564×1/4=141</text>`;
    names.forEach((n, i) => {
      const x = 70 + i * 165;
      h += `<rect x="${x}" y="${Y(HIST[i])}" width="55" height="${B - Y(HIST[i])}" fill="${col[i]}" stroke="#1f2d3a"/><text x="${x + 27}" y="${Y(HIST[i]) - 5}" text-anchor="middle" font-size="14">${HIST[i]}</text>`;
      if (sim) h += `<rect x="${x + 60}" y="${Y(sim[i])}" width="55" height="${B - Y(sim[i])}" fill="${col[i]}" opacity=".45" stroke="#1f2d3a" stroke-dasharray="4 3"/><text x="${x + 87}" y="${Y(sim[i]) - 5}" text-anchor="middle" font-size="14">${sim[i]}</text>`;
      h += `<text x="${x + 57}" y="${B + 22}" text-anchor="middle" font-size="16">${n}</text>`;
    });
    h += `<text x="40" y="${B + 44}" font-size="13" fill="#556575">左：史料记载　右：本次模拟</text>`;
    $('peaSvg').innerHTML = h;
    $('peaMsg').className = `tip feedback${sim ? ' fb-ok' : ''}`;
    $('peaMsg').textContent = sim ? `本次模拟：白 ${sim[0]}、粉红 ${sim[1]}、红 ${sim[2]}，约为 ${(sim[0] / sim[2]).toFixed(2)}∶${(sim[1] / sim[2]).toFixed(2)}∶1．` : '每株从两个 WR 亲本各随机得到一个基因．';
  };
  $('peaRun').addEventListener('click', () => {
    sim = [0, 0, 0];
    for (let i = 0; i < 564; i++) { const r = (rand() < 0.5 ? 1 : 0) + (rand() < 0.5 ? 1 : 0); sim[r] += 1; }
    draw();
  });
  $('peaClr').addEventListener('click', () => { sim = null; draw(); });
  draw();
}

window.LESSON = {
  init() {
    initAvg();
    initBook();
    initPea();
  },
};
