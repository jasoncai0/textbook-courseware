'use strict';
/* 小狗学叫 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：预测；三种结局做成三条分支（点一条路 → 读课本开头 → 写预测 → 依据 → 线索）。
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

/* 三种结局：点分支按钮，显示对应的那一条 */
function initBranches(slide) {
  slide.querySelector('.branch-btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-br]');
    if (!btn) return;
    slide.dataset.cur = btn.dataset.br;
    slide.querySelectorAll('.branch-btn').forEach((b) => b.classList.toggle('solid', b === btn));
    slide.querySelectorAll('.branch').forEach((br) => { br.hidden = br.dataset.br !== btn.dataset.br; });
    slide.querySelector('.branch-stage').scrollTop = 0;
  });
}

/* 课后第 3 题：在哪儿停下来让同学猜 */
const PICKS = {
  stop: [
    { t: '一只狐狸听到了，心里寻思着：公鸡终于来找我了……', ok: true, why: '新人物出场，狐狸要做什么？' },
    { t: '那只小公鸡喔喔喔地叫了几声。', ok: false, why: '这里没什么可猜的' },
    { t: '就在那几天，人们开始打猎了，树林里来了很多猎人……', ok: true, why: '危险来了，小狗会怎样？' },
    { t: '“我觉得很容易。”', ok: false, why: '紧接着就是回答，不必停' },
    { t: '狗跑啊，跑啊……', ok: true, why: '结局出来之前，最适合猜' },
    { t: '小狗学着杜鹃叫，“咕……”', ok: false, why: '正在学，接着读更自然' },
  ],
};

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS });
    document.querySelectorAll('.predict').forEach(initPredict);
    document.querySelectorAll('.s-branch').forEach(initBranches);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    const log = slide.querySelector('#predLog');
    if (log) renderPredLog(log);
  },
};
