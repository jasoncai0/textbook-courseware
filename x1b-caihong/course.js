'use strict';
/* 彩虹 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：彩虹七色逐条画出、彩虹桥变变变（水壶→雨、镜子→月亮、秋千→彩云）、×来×去动起来、搭彩虹桥识字 */

Hanzi.init({
  shapes: {
    虹: ['M10 70Q50 0 90 70', 'M10 70L4 80M10 70L18 80', 'M90 70L82 80M90 70L96 80', 'M8 62a4 4 0 1 0 0.1 0', 'M92 62a4 4 0 1 0 0.1 0'],
    合: ['M50 10L14 46', 'M50 10L86 46', 'M32 46H68', 'M26 60H74V90H26Z'],
    手: ['M50 8V92', 'M28 26Q50 20 72 26', 'M22 46Q50 40 78 46', 'M50 92Q40 90 34 82'],
  },
  cards: [
    { z: '虹', py: 'hóng', bs: '虫', bh: 9, words: [['彩虹', 'cǎi hóng'], ['虹桥', 'hóng qiáo']] },
    { z: '座', py: 'zuò', bs: '广', bh: 10, words: [['一座', 'yí zuò'], ['座位', 'zuò wèi']] },
    { z: '浇', py: 'jiāo', bs: '氵', bh: 9, words: [['浇花', 'jiāo huā'], ['浇田', 'jiāo tián']] },
    { z: '提', py: 'tí', bs: '扌', bh: 12, words: [['提着', 'tí zhe'], ['提水', 'tí shuǐ']] },
    { z: '洒', py: 'sǎ', bs: '氵', bh: 9, words: [['洒水', 'sǎ shuǐ'], ['洒下来', 'sǎ xià lái']] },
    { z: '挑', py: 'tiāo', bs: '扌', bh: 9, words: [['挑水', 'tiāo shuǐ'], ['挑选', 'tiāo xuǎn']] },
    { z: '兴', py: 'xìng', bs: '八', bh: 6, words: [['高兴', 'gāo xìng'], ['兴趣', 'xìng qù']] },
    { z: '镜', py: 'jìng', bs: '钅', bh: 16, words: [['镜子', 'jìng zi'], ['眼镜', 'yǎn jìng']] },
    { z: '拿', py: 'ná', bs: '人', bh: 10, words: [['拿着', 'ná zhe'], ['拿起', 'ná qǐ']] },
    { z: '照', py: 'zhào', bs: '灬', bh: 13, words: [['照着', 'zhào zhe'], ['照片', 'zhào piàn']] },
    { z: '千', py: 'qiān', bs: '十', bh: 3, words: [['秋千', 'qiū qiān'], ['一千', 'yì qiān']] },
    { z: '裙', py: 'qún', bs: '衤', bh: 12, words: [['裙子', 'qún zi'], ['花裙子', 'huā qún zi']] },
  ],
  evolve: [
    { z: '虹', note: '像一条弯弯的、两头都有脑袋的长虫横在天上。古人以为彩虹是天上喝水的大虫，所以“虹”是虫字旁。（帮助记字的说法）' },
    { z: '拿', old: ['合', '手'], note: '上面是“合”，下面是“手”：把手合起来抓住东西，就是“拿”。（帮助记字的说法）' },
  ],
  write: [
    { z: '那', py: 'nà', bs: '阝', bh: 6 },
    { z: '着', py: 'zhe', bs: '目', bh: 11 },
    { z: '到', py: 'dào', bs: '刂', bh: 8 },
    { z: '高', py: 'gāo', bs: '高', bh: 10 },
    { z: '兴', py: 'xìng', bs: '八', bh: 6 },
    { z: '千', py: 'qiān', bs: '十', bh: 3 },
    { z: '成', py: 'chéng', bs: '戈', bh: 6 },
  ],
});

/* ---------- 彩虹桥变变变 ---------- */
const WISHES = {
  rain: ['把水洒下来，那不就是我在下雨吗？', 'bǎ shuǐ sǎ xià lái nà bú jiù shì wǒ zài xià yǔ ma'],
  moon: ['天上不就多了一个月亮吗？', 'tiān shàng bú jiù duō le yí gè yuè liang ma'],
  swing: ['花裙子飘啊飘的，不就成了一朵彩云吗？', 'huā qún zi piāo a piāo de bú jiù chéng le yì duǒ cǎi yún ma'],
};
function initWish() {
  const wish = document.getElementById('wish');
  const say = document.getElementById('wishSay');
  wish.querySelector('.ch-side').addEventListener('click', (e) => {
    const b = e.target.closest('.ch-pick');
    if (!b) return;
    const w = b.dataset.w;
    wish.classList.add(w);
    b.classList.add('on');
    say.innerHTML = Hanzi.ruby(...WISHES[w]);
    say.classList.remove('pop'); void say.offsetWidth; say.classList.add('pop');
  });
}

/* ---------- ×来×去 ---------- */
const VERBS = [
  ['荡', 'dàng', 'swing', true], ['飘', 'piāo', 'float', true], ['游', 'yóu', 'swim', true], ['跑', 'pǎo', 'run', true],
  ['飞', 'fēi', 'fly', false], ['跳', 'tiào', 'hop', false], ['走', 'zǒu', 'walk', false], ['滚', 'gǔn', 'roll', false],
];
const SPRITES = {
  swing: '<svg viewBox="0 0 80 100"><path d="M24 0V70M56 0V70" stroke="#b07a3a" stroke-width="3"/><rect x="16" y="68" width="48" height="7" rx="3" fill="#8a5a2a"/><circle cx="40" cy="44" r="10" fill="#f6dcc0"/><path d="M28 68L40 52L52 68Z" fill="#f48fb1"/></svg>',
  float: '<svg viewBox="0 0 80 60"><path d="M10 40Q30 0 70 10Q60 50 10 40Z" fill="#f6b33c"/><path d="M14 38Q40 26 66 12" stroke="#b9741c" stroke-width="2" fill="none"/></svg>',
  swim: '<svg viewBox="0 0 90 50"><path d="M10 25C24 6 54 6 70 25C54 44 24 44 10 25Z" fill="#f26b3a"/><path d="M70 25L88 10V40Z" fill="#e0532a"/><circle cx="24" cy="21" r="3.5" fill="#2b2420"/></svg>',
  run: '<svg viewBox="0 0 80 80"><ellipse cx="40" cy="50" rx="24" ry="18" fill="#fff" stroke="#bbb" stroke-width="2"/><circle cx="58" cy="34" r="12" fill="#fff" stroke="#bbb" stroke-width="2"/><path d="M54 24L50 2M62 24L66 4" stroke="#f3a6b4" stroke-width="6" stroke-linecap="round"/><circle cx="62" cy="32" r="2" fill="#c0392b"/></svg>',
  fly: '<svg viewBox="0 0 90 50"><path d="M10 30Q30 4 46 28Q60 4 82 30" fill="none" stroke="#3b3a3a" stroke-width="6" stroke-linecap="round"/></svg>',
  hop: '<svg viewBox="0 0 80 70"><ellipse cx="40" cy="44" rx="30" ry="22" fill="#6abf69"/><circle cx="26" cy="22" r="10" fill="#6abf69"/><circle cx="54" cy="22" r="10" fill="#6abf69"/><circle cx="26" cy="20" r="4" fill="#2b2420"/><circle cx="54" cy="20" r="4" fill="#2b2420"/><path d="M28 50Q40 58 52 50" stroke="#2b2420" stroke-width="3" fill="none"/></svg>',
  walk: '<svg viewBox="0 0 80 90"><circle cx="40" cy="16" r="12" fill="#f6dcc0"/><path d="M40 28V60M40 60L28 86M40 60L52 86M40 38L24 52M40 38L56 52" stroke="#3e6fb0" stroke-width="7" stroke-linecap="round"/></svg>',
  roll: '<svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="30" fill="#e53935"/><path d="M5 35H65M35 5V65" stroke="#fff" stroke-width="5"/></svg>',
};
function initLaiqu() {
  const verbs = document.getElementById('verbs');
  const sprite = document.getElementById('sprite');
  const word = document.getElementById('laiquWord');
  verbs.innerHTML = VERBS.map(([z, p, , book], i) => `<button type="button" class="ch-verb${book ? ' book' : ''}" data-i="${i}">${Hanzi.ruby(z, p)}</button>`).join('');
  const show = (i) => {
    const [z, p, kind] = VERBS[i];
    verbs.querySelectorAll('.ch-verb').forEach((b) => b.classList.toggle('on', +b.dataset.i === i));
    sprite.className = `ch-sprite ${kind}`;
    sprite.innerHTML = SPRITES[kind];
    word.innerHTML = Hanzi.ruby(`${z}来${z}去`, `${p} lái ${p} qù`);
  };
  verbs.addEventListener('click', (e) => {
    const b = e.target.closest('.ch-verb');
    if (b) show(+b.dataset.i);
  });
  show(0);
}

/* ---------- 搭彩虹桥 ---------- */
const CLOUDS = [['虹', 'hóng'], ['座', 'zuò'], ['浇', 'jiāo'], ['提', 'tí'], ['洒', 'sǎ'], ['挑', 'tiāo'], ['兴', 'xìng'], ['镜', 'jìng'], ['拿', 'ná'], ['照', 'zhào'], ['千', 'qiān'], ['裙', 'qún']];
function initBuild() {
  const clouds = document.getElementById('clouds');
  const bow = document.getElementById('buildBow');
  const msg = document.getElementById('buildMsg');
  const tip = msg.textContent;
  clouds.innerHTML = CLOUDS.map(([z, p], i) => `<button type="button" class="ch-cloudbtn" style="--i:${i}">${Hanzi.ruby(z, p)}</button>`).join('');
  const update = () => {
    const n = clouds.querySelectorAll('.done').length;
    bow.style.setProperty('--p', n / CLOUDS.length);
    msg.textContent = n === CLOUDS.length ? '彩虹桥搭好啦！我们一起走上去吧！' : (n ? `已经读对 ${n} 个字，彩虹桥长高了！` : tip);
    msg.classList.toggle('win', n === CLOUDS.length);
  };
  clouds.addEventListener('click', (e) => {
    const c = e.target.closest('.ch-cloudbtn:not(.done)');
    if (!c) return;
    c.classList.add('done');
    update();
  });
  document.getElementById('buildReset').addEventListener('click', () => {
    clouds.querySelectorAll('.done').forEach((c) => c.classList.remove('done'));
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initWish();
    initLaiqu();
    initBuild();
    const long = document.getElementById('longText');
    document.getElementById('pzBtn').addEventListener('click', (e) => e.currentTarget.classList.toggle('solid', long.classList.toggle('show-pz')));
    document.getElementById('upBtn').addEventListener('click', (e) => e.currentTarget.classList.toggle('solid', long.classList.toggle('show-up')));
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
