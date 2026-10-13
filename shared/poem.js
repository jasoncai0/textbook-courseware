'use strict';
/* 课本插件 · 诗文模板。在本课 course.js 之前加载；画面、镜头、字幕沿用记叙文模板 narrative.js。
 * 本课 course.js 顶层先调用 Poem.render(POEMS)（必须在 deck.js 统计分步之前），LESSON.init 里再调 Poem.init()。
 * POEMS = { id: { title, author, layout?: 'h', lines: [{ t: '原句', r: '节奏/划分', f: '镜头 s x% y%', y?: '译文' }], notes: { 词: '注释' } } }
 *   layout: 'h' 横排（文言文句子长，竖排放不下）；有 y 的句子会出现“译文”按钮，打开后每句下面显示译文
 * 页面约定：<div class="poem-v" data-poem="id"></div> 竖排诗（逐句出现）；<div data-recite="id"></div> 背诵挖空
 */
const Poem = (() => {
  let poems = {};
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // 一句诗 → 带节奏线和注释的 HTML。节奏线 / 只在打开“节奏”时显示
  function lineHtml(line, notes) {
    // 一次性匹配所有注释词（长词优先），避免注释文字里恰好含有另一个词被二次替换；注释词不能跨越节奏线
    const keys = Object.keys(notes).sort((x, y) => y.length - x.length);
    const re = keys.length ? new RegExp(keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g') : null;
    const mark = (text) => (re ? text.replace(re, (w) => `\u0000${w}\u0001`) : text);
    return (line.r || line.t).split('/').map((g) => esc(mark(g))
      .replace(/\u0000([^\u0001]*)\u0001/g, (_, w) => `<span class="nt" tabindex="0" data-note="${esc(notes[w])}">${w}</span>`))
      .join('<i class="pz">/</i>');
  }

  function render(data) {
    poems = data;
    document.querySelectorAll('.poem-v[data-poem]').forEach((box) => {
      const p = poems[box.dataset.poem];
      const notes = p.notes || {};
      const hasYi = p.lines.some((l) => l.y);
      if (p.layout === 'h') box.classList.add('h');
      box.innerHTML = `<div class="poem-tools" data-noswipe>
          <button type="button" class="ptool" data-tool="show-rhythm">节奏</button>
          <button type="button" class="ptool" data-tool="show-notes">注释</button>
          ${hasYi ? '<button type="button" class="ptool" data-tool="show-yi">译文</button>' : ''}
        </div>
        <div class="poem-text">
          <h3>${esc(p.title)}</h3><p class="author">${esc(p.author)}</p>
          ${p.lines.map((l, i) => `<p class="pl" data-step="${i + 1}"${l.f ? ` data-focus="${l.f}"` : ''}>${lineHtml(l, notes)}${l.y ? `<span class="yi">${esc(l.y)}</span>` : ''}</p>`).join('')}
        </div>
        <p class="note-pop" hidden></p>`;
    });
  }

  function initTools() {
    document.addEventListener('click', (e) => {
      const tool = e.target.closest('.ptool');
      if (tool) {
        const box = tool.closest('.poem-v');
        tool.classList.toggle('on', box.classList.toggle(tool.dataset.tool));
        if (!box.classList.contains('show-notes')) box.querySelector('.note-pop').hidden = true;
        return;
      }
      const nt = e.target.closest('.show-notes .nt');
      document.querySelectorAll('.note-pop').forEach((p) => { p.hidden = true; });
      if (nt) {
        const pop = nt.closest('.poem-v').querySelector('.note-pop');
        pop.textContent = `${nt.textContent}：${nt.dataset.note}`;
        pop.hidden = false;
      }
    });
  }

  /* ================= 背诵挖空：0 全显示 → 1 隔字挖空 → 2 只留每句首字 → 3 全部挖空；点空格偷看一个字 ================= */
  const LEVELS = ['全文', '挖一半', '只留首字', '全部背出'];
  const PUNCT = /[，。、？！；：“”‘’（）《》…—·]/;
  const hiddenAt = (level, i, ch) => !PUNCT.test(ch) && (level === 1 ? i % 2 === 1 : level === 2 ? i > 0 : level === 3);

  function renderRecite(box, level) {
    const p = poems[box.dataset.recite];
    box.querySelector('.recite-lines').innerHTML = p.lines.map((l) => `<p>${[...l.t].map((ch, i) =>
      (hiddenAt(level, i, ch) ? `<button type="button" class="blank" data-ch="${esc(ch)}"></button>` : `<span>${esc(ch)}</span>`)).join('')}</p>`).join('');
    box.querySelectorAll('.recite-levels .btn').forEach((b, i) => b.classList.toggle('solid', i === level));
  }

  function initRecite(box) {
    const p = poems[box.dataset.recite];
    box.innerHTML = `<h3>${esc(p.title)}<small>${esc(p.author)}</small></h3>
      <div class="btns recite-levels">${LEVELS.map((t, i) => `<button type="button" class="btn" data-level="${i}">${t}</button>`).join('')}</div>
      <div class="recite-lines"></div>`;
    box.addEventListener('click', (e) => {
      const lv = e.target.closest('[data-level]');
      if (lv) renderRecite(box, +lv.dataset.level);
      const blank = e.target.closest('.blank');
      if (blank) { blank.textContent = blank.dataset.ch; blank.classList.add('peek'); }
    });
    renderRecite(box, 0);
  }

  return {
    render,
    init() {
      initTools();
      document.querySelectorAll('[data-recite]').forEach(initRecite);
    },
  };
})();
