'use strict';
/* 四上第六单元通用：批注工具 + 心情曲线（牛和鹅 / 一只窝囊的大老虎 / 陀螺 三课各放一份相同的副本，可提为 shared/）。
 * 在 course.js 之前加载；两个函数都要在 course.js 顶层调用（生成的 data-step 要在 deck.js 统计分步之前出现）。
 *
 * Pizhu.render(box, paras, { hints, type })   批注：原文一句一句可点，选“有疑问 / 有体会 / 写得好”，写下批注贴在段落旁
 *   paras: [{ p: '段落原文', pz: '课本旁批（可选）' }]
 *   hints: [{ k: '句子里的关键字', type: '有疑问', t: '示例批注' }]   点“看看示例”时按选中的句子找
 *   type:  默认选中的批注角度
 * Mood.render(box, points)   心情曲线：points = [{ m: '心情', y: 0~100（越高越开心）, why: '原因', q: '原文（可选）' }]，第 i 个点是第 i 步
 */
const PZ_TYPES = [['问', '有疑问'], ['悟', '有体会'], ['赞', '写得好']];
const pzEsc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const Pizhu = (() => {
  const SENT = /[^。！？…]+(?:[。！？…]+[”’）]*|$)/g;
  const GENERIC = {
    有疑问: '读到这里我有个问题：为什么……？',
    有体会: '读到这里，我体会到“我”当时的心情是……',
    写得好: '这句话写得好，“……”这个词用得准确，让我仿佛看到了……',
  };

  function rowHtml(para, i) {
    const sents = para.p.match(SENT) || [para.p];
    const book = para.pz ? `<div class="pz-note book"><b>课本旁批</b>${pzEsc(para.pz)}</div>` : '';
    return `<div class="pz-row"><p>${sents.map((s) => `<span class="pz-s" data-r="${i}">${pzEsc(s)}</span>`).join('')}</p><div class="pz-notes">${book}</div></div>`;
  }

  function render(box, paras, opts = {}) {
    const hints = opts.hints || [];
    let type = opts.type || PZ_TYPES[0][1];
    box.innerHTML = `<div class="pz-doc">${paras.map(rowHtml).join('')}</div>
      <div class="pz-bar">
        <p class="pz-pick">① 点一点原文里的一句话</p>
        <p class="pz-step">② 选一个角度</p>
        <div class="pz-types">${PZ_TYPES.map(([s, t]) => `<button class="btn" type="button" data-t="${t}"><i>${s}</i>${t}</button>`).join('')}</div>
        <p class="pz-step">③ 写下批注</p>
        <textarea class="pz-input" rows="3" placeholder="写下你的疑问、体会……"></textarea>
        <div class="btns"><button class="btn solid pz-add" type="button">贴上批注</button><button class="btn pz-hint" type="button">看看示例</button></div>
      </div>`;
    const bar = box.querySelector('.pz-bar');
    const input = bar.querySelector('.pz-input');
    let sel = null;
    const setType = (t) => {
      type = t;
      bar.querySelectorAll('[data-t]').forEach((b) => b.classList.toggle('solid', b.dataset.t === t));
      input.placeholder = GENERIC[t];
    };
    setType(type);
    box.addEventListener('click', (e) => {
      const s = e.target.closest('.pz-s');
      if (s) {
        if (sel) sel.classList.remove('sel');
        sel = s;
        s.classList.add('sel');
        bar.querySelector('.pz-pick').textContent = `① 选中：“${s.textContent.slice(0, 14)}${s.textContent.length > 14 ? '……' : ''}”`;
        bar.classList.add('has-sel');
        return;
      }
      const t = e.target.closest('[data-t]');
      if (t) { setType(t.dataset.t); return; }
      if (e.target.closest('.pz-hint')) {
        const h = sel && hints.find((x) => sel.textContent.includes(x.k));
        if (h) setType(h.type);
        input.value = h ? h.t : GENERIC[type];
        return;
      }
      if (e.target.closest('.pz-add')) add();
    });

    function add() {
      const text = input.value.trim();
      if (!sel) { bar.querySelector('.pz-pick').classList.add('nudge'); setTimeout(() => bar.querySelector('.pz-pick').classList.remove('nudge'), 600); return; }
      if (!text) { input.focus(); return; }
      const mark = PZ_TYPES.find(([, t]) => t === type)[0];
      sel.classList.remove('sel');
      sel.classList.add('done', `k-${mark}`);
      const notes = sel.closest('.pz-row').querySelector('.pz-notes');
      notes.insertAdjacentHTML('beforeend', `<div class="pz-note k-${mark}"><b>${mark} · ${type}</b>${pzEsc(text)}</div>`);
      input.value = '';
      sel = null;
      bar.classList.remove('has-sel');
      bar.querySelector('.pz-pick').textContent = '① 再点一句，继续批注';
    }
  }
  return { render };
})();

const Mood = (() => {
  const W = 800;
  const H = 440;
  const TOP = 80;
  const BOT = 370;
  const yOf = (v) => BOT - (v / 100) * (BOT - TOP);

  // 小脸：越开心嘴角越往上
  function face(x, y, v) {
    const k = ((v - 50) / 50) * 7;
    return `<circle cx="${x}" cy="${y}" r="22" class="mc-face"/>
      <circle cx="${x - 8}" cy="${y - 6}" r="2.8" class="mc-eye"/><circle cx="${x + 8}" cy="${y - 6}" r="2.8" class="mc-eye"/>
      <path d="M${x - 10} ${y + 7} Q${x} ${y + 7 + k * 1.6} ${x + 10} ${y + 7}" class="mc-mouth"/>`;
  }

  function render(box, points) {
    const gap = (W - 120) / Math.max(1, points.length - 1);
    const pts = points.map((p, i) => ({ ...p, x: 60 + i * gap, yy: yOf(p.y) }));
    // 先画线、后画脸：线不压在小脸上
    const lines = pts.slice(1).map((p, i) => {
      const a = pts[i];
      return `<g data-step="${i + 2}"><path class="mc-line draw" pathLength="1" d="M${a.x} ${a.yy} C${a.x + gap / 2} ${a.yy}, ${p.x - gap / 2} ${p.yy}, ${p.x} ${p.yy}"/></g>`;
    }).join('');
    const faces = pts.map((p, i) => {
      const ty = p.y >= 40 ? p.yy - 32 : p.yy + 48;
      return `<g data-step="${i + 1}">${face(p.x, p.yy, p.y)}<text x="${p.x}" y="${ty}" class="mc-m t-c">${pzEsc(p.m)}</text></g>`;
    }).join('');
    box.innerHTML = `<svg class="mc-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="心情变化曲线">
        <line x1="30" y1="${yOf(50)}" x2="${W - 20}" y2="${yOf(50)}" class="mc-axis"/>
        <text x="14" y="${TOP - 30}" class="mc-ax">开心</text><text x="14" y="${BOT + 56}" class="mc-ax">难过</text>
        ${lines}${faces}</svg>
      <ol class="mc-why">${pts.map((p, i) => `<li data-step="${i + 1}"><b>${pzEsc(p.m)}</b><span>${pzEsc(p.why)}</span>${p.q ? `<q>${pzEsc(p.q)}</q>` : ''}</li>`).join('')}</ol>`;
  }
  return { render };
})();
