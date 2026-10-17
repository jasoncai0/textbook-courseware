'use strict';
/* 九上 1.1 一元二次方程 · 本课互动：花圃实验（试根）、一般形式整理器。通用部分见 ../shared/math.js
 * 花圃按比例精确绘制：宽 x、长 19 − 2x，栅栏三段之和恒为 19；面积由 x(19 − 2x) 计算。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

const FENCE = 19;
const TARGET = 24;
const X_MIN = 0.5;
const X_MAX = 9;
const STEP = 0.5;
const MAX_ROWS = 6;

/* 第 4 页：花圃实验 */
function initGarden() {
  const s = { x: 3, rows: [] };
  const area = (x) => x * (FENCE - 2 * x);
  const b = board($('garden'), { x: [-1, 20], y: [-10.2, 1.6], axes: false, grid: false, w: 620 });
  // 墙与斜线阴影
  b.seg([[-0.6, 0], [19.6, 0]], { cls: 'wall' });
  for (let t = -0.4; t <= 19.6; t += 0.8) b.seg([[t, 0], [t - 0.5, 0.5]], { cls: 'hatch' });
  b.text([9.5, 0.5], '墙', { cls: 'lb up c', dy: -2 });
  // 花圃：左右各 x，靠墙一面不用栅栏
  const rect = () => [[s.x, 0], [FENCE - s.x, 0], [FENCE - s.x, -s.x], [s.x, -s.x]];
  b.poly(rect, { cls: 'bed' });
  b.seg(() => [[s.x, 0], [s.x, -s.x]], { cls: 'fence' });
  b.seg(() => [[s.x, -s.x], [FENCE - s.x, -s.x]], { cls: 'fence' });
  b.seg(() => [[FENCE - s.x, -s.x], [FENCE - s.x, 0]], { cls: 'fence' });
  b.text(() => [s.x, -s.x / 2], () => `x = ${fmt(s.x)}`, { cls: 'lb up r', dx: -8, dy: 6 });
  b.text(() => [FENCE / 2, -s.x], () => `19 − 2x = ${fmt(FENCE - 2 * s.x)}`, { cls: 'lb up c', dy: 26 });
  b.text(() => [FENCE / 2, -s.x / 2], () => `S = ${fmt(area(s.x))}`, { cls: 'lb up c big', dy: 8 });
  const snap = (v) => Math.min(X_MAX, Math.max(X_MIN, Math.round(v / STEP) * STEP));
  b.drag(() => [FENCE - s.x, -s.x], (x, y) => { s.x = snap(-y); $('gx').value = s.x; });
  b.onUpdate = () => {
    const S = area(s.x);
    $('gxV').textContent = fmt(s.x);
    $('gW').textContent = fmt(s.x);
    $('gL').textContent = fmt(FENCE - 2 * s.x);
    $('gS').textContent = fmt(S);
    const msg = $('gMsg');
    const hit = Math.abs(S - TARGET) < 1e-9;
    msg.className = `tip feedback ${hit ? 'fb-ok' : ''}`;
    msg.innerHTML = hit
      ? `面积正好是 24！$x=${fmt(s.x)}$ 是方程 $x(19-2x)=24$ 的一个解。`
      : `面积 ${fmt(S)} ${S > TARGET ? '大于' : '小于'} 24，再试试。`;
    tex(msg);
  };
  const renderRows = () => {
    const head = $('gTab').rows[0].outerHTML;
    const rows = [...s.rows].sort((p, q) => p - q);
    $('gTab').innerHTML = head + rows.map((x) => {
      const S = area(x);
      return `<tr class="${Math.abs(S - TARGET) < 1e-9 ? 'hit' : ''}"><td>${fmt(x)}</td><td>${fmt(FENCE - 2 * x)}</td><td>${fmt(S)}</td></tr>`;
    }).join('');
    tex($('gTab'));
  };
  $('gRec').addEventListener('click', () => {
    s.rows = s.rows.includes(s.x) ? s.rows : [...s.rows, s.x].slice(-MAX_ROWS);
    renderRows();
  });
  $('gClr').addEventListener('click', () => { s.rows = []; renderRows(); });
  slider($('gx'), (v) => { s.x = v; b.update(); });
}

/* 第 6 页：一般形式整理器。每步 [式子, 依据]；abc 为最后的系数 */
const EQS = [
  { name: '桌面', steps: [['x^2=2', '原方程'], ['x^2-2=0', '移项']], abc: ['1', '0', '-2'] },
  { name: '花圃', steps: [['x(19-2x)=24', '原方程'], ['19x-2x^2=24', '去括号（单项式乘多项式）'], ['-2x^2+19x-24=0', '移项，按降幂排列']], abc: ['-2', '19', '-24'] },
  { name: '藏书', steps: [['5(1+x)^2=9.8', '原方程'], ['5(1+2x+x^2)=9.8', '完全平方公式'], ['5x^2+10x+5-9.8=0', '去括号、移项'], ['5x^2+10x-4.8=0', '合并同类项']], abc: ['5', '10', '-4.8'] },
  { name: '梯子', steps: [['x^2+(x-1)^2=25', '原方程'], ['x^2+x^2-2x+1=25', '完全平方公式'], ['2x^2-2x-24=0', '移项、合并同类项']], abc: ['2', '-2', '-24'] },
];

function initNormalForm() {
  const s = { k: 1, n: 1 };
  const pick = $('nfPick');
  pick.innerHTML = EQS.map((e, i) => `<button class="btn" type="button" data-i="${i}">${e.name}</button>`).join('');
  const render = () => {
    const e = EQS[s.k];
    pick.querySelectorAll('.btn').forEach((x, i) => x.classList.toggle('solid', i === s.k));
    $('nfChain').innerHTML = e.steps.slice(0, s.n).map(([f, why], i) => `<div class="dl${i === e.steps.length - 1 ? ' end' : ''}"><span>${i ? '⇒' : ''}</span><span>$${f}$</span><i class="why">${why}</i></div>`).join('');
    const done = s.n === e.steps.length;
    const [a, b, c] = e.abc;
    $('nfAbc').innerHTML = done
      ? `<span class="ca">二次项系数 $a=${a}$</span><span class="cb">一次项系数 $b=${b}$</span><span class="cc">常数项 $c=${c}$</span>`
      : '<span class="muted">整理到 $ax^2+bx+c=0$ 的样子，再找 $a$、$b$、$c$</span>';
    $('nfNext').disabled = done;
    tex($('nfChain')); tex($('nfAbc'));
  };
  pick.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-i]');
    if (!btn) return;
    s.k = +btn.dataset.i; s.n = 1; render();
  });
  $('nfNext').addEventListener('click', () => { s.n = Math.min(s.n + 1, EQS[s.k].steps.length); render(); });
  $('nfReset').addEventListener('click', () => { s.n = 1; render(); });
  render();
}

window.LESSON = {
  init() {
    initGarden();
    initNormalForm();
  },
};
