'use strict';
/* 七上 2.8 有理数的混合运算 · 运算顺序步进器的计算核心（不依赖 DOM，可在 node 里自测：node expr.js）
 * 表达式写法：+ - × ÷ ^ ( ) [ ]，分数写 {1/3}。例："8-2^3÷(-4)×(-7+5)"
 * 语法树：{ t:'num', v:Frac } | { t:'bin', op, l, r, br } | { t:'pow', b, e } | { t:'neg', x }
 * 左结合，所以“同级从左往右”自然成立：一个运算能做，当且仅当它的运算对象都已经是数。 */
(function (root) {
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const F = (n, d = 1) => {
    if (!d) throw new Error('除数为 0');
    const s = d < 0 ? -1 : 1;
    const g = gcd(n, d) || 1;
    return { n: (s * n) / g, d: Math.abs(d) / g };
  };
  const OPS = {
    '+': (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d),
    '-': (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d),
    '×': (a, b) => F(a.n * b.n, a.d * b.d),
    '÷': (a, b) => F(a.n * b.d, a.d * b.n),
  };
  const powF = (a, e) => F(a.n ** e, a.d ** e);

  /* ---------- 解析 ---------- */
  function parse(src) {
    const toks = src.replace(/\s+/g, '').match(/\{-?\d+\/\d+\}|\d+(?:\.\d+)?|[-+×÷^()[\]]/g);
    let i = 0;
    const peek = () => toks[i];
    const eat = (t) => { if (toks[i] !== t) throw new Error(`应为 ${t}，得到 ${toks[i]}`); i++; };
    const lit = (t) => {
      if (t[0] === '{') { const [n, d] = t.slice(1, -1).split('/').map(Number); return F(n, d); }
      if (t.includes('.')) { const k = t.split('.')[1].length; return F(Math.round(+t * 10 ** k), 10 ** k); }
      return F(+t);
    };
    function atom() {
      const t = peek();
      if (t === '(' || t === '[') {
        eat(t);
        const e = expr();
        eat(t === '(' ? ')' : ']');
        // (−4)、(−{1/3})：括号里只是一个负数，就当作一个数
        if (e.t === 'neg' && e.x.t === 'num') return { t: 'num', v: F(-e.x.v.n, e.x.v.d) };
        if (e.t === 'num') return e;
        return { ...e, br: t };
      }
      i++;
      return { t: 'num', v: lit(t) };
    }
    function power() {
      const b = atom();
      if (peek() !== '^') return b;
      eat('^');
      return { t: 'pow', b, e: +toks[i++] };
    }
    function unary() {
      if (peek() === '-') {
        eat('-');
        // −7、−{1/3}（后面不跟乘方）直接当作一个负数；−1^4 仍是 1^4 的相反数
        if (/^[\d{]/.test(peek()) && toks[i + 1] !== '^') { const v = lit(toks[i++]); return { t: 'num', v: F(-v.n, v.d) }; }
        return { t: 'neg', x: unary() };
      }
      return power();
    }
    function term() {
      let l = unary();
      while (peek() === '×' || peek() === '÷') { const op = toks[i++]; l = { t: 'bin', op, l, r: unary() }; }
      return l;
    }
    function expr() {
      let l = term();
      while (peek() === '+' || peek() === '-') { const op = toks[i++]; l = { t: 'bin', op, l, r: term() }; }
      return l;
    }
    const e = expr();
    if (i !== toks.length) throw new Error(`多余的 ${toks[i]}`);
    return number(e);
  }
  // 给每个运算结点编号，界面用编号指认“点的是哪一个运算”
  function number(e) {
    let k = 0;
    const walk = (n) => {
      if (n.t === 'num') return n;
      const id = ++k;
      if (n.t === 'bin') return { ...n, id, l: walk(n.l), r: walk(n.r) };
      if (n.t === 'pow') return { ...n, id, b: walk(n.b) };
      return { ...n, id, x: walk(n.x) };
    };
    return walk(e);
  }

  /* ---------- 规则 ---------- */
  const isNum = (n) => n.t === 'num';
  const ready = (n) => (n.t === 'bin' ? isNum(n.l) && isNum(n.r) : n.t === 'pow' ? isNum(n.b) : n.t === 'neg' ? isNum(n.x) : false);
  const hasPow = (n) => n.t === 'pow' || (n.t === 'neg' && hasPow(n.x));
  /** 这个运算现在为什么还不能做（能做返回 null） */
  function why(n) {
    if (ready(n)) return null;
    if (n.t === 'pow') return '底数还没算出来：先算括号里面的。';
    if (n.t === 'neg') return '先算乘方，再取相反数。';
    const kids = [n.l, n.r].filter((c) => !isNum(c));
    if (kids.some((c) => c.br)) return '先算括号里面的。';
    if (kids.some(hasPow)) return '先乘方，后乘除，再加减：这一步的运算对象里还有乘方没算。';
    if ((n.op === '+' || n.op === '-') && kids.some((c) => c.t === 'bin' && (c.op === '×' || c.op === '÷'))) return '先乘除，后加减。';
    return '同级运算，要从左往右依次进行。';
  }
  function find(n, id) {
    if (!n || n.t === 'num') return null;
    if (n.id === id) return n;
    return find(n.l, id) || find(n.r, id) || find(n.b, id) || find(n.x, id);
  }
  function calc(n) {
    if (n.t === 'bin') return OPS[n.op](n.l.v, n.r.v);
    if (n.t === 'pow') return powF(n.b.v, n.e);
    return F(-n.x.v.n, n.x.v.d);
  }
  /** 做 id 号运算，返回新树（不改原树） */
  function apply(tree, id) {
    const rep = (n) => {
      if (n.t === 'num') return n;
      if (n.id === id) return { t: 'num', v: calc(n) };
      if (n.t === 'bin') return { ...n, l: rep(n.l), r: rep(n.r) };
      if (n.t === 'pow') return { ...n, b: rep(n.b) };
      return { ...n, x: rep(n.x) };
    };
    return rep(tree);
  }
  /** 所有现在能做的运算编号（同一步可以同时做的） */
  function legal(n, out = []) {
    if (n.t === 'num') return out;
    if (ready(n)) { out.push(n.id); return out; }
    [n.l, n.r, n.b, n.x].filter(Boolean).forEach((c) => legal(c, out));
    return out;
  }

  /* ---------- 排版（KaTeX 源码） ---------- */
  const fracTex = (v) => {
    const a = Math.abs(v.n);
    const body = v.d === 1 ? `${a}` : `\\dfrac{${a}}{${v.d}}`;
    return v.n < 0 ? `-${body}` : body;
  };
  // 负数、分数作底数或跟在运算符后面时加括号
  const numTex = (v, wrap) => {
    const t = fracTex(v);
    if (v.n < 0 && wrap) return v.d === 1 ? `(${t})` : `\\left(${t}\\right)`;
    return t;
  };
  function toTex(n, first = true) {
    if (n.t === 'num') return numTex(n.v, !first);
    let s;
    if (n.t === 'bin') s = `${toTex(n.l, n.br ? true : first)}${{ '+': '+', '-': '-', '×': '\\times', '÷': '\\div' }[n.op]}${toTex(n.r, false)}`;
    else if (n.t === 'pow') {
      const b = n.b.t === 'num' ? n.b.v : null;
      const bt = b && (b.n < 0 || b.d !== 1) ? `\\left(${fracTex(b)}\\right)` : toTex(n.b, true);
      s = `${bt}^{${n.e}}`;
    } else s = `-${toTex(n.x, false)}`;
    if (n.br === '(') return `\\left(${s}\\right)`;
    if (n.br === '[') return `\\left[${s}\\right]`;
    return s;
  }
  const valTex = (v) => fracTex(v);

  const api = { parse, apply, legal, why, find, toTex, valTex, numTex, fracTex, isNum, F };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ExprStep = api;

  // node expr.js：每次都做第一个能做的运算，核对课本答案
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
    const CASES = [
      ['8-2^3÷(-4)×(-7+5)', '4'], ['9+5×(-3)-(-2)^2÷4', '-7'], ['(-5)^3×[2-(-6)]-300÷5', '-1060'],
      ['18-6÷(-3)×(-2)', '14'], ['2^4+16÷(-2)^2÷(-10)', '78/5'], ['(-3)^3÷(6-3^2)', '9'], ['(5+3÷{1/3})÷(-2)+(-3)^2', '2'],
      ['(-{1/3})×3÷3×(-{1/3})', '1/9'], ['(-{1/4}-{5/6}+{8/9})÷(-{1/6})^2+(-2)^2×(-14)', '-63'],
      ['({1/4}-{5/6}+{1/3}+{3/2})÷(-{1/2})^2', '5'], ['({1/3}-{1/2})×(-6)+(-{1/2})^2÷(-{1/2})^3', '-1'], ['-1^4-[2-(-3)^2]', '6'],
      ['-3^2-(-3)^3+(-2)^2-2^3', '14'],
    ];
    let bad = 0;
    CASES.forEach(([src, want]) => {
      let t = parse(src);
      const lines = [toTex(t)];
      while (t.t !== 'num') { t = apply(t, legal(t)[0]); lines.push(toTex(t)); }
      const got = t.v.d === 1 ? `${t.v.n}` : `${t.v.n}/${t.v.d}`;
      if (got !== want) bad++;
      console.log(got === want ? 'ok ' : 'BAD', src, '=', got, '|', lines.length - 1, 'steps');
    });
    // 例 3 的陷阱：先点 3÷3 应被拒绝（同级从左往右）
    const t3 = parse('(-{1/3})×3÷3×(-{1/3})');
    const div = (function f(n) { return n.t === 'bin' ? (n.op === '÷' ? n : f(n.l) || f(n.r)) : null; }(t3));
    console.log('例3 先算 3÷3：', why(div));
    const t1 = parse('9+5×(-3)-(-2)^2÷4');
    console.log('例1 先算 9+…：', why(find(t1, 2)), '| 能做：', legal(t1).map((id) => toTex(find(t1, id))).join('、'));
    process.exit(bad ? 1 : 0);
  }
}(typeof window !== 'undefined' ? window : globalThis));
