'use strict';
/* 难忘的泼水节 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：封面敲象脚鼓（声音导入）、花瓣地毯 + 花炮、点画面泼水、服饰卡（不画人物）、四样道具收集说一说、祝福句子机、泼水识字游戏
 * 安全：不画具体真实人物；周总理只用文字和服饰卡呈现 */

Hanzi.init({
  cards: [
    { z: '泼', py: 'pō', bs: '氵', bh: 8, words: [['泼水节', 'pō shuǐ jié'], ['泼洒', 'pō sǎ']] },
    { z: '族', py: 'zú', bs: '方', bh: 11, words: [['傣族', 'dǎi zú'], ['民族', 'mín zú']] },
    { z: '民', py: 'mín', bs: '乙', bh: 5, words: [['人民', 'rén mín'], ['农民', 'nóng mín']] },
    { z: '度', py: 'dù', bs: '广', bh: 9, words: [['一年一度', 'yì nián yí dù'], ['温度', 'wēn dù']] },
    { z: '敲', py: 'qiāo', bs: '攴', bh: 14, words: [['敲鼓', 'qiāo gǔ'], ['敲门', 'qiāo mén']] },
    { z: '铺', py: 'pū', bs: '钅', bh: 12, words: [['铺上', 'pū shàng'], ['铺成', 'pū chéng']] },
    { z: '龙', py: 'lóng', bs: '龙', bh: 5, words: [['龙船', 'lóng chuán'], ['龙舟', 'lóng zhōu']] },
    { z: '驶', py: 'shǐ', bs: '马', bh: 8, words: [['驶过', 'shǐ guò'], ['行驶', 'xíng shǐ']] },
    { z: '容', py: 'róng', bs: '宀', bh: 10, words: [['笑容', 'xiào róng'], ['笑容满面', 'xiào róng mǎn miàn']] },
    { z: '踩', py: 'cǎi', bs: '足', bh: 15, words: [['踩着', 'cǎi zhe']] },
    { z: '盛', py: 'chéng', bs: '皿', bh: 11, words: [['盛满', 'chéng mǎn'], ['盛饭', 'chéng fàn']] },
    { z: '碗', py: 'wǎn', bs: '石', bh: 13, words: [['银碗', 'yín wǎn'], ['饭碗', 'fàn wǎn']] },
    { z: '祝', py: 'zhù', bs: '礻', bh: 9, words: [['祝福', 'zhù fú'], ['祝贺', 'zhù hè']] },
    { z: '福', py: 'fú', bs: '礻', bh: 13, words: [['祝福', 'zhù fú'], ['幸福', 'xìng fú']] },
    { z: '健', py: 'jiàn', bs: '亻', bh: 10, words: [['健康', 'jiàn kāng']] },
    { z: '康', py: 'kāng', bs: '广', bh: 11, words: [['健康', 'jiàn kāng']] },
    { z: '寿', py: 'shòu', bs: '寸', bh: 7, words: [['长寿', 'cháng shòu']] },
  ],
  write: [
    { z: '忘', py: 'wàng', bs: '心', bh: 7 },
    { z: '泼', py: 'pō', bs: '氵', bh: 8 },
    { z: '度', py: 'dù', bs: '广', bh: 9 },
    { z: '龙', py: 'lóng', bs: '龙', bh: 5 },
    { z: '炮', py: 'pào', bs: '火', bh: 9 },
    { z: '穿', py: 'chuān', bs: '穴', bh: 9 },
    { z: '始', py: 'shǐ', bs: '女', bh: 8 },
    { z: '令', py: 'lìng', bs: '人', bh: 5 },
  ],
});

/* ---------- 象脚鼓：简笔 SVG + 敲一下“咚”（Web Audio 合成，不用音频文件） ---------- */
const DRUM_SVG = `<svg viewBox="0 0 80 160" aria-hidden="true">
  <ellipse cx="40" cy="14" rx="30" ry="9" fill="#f3e2b8" stroke="#7a3a1a" stroke-width="3"/>
  <path d="M10 14Q12 70 30 96H50Q68 70 70 14" fill="#c0392b" stroke="#7a3a1a" stroke-width="3"/>
  <path d="M14 40H66M20 64H60" stroke="#f1c40f" stroke-width="4"/>
  <path d="M30 96Q26 130 16 150H64Q54 130 50 96Z" fill="#8e5a2b" stroke="#5a3214" stroke-width="3"/>
  <path d="M14 150H66" stroke="#5a3214" stroke-width="5" stroke-linecap="round"/>
</svg>`;
document.querySelectorAll('[data-drum]').forEach((el) => { el.innerHTML = DRUM_SVG; });
let audio = null;
function thump() {
  try {
    audio = audio || new AudioContext();
    const t = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(48, t + 0.35);
    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + 0.55);
  } catch (e) { /* 浏览器不支持声音时，只有动画 */ }
}
function initDrum() {
  document.querySelectorAll('.ps-drum').forEach((b) => b.addEventListener('click', () => {
    thump();
    b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit');
    b.closest('.slide').querySelector('.ps-petals')?.classList.add('burst');
  }));
}

/* ---------- 点画面泼水 ---------- */
const DROPS_PER_SPLASH = 12;
const SPLASH_MS = 900;
function splashAt(box, x, y) {
  const html = Array.from({ length: DROPS_PER_SPLASH }, (_, i) => {
    const a = (i / DROPS_PER_SPLASH) * Math.PI * 2;
    const d = 3 + Math.random() * 3;
    return `<i style="left:${x}px;top:${y}px;--dx:${(Math.cos(a) * d).toFixed(2)}em;--dy:${(Math.sin(a) * d - 1.5).toFixed(2)}em"></i>`;
  }).join('');
  const g = document.createElement('div');
  g.className = 'ps-drop-g';
  g.innerHTML = html;
  box.appendChild(g);
  setTimeout(() => g.remove(), SPLASH_MS);
}
function initSplash() {
  const box = document.getElementById('psSplash');
  box.addEventListener('pointerdown', (e) => {
    const r = box.getBoundingClientRect();
    splashAt(box, e.clientX - r.left, e.clientY - r.top);
  });
}

/* ---------- 道具收集 ---------- */
const PROPS = [
  { k: '象脚鼓', py: 'xiàng jiǎo gǔ', icon: 'drum', s: ['他接过一只象脚鼓，敲着欢乐的鼓点', 'tā jiē guò yì zhī xiàng jiǎo gǔ qiāo zhe huān lè de gǔ diǎn'] },
  { k: '凤凰花', py: 'fèng huáng huā', icon: 'flower', s: ['踩着凤凰花铺成的“地毯”，同傣族人民一起跳舞', 'cǎi zhe fèng huáng huā pū chéng de dì tǎn tóng dǎi zú rén mín yì qǐ tiào wǔ'] },
  { k: '银碗', py: 'yín wǎn', icon: 'bowl', s: ['周总理一手端着盛满清水的银碗', 'zhōu zǒng lǐ yì shǒu duān zhe chéng mǎn qīng shuǐ de yín wǎn'] },
  { k: '柏树枝', py: 'bǎi shù zhī', icon: 'branch', s: ['一手拿着柏树枝蘸了水，向人们泼洒，为人们祝福', 'yì shǒu ná zhe bǎi shù zhī zhàn le shuǐ xiàng rén men pō sǎ wèi rén men zhù fú'] },
];
const ICONS = {
  drum: DRUM_SVG,
  flower: '<svg viewBox="0 0 80 80" aria-hidden="true">' + [0, 72, 144, 216, 288].map((a) => `<ellipse cx="40" cy="22" rx="11" ry="18" fill="#e74c3c" transform="rotate(${a} 40 40)"/>`).join('') + '<circle cx="40" cy="40" r="8" fill="#f1c40f"/></svg>',
  bowl: '<svg viewBox="0 0 80 60" aria-hidden="true"><path d="M6 20H74Q70 52 40 54Q10 52 6 20Z" fill="#d6dbe0" stroke="#8a939d" stroke-width="3"/><ellipse cx="40" cy="20" rx="34" ry="7" fill="#9fd3f0" stroke="#8a939d" stroke-width="3"/></svg>',
  branch: '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M10 72L68 10" stroke="#6d4c2a" stroke-width="4"/>' + [[24, 54], [34, 44], [44, 34], [54, 24], [30, 60], [42, 48], [52, 38]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="4" fill="#2e8b57" transform="rotate(${i % 2 ? 40 : -50} ${x} ${y})"/>`).join('') + '</svg>',
};
function initProps() {
  const box = document.getElementById('psProps');
  box.innerHTML = PROPS.map((p, i) => `<button type="button" class="ps-prop" data-i="${i}">
      <span class="ps-prop-front">${ICONS[p.icon]}<b class="py">${Hanzi.ruby(p.k, p.py)}</b></span>
      <span class="ps-prop-back py">${Hanzi.ruby(...p.s)}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.ps-prop');
    if (!b) return;
    b.classList.toggle('open');
    if (box.querySelectorAll('.ps-prop.open').length === PROPS.length) box.classList.add('all');
  });
}

/* ---------- 祝福句子机 ---------- */
const WHO = [['爸爸妈妈', 'bà ba mā ma'], ['爷爷奶奶', 'yé ye nǎi nai'], ['老师', 'lǎo shī'], ['好朋友', 'hǎo péng you']];
const WISH = [['健康长寿', 'jiàn kāng cháng shòu'], ['天天开心', 'tiān tiān kāi xīn'], ['学习进步', 'xué xí jìn bù'], ['幸福快乐', 'xìng fú kuài lè']];
function initWish() {
  const box = document.getElementById('psWish');
  const chips = (list, k) => list.map(([t, p], i) => `<button type="button" class="ps-chip py" data-${k}="${i}">${Hanzi.ruby(t, p)}</button>`).join('');
  box.innerHTML = `<div class="ps-wishrow"><b>祝福谁？</b>${chips(WHO, 'w')}</div>
    <div class="ps-wishrow"><b>祝福什么？</b>${chips(WISH, 'h')}</div>
    <p class="ps-wishout py" id="psWishOut"></p>`;
  const out = box.querySelector('#psWishOut');
  let w = 0;
  let h = 0;
  const show = () => {
    box.querySelectorAll('[data-w]').forEach((b) => b.classList.toggle('on', +b.dataset.w === w));
    box.querySelectorAll('[data-h]').forEach((b) => b.classList.toggle('on', +b.dataset.h === h));
    out.innerHTML = Hanzi.ruby(`我端着清清的水，向${WHO[w][0]}泼洒，祝福${WHO[w][0]}${WISH[h][0]}！`,
      `wǒ duān zhe qīng qīng de shuǐ xiàng ${WHO[w][1]} pō sǎ zhù fú ${WHO[w][1]} ${WISH[h][1]}`);
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.ps-chip');
    if (!b) return;
    if (b.dataset.w !== undefined) w = +b.dataset.w; else h = +b.dataset.h;
    show();
    splashAt(out, out.clientWidth * 0.9, out.clientHeight * 0.4);
  });
  show();
}

/* ---------- 识字游戏：泼水送祝福 ---------- */
const BALLS = [['泼', 'pō'], ['族', 'zú'], ['民', 'mín'], ['度', 'dù'], ['敲', 'qiāo'], ['铺', 'pū'], ['龙', 'lóng'], ['驶', 'shǐ'], ['容', 'róng'], ['踩', 'cǎi'], ['盛', 'chéng'], ['碗', 'wǎn'], ['祝', 'zhù'], ['福', 'fú'], ['健', 'jiàn'], ['康', 'kāng'], ['寿', 'shòu']];
function initDrops() {
  const box = document.getElementById('psDrops');
  box.innerHTML = `<div class="ps-balls">${BALLS.map(([z, p], i) => `<button type="button" class="ps-ball" data-i="${i}">${Hanzi.ruby(z, p)}</button>`).join('')}</div>
    <p class="ps-dropmsg" id="psDropMsg"></p><button type="button" class="btn ps-dropreset">再玩一次</button>`;
  const msg = box.querySelector('#psDropMsg');
  const update = () => {
    const n = box.querySelectorAll('.ps-ball.pop').length;
    msg.textContent = n === BALLS.length ? '祝福你健康长寿！' : `泼了 ${n} 下`;
    box.classList.toggle('done', n === BALLS.length);
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('.ps-dropreset')) { box.querySelectorAll('.ps-ball').forEach((b) => b.classList.remove('pop')); update(); return; }
    const b = e.target.closest('.ps-ball:not(.pop)');
    if (!b) return;
    b.classList.add('pop');
    const r = box.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    splashAt(box, br.left - r.left + br.width / 2, br.top - r.top + br.height / 2);
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initDrum();
    initSplash();
    initProps();
    initWish();
    initDrops();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
