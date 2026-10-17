'use strict';
/* 九上 3.3 用计算器求平均数 · 本课互动：仿真计算器（../shared/mcalc.js）逐键演示课本例题、漏输频数对比、自由练习；条形图按课本数据绘制。 */
const { fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];

const EX_KEYS = MCalc.seq('ON MODE 1 ALPHA M+ 10 ▼ 4 ▼ 20 ▼ 13 ▼ 30 ▼ 5 ▼ 40 ▼ 5 ▼ 50 ▼ 5 ▼ 60 ▼ 3 ALPHA M+ ALPHA 4 =');
const WRONG_KEYS = MCalc.seq('ON MODE 1 ALPHA M+ 10 ▼ ▼ 20 ▼ ▼ 30 ▼ ▼ 40 ▼ ▼ 50 ▼ ▼ 60 ▼ ALPHA M+ ALPHA 4 =');

/** 已录入数据表：x / FRQ，当前行高亮 */
function rowsHtml(st) {
  const rows = st.rows.map((r, i) => `<tr class="${st.entry && i === st.row ? 'on' : ''}"><td>${i + 1}</td><td>${r.x}</td><td>${r.f}</td></tr>`).join('');
  const n = st.stats ? st.stats.n : 0;
  return `<tr><th></th><th>x</th><th>FRQ</th></tr>${rows || '<tr><td colspan="3">（还没有数据）</td></tr>'}<tr><th colspan="2">频数和</th><td>${n}</td></tr>`;
}

function initDemo() {
  const msg = $('c1Msg');
  const c = MCalc.create($('calc1'), {
    onChange(st) { $('c1Rows').innerHTML = rowsHtml(st); },
    onStep(i, keys) {
      $('c1Strip').innerHTML = MCalc.strip(keys, i);
      if (i < keys.length) { msg.className = 'tip feedback'; msg.textContent = i ? `已按 ${i} / ${keys.length} 键` : '点“按下一键”或“自动演示”。'; return; }
      msg.className = 'tip feedback fb-ok';
      msg.textContent = `显示结果为 ${c.state().l2}，该班学生上学路上平均用时约为 ${fmt(c.state().stats.mean, 0)} min。`;
    },
  });
  c.load(EX_KEYS);
  $('c1Step').addEventListener('click', () => c.step());
  $('c1Play').addEventListener('click', () => c.play(EX_KEYS, 420));
  $('c1Reset').addEventListener('click', () => c.load(EX_KEYS));
  boards.push(MStat.bars($('exBoard'), {
    cats: ['10', '20', '30', '40', '50', '60'], ymax: 15, ty: 5, labels: ['时间', '人数'], w: 420, h: 300, gw: 0.5,
    series: [{ vals: [4, 13, 5, 5, 5, 3], color: '#f08a6c' }],
  }));
}

function initWrong() {
  const c = MCalc.create($('calc2'));
  $('c2Wrong').addEventListener('click', () => c.play(WRONG_KEYS, 160));
  $('c2Right').addEventListener('click', () => c.play(EX_KEYS, 160));
}

function initFree() {
  const c = MCalc.create($('calc3'), { onChange(st) { $('c3Rows').innerHTML = rowsHtml(st); } });
  c.press('ON');
}

window.LESSON = {
  init() {
    MCalc.create($('calc0'));
    initDemo();
    initWrong();
    initFree();
    boards.push(MStat.bars($('hBoard'), {
      cats: ['152', '154', '158', '160', '162', '164', '168', '172', '175'], ymax: 10, ty: 2, labels: ['身高', '人数'], w: 480, h: 240, gw: 0.55,
      series: [{ vals: [2, 6, 10, 10, 8, 6, 5, 1, 2], color: '#f08a6c' }],
    }));
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
