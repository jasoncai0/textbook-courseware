'use strict';
/* 四季 · 本课数据。故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

Hanzi.init({
  shapes: { 小: ['M50 12V82', 'M30 38L20 64', 'M70 38L80 64'] },
  cards: [
    { z: '尖', py: 'jiān', bs: '小', bh: 6, words: [['尖尖', 'jiān jiān'], ['笔尖', 'bǐ jiān']] },
    { z: '说', py: 'shuō', bs: '讠', bh: 9, words: [['他说', 'tā shuō'], ['说话', 'shuō huà']] },
    { z: '春', py: 'chūn', bs: '日', bh: 9, words: [['春天', 'chūn tiān'], ['春风', 'chūn fēng']] },
    { z: '青', py: 'qīng', bs: '青', bh: 8, words: [['青蛙', 'qīng wā'], ['青草', 'qīng cǎo']] },
    { z: '蛙', py: 'wā', bs: '虫', bh: 12, words: [['青蛙', 'qīng wā'], ['小蛙', 'xiǎo wā']] },
    { z: '夏', py: 'xià', bs: '夂', bh: 10, words: [['夏天', 'xià tiān'], ['夏日', 'xià rì']] },
    { z: '弯', py: 'wān', bs: '弓', bh: 9, words: [['弯弯', 'wān wān'], ['弯腰', 'wān yāo']] },
    { z: '皮', py: 'pí', bs: '皮', bh: 5, words: [['顽皮', 'wán pí'], ['皮球', 'pí qiú']] },
    { z: '地', py: 'de', bs: '土', bh: 6, words: [['顽皮地说', 'wán pí de shuō'], ['土地', 'tǔ dì']] },
    { z: '冬', py: 'dōng', bs: '夂', bh: 5, words: [['冬天', 'dōng tiān'], ['冬瓜', 'dōng guā']] },
  ],
  evolve: [
    { z: '尖', old: ['小', '大'], note: '上面“小”，下面“大”：上小下大的东西，头就是尖尖的——像草芽。（帮助记字的说法）' },
    { z: '天', note: '像一个张开手脚的人，头顶上大大的——人的头顶上就是“天”。' },
  ],
  write: [
    { z: '天', py: 'tiān', bs: '一', bh: 4 },
    { z: '四', py: 'sì', bs: '囗', bh: 5 },
    { z: '是', py: 'shì', bs: '日', bh: 9 },
  ],
});

/* 识字游戏：开火车（本课用，代替摘苹果） */
const TRAIN = [['尖', 'jiān'], ['说', 'shuō'], ['春', 'chūn'], ['青', 'qīng'], ['蛙', 'wā'], ['夏', 'xià'], ['弯', 'wān'], ['皮', 'pí'], ['地', 'de'], ['冬', 'dōng']];

/* ---------- 连一连：景物 → 季节，连对了出现课文里的句子 ---------- */
const SCENES = [
  { id: 'chun', thing: ['草芽尖尖', 'cǎo yá jiān jiān'], pic: ['chun', '50% 75%', 'cover'], say: ['草芽尖尖，他对小鸟说：“我是春天。”', 'cǎo yá jiān jiān tā duì xiǎo niǎo shuō wǒ shì chūn tiān'] },
  { id: 'xia', thing: ['荷叶圆圆', 'hé yè yuán yuán'], pic: ['xia', '50% 55%', 'cover'], say: ['荷叶圆圆，他对青蛙说：“我是夏天。”', 'hé yè yuán yuán tā duì qīng wā shuō wǒ shì xià tiān'] },
  { id: 'qiu', thing: ['谷穗弯弯', 'gǔ suì wān wān'], pic: ['qiudong', '15% 45%', '200% auto'], say: ['谷穗弯弯，他鞠着躬说：“我是秋天。”', 'gǔ suì wān wān tā jū zhe gōng shuō wǒ shì qiū tiān'] },
  { id: 'dong', thing: ['雪人大肚子一挺', 'xuě rén dà dù zi yì tǐng'], pic: ['qiudong', '85% 50%', '200% auto'], say: ['雪人大肚子一挺，他顽皮地说：“我就是冬天。”', 'xuě rén dà dù zi yì tǐng tā wán pí de shuō wǒ jiù shì dōng tiān'] },
];
const SEASONS = [['dong', '冬天', 'dōng tiān'], ['chun', '春天', 'chūn tiān'], ['qiu', '秋天', 'qiū tiān'], ['xia', '夏天', 'xià tiān']];

function initLian(box, { left, right, onDone }) {
  const L = box.querySelector('.lx-l');
  const R = box.querySelector('.lx-r');
  const svg = box.querySelector('.lx-lines');
  const item = (it) => `<button type="button" class="lx-item" data-id="${it.id}">${it.html}</button>`;
  L.innerHTML = left.map(item).join('');
  R.innerHTML = right.map(item).join('');
  const done = [];
  let sel = null;
  const draw = () => {
    const b = box.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${b.width.toFixed(0)} ${b.height.toFixed(0)}`);
    svg.innerHTML = done.map((id) => {
      const a = L.querySelector(`[data-id="${id}"]`).getBoundingClientRect();
      const c = R.querySelector(`[data-id="${id}"]`).getBoundingClientRect();
      return `<line x1="${(a.right - b.left).toFixed(0)}" y1="${(a.top + a.height / 2 - b.top).toFixed(0)}" x2="${(c.left - b.left).toFixed(0)}" y2="${(c.top + c.height / 2 - b.top).toFixed(0)}"/>`;
    }).join('');
  };
  const shake = (el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); };
  box.addEventListener('click', (e) => {
    const it = e.target.closest('.lx-item:not(.done)');
    if (!it) return;
    const side = it.parentElement === L ? 'l' : 'r';
    if (!sel || sel.side === side) {
      if (sel) sel.el.classList.remove('sel');
      sel = { el: it, side };
      it.classList.add('sel');
      return;
    }
    const other = sel.el;
    other.classList.remove('sel');
    sel = null;
    if (other.dataset.id !== it.dataset.id) { shake(it); shake(other); return; }
    it.classList.add('done');
    other.classList.add('done');
    done.push(it.dataset.id);
    draw();
    onDone(it.dataset.id);
    box.classList.toggle('all-done', done.length === left.length);
  });
  new ResizeObserver(draw).observe(box);
}

function initSiji() {
  const out = document.getElementById('lxOut');
  out.innerHTML = SCENES.map((s) => `<p class="py" data-id="${s.id}">${Hanzi.ruby(...s.say)}</p>`).join('');
  initLian(document.getElementById('lx'), {
    left: SCENES.map((s) => ({ id: s.id, html: `<i class="lx-pic" data-bg="assets/${s.pic[0]}.jpg" style="background-position:${s.pic[1]};background-size:${s.pic[2]}"></i><span class="py">${Hanzi.ruby(...s.thing)}</span>` })),
    right: SEASONS.map(([id, t, p]) => ({ id, html: `<span class="py">${Hanzi.ruby(t, p)}</span>` })),
    onDone: (id) => out.querySelector(`[data-id="${id}"]`).classList.add('on'),
  });
}

/* ---------- 仿照课文说一说：每个季节两个例子 ---------- */
const SAY = {
  chun: [['桃花红红，他对蜜蜂说：“我是春天。”', 'táo huā hóng hóng tā duì mì fēng shuō wǒ shì chūn tiān'], ['柳枝绿绿，他对燕子说：“我是春天。”', 'liǔ zhī lǜ lǜ tā duì yàn zi shuō wǒ shì chūn tiān']],
  xia: [['西瓜圆圆，他对小猫说：“我是夏天。”', 'xī guā yuán yuán tā duì xiǎo māo shuō wǒ shì xià tiān'], ['荷花香香，他对蜻蜓说：“我是夏天。”', 'hé huā xiāng xiāng tā duì qīng tíng shuō wǒ shì xià tiān']],
  qiu: [['苹果红红，他对果农说：“我是秋天。”', 'píng guǒ hóng hóng tā duì guǒ nóng shuō wǒ shì qiū tiān'], ['落叶飘飘，他对松鼠说：“我是秋天。”', 'luò yè piāo piāo tā duì sōng shǔ shuō wǒ shì qiū tiān']],
  dong: [['雪花飘飘，他对小树说：“我是冬天。”', 'xuě huā piāo piāo tā duì xiǎo shù shuō wǒ shì dōng tiān'], ['北风呼呼，他对大地说：“我是冬天。”', 'běi fēng hū hū tā duì dà dì shuō wǒ shì dōng tiān']],
};

function initSay() {
  const egs = document.getElementById('sjEgs');
  document.querySelector('.sj-seasons').addEventListener('click', (e) => {
    const b = e.target.closest('[data-s]');
    if (!b) return;
    document.querySelectorAll('.sj-seasons .btn').forEach((x) => x.classList.toggle('solid', x === b));
    egs.innerHTML = SAY[b.dataset.s].map(([t, p]) => `<p class="py">${Hanzi.ruby(t, p)}</p>`).join('');
  });
}

/* ---------- 四季轮盘：每 3 步一个季节；点轮盘上的字跳到那个季节 ---------- */
const STEPS_PER_SEASON = 3;
function initTrain() {
  const box = document.getElementById('train');
  box.innerHTML = '<i class="sj-loco">🚂</i>' + TRAIN.map(([z, p]) => `<button type="button" class="sj-car">${Hanzi.ruby(z, p)}</button>`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.sj-car');
    if (c) c.classList.toggle('read');
  });
  document.getElementById('trainGo').addEventListener('click', () => box.classList.add('go'));
  document.getElementById('trainBack').addEventListener('click', () => {
    box.classList.remove('go');
    box.querySelectorAll('.sj-car').forEach((c) => c.classList.remove('read'));
  });
}

function initDial() {
  document.querySelector('.sj-dial').addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (!b) return;
    step = +b.dataset.go; // step / render 是 deck.js 的全局量：直接跳到这个季节的第一句
    render();
  });
}
function updateDial(slide, step) {
  const dial = slide.querySelector('.sj-dial');
  if (!dial) return;
  const s = Math.max(0, Math.ceil(step / STEPS_PER_SEASON) - 1);
  dial.dataset.s = s;
  dial.style.setProperty('--s', s);
}

window.LESSON = {
  init() { Narrative.init({}); initSiji(); initSay(); initDial(); initTrain(); },
  onRender: (slide, step) => { Narrative.onRender(slide, step); updateDial(slide, step); },
};
