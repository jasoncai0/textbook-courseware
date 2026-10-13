'use strict';
/* 天窗 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：换天气看房子（为什么开天窗）、看到→想象滑块（十倍百倍）、从“无”中看出“有”。
 */

/* 课后第 1 题：换天气看房子 */
const WEATHER = {
  sun: '暖和的晴天：木板窗扇扇打开，光线和空气都有了。',
  rain: '大风大雨：木板窗只好关起来，屋子里黑得像地洞似的。',
  snow: '北风呼呼叫的冬天：木板窗也关起来，屋里又黑了。',
};
const DROPS = 40;
function initHouse() {
  const svg = document.getElementById('house');
  const msg = document.getElementById('hsMsg');
  svg.querySelector('.hs-rain').innerHTML = Array.from({ length: DROPS }, (_, i) => {
    const x = (i * 97) % 800;
    const y = (i * 53) % 380;
    return `<path d="M${x} ${y} l-8 22"/>`;
  }).join('');
  svg.querySelector('.hs-snow').innerHTML = Array.from({ length: DROPS }, (_, i) => `<circle cx="${(i * 89) % 800}" cy="${(i * 61) % 390}" r="${3 + (i % 3)}"/>`).join('');
  let weather = 'sun';
  const paint = () => {
    const sky = svg.classList.contains('sky-on');
    svg.setAttribute('class', `w-${weather}${sky ? ' sky-on' : ''}`);
    msg.textContent = sky && weather !== 'sun' ? '开了天窗，光从屋顶照进来了！' : WEATHER[weather];
  };
  document.getElementById('hsBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-w]');
    if (!b) return;
    weather = b.dataset.w;
    document.querySelectorAll('#hsBtns .btn').forEach((x) => x.classList.toggle('solid', x === b));
    paint();
  });
  document.getElementById('hsSky').addEventListener('click', (e) => {
    const on = !svg.classList.contains('sky-on');
    svg.classList.toggle('sky-on', on);
    e.currentTarget.classList.toggle('solid', on);
    paint();
  });
  paint();
}

/* 课后第 3 题：看到的 → 想象到的 */
const ZOOM_CAPS = [
  [0, '看到的：雨脚在那里卜落卜落跳，带子似的闪电一瞥。'],
  [40, '想象到：这雨，这风，这雷，这电……'],
  [80, '怎样猛厉地扫荡了这世界——威力比在露天真实感到的要大十倍百倍！'],
];
function initZoom() {
  const range = document.getElementById('zoomRange');
  const b = document.getElementById('zoomB');
  const x = document.getElementById('zoomX');
  const cap = document.getElementById('zoomCap');
  const update = () => {
    const v = +range.value;
    b.style.opacity = v / 100;
    x.textContent = v < 40 ? '×1' : v < 80 ? '×10' : '×100';
    cap.textContent = ZOOM_CAPS.filter(([at]) => v >= at).pop()[1];
  };
  range.addEventListener('input', update);
  update();
}

/* 课后第 3 题：从“无”中看出“有” */
const WU = {
  star: ['一粒星', '无数闪闪烁烁可爱的星'],
  cloud: ['一朵云', '无数像山似的、马似的、巨人似的奇幻的云彩'],
  shadow: ['一条黑影', '也许是灰色的蝙蝠，也许是会唱歌的夜莺，也许是霸气十足的猫头鹰'],
};
const STAR_N = 70;
function initWu() {
  const svg = document.getElementById('wuSvg');
  const res = document.getElementById('wuRes');
  let seed = 3;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  document.getElementById('wuStars').innerHTML = Array.from({ length: STAR_N }, () => {
    const x = rnd() * 800;
    const y = rnd() * 440;
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1.5 + rnd() * 3).toFixed(1)}" fill="#ffe9a0" style="animation-delay:${(rnd() * 2).toFixed(2)}s"/>`;
  }).join('');
  let pick = '';
  document.getElementById('wuBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-wu]');
    if (!b) return;
    pick = b.dataset.wu;
    document.querySelectorAll('#wuBtns .btn').forEach((x) => x.classList.toggle('solid', x === b));
    svg.setAttribute('class', `see-${pick}`);
    res.innerHTML = `<b>看到：</b>小玻璃上面的${WU[pick][0]}`;
  });
  document.getElementById('wuGo').addEventListener('click', () => {
    if (!pick) { res.textContent = '先选一样“看到的”。'; return; }
    svg.setAttribute('class', `see-${pick} imagine`);
    res.innerHTML = `<b>看到：</b>${WU[pick][0]}　→　<b>想象到：</b>${WU[pick][1]}`;
  });
}

/* 想象练笔 */
const MOMENTS = [
  { name: '一片树叶', pic: 'xingye', prompt: '天窗上落下一片树叶，你会想象到什么？', hint: '用上“你会从……想象到……也许是……也许是……”。',
    example: '你会从天窗上落下的一片树叶，想象到外面的大树正在风里摇晃，也许是秋天来了，树叶们要去旅行了；也许是调皮的风，故意把这片叶子送来和你做伴。' },
  { name: '一道亮光', pic: 'yuye', prompt: '夜里，天窗上闪过一道亮光，你会想象到什么？', hint: '一点点光，可以想到哪些不同的东西？越多越好。',
    example: '你会从天窗上闪过的一道亮光，想象到这也许是一颗流星划过天空，也许是一架夜航的飞机眨着眼睛，也许是萤火虫打着小灯笼，正赶去参加森林里的晚会。' },
  { name: '一阵声音', pic: 'qihuan', prompt: '天窗外传来“咚咚”的声音，你会想象到什么？', hint: '声音是什么发出来的？想一想，再写下你的猜想。',
    example: '你会从天窗外“咚咚”的声音，想象到也许是松鼠在屋顶上搬松果，也许是一只迷路的小猫在找妈妈，也许是月亮上的嫦娥在轻轻敲门，问你睡着了没有。' },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initHouse();
    initZoom();
    initWu();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
