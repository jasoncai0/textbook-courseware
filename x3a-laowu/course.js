'use strict';
/* 总也倒不了的老屋 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：预测（读到一处停一停 → 预测 → 依据 → 揭晓 → 对照），回顾页汇总“我的预测记录”。
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

/* 课后第 2 题：老屋的印象 */
const PICKS = {
  laowu: [
    { t: '慈祥', ok: true, why: '插图上的老屋笑眯眯的' },
    { t: '乐于助人', ok: true, why: '小猫、老母鸡、小蜘蛛它都帮' },
    { t: '不耐烦', ok: false, why: '它一次也没有拒绝' },
    { t: '善良', ok: true, why: '自己很老了，还为别人站着' },
    { t: '小气', ok: false, why: '课文里找不到依据' },
    { t: '有耐心', ok: true, why: '“好吧，我就再站……”' },
  ],
};

/* 续编：还会有谁来 */
const MOMENTS = [
  {
    name: '一群小蚂蚁', pic: 'zhizhu',
    prompt: '又一个夜晚，老屋说：“好了，我到了倒下的时候了！”“等等，老屋！”……接着编一编。',
    hint: '想一想：小蚂蚁为什么需要老屋？要再站多久？老屋会怎么回答？',
    example: '“等等，老屋！”一群细细的声音在墙脚响起，“下大雨了，我们的家被冲垮了，请再站几天吧，等我们找到新家。”老屋低头看看，眯着眼睛：“哦，是小蚂蚁啊。好吧，我就再站几天。”',
  },
  {
    name: '一只小燕子', pic: 'laowu',
    prompt: '春天来了，一只小燕子飞到老屋的屋檐下……接着编一编。',
    hint: '燕子喜欢在屋檐下做什么？老屋会答应它吗？',
    example: '“等等，老屋！”一个清脆的声音在屋檐下响起，“我想在这儿搭个窝，生几只小燕子，再站一个春天，行吗？”老屋低头看看：“哦，是小燕子啊。好吧，我就再站一个春天。”',
  },
  {
    name: '我自己想', pic: 'xiaomao',
    prompt: '你觉得还会有谁来请老屋帮忙？它需要什么？',
    hint: '用上课文反复的句子：“等等，老屋！”“老屋低头看看……”“好吧，我就再站……”',
    example: '“等等，老屋！”一只迷路的小刺猬说，“天快黑了，我找不到回家的路，让我在这儿睡一晚吧。”……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    document.querySelectorAll('.predict').forEach(initPredict);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    const log = slide.querySelector('#predLog');
    if (log) renderPredLog(log);
  },
};
