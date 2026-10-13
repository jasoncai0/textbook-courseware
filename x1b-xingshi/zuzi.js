'use strict';
/* 识字课小组件：换偏旁变新字、归类（拖一拖 / 点一点）、合字。
 * 本文件在 x1b 识字课里各放一份（内容相同）；以后可以并进 shared/hanzi.js。
 * 用法：在 course.js 顶层、Hanzi.init 之前调用 Zuzi.init(DATA)（生成的 data-py 由 Hanzi 注音；combine 生成的 data-step 要在 deck.js 之前出现）。
 * 容器 <div data-zz="种类">，同种放两处时加 data-key="名字"，数据写成 { 名字: ... }。
 *   swap    换偏旁变新字 { base: '青', py: 'qīng', name: '青字家族', items: [{ bs: '氵', z: '清', py: 'qīng', w: '河水清清', wpy: 'hé shuǐ qīng qīng', tip: '有水' }] }
 *           点左边的偏旁：偏旁飞到基本字旁边，合成新字，下面出词语和提示；找到的字收进“家族”。
 *   sort    归类 { buckets: [{ t: '扌', py: '', name: '提手旁', ok: ['打', '拔'] }], cards: [['打', 'dǎ'], …] }   t 可配 py 注音（□ 不占音节）
 *           cards 可省（默认取 ok 里的全部），元素可以是 '打' 或 ['打', 'dǎ']。
 *           填空 / 对对子也用它：t 里的 □ 是空位，放对后字填进空位：{ t: '眼□', ok: ['睛'] }、{ t: '古对□', ok: ['今'] }
 *   combine 合字（按 → 一行一行合起来）[{ parts: ['木', '子'], z: '李', py: 'lǐ', say: '木子李', saypy: 'mù zǐ lǐ', colors: ['#3a8f3a', '#d8322a'] }]
 *           step: n 改成第 n 步（默认第几行就是第几步）；row: true 整行到第 n 步才出现（部件先出现，再合成整字）
 */
const Zuzi = (() => {
  const MERGE_MS = 900;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pyAttr = (py) => (py ? ` data-py="${esc(py)}"` : '');
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  /* ---------- 换偏旁变新字 ---------- */
  function initSwap(box, d) {
    box.classList.add('zz-swap');
    box.setAttribute('data-noswipe', '');
    box.innerHTML = `<div class="zz-bs-list">${d.items.map((it, i) => `<button type="button" class="zz-bs" data-i="${i}">${esc(it.bs)}</button>`).join('')}</div>
      <div class="zz-swap-main">
        <div class="zz-swap-stage">
          <span class="zz-pair"><b class="zz-slot"></b><b class="zz-base">${esc(d.base)}</b></span>
          <span class="zz-new"></span>
        </div>
        <p class="zz-word"></p>
        <p class="zz-tip">${d.py ? `基本字 <b${pyAttr(d.py)}>${esc(d.base)}</b>，` : ''}点左边的偏旁，给它换一换。</p>
      </div>
      <div class="zz-family"><p>${esc(d.name || `${d.base}字家族`)}</p><div class="zz-fam-list"></div></div>`;
    const stage = box.querySelector('.zz-swap-stage');
    const slot = box.querySelector('.zz-slot');
    const neu = box.querySelector('.zz-new');
    const word = box.querySelector('.zz-word');
    const tip = box.querySelector('.zz-tip');
    const fam = box.querySelector('.zz-fam-list');
    box.addEventListener('click', (e) => {
      const btn = e.target.closest('.zz-bs');
      if (!btn) return;
      const it = d.items[+btn.dataset.i];
      box.querySelectorAll('.zz-bs').forEach((b) => b.classList.toggle('on', b === btn));
      btn.classList.add('done');
      slot.textContent = it.bs;
      neu.innerHTML = Hanzi.ruby(it.z, it.py);
      word.innerHTML = it.w ? Hanzi.ruby(it.w, it.wpy) : '';
      tip.textContent = it.tip || '';
      restart(stage, 'go');
      [word, tip].forEach((el) => restart(el, 'late'));
      if (!fam.querySelector(`[data-z="${it.z}"]`)) {
        setTimeout(() => fam.insertAdjacentHTML('beforeend', `<span data-z="${esc(it.z)}">${Hanzi.ruby(it.z, it.py)}</span>`), MERGE_MS);
      }
    });
  }

  /* ---------- 归类：拖过去，或先点卡片再点框 ---------- */
  function initSort(box, d) {
    box.classList.add('zz-sort');
    box.setAttribute('data-noswipe', '');
    const cards = (d.cards || d.buckets.flatMap((b) => b.ok)).map((c) => [].concat(c)).sort(() => Math.random() - 0.5);
    const hole = (t, n) => esc(t).replace('□', `<span class="zz-hole" style="min-width:${n + .15}em"></span>`); // 空位按答案字数留宽
    box.innerHTML = `<div class="zz-buckets${d.buckets.some((b) => b.t.includes('□')) ? ' fill' : ''}">${d.buckets.map((b, i) => `
        <div class="zz-bk" data-i="${i}" data-ok="${esc(b.ok.join(','))}"><p class="zz-bk-t"><span${pyAttr(b.py)}>${hole(b.t, [...b.ok[0]].length)}</span>${b.name ? `<small>${esc(b.name)}</small>` : ''}</p><div class="zz-bk-in"></div></div>`).join('')}</div>
      <div class="zz-cards">${cards.map(([z, py]) => `<button type="button" class="zz-card" data-z="${esc(z)}"${pyAttr(py)}>${esc(z)}</button>`).join('')}</div>`;
    let sel = null;
    let drag = null;
    const place = (card, bk) => {
      if (!bk) return;
      const b = d.buckets[+bk.dataset.i];
      const h = bk.querySelector('.zz-hole:empty');
      if (!b.ok.includes(card.dataset.z) || (bk.querySelector('.zz-hole') && !h)) {
        [card, bk].forEach((el) => restart(el, 'wrong'));
        return;
      }
      const copy = card.cloneNode(true);
      copy.className = 'zz-got';
      (h || bk.querySelector('.zz-bk-in')).appendChild(copy);
      card.classList.add('done');
      bk.classList.toggle('full', bk.querySelectorAll('.zz-got').length === b.ok.length);
      box.classList.toggle('all-done', !box.querySelector('.zz-card:not(.done)'));
    };
    box.addEventListener('pointerdown', (e) => {
      const card = e.target.closest('.zz-card:not(.done)');
      if (!card) return;
      card.setPointerCapture(e.pointerId);
      drag = { card, x: e.clientX, y: e.clientY, moved: false };
    });
    box.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (Math.hypot(dx, dy) > 6) drag.moved = true;
      if (drag.moved) { drag.card.classList.add('dragging'); drag.card.style.translate = `${dx}px ${dy}px`; }
    });
    box.addEventListener('pointerup', (e) => {
      if (!drag) return;
      const { card, moved } = drag;
      drag = null;
      card.classList.remove('dragging');
      card.style.translate = '';
      if (moved) {
        place(card, document.elementsFromPoint(e.clientX, e.clientY).map((el) => el.closest('.zz-bk')).find(Boolean));
        return;
      }
      sel = sel === card ? null : card;
      box.querySelectorAll('.zz-card').forEach((c) => c.classList.toggle('sel', c === sel));
    });
    box.addEventListener('click', (e) => {
      const bk = e.target.closest('.zz-bk');
      if (!bk || !sel) return;
      place(sel, bk);
      sel.classList.remove('sel');
      sel = null;
    });
  }

  /* ---------- 合字：部件靠拢，出现整字 ---------- */
  function initCombine(box, list) {
    box.classList.add('zz-combine');
    box.innerHTML = list.map((it, i) => {
      const n = it.step || i + 1;
      const st = it.row ? '' : ` data-step="${n}"`; // row：整行第 n 步出现再合；默认：部件一直在，第 n 步合
      return `<div class="zz-cb${it.row ? ' row' : ''}"${it.row ? ` data-step="${n}"` : ''}>
      <span class="zz-parts">${it.parts.map((p, k) => `<b${it.colors ? ` style="color:${it.colors[k]}"` : ''}>${esc(p)}</b>`).join('<i>+</i>')}</span>
      <span class="zz-eq"${st}>→</span>
      <span class="zz-whole"${st}${pyAttr(it.py)}>${esc(it.z)}</span>
      ${it.say ? `<span class="zz-say"${st}${pyAttr(it.saypy)}>${esc(it.say)}</span>` : ''}
    </div>`;
    }).join('');
  }

  const KINDS = { swap: initSwap, sort: initSort, combine: initCombine };
  return {
    init(data = {}) {
      document.querySelectorAll('[data-zz]').forEach((el) => {
        const kind = el.dataset.zz;
        const d = el.dataset.key ? (data[kind] || {})[el.dataset.key] : data[kind];
        if (KINDS[kind] && d) KINDS[kind](el, d);
      });
    },
  };
})();
