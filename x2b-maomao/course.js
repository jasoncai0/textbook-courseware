'use strict';
/* 小毛虫 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 蜕变时间线（小毛虫 → 织茧 → 茧屋 → 飞起，动画跟着时间线变，配课文相关词句和两句提示语）；② 爬叶子识字游戏 */

/* 二下课文只给生字注音：data-pyk="趴:pā 昆:kūn" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

Hanzi.init({
  shapes: {
    糸: ['M50 8L36 26L58 34L34 52L62 60', 'M48 60V94', 'M36 76L26 90', 'M60 76L70 90'],
    方: ['M50 8V20', 'M18 24H82', 'M42 24C42 60 34 80 18 92', 'M42 46H70C72 70 66 86 54 92'],
    何: [
      'M30 26A10 10 0 1 0 30 46A10 10 0 1 0 30 26', 'M30 46C30 64 30 76 26 94', 'M30 58L14 76', 'M30 58L48 72',
      'M18 50L70 18', 'M60 14L76 30C80 36 74 42 66 38Z',
    ],
  },
  cards: [
    { z: '昆', py: 'kūn', bs: '日', bh: 8, words: [['昆虫', 'kūn chóng']] },
    { z: '怜', py: 'lián', bs: '忄', bh: 8, words: [['可怜', 'kě lián'], ['怜爱', 'lián ài']] },
    { z: '挪', py: 'nuó', bs: '扌', bh: 9, words: [['挪动', 'nuó dòng'], ['挪开', 'nuó kāi']] },
    { z: '仿', py: 'fǎng', bs: '亻', bh: 6, words: [['仿佛', 'fǎng fú'], ['模仿', 'mó fǎng']] },
    { z: '佛', py: 'fú', bs: '亻', bh: 7, words: [['仿佛', 'fǎng fú']] },
    { z: '尽', py: 'jǐn', bs: '尸', bh: 6, words: [['尽管', 'jǐn guǎn'], ['尽心', 'jìn xīn']] },
    { z: '任', py: 'rèn', bs: '亻', bh: 6, words: [['任何', 'rèn hé'], ['任务', 'rèn wu']] },
    { z: '何', py: 'hé', bs: '亻', bh: 7, words: [['任何', 'rèn hé'], ['如何', 'rú hé']] },
    { z: '纺', py: 'fǎng', bs: '纟', bh: 7, words: [['纺织', 'fǎng zhī'], ['纺纱', 'fǎng shā']] },
    { z: '竭', py: 'jié', bs: '立', bh: 14, words: [['尽心竭力', 'jìn xīn jié lì']] },
    { z: '规', py: 'guī', bs: '见', bh: 8, words: [['规律', 'guī lǜ'], ['规则', 'guī zé']] },
    { z: '律', py: 'lǜ', bs: '彳', bh: 9, words: [['规律', 'guī lǜ'], ['纪律', 'jì lǜ']] },
    { z: '待', py: 'dài', bs: '彳', bh: 9, words: [['等待', 'děng dài'], ['期待', 'qī dài']] },
    { z: '挣', py: 'zhèng', bs: '扌', bh: 9, words: [['挣脱', 'zhèng tuō']] },
    { z: '愉', py: 'yú', bs: '忄', bh: 12, words: [['愉快', 'yú kuài']] },
    { z: '绒', py: 'róng', bs: '纟', bh: 9, words: [['绒毛', 'róng máo'], ['毛绒绒', 'máo róng róng']] },
  ],
  evolve: [
    { z: '纺', old: ['糸', '方'], note: '左边“糸”像一束拧在一起的丝线，右边“方”表示读音。把丝线纺成线、织成布，就是“纺织”。' },
    { z: '何', note: '像一个人肩上扛着东西，本来是“扛”的意思；后来借来表示“什么”。“任何人”就是“什么人都”。' },
  ],
  write: [
    { z: '整', py: 'zhěng', bs: '攵', bh: 16 },
    { z: '纺', py: 'fǎng', bs: '纟', bh: 7 },
    { z: '编', py: 'biān', bs: '纟', bh: 12 },
    { z: '布', py: 'bù', bs: '巾', bh: 5 },
    { z: '抽', py: 'chōu', bs: '扌', bh: 8 },
    { z: '织', py: 'zhī', bs: '纟', bh: 8 },
    { z: '怎', py: 'zěn', bs: '心', bh: 9 },
    { z: '消', py: 'xiāo', bs: '氵', bh: 10 },
  ],
});

const STORY = {
  picks: {
    do: [
      { t: '我还不会骑车，先每天练一会儿', ok: true, why: '对！一步一步来' },
      { t: '写字慢，就认认真真一笔一画地写', ok: true, why: '对！尽心竭力' },
      { t: '同桌跑得快，我不跑了，反正跑不过', ok: false, why: '不羡慕别人，也别放弃自己' },
      { t: '种下的种子第二天没发芽，就挖出来看看', ok: false, why: '万事万物都有规律，要耐心等待' },
    ],
  },
  clueLabels: ['读一读', '意思'],
  clues: [
    { q: '生机勃勃', a: '到处都是活泼泼的生命：昆虫又唱又跳、又跑又飞。' },
    { q: '尽心竭力', a: '用上全部的心思和力气。小毛虫就是这样织茧屋的。' },
    { q: '与世隔绝', a: '和外面的世界隔开了。小毛虫在茧屋里就是这样。' },
    { q: '色彩斑斓', a: '颜色很多、很鲜艳。蝴蝶翅膀上的花纹就是这样。' },
    { q: '笨手笨脚', a: '动作很不灵巧。以前的小毛虫就是这样。' },
    { q: '九牛二虎之力', a: '九头牛、两只老虎的力气，形容非常大的力气。' },
  ],
};

/* ---------- 蜕变时间线：stage 1–4，→ 键（第 0–3 步）和点圆点都能切换 ---------- */
const STAGES = {
  1: ['挪动了一点点', '笨拙地', '既不会唱，也不会跑，更不会飞'],
  2: ['抽丝纺织', '一刻也没有迟疑', '尽心竭力', '从头到脚裹进了茧屋'],
  3: ['与世隔绝', '以后会怎样呢？', '耐心等待'],
  4: ['挣脱出来', '轻盈的翅膀', '色彩斑斓', '飘然而起'],
};
function setStage(n) {
  const art = document.getElementById('mcArt');
  if (!art) return;
  art.setAttribute('class', `mc-art st${n}`);
  document.querySelectorAll('#mcLine button').forEach((b) => b.classList.toggle('on', +b.dataset.st <= n));
  document.getElementById('mcLine').style.setProperty('--p', (n - 1) / 3);
  document.getElementById('mcWords').innerHTML = STAGES[n].map((w, i) => `<span style="--d:${i * 0.15}s">${w}</span>`).join('');
}
function initLine() {
  document.getElementById('mcLine').addEventListener('click', (e) => {
    const b = e.target.closest('[data-st]');
    if (b) setStage(+b.dataset.st);
  });
  setStage(1);
}

/* ---------- 识字游戏：爬叶子 ---------- */
const GAME = [['昆', 'kūn'], ['怜', 'lián'], ['挪', 'nuó'], ['仿', 'fǎng'], ['佛', 'fú'], ['尽', 'jǐn'], ['任', 'rèn'], ['何', 'hé'],
  ['纺', 'fǎng'], ['竭', 'jié'], ['规', 'guī'], ['律', 'lǜ'], ['待', 'dài'], ['挣', 'zhèng'], ['愉', 'yú'], ['绒', 'róng']];
function initGame() {
  const box = document.getElementById('mcLeaves');
  const msg = document.getElementById('mcGMsg');
  let at = -1;
  const draw = () => {
    at = -1;
    box.classList.remove('done');
    box.innerHTML = GAME.map(([z, p], i) => `<button type="button" class="mc-lf" data-i="${i}">${Hanzi.ruby(z, p)}</button>`).join('')
      + '<span class="mc-bug" id="mcBug">🐛</span>';
    msg.textContent = '从第一片叶子开始爬';
  };
  const moveBug = (leaf) => {
    const bug = document.getElementById('mcBug');
    bug.style.left = `${leaf.offsetLeft + leaf.offsetWidth / 2}px`;
    bug.style.top = `${leaf.offsetTop}px`;
  };
  box.addEventListener('click', (e) => {
    const lf = e.target.closest('.mc-lf');
    if (!lf) return;
    const i = +lf.dataset.i;
    if (i !== at + 1) { lf.classList.remove('wrong'); void lf.offsetWidth; lf.classList.add('wrong'); return; }
    at = i;
    lf.classList.add('ok');
    moveBug(lf);
    if (at === GAME.length - 1) {
      box.classList.add('done');
      document.getElementById('mcBug').textContent = '🦋';
      msg.innerHTML = '爬完啦！小毛虫变成蝴蝶飞走了。<button type="button" class="btn" id="mcAgain">再爬一次</button>';
    } else msg.textContent = `爬过了 ${at + 1} 片叶子`;
  });
  msg.addEventListener('click', (e) => { if (e.target.id === 'mcAgain') draw(); });
  draw();
}

window.LESSON = {
  init() {
    Narrative.init(STORY);
    initLine();
    initGame();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.id === 'mcSlide') setStage(step + 1);
  },
};
