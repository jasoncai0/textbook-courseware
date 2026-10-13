'use strict';
/* 沙滩上的童话 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 堆城堡（读一个动作，沙滩上多一样）；② 编童话对话气泡；③ 攻城计划分支（翻开计划看结果）；④ 编故事抽词；⑤ 垒城堡识字。 */

/* 二下只给生字注音：data-pyk="垒:lěi" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

const shake = (el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); };

/* ================= 攻城计划：翻开计划看结果 ================= */
document.getElementById('stPlan').addEventListener('click', (e) => {
  const c = e.target.closest('.st-card');
  if (c) c.classList.add('open');
});

/* ================= 编故事：选开头 + 抽三个词 ================= */
const STARTS = ['在一片沙漠里，有……', '从前，有一座大山……'];
const WORDS = [['城堡', 'chéng bǎo'], ['堡垒', 'bǎo lěi'], ['凶狠', 'xiōng hěn'], ['凶恶', 'xiōng è'], ['攻打', 'gōng dǎ'], ['进攻', 'jìn gōng'],
  ['火药', 'huǒ yào'], ['炸药', 'zhà yào'], ['赞赏', 'zàn shǎng'], ['赞美', 'zàn měi'], ['合力', 'hé lì'], ['合作', 'hé zuò']];
const DRAW_N = 3;
function initStory(box) {
  box.innerHTML = `<div class="st-starts">${STARTS.map((s, i) => `<button type="button" class="st-start${i ? '' : ' on'}">◇ ${s}</button>`).join('')}</div>
    <div class="st-pool">${WORDS.map(([w, py]) => `<span class="st-w">${Hanzi.ruby(w, py)}</span>`).join('')}</div>
    <div class="st-drawbar"><button type="button" class="btn solid" data-draw>抽词语</button><span class="st-got"></span></div>`;
  box.addEventListener('click', (e) => {
    const s = e.target.closest('.st-start');
    if (s) { box.querySelectorAll('.st-start').forEach((x) => x.classList.toggle('on', x === s)); return; }
    if (!e.target.closest('[data-draw]')) return;
    const all = [...box.querySelectorAll('.st-w')];
    all.forEach((w) => w.classList.remove('got'));
    const pick = all.map((w) => [Math.random(), w]).sort((a, b) => a[0] - b[0]).slice(0, DRAW_N).map(([, w]) => w);
    pick.forEach((w) => w.classList.add('got'));
    box.querySelector('.st-got').innerHTML = `用上：${pick.map((w) => `<b>${w.innerHTML}</b>`).join('　')}`;
  });
}
initStory(document.getElementById('stStory'));

/* ================= 垒城堡：选对一个字，城堡高一层 ================= */
const BUILD_Q = [
  { q: '城（　）', ans: '堡', opts: ['保', '堡', '煲'] },
  { q: '（　）上干树枝', ans: '插', opts: ['插', '擂', '捕'] },
  { q: '凶（　）', ans: '狠', opts: ['很', '恨', '狠'] },
  { q: '补（　）', ans: '充', opts: ['充', '允', '统'] },
  { q: '（　）打魔窟', ans: '攻', opts: ['功', '攻', '巧'] },
  { q: '商（　）', ans: '量', opts: ['重', '童', '量'] },
  { q: '（　）驶飞机', ans: '驾', opts: ['驾', '骂', '架'] },
  { q: '反（　）', ans: '驳', opts: ['驶', '驳', '骏'] },
  { q: '火（　）', ans: '药', opts: ['约', '菊', '药'] },
  { q: '忘（　）', ans: '记', opts: ['记', '纪', '计'] },
];
const BUILD_NEXT_MS = 1100;
function initBuild(box) {
  let i = 0;
  let busy = false;
  box.innerHTML = `<div class="st-tower"><i class="st-flag">🚩</i>${BUILD_Q.map((_, k) => `<span class="st-layer" style="--k:${k}"></span>`).join('')}<b class="st-ground"></b></div>
    <div class="st-qbox"><p class="st-q"></p><div class="st-opts"></div><p class="st-bmsg"></p><div class="hz-dots"></div></div>`;
  const show = () => {
    const it = BUILD_Q[i];
    box.querySelector('.st-q').textContent = it.q;
    box.querySelector('.st-opts').innerHTML = it.opts.map((o) => `<button type="button" class="st-o" data-o="${o}">${o}</button>`).join('');
    box.querySelector('.st-bmsg').textContent = '';
    box.querySelector('.hz-dots').innerHTML = BUILD_Q.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'cur' : ''}"></i>`).join('');
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      i = 0;
      box.querySelectorAll('.st-layer').forEach((l) => l.classList.remove('on'));
      box.classList.remove('done');
      show();
      return;
    }
    const b = e.target.closest('.st-o');
    if (!b || busy) return;
    const it = BUILD_Q[i];
    if (b.dataset.o !== it.ans) { shake(b); box.querySelector('.st-bmsg').textContent = '沙子滑下来了，再看看。'; return; }
    busy = true;
    b.classList.add('right');
    box.querySelectorAll('.st-layer')[i].classList.add('on');
    box.querySelector('.st-bmsg').textContent = `垒高一层！${it.q.replace('（　）', it.ans)}`;
    i += 1;
    setTimeout(() => {
      if (i < BUILD_Q.length) { show(); return; }
      box.classList.add('done');
      box.querySelector('.st-q').textContent = '城堡垒好啦！';
      box.querySelector('.st-opts').innerHTML = '<button type="button" class="btn solid" data-again>推倒重来</button>';
    }, BUILD_NEXT_MS);
  });
  show();
}
initBuild(document.getElementById('stBuild'));

Hanzi.init({
  cards: [
    { z: '堡', py: 'bǎo', words: [['城堡', 'chéng bǎo'], ['堡垒', 'bǎo lěi']] },
    { z: '插', py: 'chā', words: [['插上', 'chā shàng'], ['插花', 'chā huā']] },
    { z: '凶', py: 'xiōng', words: [['凶狠', 'xiōng hěn'], ['凶恶', 'xiōng è']] },
    { z: '狠', py: 'hěn', words: [['凶狠', 'xiōng hěn']] },
    { z: '补', py: 'bǔ', words: [['补充', 'bǔ chōng'], ['修补', 'xiū bǔ']] },
    { z: '充', py: 'chōng', words: [['补充', 'bǔ chōng'], ['充满', 'chōng mǎn']] },
    { z: '攻', py: 'gōng', words: [['攻打', 'gōng dǎ'], ['进攻', 'jìn gōng']] },
    { z: '商', py: 'shāng', words: [['商量', 'shāng liang'], ['商店', 'shāng diàn']] },
    { z: '量', py: 'liáng', words: [['商量', 'shāng liang'], ['量一量', 'liáng yi liáng']] },
    { z: '驾', py: 'jià', words: [['驾驶', 'jià shǐ'], ['驾车', 'jià chē']] },
    { z: '轰', py: 'hōng', words: [['轰炸', 'hōng zhà'], ['轰塌', 'hōng tā']] },
    { z: '驳', py: 'bó', words: [['反驳', 'fǎn bó']] },
    { z: '药', py: 'yào', words: [['火药', 'huǒ yào'], ['吃药', 'chī yào']] },
    { z: '赞', py: 'zàn', words: [['赞赏', 'zàn shǎng'], ['赞美', 'zàn měi']] },
    { z: '合', py: 'hé', words: [['合力', 'hé lì'], ['合作', 'hé zuò']] },
    { z: '记', py: 'jì', words: [['忘记', 'wàng jì'], ['日记', 'rì jì']] },
  ],
  write: {
    a: [
      { z: '周', py: 'zhōu', bh: 8 },
      { z: '围', py: 'wéi', bs: '囗', bh: 7 },
      { z: '句', py: 'jù', bh: 5 },
      { z: '补', py: 'bǔ', bs: '衤', bh: 7 },
      { z: '充', py: 'chōng', bh: 6 },
    ],
    b: [
      { z: '药', py: 'yào', bs: '艹', bh: 9 },
      { z: '合', py: 'hé', bh: 6 },
      { z: '死', py: 'sǐ', bs: '歹', bh: 6 },
      { z: '记', py: 'jì', bs: '讠', bh: 5 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
