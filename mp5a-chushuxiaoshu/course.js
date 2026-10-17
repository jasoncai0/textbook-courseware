'use strict';
/* 五上 除数是小数的除法 · 本课互动：商不变滑轨（被除数、除数的小数点同时右移，商不变；只移除数时商变）、
 * 例 10 / 例 11 / 试一试的竖式（../shared/mvert.js 逐位计算）。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent, txt) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (txt !== undefined) e.textContent = txt;
  if (parent) parent.appendChild(e);
  return e;
};

/* 把数字串 chars（不含小数点）、小数点前 intLen 位，写成普通小数字符串 */
function numStr(chars, intLen) {
  const i = chars.slice(0, intLen).join('').replace(/^0+(?=\d)/, '') || '0';
  const f = chars.slice(intLen).join('').replace(/0+$/, '');
  return f ? `${i}.${f}` : i;
}
/* a ÷ b（都是普通小数字符串）的商：用整数精确计算，最多 6 位小数 */
function quot(a, b) {
  const sc = (s) => { const [i, f = ''] = s.split('.'); return [BigInt(i + f), f.length]; };
  const [x, dx] = sc(a);
  const [y, dy] = sc(b);
  const P = 6;
  const q = (x * 10n ** BigInt(dy + P)) / (y * 10n ** BigInt(dx));
  const t = q.toString().padStart(P + 1, '0');
  return numStr(t.split(''), t.length - P);
}

/* ---------- 第 4 页：商不变滑轨 ---------- */
const SL = [['7.98', '4.2'], ['1.5', '0.75'], ['6', '2.4'], ['0.672', '0.28']];
const CW = 62;
const X0 = 170;
function initSlider() {
  const fig = $('slFig');
  const st = { k: 0, s: 0, only: false };
  let rows = [];
  const build = () => {
    fig.innerHTML = '';
    svgEl('text', { x: 20, y: 66, class: 'sl-lb' }, fig, '被除数');
    svgEl('text', { x: 20, y: 156, class: 'sl-lb' }, fig, '除　数');
    rows = SL[st.k].map((s, r) => {
      const [i, f = ''] = s.split('.');
      const chars = (i + f).split('').concat(['0', '0', '0']);
      const y = 20 + r * 90;
      const cells = chars.map((ch, c) => {
        const g = svgEl('g', { class: 'sl-cell' }, fig);
        svgEl('rect', { x: X0 + c * CW + 4, y, width: CW - 8, height: 64, rx: 8 }, g);
        svgEl('text', { x: X0 + c * CW + CW / 2, y: y + 49 }, g, ch);
        return g;
      });
      const old = svgEl('circle', { cx: X0 + i.length * CW, cy: y + 54, r: 6, class: 'sl-old' }, fig);
      const pt = svgEl('circle', { cx: X0 + i.length * CW, cy: y + 54, r: 9, class: 'sl-pt' }, fig);
      return { chars, intLen: i.length, len: (i + f).length, hasDot: f.length > 0, cells, pt, old, y };
    });
    svgEl('rect', { x: 660, y: 20, width: 300, height: 154, rx: 14, class: 'sl-qbox' }, fig);
    svgEl('text', { x: 810, y: 62, class: 'sl-qlb' }, fig, '商');
    rows.q = svgEl('text', { x: 810, y: 140, class: 'sl-q' }, fig, '');
  };
  const draw = () => {
    const [a, b] = SL[st.k];
    const sh = [st.only ? 0 : st.s, st.s];
    const vals = rows.map((r, n) => {
      const p = r.intLen + sh[n];
      const used = Math.max(r.len, p);
      const first = r.chars.findIndex((ch) => ch !== '0');
      r.cells.forEach((g, c) => {
        g.classList.toggle('hide', c >= used);
        g.classList.toggle('add', c >= r.len && c < used);
        g.classList.toggle('fade', c < first && c < p - 1);
      });
      r.pt.setAttribute('cx', X0 + p * CW);
      r.pt.classList.toggle('int', p >= used);
      r.old.classList.toggle('hide', !r.hasDot || sh[n] === 0);
      return numStr(r.chars.slice(0, used), p);
    });
    const q0 = quot(a, b);
    const q = quot(vals[0], vals[1]);
    rows.q.textContent = q;
    rows.q.classList.toggle('bad', q !== q0);
    $('slTimes').textContent = `× ${10 ** st.s}`;
    const need = (b.split('.')[1] || '').length;
    const eq = `${vals[0]} ÷ ${vals[1]} = ${q}`;
    let say;
    if (st.only && st.s) say = `${eq}　只移动除数，商变成了原来的 1/${10 ** st.s}——不对！被除数也要一起移。`;
    else if (st.s === 0) say = `${eq}　除数 ${b} 还是小数，向右拖动滑轨。`;
    else if (st.s < need) say = `${eq}　商没变，可除数还不是整数，再移一位。`;
    else if (st.s === need) say = `${eq}　除数变成整数了，够了！商还是 ${q0}。`;
    else say = `${eq}　商还是不变，但除数早就是整数了，不必多移。`;
    $('slSay').textContent = say;
  };
  $('slR').addEventListener('input', () => { st.s = +$('slR').value; draw(); });
  $('slOnly').addEventListener('change', () => { st.only = $('slOnly').checked; draw(); });
  $('slPick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    $('slPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    st.k = +btn.dataset.k;
    st.s = 0;
    $('slR').value = 0;
    build();
    draw();
  });
  build();
  draw();
}

function vstep(id, a, b, say) {
  const m = MVert.div(`#${id}`, a, b, { start: 0 });
  MVert.bind(m, $(`${id}p`), $(`${id}n`), (n) => { if ($(`${id}say`)) $(`${id}say`).textContent = say[n] || ''; });
}

window.LESSON = {
  init() {
    initSlider();
    vstep('v10', '7.98', '4.2', ['除数 4.2 → 42，被除数 7.98 → 79.8，小数点都向右移动一位。', '79 里面有 1 个 42，商 1；余 37，落下 8 得 378。', '378 里面有 9 个 42，商 9，正好除尽。商是 1.9。']);
    MVert.div('#v11', '1.5', '0.75');
    vstep('v6', '6', '2.4', []);
    MVert.div('#vp2', '0.756', '1.8');
    MVert.div('#vp3', '0.196', '0.56');
    MVert.div('#vw1', '11.5', '4.6');
    MVert.div('#vw2', '5.76', '1.8');
  },
};
