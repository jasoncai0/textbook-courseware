'use strict';
/* 小蝌蚪找妈妈 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 成长小卡（每个故事页右上角，翻到这一页时小蝌蚪“长”出新变化）；② 排一排成长顺序；③ 池塘路线图讲故事。 */

/* ================= 成长阶段：0 小蝌蚪 1 后腿 2 前腿 3 尾巴变短 4 青蛙（尾巴快没了） 5 尾巴不见了 ================= */
const STAGES = [
  { tail: 1, legB: 0, legF: 0, frog: 0, name: '小蝌蚪', py: 'xiǎo kē dǒu' },
  { tail: 1, legB: 1, legF: 0, frog: 0, name: '长出后腿', py: 'zhǎng chū hòu tuǐ' },
  { tail: 1, legB: 1, legF: 1, frog: 0, name: '长出前腿', py: 'zhǎng chū qián tuǐ' },
  { tail: 0.5, legB: 1, legF: 1, frog: 0.35, name: '尾巴变短', py: 'wěi ba biàn duǎn' },
  { tail: 0.16, legB: 1, legF: 1, frog: 1, name: '长成青蛙', py: 'zhǎng chéng qīng wā' },
  { tail: 0, legB: 1, legF: 1, frog: 1, name: '尾巴不见了', py: 'wěi ba bú jiàn le' },
];
const KEYS = ['tail', 'legB', 'legF', 'frog'];

/* 一只小蝌蚪 / 小青蛙（200 × 110）。翻到本页前是 from 阶段，本页激活后过渡到 to 阶段 */
function frogSvg(to, from = to) {
  const vars = KEYS.map((k) => `--${k}A:${STAGES[from][k]};--${k}B:${STAGES[to][k]}`).join(';');
  return `<svg class="kd-frog" viewBox="0 0 200 110" style="${vars}" aria-hidden="true">
    <path class="tail" d="M104 52C128 36 150 70 194 46C160 84 132 64 104 66Z"/>
    <g class="legB"><path d="M100 72Q126 78 120 96L104 100"/><path d="M92 78Q104 96 92 104L80 104"/></g>
    <g class="legF"><path d="M54 80L46 98L36 100"/><path d="M68 84L66 102L56 104"/></g>
    <ellipse class="body" cx="74" cy="60" rx="40" ry="30"/>
    <ellipse class="body green" cx="74" cy="60" rx="40" ry="30"/>
    <ellipse class="belly" cx="70" cy="72" rx="26" ry="14"/>
    <g class="eyes"><circle cx="54" cy="40" r="9"/><circle cx="84" cy="36" r="9"/><circle class="pupil" cx="52" cy="40" r="4"/><circle class="pupil" cx="82" cy="36" r="4"/></g>
    <path class="mouth" d="M40 62Q52 70 62 64"/>
  </svg>`;
}

/* 故事页右上角的成长小卡：<div class="kd-badge" data-to="2" data-from="1"></div> */
document.querySelectorAll('.kd-badge').forEach((el) => {
  const to = +el.dataset.to;
  const from = el.dataset.from === undefined ? to : +el.dataset.from;
  el.innerHTML = `${frogSvg(to, from)}<span>${Hanzi.ruby(STAGES[to].name, STAGES[to].py)}</span>`;
});
document.querySelectorAll('[data-frog]').forEach((el) => { el.innerHTML = frogSvg(+el.dataset.frog); });

/* ================= 课后第 2 题：排一排成长顺序（点卡片，按先后放进格子） ================= */
const ORDER = [0, 1, 2, 3, 5];
function initOrder(box) {
  const shuffled = [3, 0, 5, 1, 2];
  box.innerHTML = `<div class="kd-slots">${ORDER.map((_, i) => `<div class="kd-slot" data-i="${i}"><b>${i + 1}</b></div>`).join('<i class="kd-arrow">→</i>')}</div>
    <div class="kd-pool">${shuffled.map((s) => `<button type="button" class="kd-card" data-s="${s}">${frogSvg(s)}</button>`).join('')}</div>
    <p class="kd-msg">小蝌蚪是怎样长成青蛙的？按先后顺序点一点。</p>
    <div class="btns"><button type="button" class="btn" data-again>再排一次</button></div>`;
  const msg = box.querySelector('.kd-msg');
  let next = 0;
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      next = 0;
      box.querySelectorAll('.kd-card').forEach((c) => c.classList.remove('used', 'wrong'));
      box.querySelectorAll('.kd-slot').forEach((s, i) => { s.innerHTML = `<b>${i + 1}</b>`; s.classList.remove('done'); });
      box.classList.remove('all-done');
      msg.textContent = '小蝌蚪是怎样长成青蛙的？按先后顺序点一点。';
      return;
    }
    const card = e.target.closest('.kd-card:not(.used)');
    if (!card || next >= ORDER.length) return;
    const s = +card.dataset.s;
    if (s !== ORDER[next]) {
      card.classList.remove('wrong'); void card.offsetWidth; card.classList.add('wrong');
      msg.textContent = '再想想：先长出什么？';
      return;
    }
    card.classList.add('used');
    const slot = box.querySelectorAll('.kd-slot')[next];
    slot.innerHTML = `${frogSvg(s)}<small>${Hanzi.ruby(STAGES[s].name, STAGES[s].py)}</small>`;
    slot.classList.add('done');
    next += 1;
    msg.textContent = next < ORDER.length ? '对了！下一个呢？' : '排好了！小蝌蚪 → 后腿 → 前腿 → 尾巴变短 → 青蛙。';
    box.classList.toggle('all-done', next === ORDER.length);
  });
}
initOrder(document.getElementById('kdOrder'));

/* ================= 分角色朗读：只留最近 3 个对话气泡 ================= */
const TALK_KEEP = 3;
function updateTalk(slide, step) {
  const lines = [...slide.querySelectorAll('.kd-talk [data-step]')];
  const shown = lines.filter((el) => +el.dataset.step <= step);
  lines.forEach((el) => el.classList.toggle('gone', shown.indexOf(el) >= 0 && shown.indexOf(el) < shown.length - TALK_KEEP));
}

Hanzi.init({
  cards: [
    { z: '塘', py: 'táng', words: [['池塘', 'chí táng'], ['荷塘', 'hé táng']] },
    { z: '脑', py: 'nǎo', words: [['脑袋', 'nǎo dai'], ['电脑', 'diàn nǎo']] },
    { z: '袋', py: 'dài', words: [['口袋', 'kǒu dai'], ['袋鼠', 'dài shǔ']] },
    { z: '灰', py: 'huī', words: [['灰色', 'huī sè'], ['黑灰色', 'hēi huī sè']] },
    { z: '哇', py: 'wa', words: [['游哇游', 'yóu wa yóu']] },
    { z: '教', py: 'jiāo', words: [['教小鲤鱼', 'jiāo xiǎo lǐ yú'], ['教室', 'jiào shì']] },
    { z: '捕', py: 'bǔ', words: [['捕食', 'bǔ shí'], ['捕鱼', 'bǔ yú']] },
    { z: '迎', py: 'yíng', words: [['迎上去', 'yíng shàng qù'], ['欢迎', 'huān yíng']] },
    { z: '阿', py: 'ā', words: [['阿姨', 'ā yí']] },
    { z: '姨', py: 'yí', words: [['阿姨', 'ā yí'], ['姨妈', 'yí mā']] },
    { z: '宽', py: 'kuān', words: [['宽嘴巴', 'kuān zuǐ ba'], ['宽大', 'kuān dà']] },
    { z: '龟', py: 'guī', words: [['乌龟', 'wū guī'], ['海龟', 'hǎi guī']] },
    { z: '顶', py: 'dǐng', words: [['头顶', 'tóu dǐng'], ['山顶', 'shān dǐng']] },
    { z: '披', py: 'pī', words: [['披着', 'pī zhe'], ['披风', 'pī fēng']] },
    { z: '鼓', py: 'gǔ', words: [['鼓着', 'gǔ zhe'], ['打鼓', 'dǎ gǔ']] },
  ],
  pick: {
    zi: [
      { q: 'táng', ans: '塘', opts: ['糖', '塘', '唐'] },
      { q: 'kuān', ans: '宽', opts: ['宽', '完', '宾'] },
      { q: 'dǐng', ans: '顶', opts: ['项', '顶', '须'] },
      { q: 'pī', ans: '披', opts: ['波', '被', '披'] },
      { q: 'yíng', ans: '迎', opts: ['迎', '仰', '近'] },
      { q: 'bǔ', ans: '捕', opts: ['铺', '捕', '浦'] },
      { q: 'nǎo', ans: '脑', opts: ['恼', '胸', '脑'] },
      { q: 'guī', ans: '龟', opts: ['龟', '电', '鬼'] },
    ],
    dong: [
      { q: '看见鲤鱼妈妈，就（　）上去', py: 'kàn jiàn lǐ yú mā ma jiù shàng qù', ans: '迎', opts: ['追', '迎', '游'] },
      { q: '看见乌龟在水里游，连忙（　）上去', py: 'kàn jiàn wū guī zài shuǐ lǐ yóu lián máng shàng qù', ans: '追', opts: ['迎', '游', '追'] },
      { q: '小蝌蚪（　）过去，叫着：“妈妈！”', py: 'xiǎo kē dǒu guò qù jiào zhe mā ma', ans: '游', opts: ['游', '追', '迎'] },
    ],
  },
  write: {
    a: [
      { z: '两', py: 'liǎng', bs: '一', bh: 7 },
      { z: '哪', py: 'nǎ', bs: '口', bh: 9 },
      { z: '宽', py: 'kuān', bs: '宀', bh: 10 },
      { z: '顶', py: 'dǐng', bs: '页', bh: 8 },
      { z: '眼', py: 'yǎn', bs: '目', bh: 11 },
    ],
    b: [
      { z: '睛', py: 'jīng', bs: '目', bh: 13 },
      { z: '肚', py: 'dù', bs: '月', bh: 7 },
      { z: '皮', py: 'pí', bs: '皮', bh: 5 },
      { z: '孩', py: 'hái', bs: '子', bh: 9 },
      { z: '跳', py: 'tiào', bs: '足', bh: 13 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.querySelector('.kd-talk')) updateTalk(slide, step);
  },
};
