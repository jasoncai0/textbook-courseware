'use strict';
/* 七上 2.8 有理数的混合运算 · 本课互动：运算顺序步进器（计算核心见 expr.js，分数精确运算）、“分类”棋盘。 */
const { tex } = MathKit;
const E = window.ExprStep;
const $ = (id) => document.getElementById(id);
const K = (s) => window.katex.renderToString(s, { throwOnError: false });

/* 第 4 页：步进器里的算式（全部来自课本 p55–56） */
const CASES = [
  ['黑板（p55）', '8-2^3÷(-4)×(-7+5)'],
  ['例 1', '9+5×(-3)-(-2)^2÷4'],
  ['例 2', '(-5)^3×[2-(-6)]-300÷5'],
  ['例 3', '(-{1/3})×3÷3×(-{1/3})'],
  ['练一练 ①(1)', '18-6÷(-3)×(-2)'],
  ['①(2)', '2^4+16÷(-2)^2÷(-10)'],
  ['①(3)', '(-3)^3÷(6-3^2)'],
  ['①(4)', '(5+3÷{1/3})÷(-2)+(-3)^2'],
  ['练一练 ②(1)', '({1/4}-{5/6}+{1/3}+{3/2})÷(-{1/2})^2'],
  ['②(2)', '({1/3}-{1/2})×(-6)+(-{1/2})^2÷(-{1/2})^3'],
  ['②(3)', '-1^4-[2-(-3)^2]'],
];
const plain = (v) => `${v.n < 0 ? '−' : ''}${Math.abs(v.n)}${v.d === 1 ? '' : `/${v.d}`}`;
const OP_TXT = { '+': '+', '-': '−', '×': '×', '÷': '÷' };

/** 把语法树排成 HTML：数字用 KaTeX，运算符号是按钮 */
function html(n, first = true) {
  if (n.t === 'num') return `<span class="nm">${K(E.numTex(n.v, !first))}</span>`;
  let s;
  if (n.t === 'bin') s = `${html(n.l, n.br ? true : first)}<button type="button" class="op" data-id="${n.id}">${OP_TXT[n.op]}</button>${html(n.r, false)}`;
  else if (n.t === 'pow') {
    const b = n.b.t === 'num' ? n.b.v : null;
    const base = b && (b.n < 0 || b.d !== 1) ? `<span class="nm">${K(`\\left(${E.fracTex(b)}\\right)`)}</span>` : html(n.b, true);
    s = `${base}<sup><button type="button" class="op pw" data-id="${n.id}" title="乘方">${n.e}</button></sup>`;
  } else s = `<button type="button" class="op ng" data-id="${n.id}" title="相反数">−</button>${html(n.x, false)}`;
  if (n.br === '(') return `<span class="br">(</span>${s}<span class="br">)</span>`;
  if (n.br === '[') return `<span class="br">[</span>${s}<span class="br">]</span>`;
  return s;
}

function initStepper() {
  const s = { k: 0, hist: [], tree: null, wrong: 0 };
  const load = (k) => { s.k = k; s.tree = E.parse(CASES[k][1]); s.hist = []; s.wrong = 0; draw('点算式里的运算符号（乘方点指数）：先算哪一个？'); };
  $('stCases').innerHTML = CASES.map(([name], i) => `<button class="btn ${i ? '' : 'solid'}" type="button" data-k="${i}">${name}</button>`).join('');
  function draw(msg, cls = '') {
    $('stExpr').innerHTML = s.tree.t === 'num' ? `<span class="done">${K(E.valTex(s.tree.v))}</span>` : html(s.tree);
    const all = [...s.hist.map((h) => h.tree), s.tree];
    $('stLog').innerHTML = all.map((t, i) => `<div class="lg ${i === all.length - 1 ? 'cur' : ''}"><span class="eq">${i ? '=' : ''}</span>${K(E.toTex(t))}${i ? `<i>${s.hist[i - 1].note}</i>` : ''}</div>`).join('');
    const m = $('stMsg');
    m.className = `tip feedback ${cls}`;
    m.textContent = msg;
    $('stCases').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.k === s.k));
    $('stLog').querySelectorAll('i').forEach((i) => tex(i));
  }
  $('stExpr').addEventListener('click', (e) => {
    const btn = e.target.closest('.op');
    if (!btn || s.tree.t === 'num') return;
    const node = E.find(s.tree, +btn.dataset.id);
    const why = E.why(node);
    if (why) {
      s.wrong += 1;
      btn.classList.remove('no'); void btn.offsetWidth; btn.classList.add('no');
      const m = $('stMsg'); m.className = 'tip feedback fb-warn'; m.textContent = `这一步还不能算：${why}`;
      return;
    }
    const before = E.toTex(node);
    const v = E.apply(node, node.id).v; // 把这个结点单独当作一棵树做一步，得到它的值
    const kind = node.t === 'pow' ? '乘方' : node.t === 'neg' ? '相反数' : { '+': '加法', '-': '减法', '×': '乘法', '÷': '除法' }[node.op];
    const note = `${kind}：$${before}=${E.valTex(v)}$`;
    s.hist = [...s.hist, { tree: s.tree, note }];
    s.tree = E.apply(s.tree, node.id);
    if (s.tree.t === 'num') draw(`算完了！结果是 ${plain(s.tree.v)}${s.wrong ? `（中途点错 ${s.wrong} 次）` : '，一次都没点错！'}`, 'fb-ok');
    else draw(`✓ 这一步算${kind}。继续：下一步算哪个？`, 'fb-ok');
    $('stLog').querySelectorAll('i').forEach((i) => tex(i));
  });
  $('stCases').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) load(+b.dataset.k); });
  $('stHint').addEventListener('click', () => {
    if (s.tree.t === 'num') return;
    const ids = E.legal(s.tree);
    $('stExpr').querySelectorAll('.op').forEach((b) => b.classList.toggle('hint', ids.includes(+b.dataset.id)));
    const m = $('stMsg'); m.className = 'tip feedback'; m.textContent = `现在可以算的有 ${ids.length} 处（已闪烁标出），先算哪一个都行。`;
  });
  $('stUndo').addEventListener('click', () => {
    if (!s.hist.length) return;
    s.tree = s.hist[s.hist.length - 1].tree;
    s.hist = s.hist.slice(0, -1);
    draw('退回了一步。');
  });
  $('stReset').addEventListener('click', () => load(s.k));
  load(0);
}

/* 第 11 页：分类（课本 p58）。行列从 0 起、自上而下；A 在第 7 行第 2 列，B 在第 1 行第 7 列 */
const A = [6, 1];
const B = [0, 6];
function initChess() {
  const s = { at: A, steps: 0, colored: false };
  const white = ([r, c]) => (r + c) % 2 === 1; // 与课本图 (2) 一致：A 为白格，B 为黑格
  const draw = () => {
    let h = '';
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      const here = s.at[0] === r && s.at[1] === c;
      const adj = Math.abs(s.at[0] - r) + Math.abs(s.at[1] - c) === 1;
      const lab = r === A[0] && c === A[1] ? 'A' : r === B[0] && c === B[1] ? 'B' : '';
      h += `<button type="button" class="cell ${s.colored ? (white([r, c]) ? 'w' : 'k') : ''} ${adj ? 'adj' : ''}" data-r="${r}" data-c="${c}">${lab ? `<b>${lab}</b>` : ''}${here ? '<i class="pc"></i>' : ''}</button>`;
    }
    $('chess').innerHTML = h;
    const m = $('chMsg');
    const onB = s.at[0] === B[0] && s.at[1] === B[1];
    m.className = `tip feedback ${onB ? 'fb-ok' : ''}`;
    m.textContent = `已走 ${s.steps} 步（${s.steps % 2 ? '奇' : '偶'}数）${s.colored ? `，棋子在${white(s.at) ? '白' : '黑'}格` : ''}${onB ? '，到达 B！' : ''}。点与棋子相邻的格子走一步。`;
  };
  $('chess').addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    const p = [+cell.dataset.r, +cell.dataset.c];
    if (Math.abs(p[0] - s.at[0]) + Math.abs(p[1] - s.at[1]) !== 1) return;
    s.at = p;
    s.steps += 1;
    draw();
  });
  $('chColor').addEventListener('click', () => { s.colored = !s.colored; draw(); });
  $('chReset').addEventListener('click', () => { s.at = A; s.steps = 0; draw(); });
  draw();
}

window.LESSON = {
  init() {
    initStepper();
    initChess();
  },
};
