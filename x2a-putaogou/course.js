'use strict';
/* 葡萄沟 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：水果月历、葡萄色板（红、白、紫、淡绿 → 五光十色）、晾房剖面（挂葡萄—热风—水分蒸发—葡萄干）、“晾葡萄干”识字 */

Hanzi.init({
  pick: {
    duo: [
      { q: '种葡萄', py: '_ pú tao', ans: 'zhòng', opts: ['zhǒng', 'zhòng'] },
      { q: '好客', py: '_ kè', ans: 'hào', opts: ['hǎo', 'hào'] },
      { q: '葡萄干', py: 'pú tao _', ans: 'gān', opts: ['gān', 'gàn'] },
      { q: '水分', py: 'shuǐ _', ans: 'fèn', opts: ['fēn', 'fèn'] },
    ],
  },
  cards: [
    { z: '沟', py: 'gōu', bs: '氵', bh: 7, words: [['葡萄沟', 'pú tao gōu'], ['山沟', 'shān gōu']] },
    { z: '产', py: 'chǎn', bs: '亠', bh: 6, words: [['出产', 'chū chǎn'], ['生产', 'shēng chǎn']] },
    { z: '份', py: 'fèn', bs: '亻', bh: 6, words: [['七月份', 'qī yuè fèn'], ['一份', 'yí fèn']] },
    { z: '枝', py: 'zhī', bs: '木', bh: 8, words: [['枝叶', 'zhī yè'], ['树枝', 'shù zhī']] },
    { z: '搭', py: 'dā', bs: '扌', bh: 12, words: [['搭起', 'dā qǐ'], ['搭积木', 'dā jī mù']] },
    { z: '淡', py: 'dàn', bs: '氵', bh: 11, words: [['淡绿', 'dàn lǜ'], ['淡淡的', 'dàn dàn de']] },
    { z: '好', py: 'hào', bs: '女', bh: 6, words: [['好客', 'hào kè'], ['爱好', 'ài hào']] },
    { z: '够', py: 'gòu', bs: '夕', bh: 11, words: [['吃个够', 'chī gè gòu'], ['足够', 'zú gòu']] },
    { z: '收', py: 'shōu', bs: '攵', bh: 6, words: [['收下来', 'shōu xià lái'], ['丰收', 'fēng shōu']] },
    { z: '城', py: 'chéng', bs: '土', bh: 9, words: [['城市', 'chéng shì'], ['长城', 'cháng chéng']] },
    { z: '市', py: 'shì', bs: '亠', bh: 5, words: [['城市', 'chéng shì'], ['超市', 'chāo shì']] },
    { z: '干', py: 'gān', bs: '干', bh: 3, words: [['葡萄干', 'pú tao gān'], ['干净', 'gān jìng']] },
    { z: '留', py: 'liú', bs: '田', bh: 10, words: [['留着', 'liú zhe'], ['留下', 'liú xià']] },
    { z: '钉', py: 'dìng', bs: '钅', bh: 7, words: [['钉着', 'dìng zhe'], ['钉扣子', 'dìng kòu zi']] },
    { z: '利', py: 'lì', bs: '刂', bh: 7, words: [['利用', 'lì yòng'], ['顺利', 'shùn lì']] },
    { z: '分', py: 'fèn', bs: '八', bh: 4, words: [['水分', 'shuǐ fèn'], ['养分', 'yǎng fèn']] },
    { z: '味', py: 'wèi', bs: '口', bh: 8, words: [['味道', 'wèi dào'], ['美味', 'měi wèi']] },
  ],
  write: [
    { z: '产', py: 'chǎn', bs: '亠', bh: 6 },
    { z: '份', py: 'fèn', bs: '亻', bh: 6 },
    { z: '坡', py: 'pō', bs: '土', bh: 8 },
    { z: '枝', py: 'zhī', bs: '木', bh: 8 },
    { z: '起', py: 'qǐ', bs: '走', bh: 10 },
    { z: '客', py: 'kè', bs: '宀', bh: 9 },
    { z: '老', py: 'lǎo', bs: '耂', bh: 6 },
    { z: '收', py: 'shōu', bs: '攵', bh: 6 },
    { z: '城', py: 'chéng', bs: '土', bh: 9 },
    { z: '市', py: 'shì', bs: '亠', bh: 5 },
  ],
});

const svgNS = (tag, attrs) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`;
/* 一串葡萄：中心 (cx, cy)，r 粒的半径，按 4-3-2-1 排成倒三角 */
function bunch(cx, cy, r, cls) {
  const rows = [4, 3, 3, 2, 1];
  let out = '';
  rows.forEach((n, j) => {
    for (let i = 0; i < n; i += 1) out += svgNS('circle', { cx: (cx + (i - (n - 1) / 2) * r * 1.8).toFixed(1), cy: (cy + j * r * 1.6).toFixed(1), r, class: cls });
  });
  return out;
}

/* ---------- 葡萄色板 ---------- */
const COLORS = ['red', 'white', 'purple', 'green'];
function initPaint() {
  const vine = document.getElementById('ptVine');
  vine.insertAdjacentHTML('beforeend', COLORS.map((c, i) => `<g class="pt-bun" data-c="${c}">${bunch(62 + i * 99, 66, 11, 'pt-gr')}</g>`).join(''));
  const wu = document.getElementById('ptWu');
  const check = () => wu.classList.toggle('show', vine.querySelectorAll('.pt-bun.on').length === COLORS.length);
  document.querySelector('.pt-pal').addEventListener('click', (e) => {
    const b = e.target.closest('.pt-c');
    if (!b) return;
    vine.querySelector(`.pt-bun[data-c="${b.dataset.c}"]`).classList.add('on');
    b.classList.add('used');
    check();
  });
  document.getElementById('ptClear').addEventListener('click', () => {
    vine.querySelectorAll('.pt-bun').forEach((g) => g.classList.remove('on'));
    document.querySelectorAll('.pt-c').forEach((b) => b.classList.remove('used'));
    check();
  });
}

/* ---------- 晾房：架子上挂葡萄 ---------- */
function initHouse() {
  const g = document.querySelector('.pt-hang');
  const xs = [120, 180, 240, 300];
  g.innerHTML = [110, 180, 250].map((y) => xs.map((x) => `<g class="pt-cl">${bunch(x, y + 14, 6, 'pt-gr2')}</g>`).join('')).join('');
}

/* ---------- 识字游戏：晾葡萄干 ---------- */
const GRAPES = [['沟', 'gōu'], ['产', 'chǎn'], ['份', 'fèn'], ['枝', 'zhī'], ['搭', 'dā'], ['淡', 'dàn'], ['好', 'hào'], ['够', 'gòu'], ['收', 'shōu'],
  ['城', 'chéng'], ['市', 'shì'], ['干', 'gān'], ['留', 'liú'], ['钉', 'dìng'], ['利', 'lì'], ['分', 'fèn'], ['味', 'wèi']];
function initGame() {
  const basket = document.getElementById('ptBasket');
  const rack = document.getElementById('ptRack');
  const msg = document.getElementById('ptRMsg');
  const build = () => {
    rack.classList.remove('dry');
    rack.querySelectorAll('.pt-gc').forEach((x) => x.remove());
    basket.innerHTML = GRAPES.map(([z, p]) => `<button type="button" class="pt-gc"><span class="py">${Hanzi.ruby(z, p)}</span></button>`).join('');
    msg.textContent = '挂上了 0 串';
  };
  basket.addEventListener('click', (e) => {
    const b = e.target.closest('.pt-gc');
    if (!b) return;
    rack.appendChild(b);
    msg.textContent = `挂上了 ${rack.querySelectorAll('.pt-gc').length} 串`;
  });
  document.getElementById('ptDry').addEventListener('click', () => {
    const n = rack.querySelectorAll('.pt-gc').length;
    if (n < GRAPES.length) { msg.textContent = `还有 ${GRAPES.length - n} 串没挂上呢！`; return; }
    rack.classList.add('dry');
    msg.textContent = '水分蒸发掉，成了葡萄干！';
  });
  document.getElementById('ptGReset').addEventListener('click', build);
  build();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initPaint();
    initHouse();
    initGame();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
