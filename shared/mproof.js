'use strict';
/* 课本插件 · 几何证明工具（七下第 12 章 证明 起用；依赖 math.js 的 MathKit.tex，加载在 math.js 之后、course.js 之前）
 * 1. 依据卡：<button class="yj" data-k="perp-def">垂直的定义</button>
 *    点开后在画框底部弹出卡片：这条依据的完整内容、类别（定义/基本事实/定理…）、出自哪一册哪一课、小图。
 *    卡片内容来自 MProof.BASIS（下面的通用库）；本课可用 MProof.addBasis({ key: { t, kind, src, body, fig } }) 补充。
 *    按钮里不写文字时自动填 BASIS[k].t。
 * 2. 证明搭积木：
 *    <div class="pblocks" data-done="完成后的提示">
 *      证明行里放空槽 <button class="slot" data-ans="tw-pd|nc-pd"></button>（多个可接受答案用 | 分隔）
 *      <div class="pb-bank"><button class="tile" data-k="tw-pd"></button>…</div>（积木可重复使用）
 *      <p class="pb-msg"></p> <button class="btn pb-reset">重来</button>
 *    </div>
 *    拖积木到空槽，或先点积木再点空槽；放对了空槽变绿并变成可点开的依据卡，放错了抖一下并给提示。
 * 3. MProof.open(k) / MProof.close() 以脚本方式打开、关闭依据卡。
 */
const MProof = (() => {
  /* ---------- 小图：两直线被第三条直线所截，标出一对角 ---------- */
  const RAD = Math.PI / 180;
  function pairFig(kind) {
    // 直线 a: y = 40，b: y = 100；截线过 (129.5, 40)、(80.4, 100)，与水平方向成约 50.7°
    const P = [129.5, 40];
    const Q = [80.4, 100];
    const up = Math.atan2(60, 49.1) / RAD; // 截线向上方向（数学角，y 轴向上）
    const arc = ([cx, cy], a0, a1, col) => {
      const r = 13;
      const p = (a) => [cx + r * Math.cos(a * RAD), cy - r * Math.sin(a * RAD)];
      const [s, e] = [p(a0), p(a1)];
      return `<path d="M${cx} ${cy} L${s[0].toFixed(1)} ${s[1].toFixed(1)} A${r} ${r} 0 0 0 ${e[0].toFixed(1)} ${e[1].toFixed(1)} Z" fill="${col}" fill-opacity=".35" stroke="${col}" stroke-width="2"/>`;
    };
    // 每个交点的四个角：右上 [0, up]，左上 [up, 180]，左下 [180, 180+up]，右下 [180+up, 360]
    const Q4 = { ru: [0, up], lu: [up, 180], ld: [180, 180 + up], rd: [180 + up, 360] };
    const pick = { tw: ['ru', 'ru'], nc: ['rd', 'lu'], tp: ['rd', 'ru'] }[kind];
    const [c1, c2] = ['#d9711c', '#1d6fa5'];
    return `<svg viewBox="0 0 210 130" class="yj-fig" aria-hidden="true">
      <line x1="10" y1="40" x2="200" y2="40" stroke="#1f2d3a" stroke-width="2"/><line x1="10" y1="100" x2="200" y2="100" stroke="#1f2d3a" stroke-width="2"/>
      <line x1="${80.4 - 49.1 * 0.55}" y1="${100 + 60 * 0.55}" x2="${129.5 + 49.1 * 0.45}" y2="${40 - 60 * 0.45}" stroke="#1f2d3a" stroke-width="2"/>
      ${arc(P, ...Q4[pick[0]], c1)}${arc(Q, ...Q4[pick[1]], c2)}
      <text x="196" y="34" font-size="13" font-style="italic">a</text><text x="196" y="94" font-size="13" font-style="italic">b</text></svg>`;
  }
  const angleFig = (both) => `<svg viewBox="0 0 210 110" class="yj-fig" aria-hidden="true">
      <path d="M20 90 H190" stroke="#1f2d3a" stroke-width="2"/><path d="M105 90 L${105 + 80 * Math.cos(62 * RAD)} ${90 - 80 * Math.sin(62 * RAD)}" stroke="#1f2d3a" stroke-width="2"/>
      ${both ? `<path d="M105 90 L${105 + 80 * Math.cos(118 * RAD)} ${90 - 80 * Math.sin(118 * RAD)}" stroke="#1d6fa5" stroke-width="2" stroke-dasharray="5 4"/>` : ''}
      <path d="M125 90 A20 20 0 0 0 ${105 + 20 * Math.cos(62 * RAD)} ${90 - 20 * Math.sin(62 * RAD)}" fill="none" stroke="#d9711c" stroke-width="2.5"/>
      <path d="M${105 + 26 * Math.cos(62 * RAD)} ${90 - 26 * Math.sin(62 * RAD)} A26 26 0 0 0 79 90" fill="none" stroke="#1d6fa5" stroke-width="2.5"/></svg>`;

  /* ---------- 通用依据库（七上、七下已学的定义、基本事实、定理） ---------- */
  const BASIS = {
    known: { t: '已知', kind: '推理', src: '题目给出的条件', body: '题目里“已知”部分写明的条件，可以直接拿来用。' },
    proved: { t: '已证', kind: '推理', src: '前面的推理', body: '前面推理已经得到的“果”，可以当作后面推理的“因”。课本说：这样的步骤通常可以省略不写。' },
    subst: { t: '等量代换', kind: '推理', src: '课本 p150 注', body: '一个量用与它相等的量代替，叫做“等量代换”。<br>例：$\\angle1=90^\\circ$，$\\angle2=90^\\circ$，所以 $\\angle1=\\angle2$。' },
    'eq-prop': { t: '等式性质', kind: '性质', src: '七上 4.2 解一元一次方程', body: '等式两边都加上（或减去）同一个数或同一个式子，所得结果仍是等式；等式两边都乘（或除以，除数不为 0）同一个数，所得结果仍是等式。' },
    'perp-def': { t: '垂直的定义', kind: '定义', src: '七上 6.5 垂直', body: '两条直线相交所成的四个角中，有一个角是直角时，就说这两条直线互相垂直。<br>反过来用：两条直线互相垂直 ⇒ 它们的夹角是 $90^\\circ$。' },
    'bis-def': { t: '角平分线的定义', kind: '定义', src: '七上 6.2 角', body: '从一个角的顶点引出的一条射线，把这个角分成两个相等的角，这条射线叫做这个角的平分线。<br>所以：$OC$ 平分 $\\angle AOB$ ⇒ $\\angle AOC=\\angle BOC=\\dfrac12\\angle AOB$。' },
    'flat-def': { t: '平角的定义', kind: '定义', src: '七上 6.2 角', body: '一条射线绕端点旋转，当终边和始边成一条直线时，所成的角叫做平角，平角等于 $180^\\circ$。<br>所以一条直线上、同一顶点处拼成平角的几个角，和为 $180^\\circ$。' },
    'par-def': { t: '平行线的定义', kind: '定义', src: '七上 6.4 平行', body: '在同一平面内，不相交的两条直线叫做平行线。' },
    'comp-def': { t: '余角、补角的定义', kind: '定义', src: '七上 6.3 余角、补角、对顶角', body: '两个角的和等于 $90^\\circ$，这两个角互为余角；两个角的和等于 $180^\\circ$，这两个角互为补角。' },
    vert: { t: '对顶角相等', kind: '性质', src: '七上 6.3 余角、补角、对顶角', body: '两条直线相交，对顶角相等。', fig: angleFig(true) },
    'same-comp': { t: '同角（等角）的余角相等', kind: '性质', src: '七上 6.3 余角、补角、对顶角', body: '同角或等角的余角相等；同角或等角的补角相等。' },
    'par-axiom': { t: '平行公理', kind: '基本事实', src: '七上 6.4 平行', body: '过直线外一点，有且只有一条直线与这条直线平行。<br>所以“过点 $C$ 画 $CE\\parallel AB$”是能画、而且只能画出一条的。' },
    'tw-pd': { t: '同位角相等，两直线平行', kind: '基本事实', src: '七下 7.1 探索直线平行的条件', body: '两条直线被第三条直线所截，如果同位角相等，那么这两条直线平行。', fig: pairFig('tw') },
    'nc-pd': { t: '内错角相等，两直线平行', kind: '判定', src: '七下 7.1 探索直线平行的条件', body: '两条直线被第三条直线所截，如果内错角相等，那么这两条直线平行。', fig: pairFig('nc') },
    'tp-pd': { t: '同旁内角互补，两直线平行', kind: '判定', src: '七下 7.1 探索直线平行的条件', body: '两条直线被第三条直线所截，如果同旁内角互补，那么这两条直线平行。', fig: pairFig('tp') },
    'tw-xz': { t: '两直线平行，同位角相等', kind: '性质', src: '七下 7.2 探索平行线的性质', body: '两条平行直线被第三条直线所截，同位角相等。', fig: pairFig('tw') },
    'nc-xz': { t: '两直线平行，内错角相等', kind: '性质', src: '七下 7.2 探索平行线的性质', body: '两条平行直线被第三条直线所截，内错角相等。', fig: pairFig('nc') },
    'tp-xz': { t: '两直线平行，同旁内角互补', kind: '性质', src: '七下 7.2 探索平行线的性质', body: '两条平行直线被第三条直线所截，同旁内角互补。', fig: pairFig('tp') },
    aux: { t: '辅助线画法', kind: '作图', src: '课本 p153 注', body: '为了证明的需要，在原来图形上添画的线叫辅助线，辅助线通常画成虚线。<br>“过点 $C$ 画 $CE\\parallel AB$”能画出来，依据是平行公理：过直线外一点有且只有一条直线与这条直线平行。' },
    'tri-sum': { t: '三角形内角和定理', kind: '定理', src: '七下 12.2 证明（7.5 已说明）', body: '三角形三个内角的和等于 $180^\\circ$。' },
    'ext-angle': { t: '三角形的外角等于与它不相邻的两个内角的和', kind: '推论', src: '七下 12.2 证明', body: '由三角形内角和定理直接推出：$\\angle ACD=\\angle A+\\angle B$（$\\angle ACD$ 是 $\\triangle ABC$ 的外角）。' },
    'perp-par': { t: '垂直于同一条直线的两条直线平行', kind: '定理', src: '七下 12.2 证明', body: '在同一平面内，如果 $a\\perp c$，$b\\perp c$，那么 $a\\parallel b$。' },
    'par-trans': { t: '平行于同一条直线的两条直线平行', kind: '定理', src: '七下 12.3 例 1（七上 6.4 曾由操作得到）', body: '如果 $b\\parallel a$，$c\\parallel a$，那么 $b\\parallel c$。' },
    'rt-acute': { t: '直角三角形的两个锐角互余', kind: '定理', src: '七下 12.3 例 2', body: '在 $\\triangle ABC$ 中，如果 $\\angle C=90^\\circ$，那么 $\\angle A+\\angle B=90^\\circ$。' },
  };
  const addBasis = (more) => Object.assign(BASIS, more);
  const KIND_CLS = { 定义: 'k-def', 基本事实: 'k-fact', 定理: 'k-thm', 推论: 'k-thm', 性质: 'k-thm', 判定: 'k-thm', 推理: 'k-rule', 作图: 'k-rule' };

  /* ---------- 依据卡弹窗：挂在画框底部 ---------- */
  let pop = null;
  function ensurePop() {
    if (pop) return pop;
    pop = document.createElement('div');
    pop.className = 'yj-pop';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('data-noswipe', '');
    pop.innerHTML = '<button type="button" class="yj-x" aria-label="关闭">×</button><div class="yj-in"></div>';
    (document.getElementById('frame') || document.body).appendChild(pop);
    pop.querySelector('.yj-x').addEventListener('click', close);
    return pop;
  }
  function open(k) {
    const c = BASIS[k];
    if (!c) { console.error(`依据卡缺少条目：${k}`); return; }
    const p = ensurePop();
    p.querySelector('.yj-in').innerHTML = `<p class="yj-head"><span class="yj-kind ${KIND_CLS[c.kind] || ''}">${c.kind}</span><b>${c.t}</b><span class="yj-src">${c.src}</span></p>
      <div class="yj-body">${c.fig ? `<div class="yj-figbox">${c.fig}</div>` : ''}<p>${c.body}</p></div>`;
    MathKit.tex(p);
    p.classList.add('open');
  }
  function close() { if (pop) pop.classList.remove('open'); }

  function initYj(root = document) {
    root.querySelectorAll('.yj:not([data-yj])').forEach((el) => {
      el.dataset.yj = '1';
      if (!el.textContent.trim() && BASIS[el.dataset.k]) el.textContent = BASIS[el.dataset.k].t;
      if (el.tagName === 'BUTTON') el.type = 'button';
    });
  }
  document.addEventListener('click', (e) => {
    const y = e.target.closest('.yj[data-k]');
    if (y && !y.closest('.slot:not(.ok)')) { open(y.dataset.k); return; }
    if (pop && pop.classList.contains('open') && !e.target.closest('.yj-pop')) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  /* ---------- 证明搭积木 ---------- */
  const DRAG_PX = 6;
  function initBlocks(box) {
    const slots = [...box.querySelectorAll('.slot')];
    const tiles = [...box.querySelectorAll('.tile')];
    const msg = box.querySelector('.pb-msg');
    box.setAttribute('data-noswipe', '');
    tiles.forEach((t) => { t.type = 'button'; if (!t.textContent.trim() && BASIS[t.dataset.k]) t.textContent = BASIS[t.dataset.k].t; });
    slots.forEach((s) => { s.type = 'button'; s.setAttribute('aria-label', '空槽：放入依据'); });
    let picked = null;
    const say = (html, cls = '') => { if (!msg) return; msg.className = `pb-msg tip feedback ${cls}`; msg.innerHTML = html; MathKit.tex(msg); };
    const progress = () => {
      const n = slots.filter((s) => s.classList.contains('ok')).length;
      if (n === slots.length) say(box.dataset.done || '全部放对了！把证明从头到尾读一遍：每一步都有“因”、有“果”、有依据。', 'fb-ok');
      else say(`已放对 ${n} / ${slots.length}。拖动下面的积木到空槽里（也可以先点积木，再点空槽）。`);
    };
    const pick = (t) => { picked = picked === t ? null : t; tiles.forEach((x) => x.classList.toggle('picked', x === picked)); };
    function place(tile, slot) {
      if (!slot || slot.classList.contains('ok')) return;
      const k = tile.dataset.k;
      const ok = slot.dataset.ans.split('|').includes(k);
      if (ok) {
        slot.innerHTML = tile.innerHTML;
        slot.classList.remove('no');
        slot.classList.add('ok');
        if (BASIS[k]) { slot.classList.add('yj'); slot.dataset.k = k; }
        pick(null);
        progress();
        return;
      }
      slot.classList.remove('no');
      void slot.offsetWidth; // 重新触发抖动动画
      slot.classList.add('no');
      say(`「${tile.textContent}」放在这里不对。${slot.dataset.hint || '先看这一步的“因”是什么、“果”是什么，再找由因得果的依据。'}`, 'fb-warn');
    }
    slots.forEach((s) => s.addEventListener('click', (e) => {
      if (s.classList.contains('ok')) return;
      e.stopPropagation();
      if (picked) place(picked, s); else say('先点选（或拖动）下面的一块积木，再放进这个空槽。', 'fb-warn');
    }));
    tiles.forEach((t) => {
      let start = null;
      let ghost = null;
      let over = null;
      const slotAt = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.closest('.slot'); };
      t.addEventListener('pointerdown', (e) => { start = [e.clientX, e.clientY]; t.setPointerCapture(e.pointerId); });
      t.addEventListener('pointermove', (e) => {
        if (!start) return;
        if (!ghost && Math.hypot(e.clientX - start[0], e.clientY - start[1]) < DRAG_PX) return;
        if (!ghost) {
          ghost = t.cloneNode(true);
          ghost.classList.add('pb-ghost');
          ghost.style.fontSize = getComputedStyle(t).fontSize;
          document.body.appendChild(ghost);
        }
        ghost.style.left = `${e.clientX}px`;
        ghost.style.top = `${e.clientY}px`;
        const s = slotAt(e.clientX, e.clientY);
        if (over !== s) { if (over) over.classList.remove('hover'); over = s && box.contains(s) ? s : null; if (over) over.classList.add('hover'); }
      });
      const end = (e, cancel) => {
        if (!start) return;
        start = null;
        if (!ghost) { if (!cancel) pick(t); return; }
        ghost.remove();
        ghost = null;
        if (over) over.classList.remove('hover');
        const s = cancel ? null : slotAt(e.clientX, e.clientY);
        over = null;
        if (s && box.contains(s)) place(t, s);
      };
      t.addEventListener('pointerup', (e) => end(e, false));
      t.addEventListener('pointercancel', (e) => end(e, true));
    });
    const reset = box.querySelector('.pb-reset');
    if (reset) reset.addEventListener('click', () => {
      slots.forEach((s) => { s.classList.remove('ok', 'no', 'yj'); s.removeAttribute('data-k'); s.innerHTML = ''; });
      pick(null);
      progress();
    });
    progress();
  }

  function init(root = document) {
    initYj(root);
    root.querySelectorAll('.pblocks:not([data-pb])').forEach((b) => { b.dataset.pb = '1'; initBlocks(b); });
  }
  return { BASIS, addBasis, open, close, init, pairFig };
})();
window.MProof = MProof;
