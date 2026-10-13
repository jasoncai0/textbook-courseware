'use strict';
/* 胡萝卜先生的长胡子 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：预测（读到一处停一停 → 预测 → 依据 → 揭晓 → 对照），“看题目猜内容”翻卡片。
 */

/* ================= 预测：读到这里停一停 → 选 / 写预测 → 选依据 → 揭晓下文 → 对照（第四单元通用）
 * HTML：<div class="predict" data-predict="id" data-q="问题" data-noswipe>
 *         <div class="pd-opts"><button class="pd-opt">…</button>…</div> <textarea class="pd-text"></textarea>
 *         <div class="pd-answer" hidden>原文……</div></div>
 * 依据按钮、揭晓按钮、对照按钮由脚本补上；记录在 PRED 里，#predLog 所在页面显示“我的预测记录”。
 */
const BASES = ['题目', '插图', '文中线索', '生活经验'];
const SAMES = ['和原文一样', '有一点不一样', '不一样，我修正了'];
const PRED = {};
const escHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function initPredict(box) {
  const rec = { q: box.dataset.q, guess: '', basis: [], same: '' };
  PRED[box.dataset.predict] = rec;
  const answer = box.querySelector('.pd-answer');
  answer.insertAdjacentHTML('beforebegin', `
    <p class="pd-h">我是根据什么猜的？<small>可以多选</small></p>
    <div class="pd-basis">${BASES.map((b) => `<button class="btn" type="button" data-b="${b}">${b}</button>`).join('')}</div>
    <div class="btns"><button class="btn solid pd-go" type="button">揭晓下文</button></div>`);
  answer.insertAdjacentHTML('beforeend', `<div class="pd-same"><span>我的预测：</span>${SAMES.map((t) => `<button class="btn" type="button" data-s="${t}">${t}</button>`).join('')}</div>`);
  const text = box.querySelector('.pd-text');
  box.addEventListener('click', (e) => {
    const opt = e.target.closest('.pd-opt');
    if (opt) {
      box.querySelectorAll('.pd-opt').forEach((o) => o.classList.toggle('solid', o === opt));
      rec.guess = opt.textContent;
    }
    const b = e.target.closest('[data-b]');
    if (b) {
      b.classList.toggle('solid');
      rec.basis = [...box.querySelectorAll('[data-b].solid')].map((x) => x.dataset.b);
    }
    if (e.target.closest('.pd-go')) { answer.hidden = false; box.classList.add('revealed'); }
    const s = e.target.closest('[data-s]');
    if (s) {
      box.querySelectorAll('[data-s]').forEach((x) => x.classList.toggle('solid', x === s));
      rec.same = s.dataset.s;
    }
  });
  if (text) text.addEventListener('input', () => { rec.guess = text.value.trim() || (box.querySelector('.pd-opt.solid') || {}).textContent || ''; });
}

function renderPredLog(box) {
  const rows = Object.values(PRED);
  box.innerHTML = `<table class="pd-log"><thead><tr><th>停下来的地方</th><th>我的预测</th><th>依据</th><th>对照</th></tr></thead><tbody>${rows.map((r) =>
    `<tr><td>${escHtml(r.q)}</td><td>${escHtml(r.guess) || '<i>（没有记录）</i>'}</td><td>${escHtml(r.basis.join('、')) || '—'}</td><td>${escHtml(r.same) || '—'}</td></tr>`).join('')}</tbody></table>`;
}

/* 课后第 2 题：读题目猜内容（背面只给题目里的线索，不替学生下结论） */
const CLUE_LABELS = ['看题目，猜一猜', '题目里的线索'];
const CLUES = [
  { q: '《躲猫猫大王》', a: '“大王”说明他特别会……谁是躲猫猫大王？他身上会发生什么事？' },
  { q: '《夏洛的网》', a: '“网”让你想到哪种小动物？夏洛可能是谁？它织网做什么？' },
  { q: '《柔软的阳光》', a: '阳光怎么会是“柔软”的？可能是一个让人觉得温暖的故事。' },
  { q: '《团圆》', a: '什么时候一家人会“团圆”？可能和过年、和家人有关。' },
  { q: '《帽子的秘密》', a: '一顶帽子会有什么“秘密”？谁的帽子？秘密被发现了吗？' },
  { q: '《小灵通漫游未来》', a: '“漫游未来”——也许是到未来的世界去看一看，那里会有什么？' },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS });
    document.querySelectorAll('.predict').forEach(initPredict);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    const log = slide.querySelector('#predLog');
    if (log) renderPredLog(log);
  },
};
