'use strict';
/* 课本插件 · 仿真科学计算器（单变量统计 statx 模式；九上 3.3、3.5 用）。不依赖 math.js，加载在 course.js 之前。
 * 按键与课本 p110、p118 的操作顺序一致：ON → MODE 1（statx）→ ALPHA M+（进入/退出录入）→ 输入 x、▼、输入 FRQ、▼ … →
 * ALPHA 4 =（平均数 x̄）、ALPHA × =（方差 σ²）。结果一律由代码按录入的数据精确计算，显示 10 位有效数字。
 *   const c = MCalc.create(el, { onChange(state) {} });
 *   c.press('MODE'); c.play(['ON', 'MODE', '1', …]); c.step(); c.reset();
 * 键名：ON MODE ALPHA M+ AC DEL UP DOWN 0–9 . × =
 * 序列写法：MCalc.seq('MODE 1 ALPHA M+ 10 ▼ 4 ▼') —— 多位数会拆成单键，▼/▲ 写成箭头即可。
 */
const MCalc = (() => {
  // [键名, 键面文字, 上方小字（课本键帽上的第二功能，只标本课用到的）, 样式]
  const KEYS = [
    ['ON', 'ON', 'OFF', 'fn'], ['MODE', 'MODE', 'CA', 'fn'], ['ALPHA', 'ALPHA', 'RCL', 'fn alpha'], ['M+', 'M+', 'M− M', 'fn mplus'], ['AC', 'AC', '', 'fn ac'],
    ['7', '7'], ['8', '8'], ['9', '9'], ['DEL', 'DEL', '', 'fn'], ['UP', '▲', '', 'fn'],
    ['4', '4', 'x̄', ''], ['5', '5'], ['6', '6'], ['×', '×', 'σ²', ''], ['DOWN', '▼', '', 'fn'],
    ['1', '1', 'Σxy', ''], ['2', '2'], ['3', '3'], ['0', '0'], ['.', '.'],
    ['=', '=', 'ANS', 'eq'],
  ];
  const LABEL = Object.fromEntries(KEYS.map(([k, face]) => [k, face]));

  /** 'MODE 1 ALPHA M+ 10 ▼ 4 ▼' → ['MODE','1','ALPHA','M+','1','0','DOWN','4','DOWN'] */
  function seq(text) {
    return text.trim().split(/\s+/).flatMap((t) => {
      if (t === '▼') return ['DOWN'];
      if (t === '▲') return ['UP'];
      if (/^[\d.]+$/.test(t) && t.length > 1) return t.split('');
      return [t];
    });
  }

  /** 10 位有效数字，去掉末尾的 0（课本显示 30.857 142 86） */
  const show = (v) => {
    if (!Number.isFinite(v)) return 'ERROR';
    const s = Math.abs(v) < 1e-12 ? '0' : v.toPrecision(10);
    return s.includes('e') ? s : s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  };

  function create(host, opt = {}) {
    const el = typeof host === 'string' ? document.querySelector(host) : host;
    el.classList.add('mcalc');
    el.setAttribute('data-noswipe', '');
    el.innerHTML = `
      <div class="mc-lcd"><div class="mc-ind"></div><div class="mc-l1"></div><div class="mc-l2"></div></div>
      <div class="mc-keys">${KEYS.map(([k, face, top, cls]) => `<button type="button" class="mc-k ${cls || ''}" data-k="${k}"><small>${top || '&nbsp;'}</small><span>${face}</span></button>`).join('')}</div>`;
    const lcd = { ind: el.querySelector('.mc-ind'), l1: el.querySelector('.mc-l1'), l2: el.querySelector('.mc-l2') };

    let s;
    const blank = () => ({
      on: false, stat: false, menu: false, alpha: false, entry: false,
      rows: [], row: 0, field: 'x', buf: '', ask: null, l1: '', l2: '', msg: '',
    });

    const cur = () => s.rows[s.row] || null;
    const commit = () => {
      if (s.buf === '' || s.buf === '.') { s.buf = ''; return; }
      const v = +s.buf;
      s.buf = '';
      if (s.field === 'x') {
        if (!cur()) s.rows.push({ x: v, f: 1 });
        else cur().x = v;
      } else if (cur()) cur().f = v;
    };
    const data = () => s.rows.filter((r) => Number.isFinite(r.x) && r.f > 0);
    const stats = () => {
      const d = data();
      const n = d.reduce((a, r) => a + r.f, 0);
      if (!n) return null;
      const mean = d.reduce((a, r) => a + r.x * r.f, 0) / n;
      const v = d.reduce((a, r) => a + r.f * (r.x - mean) ** 2, 0) / n;
      return { n, mean, v };
    };

    function paint() {
      const ind = [s.on && s.stat ? 'STAT' : '', s.alpha ? 'A' : '', s.entry ? 'DATA' : ''].filter(Boolean);
      lcd.ind.textContent = ind.join('  ');
      if (!s.on) { lcd.l1.textContent = ''; lcd.l2.textContent = ''; el.classList.add('off'); return; }
      el.classList.remove('off');
      if (s.entry) {
        const r = cur();
        const i = s.row + 1;
        lcd.l1.textContent = s.field === 'x' ? `x${i}=` : `FRQ${i}=`;
        const stored = r ? (s.field === 'x' ? r.x : r.f) : (s.field === 'x' ? '' : 1);
        lcd.l2.textContent = s.buf !== '' ? s.buf : String(stored === '' ? 0 : stored);
      } else {
        lcd.l1.textContent = s.l1;
        lcd.l2.textContent = s.l2;
      }
      if (opt.onChange) opt.onChange(api.state());
    }

    function press(k) {
      const keyEl = el.querySelector(`[data-k="${CSS.escape(k)}"]`);
      if (keyEl) { keyEl.classList.add('down'); setTimeout(() => keyEl.classList.remove('down'), 260); }
      if (k === 'ON') { s = { ...blank(), on: true, l1: '', l2: '0' }; return paint(); }
      if (!s.on) return paint();
      const alpha = s.alpha;
      s.alpha = false;
      if (k === 'ALPHA') { s.alpha = !alpha; return paint(); }
      if (alpha) {
        if (k === 'M+' && s.stat) {
          if (s.entry) { commit(); s.entry = false; s.l1 = '数据已存入'; s.l2 = `n=${stats() ? stats().n : 0}`; }
          else { s.entry = true; s.row = s.rows.length; s.field = 'x'; s.buf = ''; }
          return paint();
        }
        if (k === '4' && s.stat && !s.entry) { s.ask = 'mean'; s.l1 = 'x̄'; s.l2 = ''; return paint(); }
        if (k === '×' && s.stat && !s.entry) { s.ask = 'var'; s.l1 = 'σ²'; s.l2 = ''; return paint(); }
        return paint();
      }
      if (k === 'MODE') { s.menu = true; s.entry = false; s.l1 = 'MODE'; s.l2 = '1:statx'; return paint(); }
      if (s.menu) {
        s.menu = false;
        if (k === '1') { s = { ...blank(), on: true, stat: true, l1: 'statx', l2: '0' }; }
        return paint();
      }
      if (k === 'AC') { s.buf = ''; s.ask = null; if (!s.entry) { s.l1 = ''; s.l2 = '0'; } return paint(); }
      if (k === 'DEL') { s.buf = s.buf.slice(0, -1); return paint(); }
      if (s.entry) {
        if (/^[\d.]$/.test(k)) { if (!(k === '.' && s.buf.includes('.'))) s.buf += k; return paint(); }
        if (k === 'DOWN') {
          commit();
          if (s.field === 'x') { if (cur()) s.field = 'f'; } else { s.row += 1; s.field = 'x'; }
          return paint();
        }
        if (k === 'UP') {
          commit();
          if (s.field === 'f') s.field = 'x';
          else if (s.row > 0) { s.row -= 1; s.field = 'f'; }
          return paint();
        }
        return paint();
      }
      if (k === '=' && s.ask) {
        const st = stats();
        s.l2 = st ? show(s.ask === 'mean' ? st.mean : st.v) : 'ERROR';
        s.ask = null;
        return paint();
      }
      if (/^[\d.]$/.test(k)) { s.l1 = ''; s.l2 = (s.l2 === '0' || s.l2.length > 12 ? '' : s.l2) + k; }
      return paint();
    }

    // 演示：play(序列) 自动按；step() 按下一键
    let queue = [];
    let qi = 0;
    let timer = null;
    const stop = () => { clearInterval(timer); timer = null; };
    const step = () => {
      if (qi >= queue.length) { stop(); return false; }
      press(queue[qi]);
      qi += 1;
      if (opt.onStep) opt.onStep(qi, queue);
      if (qi >= queue.length) stop();
      return true;
    };
    const load = (keys) => { stop(); queue = keys; qi = 0; s = blank(); paint(); if (opt.onStep) opt.onStep(0, queue); };
    const play = (keys, ms = 520) => { if (keys) load(keys); stop(); timer = setInterval(step, ms); };

    el.querySelector('.mc-keys').addEventListener('click', (e) => {
      const b = e.target.closest('[data-k]');
      if (b) { stop(); press(b.dataset.k); }
    });

    const api = {
      press, step, play, load, stop,
      reset() { stop(); s = blank(); paint(); },
      state: () => ({ ...s, rows: s.rows.map((r) => ({ ...r })), stats: stats() }),
      get index() { return qi; },
    };
    s = blank();
    paint();
    return api;
  }

  /** 按键序列的“键帽条”HTML：cur 为已按到的位置 */
  function strip(keys, cur = 0) {
    return keys.map((k, i) => `<span class="mc-chip ${i < cur ? 'done' : ''} ${i === cur - 1 ? 'now' : ''} ${/^[\d.]$/.test(k) ? 'num' : ''}">${LABEL[k] || k}</span>`).join('');
  }

  return { create, seq, strip, show };
})();
window.MCalc = MCalc;
