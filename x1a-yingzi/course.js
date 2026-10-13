'use strict';
/* 影子 · 本课数据。故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

Hanzi.init({
  shapes: { 女: ['M42 12C64 30 64 56 36 76', 'M30 30L74 88', 'M16 56Q50 46 84 56'] },
  pick: {
    zy: [
      { q: 'qián', ans: '前', opts: ['后', '前', '左', '右'] },
      { q: 'hòu', ans: '后', opts: ['前', '右', '后', '左'] },
      { q: 'zuǒ', ans: '左', opts: ['左', '右', '前', '后'] },
      { q: 'yòu', ans: '右', opts: ['左', '后', '前', '右'] },
      { q: 'yǐng', ans: '影', opts: ['狗', '影', '黑'] },
      { q: 'hēi', ans: '黑', opts: ['黑', '影', '狗'] },
      { q: 'gǒu', ans: '狗', opts: ['黑', '影', '狗'] },
      { q: 'péng', ans: '朋', opts: ['友', '好', '朋'] },
    ],
  },
  cards: [
    { z: '影', py: 'yǐng', bs: '彡', bh: 15, words: [['影子', 'yǐng zi'], ['人影', 'rén yǐng']] },
    { z: '前', py: 'qián', bs: '丷', bh: 9, words: [['在前', 'zài qián'], ['前后', 'qián hòu']] },
    { z: '后', py: 'hòu', bs: '口', bh: 6, words: [['在后', 'zài hòu'], ['后来', 'hòu lái']] },
    { z: '黑', py: 'hēi', bs: '黑', bh: 12, words: [['小黑狗', 'xiǎo hēi gǒu'], ['黑色', 'hēi sè']] },
    { z: '狗', py: 'gǒu', bs: '犭', bh: 8, words: [['小狗', 'xiǎo gǒu'], ['小黑狗', 'xiǎo hēi gǒu']] },
    { z: '左', py: 'zuǒ', bs: '工', bh: 5, words: [['左手', 'zuǒ shǒu'], ['左右', 'zuǒ yòu']] },
    { z: '右', py: 'yòu', bs: '口', bh: 5, words: [['右手', 'yòu shǒu'], ['左右', 'zuǒ yòu']] },
    { z: '它', py: 'tā', bs: '宀', bh: 5, words: [['它是', 'tā shì'], ['它们', 'tā men']] },
    { z: '好', py: 'hǎo', bs: '女', bh: 6, words: [['好朋友', 'hǎo péng you'], ['你好', 'nǐ hǎo']] },
    { z: '朋', py: 'péng', bs: '月', bh: 8, words: [['朋友', 'péng you'], ['好朋友', 'hǎo péng you']] },
    { z: '友', py: 'yǒu', bs: '又', bh: 4, words: [['朋友', 'péng you'], ['友好', 'yǒu hǎo']] },
  ],
  evolve: [
    { z: '好', old: ['女', '子'], note: '左边一个女子（妈妈），右边一个孩子：妈妈抱着孩子，就是“好”。（帮助记字的说法）' },
    { z: '朋', old: ['月', '月'], note: '两个“月”肩并肩站在一起，像一对好朋友。（帮助记字的说法）' },
  ],
  write: [
    { z: '在', py: 'zài', bs: '土', bh: 6 },
    { z: '后', py: 'hòu', bs: '口', bh: 6 },
    { z: '我', py: 'wǒ', bs: '戈', bh: 7 },
    { z: '好', py: 'hǎo', bs: '女', bh: 6 },
  ],
});

/* ---------- 识字游戏：看影子猜生字（本课用，代替摘苹果） ---------- */
const SHADOW_CHARS = [['影', 'yǐng'], ['前', 'qián'], ['后', 'hòu'], ['黑', 'hēi'], ['狗', 'gǒu'], ['左', 'zuǒ'], ['右', 'yòu'], ['它', 'tā'], ['好', 'hǎo'], ['朋', 'péng'], ['友', 'yǒu']];
function initGuess() {
  const box = document.getElementById('guesses');
  box.innerHTML = SHADOW_CHARS.map(([z, p]) => `<button type="button" class="yz-guess"><span class="yz-sh" aria-hidden="true">${z}</span><span class="yz-real py">${Hanzi.ruby(z, p)}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.yz-guess');
    if (b) b.classList.toggle('open');
  });
}

/* ---------- 影子游戏：太阳在哪边，影子就在对面 ---------- */
const DIR = { qian: ['前', 'qián'], hou: ['后', 'hòu'], zuo: ['左', 'zuǒ'], you: ['右', 'yòu'] };
const OPP = { qian: 'hou', hou: 'qian', zuo: 'you', you: 'zuo' };
// 太阳位置；影子从脚下出发：rot 旋转角（0 = 朝前），k 影子长短（朝后的影子近大远小，画短一点）
const SUN = { qian: { x: 300, y: 92, rot: 180, k: .6 }, hou: { x: 300, y: 340, rot: 0, k: 1.35 }, zuo: { x: 90, y: 150, rot: 90, k: 1.2 }, you: { x: 510, y: 150, rot: -90, k: 1.2 } };
const FEET = [300, 278];

function initYard() {
  const sun = document.getElementById('sun');
  const shadow = document.getElementById('shadow');
  const say = document.getElementById('yzSay');
  const ans = document.getElementById('yzAns');
  const msg = document.getElementById('yzMsg');
  sun.querySelector('.yz-rays').innerHTML = Array.from({ length: 8 }, (_, i) => {
    const a = i * Math.PI / 4;
    return `<line x1="${(Math.cos(a) * 32).toFixed(0)}" y1="${(Math.sin(a) * 32).toFixed(0)}" x2="${(Math.cos(a) * 42).toFixed(0)}" y2="${(Math.sin(a) * 42).toFixed(0)}"/>`;
  }).join('');
  let quiz = null;
  const place = (key, hide) => {
    const s = SUN[key];
    sun.style.transform = `translate(${s.x}px, ${s.y}px)`;
    shadow.style.transform = `translate(${FEET[0]}px, ${FEET[1]}px) rotate(${s.rot}deg) scale(1, ${s.k})`;
    shadow.classList.toggle('hide', !!hide);
    document.querySelectorAll('.yz-suns .btn').forEach((b) => b.classList.toggle('solid', b.dataset.sun === key));
  };
  const tell = (key) => {
    const o = OPP[key];
    say.innerHTML = Hanzi.ruby(`太阳在${DIR[key][0]}，影子在${DIR[o][0]}。`, `tài yáng zài ${DIR[key][1]} yǐng zi zài ${DIR[o][1]}`);
  };
  document.querySelector('.yz-suns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-sun]');
    if (!b) return;
    quiz = null;
    ans.hidden = true;
    msg.textContent = '';
    place(b.dataset.sun);
    tell(b.dataset.sun);
  });
  document.getElementById('yzQuiz').addEventListener('click', () => {
    const keys = Object.keys(SUN).filter((k) => k !== quiz);
    quiz = keys[Math.floor(Math.random() * keys.length)];
    place(quiz, true);
    say.innerHTML = '';
    ans.hidden = false;
    msg.textContent = `太阳在${DIR[quiz][0]}边。影子在哪边？`;
  });
  ans.addEventListener('click', (e) => {
    const b = e.target.closest('[data-a]');
    if (!b || !quiz) return;
    if (b.dataset.a !== OPP[quiz]) {
      msg.textContent = '再想想：影子总在太阳的对面。';
      b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      return;
    }
    shadow.classList.remove('hide');
    tell(quiz);
    msg.textContent = '对啦！';
    quiz = null;
    ans.hidden = true;
  });
  place('hou');
  tell('hou');
}

/* ---------- 你的前后左右都是谁？ ---------- */
const SEATS = [
  ['', null], ['🐱', 'qian'], ['', null],
  ['🐰', 'zuo'], ['我', 'me'], ['🐻', 'you'],
  ['', null], ['🐶', 'hou'], ['', null],
];
const SEAT_SAY = {
  qian: ['我的前边是小猫。', 'wǒ de qián bian shì xiǎo māo'],
  hou: ['小狗在我后边。', 'xiǎo gǒu zài wǒ hòu bian'],
  zuo: ['我的左边是小兔。', 'wǒ de zuǒ bian shì xiǎo tù'],
  you: ['小熊在我右边。', 'xiǎo xióng zài wǒ yòu bian'],
};

function initSeats() {
  const box = document.getElementById('seats');
  const say = document.getElementById('seatSay');
  box.innerHTML = SEATS.map(([t, k]) => (k ? `<button type="button" class="yz-seat${k === 'me' ? ' me' : ''}" data-k="${k}">${t}</button>` : '<span class="yz-seat empty"></span>')).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b || !SEAT_SAY[b.dataset.k]) return;
    box.querySelectorAll('.yz-seat').forEach((x) => x.classList.toggle('on', x === b));
    say.innerHTML = Hanzi.ruby(...SEAT_SAY[b.dataset.k]);
  });
}

window.LESSON = {
  init() { Narrative.init({}); initYard(); initSeats(); initGuess(); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
