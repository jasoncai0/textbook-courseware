'use strict';
/* 课本插件 · 即时判对错（小学数学用；不依赖 math.js，加载在 course.js 之前）
 * 1. 填空：<span class="blank" data-ans="78.5"></span>
 *    多个可接受答案用 | 分隔（如 "10:9|10∶9"）；数值按大小比较（2/3 与 4/6、0.50 与 0.5 都算对）。
 *    回车或离开输入框时判断；对了变绿 ✓，错了变红并可再改。data-w="4" 设宽度（字符数）。
 * 2. 点选：<div class="pick" data-ans="b"><button data-k="a">…</button><button data-k="b">…</button><p class="pick-why">…</p></div>
 *    点对了显示 .pick-why（讲道理）；点错了按钮变红，可以再选。
 */
const MCheck = (() => {
  const norm = (s) => String(s).trim()
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[∶：]/g, ':').replace(/[．。]/g, '.').replace(/／/g, '/').replace(/\s+/g, '');
  // "3/4"、"0.75"、"3" → 数值；其他（如 "2:3"）→ NaN，按字符串比较
  const num = (s) => {
    const m = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (m) return +m[2] ? +m[1] / +m[2] : NaN;
    return /^-?\d+(\.\d+)?$/.test(s) ? +s : NaN;
  };
  const same = (got, want) => {
    const a = norm(got);
    const b = norm(want);
    if (a === b) return true;
    const [x, y] = [num(a), num(b)];
    return Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - y) < 1e-9;
  };
  const isRight = (got, ans) => ans.split('|').some((w) => same(got, w));

  function initBlank(el) {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.autocomplete = 'off';
    inp.inputMode = /^[\d.|]+$/.test(el.dataset.ans) ? 'decimal' : 'text';
    inp.setAttribute('aria-label', el.dataset.label || '填空');
    inp.style.width = `${(+el.dataset.w || Math.max(2, el.dataset.ans.split('|')[0].length)) * 0.62 + 1.1}em`; // 数字约 0.6em 宽；分数要输入“/”，用普通键盘
    el.setAttribute('data-noswipe', '');
    el.appendChild(inp);
    const check = () => {
      const v = inp.value;
      el.classList.remove('ok', 'no');
      if (!norm(v)) return;
      el.classList.add(isRight(v, el.dataset.ans) ? 'ok' : 'no');
    };
    inp.addEventListener('change', check);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { check(); inp.blur(); } });
    inp.addEventListener('input', () => el.classList.remove('ok', 'no'));
  }

  function initPick(el) {
    el.setAttribute('data-noswipe', '');
    el.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-k]');
      if (!btn || el.classList.contains('done')) return;
      const ok = btn.dataset.k === el.dataset.ans;
      btn.classList.add(ok ? 'ok' : 'no');
      if (ok) el.classList.add('done');
    });
  }

  function init(root = document) {
    root.querySelectorAll('.blank:not([data-ready])').forEach((el) => { el.dataset.ready = '1'; initBlank(el); });
    root.querySelectorAll('.pick:not([data-ready])').forEach((el) => { el.dataset.ready = '1'; initPick(el); });
  }

  init();
  return { init, isRight };
})();
window.MCheck = MCheck;
