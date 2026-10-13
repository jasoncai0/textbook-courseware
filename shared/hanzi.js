'use strict';
/* 课本插件 · 识字课 + 低年级通用（一、二年级）
 * 用法：在 course.js 顶层（不要放进 LESSON.init）调用 Hanzi.init(DATA)；拼音课先调 Hanyu.init 再调本函数。
 *       必须在 deck.js 之前渲染完：deck.js 加载时就统计每页的 data-step。
 * 通用（不需要数据，自动处理整页）：
 *   <p data-py="tiān qì liáng le">天气凉了，</p>  注音：每个汉字配一个音节（标点自动跳过），"_" 表示这个字上面不注音（如“一会儿”的“儿”）。
 *                                                 元素里可以有 <span class="mark" data-step> 等标签。字幕 .subs p 也这样写。
 *   <span class="hz-blank" data-step="n">黄</span> 背诵挖空：先显示空格，第 n 步出现
 *   <div class="hz-paras">…<p>…</p></div>         数自然段：点一段，段首空格处出现序号，.hz-paras-n 显示总数
 *   <div data-pad></div>                           手写格：鼠标 / 手指写一写，右上角 × 擦掉
 *   <span class="hz-label" data-py="tiān" data-step="1" style="left:50%;top:14%">天</span>  看图识字：放在 .hz-pic 图上的大字标签
 * 数据驱动（容器 data-hz="种类"，同种放两处时加 data-key="名字"，数据写成 { 名字: ... }）：
 *   cards   生字卡   [{ z: '天', py: 'tiān', words: [['天空', 'tiān kōng']], bs: '一', bh: 4 }]   bs 部首，bh 笔画数
 *   evolve  字理演变 [{ z: '人', old: '人', note: '像一个侧身站着的人' }]   old 写 OLD 里的键，会意字写数组 ['禾', '火']
 *   shapes  自定义古字形 { 鸟: ['M.. 路径', ...] }（100×100 坐标，按笔画写），会并入 OLD
 *   pick    选一选   [{ q: 'tiān', ans: '天', opts: ['天', '大', '人'] }]  q 是题面（拼音或汉字，汉字可配 py 注音）；
 *           也可以用 old: '人'（古字形猜今字）或 pic: 'assets/x.jpg'（看图选字，pos / size 裁出局部，如 pos: '50% 0%', size: '220%'）
 *   match   拖字配图 { bg: 'assets/x.jpg', items: [{ z: '天', x: 50, y: 14, hint: 'tiān' }] }  x / y 是图上的百分比位置
 *   apples  摘苹果   [['秋', 'qiū'], ...]  最多 12 个
 *   write   写字     [{ z: '了', py: 'le', bs: '乛', bh: 2 }]  田字格：范字 + 两个描红 + 两个手写格
 * 古字形是按字理画的简笔示意，不是严格的甲骨文，页面上统一标“示意”。
 */
const Hanzi = (() => {
  const HAN = /\p{Script=Han}/u;
  const LATIN = /^[a-zA-Zāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü\s]+$/;
  const NEXT_DELAY = 900;
  const APPLE_SLOTS = [[30, 24], [50, 14], [70, 24], [20, 42], [40, 34], [60, 34], [80, 42], [30, 58], [50, 50], [70, 58], [42, 68], [60, 70]];
  const circle = (cx, cy, r) => `M${cx} ${cy - r}A${r} ${r} 0 1 0 ${cx} ${cy + r}A${r} ${r} 0 1 0 ${cx} ${cy - r}`;
  /* 古字形简笔（100 × 100，按笔画顺序） */
  const OLD = {
    人: ['M56 10C50 40 52 62 70 92', 'M53 40C45 52 35 58 22 62'],
    大: ['M50 10V58', 'M16 36Q50 26 84 36', 'M50 58L26 92', 'M50 58L74 92'],
    天: [circle(50, 17, 10), 'M50 27V60', 'M16 42Q50 33 84 42', 'M50 60L26 93', 'M50 60L74 93'],
    子: [circle(50, 23, 13), 'M18 54Q34 40 50 47Q66 40 82 54', 'M50 36C50 60 44 78 52 94'],
    日: ['M50 14A34 36 0 1 0 50 86A34 36 0 1 0 50 14', 'M40 50H60'],
    月: ['M62 10C24 22 22 78 62 90C44 72 44 28 62 10', 'M46 46L54 54'],
    山: ['M8 86L24 46L36 72L50 16L64 72L76 46L92 86Z'],
    水: ['M50 8C40 26 60 40 48 56C40 68 54 80 50 94', 'M30 24L24 36', 'M28 52L20 66', 'M70 24L76 36', 'M72 52L80 66'],
    火: ['M50 10C42 36 28 52 30 72C32 90 68 90 70 72C72 52 58 36 50 10', 'M30 50L18 36', 'M70 50L82 36'],
    木: ['M50 8V94', 'M50 30L26 12', 'M50 30L74 12', 'M50 70L26 90', 'M50 70L74 90'],
    禾: ['M50 94V24', 'M50 24C60 12 74 14 78 28', 'M50 52L26 40', 'M50 52L74 40', 'M50 78L30 94', 'M50 78L70 94'],
    田: ['M14 14H86V86H14Z', 'M50 14V86', 'M14 50H86'],
    口: ['M10 30H90', 'M18 30Q22 82 50 82Q78 82 82 30'],
    目: ['M8 50Q50 8 92 50Q50 92 8 50Z', circle(50, 50, 15)],
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rb = (ch, s) => `<ruby>${esc(ch)}<rt>${s && s !== '_' ? esc(s) : ''}</rt></ruby>`;
  const latin = (s) => (LATIN.test(s) ? ' hz-latin' : '');

  /* '天空' + 'tiān kōng' → ruby；标点不占音节 */
  function ruby(text, py) {
    if (!py) return esc(text);
    const syl = py.trim().split(/\s+/);
    let k = 0;
    const out = [...text].map((ch) => (HAN.test(ch) ? rb(ch, syl[k++]) : esc(ch))).join('');
    if (k !== syl.length) console.warn(`注音数量不符：${text} / ${py}`); // eslint-disable-line no-console
    return out;
  }

  // 元素里的文字逐个汉字配音节，保留里面的标签
  function rubify(el) {
    const syl = el.dataset.py.trim().split(/\s+/);
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let k = 0;
    nodes.forEach((node) => {
      if (!HAN.test(node.nodeValue)) return;
      const span = document.createElement('span');
      span.innerHTML = [...node.nodeValue].map((ch) => (HAN.test(ch) ? rb(ch, syl[k++]) : esc(ch))).join('');
      node.replaceWith(...span.childNodes);
    });
    if (k !== syl.length) console.warn(`注音数量不符（${k} 字 / ${syl.length} 音）：${el.textContent}`); // eslint-disable-line no-console
    el.classList.add('py');
  }

  const oldSvg = (key, cls = '') => {
    const strokes = OLD[key];
    if (!strokes) { console.warn(`Hanzi：OLD 里没有 ${key}`); return ''; } // eslint-disable-line no-console
    return `<svg class="hz-old ${cls}" viewBox="0 0 100 100">${strokes.map((d, i) => `<path d="${d}" pathLength="1" style="--d:${i}"/>`).join('')}</svg>`;
  };
  const tzg = (z, cls = '') => `<span class="hz-tzg ${cls}">${esc(z)}</span>`;

  /* ---------- 生字卡 ---------- */
  function initCards(box, cards) {
    box.classList.add('hz-cards');
    box.setAttribute('data-noswipe', '');
    box.innerHTML = `<div class="hz-card-list">${cards.map((c, i) => `<button type="button" class="hz-chip" data-i="${i}">${rb(c.z, c.py)}</button>`).join('')}</div>
      <div class="hz-card-detail"></div>`;
    const detail = box.querySelector('.hz-card-detail');
    const show = (i) => {
      const c = cards[i];
      box.querySelectorAll('.hz-chip').forEach((b) => b.classList.toggle('on', +b.dataset.i === i));
      detail.innerHTML = `<div class="hz-card-big"><span class="hz-py">${esc(c.py)}</span>${tzg(c.z)}</div>
        <div class="hz-card-info">
          ${c.bs || c.bh ? `<p class="hz-meta">${c.bs ? `部首 <b>${esc(c.bs)}</b>` : ''}${c.bh ? `　<b>${c.bh}</b> 画` : ''}</p>` : ''}
          ${(c.words || []).length ? `<p class="hz-words">${c.words.map(([w, p]) => `<span>${ruby(w, p)}</span>`).join('')}</p>` : ''}
        </div>`;
      detail.classList.remove('pop');
      void detail.offsetWidth;
      detail.classList.add('pop');
    };
    box.addEventListener('click', (e) => {
      const chip = e.target.closest('.hz-chip');
      if (chip) show(+chip.dataset.i);
    });
    show(0);
  }

  /* ---------- 字理演变：古字形（示意）→ 楷书，按 → 一步步出现 ---------- */
  function initEvolve(box, items) {
    box.classList.add('hz-evolve');
    let step = 1;
    box.innerHTML = items.map((it) => {
      const olds = [].concat(it.old || it.z);
      const row = `<div class="hz-ev">
        <div class="hz-ev-old" data-step="${step}">${olds.map((k) => `<figure>${oldSvg(k, 'hz-draw')}<figcaption>${olds.length > 1 ? esc(k) : '古字形（示意）'}</figcaption></figure>`).join('<b class="hz-plus">+</b>')}</div>
        <span class="hz-arrow" data-step="${step + 1}">→</span>
        <div class="hz-ev-now" data-step="${step + 1}">${tzg(it.z)}</div>
        ${it.note ? `<p class="hz-ev-note" data-step="${step + 1}">${esc(it.note)}</p>` : ''}
      </div>`;
      step += 2;
      return row;
    }).join('');
    box.addEventListener('click', (e) => {
      const svg = e.target.closest('.hz-old');
      if (!svg) return;
      svg.classList.remove('hz-draw');
      void svg.getBoundingClientRect();
      svg.classList.add('hz-draw');
    });
  }

  /* ---------- 选一选：一题一题来，答对自动下一题 ---------- */
  function initPick(box, items) {
    box.classList.add('hz-pick');
    box.setAttribute('data-noswipe', '');
    box.innerHTML = `<div class="hz-pick-q"></div><div class="hz-pick-opts"></div>
      <p class="hz-pick-msg"></p><div class="hz-dots">${items.map(() => '<i></i>').join('')}</div>`;
    const q = box.querySelector('.hz-pick-q');
    const opts = box.querySelector('.hz-pick-opts');
    const msg = box.querySelector('.hz-pick-msg');
    let i = 0;
    let timer = 0;
    const show = (n) => {
      clearTimeout(timer);
      i = n;
      const it = items[i];
      box.classList.remove('done');
      q.className = `hz-pick-q${it.pic ? ' pic' : it.old ? ' old' : latin(it.q || '')}`;
      q.style.backgroundImage = it.pic ? `url('${it.pic}')` : '';
      q.style.backgroundPosition = it.pos || '';
      q.style.backgroundSize = it.size || '';
      q.innerHTML = it.pic ? '' : it.old ? oldSvg(it.old, 'hz-draw') : ruby(it.q, it.py);
      opts.innerHTML = it.opts.map((o) => `<button type="button" class="hz-opt${latin(o)}" data-o="${esc(o)}">${esc(o)}</button>`).join('');
      msg.textContent = '';
      box.querySelectorAll('.hz-dots i').forEach((d, k) => { d.className = k < i ? 'done' : k === i ? 'cur' : ''; });
    };
    box.addEventListener('click', (e) => {
      if (e.target.closest('[data-again]')) { show(0); return; }
      const btn = e.target.closest('.hz-opt');
      if (!btn || box.classList.contains('done')) return;
      btn.classList.remove('wrong');
      void btn.offsetWidth;
      if (btn.dataset.o !== items[i].ans) { btn.classList.add('wrong'); msg.textContent = '再想想'; return; }
      btn.classList.add('right');
      msg.textContent = '对啦！';
      if (i + 1 < items.length) { timer = setTimeout(() => show(i + 1), NEXT_DELAY); return; }
      box.classList.add('done');
      box.querySelectorAll('.hz-dots i').forEach((d) => { d.className = 'done'; });
      msg.innerHTML = '全部答对了！ <button type="button" class="btn" data-again>再来一次</button>';
    });
    show(0);
  }

  /* ---------- 拖字配图：拖过去，或先点字再点位置 ---------- */
  function initMatch(box, data) {
    box.classList.add('hz-match');
    box.setAttribute('data-noswipe', '');
    const cards = data.items.map((it) => it.z).sort(() => Math.random() - 0.5);
    box.innerHTML = `<div class="hz-picwrap"><div class="hz-pic" data-bg="${esc(data.bg)}">${data.items.map((it) => `
        <span class="hz-target" style="left:${it.x}%;top:${it.y}%" data-z="${esc(it.z)}"><small>${esc(it.hint || '')}</small></span>`).join('')}</div></div>
      <div class="hz-tray">${cards.map((z) => `<button type="button" class="hz-mcard" data-z="${esc(z)}">${esc(z)}</button>`).join('')}</div>`;
    let sel = null;
    let drag = null;
    const place = (card, target) => {
      if (!target || target.classList.contains('done')) return;
      if (target.dataset.z === card.dataset.z) {
        target.classList.add('done');
        target.textContent = card.dataset.z;
        card.classList.add('done');
        box.classList.toggle('all-done', !box.querySelector('.hz-mcard:not(.done)'));
      } else {
        [card, target].forEach((el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); });
      }
    };
    box.addEventListener('pointerdown', (e) => {
      const card = e.target.closest('.hz-mcard:not(.done)');
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
        const hit = document.elementsFromPoint(e.clientX, e.clientY).find((el) => el.classList.contains('hz-target'));
        place(card, hit);
        return;
      }
      sel = sel === card ? null : card;
      box.querySelectorAll('.hz-mcard').forEach((c) => c.classList.toggle('sel', c === sel));
    });
    box.addEventListener('click', (e) => {
      const target = e.target.closest('.hz-target');
      if (!target || !sel) return;
      place(sel, target);
      sel.classList.remove('sel');
      sel = null;
    });
  }

  /* ---------- 摘苹果：点一个，读一个，落进篮子 ---------- */
  function initApples(box, list) {
    box.classList.add('hz-apples');
    box.setAttribute('data-noswipe', '');
    const items = list.slice(0, APPLE_SLOTS.length).map((it) => [].concat(it));
    box.innerHTML = `<div class="hz-tree"><i class="hz-trunk"></i><i class="hz-crown"></i>${items.map(([z], i) => `
        <button type="button" class="hz-apple" style="left:${APPLE_SLOTS[i][0]}%;top:${APPLE_SLOTS[i][1]}%" data-i="${i}">${esc(z)}</button>`).join('')}</div>
      <div class="hz-basket"><p>篮子里有 <b>0</b> 个</p><div class="hz-picked"></div><button type="button" class="btn" data-reset>放回树上</button></div>`;
    const count = box.querySelector('.hz-basket b');
    const picked = box.querySelector('.hz-picked');
    box.addEventListener('click', (e) => {
      if (e.target.closest('[data-reset]')) {
        box.querySelectorAll('.hz-apple').forEach((a) => a.classList.remove('picked'));
        picked.innerHTML = '';
        count.textContent = '0';
        return;
      }
      const apple = e.target.closest('.hz-apple:not(.picked)');
      if (!apple) return;
      const [z, py] = items[+apple.dataset.i];
      apple.classList.add('picked');
      picked.insertAdjacentHTML('beforeend', `<span>${rb(z, py)}</span>`);
      count.textContent = picked.children.length;
    });
  }

  /* ---------- 写字：田字格 范字 + 描红 + 手写格 ---------- */
  function initWrite(box, list) {
    box.classList.add('hz-write');
    box.innerHTML = list.map((c) => `<div class="hz-wrow">
      <p class="hz-wpy">${esc(c.py)}<small>${c.bs ? `部首 ${esc(c.bs)}` : ''}${c.bh ? `　${c.bh} 画` : ''}</small></p>
      <div class="hz-cells" data-noswipe>${tzg(c.z)}${tzg(c.z, 'trace')}${tzg(c.z, 'trace')}<span class="hz-tzg"><span data-pad></span></span><span class="hz-tzg"><span data-pad></span></span></div>
    </div>`).join('');
  }

  /* ---------- 手写格 ---------- */
  function initPad(el) {
    el.classList.add('hz-pad');
    el.setAttribute('data-noswipe', '');
    el.innerHTML = '<canvas></canvas><button type="button" class="hz-clear" aria-label="擦掉">×</button>';
    const cv = el.querySelector('canvas');
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    const fit = () => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const dpr = window.devicePixelRatio || 1;
      cv.width = r.width * dpr;
      cv.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = Math.max(3, Math.min(r.width, r.height) / 20);
      ctx.strokeStyle = '#2b2420';
    };
    new ResizeObserver(fit).observe(el);
    let last = null;
    const at = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); last = at(e); });
    cv.addEventListener('pointermove', (e) => {
      if (!last) return;
      const p = at(e);
      ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke();
      last = p;
    });
    cv.addEventListener('pointerup', () => { last = null; });
    el.querySelector('.hz-clear').addEventListener('click', () => ctx.clearRect(0, 0, cv.width, cv.height));
  }

  /* ---------- 数自然段 ---------- */
  function initParas(box) {
    box.setAttribute('data-noswipe', '');
    box.addEventListener('click', (e) => {
      const p = e.target.closest('p');
      if (!p || !box.contains(p) || p.dataset.n) return;
      const n = box.querySelectorAll('p[data-n]').length + 1;
      p.dataset.n = n;
      const out = box.closest('.slide').querySelector('.hz-paras-n');
      if (out) out.textContent = n;
    });
  }

  const KINDS = { cards: initCards, evolve: initEvolve, pick: initPick, match: initMatch, apples: initApples, write: initWrite };

  return {
    ruby,
    OLD,
    init(data = {}) {
      Object.assign(OLD, data.shapes || {});
      document.querySelectorAll('[data-hz]').forEach((el) => {
        const kind = el.dataset.hz;
        const d = el.dataset.key ? (data[kind] || {})[el.dataset.key] : data[kind];
        if (KINDS[kind] && d) KINDS[kind](el, d);
      });
      document.querySelectorAll('[data-py]').forEach(rubify);
      document.querySelectorAll('[data-pad]').forEach(initPad);
      document.querySelectorAll('.hz-paras').forEach(initParas);
    },
  };
})();
