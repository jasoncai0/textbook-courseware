'use strict';
/* 八下 课题学习 心率的调查 · 本课互动：脉搏计时测量器、个人三次平均、全班数据输入与清洗、
 * 组距/起点可调的频数分布表 + 直方图（核心）、按当前数据自动生成的分布分析。频数全部由数据逐个计算。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* 示例数据：为演示编写的 40 个安静心率（次/分），不是真实调查结果 */
const SAMPLE = [78, 82, 75, 88, 71, 84, 79, 92, 68, 80, 76, 85, 73, 81, 90, 77, 83, 66, 87, 79,
  74, 86, 80, 95, 72, 81, 78, 84, 69, 88, 77, 82, 91, 75, 80, 85, 73, 79, 83, 98];
const LO = 40; const HI = 200; // 明显不合理的范围
const st = { data: [...SAMPLE], sorted: false, w: 5, start: 64.5 };
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const defaultStart = (w) => Math.floor(Math.min(...st.data) / w) * w - 0.5;

/** 从 start 起按组距 w 分组 */
function groups(w, start) {
  const max = Math.max(...st.data);
  const k = Math.max(1, Math.ceil((max - start) / w));
  return Array.from({ length: k }, (_, i) => {
    const a = start + i * w;
    return { a, b: a + w, c: st.data.filter((x) => x > a && x < a + w).length };
  });
}

/* ---------- 第 3 页：测量器 ---------- */
function initMeter() {
  const m = { run: false, n: 0, t0: 0, T: 30 };
  const msg = (h, cls = '') => { $('pmMsg').className = `tip feedback ${cls}`; $('pmMsg').innerHTML = h; };
  const tick = (now) => {
    if (!m.run) return;
    const t = (now - m.t0) / 1000;
    if (t >= m.T) {
      m.run = false;
      $('pmClock').textContent = m.T.toFixed(1);
      $('pmStart').textContent = '再测一次';
      const k = 60 / m.T;
      msg(`${m.T} 秒内数到 <b>${m.n}</b> 次，心率 $=${m.n}\\times${k}=${m.n * k}$ 次/分．${m.n * k < 60 || m.n * k > 100 ? '（不在 60～100 次/分之间，可以静坐后再测一次）' : ''}`, 'fb-ok');
      tex($('pmMsg'));
      return;
    }
    $('pmClock').textContent = t.toFixed(1);
    requestAnimationFrame(tick);
  };
  $('pmStart').addEventListener('click', () => {
    m.T = +$('pmT').value; m.n = 0; m.run = true; m.t0 = performance.now();
    $('pmStart').textContent = '计时中…';
    msg('计时中：每跳一下，点一下 ♥（已数 0 次）');
    requestAnimationFrame(tick);
  });
  $('pmBeat').addEventListener('click', () => {
    $('pmBeat').classList.remove('pulse'); void $('pmBeat').offsetWidth; $('pmBeat').classList.add('pulse');
    if (!m.run) { msg('先点“开始计时”．'); return; }
    m.n += 1;
    msg(`计时中：每跳一下，点一下 ♥（已数 ${m.n} 次）`);
  });
}

/* ---------- 第 4 页：三次平均 ---------- */
function initRecord() {
  const run = () => {
    const rows = [...document.querySelectorAll('.rec3 .pc')];
    const v = rows.map((i) => +i.value * 2);
    rows.forEach((inp, i) => { inp.closest('tr').querySelector('.pr').textContent = Number.isFinite(v[i]) && inp.value !== '' ? v[i] : '—'; });
    const ok = rows.every((i) => i.value !== '' && +i.value > 0);
    $('pAvg').textContent = ok ? `${fmt(mean(v), 1)} 次/分` : '—';
  };
  document.querySelectorAll('.rec3 .pc').forEach((i) => i.addEventListener('input', run));
  run();
}

/* ---------- 第 5 页：全班数据 ---------- */
let refreshAll = () => {};
function initData() {
  const show = () => {
    const d = st.sorted ? [...st.data].sort((a, b) => a - b) : st.data;
    const mx = Math.max(...st.data); const mn = Math.min(...st.data);
    $('dgrid').innerHTML = d.map((v) => `<span class="${v === mx || v === mn ? 'on' : ''}">${v}</span>`).join('');
    $('stN').textContent = st.data.length; $('stMax').textContent = mx; $('stMin').textContent = mn;
    $('stR').textContent = mx - mn; $('stAvg').textContent = fmt(mean(st.data), 1);
  };
  const use = () => {
    const raw = $('dataIn').value.split(/[\s,，、;；]+/).filter(Boolean);
    const nums = raw.map(Number);
    const bad = raw.filter((x, i) => !Number.isInteger(nums[i]));
    const odd = nums.filter((v) => Number.isInteger(v) && (v < LO || v > HI));
    const good = nums.filter((v) => Number.isInteger(v) && v >= LO && v <= HI);
    const msg = $('dataMsg');
    if (good.length < 5) { msg.className = 'tip feedback fb-warn'; msg.textContent = '有效数据太少（至少 5 个整数），请检查输入．'; return; }
    st.data = good;
    st.start = defaultStart(st.w);
    msg.className = `tip feedback ${bad.length || odd.length ? 'fb-warn' : 'fb-ok'}`;
    msg.textContent = `已读入 ${good.length} 个数据．` + (bad.length ? `忽略了 ${bad.length} 个不是整数的输入（${bad.slice(0, 3).join('、')}）．` : '') + (odd.length ? `${odd.join('、')} 不在 ${LO}～${HI} 之间，请核对后再输入．` : '');
    show(); refreshAll();
  };
  $('dataIn').value = SAMPLE.join(' ');
  $('dataUse').addEventListener('click', use);
  $('dataReset').addEventListener('click', () => { $('dataIn').value = SAMPLE.join(' '); st.sorted = false; use(); });
  $('dataSort').addEventListener('click', () => { st.sorted = !st.sorted; $('dataSort').textContent = st.sorted ? '恢复原来顺序' : '从小到大排一排'; show(); });
  $('dataMsg').className = 'tip feedback';
  $('dataMsg').textContent = '最大值、最小值已用颜色标出．';
  show();
}

/* ---------- 直方图 ---------- */
function drawHist(host, gs, o = {}) {
  host.innerHTML = '';
  const w = gs[0].b - gs[0].a;
  const lo = Math.min(gs[0].a, o.lo ?? Infinity); const hi = Math.max(gs[gs.length - 1].b, o.hi ?? -Infinity);
  const ymax = Math.max(4, ...gs.map((g) => g.c));
  const ty = ymax > 12 ? 4 : 2;
  const span = hi - lo;
  const b = board(host, { x: [lo - span * 0.12, hi + span * 0.16], y: [-ymax * 0.16, ymax * 1.18], w: 560, h: 330, ticks: [0, ty], labels: ['心率', '人数'] });
  [...b.svg.querySelectorAll('text.tk')].filter((t) => t.textContent === 'O').forEach((t) => t.remove());
  if (o.band) b.poly([[o.band[0], 0], [o.band[1], 0], [o.band[1], ymax * 1.1], [o.band[0], ymax * 1.1]], { cls: 'band' });
  gs.forEach((g) => {
    if (g.c > 0) b.poly([[g.a, 0], [g.b, 0], [g.b, g.c], [g.a, g.c]], { cls: 'hbar' });
    if (g.c > 0) b.text([(g.a + g.b) / 2, g.c], String(g.c), { cls: 'sval', dy: -5 });
  });
  const every = Math.ceil((gs.length + 1) / 9);
  [...gs.map((g) => g.a), gs[gs.length - 1].b].forEach((x, i) => { if (i % every === 0) b.text([x, 0], fmt(x, 1), { cls: 'scat edge', dy: 18 }); });
  b.update();
  return b;
}

/* ---------- 第 6 页：分组 ---------- */
let hostsOnSlide = [];
function initGroups() {
  const render = () => {
    const gs = groups(st.w, st.start);
    const n = st.data.length;
    $('gStart').textContent = fmt(st.start, 1);
    $('ftab').innerHTML = '<tr><th>分组（次/分）</th><th>划记</th><th>频数</th><th>频率</th></tr>'
      + gs.map((g) => `<tr><td>${fmt(g.a, 1)}～${fmt(g.b, 1)}</td><td class="tl">${MStat.tally(g.c)}</td><td>${g.c}</td><td>${fmt((g.c / n) * 100, 1)}%</td></tr>`).join('')
      + `<tr class="on"><td>合计</td><td></td><td>${gs.reduce((s, g) => s + g.c, 0)}</td><td>100%</td></tr>`;
    drawHist($('hist'), gs);
    const r = Math.max(...st.data) - Math.min(...st.data);
    $('gMsg').innerHTML = `极差 ${r}，组距 ${st.w}：$${r}\\div${st.w}=${fmt(r / st.w, 2)}$，分成 <b>${gs.length}</b> 组．${gs.length > 10 ? '组数偏多，图显得零碎．' : gs.length < 5 ? '组数偏少，看不出分布特点．' : ''}`;
    tex($('gMsg'));
  };
  $('gW').addEventListener('change', () => { st.w = +$('gW').value; st.start = defaultStart(st.w); render(); });
  const shift = (d) => { const mn = Math.min(...st.data); const s2 = st.start + d; if (s2 < mn && s2 > mn - st.w) { st.start = s2; render(); } };
  $('gDown').addEventListener('click', () => shift(-1));
  $('gUp').addEventListener('click', () => shift(1));
  st.start = defaultStart(st.w);
  return render;
}

/* ---------- 第 7 页：分析 ---------- */
function initAnalysis() {
  return () => {
    const gs = groups(5, defaultStart(5));
    drawHist($('hist2'), gs, { band: [60, 100], lo: 57.5, hi: 102.5 });
    const n = st.data.length;
    const top = gs.reduce((m, g) => (g.c > m.c ? g : m), gs[0]);
    const iTop = gs.indexOf(top);
    const norm = st.data.filter((v) => v >= 60 && v <= 100).length;
    const avg = mean(st.data);
    const left = gs.slice(0, iTop).reduce((s, g) => s + g.c, 0);
    const right = gs.slice(iTop + 1).reduce((s, g) => s + g.c, 0);
    $('anTop').querySelector('.think-a').innerHTML = `${fmt(top.a, 1)}～${fmt(top.b, 1)}（${top.c} 人）`;
    $('anNorm').querySelector('.think-a').innerHTML = `${norm} 人，约 ${fmt((norm / n) * 100, 1)}%`;
    $('anShape').querySelector('.think-a').innerHTML = iTop > 0 && iTop < gs.length - 1 && Math.abs(left - right) <= n * 0.2
      ? '中间高、两边低' : `偏向${left > right ? '较低' : '较高'}的一侧`;
    $('anAvg').querySelector('.think-a').innerHTML = `平均约 ${fmt(avg, 1)}，${Math.abs(avg - 75) <= 3 ? '与 75 接近' : avg > 75 ? '略高于 75' : '略低于 75'}`;
  };
}

window.LESSON = {
  init() {
    initMeter(); initRecord();
    const g = initGroups();
    const a = initAnalysis();
    refreshAll = () => { g(); a(); };
    initData();
    hostsOnSlide = [$('hist'), $('hist2')];
  },
  onRender(slide) { if (hostsOnSlide.some((h) => slide.contains(h))) refreshAll(); },
};
