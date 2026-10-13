'use strict';
/* 大象的耳朵 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 对话舞台（小动物轮流上台问“你的耳朵怎么啦”）；② 耳朵实验（竹竿撑起 vs 放下来一扇，前后对比）；③ 扇虫子识字游戏 */

/* 二下课文只给生字注音：data-pyk="似:shì 耷:dā" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ---------- 大象（侧面，朝右）：耳朵绕根部转动；.up 竖起（竹竿撑着），.flap 扇一下 ---------- */
const BUGS = [[40, 40], [70, 120], [300, 30], [290, 100]];
const elephantSvg = () => `<svg class="ele" viewBox="0 -30 330 330" aria-hidden="true">
  <ellipse class="ele-shadow" cx="160" cy="284" rx="140" ry="10"/>
  <path class="ele-tail" d="M44 168Q26 190 34 216"/>
  <g class="ele-legs"><rect x="58" y="206" width="30" height="74" rx="12"/><rect x="100" y="210" width="30" height="70" rx="12"/><rect x="152" y="210" width="30" height="70" rx="12"/><rect x="192" y="206" width="30" height="74" rx="12"/></g>
  <ellipse class="ele-body" cx="132" cy="180" rx="96" ry="64"/>
  <circle class="ele-head" cx="236" cy="142" r="52"/>
  <path class="ele-trunk" d="M276 166Q300 200 290 238Q286 254 302 256"/>
  <path class="ele-tusk" d="M266 180Q280 194 294 188"/>
  <circle class="ele-eye" cx="254" cy="128" r="6"/>
  <path class="ele-brow" d="M244 112L264 118"/>
  <g class="ele-poles"><path d="M188 282L196 -8"/><path d="M232 282L236 -4"/><path class="n" d="M186 200h14M190 110h14M192 30h14M228 200h14M230 110h14M232 30h14"/></g>
  <g class="ele-ear"><path class="o" d="M210 106C164 100 150 160 160 204C170 238 222 232 226 194C228 162 226 130 210 106Z"/><path class="i" d="M206 124C178 126 172 164 180 194C188 214 210 210 212 188C214 166 214 142 206 124Z"/></g>
  <g class="ele-mood"><path d="M236 70l8 -14l8 14l8 -14"/><path d="M274 84l12 -10l2 14l12 -10"/></g>
  ${BUGS.map(([x, y], i) => `<g class="ele-bugpos" style="--x:${x}px;--y:${y}px;--d:${i * 0.25}s"><g class="ele-bug"><ellipse class="w" cx="-5" cy="-6" rx="7" ry="5"/><ellipse class="w" cx="5" cy="-6" rx="7" ry="5"/><circle cx="0" cy="0" r="6"/></g></g>`).join('')}
</svg>`;
document.querySelectorAll('[data-ele]').forEach((el) => { el.innerHTML = elephantSvg(); });

Hanzi.init({
  shapes: {
    户: ['M28 14H72', 'M30 30H72V58H30', 'M30 30C30 60 26 80 16 94'],
    羽: ['M18 20Q34 18 44 26Q40 56 36 90', 'M22 40L34 46', 'M22 58L34 64', 'M56 20Q72 18 82 26Q78 56 74 90', 'M60 40L72 46', 'M60 58L72 64'],
    竹: ['M30 8V94', 'M30 20L14 34', 'M30 20L44 30', 'M70 8V94', 'M70 20L54 34', 'M70 20L86 30', 'M24 60H36', 'M64 60H76'],
    干: ['M50 30V94', 'M50 30L30 8', 'M50 30L70 8', 'M30 56H70'],
  },
  cards: [
    { z: '似', py: 'shì', bs: '亻', bh: 6, words: [['似的', 'shì de'], ['扇子似的', 'shàn zi shì de']] },
    { z: '耷', py: 'dā', bs: '耳', bh: 9, words: [['耷拉', 'dā la'], ['耷拉着', 'dā la zhe']] },
    { z: '咦', py: 'yí', bs: '口', bh: 9, words: [['咦', 'yí'], ['咦，大象啊', 'yí dà xiàng a']] },
    { z: '竖', py: 'shù', bs: '立', bh: 9, words: [['竖着', 'shù zhe'], ['竖起来', 'shù qǐ lái']] },
    { z: '竿', py: 'gān', bs: '竹', bh: 9, words: [['竹竿', 'zhú gān'], ['钓竿', 'diào gān']] },
    { z: '舞', py: 'wǔ', bs: '夕', bh: 14, words: [['跳舞', 'tiào wǔ'], ['舞蹈', 'wǔ dǎo']] },
    { z: '痛', py: 'tòng', bs: '疒', bh: 12, words: [['头痛', 'tóu tòng'], ['痛快', 'tòng kuài']] },
    { z: '烦', py: 'fán', bs: '火', bh: 10, words: [['心烦', 'xīn fán'], ['麻烦', 'má fan']] },
    { z: '扇', py: 'shān', bs: '户', bh: 10, words: [['一扇', 'yì shān'], ['扇子', 'shàn zi']] },
  ],
  evolve: [
    { z: '扇', old: ['户', '羽'], note: '上面是“户”（一扇门），下面是“羽”（羽毛）。像门一样能扇来扇去、用羽毛做的东西，就是扇子。' },
    { z: '竿', old: ['竹', '干'], note: '竹字头表示竹子，下面的“干”表示读音，也像一根长杆子。竹子做的长杆就是“竿”。' },
  ],
  write: [
    { z: '扇', py: 'shàn', bs: '户', bh: 10 },
    { z: '慢', py: 'màn', bs: '忄', bh: 14 },
    { z: '遇', py: 'yù', bs: '辶', bh: 12 },
    { z: '兔', py: 'tù', bs: '儿', bh: 8 },
    { z: '安', py: 'ān', bs: '宀', bh: 6 },
    { z: '根', py: 'gēn', bs: '木', bh: 10 },
    { z: '痛', py: 'tòng', bs: '疒', bh: 12 },
    { z: '最', py: 'zuì', bs: '曰', bh: 12 },
  ],
});

const STORY = {
  picks: {
    me: [
      { t: '同桌爱画画，我爱跳绳，我不用非得也去学画画', ok: true, why: '对！每个人喜欢的不一样' },
      { t: '我长得比别人高，有人说我高，我也开开心心的', ok: true, why: '对！自己的样子就很好' },
      { t: '别人都穿红鞋子，我也一定要买红鞋子', ok: false, why: '这是跟着别人走，忘了自己' },
      { t: '老师提醒我写字坐端正，我说“人家是人家，我是我”', ok: false, why: '好心的提醒要认真听哦' },
    ],
  },
};

/* ---------- 耳朵实验：竖起来 vs 耷拉着 ---------- */
const HINT = {
  up: '耳朵竖起来了……小虫子飞进了耳朵眼儿，还在里面跳舞！大象又头痛，又心烦。再点 ②。',
  down: '耳朵放下来，大耳朵一扇，小虫子都被赶跑了！你觉得哪样好？',
  early: '先点 ①，试试把耳朵撑起来。',
};
function initLab() {
  const box = document.getElementById('edLab');
  const svg = box.querySelector('svg');
  const hint = document.getElementById('edHint');
  const cols = document.querySelectorAll('.ed-col');
  let tried = false;
  let flapTimer = 0;
  document.querySelectorAll('[data-ear]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.ear;
    if (k === 'down' && !tried) { hint.textContent = HINT.early; return; }
    tried = true;
    clearTimeout(flapTimer);
    svg.classList.remove('up', 'down', 'flap');
    void svg.getBoundingClientRect();
    svg.classList.add(k);
    if (k === 'down') flapTimer = setTimeout(() => svg.classList.add('flap'), 700);
    document.querySelector(`.ed-col.${k}`).classList.add('on');
    document.querySelectorAll('[data-ear]').forEach((x) => x.classList.toggle('solid', x === b));
    hint.textContent = HINT[k];
  }));
  cols.forEach((c) => c.classList.remove('on'));
}

/* ---------- 排一排：大象说的三句话 ---------- */
const SAYS = [
  ['我生来就是这样啊。', ''],
  ['是不是我的耳朵真的有毛病啦？我得让我的耳朵竖起来。', ''],
  ['我还是让耳朵耷拉着吧。人家是人家，我是我。', ''],
];
function initSort() {
  const box = document.getElementById('edSort');
  const order = [2, 0, 1];
  box.innerHTML = order.map((i) => `<button type="button" class="ed-sc" data-i="${i}"><i></i><span>“${SAYS[i][0]}”</span></button>`).join('')
    + '<button type="button" class="btn ed-sreset">重排</button>';
  let next = 0;
  box.addEventListener('click', (e) => {
    if (e.target.closest('.ed-sreset')) {
      next = 0;
      box.querySelectorAll('.ed-sc').forEach((c) => { c.classList.remove('ok'); c.querySelector('i').textContent = ''; });
      box.classList.remove('done');
      return;
    }
    const c = e.target.closest('.ed-sc:not(.ok)');
    if (!c) return;
    if (+c.dataset.i !== next) { c.classList.remove('wrong'); void c.offsetWidth; c.classList.add('wrong'); return; }
    next += 1;
    c.classList.add('ok');
    c.querySelector('i').textContent = next;
    box.classList.toggle('done', next === SAYS.length);
  });
}

/* ---------- 识字游戏：扇虫子 ---------- */
const GAME = [['似', 'shì'], ['耷', 'dā'], ['咦', 'yí'], ['竖', 'shù'], ['竿', 'gān'], ['舞', 'wǔ'], ['痛', 'tòng'], ['烦', 'fán'], ['扇', 'shān'],
  ['慢', 'màn'], ['遇', 'yù'], ['兔', 'tù'], ['安', 'ān'], ['根', 'gēn'], ['最', 'zuì']];
const FLAP_MS = 800;
function initGame() {
  const bugs = document.getElementById('edBugs');
  const svg = document.querySelector('#edGameEle svg');
  const msg = document.getElementById('edGMsg');
  const draw = () => {
    bugs.innerHTML = GAME.map(([z, p], i) => `<button type="button" class="ed-gbug" style="--d:${(i % 5) * 0.3}s">${Hanzi.ruby(z, p)}</button>`).join('');
    msg.textContent = `还有 ${GAME.length} 只小虫子`;
  };
  bugs.addEventListener('click', (e) => {
    const b = e.target.closest('.ed-gbug:not(.gone)');
    if (!b) return;
    b.classList.add('gone');
    svg.classList.remove('flap');
    void svg.getBoundingClientRect();
    svg.classList.add('flap');
    setTimeout(() => svg.classList.remove('flap'), FLAP_MS);
    const left = bugs.querySelectorAll('.ed-gbug:not(.gone)').length;
    msg.innerHTML = left ? `还有 ${left} 只小虫子` : '全都赶跑啦！<button type="button" class="btn" id="edGAgain">再来一次</button>';
  });
  msg.addEventListener('click', (e) => { if (e.target.id === 'edGAgain') draw(); });
  draw();
}

window.LESSON = {
  init() {
    Narrative.init(STORY);
    initLab();
    initSort();
    initGame();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
