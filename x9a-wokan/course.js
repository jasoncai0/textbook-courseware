'use strict';
/* 我看 · 本课数据与互动：“看”的视角镜头（取景框 + 四个机位）、“你”选一选、仿写。通用部分见 ../shared/narrative.js */

/* 四个镜头：{ } 里是拟人化的动词 */
const SHOTS = [
  { tab: '低头看', type: '近景 · 平视', pic: 'chunfeng', pos: '50% 80%', lines: ['我看一阵向晚的春风', '悄悄{揉}过丰润的青草，', '我看它们{低首}又{低首}，'] },
  { tab: '放眼望', type: '远景 · 想象', pic: 'chunfeng', pos: '50% 30%', lines: ['也许远水{荡起}了一片绿潮；'] },
  { tab: '抬头看', type: '仰拍 · 天空', pic: 'feiniao', pos: '50% 40%', lines: ['我看飞鸟{平展}着翅翼', '静静{吸入}深远的晴空里，'] },
  { tab: '远眺', type: '大全景 · 天与地', pic: 'liuyun', pos: '50% 50%', lines: ['我看流云慢慢地{红晕}', '无意{沉醉}了{凝望}它的大地。'] },
];

function initLens() {
  const bgs = document.getElementById('lensBgs');
  const tabs = document.getElementById('lensTabs');
  bgs.innerHTML = SHOTS.map((s, i) => `<div class="lb${i ? '' : ' cur'}" data-bg="assets/${s.pic}.jpg" style="background-position:${s.pos}"></div>`).join('');
  tabs.innerHTML = SHOTS.map((s, i) => `<button type="button" class="lt${i ? '' : ' cur'}" data-i="${i}"><b>镜头 ${i + 1}</b>${s.tab}</button>`).join('');
  const show = (i) => {
    const s = SHOTS[i];
    bgs.querySelectorAll('.lb').forEach((b, k) => b.classList.toggle('cur', k === i));
    tabs.querySelectorAll('.lt').forEach((b, k) => b.classList.toggle('cur', k === i));
    document.getElementById('lensType').textContent = s.type;
    document.getElementById('lensText').innerHTML = s.lines.map((l) => `<p>${l.replace(/\{(.+?)\}/g, '<em>$1</em>')}</p>`).join('');
  };
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('.lt');
    if (b) show(+b.dataset.i);
  });
  show(0);
}

const PICKS = {
  you: [
    { t: '大自然', ok: true, why: '永在勃发的自然的生命' },
    { t: '春风', ok: false, why: '只是自然的一部分' },
    { t: '远古的哲人', ok: false, why: '哲人是向“你”叹息的人' },
    { t: '大地', ok: false, why: '前文的“大地”也只是自然的一部分' },
  ],
};

const MOMENTS = [
  {
    name: '我看校园', pic: 'yaoye',
    prompt: '以《我看》为题写一首诗：用两三个“我看……”写出不同角度的画面，再写一两句由景引发的想法或愿望。',
    hint: '换镜头：低头、抬头、远望；动词用拟人（揉、吸入、沉醉）。',
    example: '我看一缕清早的阳光\n轻轻推开教室的窗，\n我看梧桐叶抖了抖肩膀，\n把昨夜的露珠交给晨风；\n我看白云慢慢走过操场，\n像在找一个落脚的地方。\n哦，让我的脚步也这样从容，\n在每一个早晨，坦荡地出发。',
  },
  {
    name: '只换镜头', pic: 'feiniao',
    prompt: '只写三个“我看”，分别用近景、仰拍、远景。',
    hint: '每句里都要有一个让景物“活”起来的动词。',
    example: '我看一只蚂蚁扛着面包屑赶路，\n我看风筝把整个天空拉得紧紧的，\n我看远山把夕阳轻轻含进嘴里。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initLens();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
