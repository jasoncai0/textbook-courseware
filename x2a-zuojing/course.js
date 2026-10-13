'use strict';
/* 坐井观天 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：井口视角（从井底看圆圆一小块天 ↔ 跳出井口看全景）、井边对话舞台（分角色亮台词）、“帮青蛙爬出井”识字游戏 */

Hanzi.init({
  shapes: {
    井: ['M36 10V90', 'M64 10V90', 'M10 36H90', 'M10 64H90', 'M47 50H53'],
  },
  cards: [
    { z: '沿', py: 'yán', bs: '氵', bh: 8, words: [['井沿', 'jǐng yán'], ['沿着', 'yán zhe']] },
    { z: '答', py: 'dá', bs: '⺮', bh: 12, words: [['回答', 'huí dá'], ['问答', 'wèn dá']] },
    { z: '渴', py: 'kě', bs: '氵', bh: 12, words: [['口渴', 'kǒu kě'], ['渴了', 'kě le']] },
    { z: '喝', py: 'hē', bs: '口', bh: 12, words: [['喝水', 'hē shuǐ'], ['喝茶', 'hē chá']] },
    { z: '话', py: 'huà', bs: '讠', bh: 8, words: [['大话', 'dà huà'], ['说话', 'shuō huà']] },
    { z: '弄', py: 'nòng', bs: '王', bh: 7, words: [['弄错', 'nòng cuò'], ['弄脏', 'nòng zāng']] },
    { z: '错', py: 'cuò', bs: '钅', bh: 13, words: [['弄错', 'nòng cuò'], ['错字', 'cuò zì']] },
    { z: '际', py: 'jì', bs: '阝', bh: 7, words: [['无边无际', 'wú biān wú jì'], ['天际', 'tiān jì']] },
    { z: '哪', py: 'na', bs: '口', bh: 9, words: [['大得很哪', 'dà de hěn na'], ['哪儿', 'nǎr _']] },
    { z: '抬', py: 'tái', bs: '扌', bh: 8, words: [['抬头', 'tái tóu'], ['抬起', 'tái qǐ']] },
  ],
  evolve: [
    { z: '井', note: '像井口用木头搭成的“井”字形井栏，中间一点像打水的水桶。' },
    { z: '天', note: '像一个正面站着的人，突出大大的头——头顶上面就是“天”。' },
  ],
  write: [
    { z: '井', py: 'jǐng', bs: '二', bh: 4 },
    { z: '观', py: 'guān', bs: '又', bh: 6 },
    { z: '沿', py: 'yán', bs: '氵', bh: 8 },
    { z: '答', py: 'dá', bs: '⺮', bh: 12 },
    { z: '渴', py: 'kě', bs: '氵', bh: 12 },
    { z: '喝', py: 'hē', bs: '口', bh: 12 },
    { z: '话', py: 'huà', bs: '讠', bh: 8 },
    { z: '际', py: 'jì', bs: '阝', bh: 7 },
  ],
});

const STORY = {
  picks: {
    how: [
      { t: '跳出井来，看一看', ok: true, why: '对！小鸟就是这样劝它的' },
      { t: '像小鸟一样飞得高、走得远', ok: true, why: '对！看得多了，就知道天有多大' },
      { t: '继续坐在井里抬头看', ok: false, why: '还是只能看到井口那么大的天' },
      { t: '把井口挖得大一点', ok: false, why: '井口再大，也比不上无边无际的天' },
    ],
  },
};

/* ---------- 小青蛙（简笔 SVG，封面、视角页、游戏共用） ---------- */
const FROG_SVG = `<svg viewBox="0 0 120 100" aria-hidden="true">
  <ellipse cx="60" cy="72" rx="44" ry="26" fill="#5fae4e"/>
  <ellipse cx="60" cy="78" rx="28" ry="16" fill="#c7e6a8"/>
  <circle cx="38" cy="36" r="17" fill="#5fae4e"/><circle cx="82" cy="36" r="17" fill="#5fae4e"/>
  <circle cx="38" cy="34" r="10" fill="#fff"/><circle cx="82" cy="34" r="10" fill="#fff"/>
  <circle cx="39" cy="31" r="5" fill="#222"/><circle cx="81" cy="31" r="5" fill="#222"/>
  <path d="M42 62Q60 72 78 62" fill="none" stroke="#2f6b2a" stroke-width="3" stroke-linecap="round"/>
  <path d="M20 90Q8 96 14 98H34M100 90Q112 96 106 98H86" fill="none" stroke="#3f8a35" stroke-width="5" stroke-linecap="round"/>
</svg>`;
document.querySelectorAll('[data-frog]').forEach((el) => { el.innerHTML = FROG_SVG; });

/* ---------- 读好句子：选语气 ---------- */
const TONES = ['不相信、很得意', '认真、肯定', '耐心地劝'];
const TONE_LINES = [
  { who: '青蛙', t: '天不过井口那么大，还用飞那么远吗？', py: 'tiān bú guò jǐng kǒu nà me dà hái yòng fēi nà me yuǎn ma', ans: 0, tip: '“还用……吗？”就是“不用飞那么远”，读出青蛙的不相信。' },
  { who: '小鸟', t: '天无边无际，大得很哪！', py: 'tiān wú biān wú jì dà de hěn na', ans: 1, tip: '“无边无际”“大得很哪”读得响亮，稍稍拖长。' },
  { who: '小鸟', t: '不信，你跳出井来看一看吧。', py: 'bú xìn nǐ tiào chū jǐng lái kàn yi kàn ba', ans: 2, tip: '读得轻柔，像好朋友在劝你。' },
];
function initTones() {
  const box = document.getElementById('zjTones');
  box.innerHTML = TONE_LINES.map((l, i) => `<div class="zj-tone" data-i="${i}">
    <p class="zj-tone-q"><b>${l.who}</b><span class="py">${Hanzi.ruby(l.t, l.py)}</span></p>
    <div class="zj-tone-opts">${TONES.map((o, k) => `<button type="button" class="btn" data-k="${k}">${o}</button>`).join('')}</div>
    <p class="zj-tone-tip">${l.tip}</p></div>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-k]');
    if (!b) return;
    const row = b.closest('.zj-tone');
    const ok = +b.dataset.k === TONE_LINES[+row.dataset.i].ans;
    if (ok) { row.classList.add('done'); b.classList.add('solid'); return; }
    b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
  });
}

/* ---------- 分角色读：只亮一个角色的台词 ---------- */
function initRoles() {
  document.querySelectorAll('.zj-chat').forEach((chat) => {
    chat.querySelector('.zj-roles').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-role]');
      if (!b) return;
      chat.dataset.only = b.dataset.role;
      chat.querySelectorAll('.zj-roles .btn').forEach((x) => x.classList.toggle('solid', x === b && b.dataset.role !== ''));
    });
  });
}

/* ---------- 井里看 ↔ 井外看 ---------- */
function initView() {
  const view = document.getElementById('zjView');
  document.querySelector('.zj-vbtns').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-v]');
    if (b) view.classList.toggle('in', b.dataset.v === 'in');
  });
}

/* ---------- 识字游戏：帮青蛙爬出井 ---------- */
const CLIMB = [['沿', 'yán'], ['答', 'dá'], ['渴', 'kě'], ['喝', 'hē'], ['话', 'huà'], ['弄', 'nòng'], ['错', 'cuò'], ['际', 'jì'], ['哪', 'na'], ['抬', 'tái']];
const CLIMB_BOTTOM = 15;  // 最下面一块石头离井底（%）
const CLIMB_GAP = 7.5;    // 石头之间的高度差（%）
function initClimb() {
  const box = document.getElementById('zjClimb');
  const pos = CLIMB.map((_, i) => [i % 2 ? 62 : 38, CLIMB_BOTTOM + i * CLIMB_GAP]);
  box.innerHTML = `<div class="zj-shaft">
      <div class="zj-shaft-sky" data-bg="assets/quanjing.jpg"></div>
      ${CLIMB.map(([z, p], i) => `<button type="button" class="zj-stone" data-i="${i}" style="left:${pos[i][0]}%;bottom:${pos[i][1]}%">${Hanzi.ruby(z, p)}</button>`).join('')}
      <div class="zj-climber">${FROG_SVG}</div>
    </div>
    <div class="zj-climb-side">
      <p class="tip gold">读对一个字，点一块石头，青蛙就往上跳一格。</p>
      <p class="zj-climb-msg" id="zjClimbMsg"></p>
      <button type="button" class="btn" id="zjClimbReset">回到井底，再玩一次</button>
    </div>`;
  const frog = box.querySelector('.zj-climber');
  const msg = box.querySelector('#zjClimbMsg');
  const update = () => {
    const n = box.querySelectorAll('.zj-stone.used').length;
    const out = n === CLIMB.length;
    const y = n === 0 ? 0 : (out ? 100 : CLIMB_BOTTOM + (n - 1) * CLIMB_GAP + 5);
    frog.style.bottom = `${y}%`;
    frog.style.left = n === 0 || out ? '50%' : `${pos[n - 1][0]}%`;
    box.classList.toggle('out', out);
    msg.textContent = out ? '青蛙跳出井口啦！哇，天真大呀！' : `已经读对 ${n} 个字`;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('#zjClimbReset')) {
      box.querySelectorAll('.zj-stone').forEach((s) => s.classList.remove('used'));
      update();
      return;
    }
    const s = e.target.closest('.zj-stone:not(.used)');
    if (!s) return;
    s.classList.add('used');
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init(STORY);
    initRoles();
    initView();
    initTones();
    initClimb();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    const view = slide.querySelector('#zjView');
    if (view) view.classList.toggle('in', step < 2);
  },
};
