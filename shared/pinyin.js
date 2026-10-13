'use strict';
/* 课本插件 · 字词注音页（每篇语文课文的第 2 页「读准字音」）
 * 用法：页面里放 <section class="slide s-ziyin" data-ziyin></section>，
 *       在 course.js 和 deck.js 之前依次加载 ziyin.js（本课数据）和本文件。
 * window.ZIYIN = {
 *   read:  [['[矗]立', 'chù lì'], ...]   认读：课文里注了音的字所在的词；[ ] 标出注音字；拼音按字用空格隔开
 *   write: [['咆', 'páo', '咆哮'], ...]  会写：课后生字框里的字、拼音、课文里的组词
 *   tips:  ['正月：“正”读 zhēng'],       多音字、易错音提醒（可选）
 * }
 * 数据草稿可用 shared/ziyin_extract.py 从课本 PDF 提取，再人工核对。
 */
(() => {
  const data = window.ZIYIN;
  const slide = document.querySelector('section[data-ziyin]');
  if (!data || !slide) return;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // '[矗]立' + 'chù lì' → 每个字一个 <ruby>，注音字加 key 样式
  function rubyWord(marked, pinyin) {
    const syllables = pinyin.trim().split(/\s+/);
    const chars = [];
    let key = false;
    for (const ch of marked) {
      if (ch === '[') { key = true; continue; }
      if (ch === ']') { key = false; continue; }
      chars.push({ ch, key });
    }
    if (syllables.length !== chars.length) {
      console.warn(`注音数量不符：${marked} / ${pinyin}`); // eslint-disable-line no-console
    }
    return chars.map((c, i) => `<ruby class="${c.key ? 'zy-key' : ''}">${esc(c.ch)}<rt>${esc(syllables[i] || '')}</rt></ruby>`).join('');
  }

  const read = (data.read || []).map(([w, p]) => `<button type="button" class="zy-card">${rubyWord(w, p)}</button>`).join('');
  const write = (data.write || []).map(([ch, p, word]) =>
    `<button type="button" class="zy-card zy-write"><ruby>${esc(ch)}<rt>${esc(p)}</rt></ruby><small>${esc(word)}</small></button>`).join('');
  const tips = (data.tips || []).map((t) => `<li>${esc(t)}</li>`).join('');

  slide.innerHTML = `
    <div class="hd"><span class="tag">字词</span><h2>读准字音</h2>
      <span class="zy-tools" data-noswipe>
        <button type="button" class="btn" data-zy="hide">遮住拼音自己读</button>
        <button type="button" class="btn" data-zy="show">显示全部拼音</button>
      </span></div>
    <div class="bd full"><div class="stage zy-stage" data-noswipe>
      ${read ? `<h3 class="zy-h">读一读 <small>课文里注了音的字（红色）</small></h3><div class="zy-grid">${read}</div>` : ''}
      ${write ? `<h3 class="zy-h">写一写 <small>本课会写的字</small></h3><div class="zy-grid zy-grid-write">${write}</div>` : ''}
      ${tips ? `<ul class="zy-tips">${tips}</ul>` : ''}
    </div></div>
    <p class="note">先听老师范读，再“遮住拼音自己读”：读不准的字，点一下卡片看拼音。会写的字注意前后鼻音、平翘舌和多音字。</p>`;

  slide.addEventListener('click', (e) => {
    const tool = e.target.closest('[data-zy]');
    if (tool) {
      const hide = tool.dataset.zy === 'hide';
      slide.classList.toggle('zy-hidden', hide);
      slide.querySelectorAll('.zy-card').forEach((c) => c.classList.remove('peek'));
      return;
    }
    const card = e.target.closest('.zy-card');
    if (card && slide.classList.contains('zy-hidden')) card.classList.toggle('peek');
  });
})();
