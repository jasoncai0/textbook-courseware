'use strict';
/* 宇宙生命之谜 · 本课数据与互动。翻卡、选一选、写作框用 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：段落地图（问题不同，细读的段落不同）、第 2 段“拉远镜头”（地球 → 太阳系 → 银河系 → 宇宙）、温度尺刻度、星空。
 */

/* ================= 段落地图 ================= */
const PARAS = ['古代神话故事', '地球是唯一有生命的天体吗', '生命存在的四个条件', '排除太阳系其他行星', '火星和地球相似',
  '“水手 9 号”：推翻猜测', '火星上生命难以存在', '“海盗号”：着陆区无生命', '陨石上有有机分子', '仍是宇宙之谜'];
const PMAP_LEVELS = { deep: '细读', key: '找关键句', skim: '浏览' };
const PMAP_MODES = {
  q0: {
    label: '问题：地球以外有没有生命？', deep: [3, 4, 5, 6, 7, 8, 9], key: [2, 10],
    note: '和问题关系密切的第 3—9 段<b>细读</b>，必要时多读几遍；第 2、10 段<b>找出关键句</b>；第 1 段讲神话故事，<b>浏览</b>一下就可以了。',
  },
  q1: {
    label: '科学家是怎么判断其他星球有没有生命的？', deep: [3, 4, 6, 7, 8, 9], key: [5],
    note: '关注科学家的<b>方法</b>：先定条件（第 3 段），用条件逐一分析排除（第 4 段），用探测器近距离观测、拍照（第 6、7 段），着陆取样、培养（第 8 段），分析陨石（第 9 段）。',
  },
  q2: {
    label: '人类是否有可能移居火星？', deep: [3, 5, 7], key: [8],
    note: '找<b>火星的环境</b>：昼夜、四季和地球相近（第 5 段），却非常干燥、大气稀薄、温度很低、磁场很弱（第 7 段），对照生命需要的条件（第 3 段）。课文没有现成答案，<b>还要查阅更多资料</b>。',
  },
};

function initPmap(box) {
  const keys = box.dataset.modes.split(',');
  const levels = Object.entries(PMAP_LEVELS).map(([k, t]) => `<span><i class="lv-${k}"></i>${t}</span>`).join('');
  box.innerHTML = `<div class="btns pmap-btns">${keys.map((k) => `<button class="btn" type="button" data-mode="${k}">${PMAP_MODES[k].label}</button>`).join('')}</div>
    <ol class="pmap-grid">${PARAS.map((t, i) => `<li data-n="${i + 1}"><b>${i + 1}</b>${t}</li>`).join('')}</ol>
    <p class="pmap-legend">${levels}</p>
    <p class="tip gold pmap-note" hidden></p>`;
  const select = (k) => {
    const m = PMAP_MODES[k];
    box.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('solid', b.dataset.mode === k));
    box.querySelectorAll('.pmap-grid li').forEach((li) => {
      const n = +li.dataset.n;
      li.className = m.deep.includes(n) ? 'deep' : m.key.includes(n) ? 'key' : 'skim';
    });
    const note = box.querySelector('.pmap-note');
    note.innerHTML = m.note;
    note.hidden = false;
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (b) select(b.dataset.mode);
  });
  if (keys.length === 1) select(keys[0]);
}

/* ================= 星空（伪随机，位置固定） ================= */
function fillStars(svg, n, w, h) {
  svg.querySelectorAll('.far-stars').forEach((g) => {
    g.innerHTML = Array.from({ length: n }, (_, i) =>
      `<circle cx="${(i * 97) % w}" cy="${(i * 61) % h}" r="${(.5 + (i % 4) * .35).toFixed(2)}" fill="#fff" opacity="${(.25 + (i % 5) * .12).toFixed(2)}"/>`).join('');
  });
}

/* ================= 第 2 段：拉远镜头 ================= */
const SUN = [520, 240];
const GAL = [400, 220];
// 行星轨道半径（示意，不按比例），扁一点像斜着看
const ORBITS = [[.42, '#a59d94', .05], [.62, '#e3c48c', .08], [.86, '#3f7fc1', .09], [1.1, '#c9562f', .07], [1.7, '#d2a679', .2], [2.3, '#e1c48a', .17], [2.85, '#9fd6dc', .12], [3.35, '#4a6fd1', .12]];
const ORBIT_SQUASH = .45;
const EARTH_ANGLE = .25;
// 每一步的镜头：[焦点 x, 焦点 y, 缩放]
const ZOOM = [[...SUN, 58], [...SUN, 58], [...GAL, 1], [...GAL, .2], [...GAL, .2], [...GAL, .2]];
const SCALE_TIPS = [
  '从理论上说，宇宙是无限的。我们从地球出发，把镜头一点点拉远……',
  '地球只是太阳系中的一颗行星。',
  '太阳系只是银河系中一个极小的部分。',
  '银河系对宇宙来说又是沧海一粟——像大海里的一粒小米。',
  '银河系有几千亿颗恒星，肯定有与地球类似的行星 → 猜测：地球绝不是有生命存在的唯一天体。',
  '但是，人类至今尚未找到另外一颗存在生命的星球。问题还没有答案——接着往下读！',
];

// 简单的可复现伪随机，保证每次打开画面一样
function seeded(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

function buildScale(svg) {
  const [sx, sy] = SUN;
  svg.querySelector('.orbits').innerHTML = ORBITS.map(([r]) => `<ellipse cx="${sx}" cy="${sy}" rx="${r}" ry="${(r * ORBIT_SQUASH).toFixed(3)}" vector-effect="non-scaling-stroke"/>`).join('');
  svg.querySelector('.pls').innerHTML = ORBITS.map(([r, c, pr], i) => {
    const a = i === 2 ? EARTH_ANGLE : 0.6 + i * 0.9;
    return `<circle cx="${(sx + r * Math.cos(a)).toFixed(3)}" cy="${(sy + r * ORBIT_SQUASH * Math.sin(a)).toFixed(3)}" r="${pr}" fill="${c}"/>`;
  }).join('');
  // 银河系：两条旋臂上的星点
  const rnd = seeded(7);
  const dots = [];
  for (let i = 0; i < 900; i++) {
    const arm = i % 2;
    const t = rnd() * 3.4;
    const r = 8 + t * 74;
    const a = t * 1.7 + arm * Math.PI + (rnd() - .5) * .7;
    const x = GAL[0] + r * Math.cos(a) + (rnd() - .5) * 16;
    const y = GAL[1] + (r * Math.sin(a) + (rnd() - .5) * 16) * .42;
    dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(.5 + rnd() * 1.1).toFixed(2)}" fill="${rnd() < .2 ? '#f3c7e8' : '#e8ecff'}" opacity="${(.4 + rnd() * .6).toFixed(2)}"/>`);
  }
  svg.querySelector('.gal-dots').innerHTML = dots.join('');
  // 别的星系：放在银河系所在画面之外，拉远后才看得见
  const others = [];
  while (others.length < 70) {
    const x = GAL[0] + (rnd() - .5) * 4200;
    const y = GAL[1] + (rnd() - .5) * 2300;
    if (Math.abs(x - GAL[0]) < 480 && Math.abs(y - GAL[1]) < 280) continue;
    const rx = 40 + rnd() * 90;
    others.push(`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${(rx * (.25 + rnd() * .5)).toFixed(0)}" transform="rotate(${(rnd() * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})" fill="url(#galG)"/>`);
  }
  svg.querySelector('.others').innerHTML = others.join('');
}

function renderScale(slide, step) {
  const [fx, fy, s] = ZOOM[Math.min(step, ZOOM.length - 1)];
  slide.querySelector('#zoomer').style.transform = `translate(400px, 220px) scale(${s}) translate(${-fx}px, ${-fy}px)`;
  slide.dataset.zoom = step >= 3 ? 'far' : step === 2 ? 'galaxy' : 'solar';
  slide.querySelector('#scaleTip').textContent = SCALE_TIPS[Math.min(step, SCALE_TIPS.length - 1)];
}

/* ================= 第 4 段：温度尺刻度（1℃ = 0.9，0℃ 在 x=260） ================= */
const tempX = (t) => 260 + t * .9;
function buildTicks(g) {
  const ticks = [];
  for (let t = -200; t <= 500; t += 100) {
    const x = tempX(t);
    ticks.push(`<line x1="${x}" y1="330" x2="${x}" y2="338"/><text class="t-s t-c" x="${x}" y="356" stroke="none" fill="#6b5d4f">${t}℃</text>`);
  }
  g.innerHTML = ticks.join('');
}

/* ================= 翻卡、选一选、写作框 ================= */
const CLUE_LABELS = ['人们原来的猜测……', '探测器发现……'];
const CLUES = [
  { q: '1877 年，观察到火星表面有很多纵横的黑色线条，人们猜测这是火星人开挖的<b>运河</b>。', a: '“水手 9 号”的照片表明：所谓“运河”，原来是一连串的<b>暗环形山和暗的斑点</b>。' },
  { q: '火星表面的颜色随着季节而变化，有人认为这是火星表面<b>植物</b>随着季节的变化而改变了颜色。', a: '并不是植物的生长和枯萎造成的，而是<b>风把火星表面上的尘土吹来吹去</b>引起的颜色明暗变化。' },
  { q: '火星和地球昼夜长短相近，也有四季更替——火星上会不会有生命？', a: '火星非常干燥、大气稀薄、温度很低、磁场非常弱——所有这些因素都说明，在火星上<b>生命难以存在</b>。' },
  { q: '“海盗号”证明：在探测器着陆的地区，火星表面没有生命存在。那别的地方呢？', a: '科学家又提出，生命物质是否会存在于<b>火星的岩层之中</b>呢？这有待进一步研究。' },
];

const PICKS = {
  useful: [
    { t: '嫦娥奔月，仙女下凡，蟠桃盛会……', ok: false, why: '古人编的故事，没有帮助' },
    { t: '生命存在至少要有四个条件：温度、水分、大气、光和热', ok: true, why: '判断的“尺子”' },
    { t: '金星表面温度极高，不可能有生命存在', ok: true, why: '排除了金星' },
    { t: '人们一直向往着“天上的世界”', ok: false, why: '只是引出话题' },
    { t: '火星表面温度很低，磁场非常弱', ok: true, why: '火星上生命难以存在' },
    { t: '在火星的土壤中未检测到有机分子', ok: true, why: '着陆区没有生命' },
    { t: '陨石上存在有机分子', ok: true, why: '太空可能存在生命' },
  ],
};

const MOMENTS = [
  {
    name: '移居火星', pic: 'huoxing',
    prompt: '有人说“将来人类可以移居火星”。要住上去，至少要解决哪些难题？用“一是……二是……三是……”说一说。',
    hint: '联系第 7 段：干燥、大气稀薄、温度很低、磁场很弱。每一条先说关键词，再说为什么。',
    example: '人类要移居火星，至少要解决几个难题：一是水，火星非常干燥，水汽只有地球沙漠地区的 1%；二是空气，火星大气稀薄，95% 是二氧化碳，人没法呼吸；三是保暖，火星表面温度很低；四是防护，火星磁场很弱，太阳风和宇宙射线会直接轰击地面。',
  },
  {
    name: '为什么要探索宇宙', pic: 'yinhe',
    prompt: '人类为什么要花那么大力气探索宇宙？用“一是……二是……”说说你的看法。',
    hint: '可以从好奇心、科学发现、保护地球、未来生活等方面想一想。',
    example: '我认为人类探索宇宙很有必要：一是满足好奇心，“地球之外有没有生命”这样的谜，人人都想知道答案；二是能带来新的科学发现，让我们更了解地球；三是为人类的未来做准备。',
  },
  {
    name: '寻找“第二个地球”', pic: 'taiyangxi',
    prompt: '假如你是科学家，要在宇宙里寻找“第二个地球”，你会定下哪些条件？',
    hint: '可以用上课文里的条件，也可以加上你自己的想法，每一条都说说理由。',
    example: '我会定下这样几个条件：一是离它的“太阳”不远不近，温度适宜；二是有液态的水；三是有适当成分的大气，能挡住有害的射线；四是有足够的光和热。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, picks: PICKS, moments: MOMENTS });
    document.querySelectorAll('.pmap').forEach(initPmap);
    fillStars(document.getElementById('scaleSvg'), 140, 800, 440);
    fillStars(document.getElementById('twinSvg'), 90, 800, 380);
    buildScale(document.getElementById('scaleSvg'));
    buildTicks(document.querySelector('#planetSvg .ticks'));
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-scale')) renderScale(slide, step);
  },
};
