'use strict';
/* 对韵歌 · 本课数据。识字模板见 ../shared/hanzi.js（必须在顶层调用，deck.js 加载前渲染完）
 * 识字 5 在学拼音之前：游戏用看图、古字形、老师读题孩子点，不用“看拼音选字”。 */

/* 看图选字：把 assets/<name>.jpg 放大 z 倍，镜头对准图上 (cx%, cy%) */
const crop = (name, cx, cy, z = 4) => {
  const p = (c) => `${Math.min(100, Math.max(0, ((c / 100 - 0.5 / z) / (1 - 1 / z)) * 100)).toFixed(1)}%`;
  return { pic: `assets/${name}.jpg`, pos: `${p(cx)} ${p(cy)}`, size: `${z * 100}%` };
};

/* 拍手读：点一下手掌亮一拍；“跟着节拍读”自动打拍 */
const CLAP_BEAT = 800;
(() => {
  const box = document.getElementById('clap');
  const groups = [...box.querySelectorAll('.cl-g')];
  const hands = box.querySelector('.cl-hands');
  let timer = 0;
  const reset = () => { clearInterval(timer); timer = 0; groups.forEach((g) => g.classList.remove('on', 'now')); };
  const beat = () => {
    const next = groups.find((g) => !g.classList.contains('on'));
    if (!next) { clearInterval(timer); timer = 0; return false; }
    groups.forEach((g) => g.classList.remove('now'));
    next.classList.add('on', 'now');
    hands.classList.remove('clap');
    void hands.offsetWidth;
    hands.classList.add('clap');
    return true;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { reset(); return; }
    if (e.target.closest('[data-clap]')) { if (!beat()) { reset(); beat(); } return; }
    if (e.target.closest('[data-auto]')) { reset(); beat(); timer = setInterval(beat, CLAP_BEAT); }
  });
})();

Hanzi.init({
  /* 本课补的古字形（示意简笔，100 × 100，一笔一条 path） */
  shapes: {
    云: ['M26 16H74', 'M18 32H82', 'M48 32C26 46 28 74 50 76C68 78 72 56 56 52'],
    雨: ['M10 14H90', 'M24 30V44', 'M50 30V44', 'M76 30V44', 'M24 62V76', 'M50 62V76', 'M76 62V76'],
    鸟: ['M30 20A8 8 0 1 0 30 36A8 8 0 1 0 30 20', 'M22 26L10 30L22 32', 'M37 32C60 30 80 44 88 62C68 64 50 62 38 52C32 46 32 38 37 32', 'M52 62V86', 'M62 62V86'],
    虫: ['M50 10C30 10 30 40 50 40C70 40 70 10 50 10', 'M50 40C50 60 32 64 36 80C40 94 64 90 66 76'],
  },
  evolve: [
    { z: '云', note: '上面是天，下面像卷起来的云朵。' },
    { z: '雨', note: '上面一横是天，下面是一滴一滴落下的雨点。' },
    { z: '鸟', note: '像一只小鸟：有头、有嘴、有身子，还有脚。' },
    { z: '虫', note: '像一条小虫，三角形的头，弯弯的身子。' },
  ],
  pick: {
    /* 看图找字：把配图放大到某一处（已对照生成图） */
    kan: [
      { ...crop('huashu', 15, 74), ans: '花', opts: ['花', '树', '虫'] },
      { ...crop('huashu', 81, 42, 3), ans: '树', opts: ['鸟', '树', '花'] },
      { ...crop('huashu', 69, 35), ans: '鸟', opts: ['虫', '花', '鸟'] },
      { ...crop('huashu', 19, 52, 5), ans: '虫', opts: ['虫', '鸟', '树'] },
      { ...crop('yunyu', 25, 24), ans: '云', opts: ['云', '雨', '风'] },
      { ...crop('yunyu', 25, 58), ans: '雨', opts: ['风', '雨', '云'] },
    ],
    old: [
      { old: '雨', ans: '雨', opts: ['云', '雨', '山'] },
      { old: '鸟', ans: '鸟', opts: ['鸟', '虫', '花'] },
      { old: '山', ans: '山', opts: ['水', '云', '山'] },
      { old: '云', ans: '云', opts: ['云', '雨', '风'] },
      { old: '虫', ans: '虫', opts: ['鸟', '虫', '水'] },
      { old: '水', ans: '水', opts: ['雨', '山', '水'] },
    ],
    /* 对对子：老师读上半句，孩子点下半句（拼音给老师看） */
    dui: [
      { q: '云对＿', py: 'yún duì', ans: '雨', opts: ['花', '雨', '虫'] },
      { q: '雪对＿', py: 'xuě duì', ans: '风', opts: ['风', '树', '鸟'] },
      { q: '花对＿', py: 'huā duì', ans: '树', opts: ['雨', '虫', '树'] },
      { q: '鸟对＿', py: 'niǎo duì', ans: '虫', opts: ['虫', '风', '花'] },
      { q: '山清对＿', py: 'shān qīng duì', ans: '水秀', opts: ['桃红', '水秀'] },
      { q: '柳绿对＿', py: 'liǔ lǜ duì', ans: '桃红', opts: ['桃红', '水秀'] },
    ],
  },
  cards: [
    { z: '对', py: 'duì', bs: '又', bh: 5, words: [['对子', 'duì zi'], ['一对', 'yí duì']] },
    { z: '云', py: 'yún', bs: '二', bh: 4, words: [['白云', 'bái yún'], ['云朵', 'yún duǒ']] },
    { z: '雨', py: 'yǔ', bs: '雨', bh: 8, words: [['下雨', 'xià yǔ'], ['雨点', 'yǔ diǎn']] },
    { z: '风', py: 'fēng', bs: '风', bh: 4, words: [['大风', 'dà fēng'], ['风雨', 'fēng yǔ']] },
    { z: '花', py: 'huā', bs: '艹', bh: 7, words: [['花朵', 'huā duǒ'], ['红花', 'hóng huā']] },
    { z: '鸟', py: 'niǎo', bs: '鸟', bh: 5, words: [['小鸟', 'xiǎo niǎo'], ['鸟儿', 'niǎo ér']] },
    { z: '虫', py: 'chóng', bs: '虫', bh: 6, words: [['小虫', 'xiǎo chóng'], ['虫子', 'chóng zi']] },
  ],
  write: [
    { z: '虫', py: 'chóng', bs: '虫', bh: 6 },
    { z: '云', py: 'yún', bs: '二', bh: 4 },
    { z: '山', py: 'shān', bs: '山', bh: 3 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
