'use strict';
/* 胡萝卜先生的长胡子 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：越长越长的胡子（故事页）、预测（读到一处停一停 → 预测 → 依据 → 揭晓 → 对照）、书架抽书“看题目猜内容”。
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

/* 课后第 2 题：书架抽书 · 看题目猜内容（key = 题目里最特别的词；hint 只提问，不替学生下结论） */
const BOOKS = [
  { t: '躲猫猫大王', key: '大王', c: '#d0611c', hint: '“大王”说明他特别会……谁是躲猫猫大王？他身上会发生什么事？' },
  { t: '夏洛的网', key: '网', c: '#6aa33a', hint: '“网”让你想到哪种小动物？夏洛可能是谁？它织网做什么？' },
  { t: '柔软的阳光', key: '柔软', c: '#e0a526', hint: '阳光怎么会是“柔软”的？可能是一个让人觉得温暖的故事。' },
  { t: '团圆', key: '团圆', c: '#b8452e', hint: '什么时候一家人会“团圆”？可能和过年、和家人有关。' },
  { t: '帽子的秘密', key: '秘密', c: '#4f7a9a', hint: '一顶帽子会有什么“秘密”？谁的帽子？秘密被发现了吗？' },
  { t: '小灵通漫游未来', key: '漫游未来', c: '#7a5aa0', hint: '“漫游未来”——也许是到未来的世界去看一看，那里会有什么？' },
];
const GUESS = {};

function initShelf(shelf, stand, books) {
  shelf.innerHTML = books.map((b, i) => `<button type="button" class="spine" data-i="${i}" style="--c:${b.c}"><span>${b.t}</span></button>`).join('');
  shelf.addEventListener('click', (e) => {
    const sp = e.target.closest('.spine');
    if (!sp) return;
    const i = +sp.dataset.i;
    const b = books[i];
    shelf.querySelectorAll('.spine').forEach((x) => x.classList.toggle('out', x === sp));
    const title = b.t.replace(b.key, `<mark>${b.key}</mark>`);
    stand.innerHTML = `<div class="bs-cover" style="--c:${b.c}"><small>看题目，猜一猜</small><b>《${title}》</b></div>
      <label class="bs-label">我猜这本书写了……</label>
      <textarea class="bs-guess" placeholder="题目里的“${b.key}”让我想到……"></textarea>
      <div class="btns"><button class="btn" type="button" data-hint>看看题目里的线索</button></div>
      <p class="bs-hint" hidden>${b.hint}</p>`;
    const ta = stand.querySelector('.bs-guess');
    ta.value = GUESS[i] || '';
    ta.addEventListener('input', () => { GUESS[i] = ta.value; });
    stand.querySelector('[data-hint]').addEventListener('click', () => { stand.querySelector('.bs-hint').hidden = false; });
  });
}

/* ================= 本课独有：越长越长的胡子（走了多长的路，胡子就有多长） =================
 * 故事页 .beard[data-beard-start]；字幕行 data-beard = 读到这里胡子的长度（0~1） */
const KNOTS = [[0.04, '漏刮一根'], [0.14, '沾上果酱'], [0.45, '飘到身后'], [0.62, '风筝线？'], [0.9, '晾尿布？'], [1, '……']];
const BEARD_PATH = `M0 20 ${Array.from({ length: 20 }, (_, i) => `Q${i * 50 + 25} ${i % 2 ? 34 : 6} ${i * 50 + 50} 20`).join(' ')}`;
function initBeard() {
  document.querySelectorAll('.beard').forEach((b) => {
    b.innerHTML = `<svg class="bd-head" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 12 L13 4 M20 12 L20 2 M20 12 L27 4" stroke="#5f9a3a" stroke-width="3.5" stroke-linecap="round"/><path d="M10 14 Q20 9 30 14 L22 38 Q20 40 18 38 Z" fill="#e8772a"/><circle cx="16" cy="19" r="1.6" fill="#3a2010"/><circle cx="24" cy="19" r="1.6" fill="#3a2010"/></svg><div class="bd-track">
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none"><path class="bd-bg" d="${BEARD_PATH}"/><path class="bd-hair" pathLength="1" d="${BEARD_PATH}"/></svg>
      ${KNOTS.map(([at, t], i) => `<span class="bd-knot${i % 2 ? ' low' : ''}" data-at="${at}" style="left:${at * 100}%"><i></i>${t}</span>`).join('')}</div>`;
  });
}
function updateBeard(slide, step) {
  const b = slide.querySelector('.beard');
  if (!b) return;
  const shown = [...slide.querySelectorAll('.subs p[data-beard]')].filter((p) => +p.dataset.step <= step);
  const len = shown.length ? +shown[shown.length - 1].dataset.beard : +b.dataset.beardStart;
  b.querySelector('.bd-hair').style.strokeDashoffset = 1 - len;
  b.querySelectorAll('.bd-knot').forEach((k) => k.classList.toggle('on', +k.dataset.at <= len + 1e-6));
}

window.LESSON = {
  init() {
    Narrative.init({});
    initShelf(document.getElementById('shelf'), document.getElementById('bookStand'), BOOKS);
    initBeard();
    document.querySelectorAll('.predict').forEach(initPredict);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateBeard(slide, step);
    const log = slide.querySelector('#predLog');
    if (log) renderPredLog(log);
  },
};
