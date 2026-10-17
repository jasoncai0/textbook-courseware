'use strict';
/* 课本插件 · 小数乘除（五上第五单元用；不依赖 math.js，加载在 course.js 之前）
 * 1. 乘法竖式逐步演示：MDec.mul(el, '2.35', '3', { notes: { A: '235 个百分之一', P: '705 个百分之一' } })
 *    末位对齐 → 先不看小数点（看作整数）→ 逐位乘 → 相加 → 数出小数位数点小数点 → 去掉末尾的 0。
 *    notes.A / notes.B 在“看作整数”那一步出现在因数右边，notes.P 在点小数点那一步出现在积的右边。
 * 2. 除法竖式逐步演示：MDec.div(el, '9.6', 3) —— 商的数位与被除数对齐、商的小数点与被除数的小数点对齐、余数添 0 继续除。
 *    两者都返回 { next(), reset(), end() }；数值全部由代码按整数运算精确算出。
 * 3. 小数点滑轨：MDec.rail(el, { value: '5.04', ops: [10, 100, 1000], dir: 'mul' | 'div', drag: false, onChange })
 *    数字不动、小数点一格一格地滑；位数不够自动补 0（橙色），没有意义的 0 变淡。
 *    返回 { set(value), shift(k), reset(), state() }；drag: true 时可以用手指 / 鼠标拖小数点。
 */
const MDec = (() => {
  const h = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const INT_UNIT = ['一', '十', '百', '千', '万'];
  const FRAC_UNIT = ['十分之一', '百分之一', '千分之一', '万分之一', '十万分之一'];
  const INT_PLACE = ['个位', '十位', '百位', '千位', '万位'];
  const FRAC_PLACE = ['十分位', '百分位', '千分位', '万分位', '十万分位'];
  const parse = (s) => {
    const [i, f = ''] = String(s).split('.');
    return { digits: (i + f).split('').map(Number), dec: f.length, text: String(s) };
  };

  /* ---------- 通用：逐步演示的外壳 ---------- */
  function stepper(host, cells, captions, extra = {}) {
    const el = typeof host === 'string' ? document.querySelector(host) : host;
    el.classList.add('mdec');
    el.setAttribute('data-noswipe', '');
    el.innerHTML = '';
    const wrap = h('div', 'md-wrap');
    const grid = h('div', 'md-grid');
    grid.style.gridTemplateColumns = `repeat(${extra.cols}, 1.05em) ${extra.noteCol ? 'auto' : ''}`;
    grid.style.gridTemplateRows = `repeat(${Math.max(...cells.map((c) => c.r)) + 1}, 1.3em)`; // 先把所有行的位置留好，演示时版面不跳
    cells.forEach((c) => {
      const e = h('span', `md-c ${c.cls || ''}`, c.ch);
      e.style.gridRow = c.r + 1;
      e.style.gridColumn = c.span ? `${c.c + 1} / span ${c.span}` : c.c + 1;
      c.el = e;
      grid.appendChild(e);
    });
    wrap.appendChild(grid);
    const cap = h('p', 'md-cap');
    const bar = h('div', 'md-bar');
    const bNext = h('button', 'btn solid', '下一步 ▶');
    const bEnd = h('button', 'btn', '直接看结果');
    const bReset = h('button', 'btn', '↺ 重来');
    [bNext, bEnd, bReset].forEach((b) => { b.type = 'button'; bar.appendChild(b); });
    el.append(wrap, cap, bar);
    let k = 0;
    const last = captions.length - 1;
    const show = () => {
      cells.forEach((c) => {
        const vis = c.s <= k;
        c.el.classList.toggle('vis', vis);
        c.el.classList.toggle('now', c.s === k && k > 0);
        // tog: { 类名: [从第几步起, 到第几步前] }
        Object.entries(c.tog || {}).forEach(([name, [a, b]]) => c.el.classList.toggle(name, k >= a && (b === undefined || k < b)));
      });
      cap.innerHTML = `<b>${k === 0 ? '第 0 步' : `第 ${k} 步`}</b>　${captions[k]}`;
      bNext.disabled = k >= last;
      bEnd.disabled = k >= last;
      if (extra.onStep) extra.onStep(k, last);
    };
    const api = {
      next() { if (k < last) { k += 1; show(); } },
      end() { k = last; show(); },
      reset() { k = 0; show(); },
      get step() { return k; },
      last,
    };
    bNext.addEventListener('click', api.next);
    bEnd.addEventListener('click', api.end);
    bReset.addEventListener('click', api.reset);
    show();
    return api;
  }

  /* ---------- 乘法竖式 ---------- */
  const PLACE_N = ['个位', '十位', '百位', '千位'];
  function mul(host, a, b, opt = {}) {
    const A = parse(a);
    const B = parse(b);
    const nA = +A.digits.join('');
    const nB = +B.digits.join('');
    const p = A.dec + B.dec;
    const prod = nA * nB;
    const raw = String(prod);
    const padLead = Math.max(0, p + 1 - raw.length); // 积的位数不够，前面用 0 补足
    const pStr = '0'.repeat(padLead) + raw;
    const partials = B.digits.slice().reverse().map((d, j) => ({ d, j, v: nA * d }))
      .filter((x, _, all) => x.d !== 0 || all.length === 1);
    const multi = partials.length > 1;
    const cols = Math.max(A.digits.length, B.digits.length, pStr.length, ...partials.map((x) => String(x.v).length + x.j)) + 1;
    const C = (fr) => cols - 1 - fr; // 第 fr 位（个位 = 0）所在的列
    const cells = [];
    const caps = [];
    // 先排好每一步的编号
    let s = 2;
    const partStep = partials.map(() => s++);
    const sumStep = multi ? s++ : -1;
    const ptStep = p ? s++ : -1;
    const frac = p ? pStr.slice(-p) : '';
    const zeros = frac.length - frac.replace(/0+$/, '').length;
    const zStep = zeros ? s++ : -1;
    const endStep = s;
    const INF = 1e9;
    const restore = ptStep > 0 ? ptStep : INF;

    const factor = (X, r) => X.digits.forEach((d, i) => {
      const fr = X.digits.length - 1 - i;
      const tog = {};
      if (X.dec && fr === X.dec) Object.assign(tog, { pt: [0], ptoff: [1, restore] });
      if (d === 0 && i === 0 && X.digits.length > 1 && fr >= X.dec) tog.fade = [1, restore]; // 0.8 里的 0
      cells.push({ r, c: C(fr), ch: String(d), s: 0, tog });
    });
    factor(A, 0);
    factor(B, 1);
    cells.push({ r: 1, c: 0, ch: '×', s: 0, cls: 'op' });
    cells.push({ r: 1, c: 0, span: cols, ch: '', s: 0, cls: 'ul' });
    caps[0] = '列竖式：两个因数的<b>末位对齐</b>（不是小数点对齐）。';
    const asInt = [A, B].filter((x) => x.dec).map((x) => `把 ${x.text} 看作 ${+x.digits.join('')}`);
    caps[1] = `先不看小数点：${asInt.join('，')}，按<b>整数乘法</b>来算。`;

    let row = 2;
    partials.forEach((x, n) => {
      const str = String(x.v);
      str.split('').forEach((ch, i) => cells.push({ r: row, c: C(x.j + str.length - 1 - i), ch, s: partStep[n] }));
      caps[partStep[n]] = multi
        ? `用第二个因数${PLACE_N[x.j]}上的 ${x.d} 去乘 ${nA}：${nA} × ${x.d} = ${x.v}，末位和${PLACE_N[x.j]}对齐。`
        : `${nA} × ${x.d} = ${x.v}。`;
      row += 1;
    });
    let prodRow = row - 1;
    if (multi) {
      cells.push({ r: row - 1, c: 0, span: cols, ch: '', s: sumStep, cls: 'ul' });
      raw.split('').forEach((ch, i) => cells.push({ r: row, c: C(raw.length - 1 - i), ch, s: sumStep }));
      caps[sumStep] = `把乘得的积加起来：${partials.map((x) => x.v * 10 ** x.j).join(' + ')} = ${prod}。`;
      prodRow = row;
    }
    if (p) {
      for (let i = 0; i < padLead; i += 1) cells.push({ r: prodRow, c: C(pStr.length - 1 - i), ch: '0', s: ptStep, cls: 'add0' });
      cells.filter((c) => c.r === prodRow && !c.span && c.c >= C(p - 1)).forEach((c) => { c.tog = { ...c.tog, hot: [ptStep, ptStep + 1] }; });
      const ptCell = cells.find((c) => c.r === prodRow && !c.span && c.c === C(p));
      ptCell.tog = { ...ptCell.tog, pt: [ptStep, zeros === p ? zStep : undefined], ptnow: [ptStep, ptStep + 1] };
      caps[ptStep] = `两个因数一共有 ${A.dec} + ${B.dec} = <b>${p}</b> 位小数，从积的<b>右边起数出 ${p} 位</b>，点上小数点${padLead ? '（位数不够，用 0 补足）' : ''}：${pStr.slice(0, -p)}.${frac}。`;
    }
    if (zeros) {
      for (let i = 0; i < zeros; i += 1) {
        const c = cells.find((x) => x.r === prodRow && !x.span && x.c === C(i));
        c.tog = { ...c.tog, strike: [zStep] };
      }
      caps[zStep] = `小数末尾的 0 可以去掉（小数的性质）：${pStr.slice(0, -p)}.${frac} = <b>${move(pStr, -p)}</b>。`;
    }
    const result = move(pStr, -p);
    caps[endStep] = `所以 ${a} × ${b} = <b>${result}</b>。`;
    const notes = opt.notes || {};
    const hasNote = Boolean(notes.A || notes.B || notes.P);
    const addNote = (r, html, at) => { if (html) cells.push({ r, c: cols, ch: '', s: at, cls: 'note-r', html }); };
    addNote(0, notes.A, 1);
    addNote(1, notes.B, 1);
    addNote(prodRow, notes.P, p ? ptStep : endStep);
    const api = stepper(host, cells, caps, { cols, noteCol: hasNote, onStep: opt.onStep });
    cells.filter((c) => c.html).forEach((c) => { c.el.innerHTML = c.html; });
    return Object.assign(api, { result });
  }

  /* ---------- 除法竖式（除数是整数） ---------- */
  function div(host, a, d, opt = {}) {
    const A = parse(a);
    const L = A.digits.length - A.dec; // 整数部分的位数
    const maxExtra = opt.maxExtra ?? 4;
    const dl = String(d).length;
    const col = (i) => dl + 1 + i;
    const place = (i) => (i < L ? INT_PLACE[L - 1 - i] : FRAC_PLACE[i - L]);
    const unit = (i) => (i < L ? INT_UNIT[L - 1 - i] : FRAC_UNIT[i - L]);
    const cells = [];
    const caps = ['列竖式：除数写在左边，被除数写在里面，从被除数的<b>最高位</b>除起。'];
    const QR = 0;
    const DR = 1;
    String(d).split('').forEach((ch, i) => cells.push({ r: DR, c: i, ch, s: 0, cls: 'dvs' }));
    cells.push({ r: DR, c: dl, ch: ')', s: 0, cls: 'brk' });
    const dCells = A.digits.map((v, i) => {
      const c = { r: DR, c: col(i), ch: String(v), s: 0, tog: A.dec && i === L - 1 ? { pt: [0] } : {} };
      cells.push(c);
      return c;
    });

    let cur = 0;
    let started = false;
    let s = 1;
    let row = DR; // 正在除的数所在的行
    let qPoint = false;
    let qStr = '';
    let i = 0;
    let extra = 0;
    const qCells = [];
    for (;;) {
      const fromDividend = i < A.digits.length;
      if (!fromDividend && (cur === 0 || extra >= maxExtra)) break;
      if (i === L && !qPoint) {
        const last = qCells[qCells.length - 1];
        last.tog = { pt: [s], ptnow: [s, s + 1] };
        if (A.dec) {
          caps[s] = '接下来要除十分位了：商的小数点要和被除数的小数点<b>对齐</b>。';
        } else {
          dCells[L - 1].tog = { pt: [s], ptoff: [s] };
          caps[s] = `${a} 是整数，可以看作 ${a}.0。接下来要除十分位了：在商的个位后面点上小数点，和被除数的小数点<b>对齐</b>。`;
        }
        qPoint = true;
        s += 1;
      }
      const v = fromDividend ? A.digits[i] : 0;
      const prevCur = cur;
      if (!fromDividend) extra += 1;
      cur = cur * 10 + v;
      let pre = '';
      if (i > 0) {
        if (row !== DR) cells.push({ r: row, c: col(i), ch: String(v), s, cls: fromDividend ? 'down' : 'add0' });
        else if (!fromDividend) cells.push({ r: DR, c: col(i), ch: '0', s, cls: 'add0' });
        if (!fromDividend) pre = `余下 ${prevCur} 个${unit(i - 1)}，在后面<b>添 0</b>，就是 ${cur} 个${unit(i)}。`;
        else if (row !== DR) pre = `落下${place(i)}上的 ${v}。`;
      }
      const q = Math.floor(cur / d);
      const showQ = q > 0 || started || i >= L - 1;
      if (showQ) {
        started = true;
        const qc = { r: QR, c: col(i), ch: String(q), s, cls: 'q' };
        qCells.push(qc);
        cells.push(qc);
        qStr += String(q);
      }
      if (q > 0) {
        const pr = q * d;
        const rem = cur - pr;
        const ps = String(pr);
        ps.split('').forEach((ch, k) => cells.push({ r: row + 1, c: col(i - ps.length + 1 + k), ch, s }));
        const w = Math.max(ps.length, String(cur).length);
        cells.push({ r: row + 1, c: col(i - w + 1), span: w, ch: '', s, cls: 'ul' });
        const done = rem === 0 && i + 1 >= A.digits.length;
        if (rem > 0 || done) String(rem).split('').forEach((ch, k, arr) => cells.push({ r: row + 2, c: col(i - arr.length + 1 + k), ch, s }));
        caps[s] = `${pre}${cur} 个${unit(i)} ÷ ${d}，商 <b>${q}</b>，写在<b>${place(i)}</b>上；${q} × ${d} = ${pr}，${cur} − ${pr} = ${rem}。`;
        row += 2;
        cur = rem;
      } else {
        caps[s] = showQ
          ? `${pre}${cur} 个${unit(i)}不够 ${d} 个，不够商 1，<b>${place(i)}上商 0</b>。`
          : `${pre}${cur} 个${unit(i)}不够 ${d} 个，${place(i)}上不够商 1，就和下一位合起来除。`;
      }
      s += 1;
      i += 1;
    }
    const nFrac = Math.max(0, i - L);
    const qText = move(qStr, -nFrac);
    caps[s] = cur === 0 ? `余数是 0，除尽了。${a} ÷ ${d} = <b>${qText}</b>。` : `${a} ÷ ${d} ≈ ${qText}……`;
    const width = Math.max(i, A.digits.length);
    cells.push({ r: DR, c: col(0), span: width, ch: '', s: 0, cls: 'ovl' });
    const api = stepper(host, cells, caps, { cols: col(width), onStep: opt.onStep });
    return Object.assign(api, { result: qText });
  }

  /* ---------- 小数点滑轨 ---------- */
  const LABELS = { '-4': '千', '-3': '百', '-2': '十', '-1': '个', 0: '十分', 1: '百分', 2: '千分', 3: '万分' };
  function rail(host, opt = {}) {
    const el = typeof host === 'string' ? document.querySelector(host) : host;
    el.classList.add('mrail');
    el.setAttribute('data-noswipe', '');
    const PAD = opt.pad ?? 4;
    const st = { D: '', p: 0, k: 0, base: '' };
    const track = h('div', 'mr-track');
    const labels = h('div', 'mr-labels');
    const dot = h('span', 'mr-dot');
    el.innerHTML = '';
    el.append(labels, track);
    const ptIndex = () => st.p + st.k;
    // 由“数字串 + 小数点位置”得到数，并标出哪些 0 是补的、哪些 0 没有意义
    const evaluate = () => {
      const q = ptIndex();
      const lo = Math.min(0, q - 1);
      const hi = Math.max(st.D.length, q);
      const slots = [];
      for (let j = lo; j < hi; j += 1) slots.push({ j, ch: j >= 0 && j < st.D.length ? st.D[j] : '0', pad: j < 0 || j >= st.D.length });
      const intPart = slots.filter((x) => x.j < q);
      const fracPart = slots.filter((x) => x.j >= q);
      let a = 0;
      while (a < intPart.length - 1 && intPart[a].ch === '0') { intPart[a].mute = true; a += 1; }
      for (let b = fracPart.length - 1; b >= 0 && fracPart[b].ch === '0'; b -= 1) fracPart[b].mute = true;
      const iStr = intPart.filter((x) => !x.mute).map((x) => x.ch).join('') || '0';
      const fStr = fracPart.filter((x) => !x.mute).map((x) => x.ch).join('');
      return { slots, q, text: fStr ? `${iStr}.${fStr}` : iStr };
    };
    const lo = () => -PAD;
    const hi = () => st.D.length + PAD;
    const draw = () => {
      const ev = evaluate();
      const map = Object.fromEntries(ev.slots.map((x) => [x.j, x]));
      track.innerHTML = '';
      labels.innerHTML = '';
      for (let j = lo(); j < hi(); j += 1) {
        const x = map[j];
        const box = h('span', `mr-box ${x ? '' : 'empty'} ${x && x.pad ? 'pad' : ''} ${x && x.mute ? 'mute' : ''}`, x ? x.ch : '');
        track.appendChild(box);
        const lb = LABELS[j - ev.q];
        labels.appendChild(h('span', 'mr-lb', lb ? `${lb}${lb.length > 1 ? '' : ''}` : ''));
      }
      dot.style.setProperty('--g', ev.q - lo());
      track.appendChild(dot);
      el.style.setProperty('--n', hi() - lo());
      if (opt.onChange) opt.onChange({ k: st.k, base: st.base, text: ev.text });
    };
    const set = (value) => {
      const P = parse(value);
      st.D = P.digits.join('');
      st.p = st.D.length - P.dec;
      st.k = 0;
      st.base = String(value);
      draw();
    };
    // 一格一格地滑，学生能数出“移动了几位”
    let timer = null;
    const shift = (k, stepMs = opt.stepMs ?? 380) => {
      clearInterval(timer);
      const target = Math.max(-st.p - PAD + 1, Math.min(st.D.length - st.p + PAD, k));
      if (!stepMs) { st.k = target; draw(); return; }
      timer = setInterval(() => {
        if (st.k === target) { clearInterval(timer); return; }
        st.k += Math.sign(target - st.k);
        draw();
      }, stepMs);
    };
    if (opt.drag) {
      let on = false;
      const toGap = (e) => {
        const r = track.getBoundingClientRect();
        const n = hi() - lo();
        const g = Math.round(((e.clientX - r.left) / r.width) * n);
        return Math.max(1, Math.min(n - 1, g)) + lo();
      };
      track.addEventListener('pointerdown', (e) => { on = true; track.setPointerCapture(e.pointerId); st.k = toGap(e) - st.p; draw(); e.preventDefault(); });
      track.addEventListener('pointermove', (e) => { if (!on) return; const k = toGap(e) - st.p; if (k !== st.k) { st.k = k; draw(); } });
      const stop = () => { on = false; };
      track.addEventListener('pointerup', stop);
      track.addEventListener('pointercancel', stop);
      el.classList.add('drag');
    }
    set(opt.value ?? '1');
    return {
      set,
      shift,
      reset() { clearInterval(timer); st.k = 0; draw(); },
      state: () => ({ k: st.k, base: st.base, text: evaluate().text }),
    };
  }

  /** 把 "21.5" 的小数点移动 k 位后的数（字符串，精确，不用浮点） */
  function move(value, k) {
    const P = parse(value);
    const D = P.digits.join('');
    const q = D.length - P.dec + k;
    const full = q <= 0 ? `0.${'0'.repeat(-q)}${D}` : q >= D.length ? D + '0'.repeat(q - D.length) : `${D.slice(0, q)}.${D.slice(q)}`;
    const [i, f = ''] = full.split('.');
    const ii = i.replace(/^0+(?=\d)/, '');
    const ff = f.replace(/0+$/, '');
    return ff ? `${ii}.${ff}` : ii;
  }

  /** 静态小竖式：<div class="mini-v" data-rows="1.2|×4|0.48" data-ul="1"></div>
   *  每行按数位右对齐，小数点画在两位之间；行首 + × 是运算符号；行尾 _ 表示空一位（演示没对齐的错误写法）。 */
  function mini(el) {
    const rows = el.dataset.rows.split('|');
    const ul = (el.dataset.ul || '').split(',').filter(Boolean).map(Number);
    const parsed = rows.map((t) => {
      const op = /^[+×−÷]/.test(t) ? t[0] : '';
      const body = op ? t.slice(1) : t;
      const cells = [];
      body.split('').forEach((ch) => {
        if (ch === '.') { cells[cells.length - 1].pt = true; return; }
        cells.push({ ch: ch === '_' ? '' : ch });
      });
      return { op, cells };
    });
    const cols = Math.max(...parsed.map((r) => r.cells.length + (r.op ? 1 : 0))) + (parsed.some((r) => r.op) ? 0 : 0);
    const grid = h('div', 'md-grid');
    grid.style.gridTemplateColumns = `repeat(${cols}, 1.05em)`;
    parsed.forEach((r, ri) => {
      const put = (ch, c, cls) => {
        const e = h('span', `md-c vis ${cls || ''}`, ch);
        e.style.gridRow = ri + 1;
        e.style.gridColumn = c + 1;
        grid.appendChild(e);
      };
      if (r.op) put(r.op, 0, 'op');
      r.cells.forEach((c, i) => put(c.ch, cols - r.cells.length + i, c.pt ? 'pt' : ''));
      if (ul.includes(ri)) {
        const line = h('span', 'md-c vis ul');
        line.style.gridRow = ri + 1;
        line.style.gridColumn = `1 / span ${cols}`;
        grid.appendChild(line);
      }
    });
    el.innerHTML = '';
    el.appendChild(grid);
  }
  document.querySelectorAll('.mini-v[data-rows]').forEach(mini);

  return { mul, div, rail, move, mini };
})();
window.MDec = MDec;
