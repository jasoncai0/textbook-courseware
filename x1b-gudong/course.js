'use strict';
/* 咕咚 · 本课数据与本课互动。记叙文模板见 ../shared/narrative.js（翻卡片），低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 传话的队伍：字幕上的 data-join / shout / bull / ask / point / lake / splash / laugh 驱动 ================= */
const RUNNERS = [ // 排在最前面的先写
  { k: 'rabbit', icon: '🐇', t: '兔子', py: 'tù zi' },
  { k: 'monkey', icon: '🐒', t: '小猴子', py: 'xiǎo hóu zi' },
  { k: 'fox', icon: '🦊', t: '狐狸', py: 'hú li' },
  { k: 'goat', icon: '🐐', t: '山羊', py: 'shān yáng' },
  { k: 'deer', icon: '🦌', t: '小鹿', py: 'xiǎo lù' },
  { k: 'elephant', icon: '🐘', t: '大象', py: 'dà xiàng' },
];
const SHOUTS = ['', '“咕咚”可怕极了！', '“咕咚”来了，快跑哇！', '快逃命啊，“咕咚”来了！'];

function buildStrip(box) {
  box.innerHTML = `<div class="gd-bull"><em>🐃</em><small>${Hanzi.ruby('野牛', 'yě niú')}</small><b>？</b></div>
    <div class="gd-line">${RUNNERS.map((r) => `<div class="gd-run" data-k="${r.k}"><span class="gd-q">？</span><em>${r.icon}</em><small>${Hanzi.ruby(r.t, r.py)}</small></div>`).join('')}
      <p class="gd-shout"></p></div>
    <div class="gd-lake"><i class="gd-tree">🌴</i><i class="gd-fruit"></i><i class="gd-ring"></i><i class="gd-ring"></i><b>咕咚！</b></div>`;
}
document.querySelectorAll('.gd-strip').forEach(buildStrip);

const STRIP_SEL = '[data-join], [data-shout], [data-bull], [data-ask], [data-point], [data-lake], [data-splash], [data-laugh]';
function stripState(spans) {
  const st = { join: new Set(), shout: 0, splash: 0 };
  spans.forEach((el) => {
    const d = el.dataset;
    if (d.join) d.join.split('+').forEach((k) => st.join.add(k));
    if (d.shout) st.shout = +d.shout;
    ['bull', 'ask', 'point', 'lake', 'laugh'].forEach((k) => { if (d[k]) st[k] = true; });
    if (d.splash) st.splash = +d.splash;
  });
  return st;
}
function updateStrip(slide, step) {
  const box = slide.querySelector('.gd-strip');
  if (!box) return;
  const all = [...document.querySelectorAll('.slide')];
  const before = all.slice(0, all.indexOf(slide)).flatMap((s) => [...s.querySelectorAll(STRIP_SEL)]);
  const shownHere = [...slide.querySelectorAll(STRIP_SEL)].filter((el) => +el.dataset.step <= step);
  const st = stripState([...before, ...shownHere]);
  box.querySelectorAll('.gd-run').forEach((r) => r.classList.toggle('in', st.join.has(r.dataset.k)));
  box.style.setProperty('--n', st.join.size);
  box.querySelector('.gd-shout').textContent = st.lake ? '' : SHOUTS[st.shout];
  box.dataset.shout = st.shout;
  ['bull', 'ask', 'point', 'lake', 'laugh'].forEach((k) => box.classList.toggle(k, Boolean(st[k])));
  // 水花只在本页这一步出现时播放
  const splashNow = shownHere.filter((el) => el.dataset.splash).length > 0;
  box.classList.toggle('splash', splashNow);
  if (splashNow) { box.classList.remove('replay'); void box.offsetWidth; box.classList.add('replay'); }
}

/* ================= 课后第 2 题：野牛来问一问 ================= */
const ANSWERS = {
  monkey: ['没看见，兔子说的。', 'méi kàn jiàn tù zi shuō de'],
  fox: ['没看见。', 'méi kàn jiàn'],
  goat: ['没看见。', 'méi kàn jiàn'],
  deer: ['没看见。', 'méi kàn jiàn'],
  elephant: ['没看见，大伙都说“咕咚”来了。', 'méi kàn jiàn dà huǒ dōu shuō gū dōng lái le'],
  rabbit: ['是我听见的，“咕咚”就在那边的湖里。', 'shì wǒ tīng jiàn de gū dōng jiù zài nà biān de hú lǐ'],
};
function buildAsk(box) {
  const order = ['elephant', 'deer', 'goat', 'fox', 'monkey', 'rabbit'];
  box.innerHTML = `<div class="gd-ask-top"><em>🐃</em><p class="py">${Hanzi.ruby('“咕咚”在哪里，你看见了？', 'gū dōng zài nǎ lǐ nǐ kàn jiàn le')}</p></div>
    <div class="gd-ask-row">${order.map((k) => { const r = RUNNERS.find((x) => x.k === k); return `<button type="button" class="gd-ani" data-k="${k}"><span class="gd-say py">${Hanzi.ruby(...ANSWERS[k])}</span><em>${r.icon}</em><small>${Hanzi.ruby(r.t, r.py)}</small></button>`; }).join('')}</div>
    <div class="gd-ask-bar"><span class="gd-ask-msg">点一点小动物，问一问。</span><button type="button" class="btn solid" data-go hidden>去湖边看看</button><button type="button" class="btn" data-reset>重来</button></div>
    <div class="gd-truth py"><span class="gd-splash-i">🌴<i></i></span>${Hanzi.ruby('原来“咕咚”是木瓜掉进湖里的声音！', 'yuán lái gū dōng shì mù guā diào jìn hú lǐ de shēng yīn')}</div>`;
  const msg = box.querySelector('.gd-ask-msg');
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) {
      box.querySelectorAll('.gd-ani').forEach((a) => a.classList.remove('said'));
      box.classList.remove('truth');
      box.querySelector('[data-go]').hidden = true;
      msg.textContent = '点一点小动物，问一问。';
      return;
    }
    if (e.target.closest('[data-go]')) { box.classList.add('truth'); msg.textContent = '弄清楚了，大伙都笑了。'; return; }
    const ani = e.target.closest('.gd-ani');
    if (!ani) return;
    box.querySelectorAll('.gd-ani').forEach((a) => a.classList.toggle('now', a === ani));
    ani.classList.add('said');
    if (ani.dataset.k === 'rabbit') { msg.textContent = '找到了！是兔子听见的。'; box.querySelector('[data-go]').hidden = false; } else msg.textContent = '他也没看见……再问问别人。';
  });
}
buildAsk(document.getElementById('askGame'));

/* ================= 识字游戏：传话接力 ================= */
const RELAY = [['咕', 'gū'], ['咚', 'dōng'], ['熟', 'shú'], ['掉', 'diào'], ['吓', 'xià'], ['羊', 'yáng'], ['鹿', 'lù'], ['逃', 'táo'], ['命', 'mìng'], ['象', 'xiàng'], ['野', 'yě'], ['拦', 'lán'], ['领', 'lǐng']];
function buildRelay(box) {
  box.innerHTML = `<div class="gd-stones">${RELAY.map(([z, py], i) => `<button type="button" class="gd-stone" data-i="${i}"><ruby>${z}<rt>${py}</rt></ruby></button>`).join('')}<div class="gd-end">🌊<b>${Hanzi.ruby('湖边', 'hú biān')}</b></div></div>
    <div class="gd-relay-bar"><span class="gd-relay-msg">轮到亮着的那一站：读对了就点它。</span><button type="button" class="btn" data-reset>重新传</button></div>`;
  const msg = box.querySelector('.gd-relay-msg');
  let at = 0;
  const paint = () => {
    box.querySelectorAll('.gd-stone').forEach((s, i) => { s.classList.toggle('done', i < at); s.classList.toggle('cur', i === at); });
    box.classList.toggle('arrived', at === RELAY.length);
    msg.textContent = at === RELAY.length ? '传到湖边啦！“咕咚”原来是木瓜掉进湖里。' : at ? `传到第 ${at + 1} 站了，接着读！` : '轮到亮着的那一站：读对了就点它。';
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { at = 0; paint(); return; }
    const s = e.target.closest('.gd-stone');
    if (!s || +s.dataset.i !== at) return;
    at += 1;
    paint();
  });
  paint();
}
buildRelay(document.getElementById('relay'));

/* ================= 课后第 1 题：猜读音（翻卡片，见 narrative.js initClues） ================= */
const GUESS = [['咕', '古', 'gǔ', 'gū'], ['咚', '冬', 'dōng', 'dōng'], ['吓', '下', 'xià', 'xià'], ['拦', '兰', 'lán', 'lán'], ['跟', '根', 'gēn', 'gēn'], ['腿', '退', 'tuì', 'tuǐ']];
const STORY = {
  clueLabels: ['猜一猜', '这样猜'],
  clues: GUESS.map(([z, part, p1, p2]) => ({
    q: `<b class="gd-cz">${z}</b><span class="gd-ch">它的一半像哪个字？</span>`,
    a: `<span class="gd-ca"><b>${part}</b> ${p1} → <b>${z}</b> ${p2}</span>${p1 === p2 ? '<span class="gd-ch">读音一样</span>' : '<span class="gd-ch">声调变了</span>'}`,
  })),
};

Hanzi.init({
  cards: [
    { z: '咕', py: 'gū', bs: '口', bh: 8, words: [['咕咚', 'gū dōng']] },
    { z: '咚', py: 'dōng', bs: '口', bh: 8, words: [['咕咚', 'gū dōng']] },
    { z: '熟', py: 'shú', bs: '灬', bh: 15, words: [['熟了', 'shú le']] },
    { z: '掉', py: 'diào', bs: '扌', bh: 11, words: [['掉进', 'diào jìn']] },
    { z: '吓', py: 'xià', bs: '口', bh: 6, words: [['吓了一跳', 'xià le yí tiào']] },
    { z: '羊', py: 'yáng', bs: '羊', bh: 6, words: [['山羊', 'shān yáng']] },
    { z: '鹿', py: 'lù', bs: '鹿', bh: 11, words: [['小鹿', 'xiǎo lù']] },
    { z: '逃', py: 'táo', bs: '辶', bh: 9, words: [['逃命', 'táo mìng']] },
    { z: '命', py: 'mìng', bs: '口', bh: 8, words: [['逃命', 'táo mìng']] },
    { z: '象', py: 'xiàng', bs: '⺈', bh: 11, words: [['大象', 'dà xiàng']] },
    { z: '野', py: 'yě', bs: '里', bh: 11, words: [['野牛', 'yě niú']] },
    { z: '拦', py: 'lán', bs: '扌', bh: 8, words: [['拦住', 'lán zhù']] },
    { z: '领', py: 'lǐng', bs: '页', bh: 11, words: [['领着', 'lǐng zhe']] },
  ],
  shapes: {
    羊: ['M26 14Q16 36 40 38', 'M74 14Q84 36 60 38', 'M36 38L50 78L64 38', 'M42 52H58'],
    象: ['M38 10Q24 22 28 42Q32 54 42 50', 'M40 20Q58 8 66 28', 'M54 28C76 34 78 70 62 84', 'M48 64L42 94', 'M62 70L64 94', 'M62 84Q74 88 70 98'],
  },
  evolve: [
    { z: '羊', note: '像羊头：上面两只弯弯的角，下面是尖尖的羊脸。' },
    { z: '象', note: '像一头竖着画的大象：长长的鼻子，大大的身子。' },
  ],
  write: [
    { z: '吓', py: 'xià', bs: '口', bh: 6 },
    { z: '怕', py: 'pà', bs: '忄', bh: 8 },
    { z: '跟', py: 'gēn', bs: '⻊', bh: 13 },
    { z: '家', py: 'jiā', bs: '宀', bh: 10 },
    { z: '羊', py: 'yáng', bs: '羊', bh: 6 },
    { z: '象', py: 'xiàng', bs: '⺈', bh: 11 },
    { z: '都', py: 'dōu', bs: '阝', bh: 10 },
  ],
});

window.LESSON = {
  init() { Narrative.init(STORY); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateStrip(slide, step);
  },
};
