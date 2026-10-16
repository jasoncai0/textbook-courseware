'use strict';
/* 七上 1.2 活动 思考 · 本课互动：折纸动画、火柴棒三角形、三种数法、月历方框（核心）、3×3 配对、旅游 5 天、社团投票、条形码校验。
 * 通用部分见 ../shared/math.js；所有图形由坐标计算绘制。 */
const { board, tex, slider } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const boards = [];
const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
function animate(ms, onFrame, done) {
  const t0 = performance.now();
  const tick = (now) => {
    const u = Math.min(1, (now - t0) / ms);
    onFrame(ease(u));
    if (u < 1) requestAnimationFrame(tick); else if (done) done();
  };
  requestAnimationFrame(tick);
}

/* ---------- 第 3 页：折纸（图 1-1）----------
 * 长方形 12 × 8，A(0,0)、B(12,0)、C(12,8)、D(0,8)。折痕 DE：x + y = 8，E(8,0)。
 * 折叠是绕 DE 的空间翻转：A 在折痕上的垂足 M(4,4)，翻转角 πt 时投影 A' = M + (A − M)·cos(πt)，t = 1 时 A' = F(8,8)。 */
const FOLD_MSG = {
  flat: '点“① 折叠”：把左下角沿虚线折上去，让纸的左边 AD 和上边 DC 重合。',
  folded: '折好了：左边 AD 落在上边上，点 A 落到 F。点“② 剪去多余部分”：沿 EF 剪掉右边的长条。',
  cut: '剪掉了右边的长条。点“③ 展开”看看。',
  open: '展开后得到四边形 AEFD，虚线是折痕——它是什么图形？',
};
function initFold() {
  const s = { t: 0, strip: 0, phase: 'flat', busy: false };
  const b = board($('foldBoard'), { x: [-0.9, 13.4], y: [-1, 9.2], w: 600, axes: false, grid: false });
  const A1 = () => { const c = Math.cos(Math.PI * s.t); return [4 - 4 * c, 4 - 4 * c]; };
  b.poly([[0, 8], [8, 0], [8, 8]], { cls: 'paper' });
  b.poly(() => [[8 + s.strip * 5, 0], [12 + s.strip * 5, 0], [12 + s.strip * 5, 8], [8 + s.strip * 5, 8]], { cls: 'paper strip' });
  const flap = b.poly(() => [[0, 8], A1(), [8, 0]], { cls: 'paper' });
  b.seg([[0, 8], [8, 0]], { cls: 'crease' });
  b.seg(() => (s.phase === 'folded' ? [[8, 0], [8, 8]] : [[8, 0], [8, 0]]), { cls: 'cutline' });
  b.text([0, 0], 'A', { cls: 'lb', dx: -22, dy: 22 });
  b.text([0, 8], 'D', { cls: 'lb', dx: -22, dy: -4 });
  b.text(() => (s.phase === 'flat' ? null : [8, 0]), 'E', { cls: 'lb', dx: 4, dy: 22 });
  b.text(() => (s.phase === 'open' ? [8, 8] : null), 'F', { cls: 'lb', dx: 4, dy: -6 });
  b.text(() => (s.strip < 0.5 ? [12, 0] : null), 'B', { cls: 'lb', dx: 4, dy: 22 });
  b.text(() => (s.strip < 0.5 ? [12, 8] : null), 'C', { cls: 'lb', dx: 4, dy: -6 });
  b.onUpdate = () => {
    flap.setAttribute('class', s.t > 0.5 ? 'paper back' : 'paper');
    $('foldMsg').textContent = FOLD_MSG[s.phase];
    $('foldBoard').querySelector('svg').style.setProperty('--strip-o', String(1 - s.strip));
  };
  const run = (ms, f, phase) => {
    s.busy = true;
    animate(ms, (u) => { f(u); b.update(); }, () => { s.busy = false; s.phase = phase; b.update(); mark(); });
  };
  const mark = () => {
    const nextA = { flat: 'fold', folded: 'cut', cut: 'open', open: 'reset' }[s.phase];
    $('foldBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x.dataset.a === nextA));
  };
  $('foldBtns').addEventListener('click', (e) => {
    const a = e.target.closest('[data-a]')?.dataset.a;
    if (!a || s.busy) return;
    if (a === 'fold' && s.phase === 'flat') run(1400, (u) => { s.t = u; }, 'folded');
    if (a === 'cut' && s.phase === 'folded') run(1000, (u) => { s.strip = u; }, 'cut');
    if (a === 'open' && s.phase === 'cut') run(1400, (u) => { s.t = 1 - u; }, 'open');
    if (a === 'reset') { Object.assign(s, { t: 0, strip: 0, phase: 'flat' }); b.update(); mark(); }
  });
  boards.push(b);
}

/* ---------- 第 5、6 页：火柴棒三角形（图 1-2）----------
 * 第 0 个三角形 3 根；以后每个三角形新添 2 根，与前一个共用 1 根。共 2n + 1 根。 */
const H = Math.sqrt(3) / 2;
function sticksOf(n) {
  const out = [
    { p: [0, 0], q: [0.5, H], tri: 0, first: true },
    { p: [0, 0], q: [1, 0], tri: 0 },
    { p: [1, 0], q: [0.5, H], tri: 0, shared: n > 1 },
  ];
  for (let k = 1; k < n; k++) {
    const shared = k < n - 1;
    if (k % 2) {
      const x = (k - 1) / 2 + 0.5;
      out.push({ p: [x, H], q: [x + 1, H], tri: k }, { p: [x + 0.5, 0], q: [x + 1, H], tri: k, shared });
    } else {
      const x = k / 2;
      out.push({ p: [x, 0], q: [x + 1, 0], tri: k }, { p: [x + 1, 0], q: [x + 0.5, H], tri: k, shared });
    }
  }
  return out;
}
const WOOD = '#c99a5b';
function drawMatches(svg, n, maxN, color) {
  const U = 64;
  const W = ((maxN + 1) / 2 + 0.6) * U;
  const X = (x) => (x + 0.3) * U;
  const Y = (y) => (H + 0.25 - y) * U;
  svg.setAttribute('viewBox', `0 0 ${W} ${(H + 0.5) * U}`);
  svg.innerHTML = sticksOf(n).map((st, i) => {
    const [x1, y1, x2, y2] = [X(st.p[0]), Y(st.p[1]), X(st.q[0]), Y(st.q[1])];
    const [hx, hy] = [x2 - (x2 - x1) * 0.1, y2 - (y2 - y1) * 0.1]; // 火柴头在终点一侧
    const c = color(st, i);
    return `<line x1="${x1 + (x2 - x1) * 0.06}" y1="${y1 + (y2 - y1) * 0.06}" x2="${hx}" y2="${hy}" stroke="${c}" stroke-width="6" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="6.5" fill="#e0679a"/>`;
  }).join('');
}
function initMatch() {
  const show = (n) => {
    $('matchNV').textContent = `${n} 个`;
    $('matchS').textContent = `${2 * n + 1} 根`;
    drawMatches($('matchFig'), n, 10, (st) => (st.tri === n - 1 && n > 1 ? '#d9711c' : WOOD));
  };
  slider($('matchN'), show);
}
const COUNT_COLOR = {
  a: (st) => (st.tri === 0 ? '#1d6fa5' : ['#d9711c', '#2f7d6b'][st.tri % 2]),
  b: (st) => (st.first ? '#1d6fa5' : ['#d9711c', '#2f7d6b'][st.tri % 2]),
  c: (st) => (st.shared ? '#c0392b' : WOOD),
};
function initCount() {
  const pick = (m) => {
    drawMatches($('countFig'), 10, 10, COUNT_COLOR[m]);
    $('countBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x.dataset.m === m));
  };
  $('countBtns').addEventListener('click', (e) => { const m = e.target.closest('[data-m]')?.dataset.m; if (m) pick(m); });
  pick('a');
}

/* ---------- 第 7 页：月历（课本 p8：1 日是星期二，共 31 天）---------- */
const FIRST_COL = 2;
const DAYS = 31;
const dayAt = (r, c) => { const d = r * 7 + c - FIRST_COL + 1; return d >= 1 && d <= DAYS ? d : 0; };
function calHtml(mark = () => '') {
  const head = '日一二三四五六'.split('').map((w, c) => `<b class="wk" style="grid-area:1/${c + 1}">${w}</b>`).join('');
  const cells = Array.from({ length: 35 }, (_, i) => {
    const [r, c] = [Math.floor(i / 7), i % 7];
    const d = dayAt(r, c);
    return `<span class="day ${mark(d)}" style="grid-area:${r + 2}/${c + 1}" data-r="${r}" data-c="${c}">${d || ''}</span>`;
  }).join('');
  return head + cells;
}
function initCal() {
  const s = { n: 2, pos: { 2: [0, 5], 3: [1, 1] } };
  const host = $('cal');
  host.innerHTML = `${calHtml()}<i class="frame-box" id="calFrame"></i>`;
  const fits = (r, c, n) => {
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (r + i > 4 || c + j > 6 || !dayAt(r + i, c + j)) return false;
    return true;
  };
  const render = () => {
    const [r, c] = s.pos[s.n];
    const f = $('calFrame');
    f.style.gridRow = `${r + 2} / span ${s.n}`;
    f.style.gridColumn = `${c + 1} / span ${s.n}`;
    f.className = `frame-box f${s.n}`;
    const a = dayAt(r, c);
    const out = $('calRead');
    if (s.n === 2) {
      out.innerHTML = `<table class="mini"><tr><td>${a}</td><td>${a + 1}</td></tr><tr><td>${a + 7}</td><td>${a + 8}</td></tr></table>`
        + `<p>斜对角：$${a}+${a + 8}=${2 * a + 8}$，$${a + 1}+${a + 7}=${2 * a + 8}$</p><p>左右差 $1$，上下差 $7$</p>`;
    } else {
      const nums = [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => a + 7 * i + j));
      const sum = nums.reduce((x, y) => x + y, 0);
      out.innerHTML = `<p>9 个数的和：$${sum}$</p><p>中间的数：$${a + 8}$，$${a + 8}\\times9=${9 * (a + 8)}$</p>`;
    }
    tex(out);
  };
  let grab = null;
  const cellAt = (e) => {
    const el = document.elementsFromPoint(e.clientX, e.clientY).find((x) => x.classList?.contains('day'));
    return el ? [+el.dataset.r, +el.dataset.c] : null;
  };
  host.addEventListener('pointerdown', (e) => {
    const cell = cellAt(e);
    if (!cell) return;
    const [r, c] = s.pos[s.n];
    const inside = cell[0] >= r && cell[0] < r + s.n && cell[1] >= c && cell[1] < c + s.n;
    grab = inside ? [cell[0] - r, cell[1] - c] : [0, 0];
    host.setPointerCapture(e.pointerId);
    move(e);
  });
  const move = (e) => {
    if (!grab) return;
    const cell = cellAt(e);
    if (!cell) return;
    const [r, c] = [clamp(cell[0] - grab[0], 0, 4), clamp(cell[1] - grab[1], 0, 6)];
    if (fits(r, c, s.n)) { s.pos[s.n] = [r, c]; render(); }
  };
  host.addEventListener('pointermove', move);
  host.addEventListener('pointerup', () => { grab = null; });
  host.addEventListener('pointercancel', () => { grab = null; });
  $('calSize').addEventListener('click', (e) => {
    const n = +e.target.closest('[data-n]')?.dataset.n;
    if (!n) return;
    s.n = n;
    $('calSize').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', +x.dataset.n === n));
    render();
  });
  render();
}

/* ---------- 第 8 页：3×3 方框中关于中间数对称的四对 ---------- */
function initNine() {
  const nums = [[7, 8, 9], [14, 15, 16], [21, 22, 23]];
  const P = (i, j) => [65 + j * 100, 45 + i * 80];
  const pairs = [[[0, 0], [2, 2]], [[0, 1], [2, 1]], [[0, 2], [2, 0]], [[1, 0], [1, 2]]];
  const COLORS = ['#1d6fa5', '#d9711c', '#2f7d6b', '#8e44ad'];
  let on = false;
  const draw = () => {
    const lines = on ? pairs.map(([p, q], k) => { const [a, b] = [P(...p), P(...q)]; return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${COLORS[k]}" stroke-width="4" opacity=".75"/>`; }).join('') : '';
    const cells = nums.flatMap((row, i) => row.map((v, j) => {
      const [x, y] = P(i, j);
      const k = pairs.findIndex((pr) => pr.some(([a, b]) => a === i && b === j));
      const fill = i === 1 && j === 1 ? '#fde7cf' : '#fff8d6';
      const stroke = on && k >= 0 ? COLORS[k] : '#c9b86a';
      return `<rect x="${x - 42}" y="${y - 32}" width="84" height="64" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${on && k >= 0 ? 4 : 2}"/><text x="${x}" y="${y + 10}" text-anchor="middle" class="nine-t">${v}</text>`;
    })).join('');
    $('nineFig').innerHTML = lines + cells;
    $('nineBtn').textContent = on ? '取消连线' : '连一连：两两配对';
  };
  $('nineBtn').addEventListener('click', () => { on = !on; draw(); });
  draw();
}

/* ---------- 第 9 页：旅游 5 天 ---------- */
function initTrip() {
  const show = (st) => {
    const days = [0, 1, 2, 3, 4].map((k) => st + k);
    const sum = days.reduce((x, y) => x + y, 0);
    $('trip').innerHTML = calHtml((d) => (days.includes(d) ? (d === st + 2 ? 'hot mid' : 'hot') : ''));
    $('tripSV').textContent = `${st} 日`;
    const msg = $('tripMsg');
    msg.className = `tip feedback ${sum === 20 ? 'fb-ok' : ''}`;
    msg.innerHTML = `${days.join(' + ')} = <b>${sum}</b>　中间一天：${st + 2} 日，${st + 2} × 5 = ${5 * (st + 2)}${sum === 20 ? '　<b>和是 20！</b>' : ''}`;
  };
  slider($('tripS'), show);
}

/* ---------- 第 10 页：社团调查（课本 p9 调查表中的 7 个社团）---------- */
const CLUBS = ['文学社', '英语俱乐部', '阳光艺术团', '电脑与网络', '篮球队', '航模世界', '生物天地'];
function initVote() {
  let cnt = CLUBS.map(() => 0);
  $('vote').innerHTML = CLUBS.map((c, i) => `<button type="button" class="btn" data-i="${i}">${c} +1</button>`).join('');
  const render = () => {
    const max = Math.max(1, ...cnt);
    $('bars').innerHTML = CLUBS.map((c, i) => `<span class="bl">${c}</span><span class="bar"><i style="width:${(cnt[i] / max) * 100}%"></i></span><b class="bv">${cnt[i]}</b>`).join('');
    const total = cnt.reduce((a, b) => a + b, 0);
    const top = Math.max(...cnt);
    const msg = $('voteMsg');
    msg.className = `tip feedback ${total ? 'fb-ok' : ''}`;
    msg.textContent = total
      ? `共 ${total} 票。最喜欢的社团：${CLUBS.filter((_, i) => cnt[i] === top).join('、')}（${top} 票）。`
      : '还没有人投票：每位同学点一次自己最喜欢的社团。';
  };
  $('vote').addEventListener('click', (e) => {
    const i = e.target.closest('[data-i]')?.dataset.i;
    if (i === undefined) return;
    cnt = cnt.map((v, k) => (k === +i ? v + 1 : v));
    render();
  });
  $('voteClr').addEventListener('click', () => { cnt = CLUBS.map(() => 0); render(); });
  render();
}

/* ---------- 第 11 页：条形码校验码（EAN-13：奇数位 ×1、偶数位 ×3，补足到整十）---------- */
const ISBN13 = '9787534593383';
const checkDigit = (d12) => (10 - (d12.reduce((s, d, i) => s + d * (i % 2 ? 3 : 1), 0) % 10)) % 10;
function initIsbn() {
  let digits = ISBN13.split('').map(Number);
  const render = () => {
    const c = checkDigit(digits.slice(0, 12));
    const ok = c === digits[12];
    $('isbn').innerHTML = `<div class="digits">${digits.map((d, i) => `<button type="button" class="dg${i === 12 ? ' chk' : ''}${String(d) !== ISBN13[i] ? ' chg' : ''}" data-i="${i}" ${i === 12 ? 'disabled' : ''}>${d}</button>`).join('')}</div>`
      + `<p class="tip feedback ${ok ? 'fb-ok' : 'fb-warn'}">按前 12 位算出的校验码是 <b>${c}</b>，印在最后的是 <b>${digits[12]}</b>：${ok ? '一致，号码没有错。' : '对不上！说明前面有数字读错了。'}</p>`
      + '<div class="btns" data-noswipe><button type="button" class="btn" data-reset="1">还原课本的号码</button></div>';
  };
  $('isbn').setAttribute('data-noswipe', '');
  $('isbn').addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { digits = ISBN13.split('').map(Number); render(); return; }
    const i = e.target.closest('[data-i]')?.dataset.i;
    if (i === undefined || +i === 12) return;
    digits = digits.map((d, k) => (k === +i ? (d + 1) % 10 : d));
    render();
  });
  render();
}

window.LESSON = {
  init() {
    initFold();
    initMatch();
    initCount();
    initCal();
    initNine();
    initTrip();
    initVote();
    initIsbn();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
