'use strict';
/* 八上 6.2 一次函数 · 本课互动：加油机（油量随时间、表格逐差）、蚊香长度条、弹簧（例 2 待定系数法）。
 * 所有图形按函数表达式计算绘制。 */
const { fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 第 3 页：加油机 y = 25x + b ---------- */
const PUMP = { k: 25, cap: 60, xs: [0, 0.5, 1, 1.5, 2] };
function initPump() {
  const s = { x: 1, b: 0 };
  const svg = $('tankSvg');
  const [top, bot, left, right] = [20, 180, 30, 100];
  const hOf = (v) => ((bot - top) * v) / PUMP.cap; // 60 L 对应整个油箱高度
  const ticks = Array.from({ length: 7 }, (_, i) => i * 10)
    .map((v) => `<line x1="${left - 6}" x2="${left}" y1="${bot - hOf(v)}" y2="${bot - hOf(v)}" stroke="#6f8191"/><text x="${left - 9}" y="${bot - hOf(v) + 4}" font-size="10" text-anchor="end" fill="#6f8191">${v}</text>`).join('');
  const draw = () => {
    const y = PUMP.k * s.x + s.b;
    svg.innerHTML = `${ticks}<text x="${left - 9}" y="12" font-size="10" text-anchor="end" fill="#6f8191">L</text>`
      + `<rect x="${left}" y="${bot - hOf(y)}" width="${right - left}" height="${hOf(y)}" fill="rgba(217,113,28,.55)"/>`
      + (s.b ? `<line x1="${left}" x2="${right}" y1="${bot - hOf(s.b)}" y2="${bot - hOf(s.b)}" stroke="#2f7d6b" stroke-width="2" stroke-dasharray="4 3"/>` : '')
      + `<rect x="${left}" y="${top}" width="${right - left}" height="${bot - top}" fill="none" stroke="#1f2d3a" stroke-width="2.5" rx="4"/>`;
    $('pumpXV').textContent = fmt(s.x, 1);
    $('tankRead').innerHTML = `$y=25\\times${fmt(s.x, 1)}${s.b ? '+6' : ''}=${fmt(y, 1)}$ L`;
    const on = (a) => (Math.abs(a - s.x) < 1e-9 ? ' class="on"' : '');
    $('pumpTab').innerHTML = `<tr><th>$x$/min</th>${PUMP.xs.map((a) => `<td${on(a)}>${a}</td>`).join('')}</tr>`
      + `<tr><th>$y$/L</th>${PUMP.xs.map((a) => `<td${on(a)}>${fmt(PUMP.k * a + s.b, 1)}</td>`).join('')}</tr>`
      + `<tr class="diff"><th>增加</th><td></td>${PUMP.xs.slice(1).map(() => '<td>+12.5</td>').join('')}</tr>`;
    tex($('tankRead')); tex($('pumpTab'));
  };
  MathKit.slider($('pumpX'), (v) => { s.x = v; draw(); });
  $('pumpB').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-b]');
    if (!btn) return;
    s.b = +btn.dataset.b;
    $('pumpB').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    draw();
  });
}

/* ---------- 第 8 页：蚊香 y = 105 − 10t ---------- */
function initCoil() {
  const [x0, W, L] = [30, 500, 105];
  const X = (cm) => x0 + (W * cm) / L;
  const ticks = Array.from({ length: 11 }, (_, i) => i * 10)
    .map((v) => `<line x1="${X(v)}" x2="${X(v)}" y1="70" y2="78" stroke="#6f8191"/><text x="${X(v)}" y="94" font-size="16" text-anchor="middle" fill="#6f8191">${v < 100 ? v : ""}</text>`).join('');
  const draw = (t) => {
    const y = 105 - 10 * t;
    const left = Math.max(0, y);
    $('coilSvg').innerHTML = `${ticks}<text x="${X(105)}" y="94" font-size="16" text-anchor="middle" fill="#6f8191">105</text><line x1="${X(105)}" x2="${X(105)}" y1="70" y2="78" stroke="#6f8191"/>`
      + `<rect x="${X(0)}" y="40" width="${X(105) - X(0)}" height="22" rx="4" fill="#e3e7ea" stroke="#b9c3cc" stroke-dasharray="5 4"/>`
      + (left > 0 ? `<rect x="${X(0)}" y="40" width="${X(left) - X(0)}" height="22" rx="4" fill="#2f7d6b"/><circle cx="${X(left)}" cy="51" r="7" fill="#e25b2a"/>` : '')
      + `<text x="${X(0)}" y="28" font-size="20" fill="#1f2d3a">剩余 ${fmt(left, 1)} cm</text><text x="${X(105)}" y="114" font-size="12" text-anchor="end" fill="#6f8191">cm</text>`;
    $('coilTV').textContent = fmt(t, 1);
    const msg = $('coilMsg');
    msg.className = `tip feedback ${y < 0 ? 'fb-warn' : 'fb-ok'}`;
    msg.innerHTML = y < 0
      ? `$t=${fmt(t, 1)}$ 时算出 $y=${fmt(y, 1)}$——长度不可能为负，蚊香在 $t=10.5$ h 已经燃尽．`
      : `$t=${fmt(t, 1)}$ 时，$y=105-10\\times${fmt(t, 1)}=${fmt(y, 1)}$（cm）${y === 0 ? '：正好燃尽！' : ''}`;
    tex(msg);
  };
  MathKit.slider($('coilT'), draw);
}

/* ---------- 第 9 页：弹簧 y = 0.2x + 9（1 cm = 10 单位） ---------- */
function initSpring() {
  const f = (x) => 0.2 * x + 9;
  const XS = [0, 10, 20, 30, 40, 50];
  const draw = (x) => {
    const len = f(x) * 10;
    const [cx, y0, y1] = [60, 12, 12 + len];
    const n = 12;
    const coil = Array.from({ length: n + 1 }, (_, i) => `${cx + (i === 0 || i === n ? 0 : i % 2 ? 14 : -14)},${y0 + 8 + ((len - 16) * i) / n}`).join(' ');
    const box = x ? 14 + x * 0.5 : 0;
    $('springSvg').innerHTML = '<rect x="10" y="4" width="100" height="8" fill="#9fb0bf"/>'
      + `<polyline points="${cx},${y0} ${coil} ${cx},${y1}" fill="none" stroke="#1d6fa5" stroke-width="2.5"/>`
      + (x ? `<rect x="${cx - box / 2}" y="${y1}" width="${box}" height="${box * 0.8}" rx="3" fill="#d9711c"/><text x="${cx}" y="${y1 + box * 0.4 + 4}" font-size="11" fill="#fff" text-anchor="middle">${x} g</text>` : '')
      + `<line x1="104" x2="104" y1="${y0}" y2="${y1}" stroke="#2f7d6b" stroke-width="1.5"/><line x1="98" x2="110" y1="${y1}" y2="${y1}" stroke="#2f7d6b" stroke-width="1.5"/>`;
    $('sprXV').textContent = x;
    const known = x === 10 || x === 30;
    const msg = $('sprMsg');
    msg.className = `tip feedback ${known ? 'fb-ok' : ''}`;
    msg.innerHTML = known ? `课本数据：挂 ${x} g 时长 ${f(x)} cm．` : `挂 ${x} g 时长 $${fmt(f(x), 1)}$ cm（按求出的 $y=0.2x+9$）．`;
    $('sprTab').innerHTML = `<tr><th>$x$/g</th>${XS.map((a) => `<td class="${a === x ? 'on' : ''}">${a}</td>`).join('')}</tr>`
      + `<tr><th>$y$/cm</th>${XS.map((a) => `<td class="${a === x ? 'on' : ''}">${a === 10 || a === 30 ? `<b>${f(a)}</b>` : '?'}</td>`).join('')}</tr>`;
    tex(msg); tex($('sprTab'));
  };
  MathKit.slider($('sprX'), (v) => draw(v));
}

window.LESSON = {
  init() {
    initPump();
    initCoil();
    initSpring();
  },
};
