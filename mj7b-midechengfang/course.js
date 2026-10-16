'use strict';
/* 七下 8.2 幂的乘方与积的乘方 · 本课互动：
 * ① 因数方阵：(a^m)^n 画成 n 行、每行 m 个 a，因数总数 = m × n（对照 8.1 的 a^m · a^n 只有 m + n 个）；
 * ② 重新排队：(ab)^n 的 n 对 (a·b) 用交换律、结合律把 a 排一队、b 排一队（FLIP 位移动画，因数个数严格不变）。
 * 通用部分见 ../shared/math.js */
const { slider, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/** 四位以上的数按三位一组用细空格分开 */
const group = (s) => (/^\d{4,}$/.test(s) ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s);
/** 整数幂的精确值（BigInt，避免大数失真） */
const powStr = (b, k) => group((BigInt(b) ** BigInt(k)).toString());

/* ---------- 第 4 页：因数方阵 ---------- */
function initGrid() {
  const s = { base: 'a', m: 3, n: 2 };
  const label = () => (s.base === 'a' ? 'a' : '2');
  const render = () => {
    const chip = `<span class="chip-a ${s.base === 'a' ? '' : 'num'}">${label()}</span>`;
    const row = (i) => `<div class="pg-row"><span class="lbl">第 ${i + 1} 个</span><span class="par">(</span>${chip.repeat(s.m)}<span class="par">)</span><span class="exp">${s.m}</span></div>`;
    $('powGrid').innerHTML = Array.from({ length: s.n }, (_, i) => row(i)).join('');
    $('pgCnt').innerHTML = `${s.n} 个 <i>${label()}</i><sup>${s.m}</sup> 相乘：每行 ${s.m} 个 ${label()}，共 ${s.n} 行 → 一共 ${s.m} × ${s.n} = ${s.m * s.n} 个 ${label()} 相乘`;
    const B = label();
    const num = s.base === 'a' ? '' : `\\quad\\left(${powStr(2, s.m)}^{${s.n}}=${powStr(2, s.m * s.n)}\\right)`;
    $('pgEq').innerHTML = `$(${B}^{${s.m}})^{${s.n}}=${B}^{${s.m}\\times${s.n}}=${B}^{${s.m * s.n}}${num}$`;
    $('pgCmp').innerHTML = `对照 8.1：$${B}^{${s.m}}\\cdot ${B}^{${s.n}}$ 只是 $${s.m}+${s.n}=${s.m + s.n}$ 个 $${B}$ 相乘，得 $${B}^{${s.m + s.n}}$${s.m * s.n === s.m + s.n ? '（恰好相等，只是巧合）' : ''}。`;
    $('pgM').textContent = s.m; $('pgN').textContent = s.n;
    $('gridBox').querySelectorAll('[data-base]').forEach((b) => b.classList.toggle('solid', b.dataset.base === s.base));
    tex($('pgEq')); tex($('pgCmp'));
  };
  slider($('pgMi'), (v) => { s.m = v; render(); });
  slider($('pgNi'), (v) => { s.n = v; render(); });
  $('gridBox').addEventListener('click', (e) => {
    const b = e.target.closest('[data-base]');
    if (!b) return;
    s.base = b.dataset.base;
    render();
  });
  render();
}

/* ---------- 第 10 页：积的乘方 · 重新排队 ---------- */
const PAIRS = { ab: ['a', 'b'], 34: ['3', '4'] };

function initLine() {
  const s = { pair: 'ab', n: 3, sorted: false };
  const host = $('line');

  /* 元素序列：未排队时 ( x · y ) · ( x · y ) …；排队后 x · x … · y · y … */
  const build = () => {
    const [x, y] = PAIRS[s.pair];
    const num = s.pair === 'ab' ? '' : 'num';
    let html = '';
    for (let i = 0; i < s.n; i++) {
      html += `<span class="par" data-k="l${i}">(</span><span class="chip-a ${num}" data-k="x${i}">${x}</span><span class="dt" data-k="m${i}">·</span><span class="chip-a o ${num}" data-k="y${i}">${y}</span><span class="par" data-k="r${i}">)</span>`;
      if (i < s.n - 1) html += `<span class="dt" data-k="s${i}">·</span>`;
    }
    host.innerHTML = html;
  };

  /** 每个元素的 order：未排队按书写顺序；排队后 x 在前、y 在后，中间点号跟随 */
  const orderOf = (k) => {
    const t = k[0];
    const i = +k.slice(1);
    if (!s.sorted) return { l: 0, x: 1, m: 2, y: 3, r: 4, s: 5 }[t] + i * 6;
    if (t === 'x') return i * 2;
    if (t === 'm') return i === s.n - 1 ? 2 * s.n - 1 : i * 2 + 1; // x 队内的点号；最后一个连接 x 队与 y 队
    if (t === 's') return 2 * s.n + i * 2 + 1; // y 队内的点号
    if (t === 'y') return 2 * s.n + i * 2;
    return -1; // 括号隐藏
  };

  const place = (animate) => {
    const els = [...host.children];
    const before = new Map(els.map((e) => [e, e.getBoundingClientRect()]));
    host.classList.toggle('sorted', s.sorted);
    els.forEach((e) => { e.style.order = orderOf(e.dataset.k); });
    if (!animate) return;
    els.forEach((e) => {
      const a = before.get(e);
      const b = e.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (!dx && !dy) return;
      e.style.transition = 'none';
      e.style.transform = `translate(${dx}px, ${dy}px)`;
      requestAnimationFrame(() => { e.style.transition = 'transform .6s ease'; e.style.transform = ''; });
    });
  };

  const readout = () => {
    const [x, y] = PAIRS[s.pair];
    $('lineBrace').textContent = s.sorted
      ? `${s.n} 个 ${x} 排一队，${s.n} 个 ${y} 排一队（因数一个没多、一个没少）`
      : `${s.n} 个 (${x}·${y}) 相乘`;
    const prod = s.pair === 'ab' ? '' : `\\quad\\left(12^{${s.n}}=${powStr(12, s.n)},\\ ${powStr(3, s.n)}\\times${powStr(4, s.n)}=${powStr(12, s.n)}\\right)`;
    const base = s.pair === 'ab' ? 'ab' : '3\\times4';
    $('lineEq').innerHTML = s.sorted ? `$(${base})^{${s.n}}=${x}^{${s.n}}${s.pair === 'ab' ? '' : '\\times'}${y}^{${s.n}}${prod}$` : `$(${base})^{${s.n}}=\\ ?$`;
    $('lineGo').textContent = s.sorted ? '还原成一对一对' : '交换、结合：重新排队';
    $('lineN').textContent = s.n;
    $('lineBox').querySelectorAll('[data-pair]').forEach((b) => b.classList.toggle('solid', b.dataset.pair === s.pair));
    tex($('lineEq'));
  };

  const rebuild = () => { build(); place(false); readout(); };
  slider($('lineNi'), (v) => { s.n = v; rebuild(); });
  $('lineGo').addEventListener('click', () => { s.sorted = !s.sorted; place(true); readout(); });
  $('lineBox').addEventListener('click', (e) => {
    const b = e.target.closest('[data-pair]');
    if (!b) return;
    s.pair = b.dataset.pair;
    rebuild();
  });
}

/* ---------- 第 13 页：储油罐（按比例：1 m = 3.6 单位，底面中心线 y = 172） ---------- */
function initTank() {
  const K = 3.6;
  const Y0 = 172;
  slider($('tankH'), (h) => {
    const y = Y0 - h * K;
    $('oil').setAttribute('d', `M78 ${y} V${Y0} A72 18 0 0 0 222 ${Y0} V${y} Z`);
    $('oilTop').setAttribute('cy', y);
    $('oilLbl').setAttribute('y', (y + Y0) / 2 + 6);
    $('oilLbl').textContent = `${h} m`;
    $('tankHV').textContent = h;
    const v = Math.PI * 400 * h; // m³
    $('tankV').textContent = h ? `${(400 * h).toLocaleString('en').replace(/,/g, ' ')}π ≈ ${Math.round(v).toLocaleString('en').replace(/,/g, ' ')} m³` : '0';
  });
}

window.LESSON = {
  init() {
    initGrid();
    initLine();
    initTank();
  },
};
