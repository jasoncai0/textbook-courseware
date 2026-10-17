'use strict';
/* 五下 列方程解决实际问题 · 本课互动：例 7 体重条（试 x 让两条一样长）、例 8 线段图（2 倍少 22 米），都按同一比例画 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const tex = (el) => MathKit.tex(el);
const fmt = (v) => MathKit.fmt(v, 2);
const bar = (svg, x, y, w, h, cls, label) => {
  svgEl('rect', { x, y, width: Math.max(0, w), height: h, class: cls }, svg);
  if (label) svgEl('text', { x: x + w / 2, y: y + h / 2 + 8, class: 'bt' }, svg).textContent = label;
};

/* 第 4 页：例 7。1 千克 = 13 个单位 */
const W7 = { now: 36, add: 2.5, k: 13, x0: 90 };
function initWeight() {
  const svg = $('wbar');
  const draw = (x) => {
    svg.innerHTML = '';
    const { now, add, k, x0 } = W7;
    svgEl('text', { x: x0 - 10, y: 72, class: 'rl' }, svg).textContent = '去年+增加';
    bar(svg, x0, 45, x * k, 40, 'b-x', `x = ${fmt(x)}`);
    bar(svg, x0 + x * k, 45, add * k, 40, 'b-add', '');
    svgEl('text', { x: x0 + x * k + (add * k) / 2, y: 36, class: 'bt s' }, svg).textContent = '2.5';
    svgEl('text', { x: x0 - 10, y: 162, class: 'rl' }, svg).textContent = '今年';
    bar(svg, x0, 135, now * k, 40, 'b-now', '36 千克');
    const end = x0 + now * k;
    svgEl('line', { x1: end, x2: end, y1: 20, y2: 200, class: 'guide' }, svg);
    const sum = x + add;
    const ok = Math.abs(sum - now) < 1e-9;
    $('wexpr').innerHTML = `$${fmt(x)}+2.5=${fmt(sum)}$　${ok ? '$=$' : sum > now ? '$>$' : '$<$'}　$36$`;
    const m = $('wmsg');
    m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = ok ? '<b>一样长！</b>去年的体重是 33.5 千克。' : sum > now ? '上面长了，去年的体重应该<b>再轻一些</b>。' : '上面短了，去年的体重应该<b>再重一些</b>。';
    tex($('wexpr')); tex(m);
  };
  MathKit.slider($('wx'), (v) => { $('wxv').textContent = fmt(v); draw(v); });
}

/* 第 8 页：例 8。1 米 = 8 个单位 */
const T8 = { big: 64, less: 22, k: 8, x0: 150 };
function initTower() {
  const svg = $('tower');
  const draw = (x) => {
    svg.innerHTML = '';
    const { big, less, k, x0 } = T8;
    svgEl('text', { x: x0 - 14, y: 52, class: 'rl' }, svg).textContent = '小雁塔';
    bar(svg, x0, 28, x * k, 34, 'b-x', `x = ${x}`);
    svgEl('text', { x: x0 - 14, y: 127, class: 'rl' }, svg).textContent = '2 倍少 22 米';
    bar(svg, x0, 103, x * k, 34, 'b-x', 'x');
    bar(svg, x0 + x * k, 103, x * k, 34, 'b-x', 'x');
    const cut = x0 + 2 * x * k - less * k;
    svgEl('rect', { x: cut, y: 99, width: less * k, height: 42, class: 'b-cut' }, svg);
    svgEl('text', { x: cut + (less * k) / 2, y: 94, class: 'bt cut' }, svg).textContent = '少 22 米';
    svgEl('text', { x: x0 - 14, y: 212, class: 'rl' }, svg).textContent = '大雁塔';
    bar(svg, x0, 188, big * k, 34, 'b-now', '64 米');
    svgEl('line', { x1: x0 + big * k, x2: x0 + big * k, y1: 92, y2: 234, class: 'guide' }, svg);
    svgEl('line', { x1: cut, x2: cut, y1: 92, y2: 234, class: 'guide2' }, svg);
    const v = 2 * x - less;
    const ok = v === big;
    const m = $('tmsg');
    m.className = `tip feedback center ${ok ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `$2\\times${x}-22=${v}$　${ok ? '<b>正好等于 64 米！</b>小雁塔高 43 米。' : v > big ? '比 64 米长，$x$ 要小一些。' : '比 64 米短，$x$ 要大一些。'}`;
    tex(m);
  };
  MathKit.slider($('tx'), (v) => { $('txv').textContent = v; draw(v); });
}

window.LESSON = {
  init() {
    initWeight();
    initTower();
  },
};
