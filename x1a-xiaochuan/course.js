'use strict';
/* 小小的船 · 本课数据。故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

Hanzi.init({
  pick: {
    aa: [
      { q: '（　）的船', py: 'de chuán', ans: '小小', opts: ['小小', '弯弯', '闪闪', '蓝蓝'] },
      { q: '（　）的月儿', py: 'de yuè ér', ans: '弯弯', opts: ['蓝蓝', '弯弯', '闪闪', '小小'] },
      { q: '（　）的星星', py: 'de xīng xing', ans: '闪闪', opts: ['弯弯', '蓝蓝', '小小', '闪闪'] },
      { q: '（　）的天', py: 'de tiān', ans: '蓝蓝', opts: ['闪闪', '小小', '蓝蓝', '弯弯'] },
      { q: '（　）的小河', py: 'de xiǎo hé', ans: '弯弯', opts: ['弯弯', '闪闪', '蓝蓝'] },
      { q: '（　）的大海', py: 'de dà hǎi', ans: '蓝蓝', opts: ['闪闪', '弯弯', '蓝蓝'] },
    ],
  },
  cards: [
    { z: '的', py: 'de', bs: '白', bh: 8, words: [['小小的船', 'xiǎo xiǎo de chuán'], ['我的', 'wǒ de']] },
    { z: '船', py: 'chuán', bs: '舟', bh: 11, words: [['小船', 'xiǎo chuán'], ['船儿', 'chuán ér']] },
    { z: '两', py: 'liǎng', bs: '一', bh: 7, words: [['两头', 'liǎng tóu'], ['两个', 'liǎng gè']] },
    { z: '头', py: 'tóu', bs: '大', bh: 5, words: [['两头', 'liǎng tóu'], ['船头', 'chuán tóu']] },
    { z: '在', py: 'zài', bs: '土', bh: 6, words: [['我在', 'wǒ zài'], ['现在', 'xiàn zài']] },
    { z: '里', py: 'lǐ', bs: '里', bh: 7, words: [['船里', 'chuán lǐ'], ['家里', 'jiā lǐ']] },
    { z: '看', py: 'kàn', bs: '目', bh: 9, words: [['看见', 'kàn jiàn'], ['好看', 'hǎo kàn']] },
    { z: '见', py: 'jiàn', bs: '见', bh: 4, words: [['看见', 'kàn jiàn'], ['再见', 'zài jiàn']] },
    { z: '闪', py: 'shǎn', bs: '门', bh: 5, words: [['闪闪', 'shǎn shǎn'], ['一闪一闪', 'yì shǎn yì shǎn']] },
    { z: '星', py: 'xīng', bs: '日', bh: 9, words: [['星星', 'xīng xing'], ['星空', 'xīng kōng']] },
  ],
  evolve: [
    { z: '月', note: '像一弯月牙——和课文里“弯弯的月儿”一样。' },
    { z: '见', old: ['目', '人'], note: '上面一只大眼睛，下面一个人：人睁大眼睛，就“看见”了。（帮助记字的说法）' },
  ],
  apples: [['的', 'de'], ['船', 'chuán'], ['两', 'liǎng'], ['头', 'tóu'], ['在', 'zài'], ['里', 'lǐ'], ['看', 'kàn'], ['见', 'jiàn'], ['闪', 'shǎn'], ['星', 'xīng']],
  write: [
    { z: '月', py: 'yuè', bs: '月', bh: 4 },
    { z: '儿', py: 'ér', bs: '儿', bh: 2 },
    { z: '头', py: 'tóu', bs: '大', bh: 5 },
    { z: '里', py: 'lǐ', bs: '里', bh: 7 },
  ],
});

/* 月亮会变样：三种月相 + “像什么” */
const MOON = {
  wan: { say: ['弯弯的月儿', 'wān wān de yuè ér'], likes: [['小船', 'xiǎo chuán'], ['香蕉', 'xiāng jiāo'], ['眉毛', 'méi mao']] },
  ban: { say: ['半圆的月亮', 'bàn yuán de yuè liang'], likes: [['半个西瓜', 'bàn gè xī guā'], ['小扇子', 'xiǎo shàn zi']] },
  yuan: { say: ['圆圆的月亮', 'yuán yuán de yuè liang'], likes: [['大圆盘', 'dà yuán pán'], ['白玉盘', 'bái yù pán']] },
};
const LIKE = ['像', 'xiàng'];

function initMoon() {
  const svg = document.getElementById('moon');
  const say = document.getElementById('moonSay');
  const likes = document.getElementById('moonLikes');
  const rnd = (n) => Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1; // 固定的伪随机，星星每次位置一样
  svg.querySelector('.xc-stars').innerHTML = Array.from({ length: 36 }, (_, i) =>
    `<circle cx="${(10 + rnd(i + 1) * 580).toFixed(0)}" cy="${(10 + rnd(i + 99) * 320).toFixed(0)}" r="${1.2 + (i % 3)}" fill="#fff8d0" style="animation-delay:${(i % 7) * .3}s"/>`).join('');
  const show = (ph) => {
    svg.dataset.phase = ph;
    svg.classList.remove('liked');
    say.innerHTML = Hanzi.ruby(MOON[ph].say[0], MOON[ph].say[1]);
    likes.innerHTML = '';
    document.querySelectorAll('.xc-photo').forEach((x) => x.remove());
    document.querySelectorAll('.xc-phases .btn').forEach((b) => b.classList.toggle('solid', b.dataset.ph === ph));
  };
  document.querySelector('.xc-phases').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ph]');
    if (b) show(b.dataset.ph);
  });
  document.getElementById('moonLike').addEventListener('click', () => {
    const ph = svg.dataset.phase;
    svg.classList.add('liked');
    likes.innerHTML = MOON[ph].likes.map(([w, p]) => `<span class="py">${Hanzi.ruby(LIKE[0] + w, `${LIKE[1]} ${p}`)}</span>`).join('');
    // 弯月：再配一张“月亮和小船”的 AI 想象图对照（点击时才加载）
    document.querySelectorAll('.xc-photo').forEach((x) => x.remove());
    if (ph === 'wan') svg.insertAdjacentHTML('afterend', '<i class="xc-photo" style="background-image:url(\'assets/xiaohe.jpg\')" title="AI 想象图：天上的弯月和河上的小船"></i>');
  });
  show('wan');
}

window.LESSON = {
  init() { Narrative.init({}); initMoon(); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
