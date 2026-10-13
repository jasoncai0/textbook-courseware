'use strict';
/* 太空生活趣事多 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 地面上 ↔ 太空中 对比卡（睡觉、走路、喝水三段，左右两格 SVG 小动画：太空格里东西都在飘）；
 *          ② 洗澡“问题—试验—结果—现在”四步图；③ 小小讲解员提词卡；④ 字长成词；⑤ 太空捞字识字游戏。
 * 航天员都是虚构的卡通小人，不画脸。 */

/* 二下课文只给生字注音：data-pyk="脱:tuō 袄:ǎo" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 卡通小人（原点在脚底，身高约 100） ================= */
const SUIT = '#f4f6fa';
const person = ({ x = 0, y = 0, rot = 0, s = 1, suit = SUIT, legs = 'stand', cls = '' } = {}) => {
  const leg = legs === 'walk'
    ? '<path class="tk-legA" d="M-6 -22L-12 0"/><path class="tk-legB" d="M6 -22L12 0"/>'
    : '<path d="M-6 -22L-6 0M6 -22L6 0"/>';
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><g class="${cls}">
    <g stroke="#3e5a8a" stroke-width="9" stroke-linecap="round" fill="none">${leg}<path d="M-14 -56L-24 -36M14 -56L24 -36"/></g>
    <rect x="-16" y="-66" width="32" height="46" rx="12" fill="${suit}" stroke="#9aa7bd" stroke-width="2"/>
    <path d="M-16 -46H16" stroke="#4a7fd0" stroke-width="5"/>
    <circle cx="0" cy="-80" r="14" fill="#f6d2b0"/><path d="M-14 -82a14 14 0 0 1 28 0z" fill="#3e5a8a"/></g></g>`;
};
const cabin = (bg = '#e9eef6') => `<rect width="340" height="240" fill="${bg}"/><circle cx="290" cy="50" r="30" fill="#0f1d3a"/><circle cx="290" cy="50" r="30" fill="none" stroke="#9aa7bd" stroke-width="6"/><circle cx="282" cy="46" r="12" fill="#4a8fd6"/><path d="M276 40q6 -4 12 2" stroke="#7cc35e" stroke-width="4" fill="none"/>`;
const room = '<rect width="340" height="240" fill="#fbf3e2"/><rect y="200" width="340" height="40" fill="#d9c09a"/>';

const SCENES = {
  'sleep-e': () => `${room}<rect x="70" y="150" width="210" height="34" rx="8" fill="#8fb6dc"/><rect x="64" y="130" width="14" height="70" fill="#a77b52"/><rect x="272" y="140" width="14" height="60" fill="#a77b52"/>
    <rect x="84" y="138" width="44" height="18" rx="8" fill="#fff"/>${person({ x: 104, y: 148, rot: -90 })}<rect x="128" y="134" width="140" height="24" rx="10" fill="#f2c94c"/>
    <text class="tk-z" x="200" y="100">Z z z</text>`,
  'sleep-s': () => `${cabin()}<rect x="120" y="30" width="80" height="170" rx="36" fill="#4a7fd0"/><path d="M118 70H202M118 160H202" stroke="#2c4f8a" stroke-width="6"/>
    <circle cx="160" cy="58" r="14" fill="#f6d2b0"/><path d="M146 56a14 14 0 0 1 28 0z" fill="#3e5a8a"/><text class="tk-z" x="214" y="40">Z z</text>
    <g class="tk-drift"><rect x="40" y="150" width="46" height="8" rx="3" fill="#e0a92e" transform="rotate(-20 63 154)"/><path d="M84 146l10 -4l-6 8z" fill="#555"/></g>
    <g class="tk-drift d2"><rect x="250" y="160" width="30" height="40" rx="3" fill="#e57b6b"/></g>`,
  'walk-e': () => `${room}${person({ x: 170, y: 200, s: 1.3, legs: 'walk', cls: 'tk-step' })}<path d="M40 214h60M230 214h60" stroke="#b39b7a" stroke-width="4"/>`,
  'walk-s': () => `${cabin()}<g fill="#f2c94c">${[40, 110, 180, 250].map((x) => `<rect x="${x}" y="70" width="44" height="10" rx="5"/><rect x="${x + 2}" y="64" width="8" height="18" rx="3"/><rect x="${x + 34}" y="64" width="8" height="18" rx="3"/>`).join('')}</g>
    <g class="tk-glide">${person({ x: 120, y: 120, rot: 75, s: 1.1 })}</g>`,
  'drink-e': () => `${room}<g transform="translate(150 70) rotate(110)"><path d="M-24 -30H24L18 30H-18Z" fill="#cfe6f6" stroke="#6a8aa8" stroke-width="3"/></g>
    <g class="tk-pour"><path d="M138 100v20" /><path d="M146 110v24"/><path d="M134 126v22"/></g><ellipse cx="140" cy="198" rx="40" ry="8" fill="#9cc8ea"/>`,
  'drink-s': () => `${cabin()}<g transform="translate(110 70) rotate(180)"><path d="M-24 -30H24L18 30H-18Z" fill="#cfe6f6" stroke="#6a8aa8" stroke-width="3"/></g>
    <circle class="tk-ball" cx="110" cy="122" r="22" fill="#7fc0ec" opacity=".85"/><circle cx="102" cy="114" r="6" fill="#fff" opacity=".7"/>
    <g transform="translate(232 150)"><rect x="-24" y="-40" width="48" height="66" rx="12" fill="#6fbf5a"/><path d="M0 -40V-80H18" stroke="#e57b6b" stroke-width="5" fill="none"/><text x="0" y="0" class="tk-lab">饮水袋</text></g>`,
  'bath-1': () => `<rect width="200" height="150" fill="#e9eef6"/><path d="M40 20h50v14" stroke="#888" stroke-width="6" fill="none"/><rect x="80" y="30" width="22" height="10" rx="3" fill="#888"/>
    ${[[60, 70], [100, 60], [130, 90], [80, 110], [150, 50], [40, 100], [120, 125]].map(([x, y], k) => `<circle class="tk-drift${k % 2 ? ' d2' : ''}" cx="${x}" cy="${y}" r="${6 + (k % 3) * 2}" fill="#7fc0ec"/>`).join('')}`,
  'bath-2': () => `<rect width="200" height="150" fill="#e9eef6"/><rect x="60" y="20" width="80" height="110" rx="20" fill="#cfe6f6" stroke="#6a8aa8" stroke-width="3"/>
    <path d="M100 40v60" stroke="#7fc0ec" stroke-width="4" stroke-dasharray="6 6" class="tk-suck"/><path d="M90 92l10 12l10 -12" fill="none" stroke="#2f6fa8" stroke-width="3"/><path d="M100 130v14H160" stroke="#555" stroke-width="5" fill="none"/>`,
  'bath-3': () => `<rect width="200" height="150" fill="#e9eef6"/><circle cx="70" cy="76" r="40" fill="#fff" stroke="#888" stroke-width="4"/><path d="M70 76V48M70 76L92 88" stroke="#d8453b" stroke-width="5" stroke-linecap="round" class="tk-clock"/>
    <text x="150" y="70" class="tk-big">好</text><text x="150" y="110" class="tk-big">累</text>`,
  'bath-4': () => `<rect width="200" height="150" fill="#e9eef6"/><rect x="50" y="40" width="100" height="70" rx="10" fill="#fff" stroke="#9aa7bd" stroke-width="3"/><path d="M60 58h80M60 76h80M60 94h60" stroke="#cfd8e6" stroke-width="4"/>
    <text x="100" y="136" class="tk-lab">免洗湿巾</text><text x="160" y="40" class="tk-big ok">✓</text>`,
};
document.querySelectorAll('[data-scene]').forEach((svg) => { svg.innerHTML = SCENES[svg.dataset.scene](); });

/* ================= 小小讲解员：点卡片出提词 ================= */
document.querySelectorAll('.tk-gc').forEach((c) => c.addEventListener('click', () => c.classList.toggle('open')));

/* ================= 识字游戏：太空捞字 ================= */
const FLOAT_Q = [
  { q: 'háng', z: '航' }, { q: 'yǔ', z: '宇' }, { q: 'zhòu', z: '宙' }, { q: 'wěn', z: '稳' },
  { q: 'cāng', z: '舱' }, { q: 'gù', z: '固' }, { q: 'mì', z: '密' }, { q: 'tǒng', z: '桶' },
];
const FLOAT_POS = [[14, 22], [38, 12], [64, 24], [86, 14], [22, 58], [48, 46], [72, 60], [90, 44]];
const ORDER = [4, 0, 6, 2, 7, 1, 5, 3]; // 题目顺序，和飘浮位置错开
function initFloat(box) {
  let n = 0;
  box.innerHTML = `<div class="tk-space">${FLOAT_Q.map((it, k) => `<button type="button" class="tk-bub" data-z="${it.z}" style="left:${FLOAT_POS[k][0]}%;top:${FLOAT_POS[k][1]}%;animation-delay:${-k * 0.9}s">${it.z}</button>`).join('')}</div>
    <div class="tk-fside"><p class="tk-q hz-latin"></p><p class="tk-msg">抓住读这个音的字！</p><div class="tk-bag"></div></div>`;
  const q = box.querySelector('.tk-q');
  const msg = box.querySelector('.tk-msg');
  const show = () => { q.textContent = FLOAT_Q[ORDER[n]].q; };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      n = 0;
      box.querySelectorAll('.tk-bub').forEach((b) => b.classList.remove('caught'));
      box.querySelector('.tk-bag').innerHTML = '';
      e.target.closest('[data-again]').remove();
      msg.textContent = '抓住读这个音的字！';
      show();
      return;
    }
    const b = e.target.closest('.tk-bub:not(.caught)');
    if (!b || n >= FLOAT_Q.length) return;
    const it = FLOAT_Q[ORDER[n]];
    if (b.dataset.z !== it.z) { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); msg.textContent = `“${b.dataset.z}”不读 ${it.q}，再找找。`; return; }
    b.classList.add('caught');
    box.querySelector('.tk-bag').insertAdjacentHTML('beforeend', `<span>${it.z}</span>`);
    n += 1;
    if (n < FLOAT_Q.length) { msg.textContent = `抓住了！${it.z}（${it.q}）`; show(); return; }
    q.textContent = '';
    msg.textContent = '8 个字都收进储物袋啦！';
    box.querySelector('.tk-fside').insertAdjacentHTML('beforeend', '<button type="button" class="btn solid" data-again>再捞一次</button>');
  });
  show();
}
const floatBox = document.getElementById('tkFloat');
if (floatBox) initFloat(floatBox);

Hanzi.init({
  cards: [
    { z: '航', py: 'háng', words: [['航天员', 'háng tiān yuán'], ['航空', 'háng kōng']] },
    { z: '宇', py: 'yǔ', words: [['宇宙', 'yǔ zhòu'], ['宇航员', 'yǔ háng yuán']] },
    { z: '宙', py: 'zhòu', words: [['宇宙飞船', 'yǔ zhòu fēi chuán']] },
    { z: '稳', py: 'wěn', words: [['安稳', 'ān wěn'], ['稳定', 'wěn dìng']] },
    { z: '固', py: 'gù', words: [['固定', 'gù dìng'], ['牢固', 'láo gù']] },
    { z: '舱', py: 'cāng', words: [['舱壁', 'cāng bì'], ['船舱', 'chuán cāng']] },
    { z: '杯', py: 'bēi', words: [['杯子', 'bēi zi'], ['水杯', 'shuǐ bēi']] },
    { z: '饮', py: 'yǐn', words: [['饮水袋', 'yǐn shuǐ dài'], ['饮料', 'yǐn liào']] },
    { z: '件', py: 'jiàn', words: [['一件事', 'yí jiàn shì'], ['零件', 'líng jiàn']] },
    { z: '题', py: 'tí', words: [['问题', 'wèn tí'], ['题目', 'tí mù']] },
    { z: '密', py: 'mì', words: [['密封', 'mì fēng'], ['秘密', 'mì mì']] },
    { z: '浴', py: 'yù', words: [['浴桶', 'yù tǒng'], ['洗浴', 'xǐ yù']] },
    { z: '桶', py: 'tǒng', words: [['浴桶', 'yù tǒng'], ['水桶', 'shuǐ tǒng']] },
  ],
  write: {
    a: [
      { z: '杯', py: 'bēi', bs: '木', bh: 8 },
      { z: '失', py: 'shī', bh: 5 },
      { z: '洗', py: 'xǐ', bs: '氵', bh: 9 },
      { z: '澡', py: 'zǎo', bs: '氵', bh: 16 },
    ],
    b: [
      { z: '容', py: 'róng', bs: '宀', bh: 10 },
      { z: '易', py: 'yì', bs: '日', bh: 8 },
      { z: '浴', py: 'yù', bs: '氵', bh: 10 },
      { z: '桶', py: 'tǒng', bs: '木', bh: 11 },
    ],
  },
});

window.LESSON = { init() { Narrative.init({}); }, onRender: (s, k) => Narrative.onRender(s, k) };
