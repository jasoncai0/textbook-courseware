'use strict';
/* 八下 10.1 分式 · 本课互动：分母为零探测器（数轴拖动 x，精确分数计算分子、分母、分式的值）。
 * 点选判断用 ../shared/mcheck.js；精确计算用 ../shared/mfrac.js。 */
const { board, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const STEP = 6; // x 以 1/6 为单位移动：3/2、4/3、2/3 都能精确取到
const LO = -4 * STEP;
const HI = 4 * STEP;

const DET = [
  { tab: '例题', v: 'x', num: 'x-2', den: '2x-3', ftex: '\\dfrac{x-2}{2x-3}', init: 0 },
  { tab: '求值示例', v: 'a', num: 'a-3', den: 'a+2', ftex: '\\dfrac{a-3}{a+2}', init: 3 * STEP },
  { tab: '练习 2', v: 'x', num: 'x', den: '1-x', ftex: '\\dfrac{x}{1-x}', init: -2 * STEP },
  { tab: '警示卡', v: 'x', num: 'x-3', den: '2x-6', ftex: '\\dfrac{x-3}{2x-6}', init: 1 * STEP },
];

function initDetector() {
  const s = { cur: DET[0], k: DET[0].init, found: new Map() }; // found: "tab|k" → 'red' | 'green'
  const b = board($('detLine'), { x: [-4.6, 4.6], y: [-0.75, 0.75], w: 660, h: 110, grid: false, axes: false });
  b.seg([[-4.5, 0], [4.5, 0]], { cls: 'axis-l' });
  for (let i = -4; i <= 4; i += 1) {
    b.seg([[i, -0.12], [i, 0.12]], { cls: 'axis-l' });
    b.text([i, 0], String(i), { cls: 'tk nl', dy: 26 });
  }
  for (let j = LO; j <= HI; j += 1) if (j % STEP) b.seg([[j / STEP, -0.05], [j / STEP, 0.05]], { cls: 'thin' });
  // 已发现的特殊点（每个分式各自记录）
  const marks = [];
  for (let j = LO; j <= HI; j += 1) {
    marks.push(b.pt([j / STEP, 0], { r: 8, cls: 'mk-red', show: () => s.found.get(`${s.cur.tab}|${j}`) === 'red' }));
    marks.push(b.pt([j / STEP, 0], { r: 8, cls: 'mk-green', show: () => s.found.get(`${s.cur.tab}|${j}`) === 'green' }));
  }
  b.drag(() => [s.k / STEP, 0], (x) => { s.k = Math.max(LO, Math.min(HI, Math.round(x * STEP))); });
  b.text(() => [s.k / STEP, 0], () => `${s.cur.v} = ${MFrac.str(MFrac.mk(BigInt(s.k), BigInt(STEP)))}`, { cls: 'lb up nl', dy: -22 });

  b.onUpdate = () => {
    const c = s.cur;
    const x = MFrac.mk(BigInt(s.k), BigInt(STEP));
    const env = { [c.v]: x };
    const n = MFrac.val(c.num, env);
    const d = MFrac.val(c.den, env);
    const f = MFrac.div(n, d);
    const key = `${c.tab}|${s.k}`;
    if (d.n === 0n) s.found.set(key, 'red');
    else if (n.n === 0n) s.found.set(key, 'green');
    $('detRead').innerHTML = `<table class="mtab det-tab"><tr><th>$${c.v}$</th><th>分子 $${c.num}$</th><th>分母 $${c.den}$</th><th>分式 $${c.ftex}$</th></tr>`
      + `<tr><td>$${MFrac.tex(x)}$</td><td>$${MFrac.tex(n)}$</td><td class="${d.n === 0n ? 'bad' : ''}">$${MFrac.tex(d)}$</td><td class="${f ? (f.n === 0n ? 'good' : '') : 'bad'}">${f ? `$${MFrac.tex(f)}$` : '无意义'}</td></tr></table>`;
    const msg = $('detMsg');
    if (d.n === 0n) {
      msg.className = 'tip feedback fb-warn';
      msg.innerHTML = `$${c.v}=${MFrac.tex(x)}$ 时分母为 0，<b>分式无意义</b>${n.n === 0n ? '（分子虽然也是 0，但分母为 0，仍然无意义）' : ''}。数轴上留下了红点。`;
    } else if (n.n === 0n) {
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = `$${c.v}=${MFrac.tex(x)}$ 时分子为 0、分母为 $${MFrac.tex(d)}\\ne0$，<b>分式的值为零</b>。数轴上留下了绿点。`;
    } else {
      msg.className = 'tip feedback';
      msg.innerHTML = `分母 $=${MFrac.tex(d)}\\ne0$，分式有意义，值为 $${MFrac.tex(f)}$。继续拖，找红点和绿点。`;
    }
    tex($('detRead')); tex(msg);
  };

  $('detTabs').innerHTML = DET.map((c, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">${c.tab}：$${c.ftex}$</button>`).join('');
  tex($('detTabs'));
  $('detTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    s.cur = DET[+btn.dataset.i];
    s.k = s.cur.init;
    $('detTabs').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  const nudge = (dk) => { s.k = Math.max(LO, Math.min(HI, s.k + dk)); b.update(); };
  $('detL').addEventListener('click', () => nudge(-1));
  $('detR').addEventListener('click', () => nudge(1));
  b.update();
  return () => b.update();
}

let redraw = () => {};
window.LESSON = {
  init() { redraw = initDetector(); },
  onRender() { requestAnimationFrame(redraw); },
};
