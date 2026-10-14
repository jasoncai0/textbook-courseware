'use strict';
/* 肥皂泡 · 本课数据与“排一排”。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 品读 · 课后第 1 题：小讲解员提词卡（v 动词，cue 提词：用自己的话说） */
const GUIDE = [
  { link: '先', v: '放', cue: '把用剩的碎肥皂放进小木碗里' },
  { link: '再', v: '和', cue: '加一点儿水，搅一搅，让肥皂化开' },
  { link: '然后', v: '蘸', cue: '用竹管蘸上黏黏的肥皂水' },
  { link: '接着', v: '吹', cue: '慢慢地吹，吹成网球那么大的泡泡' },
  { link: '然后', v: '提', cue: '轻轻一提，泡泡就离开竹管飘起来' },
  { link: '最后', v: '扇', cue: '用扇子在下面轻轻扇，它能飞得很高' },
];

function initGuide() {
  const $ = (id) => document.getElementById(id);
  const box = $('guideBox');
  const bub = $('guideBub');
  const render = () => {
    box.innerHTML = GUIDE.map((g, i) => `<button class="g-card" type="button" data-i="${i}"><small>${g.link}</small><b>${g.v}</b><span>${g.cue}</span></button>`).join('');
    bub.style.setProperty('--n', 0);
    bub.className = '';
    $('guideNow').textContent = '点右边的动词，泡泡就一步步吹起来。';
  };
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.g-card');
    if (!card) return;
    card.classList.add('said');
    const n = box.querySelectorAll('.g-card.said').length;
    const g = GUIDE[+card.dataset.i];
    bub.style.setProperty('--n', n);
    bub.classList.toggle('fly', n === GUIDE.length);
    $('guideNow').innerHTML = `<b>${g.link}${g.v}：</b>${g.cue}。`;
  });
  $('guideHide').addEventListener('click', () => {
    const on = box.classList.toggle('hide-cue');
    $('guideHide').textContent = on ? '显示提词' : '藏起提词，只看动词讲';
  });
  $('guideReset').addEventListener('click', render);
  render();
}

/* 品读 · 课后第 2 题：放大镜（句子里画线的词 → 意思与读懂的方法） */
const LENS = [
  { s: '这脆薄的球，会扯成长圆的形式，{颤巍巍}的，{光影零乱}。', w: [
    { m: '一抖一抖、快要破了的样子。', how: '想象画面' },
    { m: '泡泡上的彩光乱成一片——它被扯变形了。', how: '想象画面' }] },
  { s: '这时大家都{悬着心}，仰着头，{屏住呼吸}。', w: [
    { m: '心像被提起来挂着，很紧张，怕泡泡破。', how: '做做动作，体会心情' },
    { m: '憋住气，不敢喘——一喘气泡泡就破了。', how: '做做动作，体会心情' }] },
  { s: '那一个个轻清脆丽的小球，{像一串美丽的梦}。', w: [
    { m: '泡泡又美又容易破，就像美丽又短暂的梦。', how: '联系生活' }] },
  { s: '目送着她们，我心里充满了{快乐、骄傲与希望}。', w: [
    { m: '泡泡是“我”亲手吹的，飞得高高的：高兴、自豪，还盼着它飞得更远。', how: '联系上文' }] },
];

function initLens() {
  const list = document.getElementById('lensList');
  const out = document.getElementById('lensOut');
  list.innerHTML = LENS.map((it, i) => {
    let k = 0;
    return `<p>${it.s.replace(/\{(.+?)\}/g, (_, w) => `<button class="lw" type="button" data-i="${i}" data-k="${k++}">${w}</button>`)}</p>`;
  }).join('');
  list.addEventListener('click', (e) => {
    const w = e.target.closest('.lw');
    if (!w) return;
    list.querySelectorAll('.lw').forEach((b) => b.classList.toggle('sel', b === w));
    w.classList.add('seen');
    const d = LENS[+w.dataset.i].w[+w.dataset.k];
    out.innerHTML = `<b>${w.textContent}</b><span>${d.m}<small>方法：${d.how}</small></span>`;
    out.classList.remove('zoom'); void out.offsetWidth; out.classList.add('zoom');
  });
}

/* 品读 · 课后第 3 题：小球还有哪些美丽的去处 */
const MOMENTS = [
  {
    name: '飞进教室', pic: 'feiqi',
    prompt: '借着扇子的轻风，一个小泡泡飘进了教室……它会落到哪里？',
    hint: '学着课文，用上“轻轻地”“轻悠悠地”“低低地”。',
    example: '一个小泡泡轻悠悠地飘进教室，在黑板前转了一个圈，又低低地落下，落到一个正在认真写字的小女孩的铅笔尖上……',
  },
  {
    name: '落在花瓣上', pic: 'langzi',
    prompt: '雨停了，小泡泡飘过院子里的花丛……',
    hint: '想一想花园里有什么：花瓣、露珠、蝴蝶……',
    example: '或者轻轻地飘过花丛，和蝴蝶比一比谁飞得更美，又低低地落下，落到一片沾着雨珠的花瓣上，和露珠做了好朋友……',
  },
  {
    name: '飞向星星', pic: 'mengxiang',
    prompt: '到了夜里，小泡泡越飞越高……',
    hint: '课文写了明月、天河、夕阳，你还能想到什么？',
    example: '到夜空中，轻轻地碰一碰星星，向月亮里的桂花树打个招呼，再乘着流星，飞到宇宙的另一边去……',
  },
  {
    name: '飘到远方', pic: 'mengxiang',
    prompt: '小泡泡飘过大海、山巅，还会飘到谁的身边？',
    hint: '可以是远方的亲人、山里的小朋友……',
    example: '或者飘过一座座大山，落到山里小学的窗台上，让那里的小朋友也看看——这是从很远很远的地方飞来的一个美丽的梦。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initGuide();
    initLens();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
