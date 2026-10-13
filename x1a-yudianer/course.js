'use strict';
/* 雨点儿 · 本课数据。故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

Hanzi.init({
  shapes: { 门: ['M22 14V90', 'M22 14H42V42H22', 'M78 14V90', 'M78 14H58V42H78'] },
  cards: [
    { z: '数', py: 'shǔ', bs: '攵', bh: 13, words: [['数不清', 'shǔ bù qīng'], ['数星星', 'shǔ xīng xing']] },
    { z: '彩', py: 'cǎi', bs: '彡', bh: 11, words: [['云彩', 'yún cai'], ['彩色', 'cǎi sè']] },
    { z: '半', py: 'bàn', bs: '丷', bh: 5, words: [['半空中', 'bàn kōng zhōng'], ['一半', 'yí bàn']] },
    { z: '空', py: 'kōng', bs: '穴', bh: 8, words: [['半空中', 'bàn kōng zhōng'], ['天空', 'tiān kōng']] },
    { z: '问', py: 'wèn', bs: '门', bh: 6, words: [['请问', 'qǐng wèn'], ['问好', 'wèn hǎo']] },
    { z: '到', py: 'dào', bs: '刂', bh: 8, words: [['到哪里', 'dào nǎ lǐ'], ['来到', 'lái dào']] },
    { z: '方', py: 'fāng', bs: '方', bh: 4, words: [['地方', 'dì fang'], ['方向', 'fāng xiàng']] },
    { z: '没', py: 'méi', bs: '氵', bh: 7, words: [['没有', 'méi yǒu'], ['没有花', 'méi yǒu huā']] },
    { z: '更', py: 'gèng', bs: '一', bh: 7, words: [['更红', 'gèng hóng'], ['更绿', 'gèng lǜ']] },
    { z: '绿', py: 'lǜ', bs: '纟', bh: 11, words: [['绿草', 'lǜ cǎo'], ['绿色', 'lǜ sè']] },
    { z: '出', py: 'chū', bs: '凵', bh: 5, words: [['开出', 'kāi chū'], ['出来', 'chū lái']] },
    { z: '长', py: 'zhǎng', bs: '长', bh: 4, words: [['长出', 'zhǎng chū'], ['长大', 'zhǎng dà']] },
  ],
  evolve: [
    { z: '从', old: ['人', '人'], note: '一个人跟在另一个人后面走——“跟从”的“从”。（帮助记字的说法）' },
    { z: '问', old: ['门', '口'], note: '门里有一张嘴：站在门口问一问。（帮助记字的说法）' },
  ],
  write: [
    { z: '问', py: 'wèn', bs: '门', bh: 6 },
    { z: '有', py: 'yǒu', bs: '月', bh: 6 },
    { z: '半', py: 'bàn', bs: '丷', bh: 5 },
    { z: '从', py: 'cóng', bs: '人', bh: 4 },
    { z: '你', py: 'nǐ', bs: '亻', bh: 7 },
  ],
});

/* ---------- 雨点儿落到哪里：小雨点儿 → 有花有草的地方（更红更绿）；大雨点儿 → 光秃秃的地方（开花长草） ---------- */
const FALL = {
  small: { say: ['有花有草的地方，花更红了，草更绿了。', 'yǒu huā yǒu cǎo de dì fang huā gèng hóng le cǎo gèng lǜ le'] },
  big: { say: ['没有花没有草的地方，开出了红的花，长出了绿的草。', 'méi yǒu huā méi yǒu cǎo de dì fang kāi chū le hóng de huā zhǎng chū le lǜ de cǎo'] },
};
const blade = (x, h) => `<path class="yd-grass" d="M${x - 5} 300Q${x - 2} ${300 - h * .6} ${x} ${300 - h}Q${x + 2} ${300 - h * .6} ${x + 5} 300Z"/>`;
const flower = (x, y) => `<g class="yd-flower" transform="translate(${x} ${y})"><path d="M0 0V${300 - y}" stroke="#4f9a3a" stroke-width="3"/>${[0, 72, 144, 216, 288].map((a) => `<circle cx="${(Math.cos(a * Math.PI / 180) * 8).toFixed(1)}" cy="${(Math.sin(a * Math.PI / 180) * 8).toFixed(1)}" r="7"/>`).join('')}<circle r="5" fill="#f6d34a"/></g>`;

function initRainy() {
  const svg = document.getElementById('rainy');
  const say = document.getElementById('ydSay');
  svg.querySelector('.yd-old').innerHTML = [20, 50, 95, 140, 185, 230, 270].map((x, i) => blade(x, 26 + (i % 3) * 8)).join('')
    + [[40, 262], [120, 255], [205, 266], [260, 258]].map(([x, y]) => flower(x, y)).join('');
  svg.querySelector('.yd-new').innerHTML = [325, 365, 410, 455, 500, 545, 585].map((x, i) => blade(x, 24 + (i % 3) * 9)).join('')
    + [[345, 262], [430, 256], [515, 264], [570, 258]].map(([x, y]) => flower(x, y)).join('');
  svg.addEventListener('click', (e) => {
    const d = e.target.closest('.yd-drop');
    if (!d || svg.classList.contains(`fell-${d.dataset.d}`)) return;
    svg.classList.add(`fell-${d.dataset.d}`);
    say.innerHTML = Hanzi.ruby(...FALL[d.dataset.d].say);
  });
  document.getElementById('ydAgain').addEventListener('click', () => {
    svg.classList.remove('fell-small', 'fell-big');
    say.innerHTML = '';
  });
}

/* ---------- 识字游戏：浇一浇，开出花来（本课用，代替摘苹果） ---------- */
const BUDS = [['数', 'shǔ'], ['彩', 'cǎi'], ['半', 'bàn'], ['空', 'kōng'], ['问', 'wèn'], ['到', 'dào'], ['方', 'fāng'], ['没', 'méi'], ['更', 'gèng'], ['绿', 'lǜ'], ['出', 'chū'], ['长', 'zhǎng']];
function initGarden() {
  const box = document.getElementById('garden');
  const n = document.getElementById('bloomN');
  box.innerHTML = BUDS.map(([z, p], i) => `<button type="button" class="yd-bud" data-i="${i}"><i class="yd-drip"></i><span class="yd-head">${Hanzi.ruby(z, p)}</span><i class="yd-stem"></i></button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.yd-bud:not(.bloom)');
    if (!b) return;
    b.classList.add('bloom');
    n.textContent = box.querySelectorAll('.bloom').length;
  });
  document.getElementById('gardenReset').addEventListener('click', () => {
    box.querySelectorAll('.yd-bud').forEach((b) => b.classList.remove('bloom'));
    n.textContent = '0';
  });
}

/* ---------- 分角色朗读：点角色，亮出这个角色要读的句子 ---------- */
function initRoles() {
  const text = document.getElementById('roleText');
  document.querySelector('.yd-roles').addEventListener('click', (e) => {
    const b = e.target.closest('[data-role]');
    if (!b) return;
    text.dataset.role = b.dataset.role;
    document.querySelectorAll('.yd-roles .btn').forEach((x) => x.classList.toggle('solid', x === b));
  });
}

window.LESSON = {
  init() { Narrative.init({}); initRainy(); initRoles(); initGarden(); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
