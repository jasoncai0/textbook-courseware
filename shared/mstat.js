'use strict';
/* 课本插件 · 统计与概率作图（初中第 7、8 章用；依赖 math.js 的 MathKit.board，加载在 math.js 之后、course.js 之前）
 * 1. 扇形图：MStat.pie(el, [{ name, v, color }], { start: 0 }) —— 从 12 点方向起顺时针，按 v 的比例精确计算圆心角；
 *    返回 { set(items) } 可换数据重画。label(item, 百分比) 自定义标注文字。
 * 2. 条形图：MStat.bars(el, { cats, series: [{ name, vals, color }], ymax, ty, labels, values: true })
 *    vals 可以是函数（动态数据）；返回 MathKit.board 对象（数据变后调 b.update()）。
 * 3. 折线图：MStat.line(el, { xs, series: [{ vals, color }], x, y, ty, xLabels, labels })，xs 为横坐标（等距类目用 0,1,2…）。
 * 4. 划记：MStat.tally(n) 返回“正”字划记的 HTML（每 5 笔一个“正”，不足 5 笔画出相应笔画）。
 */
const MStat = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const COLORS = ['#4f9bd0', '#d9711c', '#2f7d6b', '#c0577a', '#8a6fc4', '#e0b03a', '#6f8191', '#9bc46a'];
  const OFF = [[-1e5, -1e5], [-1e5, -1e5], [-1e5, -1e5]];
  const val = (v) => (typeof v === 'function' ? v() : v);
  const f1 = (v) => (+v.toFixed(1)).toString();

  /* ---------- 扇形图 ---------- */
  function pie(host, items, o = {}) {
    const el = typeof host === 'string' ? document.querySelector(host) : host;
    const R = o.r || 100;
    const pad = o.pad ?? 70;
    const W = 2 * (R + pad);
    const H = 2 * (R + (o.padY ?? 34));
    const cx = W / 2;
    const cy = H / 2;
    el.classList.add('spie');
    const label = o.label || ((it, p) => `${it.name} ${f1(p)}%`);
    const fs = o.fs || 16; // 标注字号（viewBox 单位，与本课 CSS 的 .pl 字号一致）
    const textW = (t) => [...t].reduce((w, ch) => w + (ch.charCodeAt(0) < 256 ? 0.56 : 1), 0) * fs;
    const set = (list) => {
      const total = list.reduce((s, it) => s + it.v, 0);
      let a = ((o.start || 0) * Math.PI) / 180; // 0 = 12 点方向，顺时针
      const pt = (ang, r) => [cx + r * Math.sin(ang), cy - r * Math.cos(ang)];
      const boxes = [];
      const hit = (bx) => boxes.some((q) => bx[0] < q[2] + 6 && q[0] < bx[2] + 6 && bx[1] < q[3] + 2 && q[1] < bx[3] + 2);
      const parts = total > 0 ? list.map((it, i) => {
        const frac = it.v / total;
        const a1 = a + frac * 2 * Math.PI;
        const [x0, y0] = pt(a, R);
        const [x1, y1] = pt(a1, R);
        const mid = (a + a1) / 2;
        const color = it.color || COLORS[i % COLORS.length];
        const shape = frac >= 0.99999
          ? `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${color}" stroke="#fff" stroke-width="2"/>`
          : `<path d="M${cx} ${cy}L${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 ${frac > 0.5 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z" fill="${color}" stroke="#fff" stroke-width="2"/>`;
        // 12 点附近的标注：右侧小扇形的字写在左边，避免与右邻扇形的标注重叠
        const anchor = Math.sin(mid) > 0.15 ? 'start' : Math.sin(mid) < -0.15 ? 'end' : Math.cos(mid) > 0 ? (Math.sin(mid) >= 0 ? 'end' : 'start') : 'middle';
        const dyU = Math.cos(mid) < -0.5 ? 0.9 * fs : Math.cos(mid) > 0.5 ? -0.2 * fs : 0.35 * fs;
        let txt = '';
        if (frac > 0 && o.labels !== false) {
          const t = label(it, frac * 100, frac * 360);
          const w = textW(t);
          // 先放在扇形外侧；与已放好的标注重叠时，依次试：上下错开一行、两行，再往外推
          const [bx0, by0] = pt(mid, R + 14);
          const h = fs * 1.15;
          const tries = [];
          for (let k = 0; k < 4; k++) [0, -h, h, -2 * h, 2 * h].forEach((d) => tries.push([Math.sin(mid) * k * h, -Math.cos(mid) * k * h + d]));
          [1, -1, 2, -2].forEach((m) => [0, -h].forEach((d) => tries.push([m * (w + 8), d]))); // 再试左右平移
          const clear = (q) => { // 标注框不能压到圆上
            const nx = Math.min(Math.max(cx, q[0]), q[2]);
            const ny = Math.min(Math.max(cy, q[1]), q[3]);
            return (nx - cx) ** 2 + (ny - cy) ** 2 >= (R + 3) ** 2;
          };
          let lx; let ly; let bx;
          const place = ([dx, dy]) => {
            lx = bx0 + dx; ly = by0 + dy;
            const left = anchor === 'start' ? lx : anchor === 'end' ? lx - w : lx - w / 2;
            bx = [left, ly + dyU - fs * 0.85, left + w, ly + dyU + fs * 0.2];
            return bx[1] >= 0 && bx[3] <= H && bx[0] >= 0 && bx[2] <= W && clear(bx) && !hit(bx);
          };
          if (!tries.some(place)) place(tries[0]);
          const moved = Math.hypot(lx - bx0, ly - by0) > 1;
          boxes.push(bx);
          const lead = moved ? `<line x1="${pt(mid, R - 3)[0].toFixed(1)}" y1="${pt(mid, R - 3)[1].toFixed(1)}" x2="${lx.toFixed(1)}" y2="${(ly + dyU - fs * 0.3).toFixed(1)}" stroke="#6f8191" stroke-width="1"/>` : '';
          txt = `${lead}<text x="${lx.toFixed(1)}" y="${(ly + dyU).toFixed(1)}" text-anchor="${anchor}" class="pl" style="font-size:${fs}px">${t}</text>`;
        }
        a = a1;
        return frac > 0 ? `<g data-i="${i}">${shape}${txt}</g>` : '';
      }) : [`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#eef2f6" stroke="#cdd8e2" stroke-width="2"/>`];
      el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" overflow="visible">${parts.join('')}</svg>`;
    };
    set(items);
    return { set };
  }

  /* ---------- 条形图（可复式）---------- */
  function bars(host, o) {
    const n = o.cats.length;
    const S = o.series;
    const ymax = o.ymax;
    host.classList.add('schart');
    const b = MathKit.board(host, {
      x: [-0.75, n + (o.labels && o.labels[0] ? 1.7 : 0.5)], y: [-ymax * (o.below ?? 0.14), ymax * 1.14], w: o.w || 560, h: o.h || 300,
      ticks: [0, o.ty], labels: o.labels || ['', ''], grid: o.grid ?? true,
    });
    const gw = o.gw || 0.62; // 一组条形占的宽度
    const bw = gw / S.length;
    S.forEach((s, k) => {
      for (let i = 0; i < n; i++) {
        const x0 = i + 0.5 - gw / 2 + k * bw;
        const v = () => val(s.vals)[i];
        b.poly(() => (v() > 0 ? [[x0, 0], [x0 + bw, 0], [x0 + bw, v()], [x0, v()]] : OFF), { cls: `sbar s${k}` })
          .style.fill = s.color || COLORS[k];
        if (o.values !== false) b.text(() => (v() > 0 ? [x0 + bw / 2, v()] : null), () => (o.fmt ? o.fmt(v()) : String(v())), { cls: 'sval', dy: -5 });
      }
    });
    o.cats.forEach((c, i) => b.text([i + 0.5, 0], c, { cls: 'scat', dy: 20 }));
    return b;
  }

  /* ---------- 折线图 ---------- */
  function line(host, o) {
    host.classList.add('schart');
    const b = MathKit.board(host, {
      x: o.x, y: o.y, w: o.w || 560, h: o.h || 300, ticks: [o.tx || 0, o.ty], labels: o.labels || ['', ''],
      tickLabels: o.tickLabels,
    });
    if (o.xLabels) o.xLabels.forEach(([x, t]) => b.text([x, o.y[0] < 0 ? 0 : o.y[0]], t, { cls: 'scat', dy: 20 }));
    o.series.forEach((s, k) => {
      const color = s.color || COLORS[k];
      const pts = () => val(o.xs).map((x, i) => [x, val(s.vals)[i]]).filter(([, y]) => Number.isFinite(y));
      const maxN = s.maxN || val(o.xs).length;
      for (let i = 0; i < maxN - 1; i++) {
        b.seg(() => { const p = pts(); return p[i + 1] ? [p[i], p[i + 1]] : [[-1e5, -1e5], [-1e5, -1e5]]; }, { cls: 'sline' }).style.stroke = color;
      }
      for (let i = 0; i < maxN; i++) {
        b.pt(() => pts()[i] || null, { r: s.r || 4 }).style.fill = color;
        if (s.values) b.text(() => pts()[i] || null, () => (s.fmt ? s.fmt(pts()[i][1]) : String(pts()[i][1])), { cls: 'sval', dy: s.dy || -8, dx: s.dx || 0 });
      }
    });
    return b;
  }

  /* ---------- “正”字划记 ---------- */
  // 一个“正”的 5 笔：横、竖、横（中）、竖（左下）、横（底）
  const STROKES = ['M2 2H18', 'M10 2V22', 'M10 12H17', 'M4 12V22', 'M1 22H19'];
  function tally(n) {
    if (!n) return '';
    const full = Math.floor(n / 5);
    const rest = n % 5;
    const one = (k) => `<svg class="zheng" viewBox="0 0 20 24" aria-hidden="true"><path d="${STROKES.slice(0, k).join('')}"/></svg>`;
    return `<span class="tally" aria-label="${n}">${one(5).repeat(full)}${rest ? one(rest) : ''}</span>`;
  }

  return { pie, bars, line, tally, COLORS, el: (tag) => document.createElementNS(NS, tag) };
})();
window.MStat = MStat;
