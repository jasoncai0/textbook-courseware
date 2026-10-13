'use strict';
/* 黄山奇石 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：看剪影猜奇石名字（猜对变金色、出课文句子）、给没有名字的奇石起名字、连一连识字 */

Hanzi.init({
  cards: [
    { z: '闻', py: 'wén', bs: '门', bh: 9, words: [['闻名', 'wén míng'], ['新闻', 'xīn wén']] },
    { z: '名', py: 'míng', bs: '口', bh: 6, words: [['闻名', 'wén míng'], ['名字', 'míng zi']] },
    { z: '景', py: 'jǐng', bs: '日', bh: 12, words: [['风景', 'fēng jǐng'], ['景色', 'jǐng sè']] },
    { z: '区', py: 'qū', bs: '匚', bh: 4, words: [['风景区', 'fēng jǐng qū'], ['山区', 'shān qū']] },
    { z: '省', py: 'shěng', bs: '目', bh: 9, words: [['安徽省', 'ān huī shěng'], ['省份', 'shěng fèn']] },
    { z: '部', py: 'bù', bs: '阝', bh: 10, words: [['南部', 'nán bù'], ['全部', 'quán bù']] },
    { z: '秀', py: 'xiù', bs: '禾', bh: 7, words: [['秀丽', 'xiù lì'], ['秀美', 'xiù měi']] },
    { z: '尤', py: 'yóu', bs: '尢', bh: 4, words: [['尤其', 'yóu qí']] },
    { z: '其', py: 'qí', bs: '八', bh: 8, words: [['尤其', 'yóu qí'], ['其他', 'qí tā']] },
    { z: '仙', py: 'xiān', bs: '亻', bh: 5, words: [['仙桃石', 'xiān táo shí'], ['仙人', 'xiān rén']] },
    { z: '巨', py: 'jù', bs: '匚', bh: 4, words: [['巨石', 'jù shí'], ['巨人', 'jù rén']] },
    { z: '位', py: 'wèi', bs: '亻', bh: 7, words: [['一位', 'yí wèi'], ['座位', 'zuò wèi']] },
    { z: '都', py: 'dū', bs: '阝', bh: 10, words: [['天都峰', 'tiān dū fēng'], ['首都', 'shǒu dū']] },
    { z: '著', py: 'zhù', bs: '艹', bh: 11, words: [['著名', 'zhù míng']] },
    { z: '形', py: 'xíng', bs: '彡', bh: 7, words: [['奇形怪状', 'qí xíng guài zhuàng'], ['形状', 'xíng zhuàng']] },
    { z: '状', py: 'zhuàng', bs: '犬', bh: 7, words: [['形状', 'xíng zhuàng'], ['奖状', 'jiǎng zhuàng']] },
  ],
  write: [
    { z: '南', py: 'nán', bs: '十', bh: 9 },
    { z: '部', py: 'bù', bs: '阝', bh: 10 },
    { z: '些', py: 'xiē', bs: '止', bh: 8 },
    { z: '巨', py: 'jù', bs: '匚', bh: 4 },
    { z: '位', py: 'wèi', bs: '亻', bh: 7 },
    { z: '向', py: 'xiàng', bs: '丿', bh: 6 },
    { z: '每', py: 'měi', bs: '母', bh: 7 },
    { z: '升', py: 'shēng', bs: '十', bh: 4 },
    { z: '闪', py: 'shǎn', bs: '门', bh: 5 },
    { z: '狗', py: 'gǒu', bs: '犭', bh: 8 },
  ],
});

/* ---------- 奇石剪影（200 × 150，示意） ---------- */
const PEAK = (d) => `<path class="hs-peak" d="${d}"/>`;
const CLOUD = '<g class="hs-cloud"><ellipse cx="150" cy="138" rx="46" ry="12"/><ellipse cx="40" cy="142" rx="40" ry="10"/><ellipse cx="110" cy="146" rx="50" ry="9"/></g>';
const ROCKS = [
  { name: '仙桃石', py: 'xiān táo shí',
    svg: `${PEAK('M18 150L46 112H154L182 150Z')}<g class="hs-shape"><ellipse cx="100" cy="110" rx="60" ry="9"/><path d="M100 106C58 104 54 54 90 42C94 32 102 28 106 18C110 34 148 46 142 78C138 98 120 106 100 106Z"/></g>`,
    say: ['它好像从天上飞下来的一个大桃子，落在山顶的石盘上。', 'tā hǎo xiàng cóng tiān shàng fēi xià lái de yí gè dà táo zi luò zài shān dǐng de shí pán shàng'] },
  { name: '猴子观海', py: 'hóu zi guān hǎi',
    svg: `${PEAK('M0 150L60 78L120 150Z')}${CLOUD}<g class="hs-shape"><circle cx="64" cy="36" r="13"/><circle cx="52" cy="32" r="5"/><ellipse cx="66" cy="62" rx="17" ry="16"/><path d="M50 60Q60 82 82 70L78 62Q64 70 58 58Z"/><path d="M48 70H86V82H48Z"/></g>`,
    say: ['它两只胳膊抱着腿，一动不动地蹲在山头，望着翻滚的云海。', 'tā liǎng zhī gē bo bào zhe tuǐ yí dòng bú dòng de dūn zài shān tóu wàng zhe fān gǔn de yún hǎi'] },
  { name: '仙人指路', py: 'xiān rén zhǐ lù',
    svg: `${PEAK('M20 150L78 98L140 150Z')}<g class="hs-shape"><rect x="64" y="40" width="26" height="64" rx="12"/><circle cx="76" cy="28" r="12"/><path d="M86 56L138 40" stroke-width="10" stroke-linecap="round"/></g>`,
    say: ['那巨石真像一位仙人站在高高的山峰上，伸着手臂指向前方。', 'nà jù shí zhēn xiàng yí wèi xiān rén zhàn zài gāo gāo de shān fēng shàng shēn zhe shǒu bì zhǐ xiàng qián fāng'] },
  { name: '金鸡叫天都', py: 'jīn jī jiào tiān dū',
    svg: `<circle class="hs-sun" cx="30" cy="30" r="16"/>${PEAK('M30 150L92 112L170 150Z')}<g class="hs-shape"><ellipse cx="92" cy="96" rx="30" ry="20"/><path d="M106 86C116 76 118 64 116 56L132 56C134 68 128 84 116 98Z"/><circle cx="126" cy="52" r="11"/><path d="M117 43L120 32L125 40L130 29L134 43Z"/><path d="M136 49L151 43L139 53L151 60L136 56Z"/><ellipse cx="129" cy="65" rx="3" ry="5"/><path d="M66 92C44 84 44 56 56 46C58 62 64 72 76 80Z"/><path d="M68 100C48 102 40 84 42 72C50 86 58 90 72 92Z"/><path d="M86 114V126M100 114V126" stroke-width="4" fill="none"/></g>`,
    say: ['它伸着脖子，对着天都峰不住地啼叫。', 'tā shēn zhe bó zi duì zhe tiān dū fēng bú zhù de tí jiào'] },
];
const NAMES = ROCKS.map((r) => r.name);

function initGuess() {
  const $ = (id) => document.getElementById(id);
  const solved = new Set();
  let cur = 0;
  $('hsTabs').innerHTML = ROCKS.map((r, i) => `<button type="button" class="btn" data-i="${i}">石头 ${i + 1}</button>`).join('');
  $('hsOpts').innerHTML = NAMES.map((n) => `<button type="button" class="btn hs-opt" data-n="${n}">${n}</button>`).join('');
  const show = (i) => {
    cur = i;
    const r = ROCKS[i];
    const ok = solved.has(i);
    $('hsRock').innerHTML = r.svg;
    $('hsRock').classList.toggle('ok', ok);
    $('hsTabs').querySelectorAll('.btn').forEach((b) => {
      b.classList.toggle('solid', +b.dataset.i === i);
      b.classList.toggle('done', solved.has(+b.dataset.i));
    });
    $('hsOpts').querySelectorAll('.hs-opt').forEach((b) => b.classList.remove('right', 'wrong'));
    $('hsSay').innerHTML = ok ? `<b>${Hanzi.ruby(r.name, r.py)}</b><br>${Hanzi.ruby(...r.say)}` : '';
  };
  $('hsTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (b) show(+b.dataset.i);
  });
  $('hsOpts').addEventListener('click', (e) => {
    const b = e.target.closest('.hs-opt');
    if (!b) return;
    if (b.dataset.n !== ROCKS[cur].name) { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); return; }
    solved.add(cur);
    show(cur);
    $('hsOpts').querySelector(`[data-n="${b.dataset.n}"]`).classList.add('right');
  });
  show(0);
}

/* ---------- 给奇石起名字 ---------- */
const NONAME = [
  { svg: `${PEAK('M0 150L50 112L110 150Z')}<g class="hs-shape"><ellipse cx="96" cy="96" rx="44" ry="24"/><circle cx="148" cy="86" r="12"/><path d="M60 112L54 124H70ZM118 112L124 124H108Z"/></g>`, eg: '乌龟爬山：它好像一只大乌龟，伸着脖子，一步一步往山顶爬。' },
  { svg: `${PEAK('M30 150L90 110L160 150Z')}<g class="hs-shape"><path d="M82 112V40Q82 30 92 30H106Q114 30 114 40V88Q136 90 140 104V112Z"/></g>`, eg: '仙人晒靴：远远望去，那石头真像一只大靴子，晒在山顶上。' },
  { svg: `${PEAK('M10 150L80 104L150 150Z')}${CLOUD}<g class="hs-shape"><ellipse cx="80" cy="80" rx="24" ry="28"/><circle cx="80" cy="44" r="15"/><circle cx="68" cy="32" r="6"/><circle cx="92" cy="32" r="6"/><path d="M98 66L116 48" stroke-width="9" stroke-linecap="round"/></g>`, eg: '小熊看云：它好像一只小熊，抬着爪子，看天上飘过的白云。' },
];
function initName() {
  const box = document.getElementById('hsName');
  box.innerHTML = NONAME.map((r, i) => `<div class="hs-nc">
      <svg viewBox="0 0 200 150" class="hs-rock">${r.svg}</svg>
      <input type="text" maxlength="8" placeholder="起个名字" aria-label="给第 ${i + 1} 块石头起名字">
      <button type="button" class="btn" data-eg="${i}">看看别人起的</button>
      <p class="hs-egt" hidden></p>
    </div>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-eg]');
    if (!b) return;
    const p = b.parentElement.querySelector('.hs-egt');
    p.textContent = NONAME[+b.dataset.eg].eg;
    p.hidden = false;
  });
}

/* ---------- 连一连：字和拼音 ---------- */
const LINKS = [
  [['闻', 'wén'], ['名', 'míng'], ['景', 'jǐng'], ['区', 'qū'], ['省', 'shěng'], ['部', 'bù'], ['秀', 'xiù'], ['尤', 'yóu']],
  [['其', 'qí'], ['仙', 'xiān'], ['巨', 'jù'], ['位', 'wèi'], ['都', 'dū'], ['著', 'zhù'], ['形', 'xíng'], ['状', 'zhuàng']],
];
const RIGHT_ORDER = [3, 6, 0, 5, 2, 7, 1, 4]; // 右边拼音打乱的顺序
function initLink() {
  const $ = (id) => document.getElementById(id);
  const wrap = $('hsLink');
  const lines = $('hsLines');
  let round = 0;
  let sel = null;
  const center = (el, side) => {
    const w = wrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return [(side === 'l' ? r.right : r.left) - w.left, r.top + r.height / 2 - w.top];
  };
  const draw = () => {
    const w = wrap.getBoundingClientRect();
    lines.setAttribute('viewBox', `0 0 ${w.width} ${w.height}`);
    lines.innerHTML = [...$('hsLeft').querySelectorAll('.hs-lk.ok')].map((l) => {
      const r = $('hsRight').querySelector(`.hs-lk[data-k="${l.dataset.k}"]`);
      const [x1, y1] = center(l, 'l');
      const [x2, y2] = center(r, 'r');
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }).join('');
  };
  const build = () => {
    const set = LINKS[round];
    sel = null;
    $('hsLeft').innerHTML = set.map(([z], i) => `<button type="button" class="hs-lk hz" data-k="${i}">${z}</button>`).join('');
    $('hsRight').innerHTML = RIGHT_ORDER.map((i) => `<button type="button" class="hs-lk pyk" data-k="${i}">${set[i][1]}</button>`).join('');
    $('hsLMsg').textContent = `第 ${round + 1} 组`;
    lines.innerHTML = '';
  };
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('.hs-lk:not(.ok)');
    if (!b) return;
    if (b.classList.contains('hz')) {
      sel = sel === b ? null : b;
      $('hsLeft').querySelectorAll('.hs-lk').forEach((x) => x.classList.toggle('sel', x === sel));
      return;
    }
    if (!sel) return;
    if (sel.dataset.k !== b.dataset.k) { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); return; }
    sel.classList.remove('sel');
    sel.classList.add('ok');
    b.classList.add('ok');
    sel = null;
    draw();
    if (!$('hsLeft').querySelector('.hs-lk:not(.ok)')) $('hsLMsg').textContent = `第 ${round + 1} 组全部连对了！`;
  });
  $('hsNext').addEventListener('click', () => { round = (round + 1) % LINKS.length; build(); });
  new ResizeObserver(draw).observe(wrap);
  build();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initGuess();
    initName();
    initLink();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
