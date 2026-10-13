'use strict';
/* 小英雄雨来 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课独有：小标题拼图（把长文章“变短”，把握主要内容） */

/* 课后第 2 题：六个部分的小标题（第一部分课本已给出） */
const PARTS = [
  { n: '一', gist: '芦花村的雨来在还乡河里游泳，妈妈追不上他', title: '游泳本领高', given: true },
  { n: '二', gist: '雨来用红布包书皮，跟着女老师念课文', title: '上夜校读书' },
  { n: '三', gist: '雨来把李大叔藏进地洞，自己被敌人抓住', title: '掩护李大叔' },
  { n: '四', gist: '敌人又哄又打，雨来就是不说', title: '宁死不屈' },
  { n: '五', gist: '河沿上响了枪，乡亲们以为雨来死了', title: '河沿枪声' },
  { n: '六', gist: '雨来从芦苇丛里露出小脑袋', title: '雨来没有死' },
];
const DECOYS = ['爸爸参加民兵', '扁鼻子军官'];

function initTitles() {
  const parts = document.getElementById('parts');
  const pool = document.getElementById('titlePool');
  let pick = null;
  parts.innerHTML = PARTS.map((p, i) => `<button type="button" class="part${p.given ? ' done' : ''}" data-i="${i}">
    <b>第${p.n}部分</b><span class="gist">${p.gist}</span><span class="slot">${p.given ? p.title : '？'}</span></button>`).join('');
  const cards = [...PARTS.filter((p) => !p.given).map((p) => p.title), ...DECOYS].sort(() => Math.random() - 0.5);
  pool.innerHTML = cards.map((t) => `<button type="button" class="pick">${t}</button>`).join('');
  const select = (btn) => {
    pick = btn;
    parts.querySelectorAll('.part').forEach((x) => x.classList.toggle('sel', x === btn));
  };
  parts.addEventListener('click', (e) => {
    const btn = e.target.closest('.part');
    if (btn && !btn.classList.contains('done')) select(btn);
  });
  pool.addEventListener('click', (e) => {
    const card = e.target.closest('.pick');
    if (!card || card.disabled) return;
    const target = pick || parts.querySelector('.part:not(.done)');
    if (!target) return;
    const want = PARTS[+target.dataset.i].title;
    card.classList.remove('wrong');
    if (card.textContent !== want) {
      void card.offsetWidth; // 重新触发抖动动画
      card.classList.add('wrong');
      return;
    }
    target.querySelector('.slot').textContent = want;
    target.classList.add('done');
    card.disabled = true;
    card.classList.add('right');
    select(parts.querySelector('.part:not(.done)'));
  });
  select(parts.querySelector('.part:not(.done)'));
}

/* 情节曲线 */
const PLOT = [
  { step: 1, stage: '开端', text: '游泳本领高 · 上夜校', pic: 'luhua', x: 10, y: 96 },
  { step: 2, stage: '发展', text: '掩护李大叔，被抓住', pic: 'bangang', x: 30, y: 72 },
  { step: 3, stage: '高潮', text: '敌人软硬兼施，宁死不屈', pic: 'yexiao', pos: '40% 80%', x: 50, y: 46 },
  { step: 4, stage: '低谷', text: '河沿枪声，乡亲们悲痛', pic: 'luwei', pos: '50% 10%', x: 70, y: 98 },
  { step: 5, stage: '结局', text: '雨来没有死！', pic: 'luwei', pos: '50% 70%', x: 90, y: 58 },
];

/* 课后第 3 题：还乡河的景色 */
const CLUE_LABELS = ['还乡河的景色', '有什么作用'];
const CLUES = [
  { q: '芦花开的时候，远远望去，黄绿的芦苇上好像盖了一层厚厚的白雪。<br><small>（第一部分）</small>', a: '写出家乡芦花村的美。雨来就在这样美丽的家乡长大，他热爱自己的家乡。' },
  { q: '蓝蓝的天上飘着的浮云像一块一块红绸子，映在还乡河上，像开了一大朵一大朵鸡冠花。<br><small>（第五部分）</small>', a: '美丽的晚霞和河沿上的枪声放在一起，更让人为“失去”雨来而痛惜。' },
  { q: '还乡河静静的，河水打着漩涡哗哗地向下流去。虫子在草窝里叫着。<br><small>（第六部分）</small>', a: '静静的河、哗哗的水、虫子的叫声，衬托出大家心里的悲伤；也为雨来从水里出现做好了准备。' },
  { q: '想一想：作者为什么一次又一次写还乡河？', a: '还乡河是雨来的家乡，也是雨来的“好朋友”——他在这里练出了游泳的本领，最后也是还乡河帮他脱险。美丽的家乡，值得保卫！' },
];

/* 读与写 */
const MOMENTS = [
  {
    name: '用小标题说内容', pic: 'luhua',
    prompt: '借助六个小标题，用几句话说说课文的主要内容。',
    hint: '不用把每个细节都说出来，说清“谁、做了什么、结果怎样”。',
    example: '芦花村的雨来游泳本领很高，还上夜校读书。一天，他为了掩护交通员李大叔，被敌人抓住了。敌人又哄又打，雨来宁死不屈。乡亲们听到河沿上的枪声，以为雨来牺牲了，没想到雨来趁敌人不防备扎进河里，游走了。',
  },
  {
    name: '雨来回家以后', pic: 'luwei',
    prompt: '雨来回到家，见到了从东庄回来的妈妈。他们会说些什么？',
    hint: '想一想妈妈当时的心情，雨来会怎样讲今天发生的事。',
    example: '妈妈一把搂住雨来，眼泪止不住地往下掉：“我的好孩子，你可吓死妈妈了！”雨来抹了抹鼻子，咧嘴一笑：“妈，你不让我耍水，今天可多亏了耍水呢！”',
  },
  {
    name: '给第四部分换个标题', pic: 'yexiao',
    prompt: '第四部分还可以起个什么小标题？说说你的理由。',
    hint: '可以从敌人的做法想（软硬兼施），也可以从雨来的表现想（机智勇敢、宁死不屈）。',
    example: '我起的小标题是“糖块和巴掌”。敌人先拿糖块和金戒指哄雨来，又用巴掌打他，雨来都不怕，就是不说李大叔在哪儿。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initTitles();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
