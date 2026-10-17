'use strict';
/* 五下 分数加减混合运算 · 本课互动：花园 12 等份的两种去法、点运算符选先算哪一步的算式机、蜡烛条。通用部分见 ../shared/math.js、mcheck.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};

/* ---------- 精确分数 ---------- */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const mk = (n, d) => { const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; };
const add = (x, y) => mk(x.n * y.d + y.n * x.d, x.d * y.d);
const sub = (x, y) => mk(x.n * y.d - y.n * x.d, x.d * y.d);
const calc = (x, op, y) => (op === '+' ? add(x, y) : sub(x, y));
const tex = (q) => (q.d === 1 ? `${q.n}` : `\\dfrac{${q.n}}{${q.d}}`);
const texRaw = (n, d) => `\\dfrac{${n}}{${d}}`;
const OP = { '+': '+', '-': '-' };

/* 结果要化成最简分数：mcheck 按数值判，data-strict 的空再按字面判一次 */
function strictBlanks() {
  document.querySelectorAll('.blank[data-strict]').forEach((el) => {
    const inp = el.querySelector('input');
    const judge = () => {
      const v = inp.value.trim().replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/／/g, '/').replace(/\s+/g, '');
      if (!v || !el.classList.contains('ok') || el.dataset.ans.split('|').includes(v)) { el.title = ''; return; }
      el.classList.replace('ok', 'no');
      el.title = '得数对了，但还要约成最简分数';
    };
    inp.addEventListener('change', judge);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') judge(); });
  });
}

/* ---------- 第 3 页：花园平均分成 12 份 ---------- */
const GD = { x: 20, y: 20, w: 480, h: 150, parts: 12 };
const KIND = [...Array(3).fill('yue'), ...Array(4).fill('du'), ...Array(5).fill('cao')];
function initGarden() {
  const s = $('garden');
  const u = GD.w / GD.parts;
  const cells = KIND.map((k, i) => svgEl('rect', { x: GD.x + i * u, y: GD.y, width: u, height: GD.h, class: `gc ${k}` }, s));
  svgEl('rect', { x: GD.x, y: GD.y, width: GD.w, height: GD.h, class: 'g-out' }, s);
  const lab = (x, t, cls) => { svgEl('text', { x, y: GD.y + GD.h + 34, class: `g-lab ${cls}`, 'text-anchor': 'middle' }, s).textContent = t; };
  lab(GD.x + 1.5 * u, '月季 3/12', 'yue');
  lab(GD.x + 5 * u, '杜鹃 4/12', 'du');
  lab(GD.x + 9.5 * u, '草坪 5/12', 'cao');
  const say = (t) => { $('gSay').innerHTML = t; MathKit.tex($('gSay')); };
  let timers = [];
  const reset = () => {
    timers.forEach(clearTimeout);
    timers = [];
    cells.forEach((c) => c.classList.remove('gone', 'pick'));
    say('把花园平均分成 12 份（4 和 3 的最小公倍数）');
  };
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  const kind = (k) => cells.filter((_, i) => KIND[i] === k);
  $('gA').addEventListener('click', () => {
    reset();
    later(100, () => { kind('yue').forEach((c) => c.classList.add('gone')); say('$1-\\frac14=\\frac{9}{12}$，还剩 9 份'); });
    later(1500, () => { kind('du').forEach((c) => c.classList.add('gone')); say('$\\frac{9}{12}-\\frac{4}{12}=\\frac{5}{12}$，草坪 5 份'); });
  });
  $('gB').addEventListener('click', () => {
    reset();
    later(100, () => { [...kind('yue'), ...kind('du')].forEach((c) => c.classList.add('pick')); say('$\\frac14+\\frac13=\\frac{7}{12}$，两种花一共 7 份'); });
    later(1500, () => { [...kind('yue'), ...kind('du')].forEach((c) => c.classList.add('gone')); say('$1-\\frac{7}{12}=\\frac{5}{12}$，草坪 5 份'); });
  });
  $('g0').addEventListener('click', reset);
}

/* ---------- 第 5 页：点运算符，先算它两边的数 ---------- */
const parseEx = (src) => {
  const tk = src.split(' ');
  const terms = tk.filter((_, i) => i % 2 === 0).map((t) => { const [n, d] = t.split('/').map(Number); return mk(n, d || 1); });
  const ops = tk.filter((_, i) => i % 2 === 1);
  return { terms, ops };
};
const exTex = ({ terms, ops }) => terms.map((q, i) => (i ? ` ${OP[ops[i - 1]]} ` : '') + tex(q)).join('');
// 从左往右算出整式的值
const evalEx = ({ terms, ops }) => ops.reduce((acc, op, i) => calc(acc, op, terms[i + 1]), terms[0]);

function initExpr() {
  const st = { src: '1/6 + 3/5 + 2/3', ex: null, log: [] };
  const line = $('exLine');
  const show = (msg = '') => {
    const { terms, ops } = st.ex;
    line.innerHTML = '';
    terms.forEach((q, i) => {
      if (i) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'op-btn';
        b.textContent = ops[i - 1] === '+' ? '+' : '−';
        b.addEventListener('click', () => combine(i - 1));
        line.appendChild(b);
      }
      const t = document.createElement('span');
      t.className = 'ex-term';
      t.textContent = `$${tex(q)}$`;
      line.appendChild(t);
    });
    if (terms.length === 1) line.classList.add('done'); else line.classList.remove('done');
    $('exLog').innerHTML = st.log.map((l) => `<p>${l}</p>`).join('');
    $('exMsg').innerHTML = msg;
    [line, $('exLog'), $('exMsg')].forEach((el) => MathKit.tex(el));
  };
  const reset = () => {
    st.ex = parseEx(st.src);
    st.log = [`$${exTex(st.ex)}$`];
    show();
  };
  // 第 i 个运算符两边的数先算
  function combine(i) {
    const { terms, ops } = st.ex;
    const a = terms[i];
    const b = terms[i + 1];
    if (i > 0 && ops[i - 1] === '-') {
      const right = evalEx(st.ex);
      const wrong = calc(evalEx({ terms: terms.slice(0, i), ops: ops.slice(0, i - 1) }), '-', calc(a, ops[i], b));
      const got = wrong.n < 0 ? '连减都不够减了' : `得 $${tex(wrong)}$`;
      show(`前面是<b>减号</b>，不能先算后面两个数！先算的话就成了“减去它们的${ops[i] === '+' ? '和' : '差'}”，${got}，而正确结果是 $${tex(right)}$。`);
      return;
    }
    const r = calc(a, ops[i], b);
    const L = lcm(a.d, b.d);
    const sign = ops[i] === '+' ? '+' : '-';
    const step = a.d === b.d ? '' : `$=${texRaw((a.n * L) / a.d, L)}${sign}${texRaw((b.n * L) / b.d, L)}$`;
    const next = { terms: [...terms.slice(0, i), r, ...terms.slice(i + 2)], ops: [...ops.slice(0, i), ...ops.slice(i + 1)] };
    st.ex = next;
    st.log = [...st.log, `<span class="ex-side">先算 $${tex(a)}${sign}${tex(b)}$${step}$=${tex(r)}$</span>　$=${exTex(next)}$`];
    show(next.terms.length === 1 ? '算完了！' : '');
  }
  // 一次通分：几个分母的最小公倍数
  $('exOne').addEventListener('click', () => {
    reset();
    const { terms, ops } = st.ex;
    const L = terms.reduce((m, q) => lcm(m, q.d), 1);
    const raw = terms.map((q, i) => (i ? ` ${OP[ops[i - 1]]} ` : '') + texRaw((q.n * L) / q.d, L)).join('');
    const nums = terms.map((q) => (q.n * L) / q.d);
    const top = ops.reduce((acc, op, i) => (op === '+' ? acc + nums[i + 1] : acc - nums[i + 1]), nums[0]);
    const r = mk(top, L);
    st.log = [...st.log, `$=${raw}$　<span class="ex-side">公分母 ${L}</span>`, `$=${texRaw(top, L)}${r.d === L ? '' : `=${tex(r)}`}$`];
    st.ex = { terms: [r], ops: [] };
    show('一次通分：分子按顺序加减，分母不变。');
  });
  $('exReset').addEventListener('click', reset);
  $('exQ').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-e]');
    if (!btn) return;
    st.src = btn.dataset.e;
    $('exQ').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    reset();
  });
  reset();
}

/* ---------- 第 9 页：蜡烛平均分成 5 份 ---------- */
function initCandle() {
  const s = $('candle');
  const [x, y, w, h] = [150, 18, 600, 40];
  const u = w / 5;
  const fill = ['burn1', 'burn2', 'burn2', 'left', 'left'];
  fill.forEach((c, i) => svgEl('rect', { x: x + i * u, y, width: u, height: h, class: `cd ${c}` }, s));
  svgEl('rect', { x, y, width: w, height: h, class: 'g-out' }, s);
  svgEl('text', { x: x + u / 2, y: y + h + 26, class: 'g-lab', 'text-anchor': 'middle' }, s).textContent = '第一次 1/5';
  svgEl('text', { x: x + 2 * u, y: y + h + 26, class: 'g-lab', 'text-anchor': 'middle' }, s).textContent = '第二次：剩下的一半';
  svgEl('text', { x: x + 4 * u, y: y + h + 26, class: 'g-lab cao', 'text-anchor': 'middle' }, s).textContent = '还剩 2/5';
}

window.LESSON = {
  init() {
    strictBlanks();
    initGarden();
    initExpr();
    initCandle();
  },
};
