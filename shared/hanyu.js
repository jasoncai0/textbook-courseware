'use strict';
/* 课本插件 · 汉语拼音课（一年级上册拼音单元）
 * 用法：在 course.js 顶层（不要放进 LESSON.init）调用 Hanyu.init(DATA)，再调 Hanzi.init({...})（注音、手写板）。
 *       必须在 deck.js 之前渲染完：deck.js 加载时就统计每页的 data-step。
 * 页面里放容器，模块往里填内容（没有容器的部分自动跳过）：
 *   <div data-hy="letters">   字母卡：四线三格里的字母，按 → 一张张出现并“写”出来；点卡片重放书写
 *   <div data-hy="tones">     声调演示：选 a/o/e，点四个声调，调号描出来，小车沿声调线开过去
 *   <div data-hy="tonequiz">  看调号选声调（自动判对错）
 *   <div data-hy="spell">     拼读：声母卡 + 韵母卡滑到一起 → 音节（带调号）
 *   <div data-hy="scene" data-bg="assets/x.jpg">  情境图：图上热点，点一下冒出字母和儿歌
 *   <div data-hy="write">     书写：四线三格，按 → 依次高亮格子、写出字母；下方描红 + 手写格
 *   <span data-hy-text="a o e"></span>  任意位置画一行四线三格字母（封面标题、板书）；data-hy-cls="hy-draw" 带书写动画
 * 同一种容器要放两处时写 data-key="名字"，数据写成 { 名字: [...] }。
 * DATA = {
 *   letters:  [{ l: 'a', tip: '张大嘴巴 a a a' }],
 *   tones:    ['a', 'o', 'e'],
 *   tonequiz: ['ǎ', 'ō', 'é', 'è'],
 *   spell:    [['b', 'a', 'bā'], ['p', 'ō', 'pō']],          // 声母、韵母、音节
 *   scene:    [{ x: 72, y: 40, l: 'a', say: '小姑娘唱歌 a a a' }], // x / y 是图上的百分比位置
 *   write:    'a o e',                                         // 空格分开
 * }
 * 字母是脚本画的（不依赖字体）：a 是单层 ɑ、g 是单层 ɡ，和课本一致。支持 a–z、ü 和带调号的 āáǎà ōóǒò ēéěè īíǐì ūúǔù ǖǘǚǜ。
 */
const Hanyu = (() => {
  /* 四线三格：四条线在 y = 10 / 40 / 70 / 100；中格 40–70 */
  const LINES = [10, 40, 70, 100];
  const H = 110;
  const GAP = 6;
  const PAD = 8;
  const BOWL_R = 'M5 49A10.5 15 0 1 1 5 61';
  const BOWL_L = 'M25 49A10.5 15 0 1 0 25 61';
  const HUMP = 'M5 50C5 37 25 37 25 50V70';
  /* 每个字母：宽 w，笔画 s（按书写顺序），点 dot（i j ü 的点），cx 调号位置 */
  const GLYPHS = {
    a: { w: 30, cx: 14, s: ['M22 44.5A11 15 0 1 0 22 65.5', 'M25 40V70'] },
    o: { w: 30, s: ['M15 40A12 15 0 1 0 15 70A12 15 0 1 0 15 40'] },
    e: { w: 30, s: ['M4 55H26A11 15 0 1 0 23.5 65'] },
    i: { w: 14, s: ['M7 40V70'], dot: [[7, 27]] },
    u: { w: 30, s: ['M5 40V57C5 74 25 74 25 57', 'M25 40V70'] },
    ü: { w: 30, s: ['M5 40V57C5 74 25 74 25 57', 'M25 40V70'], dot: [[9, 31], [21, 31]] },
    b: { w: 30, s: ['M5 12V70', BOWL_R] },
    p: { w: 30, s: ['M5 40V98', BOWL_R] },
    m: { w: 40, s: ['M5 40V70', 'M5 50C5 38 20 38 20 50V70', 'M20 50C20 38 35 38 35 50V70'] },
    f: { w: 24, s: ['M20 17C17 11 10 12 10 22V70', 'M3 40H19'] },
    d: { w: 30, s: [BOWL_L, 'M25 12V70'] },
    t: { w: 22, s: ['M9 22V62C9 70 15 72 20 67', 'M2 40H18'] },
    n: { w: 30, s: ['M5 40V70', HUMP] },
    l: { w: 12, s: ['M6 12V70'] },
    g: { w: 30, s: [BOWL_L, 'M25 40V88C25 99 12 100 6 95'] },
    k: { w: 26, s: ['M5 12V70', 'M22 41L5 58', 'M11 52L23 70'] },
    h: { w: 30, s: ['M5 12V70', HUMP] },
    j: { w: 16, s: ['M11 40V88C11 99 3 99 1 94'], dot: [[11, 27]] },
    q: { w: 30, s: [BOWL_L, 'M25 40V98'] },
    x: { w: 26, s: ['M4 40L22 70', 'M22 40L4 70'] },
    z: { w: 26, s: ['M4 40H22L4 70H22'] },
    c: { w: 26, s: ['M24 46A11 15 0 1 0 24 64'] },
    s: { w: 24, s: ['M21 45C18 39 5 38 5 47C5 55 20 54 20 62C20 72 6 72 3 65'] },
    r: { w: 22, s: ['M5 40V70', 'M5 52C7 43 14 39 21 42'] },
    y: { w: 28, s: ['M3 40L14 70', 'M25 40L12 82C9 92 6 97 1 97'] },
    w: { w: 40, s: ['M3 40L12 70L20 46L28 70L37 40'] },
    v: { w: 26, s: ['M3 40L13 70L23 40'] },
  };
  const TONED = 'āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ';
  const TONE_BASE = 'aoeiuü';
  const TONE_NAMES = ['一声', '二声', '三声', '四声'];
  const TONE_SAYS = ['一声平，平平稳稳向前走', '二声扬，像小车开上坡', '三声拐弯，先下坡再上坡', '四声降，像小车冲下坡'];
  /* 声调线（200 × 120 的框里）：高 → 低 */
  const TONE_ROADS = ['M15 28H185', 'M15 98L185 22', 'M15 52C70 128 125 118 185 22', 'M15 22L185 102'];

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // 'bā' → [{ ch: 'b' }, { ch: 'a', tone: 1 }]；ɑ ɡ 视同 a g，空格留空
  function parse(text) {
    return [...String(text).normalize('NFC')].map((c) => {
      const t = TONED.indexOf(c);
      if (t >= 0) return { ch: TONE_BASE[Math.floor(t / 4)], tone: (t % 4) + 1 };
      const ch = { ɑ: 'a', ɡ: 'g' }[c] || c.toLowerCase();
      if (ch === ' ') return { ch: ' ' };
      if (!GLYPHS[ch]) console.warn(`Hanyu：不认识的字母 ${c}`); // eslint-disable-line no-console
      return { ch };
    });
  }

  function toneMark(tone, cx) {
    const d = [
      `M${cx - 9} 30H${cx + 9}`,
      `M${cx - 6} 35L${cx + 6} 23`,
      `M${cx - 8} 23L${cx} 33L${cx + 8} 23`,
      `M${cx - 6} 23L${cx + 6} 35`,
    ][tone - 1];
    return `<path class="hy-tone" d="${d}"/>`;
  }

  function glyph(item, order) {
    const g = GLYPHS[item.ch];
    const cx = g.cx || g.w / 2;
    let n = order;
    const strokes = g.s.map((d) => `<path d="${d}" pathLength="1" style="--d:${n++}"/>`).join('');
    // 带调号的 i 不写点；ü 带调号时点和调号都写
    const dots = (item.tone && item.ch === 'i' ? [] : g.dot || []).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" style="--d:${n++}"/>`).join('');
    let tone = item.tone ? toneMark(item.tone, cx).replace('/>', ` pathLength="1" style="--d:${n++}"/>`) : '';
    if (tone && g.dot && item.ch !== 'i') tone = `<g transform="translate(0 -11)">${tone}</g>`; // ü 的调号写在两点上面
    return { svg: strokes + dots + tone, w: g.w, next: n };
  }

  /* 一行四线三格。opts.width: 最小宽度；opts.cells: 画上 / 中 / 下格底色（书写页用）；opts.steps: 每个字母包一层 data-step（从 opts.steps 开始编号） */
  function strip(text, opts = {}) {
    const items = parse(text);
    let x = PAD;
    let order = 0;
    let step = opts.steps || 0;
    const body = items.map((it) => {
      if (it.ch === ' ' || !GLYPHS[it.ch]) { x += 14; return ''; }
      const g = glyph(it, order);
      order = g.next;
      const inner = step ? `<g data-step="${step++}">${g.svg}</g>` : g.svg;
      const out = `<g transform="translate(${x} 0)">${inner}</g>`;
      x += g.w + GAP;
      return out;
    }).join('');
    const W = Math.max(x - GAP + PAD, opts.width || 0);
    const shift = (W - (x - GAP + PAD)) / 2; // 给了更宽的 width 时字母居中
    const cells = opts.cells ? LINES.slice(0, 3).map((y, i) => `<rect class="hy-cell hy-cell-${i}" x="0" y="${y}" width="${W}" height="30"/>`).join('') : '';
    const lines = LINES.map((y, i) => `<line class="hy-line${i === 2 ? ' base' : ''}" x1="0" x2="${W}" y1="${y}" y2="${y}"/>`).join('');
    return `<svg class="hy-strip ${opts.cls || ''}" viewBox="0 0 ${W} ${H}" style="--w:${W}" aria-label="${esc(text)}">${cells}${lines}<g class="hy-ink" transform="translate(${shift} 0)">${body}</g></svg>`;
  }

  // 重新播放书写动画：去掉再加上 hy-draw
  function replay(svg) {
    svg.classList.remove('hy-draw');
    void svg.getBoundingClientRect();
    svg.classList.add('hy-draw');
  }

  /* ---------- 字母卡 ---------- */
  function initLetters(box, letters) {
    box.classList.add('hy-letters');
    box.innerHTML = letters.map((it, i) => `<button type="button" class="hy-card" data-step="${i + 1}">
      ${strip(it.l, { cls: 'hy-draw', width: 64 })}${it.tip ? `<span class="hy-tip">${esc(it.tip)}</span>` : ''}</button>`).join('');
    box.addEventListener('click', (e) => {
      const card = e.target.closest('.hy-card');
      if (card) replay(card.querySelector('svg'));
    });
  }

  /* ---------- 声调演示 ---------- */
  function initTones(box, vowels) {
    box.classList.add('hy-tones');
    box.setAttribute('data-noswipe', '');
    let vowel = vowels[0];
    let tone = 1;
    const toned = (v, t) => TONED[TONE_BASE.indexOf(v) * 4 + t - 1];
    box.innerHTML = `
      <div class="hy-vowels">${vowels.map((v) => `<button type="button" class="btn" data-v="${esc(v)}">${strip(v)}</button>`).join('')}</div>
      <div class="hy-tone-main">
        <div class="hy-big"></div>
        <svg class="hy-road" viewBox="0 0 200 120">
          <line class="hy-five" x1="10" x2="190" y1="22" y2="22"/><line class="hy-five" x1="10" x2="190" y1="102" y2="102"/>
          <path class="hy-road-bg"/><path class="hy-road-on" pathLength="1"/>
          <g class="hy-car"><rect x="-11" y="-14" width="22" height="10" rx="4"/><rect x="-6" y="-19" width="12" height="7" rx="3"/><circle cx="-6" cy="-3" r="3"/><circle cx="6" cy="-3" r="3"/></g>
        </svg>
        <p class="hy-say"></p>
      </div>
      <div class="hy-tone-btns"></div>`;
    const btns = box.querySelector('.hy-tone-btns');
    const road = box.querySelector('.hy-road-on');
    const car = box.querySelector('.hy-car');
    let raf = 0;
    const drive = () => {
      cancelAnimationFrame(raf);
      const len = road.getTotalLength();
      const start = performance.now();
      const DURATION = 1400;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / DURATION);
        const pt = road.getPointAtLength(len * p);
        car.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const show = () => {
      box.querySelectorAll('.hy-vowels .btn').forEach((b) => b.classList.toggle('solid', b.dataset.v === vowel));
      btns.innerHTML = [1, 2, 3, 4].map((t) => `<button type="button" class="hy-tbtn${t === tone ? ' on' : ''}" data-t="${t}">${strip(toned(vowel, t))}<span>${TONE_NAMES[t - 1]}</span></button>`).join('');
      box.querySelector('.hy-big').innerHTML = strip(toned(vowel, tone), { cls: 'hy-draw', width: 60 });
      box.querySelectorAll('.hy-road-bg, .hy-road-on').forEach((p) => p.setAttribute('d', TONE_ROADS[tone - 1]));
      replay(box.querySelector('.hy-road'));
      box.querySelector('.hy-say').textContent = TONE_SAYS[tone - 1];
      drive();
    };
    box.addEventListener('click', (e) => {
      const v = e.target.closest('[data-v]');
      const t = e.target.closest('[data-t]');
      if (v) vowel = v.dataset.v;
      if (t) tone = +t.dataset.t;
      if (v || t) show();
    });
    show();
  }

  /* ---------- 看调号选声调 ---------- */
  function initToneQuiz(box, items) {
    box.classList.add('hy-quiz');
    box.setAttribute('data-noswipe', '');
    box.innerHTML = items.map((s, i) => `<div class="hy-q" data-i="${i}">${strip(s)}
      <span class="hy-q-btns">${TONE_NAMES.map((n, t) => `<button type="button" class="btn" data-t="${t + 1}">${n}</button>`).join('')}</span></div>`).join('');
    box.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-t]');
      if (!btn) return;
      const row = btn.closest('.hy-q');
      const right = (parse(items[+row.dataset.i]).find((it) => it.tone) || {}).tone;
      const ok = +btn.dataset.t === right;
      row.classList.remove('no');
      void row.offsetWidth; // 重新触发抖动
      row.classList.add(ok ? 'ok' : 'no');
      if (ok) row.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    });
  }

  /* ---------- 拼读 ---------- */
  function initSpell(box, pairs) {
    box.classList.add('hy-spell');
    box.setAttribute('data-noswipe', '');
    box.innerHTML = `<div class="hy-spell-list">${pairs.map(([s, y], i) => `<button type="button" class="btn" data-i="${i}">${esc(s)} – ${esc(y)}</button>`).join('')}</div>
      <div class="hy-spell-stage"><div class="hy-sm"></div><span class="hy-plus">+</span><div class="hy-ym"></div><div class="hy-res"></div></div>
      <div class="btns hy-spell-go"><button type="button" class="btn solid" data-go>拼一拼</button><span class="hy-rhyme">前音轻短后音重，两音相连猛一碰</span></div>`;
    const stage = box.querySelector('.hy-spell-stage');
    const pick = (i) => {
      const [s, y, syl] = pairs[i];
      stage.classList.remove('joined');
      box.querySelector('.hy-sm').innerHTML = strip(s);
      box.querySelector('.hy-ym').innerHTML = strip(y);
      box.querySelector('.hy-res').innerHTML = strip(syl);
      box.querySelectorAll('.hy-spell-list .btn').forEach((b) => b.classList.toggle('solid', +b.dataset.i === i));
    };
    box.addEventListener('click', (e) => {
      const item = e.target.closest('[data-i]');
      if (item) pick(+item.dataset.i);
      if (e.target.closest('[data-go]')) {
        stage.classList.remove('joined');
        void stage.offsetWidth;
        stage.classList.add('joined');
        replay(box.querySelector('.hy-res svg'));
      }
    });
    pick(0);
  }

  /* ---------- 情境图 ---------- */
  function initScene(box, spots) {
    box.classList.add('hy-scene');
    box.setAttribute('data-noswipe', '');
    box.innerHTML = `<div class="hz-picwrap"><div class="hz-pic"${box.dataset.bg ? ` data-bg="${esc(box.dataset.bg)}"` : ''}>${spots.map((s, i) => `
      <button type="button" class="hy-spot" style="left:${s.x}%;top:${s.y}%" data-i="${i}" aria-label="${esc(s.l)}"><i></i>
        <span class="hy-bubble">${strip(s.l, { cls: 'hy-draw' })}${s.say ? `<em>${esc(s.say)}</em>` : ''}</span></button>`).join('')}</div></div>`;
    box.removeAttribute('data-bg');
    box.addEventListener('click', (e) => {
      const spot = e.target.closest('.hy-spot');
      if (!spot) return;
      spot.classList.add('open');
      replay(spot.querySelector('svg'));
    });
  }

  /* ---------- 书写：四线三格 ---------- */
  function initWrite(box, text) {
    box.classList.add('hy-write');
    const n = text.replace(/\s/g, '').length;
    box.innerHTML = `<div class="hy-write-main" data-step="1">${strip(text, { cells: true, steps: 2, cls: 'hy-draw' })}
        <span class="hy-cell-tag t0">上格</span><span class="hy-cell-tag t1">中格</span><span class="hy-cell-tag t2">下格</span></div>
      <div class="hy-practice" data-step="${n + 2}" data-noswipe>${strip(text, { cls: 'hy-trace' })}<div class="hy-pad-strip">${strip('', { width: 300 })}<div class="hz-pad" data-pad></div></div></div>`;
  }

  const KINDS = { letters: initLetters, tones: initTones, tonequiz: initToneQuiz, spell: initSpell, scene: initScene, write: initWrite };

  return {
    strip,
    init(data = {}) {
      document.querySelectorAll('[data-hy]').forEach((el) => {
        const kind = el.dataset.hy;
        const d = el.dataset.key ? (data[kind] || {})[el.dataset.key] : data[kind];
        if (KINDS[kind] && d) KINDS[kind](el, d);
      });
      // <span data-hy-text="a o e"></span>：任意位置画一行四线三格字母（封面、板书、提示里用）
      document.querySelectorAll('[data-hy-text]').forEach((el) => { el.innerHTML = strip(el.dataset.hyText, { cls: el.dataset.hyCls || '' }); });
    },
  };
})();
