'use strict';
/* 九上 3.5 用计算器求方差 · 本课互动：方法一 statx 模式仿真计算器（../shared/mcalc.js，甲/乙两组按键照课本）、
 * 方法二 表格录入演示、自由练习。屏幕结果一律由程序按录入数据精确计算。 */
const $ = (id) => document.getElementById(id);

const M1 = {
  jia: MCalc.seq('ON MODE 1 ALPHA M+ 10 ▼ ▼ 7 ▼ ▼ 8 ▼ 6 ▼ 9 ▼ ▼ 6 ▼ ALPHA M+ ALPHA 4 = ALPHA × ='),
  yi: MCalc.seq('ON MODE 1 ALPHA M+ 8 ▼ 4 ▼ 5 ▼ ▼ 8 ▼ 2 ▼ 9 ▼ 3 ▼ ALPHA M+ ALPHA 4 = ALPHA × ='),
};
const NAME = { jia: '甲', yi: '乙' };

function rowsHtml(st) {
  const rows = st.rows.map((r, i) => `<tr class="${st.entry && i === st.row ? 'on' : ''}"><td>${i + 1}</td><td>${r.x}</td><td>${r.f}</td></tr>`).join('');
  const n = st.stats ? st.stats.n : 0;
  return `<tr><th></th><th>x</th><th>FRQ</th></tr>${rows || '<tr><td colspan="3">（还没有数据）</td></tr>'}<tr><th colspan="2">频数和</th><td>${n}</td></tr>`;
}

function initMethod1() {
  const st = { key: 'jia' };
  const msg = $('c1Msg');
  const c = MCalc.create($('calc1'), {
    onChange(s) {
      $('c1Rows').innerHTML = rowsHtml(s);
    },
    onStep(i, keys) {
      $('c1Strip').innerHTML = MCalc.strip(keys, i);
      const s = c.state();
      const done = i === keys.length;
      const meanShown = i >= keys.length - 3;
      msg.className = `tip feedback ${done ? 'fb-ok' : ''}`;
      if (!i) msg.textContent = `${NAME[st.key]}：点“按下一键”或“自动演示”。`;
      else if (done) msg.textContent = `${NAME[st.key]}：平均数 x̄ = ${MCalc.show(s.stats.mean)}，方差 s² = ${s.l2}。`;
      else if (meanShown) msg.textContent = `屏幕显示 ${s.l2}——这是平均数；再按 ALPHA × = 求方差。`;
      else msg.textContent = `已按 ${i} / ${keys.length} 键`;
    },
  });
  const load = () => c.load(M1[st.key]);
  $('c1Step').addEventListener('click', () => c.step());
  $('c1Play').addEventListener('click', () => c.play(M1[st.key], 380));
  $('c1Tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    st.key = btn.dataset.k;
    $('c1Tabs').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    load();
  });
  load();
}

/* ---------- 方法二：表格录入 ---------- */
const M2 = {
  jia: '10 = 7 = 8 = 9 = 6 = ▶▲ 1 = 1 = 6 = 1 = 1 = AC OPTN 2',
  yi: '8 = 5 = 9 = ▶▲ 6 = 1 = 3 = AC OPTN 2',
};
const keys2 = (t) => t.split(/\s+/).flatMap((k) => (/^\d+$/.test(k) ? k.split('') : [k]));
function initMethod2() {
  let key = 'jia';
  let keys = [];
  let i = 0;
  let timer = null;
  let s;
  const reset = () => { s = { col: 'x', row: 0, buf: '', xs: [], fs: [], result: false, optn: false }; };
  const stats = () => {
    const n = s.fs.reduce((a, f) => a + f, 0);
    const m = s.xs.reduce((a, x, k) => a + x * s.fs[k], 0) / n;
    return { m, v: s.xs.reduce((a, x, k) => a + s.fs[k] * (x - m) ** 2, 0) / n };
  };
  const press = (k) => {
    if (s.optn && k === '2') { s.result = true; return; }
    if (k === 'OPTN') { s.optn = true; return; }
    if (/^\d$/.test(k)) s.buf += k;
    else if (k === '=') {
      const arr = s.col === 'x' ? s.xs : s.fs;
      arr[s.row] = +s.buf; s.buf = ''; s.row += 1;
    } else if (k === '▶▲') { s.col = 'f'; s.row = 0; s.fs = s.xs.map(() => 1); }
  };
  const paint = () => {
    const scr = $('t2Screen');
    if (s.result) {
      const { m, v } = stats();
      scr.innerHTML = `<div class="t2-res"><p>x̄ <span>= ${MCalc.show(m)}</span></p><p>σ²x <span>= ${MCalc.show(v)}</span></p><p>⋮</p></div>`;
    } else {
      const n = Math.max(s.xs.length + (s.col === 'x' ? 1 : 0), 3);
      let html = '<table class="t2-tab"><tr><th></th><th>x</th><th>频数</th></tr>';
      for (let r = 0; r < n; r++) {
        const cx = s.col === 'x' && r === s.row;
        const cf = s.col === 'f' && r === s.row;
        const xv = cx && s.buf ? s.buf : (s.xs[r] ?? '');
        const fv = cf && s.buf ? s.buf : (s.fs[r] ?? '');
        html += `<tr><th>${r + 1}</th><td class="${cx ? 'cur' : ''}">${xv}</td><td class="${cf ? 'cur' : ''}">${fv}</td></tr>`;
      }
      scr.innerHTML = `${html}</table>`;
    }
    $('t2Strip').innerHTML = keys.map((k, j) => `<span class="mc-chip ${j < i ? 'done' : ''} ${j === i - 1 ? 'now' : ''}">${k === '▶▲' ? '光标移到频数列' : k}</span>`).join('');
    const msg = $('t2Msg');
    msg.className = `tip feedback ${s.result ? 'fb-ok' : ''}`;
    msg.textContent = s.result ? `${NAME[key]}：x̄ = ${MCalc.show(stats().m)}，方差 = ${MCalc.show(stats().v)}（屏幕记作 σ²x）。` : (s.col === 'x' ? '正在录入 x 列：输入一个数，按 = 确认并下移。' : '正在录入频数列。');
  };
  const step = () => { if (i >= keys.length) { clearInterval(timer); return; } press(keys[i]); i += 1; paint(); };
  const load = () => { clearInterval(timer); keys = keys2(M2[key]); i = 0; reset(); paint(); };
  $('t2Step').addEventListener('click', () => { clearInterval(timer); step(); });
  $('t2Play').addEventListener('click', () => { load(); timer = setInterval(step, 380); });
  $('t2Tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    key = btn.dataset.k;
    $('t2Tabs').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    load();
  });
  load();
}

window.LESSON = {
  init() {
    initMethod1();
    initMethod2();
    const c = MCalc.create($('calc3'), { onChange(st) { $('c3Rows').innerHTML = rowsHtml(st); } });
    c.press('ON');
  },
};
