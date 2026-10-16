'use strict';
/* 高一上 1.1 集合的概念与表示 · 本课互动：把数分拣进集合圈（课本 p5 初中作业）、描述法“筛子”。通用部分见 ../shared/math.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 第 3 页：分拣圈 ---------- */
// 每个数：显示用的 TeX、数值、是否整数（有限小数都是分数）
const NUMS = [
  { k: '15', t: '15', v: 15, int: true },
  { k: 'm1/9', t: '-\\frac19', v: -1 / 9, int: false },
  { k: '-5', t: '-5', v: -5, int: true },
  { k: '2/15', t: '\\frac{2}{15}', v: 2 / 15, int: false },
  { k: 'm13/8', t: '-\\frac{13}{8}', v: -13 / 8, int: false },
  { k: '0.1', t: '0.1', v: 0.1, int: false },
  { k: '-5.32', t: '-5.32', v: -5.32, int: false },
  { k: '-80', t: '-80', v: -80, int: true },
  { k: '123', t: '123', v: 123, int: true },
  { k: '2.333', t: '2.333', v: 2.333, int: false },
];
const BINS = [
  { k: 'pos', name: '正数集合', has: (n) => n.v > 0, why: '它是负数' },
  { k: 'neg', name: '负数集合', has: (n) => n.v < 0, why: '它是正数' },
  { k: 'int', name: '整数集合', has: (n) => n.int, why: '它不是整数' },
  { k: 'frac', name: '分数集合', has: (n) => !n.int, why: '它是整数，不是分数' },
];
const TOTAL = NUMS.reduce((s, n) => s + BINS.filter((b) => b.has(n)).length, 0);

function initSort() {
  const st = { sel: null, placed: new Set(), drag: null };
  const numOf = (k) => NUMS.find((n) => n.k === k);
  const msg = (cls, html) => {
    const m = $('sortMsg');
    m.className = `tip feedback ${cls ? `fb-${cls}` : ''}`;
    m.innerHTML = html;
    tex(m);
  };

  const draw = () => {
    $('pool').innerHTML = NUMS.map((n) => {
      const need = BINS.filter((b) => b.has(n)).length;
      const got = BINS.filter((b) => st.placed.has(`${n.k}|${b.k}`)).length;
      return `<button type="button" class="num${st.sel === n.k ? ' sel' : ''}${got === need ? ' done' : ''}" data-k="${n.k}">$${n.t}$<small>${got}/${need}</small></button>`;
    }).join('');
    $('bins').innerHTML = BINS.map((b) => {
      const inside = NUMS.filter((n) => st.placed.has(`${n.k}|${b.k}`));
      return `<div class="bin" data-b="${b.k}"><h4>${b.name}</h4><div class="bin-in">${inside.map((n) => `<span class="in-num">$${n.t}$</span>`).join('')}<span class="dots">…</span></div></div>`;
    }).join('');
    tex($('pool')); tex($('bins'));
    $('sortCount').textContent = `已放对 ${st.placed.size} / ${TOTAL}`;
    if (st.placed.size === TOTAL) msg('ok', '<b>✓ 全部放好！</b>每个数恰好进了两个圈：对每一个圈，一个数<b>要么在、要么不在</b>，两者有且只有一个成立。');
  };

  const place = (nk, bk) => {
    const n = numOf(nk);
    const b = BINS.find((x) => x.k === bk);
    const key = `${nk}|${bk}`;
    if (st.placed.has(key)) { msg('', `$${n.t}$ 已经在“${b.name}”里了。`); return; }
    if (!b.has(n)) {
      msg('warn', `<b>放不进：</b>$${n.t}$ 不能填入“${b.name}”——${b.why}。`);
      const el = $('bins').querySelector(`[data-b="${bk}"]`);
      el.classList.add('shake');
      setTimeout(() => el.classList.remove('shake'), 600);
      return;
    }
    st.placed = new Set([...st.placed, key]);
    const rest = BINS.filter((x) => x.has(n) && !st.placed.has(`${nk}|${x.k}`));
    draw();
    if (st.placed.size < TOTAL) msg('ok', `✓ $${n.t}$ 放进了“${b.name}”。${rest.length ? `它还属于另一个集合，再找找？` : '这个数放完了。'}`);
  };

  const box = $('frame');
  box.addEventListener('pointerdown', (e) => {
    const num = e.target.closest('#pool .num');
    if (!num) return;
    e.preventDefault();
    st.drag = { k: num.dataset.k, x: e.clientX, y: e.clientY, moved: false, ghost: null };
    num.setPointerCapture(e.pointerId);
  });
  box.addEventListener('pointermove', (e) => {
    const d = st.drag;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10) {
      d.moved = true;
      d.ghost = document.createElement('div');
      d.ghost.className = 'ghost';
      d.ghost.innerHTML = `$${numOf(d.k).t}$`;
      tex(d.ghost);
      document.body.appendChild(d.ghost);
    }
    if (d.ghost) { d.ghost.style.left = `${e.clientX}px`; d.ghost.style.top = `${e.clientY}px`; }
  });
  box.addEventListener('pointerup', (e) => {
    const d = st.drag;
    st.drag = null;
    if (d) {
      if (d.ghost) d.ghost.remove();
      if (d.moved) {
        const bin = document.elementFromPoint(e.clientX, e.clientY)?.closest('.bin');
        if (bin) place(d.k, bin.dataset.b);
      } else {
        st.sel = st.sel === d.k ? null : d.k;
        draw();
        if (st.sel) msg('', `选中了 $${numOf(st.sel).t}$，再点它属于的圈。`);
      }
      return;
    }
    const bin = e.target.closest('#bins .bin');
    if (bin && st.sel) place(st.sel, bin.dataset.b);
    else if (bin) msg('', '先在左边选一个数。');
  });
  $('sortReset').addEventListener('click', () => { st.placed = new Set(); st.sel = null; draw(); msg('', '先选一个数。'); });
  $('sortFill').addEventListener('click', () => {
    st.placed = new Set(NUMS.flatMap((n) => BINS.filter((b) => b.has(n)).map((b) => `${n.k}|${b.k}`)));
    st.sel = null;
    draw();
  });
  draw();
}

/* ---------- 第 7 页：描述法筛子（0～24 的整数逐个过筛） ---------- */
const SIEVE_MAX = 24;
const SIEVES = {
  fin: { test: (x) => x > 1 && x < 13 && x % 2 === 0, done: '筛完了：只有 6 个，用列举法 $\\{2,4,6,8,10,12\\}$ 就能写全。' },
  inf: { test: (x) => x > 1 && x % 2 === 0, done: '筛到 24 还没完：26，28，30，……<b>永远列举不完</b>。只能把“条件”写下来。' },
};
function initSieve() {
  const box = $('sieve');
  box.innerHTML = Array.from({ length: SIEVE_MAX + 1 }, (_, x) => `<span class="cell" data-x="${x}">${x}</span>`).join('') + '<span class="cell more">…</span>';
  let timer = 0;
  const run = (key) => {
    clearInterval(timer);
    const s = SIEVES[key];
    document.querySelectorAll('[data-sieve]').forEach((b) => b.classList.toggle('solid', b.dataset.sieve === key));
    box.querySelectorAll('.cell').forEach((c) => c.classList.remove('hit', 'miss', 'pulse'));
    const m = $('sieveMsg');
    m.className = 'tip feedback';
    m.textContent = '逐个检查：满足条件的留下……';
    let x = 0;
    timer = setInterval(() => {
      if (x > SIEVE_MAX) {
        clearInterval(timer);
        if (key === 'inf') box.querySelector('.more').classList.add('pulse');
        m.className = `tip feedback ${key === 'inf' ? 'fb-warn' : 'fb-ok'}`;
        m.innerHTML = s.done;
        tex(m);
        return;
      }
      box.querySelector(`[data-x="${x}"]`).classList.add(s.test(x) ? 'hit' : 'miss');
      x += 1;
    }, 70);
  };
  document.querySelectorAll('[data-sieve]').forEach((b) => b.addEventListener('click', () => run(b.dataset.sieve)));
  run('fin');
}

window.LESSON = {
  init() {
    initSort();
    initSieve();
  },
};
