'use strict';
/* 课本插件 · 数论小组件（五下“因数与倍数”单元用；加载在 course.js 之前，不依赖 math.js）
 * 1. 数表：const t = MNum.table(el, { from: 1, to: 100, cols: 10, tools: { o: (n) => n % 2 === 0, t: (n) => n % 5 === 0 } });
 *    学生选工具（○ / △）后点格子做记号；tools[k](n) 为假时记号变红（标错了）。
 *    t.use('o') 选工具；t.mark(n, k, on)；t.auto('o', ms) 依次自动标完；t.clear(k)；
 *    t.hl(fn) 给满足 fn 的格子加底色（fn 为 null 清除）；t.strike(n) 划掉（筛法用）；t.cell(n) 取格子。
 * 2. 维恩图：MNum.venn(el, { la: '8 的因数', lb: '12 的因数', mid: '公因数', nums: [1,2,3,4,6,8,12], inA, inB, more: false })
 *    先点一个数，再点它该去的区域（只属于左边 / 两边都属于 / 只属于右边）；放错会提示原因。.fill() 一键放好。
 */
const MNum = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
    if (parent) parent.appendChild(e);
    return e;
  };

  /* ---------- 数表 ---------- */
  function table(host, opt) {
    const el = typeof host === 'string' ? document.querySelector(host) : host;
    const { from = 1, to = 100, cols = 10, tools = {} } = opt;
    el.classList.add('ntab');
    el.style.setProperty('--cols', cols);
    el.setAttribute('data-noswipe', '');
    const cells = new Map();
    for (let n = from; n <= to; n += 1) {
      const c = document.createElement('button');
      c.type = 'button';
      c.className = 'nc';
      c.textContent = n;
      c.dataset.n = n;
      el.appendChild(c);
      cells.set(n, c);
    }
    let tool = Object.keys(tools)[0] || null;
    const timers = [];
    const api = {
      cell: (n) => cells.get(n),
      use(k) { tool = k; },
      mark(n, k, on = true) {
        const c = cells.get(n);
        if (!c) return;
        c.classList.toggle(`m-${k}`, on);
        const bad = on && tools[k] && !tools[k](n);
        c.classList.toggle(`bad-${k}`, Boolean(bad));
        if (opt.onChange) opt.onChange(api);
      },
      marked: (k) => [...cells.keys()].filter((n) => cells.get(n).classList.contains(`m-${k}`)),
      clear(k) {
        timers.splice(0).forEach(clearTimeout);
        cells.forEach((c) => c.classList.remove(`m-${k}`, `bad-${k}`));
        if (opt.onChange) opt.onChange(api);
      },
      auto(k, ms = 60, done) {
        const list = [...cells.keys()].filter((n) => tools[k](n));
        list.forEach((n, i) => timers.push(setTimeout(() => {
          api.mark(n, k, true);
          if (i === list.length - 1 && done) done();
        }, i * ms)));
      },
      hl(fn, cls = 'hl') { cells.forEach((c, n) => c.classList.toggle(cls, Boolean(fn && fn(n)))); },
      strike(n, on = true) { const c = cells.get(n); if (c) c.classList.toggle('x', on); },
      reset() {
        timers.splice(0).forEach(clearTimeout);
        cells.forEach((c) => { c.className = 'nc'; });
      },
    };
    el.addEventListener('click', (e) => {
      const c = e.target.closest('.nc');
      if (!c || !tool || opt.readonly) return;
      const n = +c.dataset.n;
      api.mark(n, tool, !c.classList.contains(`m-${tool}`));
    });
    return api;
  }

  /* 工具条：<div class="ntools" data-for="tabId"> 里放 <button data-k="o">… */
  function tools(bar, tab) {
    const el = typeof bar === 'string' ? document.querySelector(bar) : bar;
    el.setAttribute('data-noswipe', '');
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-k]');
      if (!b) return;
      el.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
      tab.use(b.dataset.k);
    });
  }

  /* ---------- 维恩图 ---------- */
  // 三个区域的落点（viewBox 600×300；左椭圆中心 220、右椭圆中心 380，半轴 170×112）
  const SLOTS = {
    a: [[100, 115], [158, 115], [86, 158], [148, 158], [100, 201], [158, 201], [122, 242]],
    ab: [[278, 118], [322, 118], [278, 160], [322, 160], [278, 202], [322, 202]],
    b: [[442, 115], [500, 115], [452, 158], [514, 158], [442, 201], [500, 201], [478, 242]],
  };
  const REGION_NAME = { a: '只在左边', ab: '中间（两边都有）', b: '只在右边' };

  function venn(host, opt) {
    const el = typeof host === 'string' ? document.querySelector(host) : host;
    el.classList.add('nvenn');
    el.setAttribute('data-noswipe', '');
    const svg = mk('svg', { viewBox: '0 0 600 300', 'aria-label': `${opt.la}和${opt.lb}的维恩图` }, el);
    const zone = (k, attrs) => mk('ellipse', { ...attrs, class: `vz vz-${k}` }, svg);
    zone('a', { cx: 220, cy: 165, rx: 170, ry: 112 });
    zone('b', { cx: 380, cy: 165, rx: 170, ry: 112 });
    // 公共部分：两个椭圆的交集用裁剪路径填色
    const id = `vc${Math.random().toString(36).slice(2, 7)}`;
    const cp = mk('clipPath', { id }, mk('defs', {}, svg));
    mk('ellipse', { cx: 220, cy: 165, rx: 170, ry: 112 }, cp);
    mk('ellipse', { cx: 380, cy: 165, rx: 170, ry: 112, 'clip-path': `url(#${id})`, class: 'vz vz-ab' }, svg);
    mk('text', { x: 150, y: 36, class: 'vlab a' }, svg).textContent = opt.la;
    mk('text', { x: 450, y: 36, class: 'vlab b' }, svg).textContent = opt.lb;
    if (opt.mid) mk('text', { x: 300, y: 296, class: 'vlab ab' }, svg).textContent = `↑ ${opt.mid}`;
    if (opt.more) {
      [[128, 270], [300, 252], [472, 270]].forEach(([x, y]) => { mk('text', { x, y, class: 'vmore' }, svg).textContent = '…'; });
    }
    const layer = mk('g', {}, svg);
    const pool = document.createElement('div');
    pool.className = 'vpool';
    const msg = document.createElement('p');
    msg.className = 'vmsg';
    el.append(pool, msg);
    const where = (n) => (opt.inA(n) && opt.inB(n) ? 'ab' : opt.inA(n) ? 'a' : 'b');
    const used = { a: 0, ab: 0, b: 0 };
    let picked = null;
    const say = (t, cls) => { msg.textContent = t; msg.className = `vmsg ${cls || ''}`; };

    const place = (chip) => {
      const n = +chip.dataset.n;
      const k = where(n);
      const [x, y] = SLOTS[k][used[k] % SLOTS[k].length];
      used[k] += 1;
      const t = mk('text', { x, y, class: `vnum ${k}` }, layer);
      t.textContent = n;
      chip.remove();
      picked = null;
      if (!pool.querySelector('.vchip')) {
        say('全部放好了！看看中间那一块。', 'ok');
        if (opt.onDone) opt.onDone();
      }
    };
    const chips = () => {
      pool.innerHTML = '';
      opt.nums.forEach((n) => {
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'vchip';
        c.dataset.n = n;
        c.textContent = n;
        pool.appendChild(c);
      });
      say('先点一个数，再点它该去的地方。');
    };
    chips();
    pool.addEventListener('click', (e) => {
      const c = e.target.closest('.vchip');
      if (!c) return;
      pool.querySelectorAll('.vchip').forEach((x) => x.classList.toggle('on', x === c));
      picked = c;
      say(`${c.dataset.n} 应该放在哪儿？点图里的区域。`);
    });
    svg.addEventListener('click', (e) => {
      if (!picked) return;
      const r = svg.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 600;
      const y = ((e.clientY - r.top) / r.height) * 300;
      const inL = ((x - 220) / 170) ** 2 + ((y - 165) / 112) ** 2 <= 1;
      const inR = ((x - 380) / 170) ** 2 + ((y - 165) / 112) ** 2 <= 1;
      if (!inL && !inR) return;
      const k = inL && inR ? 'ab' : inL ? 'a' : 'b';
      const n = +picked.dataset.n;
      if (k === where(n)) { say(`对！${n} 放在${REGION_NAME[k]}。`, 'ok'); place(picked); return; }
      const why = `${n} ${opt.inA(n) ? '是' : '不是'}${opt.la}，${opt.inB(n) ? '是' : '不是'}${opt.lb}。`;
      say(`再想想：${why}`, 'no');
      picked.classList.add('shake');
      setTimeout(() => picked && picked.classList.remove('shake'), 400);
    });
    return {
      fill() { pool.querySelectorAll('.vchip').forEach(place); },
      reset() {
        layer.innerHTML = '';
        Object.keys(used).forEach((k) => { used[k] = 0; });
        chips();
      },
    };
  }

  /* 一个数的全部因数（从小到大） */
  const factors = (n) => {
    const s = [];
    for (let i = 1; i <= n; i += 1) if (n % i === 0) s.push(i);
    return s;
  };
  const isPrime = (n) => n > 1 && factors(n).length === 2;

  return { table, tools, venn, factors, isPrime };
})();
window.MNum = MNum;
