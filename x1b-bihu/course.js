'use strict';
/* 小壁虎借尾巴 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 借尾巴路线：字幕上的 data-at 让 🦎 爬到第几站 ================= */
const STOPS = [['墙角', 'qiáng jiǎo', '🧱'], ['小河边', 'xiǎo hé biān', '🌊'], ['大树上', 'dà shù shàng', '🌳'], ['房檐下', 'fáng yán xià', '🏠'], ['家', 'jiā', '❤️']];
function buildRoute(box) {
  box.innerHTML = `<ol style="--n:${STOPS.length}">${STOPS.map(([t, py, icon]) => `<li><em>${icon}</em><small>${Hanzi.ruby(t, py)}</small></li>`).join('')}</ol><i class="bh-gecko">🦎</i>`;
}
document.querySelectorAll('.bh-route').forEach(buildRoute);

/* ================= 尾巴卡：小鱼拨水、老牛赶蝇子、燕子掌握方向 ================= */
const SWALLOW = '<path d="M10 25L0 12L18 21Z M10 25L0 38L18 29Z" fill="#1d2a4a"/><ellipse cx="38" cy="26" rx="24" ry="9" fill="#1d2a4a"/><ellipse cx="42" cy="29" rx="14" ry="5" fill="#fff"/><path d="M30 22Q42 0 58 6Q46 16 40 24Z" fill="#2c3d66"/><circle cx="60" cy="24" r="8" fill="#1d2a4a"/><circle cx="62" cy="27" r="3" fill="#d9573f"/><circle cx="62" cy="21" r="1.6" fill="#fff"/><path d="M67 22L77 24L67 26Z" fill="#333"/>';
const TAILS = {
  fish: {
    who: ['小鱼姐姐', 'xiǎo yú jiě jie'], use: ['拨水', 'bō shuǐ'],
    svg: `<rect width="240" height="140" rx="14" fill="#cdeaf8"/>
      <g class="bh-wave"><path d="M40 52Q28 70 40 88"/><path d="M26 44Q10 70 26 96"/></g>
      <g class="bh-fish"><path class="bh-ftail" d="M84 70L50 44L58 70L50 96Z" fill="#e8574a"/><ellipse cx="128" cy="70" rx="48" ry="28" fill="#f26b5a"/>
      <path d="M116 54Q128 70 116 86" stroke="#c8473a" stroke-width="3" fill="none"/><circle cx="154" cy="62" r="6" fill="#fff"/><circle cx="156" cy="62" r="3" fill="#222"/></g>`,
  },
  cow: {
    who: ['牛伯伯', 'niú bó bo'], use: ['赶蝇子', 'gǎn yíng zi'],
    svg: `<rect width="240" height="140" rx="14" fill="#e7f3d9"/><rect y="112" width="240" height="28" fill="#b8d98e"/>
      <path d="M96 100V124M118 100V124M160 100V124M180 100V124" stroke="#8a4a22" stroke-width="7" stroke-linecap="round"/>
      <rect x="84" y="54" width="110" height="52" rx="22" fill="#c8753e"/><circle cx="120" cy="70" r="9" fill="#f3e2c8"/><circle cx="160" cy="88" r="7" fill="#f3e2c8"/>
      <circle cx="200" cy="62" r="20" fill="#c8753e"/><ellipse cx="208" cy="72" rx="11" ry="8" fill="#f2b7a6"/><circle cx="198" cy="56" r="3" fill="#222"/><path d="M188 44L180 32M212 44L220 32" stroke="#e9dcc0" stroke-width="5" stroke-linecap="round"/>
      <g class="bh-ctail"><path d="M86 62Q58 70 62 104" stroke="#8a4a22" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="62" cy="108" rx="7" ry="10" fill="#5a2e12"/></g>
      <g class="bh-fly"><circle cx="0" cy="0" r="4" fill="#333"/><ellipse cx="-3" cy="-5" rx="4" ry="2.5" fill="#cfe3f2"/><ellipse cx="3" cy="-5" rx="4" ry="2.5" fill="#cfe3f2"/></g>
      <g class="bh-fly bh-fly2"><circle cx="0" cy="0" r="4" fill="#333"/><ellipse cx="-3" cy="-5" rx="4" ry="2.5" fill="#cfe3f2"/><ellipse cx="3" cy="-5" rx="4" ry="2.5" fill="#cfe3f2"/></g>`,
  },
  swallow: {
    who: ['燕子阿姨', 'yàn zi ā yí'], use: ['掌握方向', 'zhǎng wò fāng xiàng'],
    svg: `<rect width="240" height="140" rx="14" fill="#dbeefb"/>
      <path d="M20 110C70 20 120 130 170 40S230 70 236 30" class="bh-path"/>
      <g class="bh-bird"><g transform="translate(-38 -25)">${SWALLOW}</g></g>`,
  },
};
function buildCard(box) {
  const t = TAILS[box.dataset.tail];
  box.innerHTML = `<p class="bh-card-h py">${Hanzi.ruby(...t.who)}${Hanzi.ruby('的尾巴', 'de wěi ba')}</p>
    <svg viewBox="0 0 240 140" class="bh-anim bh-${box.dataset.tail}">${t.svg}</svg>
    <p class="bh-use py">${Hanzi.ruby('用来', 'yòng lái')}<b>${Hanzi.ruby(...t.use)}</b></p>
    <span class="bh-no">${Hanzi.ruby('借不到', 'jiè bú dào')}</span>`;
}
document.querySelectorAll('.bh-card').forEach(buildCard);

function updateRead(slide, step) {
  const route = slide.querySelector('.bh-route');
  if (!route) return;
  const all = [...document.querySelectorAll('.slide')];
  const before = all.slice(0, all.indexOf(slide)).flatMap((s) => [...s.querySelectorAll('[data-at]')]);
  const shown = [...slide.querySelectorAll('[data-step]')].filter((el) => +el.dataset.step <= step);
  const ats = [...before, ...shown.filter((el) => el.dataset.at)];
  const at = ats.length ? +ats[ats.length - 1].dataset.at : 0;
  route.style.setProperty('--at', at);
  route.querySelectorAll('li').forEach((li, i) => { li.classList.toggle('done', i < at); li.classList.toggle('cur', i === at); });
  route.classList.toggle('grow', shown.some((el) => el.dataset.grow));
  const card = slide.querySelector('.bh-card');
  if (card) card.classList.toggle('no', shown.some((el) => el.dataset.no));
}

/* ================= 课后第 2 题：连一连（谁的尾巴有什么用） ================= */
const LINK_L = [
  { k: 'fish', pic: '🐟', t: '小鱼', py: 'xiǎo yú' },
  { k: 'cow', pic: '🐂', t: '老牛', py: 'lǎo niú' },
  { k: 'swallow', pic: `<svg viewBox="0 0 80 50">${SWALLOW}</svg>`, t: '燕子', py: 'yàn zi' },
];
const LINK_R = [
  { k: 'swallow', t: '掌握方向', py: 'zhǎng wò fāng xiàng' },
  { k: 'fish', t: '拨水', py: 'bō shuǐ' },
  { k: 'cow', t: '赶蝇子', py: 'gǎn yíng zi' },
];
function buildLink(box) {
  box.innerHTML = `<div class="bh-lk-col">${LINK_L.map((it) => `<button type="button" class="bh-lk bh-lk-l" data-k="${it.k}"><i>${it.pic}</i>${Hanzi.ruby(it.t, it.py)}</button>`).join('')}</div>
    <svg class="bh-lk-svg"></svg>
    <div class="bh-lk-col">${LINK_R.map((it) => `<button type="button" class="bh-lk bh-lk-r" data-k="${it.k}">${Hanzi.ruby(it.t, it.py)}</button>`).join('')}</div>
    <div class="bh-lk-bar"><span class="bh-lk-msg">先点左边的动物，再点右边尾巴的用处。</span><button type="button" class="btn" data-reset>重新连</button></div>
    <p class="bh-lk-sum py">${Hanzi.ruby('它们的尾巴都有用，所以都借不到。', 'tā men de wěi ba dōu yǒu yòng suǒ yǐ dōu jiè bú dào')}</p>`;
  const svg = box.querySelector('.bh-lk-svg');
  const msg = box.querySelector('.bh-lk-msg');
  let sel = null;
  const draw = () => {
    const b = svg.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    svg.innerHTML = [...box.querySelectorAll('.bh-lk-l.done')].map((l) => {
      const r = box.querySelector(`.bh-lk-r[data-k="${l.dataset.k}"]`).getBoundingClientRect();
      const a = l.getBoundingClientRect();
      return `<line x1="0" y1="${a.top + a.height / 2 - b.top}" x2="${b.width}" y2="${r.top + r.height / 2 - b.top}"/>`;
    }).join('');
  };
  new ResizeObserver(draw).observe(svg);
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) {
      box.querySelectorAll('.bh-lk').forEach((x) => x.classList.remove('done', 'sel'));
      sel = null; box.classList.remove('all'); msg.textContent = '先点左边的动物，再点右边尾巴的用处。'; draw();
      return;
    }
    const l = e.target.closest('.bh-lk-l:not(.done)');
    if (l) { sel = l; box.querySelectorAll('.bh-lk-l').forEach((x) => x.classList.toggle('sel', x === l)); return; }
    const r = e.target.closest('.bh-lk-r:not(.done)');
    if (!r || !sel) return;
    if (r.dataset.k !== sel.dataset.k) {
      [r, sel].forEach((x) => { x.classList.remove('wrong'); void x.offsetWidth; x.classList.add('wrong'); });
      msg.textContent = '再想想：它的尾巴用来做什么？';
      return;
    }
    [sel, r].forEach((x) => { x.classList.remove('sel'); x.classList.add('done'); });
    sel = null;
    draw();
    const all = !box.querySelector('.bh-lk-l:not(.done)');
    box.classList.toggle('all', all);
    msg.textContent = all ? '全连对了！' : '连对了！';
  });
}
buildLink(document.getElementById('link'));

/* ================= 科学小卡片：壁虎简笔（1 断尾 2 尾巴扭动 3 新尾巴） ================= */
const geckoBody = '<ellipse cx="70" cy="50" rx="26" ry="13" fill="#9a8a72"/><circle cx="102" cy="50" r="11" fill="#9a8a72"/><circle cx="106" cy="45" r="2.6" fill="#222"/><circle cx="106" cy="55" r="2.6" fill="#222"/><path d="M58 40L50 26M82 40L90 26M58 60L50 74M82 60L90 74" stroke="#9a8a72" stroke-width="5" stroke-linecap="round"/>';
const SCI = {
  1: `${geckoBody}<path d="M44 50Q34 52 30 50" stroke="#9a8a72" stroke-width="7" stroke-linecap="round"/><path d="M22 50Q12 44 4 52" stroke="#9a8a72" stroke-width="6" stroke-linecap="round"/><path d="M26 38L30 44M24 62L30 56" stroke="#e0473c" stroke-width="3"/>`,
  2: `<g class="bh-sci-run">${geckoBody}<path d="M44 50Q38 51 36 50" stroke="#9a8a72" stroke-width="7" stroke-linecap="round"/></g><path class="bh-wiggle" d="M24 66Q14 58 6 68Q0 74 4 80" stroke="#9a8a72" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  3: `${geckoBody}<path d="M44 50Q30 54 18 48" stroke="#c9bba3" stroke-width="7" fill="none" stroke-linecap="round"/><text x="10" y="30" font-size="16">✨</text>`,
};
document.querySelectorAll('.bh-sci-pic').forEach((el) => { el.innerHTML = `<svg viewBox="0 0 120 100">${SCI[el.dataset.g]}</svg>`; });

/* ================= 课后第 1 题：看偏旁猜意思（送字宝宝回家） ================= */
const BASKETS = [
  { k: '虫', name: ['虫字旁', 'chóng zì páng'], hint: '小虫、小动物' },
  { k: '扌', name: ['提手旁', 'tí shǒu páng'], hint: '手的动作' },
  { k: '女', name: ['女字旁', 'nǚ zì páng'], hint: '女性' },
];
const SORT = [['蚊', 'wén', '虫'], ['挣', 'zhèng', '扌'], ['姐', 'jiě', '女'], ['蝇', 'yíng', '虫'], ['拨', 'bō', '扌'], ['姨', 'yí', '女'], ['蛇', 'shé', '虫'], ['捉', 'zhuō', '扌'], ['摆', 'bǎi', '扌']];
function buildSort(box) {
  box.innerHTML = `<div class="bh-pool">${SORT.map(([z, py, k], i) => `<button type="button" class="bh-z" data-i="${i}" data-k="${k}"><ruby>${z}<rt>${py}</rt></ruby></button>`).join('')}</div>
    <div class="bh-baskets">${BASKETS.map((b) => `<div class="bh-basket" data-k="${b.k}"><p><b>${b.k}</b>${Hanzi.ruby(...b.name)}<small>${b.hint}</small></p><div class="bh-in"></div></div>`).join('')}</div>
    <div class="bh-sort-bar"><span class="bh-sort-msg">先点一个字，再点它的家。</span><button type="button" class="btn" data-reset>再来一次</button></div>`;
  const pool = box.querySelector('.bh-pool');
  const msg = box.querySelector('.bh-sort-msg');
  let sel = null;
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) {
      box.querySelectorAll('.bh-z').forEach((z) => { z.classList.remove('sel', 'placed'); pool.appendChild(z); });
      [...pool.children].sort((a, b) => a.dataset.i - b.dataset.i).forEach((z) => pool.appendChild(z));
      sel = null; box.classList.remove('all'); msg.textContent = '先点一个字，再点它的家。';
      return;
    }
    const z = e.target.closest('.bh-pool .bh-z');
    if (z) { sel = z; box.querySelectorAll('.bh-z').forEach((x) => x.classList.toggle('sel', x === z)); return; }
    const basket = e.target.closest('.bh-basket');
    if (!basket || !sel) return;
    if (basket.dataset.k !== sel.dataset.k) {
      [basket, sel].forEach((x) => { x.classList.remove('wrong'); void x.offsetWidth; x.classList.add('wrong'); });
      msg.textContent = '看看它的偏旁是什么？';
      return;
    }
    sel.classList.remove('sel');
    sel.classList.add('placed');
    basket.querySelector('.bh-in').appendChild(sel);
    sel = null;
    const all = !pool.children.length;
    box.classList.toggle('all', all);
    msg.textContent = all ? '全都送回家了！偏旁能帮我们猜字的意思。' : '放对了！';
  });
}
buildSort(document.getElementById('sort'));

Hanzi.init({
  cards: [
    { z: '壁', py: 'bì', bs: '土', bh: 16, words: [['壁虎', 'bì hǔ'], ['墙壁', 'qiáng bì']] },
    { z: '墙', py: 'qiáng', bs: '土', bh: 14, words: [['墙角', 'qiáng jiǎo']] },
    { z: '蚊', py: 'wén', bs: '虫', bh: 10, words: [['蚊子', 'wén zi']] },
    { z: '咬', py: 'yǎo', bs: '口', bh: 9, words: [['咬住', 'yǎo zhù']] },
    { z: '断', py: 'duàn', bs: '斤', bh: 11, words: [['挣断', 'zhèng duàn']] },
    { z: '您', py: 'nín', bs: '心', bh: 11, words: [['您好', 'nín hǎo']] },
    { z: '拨', py: 'bō', bs: '扌', bh: 8, words: [['拨水', 'bō shuǐ']] },
    { z: '甩', py: 'shuǎi', bs: '用', bh: 5, words: [['甩着', 'shuǎi zhe']] },
    { z: '赶', py: 'gǎn', bs: '走', bh: 10, words: [['赶蝇子', 'gǎn yíng zi']] },
    { z: '房', py: 'fáng', bs: '户', bh: 8, words: [['房檐', 'fáng yán'], ['房子', 'fáng zi']] },
    { z: '傻', py: 'shǎ', bs: '亻', bh: 13, words: [['傻孩子', 'shǎ hái zi']] },
    { z: '转', py: 'zhuǎn', bs: '车', bh: 8, words: [['转身', 'zhuǎn shēn']] },
  ],
  write: [
    { z: '捉', py: 'zhuō', bs: '扌', bh: 10 },
    { z: '条', py: 'tiáo', bs: '木', bh: 7 },
    { z: '爬', py: 'pá', bs: '爪', bh: 8 },
    { z: '姐', py: 'jiě', bs: '女', bh: 8 },
    { z: '您', py: 'nín', bs: '心', bh: 11 },
    { z: '草', py: 'cǎo', bs: '艹', bh: 9 },
    { z: '房', py: 'fáng', bs: '户', bh: 8 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateRead(slide, step);
  },
};
