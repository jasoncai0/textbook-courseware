'use strict';
/* 动物王国开大会 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

const WHO = {
  n: { icon: '📖', name: '旁白' },
  bear: { icon: '🐻', name: '狗熊' },
  fox: { icon: '🦊', name: '狐狸' },
  wolf: { icon: '🐺', name: '大灰狼' },
  deer: { icon: '🦌', name: '梅花鹿' },
  tiger: { icon: '🐯', name: '老虎' },
};
/* 通知卡的格子：ask 时亮红色问号，fill 时填上老虎说的答案 */
const SLOTS = [
  { k: 'day', label: ['哪一天', 'nǎ yì tiān'], val: ['明天', 'míng tiān'] },
  { k: 'time', label: ['几点', 'jǐ diǎn'], val: ['上午八点', 'shàng wǔ bā diǎn'] },
  { k: 'place', label: ['在哪儿', 'zài nǎr _'], val: ['森林广场', 'sēn lín guǎng chǎng'] },
  { k: 'thing', label: ['做什么', 'zuò shén me'], val: ['开大会', 'kāi dà huì'], given: true },
];

/* ================= 课文台词（与课本逐字一致，拼音按课本），每次通知一页 ================= */
const ROUNDS = [
  [
    { who: 'n', t: '动物王国要开大会，老虎让狗熊通知大家。', py: 'dòng wù wáng guó yào kāi dà huì lǎo hǔ ràng gǒu xióng tōng zhī dà jiā' },
    { who: 'bear', t: '狗熊用喇叭大声喊：“大家注意，动物王国要开大会，请你们都参加！”一连说了十遍。', py: 'gǒu xióng yòng lǎ ba dà shēng hǎn dà jiā zhù yì dòng wù wáng guó yào kāi dà huì qǐng nǐ men dōu cān jiā yì lián shuō le shí biàn' },
    { who: 'fox', t: '狐狸奔来了，对狗熊说：“你说一百遍，大会也开不起来。”', py: 'hú li bēn lái le duì gǒu xióng shuō nǐ shuō yì bǎi biàn dà huì yě kāi bù qǐ lái' },
    { who: 'bear', t: '“为什么？”狗熊问。', py: 'wèi shén me gǒu xióng wèn' },
    { who: 'fox', t: '“因为你没告诉大家，大会在哪一天开，是今天，还是明天，还是……”', py: 'yīn wèi nǐ méi gào su dà jiā dà huì zài nǎ yì tiān kāi shì jīn tiān hái shi míng tiān hái shi', ask: 'day' },
    { who: 'bear', t: '狗熊一听，伸了伸舌头，做了个鬼脸，连忙说：“对，对，对！”于是就去问老虎。', py: 'gǒu xióng yì tīng shēn le shēn shé tou zuò le gè guǐ liǎn lián máng shuō duì duì duì yú shì jiù qù wèn lǎo hǔ' },
  ],
  [
    { who: 'tiger', t: '老虎说：“大会就在明天开，你快去通知大家吧！”', py: 'lǎo hǔ shuō dà huì jiù zài míng tiān kāi nǐ kuài qù tōng zhī dà jiā ba', fill: 'day' },
    { who: 'bear', t: '狗熊又用喇叭大声喊：“大家注意，动物王国要在明天开大会，请你们都参加！”一连说了十遍。', py: 'gǒu xióng yòu yòng lǎ ba dà shēng hǎn dà jiā zhù yì dòng wù wáng guó yào zài míng tiān kāi dà huì qǐng nǐ men dōu cān jiā yì lián shuō le shí biàn' },
    { who: 'wolf', t: '大灰狼跑来对狗熊说：“你说一百遍，大会也开不起来。”', py: 'dà huī láng pǎo lái duì gǒu xióng shuō nǐ shuō yì bǎi biàn dà huì yě kāi bù qǐ lái' },
    { who: 'bear', t: '“为什么？”狗熊问。', py: 'wèi shén me gǒu xióng wèn' },
    { who: 'wolf', t: '“因为你没告诉大家，在明天什么时候开，上午还是下午，几点钟开。”', py: 'yīn wèi nǐ méi gào su dà jiā zài míng tiān shén me shí hou kāi shàng wǔ hái shi xià wǔ jǐ diǎn zhōng kāi', ask: 'time' },
    { who: 'bear', t: '狗熊一听，说：“有道理，有道理！”于是又去问老虎。', py: 'gǒu xióng yì tīng shuō yǒu dào lǐ yǒu dào lǐ yú shì yòu qù wèn lǎo hǔ' },
  ],
  [
    { who: 'tiger', t: '老虎说：“大会就在明天上午八点开，你再去通知大家吧！”', py: 'lǎo hǔ shuō dà huì jiù zài míng tiān shàng wǔ bā diǎn kāi nǐ zài qù tōng zhī dà jiā ba', fill: 'time' },
    { who: 'bear', t: '狗熊又用喇叭大声喊：“大家注意，动物王国要在明天上午八点开大会，请你们都参加！”一连说了十遍。', py: 'gǒu xióng yòu yòng lǎ ba dà shēng hǎn dà jiā zhù yì dòng wù wáng guó yào zài míng tiān shàng wǔ bā diǎn kāi dà huì qǐng nǐ men dōu cān jiā yì lián shuō le shí biàn' },
    { who: 'deer', t: '梅花鹿奔来问狗熊：“大会在哪儿开呀？你得说清楚。”', py: 'méi huā lù bēn lái wèn gǒu xióng dà huì zài nǎr _ kāi ya nǐ děi shuō qīng chu', ask: 'place' },
    { who: 'bear', t: '狗熊捶捶自己的脑袋，说：“我怎么没问清楚呢？”于是又去问老虎。', py: 'gǒu xióng chuí chui zì jǐ de nǎo dai shuō wǒ zěn me méi wèn qīng chu ne yú shì yòu qù wèn lǎo hǔ' },
    { who: 'tiger', t: '“哎呀！忘了说地点。大会在森林广场开，你再去通知大家吧！”老虎对狗熊说。', py: 'āi yā wàng le shuō dì diǎn dà huì zài sēn lín guǎng chǎng kāi nǐ zài qù tōng zhī dà jiā ba lǎo hǔ duì gǒu xióng shuō', fill: 'place' },
  ],
  [
    { who: 'bear', t: '“请注意啦！”狗熊又用喇叭大声喊，“明天上午八点，在森林广场开大会，请大家准时参加！”一连说了十遍。', py: 'qǐng zhù yì la gǒu xióng yòu yòng lǎ ba dà shēng hǎn míng tiān shàng wǔ bā diǎn zài sēn lín guǎng chǎng kāi dà huì qǐng dà jiā zhǔn shí cān jiā yì lián shuō le shí biàn', fill: 'ok' },
    { who: 'n', t: '这一次，大家都明白了。第二天上午，动物们都来到森林广场，准时参加了大会。', py: 'zhè yí cì dà jiā dōu míng bai le dì èr tiān shàng wǔ dòng wù men dōu lái dào sēn lín guǎng chǎng zhǔn shí cān jiā le dà huì' },
  ],
];
const TALK_KEEP = 2; // 台词只留最近两句

const r = ([t, py]) => Hanzi.ruby(t, py);
const cardHtml = () => `<p class="dh-card-h">${r(['通知', 'tōng zhī'])}</p>${SLOTS.map((s) => `<div class="dh-slot${s.given ? ' filled' : ''}" data-slot="${s.k}"><b>${r(s.label)}</b><span class="dh-q">？</span><span class="dh-v">${r(s.val)}</span></div>`).join('')}<p class="dh-stamp">${r(['说清楚了', 'shuō qīng chu le'])}</p>`;

function buildTalk(box) {
  box.innerHTML = ROUNDS[+box.dataset.round].map((ln, i) => `<p class="dh-line dh-${ln.who}" data-step="${i + 1}"${ln.ask ? ` data-ask="${ln.ask}"` : ''}${ln.fill ? ` data-fill="${ln.fill}"` : ''}>
      <span class="dh-who"><em>${WHO[ln.who].icon}</em>${WHO[ln.who].name}</span><span class="py">${Hanzi.ruby(ln.t, ln.py)}</span></p>`).join('');
}
document.querySelectorAll('.dh-talk').forEach(buildTalk);
document.querySelectorAll('.dh-read .dh-card').forEach((c) => { c.innerHTML = cardHtml(); });

// 通知卡的状态：前面各页的全部台词 + 本页已出现的台词
function setCard(card, lines) {
  const state = {};
  lines.forEach((ln) => {
    if (ln.dataset.ask) state[ln.dataset.ask] = 'ask';
    if (ln.dataset.fill) state[ln.dataset.fill] = 'filled';
  });
  card.querySelectorAll('.dh-slot:not([data-slot="thing"])').forEach((s) => {
    s.classList.toggle('ask', state[s.dataset.slot] === 'ask');
    s.classList.toggle('filled', state[s.dataset.slot] === 'filled');
  });
  card.classList.toggle('ok', state.ok === 'filled');
}
function updateRead(slide, step) {
  const talk = slide.querySelector('.dh-talk');
  if (!talk) return;
  const all = [...document.querySelectorAll('.slide')];
  const before = all.slice(0, all.indexOf(slide)).flatMap((s) => [...s.querySelectorAll('.dh-line')]);
  const lines = [...talk.querySelectorAll('.dh-line')];
  const shown = lines.filter((ln) => +ln.dataset.step <= step);
  lines.forEach((ln) => {
    const k = shown.indexOf(ln);
    ln.classList.toggle('gone', k >= 0 && k < shown.length - TALK_KEEP);
    ln.classList.toggle('now', k === shown.length - 1);
  });
  setCard(slide.querySelector('.dh-card'), [...before, ...shown]);
}

/* ================= 通知闯关：三次通知，各缺什么？ ================= */
const ASKS = { day: ['哪一天开？', 'nǎ yì tiān kāi'], time: ['几点钟开？', 'jǐ diǎn zhōng kāi'], place: ['在哪儿开？', 'zài nǎr _ kāi'], thing: ['开什么会？', 'kāi shén me huì'] };
const LEVELS = [
  { say: ['大家注意，动物王国要开大会，请你们都参加！', 'dà jiā zhù yì dòng wù wáng guó yào kāi dà huì qǐng nǐ men dōu cān jiā'], who: 'fox', ans: 'day', tiger: ['大会就在明天开。', 'dà huì jiù zài míng tiān kāi'] },
  { say: ['大家注意，动物王国要在明天开大会，请你们都参加！', 'dà jiā zhù yì dòng wù wáng guó yào zài míng tiān kāi dà huì qǐng nǐ men dōu cān jiā'], who: 'wolf', ans: 'time', tiger: ['大会就在明天上午八点开。', 'dà huì jiù zài míng tiān shàng wǔ bā diǎn kāi'] },
  { say: ['大家注意，动物王国要在明天上午八点开大会，请你们都参加！', 'dà jiā zhù yì dòng wù wáng guó yào zài míng tiān shàng wǔ bā diǎn kāi dà huì qǐng nǐ men dōu cān jiā'], who: 'deer', ans: 'place', tiger: ['大会在森林广场开。', 'dà huì zài sēn lín guǎng chǎng kāi'] },
];
const FINAL = ['明天上午八点，在森林广场开大会，请大家准时参加！', 'míng tiān shàng wǔ bā diǎn zài sēn lín guǎng chǎng kāi dà huì qǐng dà jiā zhǔn shí cān jiā'];

function buildQuest(box) {
  box.innerHTML = `<div class="dh-card">${cardHtml()}</div><div class="dh-q-r">
    <p class="dh-lv"></p><p class="dh-say py"></p><p class="dh-ask"></p>
    <div class="dh-opts">${Object.entries(ASKS).map(([k, a]) => `<button type="button" class="btn dh-opt py" data-k="${k}">${r(a)}</button>`).join('')}</div>
    <p class="dh-reply py"></p><div class="btns"><button type="button" class="btn solid" data-next hidden>下一关</button><button type="button" class="btn" data-reset>重新闯关</button></div></div>`;
  const card = box.querySelector('.dh-card');
  const $ = (s) => box.querySelector(s);
  let lv = 0;
  const filled = new Set();
  const paint = () => {
    card.querySelectorAll('.dh-slot:not([data-slot="thing"])').forEach((s) => {
      s.classList.toggle('filled', filled.has(s.dataset.slot));
      s.classList.toggle('ask', false);
    });
    card.classList.toggle('ok', lv === LEVELS.length);
  };
  const show = () => {
    box.classList.remove('solved');
    $('[data-next]').hidden = true;
    $('.dh-reply').innerHTML = '';
    box.querySelectorAll('.dh-opt').forEach((b) => b.classList.remove('right', 'wrong'));
    paint();
    if (lv === LEVELS.length) {
      box.classList.add('final');
      $('.dh-lv').textContent = '闯关成功！连起来读一读：';
      $('.dh-say').innerHTML = `🐻 “${r(FINAL)}”`;
      $('.dh-ask').textContent = '时间、地点都说清楚了，大家都明白了。';
      return;
    }
    box.classList.remove('final');
    const L = LEVELS[lv];
    $('.dh-lv').textContent = `第 ${lv + 1} 关　狗熊的第 ${lv + 1} 次通知`;
    $('.dh-say').innerHTML = `🐻 “${r(L.say)}”`;
    $('.dh-ask').innerHTML = `${WHO[L.who].icon} ${WHO[L.who].name}：大会开不起来！这个通知没说清楚什么？`;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { lv = 0; filled.clear(); show(); return; }
    if (e.target.closest('[data-next]')) { lv += 1; show(); return; }
    const opt = e.target.closest('.dh-opt');
    if (!opt || lv === LEVELS.length || box.classList.contains('solved')) return;
    const L = LEVELS[lv];
    opt.classList.remove('wrong');
    void opt.offsetWidth;
    if (opt.dataset.k !== L.ans) {
      opt.classList.add('wrong');
      card.querySelector(`[data-slot="${L.ans}"]`).classList.add('ask');
      return;
    }
    opt.classList.add('right');
    filled.add(L.ans);
    paint();
    box.classList.add('solved');
    $('.dh-reply').innerHTML = `🐯 老虎：“${r(L.tiger)}”`;
    $('[data-next]').hidden = false;
    $('[data-next]').textContent = lv + 1 === LEVELS.length ? '看最后的通知' : '下一关';
  });
  show();
}
buildQuest(document.getElementById('quest'));

/* ================= 课后第 2 题：读通知，找六样 ================= */
const NOTICE = [ // [文字, 拼音, 对应的格子]
  ['4月22日上午8点', 'yuè rì shàng wǔ diǎn', 'time'], ['，', '', ''],
  ['请', 'qǐng', ''], ['各班参加运动会入场式的同学', 'gè bān cān jiā yùn dòng huì rù chǎng shì de tóng xué', 'who'], ['，', '', ''],
  ['在', 'zài', ''], ['教学楼门前', 'jiào xué lóu mén qián', 'place'], ['集合，前往运动场进行排练', 'jí hé qián wǎng yùn dòng chǎng jìn xíng pái liàn', 'thing'], ['。', '', ''],
];
const ITEMS = [
  { k: 'time', label: ['时间', 'shí jiān'] },
  { k: 'place', label: ['地点', 'dì diǎn'] },
  { k: 'who', label: ['参加人', 'cān jiā rén'] },
  { k: 'thing', label: ['事情', 'shì qing'] },
  { k: 'from', label: ['通知人', 'tōng zhī rén'] },
  { k: 'date', label: ['通知时间', 'tōng zhī shí jiān'] },
];
function buildNotice(box) {
  const seg = ([t, py, k]) => (k ? `<span class="dh-seg" data-k="${k}">${Hanzi.ruby(t, py)}</span>` : Hanzi.ruby(t, py));
  box.innerHTML = `<div class="dh-paper py"><h3>${r(['通知', 'tōng zhī'])}</h3><p>${NOTICE.map(seg).join('')}</p>
      <p class="dh-sign">${seg(['少先队大队部', 'shào xiān duì dà duì bù', 'from'])}</p><p class="dh-sign">${seg(['4月20日', 'yuè rì', 'date'])}</p></div>
    <div class="dh-items">${ITEMS.map((it) => `<button type="button" class="dh-item py" data-k="${it.k}">${r(it.label)}：<i>？</i></button>`).join('')}</div>`;
  box.addEventListener('click', (e) => {
    const it = e.target.closest('.dh-item');
    if (!it) return;
    const k = it.dataset.k;
    it.classList.add('open');
    const seg = box.querySelector(`.dh-seg[data-k="${k}"]`);
    seg.classList.add('on');
    it.querySelector('i').innerHTML = seg.innerHTML;
  });
}
buildNotice(document.getElementById('notice'));

/* ================= 识字游戏：小动物来开会 ================= */
const MEET = [['🐯', '虎', 'hǔ'], ['🐻', '熊', 'xióng'], ['🦊', '物', 'wù'], ['🐺', '通', 'tōng'], ['🦌', '注', 'zhù'], ['🐰', '意', 'yì'], ['🐿️', '遍', 'biàn'], ['🦔', '百', 'bǎi'], ['🐢', '舌', 'shé'], ['🐒', '鬼', 'guǐ'], ['🐘', '脸', 'liǎn'], ['🐼', '准', 'zhǔn'], ['🦁', '第', 'dì']];
function buildMeet(box) {
  box.innerHTML = `<div class="dh-wood"><p>${r(['森林边', 'sēn lín biān'])}</p><div class="dh-wait"></div></div>
    <div class="dh-square"><p>${r(['森林广场', 'sēn lín guǎng chǎng'])}　到了 <b>0</b> / ${MEET.length}</p><div class="dh-seats"></div></div>
    <div class="btns"><button type="button" class="btn" data-reset>再来一次</button></div>`;
  const wait = box.querySelector('.dh-wait');
  const seats = box.querySelector('.dh-seats');
  const count = box.querySelector('.dh-square b');
  const reset = () => {
    box.classList.remove('all');
    count.textContent = '0';
    seats.innerHTML = '';
    wait.innerHTML = MEET.map(([a, z, py], i) => `<button type="button" class="dh-ani" data-i="${i}"><em>${a}</em><ruby>${z}<rt>${py}</rt></ruby></button>`).join('');
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { reset(); return; }
    const ani = e.target.closest('.dh-wait .dh-ani');
    if (!ani) return;
    seats.appendChild(ani);
    ani.classList.add('in');
    count.textContent = seats.children.length;
    box.classList.toggle('all', seats.children.length === MEET.length);
  });
  reset();
}
buildMeet(document.getElementById('meet'));

Hanzi.init({
  cards: [
    { z: '物', py: 'wù', bs: '牜', bh: 8, words: [['动物', 'dòng wù']] },
    { z: '虎', py: 'hǔ', bs: '虍', bh: 8, words: [['老虎', 'lǎo hǔ']] },
    { z: '熊', py: 'xióng', bs: '灬', bh: 14, words: [['狗熊', 'gǒu xióng'], ['熊猫', 'xióng māo']] },
    { z: '通', py: 'tōng', bs: '辶', bh: 10, words: [['通知', 'tōng zhī']] },
    { z: '注', py: 'zhù', bs: '氵', bh: 8, words: [['注意', 'zhù yì']] },
    { z: '意', py: 'yì', bs: '心', bh: 13, words: [['注意', 'zhù yì']] },
    { z: '遍', py: 'biàn', bs: '辶', bh: 12, words: [['十遍', 'shí biàn'], ['一百遍', 'yì bǎi biàn']] },
    { z: '百', py: 'bǎi', bs: '一', bh: 6, words: [['一百', 'yì bǎi']] },
    { z: '舌', py: 'shé', bs: '舌', bh: 6, words: [['舌头', 'shé tou']] },
    { z: '鬼', py: 'guǐ', bs: '鬼', bh: 9, words: [['鬼脸', 'guǐ liǎn']] },
    { z: '脸', py: 'liǎn', bs: '月', bh: 11, words: [['鬼脸', 'guǐ liǎn'], ['洗脸', 'xǐ liǎn']] },
    { z: '准', py: 'zhǔn', bs: '冫', bh: 10, words: [['准时', 'zhǔn shí']] },
    { z: '第', py: 'dì', bs: '⺮', bh: 11, words: [['第二天', 'dì èr tiān'], ['第一', 'dì yī']] },
  ],
  shapes: {
    舌: ['M14 64H86', 'M22 64Q26 94 50 94Q74 94 78 64', 'M50 64V32', 'M50 32L36 12', 'M50 32L64 12', 'M41 48L35 42', 'M59 48L65 42'],
    虎: ['M32 22Q50 6 68 22L64 36Q50 42 36 36Z', 'M42 30H58', 'M50 42V78', 'M36 50Q50 46 64 50', 'M36 62Q50 58 64 62', 'M38 78L28 94', 'M62 78L72 94', 'M50 78Q70 86 84 70'],
  },
  evolve: [
    { z: '舌', note: '下面是一张嘴，上面是从嘴里伸出来的舌头。' },
    { z: '虎', note: '像一只竖着画的老虎：张着大嘴，身上有花纹，后面拖着尾巴。' },
  ],
  write: [
    { z: '要', py: 'yào', bs: '覀', bh: 9 },
    { z: '连', py: 'lián', bs: '辶', bh: 7 },
    { z: '百', py: 'bǎi', bs: '一', bh: 6 },
    { z: '还', py: 'hái', bs: '辶', bh: 7 },
    { z: '舌', py: 'shé', bs: '舌', bh: 6 },
    { z: '点', py: 'diǎn', bs: '灬', bh: 9 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateRead(slide, step);
  },
};
