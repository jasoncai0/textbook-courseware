'use strict';
/* 五下 质数和合数 · 本课互动：1～20 因数个数柱状图、11～20 分类、筛法（埃拉托色尼）、练习六第 6 题。
 * 通用部分见 ../shared/math.js、mcheck.js、mnum.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const { factors, isPrime } = MNum;
// 合数的一个“别的因数”（最小的那个）
const otherFactor = (n) => factors(n).find((f) => f > 1 && f < n);

/* ---------- 第 4 页：因数个数柱状图（每格 = 一个因数） ---------- */
const BAR = { N: 20, X0: 60, STEP: 46, CELL: 38, BASE: 285 };
function initBars() {
  const svg = $('barFig');
  const st = { shown: 0, timer: null, colored: false };
  const kind = (n) => (n === 1 ? 'k1' : isPrime(n) ? 'k2' : 'k3');
  const draw = () => {
    svg.innerHTML = '';
    svgEl('line', { x1: BAR.X0 - 20, y1: BAR.BASE, x2: BAR.X0 + BAR.N * BAR.STEP, y2: BAR.BASE, class: 'bar-axis' }, svg);
    for (let k = 1; k <= 6; k += 1) {
      const y = BAR.BASE - k * BAR.CELL;
      svgEl('line', { x1: BAR.X0 - 20, y1: y, x2: BAR.X0 + BAR.N * BAR.STEP, y2: y, class: 'bar-grid' }, svg);
      svgEl('text', { x: BAR.X0 - 30, y: y + BAR.CELL / 2 + 6, class: 'bar-yt' }, svg).textContent = k;
    }
    svgEl('text', { x: 14, y: 30, class: 'bar-yl' }, svg).textContent = '因数个数';
    for (let n = 1; n <= BAR.N; n += 1) {
      const x = BAR.X0 + (n - 1) * BAR.STEP;
      svgEl('text', { x: x + BAR.STEP / 2, y: BAR.BASE + 28, class: 'bar-xt' }, svg).textContent = n;
      if (n > st.shown) continue;
      const g = svgEl('g', { class: `bar ${st.colored ? kind(n) : ''}`, 'data-n': n }, svg);
      factors(n).forEach((f, i) => {
        const y = BAR.BASE - (i + 1) * BAR.CELL;
        svgEl('rect', { x: x + 4, y: y + 1, width: BAR.STEP - 8, height: BAR.CELL - 2, rx: 3 }, g);
        svgEl('text', { x: x + BAR.STEP / 2, y: y + BAR.CELL / 2 + 6 }, g).textContent = f;
      });
    }
  };
  const stop = () => { clearInterval(st.timer); st.timer = null; };
  $('barGo').addEventListener('click', () => {
    if (st.timer) return;
    if (st.shown >= BAR.N) st.shown = 0;
    st.timer = setInterval(() => {
      st.shown += 1;
      draw();
      if (st.shown >= BAR.N) stop();
    }, 350);
  });
  $('barAll').addEventListener('click', () => { stop(); st.shown = BAR.N; draw(); });
  $('barSort').addEventListener('click', () => { stop(); st.shown = BAR.N; st.colored = true; draw(); $('barMsg').innerHTML = '<span class="lg k1">1 个因数</span><span class="lg k2">2 个因数</span><span class="lg k3">2 个以上因数</span>'; });
  svg.addEventListener('click', (e) => {
    const g = e.target.closest('.bar');
    if (!g) return;
    const n = +g.dataset.n;
    $('barMsg').textContent = `${n} 的因数：${factors(n).join('，')}，一共 ${factors(n).length} 个。`;
  });
  draw();
}

/* ---------- 第 6 页：11～20 送进圈里 ---------- */
function initSort() {
  const pool = $('sortPool');
  let picked = null;
  for (let n = 11; n <= 20; n += 1) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'vchip';
    b.textContent = n;
    b.dataset.n = n;
    pool.appendChild(b);
  }
  pool.addEventListener('click', (e) => {
    const b = e.target.closest('.vchip');
    if (!b) return;
    pool.querySelectorAll('.vchip').forEach((x) => x.classList.toggle('on', x === b));
    picked = b;
  });
  document.querySelectorAll('.sbin').forEach((bin) => bin.addEventListener('click', () => {
    if (!picked) { $('sortMsg').textContent = '先点上面的一个数。'; return; }
    const n = +picked.dataset.n;
    const wantP = bin.dataset.bin === 'p';
    if (wantP === isPrime(n)) {
      bin.querySelector('.sbin-in').appendChild(picked);
      picked.classList.remove('on');
      picked.disabled = true;
      $('sortMsg').textContent = `对！${n} 的因数：${factors(n).join('，')}。`;
      picked = null;
      return;
    }
    $('sortMsg').textContent = isPrime(n)
      ? `再想想：${n} 的因数只有 1 和 ${n}，没有别的因数。`
      : `再想想：${n} 还有因数 ${otherFactor(n)}（${n} = ${otherFactor(n)} × ${n / otherFactor(n)}）。`;
  }));
}

/* ---------- 第 7 页：筛法 ---------- */
const SIEVE_PRIMES = [2, 3, 5, 7]; // 100 以内只需筛到 7：11 × 11 = 121 > 100
function initSieve() {
  const st = { max: 50, round: 0, t: null, timers: [] };
  const build = () => {
    st.timers.splice(0).forEach(clearTimeout);
    $('sv').innerHTML = '';
    st.t = MNum.table($('sv'), { from: 1, to: st.max, cols: 10, readonly: true });
    const one = st.t.cell(1);
    one.textContent = '';
    one.classList.add('blank-cell');
    st.round = 0;
    $('svN').textContent = st.max;
    $('svStep').disabled = false;
    $('svStep').textContent = '划掉 2 的倍数 ▶';
    $('svMsg').textContent = '先想一想：2 的倍数（2 除外）为什么一定不是质数？';
  };
  const step = () => {
    if (st.round >= SIEVE_PRIMES.length) return;
    const p = SIEVE_PRIMES[st.round];
    st.round += 1;
    $('svStep').disabled = true;
    st.t.cell(p).classList.add('keep');
    const list = [];
    for (let m = 2 * p; m <= st.max; m += p) if (!st.t.cell(m).classList.contains('x')) list.push(m);
    list.forEach((m, i) => st.timers.push(setTimeout(() => st.t.strike(m), 120 + i * 70)));
    st.timers.push(setTimeout(() => {
      const last = st.round >= SIEVE_PRIMES.length;
      $('svMsg').textContent = `${p} 留下，新划掉了 ${list.length} 个 ${p} 的倍数。${last ? '' : `下一个没被划掉的数是 ${SIEVE_PRIMES[st.round]}。`}`;
      if (last) {
        const left = [];
        for (let n = 2; n <= st.max; n += 1) if (!st.t.cell(n).classList.contains('x')) { st.t.cell(n).classList.add('keep'); left.push(n); }
        $('svMsg').textContent = `筛完了！剩下 ${left.length} 个数，它们都是质数。`;
        $('svStep').textContent = '筛完了 ✓';
        return;
      }
      $('svStep').disabled = false;
      $('svStep').textContent = `划掉 ${SIEVE_PRIMES[st.round]} 的倍数 ▶`;
    }, 200 + list.length * 70));
  };
  $('svStep').addEventListener('click', step);
  $('svReset').addEventListener('click', build);
  $('svRange').addEventListener('click', () => {
    st.max = st.max === 50 ? 100 : 50;
    $('svRange').textContent = st.max === 50 ? '换成 2～100' : '换成 2～50';
    build();
  });
  build();
}

/* ---------- 第 8 页：练习六第 6 题 ---------- */
const GROUPS6 = [[13, 23, 33, 43], [5, 15, 25, 35], [17, 27, 37, 47], [19, 29, 39, 49]];
function initGroups() {
  GROUPS6.forEach((g, i) => {
    const row = document.createElement('div');
    row.className = 'g6row';
    row.innerHTML = `<span class="g6no">(${i + 1})</span><span class="g6cnt">0/${g.filter(isPrime).length}</span>`;
    const cnt = row.querySelector('.g6cnt');
    let got = 0;
    g.forEach((n) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = n;
      b.addEventListener('click', () => {
        if (b.classList.contains('ok')) return;
        if (isPrime(n)) {
          b.className = 'ok';
          got += 1;
          cnt.textContent = `${got}/${g.filter(isPrime).length}`;
          $('grp6Msg').textContent = `${n} 是质数。`;
        } else {
          b.className = 'no';
          $('grp6Msg').textContent = `${n} 不是质数：${n} = ${otherFactor(n)} × ${n / otherFactor(n)}。`;
        }
      });
      row.insertBefore(b, cnt);
    });
    $('grp6').appendChild(row);
  });
}

window.LESSON = {
  init() {
    initBars();
    initSort();
    initSieve();
    initGroups();
  },
};
