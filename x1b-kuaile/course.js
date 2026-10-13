'use strict';
/* 怎么都快乐 · 本课数据与本课互动。故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 人数计：几个小人 + “很好！/更好！” ================= */
const PEOPLE_COLORS = ['#ff8a65', '#4dabf7', '#ffd34d', '#6bcb77', '#c59cf2', '#ff7aa2', '#40c4b4', '#ffa94d', '#7c8cf8'];
const person = (c) => `<svg viewBox="0 0 30 50" aria-hidden="true"><circle cx="15" cy="10" r="8" fill="#ffd7b0"/><path d="M4 48V30C4 22 26 22 26 30V48Z" fill="${c}"/></svg>`;
document.querySelectorAll('.kl-count').forEach((box) => {
  const n = +box.dataset.n;
  box.insertAdjacentHTML('afterbegin', `<span class="kl-people">${PEOPLE_COLORS.slice(0, n).map((c, i) => `<i style="--d:${i * 0.12}s">${person(c)}</i>`).join('')}</span>`);
  box.insertAdjacentHTML('beforeend', `<em class="kl-stamp">${n > 5 ? '更好！' : '很好！'}</em>`);
});

/* ================= 第 3 节：两个人甩绳子，一个人跳 ================= */
document.getElementById('rope').innerHTML = `<svg viewBox="0 0 400 260" aria-label="两个人甩绳子，一个人跳">
  <path d="M0 236H400" stroke="#c9b48e" stroke-width="4"/>
  <path class="kl-rope-up" d="M70 130Q200 -10 330 130" fill="none" stroke="#c0392b" stroke-width="5"/>
  <path class="kl-rope-down" d="M70 130Q200 300 330 130" fill="none" stroke="#c0392b" stroke-width="5"/>
  <g transform="translate(40 120)">${'<circle cx="18" cy="16" r="16" fill="#ffd7b0"/><path d="M0 116V58C0 36 36 36 36 58V116Z" fill="#4dabf7"/>'}</g>
  <g transform="translate(324 120)">${'<circle cx="18" cy="16" r="16" fill="#ffd7b0"/><path d="M0 116V58C0 36 36 36 36 58V116Z" fill="#ff8a65"/>'}</g>
  <g class="kl-jumper"><g transform="translate(182 110)"><circle cx="18" cy="16" r="16" fill="#ffd7b0"/><path d="M0 116V58C0 36 36 36 36 58V116Z" fill="#ffd34d"/></g></g>
</svg>`;

/* ================= 游戏分一分：点游戏，再点人数 ================= */
const BINS = [[1, '一个人', 'yí gè rén'], [2, '两个人', 'liǎng gè rén'], [3, '三个人', 'sān gè rén'], [4, '许多人', 'xǔ duō rén']];
const GAMES = [
  ['折纸船', 'zhé zhǐ chuán', [1]], ['下象棋', 'xià xiàng qí', [2]], ['拔河', 'bá hé', [4]], ['踢毽子', 'tī jiàn zi', [1]], ['讲故事', 'jiǎng gù shi', [2, 3]],
  ['老鹰捉小鸡', 'lǎo yīng zhuō xiǎo jī', [4]], ['搭积木', 'dā jī mù', [1]], ['坐跷跷板', 'zuò qiāo qiāo bǎn', [2]], ['轮流跳绳', 'lún liú tiào shéng', [3]],
  ['听音乐', 'tīng yīn yuè', [1]], ['打羽毛球', 'dǎ yǔ máo qiú', [2]], ['踢足球', 'tī zú qiú', [4]],
];
function initSort(box) {
  box.innerHTML = `<div class="kl-tray">${GAMES.map(([g, p, ok], i) => `<button type="button" class="kl-game" data-ok="${ok.join(' ')}" data-i="${i}">${Hanzi.ruby(g, p)}</button>`).join('')}</div>
    <div class="kl-bins">${BINS.map(([n, t, p]) => `<div class="kl-bin" data-n="${n}"><div class="kl-count static" data-n="${n === 4 ? 6 : n}"></div><b>${Hanzi.ruby(t, p)}</b><div class="kl-got"></div></div>`).join('')}</div>
    <p class="kl-msg">先点一个游戏，再点几个人玩。</p>`;
  box.querySelectorAll('.kl-bin .kl-count').forEach((c) => {
    const n = +c.dataset.n;
    c.innerHTML = `<span class="kl-people">${PEOPLE_COLORS.slice(0, n).map((col) => `<i>${person(col)}</i>`).join('')}</span>`;
  });
  let sel = null;
  const msg = (t) => { box.querySelector('.kl-msg').textContent = t; };
  box.addEventListener('click', (e) => {
    const g = e.target.closest('.kl-tray .kl-game');
    if (g) { sel = g; box.querySelectorAll('.kl-tray .kl-game').forEach((x) => x.classList.toggle('sel', x === g)); return; }
    const bin = e.target.closest('.kl-bin');
    if (!bin || !sel) return;
    if (!sel.dataset.ok.split(' ').includes(bin.dataset.n)) { bin.classList.remove('wrong'); void bin.offsetWidth; bin.classList.add('wrong'); msg('想一想：课文里说几个人玩这个游戏？'); return; }
    bin.querySelector('.kl-got').appendChild(sel);
    sel.classList.remove('sel');
    sel = null;
    const done = !box.querySelector('.kl-tray .kl-game');
    box.classList.toggle('done', done);
    msg(done ? '分好啦！一个人、几个人、许多人，怎么玩都快乐！' : '对了！再分一个。');
  });
}
initSort(document.getElementById('sort'));

Hanzi.init({
  pick: {
    verb: [
      { q: '□绳', py: 'shéng', ans: '跳', opts: ['跳', '听', '下'] },
      { q: '□足球', py: 'zú qiú', ans: '踢', opts: ['打', '踢', '讲'] },
      { q: '□故事', py: 'gù shi', ans: '讲', opts: ['踢', '下', '讲'] },
      { q: '□音乐', py: 'yīn yuè', ans: '听', opts: ['听', '打', '跳'] },
      { q: '□排球', py: 'pái qiú', ans: '打', opts: ['讲', '打', '听'] },
      { q: '□游戏', py: 'yóu xì', ans: '玩', opts: ['踢', '讲', '玩'] },
    ],
  },
  cards: [
    { z: '怎', py: 'zěn', bs: '心', bh: 9, words: [['怎么', 'zěn me'], ['怎样', 'zěn yàng']] },
    { z: '独', py: 'dú', bs: '犭', bh: 9, words: [['独自', 'dú zì']] },
    { z: '跳', py: 'tiào', bs: '⻊', bh: 13, words: [['跳绳', 'tiào shéng'], ['跳高', 'tiào gāo']] },
    { z: '绳', py: 'shéng', bs: '纟', bh: 11, words: [['跳绳', 'tiào shéng'], ['绳子', 'shéng zi']] },
    { z: '讲', py: 'jiǎng', bs: '讠', bh: 6, words: [['讲故事', 'jiǎng gù shi']] },
    { z: '得', py: 'děi', bs: '彳', bh: 11, words: [['得有人听', 'děi yǒu rén tīng'], ['觉得', 'jué de']] },
    { z: '羽', py: 'yǔ', bs: '羽', bh: 6, words: [['羽毛', 'yǔ máo'], ['羽毛球', 'yǔ máo qiú']] },
    { z: '球', py: 'qiú', bs: '王', bh: 11, words: [['足球', 'zú qiú'], ['球场', 'qiú chǎng']] },
    { z: '戏', py: 'xì', bs: '又', bh: 6, words: [['游戏', 'yóu xì']] },
    { z: '排', py: 'pái', bs: '扌', bh: 11, words: [['排球', 'pái qiú'], ['排队', 'pái duì']] },
    { z: '篮', py: 'lán', bs: '⺮', bh: 16, words: [['篮球', 'lán qiú'], ['花篮', 'huā lán']] },
    { z: '连', py: 'lián', bs: '辶', bh: 7, words: [['连忙', 'lián máng'], ['接连', 'jiē lián']] },
    { z: '运', py: 'yùn', bs: '辶', bh: 7, words: [['运动会', 'yùn dòng huì']] },
  ],
  shapes: {
    羽: ['M30 92C28 62 32 32 42 8', 'M31 72L14 62', 'M32 52L15 40', 'M36 32L22 20', 'M66 92C64 62 68 32 78 8', 'M67 72L50 62', 'M68 52L51 40', 'M72 32L58 20'],
    足: ['M34 10H66V40H34Z', 'M50 40V78', 'M50 78H86', 'M50 78L22 92'],
  },
  evolve: [
    { z: '羽', note: '像两根并排的羽毛。羽毛球上就插着一圈羽毛。' },
    { z: '足', note: '上面像膝盖，下面像小腿和脚。“跳、踢、跑”都是足字旁，都要用脚。' },
  ],
  apples: [['怎', 'zěn'], ['独', 'dú'], ['跳', 'tiào'], ['绳', 'shéng'], ['讲', 'jiǎng'], ['得', 'děi'], ['羽', 'yǔ'], ['球', 'qiú'], ['戏', 'xì'], ['排', 'pái'], ['篮', 'lán'], ['连', 'lián']],
  write: [
    { z: '玩', py: 'wán', bs: '王', bh: 8 },
    { z: '很', py: 'hěn', bs: '彳', bh: 9 },
    { z: '当', py: 'dāng', bs: '⺌', bh: 6 },
    { z: '音', py: 'yīn', bs: '音', bh: 9 },
    { z: '讲', py: 'jiǎng', bs: '讠', bh: 6 },
    { z: '行', py: 'xíng', bs: '彳', bh: 6 },
    { z: '许', py: 'xǔ', bs: '讠', bh: 6 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
