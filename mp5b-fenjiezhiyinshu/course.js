'use strict';
/* 五下 分解质因数 · 本课互动：例 7 点质数、例 8 因数树（自己选分法）、短除法逐步演示。
 * 通用部分见 ../shared/math.js、mcheck.js、mnum.js（借用 factors / isPrime） */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const { factors, isPrime } = MNum;
const primeFactors = (n) => {
  const out = [];
  let m = n;
  for (let p = 2; m > 1; p += 1) while (m % p === 0) { out.push(p); m /= p; }
  return out;
};
const times = (arr) => arr.join(' × ');

/* ---------- 第 3 页：例 7 点质数 ---------- */
function initQ7() {
  const why = { 1: '1 只有一个因数，既不是质数也不是合数。', 4: '4 = 2 × 2，还有因数 2，是合数。', 5: '5 只有 1 和 5 两个因数，是质数。', 7: '7 只有 1 和 7 两个因数，是质数。' };
  $('q7').addEventListener('click', (e) => {
    const b = e.target.closest('[data-n]');
    if (!b) return;
    const n = +b.dataset.n;
    b.className = isPrime(n) ? 'ok' : 'no';
    $('q7Msg').textContent = why[n];
  });
}

/* ---------- 第 4 页：因数树 ---------- */
const TREE = { W: 600, TOP: 38, DY: 78, R: 25, GAP: 76 };
function layout(node) {
  // 叶子从左到右等距排，父节点在两个孩子正中间
  const leaves = [];
  const walk = (nd, d) => {
    nd.d = d;
    if (nd.kids) nd.kids.forEach((k) => walk(k, d + 1));
    else leaves.push(nd);
  };
  walk(node, 0);
  const x0 = (TREE.W - (leaves.length - 1) * TREE.GAP) / 2;
  leaves.forEach((lf, i) => { lf.x = x0 + i * TREE.GAP; });
  const setX = (nd) => {
    if (!nd.kids) return nd.x;
    nd.x = (setX(nd.kids[0]) + setX(nd.kids[1])) / 2;
    return nd.x;
  };
  setX(node);
  return leaves;
}

function initTree() {
  const st = { n: 30, root: null, sel: null };
  const fig = $('trFig');
  const draw = () => {
    const leaves = layout(st.root);
    fig.innerHTML = '';
    const y = (nd) => TREE.TOP + nd.d * TREE.DY;
    const edges = (nd) => {
      if (!nd.kids) return;
      nd.kids.forEach((k) => {
        svgEl('line', { x1: nd.x, y1: y(nd) + TREE.R, x2: k.x, y2: y(k) - TREE.R, class: 'tr-edge' }, fig);
        edges(k);
      });
      svgEl('text', { x: nd.x, y: y(nd) + TREE.DY / 2 + 14, class: 'tr-x' }, fig).textContent = '×';
    };
    edges(st.root);
    const nodes = (nd) => {
      const prime = isPrime(nd.v);
      const g = svgEl('g', { class: `tr-node ${prime ? 'p' : nd.kids ? 'done' : 'c'} ${nd === st.sel ? 'sel' : ''}` }, fig);
      svgEl('circle', { cx: nd.x, cy: y(nd), r: TREE.R }, g);
      svgEl('text', { x: nd.x, y: y(nd) + 8 }, g).textContent = nd.v;
      if (!prime && !nd.kids) g.addEventListener('click', () => pick(nd));
      if (nd.kids) nd.kids.forEach(nodes);
    };
    nodes(st.root);
    const open = leaves.filter((l) => !isPrime(l.v));
    if (open.length) {
      $('trRes').textContent = `${st.n} = ${leaves.map((l) => l.v).join(' × ')}　（还有合数没分完）`;
      $('trRes').className = 'tr-res';
    } else {
      $('trRes').textContent = `${st.n} = ${times(leaves.map((l) => l.v).sort((a, b) => a - b))}`;
      $('trRes').className = 'tr-res done';
      $('trMsg').textContent = '分完了！树梢上的数都是质数。';
    }
  };
  const pick = (nd) => {
    st.sel = nd;
    const pairs = factors(nd.v).filter((a) => a > 1 && a * a <= nd.v).map((a) => [a, nd.v / a]);
    $('trOpts').innerHTML = `<span class="small-t">把 ${nd.v} 分成：</span>`;
    pairs.forEach(([a, b]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn';
      btn.textContent = `${a} × ${b}`;
      btn.addEventListener('click', () => {
        nd.kids = [{ v: a }, { v: b }];
        st.sel = null;
        $('trOpts').innerHTML = '';
        $('trMsg').textContent = `${nd.v} = ${a} × ${b}。${[a, b].filter((v) => !isPrime(v)).map((v) => `${v} 是合数，还能分`).join('；') || `${a} 和 ${b} 都是质数。`}`;
        draw();
      });
      $('trOpts').appendChild(btn);
    });
    draw();
  };
  const reset = () => {
    st.root = { v: st.n };
    st.sel = null;
    $('trN').textContent = st.n;
    $('trOpts').innerHTML = '';
    $('trMsg').textContent = `点 ${st.n}，开始分。`;
    draw();
  };
  $('trPick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    $('trPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    st.n = +b.dataset.v;
    reset();
  });
  $('trAgain').addEventListener('click', reset);
  reset();
}

/* ---------- 第 6 页：短除法 ---------- */
function initShort() {
  const st = { n: 30, m: 30, rows: [] };
  const render = () => {
    const box = $('sd');
    box.innerHTML = '';
    st.rows.forEach(({ p, v }) => {
      const r = document.createElement('div');
      r.className = 'sd-row';
      r.innerHTML = `<span class="sd-p">${p}</span><span class="sd-v">${v}</span><span class="sd-why">……用质数 ${p} 去除</span>`;
      box.appendChild(r);
    });
    const last = document.createElement('div');
    last.className = 'sd-row last';
    const done = isPrime(st.m);
    last.innerHTML = `<span class="sd-p"></span><span class="sd-v">${st.m}</span><span class="sd-why">${done ? (st.rows.length ? '……商是质数，停' : '') : ''}</span>`;
    box.appendChild(last);
    $('sdStep').disabled = done;
    $('sdRes').textContent = done ? `${st.n} = ${times([...st.rows.map((r) => r.p), st.m])}` : '';
  };
  const reset = () => { Object.assign(st, { m: st.n, rows: [] }); render(); };
  $('sdStep').addEventListener('click', () => {
    if (isPrime(st.m)) return;
    const p = primeFactors(st.m)[0];
    st.rows = [...st.rows, { p, v: st.m }];
    st.m /= p;
    render();
  });
  $('sdReset').addEventListener('click', reset);
  $('sdPick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    $('sdPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    st.n = +b.dataset.v;
    reset();
  });
  reset();
}

window.LESSON = {
  init() {
    initQ7();
    initTree();
    initShort();
  },
};
