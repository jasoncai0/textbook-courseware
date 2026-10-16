'use strict';
/* 七下 10.2 二元一次方程组 · 本课互动：鸡兔笼（35 个头，按只数精确画出每只脚）、两个方程的公共解对照表。
 * 通用部分见 ../shared/math.js */
const { slider, tex } = MathKit;
const $ = (id) => document.getElementById(id);

const HEADS = 35;
const FEET = 94;
const COLS = 7;

/* 一只动物：鸡 = 橙色圆 + 2 条腿；兔 = 白色圆 + 两只耳朵 + 4 条腿 */
function animal(cx, cy, isHen) {
  const legs = isHen ? [-6, 6] : [-12, -4, 4, 12];
  const legSvg = legs.map((dx) => `<line x1="${cx + dx}" y1="${cy + 12}" x2="${cx + dx}" y2="${cy + 24}" stroke="#7a4b1c" stroke-width="3" stroke-linecap="round"/>`).join('');
  const ears = isHen ? `<path d="M${cx - 4} ${cy - 15} l4 -7 l4 7z" fill="#c0392b"/>`
    : `<ellipse cx="${cx - 6}" cy="${cy - 19}" rx="3.5" ry="9" fill="#fff" stroke="#8a97a3" stroke-width="1.5"/><ellipse cx="${cx + 6}" cy="${cy - 19}" rx="3.5" ry="9" fill="#fff" stroke="#8a97a3" stroke-width="1.5"/>`;
  const body = `<circle cx="${cx}" cy="${cy}" r="14" fill="${isHen ? '#f0a24a' : '#fff'}" stroke="${isHen ? '#b5651d' : '#8a97a3'}" stroke-width="2"/>`;
  return ears + legSvg + body;
}

function initCage() {
  const svg = $('cage');
  const CELL_W = 74;
  const CELL_H = 60;
  const X0 = 58;
  const Y0 = 50;
  const draw = (hens) => {
    const bars = Array.from({ length: 15 }, (_, i) => `<line x1="${20 + i * 37}" y1="14" x2="${20 + i * 37}" y2="318" stroke="#d8c3a0" stroke-width="2"/>`).join('');
    const pets = Array.from({ length: HEADS }, (_, i) => animal(X0 + (i % COLS) * CELL_W, Y0 + Math.floor(i / COLS) * CELL_H, i < hens)).join('');
    svg.innerHTML = `<rect x="10" y="10" width="540" height="312" rx="10" fill="#fbf6ec" stroke="#b08a57" stroke-width="3"/>${bars}${pets}`;
  };
  slider($('henX'), (x) => {
    const y = HEADS - x;
    const feet = 2 * x + 4 * y;
    draw(x);
    $('henV').textContent = x;
    $('rabV').textContent = y;
    $('headV').textContent = `${x} + ${y} = ${HEADS}`;
    $('footV').textContent = `${2 * x} + ${4 * y} = ${feet}`;
    const msg = $('cageMsg');
    msg.className = `tip feedback ${feet === FEET ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = feet === FEET
      ? `头 35、足 94，两个条件都满足：鸡 ${x} 只，兔 ${y} 只！`
      : `头数对了，但足数是 ${feet}，比 94 ${feet > FEET ? '多' : '少'} ${Math.abs(feet - FEET)} 只。`;
  });
}

/* 精确分数的 TeX */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
function fracTex(n, d) {
  const g = gcd(n, d);
  const [p, q] = [n / g, d / g];
  if (q === 1) return String(p);
  return `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${q}}`;
}

function initCommon() {
  const XS = Array.from({ length: 9 }, (_, i) => i);
  const y1 = (x) => [11 - x, 3]; // ① x + 3y = 11
  const y2 = (x) => [12 - 3 * x, 2]; // ② 3x + 2y = 12
  const same = (x) => (11 - x) * 2 === (12 - 3 * x) * 3;
  const tab = $('comTab');
  slider($('comX'), (cur) => {
    const cell = (x, v) => (x > cur ? '<td></td>' : `<td class="${same(x) ? 'hit' : ''} ${x === cur ? 'cur' : ''}">$${v}$</td>`);
    tab.innerHTML = `<tr><th>x</th>${XS.map((x) => `<td class="${x === cur ? 'cur' : ''}">${x}</td>`).join('')}</tr>`
      + `<tr><th>①：y = (11 − x) ÷ 3</th>${XS.map((x) => cell(x, fracTex(...y1(x)))).join('')}</tr>`
      + `<tr><th>②：y = (12 − 3x) ÷ 2</th>${XS.map((x) => cell(x, fracTex(...y2(x)))).join('')}</tr>`;
    $('comXV').textContent = cur;
    const msg = $('comMsg');
    msg.className = `tip feedback ${same(cur) ? 'fb-ok' : ''}`;
    msg.innerHTML = same(cur)
      ? `$x=${cur}$ 时，两个方程算出的 $y$ 都是 $${fracTex(...y1(cur))}$：$\\begin{cases}x=2\\\\y=3\\end{cases}$ 同时适合方程①和②！`
      : `$x=${cur}$ 时：方程①得 $y=${fracTex(...y1(cur))}$，方程②得 $y=${fracTex(...y2(cur))}$，不相等。`;
    [tab, msg].forEach(tex);
  });
}

window.LESSON = {
  init() {
    initCage();
    initCommon();
  },
};
