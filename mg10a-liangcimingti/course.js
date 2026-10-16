'use strict';
/* 高一上 2.3 全称量词命题与存在量词命题 · 本课互动：例 1 量词判真（数轴上看 p(x) 成立的范围，可换集合 M）、“水生动物”Venn 图的否定。通用部分见 ../shared/math.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

const R2 = 2 * Math.SQRT2; // x² = 8 的正根 2√2（无理数）
const DOMS = {
  R: { t: '\\R', has: () => true },
  Q: { t: '\\mathbf Q', has: () => true }, // 数轴上有理数处处稠密，图与 R 相同；只在无理数点上有区别
  Z: { t: '\\mathbf Z', has: (x) => Number.isInteger(x) },
  G: { t: '(1,+\\infty)', has: (x) => x > 1 },
};
// 每个命题在每个集合上的真假与理由（逐一核对过）
const PROPS = [
  { q: '\\exists', p: 'x^2\\gt x', f: (x) => x * x > x, def: 'R', show: (x) => `$x^2=${fmt(x * x)}$，$x=${fmt(x)}$`,
    res: { R: [true, '$x=2$ 时 $4\\gt 2$，找到一个就够。'], Q: [true, '$x=2\\in\\mathbf Q$ 就行。'], Z: [true, '$x=2\\in\\mathbf Z$ 就行。'], G: [true, '$x=2\\in(1,+\\infty)$ 就行。'] } },
  { q: '\\forall', p: 'x^2\\gt x', f: (x) => x * x > x, def: 'R', show: (x) => `$x^2=${fmt(x * x)}$，$x=${fmt(x)}$`,
    res: { R: [false, '反例 $x=0$：$0\\gt 0$ 不成立（$[0,1]$ 上都不成立）。'], Q: [false, '反例 $x=0\\in\\mathbf Q$。'], Z: [false, '反例 $x=0$ 或 $x=1$。'], G: [true, '$x\\gt 1$ 时 $x^2=x\\cdot x\\gt x\\cdot 1=x$，每一个都成立——换了集合，真假变了！'] } },
  { q: '\\exists', p: 'x^2-8=0', f: (x) => Math.abs(x * x - 8) < 1e-9, def: 'Q', show: (x) => `$x^2-8=${Math.abs(Math.abs(x) - R2) < 1e-9 ? 0 : fmt(x * x - 8)}$`,
    res: { R: [true, '$x=2\\sqrt2\\in\\R$ 时成立——换成 $\\R$ 就是真命题。'], Q: [false, '只有 $x=\\pm2\\sqrt2$ 使它成立，都不是有理数。'], Z: [false, '$\\pm2\\sqrt2$ 不是整数。'], G: [true, '$2\\sqrt2\\approx 2.83\\in(1,+\\infty)$。'] } },
  { q: '\\forall', p: 'x^2+2\\gt 0', f: (x) => x * x + 2 > 0, def: 'R', show: (x) => `$x^2+2=${fmt(x * x + 2)}$`,
    res: { R: [true, '$x^2\\ge 0\\Rightarrow x^2+2\\ge 2\\gt 0$，每一个都成立。'], Q: [true, '有理数也是实数，都成立。'], Z: [true, '整数也是实数，都成立。'], G: [true, '都成立。'] } },
];
const LO = -3.3;
const HI = 3.8;

function initQuant() {
  const st = { i: 0, dom: 'R', x: 0.5 };
  const b = board($('qBoard'), { x: [LO, HI], y: [-0.7, 0.9], w: 640, h: 170, axes: false, grid: false });
  const cur = () => PROPS[st.i];
  // 连续集合上 p(x) 成立 / 不成立的各段：采样后合并成区间
  const runs = () => {
    const d = DOMS[st.dom];
    if (st.dom === 'Z') return [];
    const N = 640;
    const out = [];
    for (let k = 0; k <= N; k += 1) {
      const x = LO + ((HI - LO) * k) / N;
      if (!d.has(x)) continue;
      const ok = cur().f(x);
      const last = out[out.length - 1];
      if (last && last.ok === ok) last.b = x; else out.push({ a: x, b: x, ok });
    }
    return out;
  };
  const segs = Array.from({ length: 6 }, (_, k) => b.seg(() => { const r = runs()[k]; return r ? [[r.a, 0], [r.b, 0]] : [[0, -9], [0, -9]]; }, { cls: 'rf' }));
  b.seg([[LO, 0], [HI, 0]], { cls: 'base' });
  for (let v = -3; v <= 3; v += 1) b.text([v, 0], String(v), { cls: 'tk', dy: 26, dx: -4 });
  // 整数点
  const ints = [-3, -2, -1, 0, 1, 2, 3];
  const intDots = ints.map((v) => b.pt([v, 0], { r: 7, show: () => st.dom === 'Z' }));
  // x² = 8 的两个根 ±2√2
  const roots = [-R2, R2].map((v) => b.pt([v, 0], { r: 8, show: () => st.i === 2 && st.dom !== 'Z' && DOMS[st.dom].has(v) }));
  b.text(() => (st.i === 2 && st.dom !== 'Z' ? [R2, 0] : null), '2√2', { cls: 'tk', dy: -16, dx: -14 });
  b.text(() => (st.i === 2 && st.dom !== 'Z' && st.dom !== 'G' ? [-R2, 0] : null), '−2√2', { cls: 'tk', dy: -16, dx: -18 });
  b.pt([1, 0], { r: 7, hollow: true, show: () => st.dom === 'G' });
  b.seg(() => [[st.x, 0], [st.x, 0.45]], { cls: 'probe' });
  b.drag(() => [st.x, 0.45], (x) => {
    let v = Math.min(HI - 0.05, Math.max(LO + 0.05, x));
    if (st.dom === 'Z') v = Math.round(v);
    else v = Math.abs(Math.abs(v) - R2) < 0.07 ? Math.sign(v) * R2 : Math.round(v * 20) / 20;
    if (st.dom === 'G') v = Math.max(1.05, v);
    if (st.dom === 'Z') v = Math.max(-3, Math.min(3, v));
    st.x = v;
  });
  const colorize = () => {
    runs().forEach((r, k) => { if (segs[k]) segs[k].setAttribute('class', `rf ${r.ok ? 'ok' : 'no'}`); });
    ints.forEach((v, k) => intDots[k].setAttribute('class', `pt ${cur().f(v) ? 'okp' : 'nop'}`));
    roots.forEach((n) => n.setAttribute('class', `pt ${st.dom === 'Q' ? 'hollow' : 'okp'}`));
  };
  const xTex = (x) => (Math.abs(Math.abs(x) - R2) < 1e-9 ? `${x < 0 ? '-' : ''}2\\sqrt2` : fmt(x));
  b.onUpdate = () => {
    colorize();
    const c = cur();
    const [truth, why] = c.res[st.dom];
    $('qCur').innerHTML = `$${c.q} x\\in ${DOMS[st.dom].t},\\ ${c.p}$　<span class="${truth ? 'tv ok' : 'tv no'}">${truth ? '真命题' : '假命题'}</span>`;
    const inDom = DOMS[st.dom].has(st.x) && !(st.dom === 'Q' && Math.abs(Math.abs(st.x) - R2) < 1e-9);
    const holds = c.f(st.x);
    const m = $('qMsg');
    m.className = `tip feedback ${truth ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `检验 $x=${xTex(st.x)}$：${inDom ? `${c.show(st.x)}，$p(x)$ ${holds ? '<b>成立</b>' : '<b>不成立</b>'}` : `它不在 $${DOMS[st.dom].t}$ 中，不用检验`}。<br>${why}`;
    tex($('qCur')); tex(m);
  };
  const buttons = () => {
    $('qProps').innerHTML = PROPS.map((c, k) => `<button type="button" class="btn${k === st.i ? ' solid' : ''}" data-i="${k}">(${k + 1}) $${c.q} x\\in ${DOMS[c.def].t},\\ ${c.p}$</button>`).join('');
    $('qDom').innerHTML = Object.entries(DOMS).map(([k, d]) => `<button type="button" class="btn${k === st.dom ? ' solid' : ''}" data-d="${k}">$M=${d.t}$</button>`).join('');
    tex($('qProps')); tex($('qDom'));
  };
  $('qProps').addEventListener('click', (e) => { const t = e.target.closest('[data-i]'); if (!t) return; st.i = +t.dataset.i; st.dom = cur().def; st.x = st.dom === 'Z' ? 0 : 0.5; buttons(); b.update(); });
  $('qDom').addEventListener('click', (e) => {
    const t = e.target.closest('[data-d]');
    if (!t) return;
    st.dom = t.dataset.d;
    if (st.dom === 'Z') st.x = Math.max(-3, Math.min(3, Math.round(st.x)));
    if (st.dom === 'G' && st.x <= 1) st.x = 1.5;
    buttons(); b.update();
  });
  buttons();
  b.update();
}

/* 第 9 页：水生动物的圈部分移出 */
function initAqua() {
  const g = $('aquaIn');
  const note = $('aquaNote');
  const set = (k) => {
    g.style.transform = k ? 'translate(165px, -10px)' : 'none';
    note.style.opacity = k ? 1 : 0;
    document.querySelectorAll('[data-aq]').forEach((x) => x.classList.toggle('solid', +x.dataset.aq === k));
  };
  document.querySelectorAll('[data-aq]').forEach((x) => x.addEventListener('click', () => set(+x.dataset.aq)));
  set(0);
}

window.LESSON = {
  init() {
    initQuant();
    initAqua();
  },
};
