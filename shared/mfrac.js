'use strict';
/* 课本插件 · 分式“代值检验器”（精确有理数，BigInt，无浮点误差）。加载在 math.js 之后、course.js 之前。
 * 1. 求值：MFrac.val('(a+b)^3/((a+b)(a-b))', { a: '10', b: '-1/2' }) → { n, d }；分母为 0 时返回 null（无意义）。
 *    书写：分数线 /、乘 * 或省略（2ab、3(x-2)）、乘方 ^（也认 ² ³）；省略乘号的连乘比 * / 结合得紧：1/2a = 1/(2a)。
 * 2. 显示：MFrac.str(q) → "-17/8"；MFrac.tex(q) → "-\dfrac{17}{8}"。
 * 3. 比较：MFrac.same(式子1, 式子2, ['a','b']) → { ok, rows:[{ env, a, b }] }，取 4 组非零有理数代入（跳过式子2 无意义的值）。
 * 4. 组件：<div class="qcheck" data-ref="标准式" data-vars="a,b" data-ph="输入提示"></div>
 *    学生输入化简结果 → 代 4 组值与原式比较，逐组列出精确值。
 */
const MFrac = (() => {
  const abs = (x) => (x < 0n ? -x : x);
  const gcd = (a, b) => { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const mk = (n, d = 1n) => {
    if (d === 0n) return null;
    if (d < 0n) { n = -n; d = -d; }
    const g = gcd(n, d) || 1n;
    return { n: n / g, d: d / g };
  };
  const add = (x, y) => (x && y ? mk(x.n * y.d + y.n * x.d, x.d * y.d) : null);
  const sub = (x, y) => (x && y ? mk(x.n * y.d - y.n * x.d, x.d * y.d) : null);
  const mul = (x, y) => (x && y ? mk(x.n * y.n, x.d * y.d) : null);
  const div = (x, y) => (x && y && y.n !== 0n ? mk(x.n * y.d, x.d * y.n) : null);
  const pow = (x, e) => {
    if (!x || !e || e.d !== 1n) return null;
    let k = e.n;
    if (k < 0n) { if (x.n === 0n) return null; x = mk(x.d, x.n); k = -k; }
    return mk(x.n ** k, x.d ** k);
  };
  const eq = (x, y) => !!x && !!y && x.n === y.n && x.d === y.d;

  /** '3/2'、'-0.5'、'4'、数字 → 有理数 */
  function q(v) {
    if (v && typeof v === 'object') return v;
    const s = String(v).trim();
    const m = s.match(/^(-?)(\d+)(?:\.(\d+))?(?:\/(\d+))?$/);
    if (!m) throw new Error(`不是有理数：${s}`);
    const frac = m[3] || '';
    const n = BigInt(m[2] + frac) * (m[1] ? -1n : 1n);
    return mk(n, 10n ** BigInt(frac.length) * BigInt(m[4] || 1));
  }

  /* ---------- 词法 ---------- */
  const NORM = [[/[（]/g, '('], [/[）]/g, ')'], [/[×·•∙⋅]/g, '*'], [/÷/g, '/'], [/[−–—]/g, '-'], [/＋/g, '+'], [/²/g, '^2'], [/³/g, '^3'], [/⁴/g, '^4'],
    [/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)], [/[ａ-ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)], [/[．。]/g, '.'], [/％/g, '%'], [/\s+/g, '']];
  function lex(src, vars) {
    let s = String(src);
    NORM.forEach(([re, to]) => { s = s.replace(re, to); });
    const out = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      const num = s.slice(i).match(/^\d+(\.\d+)?/);
      if (num) { out.push({ t: 'n', v: q(num[0]) }); i += num[0].length; continue; }
      if (/[a-zA-Z]/.test(c)) {
        const sub = s.slice(i).match(/^[a-zA-Z]\d+/); // R1、R2 这样带下标的字母（须在变量表里）
        if (sub && vars.includes(sub[0])) { out.push({ t: 'v', v: sub[0] }); i += sub[0].length; continue; }
        out.push({ t: 'v', v: c }); i += 1; continue;
      }
      if ('+-*/^()%'.includes(c)) { out.push({ t: c }); i += 1; continue; }
      throw new Error(`看不懂符号“${c}”`);
    }
    return out;
  }

  /* ---------- 语法：expr = term (± term)*；term = chain (*|/ chain)*；chain = unary (省略乘号 power)* ---------- */
  function parse(src, vars = []) {
    const tk = lex(src, vars);
    let p = 0;
    const peek = () => tk[p] || { t: 'end' };
    const take = (t) => { if (peek().t !== t) throw new Error(t === ')' ? '括号没有配对' : `这里缺少“${t}”`); p += 1; };
    const startsAtom = () => ['n', 'v', '('].includes(peek().t);
    function atom() {
      const k = peek();
      if (k.t === 'n') { p += 1; return { k: 'num', v: k.v }; }
      if (k.t === 'v') { p += 1; return { k: 'var', v: k.v }; }
      if (k.t === '(') { p += 1; const e = expr(); take(')'); return e; }
      throw new Error(k.t === 'end' ? '式子没写完' : `“${k.t}”的位置不对`);
    }
    function power() {
      let a = atom();
      while (peek().t === '%') { p += 1; a = { k: 'op', o: '/', a, b: { k: 'num', v: q(100) } }; }
      if (peek().t === '^') {
        p += 1;
        const neg = peek().t === '-';
        if (neg) p += 1;
        const e = atom();
        a = { k: 'pow', a, e: neg ? { k: 'neg', a: e } : e };
      }
      return a;
    }
    function unary() {
      if (peek().t === '-') { p += 1; return { k: 'neg', a: unary() }; }
      if (peek().t === '+') { p += 1; return unary(); }
      return power();
    }
    function chain() {
      let a = unary();
      while (startsAtom()) a = { k: 'op', o: '*', a, b: power() };
      return a;
    }
    function term() {
      let a = chain();
      while (peek().t === '*' || peek().t === '/') { const o = peek().t; p += 1; a = { k: 'op', o, a, b: chain() }; }
      return a;
    }
    function expr() {
      let a = term();
      while (peek().t === '+' || peek().t === '-') { const o = peek().t; p += 1; a = { k: 'op', o, a, b: term() }; }
      return a;
    }
    if (!tk.length) throw new Error('还没有输入');
    const tree = expr();
    if (p < tk.length) throw new Error(peek().t === ')' ? '括号没有配对' : `“${peek().t}”的位置不对`);
    return tree;
  }

  const OPS = { '+': add, '-': sub, '*': mul, '/': div };
  function run(node, env) {
    switch (node.k) {
      case 'num': return node.v;
      case 'var': {
        if (!(node.v in env)) throw new Error(`字母 ${node.v} 不在本题里`);
        return q(env[node.v]);
      }
      case 'neg': { const a = run(node.a, env); return a && mk(-a.n, a.d); }
      case 'pow': return pow(run(node.a, env), run(node.e, env));
      default: return OPS[node.o](run(node.a, env), run(node.b, env));
    }
  }
  /** 求值；分母为 0（无意义）返回 null */
  const val = (src, env = {}) => run(typeof src === 'string' ? parse(src, Object.keys(env)) : src, env);

  const str = (x) => (x ? (x.d === 1n ? String(x.n) : `${x.n}/${x.d}`) : '无意义');
  const tex = (x) => {
    if (!x) return '\\text{无意义}';
    if (x.d === 1n) return String(x.n);
    return `${x.n < 0n ? '-' : ''}\\dfrac{${abs(x.n)}}{${x.d}}`;
  };

  // 代入用的值：避开 0、±1 这类“太巧”的数，正负、整数、分数都有
  const POOL = ['3', '-2', '1/2', '5', '-3/4', '7/3', '4', '-5/2', '2/5', '-7', '11/4', '6', '-1/3', '9/2'];
  function samples(vars, ok, want = 4) {
    const rows = [];
    for (let k = 0; k < 60 && rows.length < want; k += 1) {
      const env = Object.fromEntries(vars.map((v, i) => [v, POOL[(k * 3 + i * 5 + 1) % POOL.length]]));
      if (ok(env)) rows.push(env);
    }
    return rows;
  }
  /** 两个式子代入同样几组值，看是否处处相等（只代入式子 b 有意义的值） */
  function same(a, b, vars, want = 4) {
    const ta = parse(a, vars);
    const tb = parse(b, vars);
    const envs = samples(vars, (env) => run(tb, env) !== null, want);
    const rows = envs.map((env) => ({ env, a: run(ta, env), b: run(tb, env) }));
    return { ok: rows.length > 0 && rows.every((r) => eq(r.a, r.b)), rows };
  }

  /* ---------- 组件：.qcheck ---------- */
  function initCheck(el) {
    const vars = (el.dataset.vars || '').split(',').map((s) => s.trim()).filter(Boolean);
    el.setAttribute('data-noswipe', '');
    el.innerHTML = `<div class="qc-row"><input type="text" autocomplete="off" spellcheck="false" aria-label="输入化简结果" placeholder="${el.dataset.ph || '输入你的结果，如 (a+b)/(a-b)'}"><button type="button" class="btn solid">代值检验</button></div><div class="qc-out" aria-live="polite"></div>`;
    const inp = el.querySelector('input');
    const out = el.querySelector('.qc-out');
    const check = () => {
      el.classList.remove('ok', 'no');
      let res;
      try { res = same(inp.value, el.dataset.ref, vars); } catch (err) { out.innerHTML = `<p class="qc-msg">${err.message}。分数线用 /，分母是多项式时要加括号。</p>`; return; }
      el.classList.add(res.ok ? 'ok' : 'no');
      const head = `<tr><th>${vars.map((v) => `$${v}$`).join('，')}</th><th>你的结果</th><th>原式</th></tr>`;
      const body = res.rows.map((r) => `<tr class="${eq(r.a, r.b) ? '' : 'bad'}"><td>${vars.map((v) => `$${tex(q(r.env[v]))}$`).join('，')}</td><td>$${tex(r.a)}$</td><td>$${tex(r.b)}$</td></tr>`).join('');
      out.innerHTML = `<p class="qc-msg">${res.ok ? '✓ 代入 4 组值，结果与原式都相等。' : '✗ 有的值不相等（红色行）——回去找找哪一步错了。'}</p><table class="qc-tab">${head}${body}</table>`;
      if (window.MathKit) MathKit.tex(out);
    };
    el.querySelector('button').addEventListener('click', check);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
  }
  if (typeof document !== 'undefined') document.querySelectorAll('.qcheck').forEach(initCheck);

  return { q, mk, add, sub, mul, div, pow, eq, parse, val, str, tex, same, samples };
})();
if (typeof window !== 'undefined') window.MFrac = MFrac;
if (typeof module !== 'undefined') module.exports = MFrac;
