'use strict';
/* 乌鸦喝水 · 本课数据与本课互动。记叙文故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 放石子：点一颗石子，它落进瓶子，水升高一截；放满 8 颗乌鸦就喝着水了 =================
 * SVG 600 × 400：瓶口在 y=70，开始水面 y=330，放满后 y=80（乌鸦低头够得着）。 */
const PEBBLES = 8;
const WATER_FROM = 330;
const WATER_TO = 80;
const BOTTLE = 'M270 70V118C270 142 200 150 200 222V360C200 374 210 380 224 380H376C390 380 400 374 400 360V222C400 150 330 142 330 118V70Z';
const IN_BOTTLE = [[232, 364], [272, 368], [312, 366], [352, 364], [380, 352], [250, 344], [292, 346], [334, 344]]; // 石子落到瓶底的位置
const ON_GROUND = [[450, 372], [492, 376], [534, 372], [574, 370], [470, 350], [512, 352], [552, 348], [492, 328]]; // 地上的石子堆

function buildCrow(box) {
  box.innerHTML = `<svg class="wy-svg" viewBox="0 0 600 400" aria-label="乌鸦把小石子放进瓶子">
    <defs><clipPath id="wyIn"><path d="${BOTTLE}"/></clipPath></defs>
    <path d="M0 384H600" class="wy-ground"/>
    <g clip-path="url(#wyIn)">
      <rect class="wy-water" x="190" width="220" y="${WATER_FROM}" height="${400 - WATER_FROM}"/>
    </g>
    <path d="${BOTTLE}" class="wy-bottle"/>
    <path d="M262 70H338" class="wy-rim"/>
    <path d="M190 ${WATER_TO + 6}H410" class="wy-reach"/>
    <text x="414" y="${WATER_TO + 12}" class="wy-reach-t">水到这儿，乌鸦就够得着了</text>
    ${ON_GROUND.map(([x, y], i) => {
      const [tx, ty] = IN_BOTTLE[i];
      return `<ellipse class="wy-pebble" data-i="${i}" cx="${x}" cy="${y}" rx="17" ry="12" style="--mx:${300 - x}px;--my:${30 - y}px;--dx:${tx - x}px;--dy:${ty - y}px"/>`;
    }).join('')}
    <g class="wy-crow">
      <path d="M150 64L112 52L118 80Z" class="wy-black"/>
      <ellipse cx="190" cy="68" rx="46" ry="27" class="wy-black"/>
      <path d="M168 62Q188 26 216 56Q196 72 168 62Z" class="wy-wing"/>
      <g class="wy-head">
        <circle cx="236" cy="44" r="19" class="wy-black"/>
        <path d="M252 40L292 58L250 52Z" class="wy-beak"/>
        <circle cx="240" cy="38" r="5" fill="#fff"/><circle cx="241" cy="38" r="2.5" fill="#222"/>
      </g>
    </g>
  </svg>
  <div class="wy-bar"><span class="wy-msg">点一点地上的小石子，把它放进瓶子里。</span><b class="wy-n">0 / ${PEBBLES}</b><button type="button" class="btn" data-reset>再来一次</button></div>`;
  const svg = box.querySelector('svg');
  const water = svg.querySelector('.wy-water');
  const slide = box.closest('.slide');
  let n = 0;
  const show = () => {
    const y = WATER_FROM - (WATER_FROM - WATER_TO) * (n / PEBBLES);
    water.style.y = `${y}px`;
    water.style.height = `${400 - y}px`;
    box.querySelector('.wy-n').textContent = `${n} / ${PEBBLES}`;
    const full = n === PEBBLES;
    svg.classList.toggle('drink', full);
    slide.querySelector('[data-stage="4"] small').classList.toggle('on', n > 0);
    slide.querySelector('[data-stage="5"] small').classList.toggle('on', full);
    box.querySelector('.wy-msg').textContent = full ? '瓶子里的水渐渐升高，乌鸦喝着水了！' : n ? '水升高了一点儿，再放一颗！' : '点一点地上的小石子，把它放进瓶子里。';
  };
  svg.addEventListener('click', (e) => {
    const p = e.target.closest('.wy-pebble:not(.in)');
    if (!p) return;
    p.classList.add('in');
    n += 1;
    setTimeout(show, 700); // 石子落到水里再涨水
  });
  box.querySelector('[data-reset]').addEventListener('click', () => {
    svg.querySelectorAll('.wy-pebble').forEach((p) => p.classList.remove('in'));
    n = 0;
    show();
  });
  show();
}
buildCrow(document.getElementById('crow'));

/* ================= 排一排（讲故事：按先后点卡片） =================
 * 容器 <div class="order" data-order="key" data-noswipe>；数据 ORDER[key] = [{ t, py, pic | svg }]，按正确顺序写。 */
const SVG_STONES = '<svg viewBox="0 0 100 60"><ellipse cx="30" cy="44" rx="16" ry="11" fill="#9a9184"/><ellipse cx="62" cy="46" rx="14" ry="10" fill="#b5ab9c"/><ellipse cx="46" cy="28" rx="13" ry="9" fill="#857b6e"/><ellipse cx="78" cy="30" rx="11" ry="8" fill="#a39888"/></svg>';
const SVG_UP = '<svg viewBox="0 0 100 60"><path d="M30 8H70V54H30Z" fill="none" stroke="#7a5a3a" stroke-width="4"/><path d="M32 18H68V52H32Z" fill="#7cc0e8"/><path d="M84 46V12M76 22L84 12L92 22" stroke="#2f7fb8" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';
const ORDER = {
  story: [
    { pic: 'kouke', t: '一只乌鸦口渴了，到处找水喝。', py: 'yì zhī wū yā kǒu kě le dào chù zhǎo shuǐ hē' },
    { pic: 'pingzi', t: '瓶子里水不多，瓶口又小，乌鸦喝不着水。', py: 'píng zi lǐ shuǐ bù duō píng kǒu yòu xiǎo wū yā hē bù zháo shuǐ' },
    { svg: SVG_STONES, t: '乌鸦看见许多小石子，想出办法来了。', py: 'wū yā kàn jiàn xǔ duō xiǎo shí zǐ xiǎng chū bàn fǎ lái le' },
    { pic: 'heshui', t: '乌鸦把小石子一颗一颗地放进瓶子里。', py: 'wū yā bǎ xiǎo shí zǐ yì kē yì kē de fàng jìn píng zi lǐ' },
    { svg: SVG_UP, t: '水渐渐升高，乌鸦喝着水了。', py: 'shuǐ jiàn jiàn shēng gāo wū yā hē zháo shuǐ le' },
  ],
};
function initOrder(box, items) {
  const face = (it) => (it.pic ? `<div class="o-pic" data-bg="assets/${it.pic}.jpg"></div>` : `<div class="o-pic">${it.svg}</div>`);
  const shuffled = () => {
    const idx = items.map((_, i) => i).sort(() => Math.random() - 0.5);
    return idx.every((v, i) => v === i) ? [...idx.slice(1), idx[0]] : idx;
  };
  let next = 0;
  const build = () => {
    next = 0;
    box.classList.remove('done');
    box.style.setProperty('--n', items.length);
    box.innerHTML = `<div class="order-slots">${items.map((_, i) => `<div class="o-slot" data-n="${i + 1}"></div>`).join('')}</div>
      <div class="order-pool">${shuffled().map((i) => `<button type="button" class="o-card" data-i="${i}">${face(items[i])}<span class="py">${Hanzi.ruby(items[i].t, items[i].py)}</span></button>`).join('')}</div>
      <div class="order-bar"><span class="order-msg">点一点：先发生的先点。</span><button type="button" class="btn" data-reset>重新排</button></div>`;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { build(); box.querySelectorAll('[data-bg]').forEach(showBg); return; }
    const card = e.target.closest('.o-card');
    if (!card || card.classList.contains('used')) return;
    card.classList.remove('wrong');
    if (+card.dataset.i !== next) {
      void card.offsetWidth; // 重新触发抖动动画
      card.classList.add('wrong');
      box.querySelector('.order-msg').textContent = '再想想：这件事是先发生的吗？';
      return;
    }
    const slot = box.querySelectorAll('.o-slot')[next];
    slot.innerHTML = card.innerHTML;
    slot.classList.add('filled');
    card.classList.add('used');
    next += 1;
    const done = next === items.length;
    box.classList.toggle('done', done);
    box.querySelector('.order-msg').textContent = done ? '排好了！看着格子，把故事讲一讲。' : `对了！接着找第 ${next + 1} 件事。`;
  });
  build();
}
// 重新排时卡片是新生成的，图片直接显示（这时已经在当前页，不需要再按需加载）
function showBg(el) { el.style.backgroundImage = `url('${el.dataset.bg}')`; el.removeAttribute('data-bg'); }
document.querySelectorAll('[data-order]').forEach((box) => initOrder(box, ORDER[box.dataset.order]));

Hanzi.init({
  pick: {
    yi: [
      { q: '一只', py: '_ zhī', ans: 'yì', opts: ['yī', 'yí', 'yì'] },
      { q: '一个', py: '_ gè', ans: 'yí', opts: ['yī', 'yí', 'yì'] },
      { q: '一颗', py: '_ kē', ans: 'yì', opts: ['yī', 'yí', 'yì'] },
      { q: '第一', py: 'dì _', ans: 'yī', opts: ['yī', 'yí', 'yì'] },
    ],
  },
  cards: [
    { z: '乌', py: 'wū', bs: '丿', bh: 4, words: [['乌鸦', 'wū yā'], ['乌云', 'wū yún']] },
    { z: '鸦', py: 'yā', bs: '鸟', bh: 9, words: [['乌鸦', 'wū yā']] },
    { z: '处', py: 'chù', bs: '夂', bh: 5, words: [['到处', 'dào chù'], ['处处', 'chù chù']] },
    { z: '找', py: 'zhǎo', bs: '扌', bh: 7, words: [['找水', 'zhǎo shuǐ'], ['找到', 'zhǎo dào']] },
    { z: '办', py: 'bàn', bs: '力', bh: 4, words: [['办法', 'bàn fǎ'], ['怎么办', 'zěn me bàn']] },
    { z: '旁', py: 'páng', bs: '方', bh: 10, words: [['旁边', 'páng biān']] },
    { z: '许', py: 'xǔ', bs: '讠', bh: 6, words: [['许多', 'xǔ duō']] },
    { z: '法', py: 'fǎ', bs: '氵', bh: 8, words: [['办法', 'bàn fǎ'], ['方法', 'fāng fǎ']] },
    { z: '放', py: 'fàng', bs: '攵', bh: 8, words: [['放进', 'fàng jìn'], ['放学', 'fàng xué']] },
    { z: '进', py: 'jìn', bs: '辶', bh: 7, words: [['放进', 'fàng jìn'], ['进来', 'jìn lái']] },
    { z: '高', py: 'gāo', bs: '高', bh: 10, words: [['升高', 'shēng gāo'], ['高兴', 'gāo xìng']] },
  ],
  shapes: {
    石: ['M12 16H88', 'M40 16C34 46 24 70 12 88', 'M44 56H78V86H44Z'],
    出: ['M20 52V88H80V52', 'M50 46C38 46 32 30 38 18C42 10 56 8 61 16C67 26 62 44 50 46Z'],
  },
  evolve: [
    { z: '见', old: ['目', '人'], note: '上面一只大眼睛，下面一个人——人睁大眼睛，就是“看见”。' },
    { z: '石', note: '像山崖下面有一块石头。' },
    { z: '出', note: '下面像洞口，上面像一只脚——脚从洞里走出来，就是“出”。' },
  ],
  apples: [['乌', 'wū'], ['鸦', 'yā'], ['处', 'chù'], ['找', 'zhǎo'], ['办', 'bàn'], ['旁', 'páng'], ['许', 'xǔ'], ['法', 'fǎ'], ['放', 'fàng'], ['进', 'jìn'], ['高', 'gāo']],
  write: [
    { z: '只', py: 'zhī', bs: '口', bh: 5 },
    { z: '石', py: 'shí', bs: '石', bh: 5 },
    { z: '出', py: 'chū', bs: '凵', bh: 5 },
    { z: '见', py: 'jiàn', bs: '见', bh: 4 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
