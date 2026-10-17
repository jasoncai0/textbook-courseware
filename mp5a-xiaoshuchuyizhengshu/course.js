'use strict';
/* 五上 小数除以整数 · 本课互动：分钱板（平均分，不够分就换成小一级的单位再分）、除法竖式逐步演示。通用部分见 ../shared/mdec.js */
const $ = (id) => document.getElementById(id);
const KINDS = ['y', 'j', 'f'];
const NAME = { y: '元', j: '角', f: '分' };
const FACE = { y: '1元', j: '1角', f: '1分' };

/* ---------- 分钱板 ---------- */
function shareBoard(el) {
  el.setAttribute('data-noswipe', '');
  let st;
  const coinsHtml = (k, n, cls = '') => Array.from({ length: n }, () => `<i class="coin ${k} ${cls}">${FACE[k]}</i>`).join('');
  const top = () => KINDS.find((k) => st.pool[k] > 0); // 待分的钱里最大的单位
  const draw = () => {
    const k = top();
    const canShare = k && st.pool[k] >= st.d;
    const canSwap = k && k !== 'f' && st.pool[k] > 0 && st.pool[k] < st.d;
    const each = KINDS.filter((x) => st.each[x]).map((x) => `${st.each[x]} ${NAME[x]}`).join(' ') || '0 元';
    const fen = st.each.y * 100 + st.each.j * 10 + st.each.f;
    el.innerHTML = `
      <div class="sh-pool"><h4>待分的钱（${st.a} 元）</h4><div class="sh-coins">${KINDS.map((x) => coinsHtml(x, st.pool[x])).join('') || '<span class="muted">分完了</span>'}</div></div>
      <div class="sh-piles" style="--n:${st.d}">${Array.from({ length: st.d }, (_, i) => `<div class="sh-pile"><small>第 ${i + 1} 份</small><div class="sh-coins">${KINDS.map((x) => coinsHtml(x, st.each[x], x === st.fresh ? 'fresh' : '')).join('')}</div></div>`).join('')}</div>
      <div class="btns sh-btns">
        <button type="button" class="btn solid" data-act="share" ${canShare ? '' : 'disabled'}>平均分${k ? NAME[k] : ''} ▶</button>
        <button type="button" class="btn" data-act="swap" ${canSwap ? '' : 'disabled'}>剩下的${k ? NAME[k] : ''}换小一级 ▼</button>
        <button type="button" class="btn" data-act="reset">↺</button>
      </div>
      <div class="sh-log">${st.log.map((t) => `<p>${t}</p>`).join('')}
        <p class="sh-each">每份：<b>${each}</b>${k ? '' : `　= <b>${MDec.move(String(fen), -2)} 元</b>`}</p></div>`;
  };
  const set = (a, d) => {
    const [i, f = ''] = a.split('.');
    st = { a, d, pool: { y: +i, j: +(f[0] || 0), f: +(f[1] || 0) }, each: { y: 0, j: 0, f: 0 }, log: [], fresh: null };
    draw();
  };
  el.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    const k = top();
    if (act === 'reset') { set(st.a, st.d); return; }
    if (act === 'share' && k && st.pool[k] >= st.d) {
      const q = Math.floor(st.pool[k] / st.d);
      const r = st.pool[k] - q * st.d;
      st.log = st.log.concat(`${st.pool[k]} ${NAME[k]} ÷ ${st.d} = ${q} ${NAME[k]}${r ? `……余 ${r} ${NAME[k]}` : ''}`);
      st.each = { ...st.each, [k]: q };
      st.pool = { ...st.pool, [k]: r };
      st.fresh = k;
    }
    if (act === 'swap' && k && k !== 'f') {
      const lo = KINDS[KINDS.indexOf(k) + 1];
      const n = st.pool[k];
      st.log = st.log.concat(`${n} ${NAME[k]}不够平均分成 ${st.d} 份${st.each[k] ? '' : `（每份 0 ${NAME[k]}）`}，换成 ${n * 10} ${NAME[lo]}${st.pool[lo] ? `，和 ${st.pool[lo]} ${NAME[lo]}合起来是 ${n * 10 + st.pool[lo]} ${NAME[lo]}` : ''}`);
      st.pool = { ...st.pool, [k]: 0, [lo]: st.pool[lo] + n * 10 };
      st.fresh = null;
    }
    draw();
  });
  return { set };
}

function picker(box, onPick) {
  const pick = (b) => { box.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b)); onPick(b.dataset.a, +b.dataset.d); };
  box.addEventListener('click', (e) => { const b = e.target.closest('[data-a]'); if (b) pick(b); });
  pick(box.querySelector('[data-a]'));
}

window.LESSON = {
  init() {
    const recall = MDec.div($('recallDiv'), '96', 3);
    recall.end();
    const board = shareBoard($('share'));
    picker($('shPick'), (a, d) => board.set(a, d));
    MDec.div($('d1'), '9.6', 3);
    MDec.div($('d2'), '12', 5);
    MDec.div($('d3'), '5.7', 6);
    picker($('dPick'), (a, d) => MDec.div($('d4'), a, d));
  },
};
