'use strict';
/* 开国大典 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课不用情节曲线，改用“典礼程序”条：故事页写 data-cer="序号"（-1 为典礼之前），字幕行上也可写，走到该步时切换。
 */
const CEREMONY = ['群众入场', '典礼开始', '宣布成立', '升国旗', '宣读公告', '阅兵式', '群众游行'];

function buildCeremonyBar() {
  const bar = document.createElement('div');
  bar.className = 'cer';
  bar.id = 'cerBar';
  bar.innerHTML = `<small>典礼程序</small><ol>${CEREMONY.map((t) => `<li>${t}</li>`).join('')}</ol>`;
  document.getElementById('frame').appendChild(bar);
}

function updateCeremonyBar(slide, step) {
  const bar = document.getElementById('cerBar');
  let src = slide.dataset.cer !== undefined ? slide : null;
  slide.querySelectorAll('[data-cer][data-step]').forEach((el) => { if (+el.dataset.step <= step) src = el; });
  bar.classList.toggle('show', Boolean(src));
  if (!src) return;
  const at = +src.dataset.cer;
  bar.querySelectorAll('li').forEach((li, i) => {
    li.classList.toggle('done', i < at);
    li.classList.toggle('cur', i === at);
  });
}

/* ---------- SVG 小图形：会场红旗、受阅部队 ---------- */
const range = (n) => Array.from({ length: n }, (_, i) => i);
const FLAG_X = [244, 266, 288, 310, 476, 498, 520, 542];

function drawFlags(g) {
  g.innerHTML = FLAG_X.map((x) => `<line x1="${x}" y1="62" x2="${x}" y2="34" stroke="#6b4b2a" stroke-width="2"/><path d="M${x} 34 h16 l-4 6 l4 6 h-16 z" fill="#d62f22"/>`).join('');
}

function drawParade(svg) {
  const fill = (sel, html) => { svg.querySelector(sel).innerHTML = html; };
  // 海军两个排：雪白帽子、蓝制服
  fill('.sailors', range(16).map((i) => {
    const x = (i % 8) * 12 + 4;
    const y = Math.floor(i / 8) * 34 + 6;
    return `<rect x="${x}" y="${y + 6}" width="8" height="18" rx="2" fill="#2f5f9e"/><circle cx="${x + 4}" cy="${y + 3}" r="4" fill="#fff" stroke="#9ab" stroke-width=".8"/>`;
  }).join(''));
  // 步兵方阵
  fill('.infantry', range(25).map((i) => `<rect x="${(i % 5) * 18 + 2}" y="${Math.floor(i / 5) * 16 + 2}" width="10" height="12" rx="2" fill="#6b7a4a"/>`).join(''));
  // 炮兵一字形横列（与行进方向垂直）
  fill('.guns', range(4).map((i) => `<g transform="translate(10 ${i * 20 + 4})"><rect width="34" height="10" rx="3" fill="#56604a"/><line x1="0" y1="5" x2="-14" y2="2" stroke="#3d4434" stroke-width="3"/><circle cx="8" cy="12" r="4" fill="#333"/><circle cx="26" cy="12" r="4" fill="#333"/></g>`).join(''));
  // 战车两三辆一排
  fill('.tanks', range(6).map((i) => `<g transform="translate(${(i % 2) * 56 + 6} ${Math.floor(i / 2) * 28 + 4})"><rect width="44" height="16" rx="4" fill="#4c5a3c"/><rect x="12" y="-7" width="18" height="9" rx="2" fill="#5d6c4a"/><line x1="12" y1="-3" x2="-8" y2="-3" stroke="#3a4530" stroke-width="3"/><circle cx="20" cy="-11" r="3" fill="#c9a37a"/></g>`).join(''));
  // 骑兵：红马连、白马连，六马并行
  fill('.horses', range(12).map((i) => {
    const col = Math.floor(i / 6);
    return `<ellipse cx="${col * 60 + 28}" cy="${(i % 6) * 15 + 8}" rx="16" ry="6" fill="${col ? '#f4f1ea' : '#b5462e'}" stroke="#8a6a50" stroke-width=".8"/><circle cx="${col * 60 + 12}" cy="${(i % 6) * 15 + 4}" r="3.5" fill="${col ? '#f4f1ea' : '#b5462e'}" stroke="#8a6a50" stroke-width=".8"/>`;
  }).join(''));
  // 空军人字形
  fill('.jets', [[0, 0], [-22, 14], [22, 14], [-44, 28], [44, 28]].map(([dx, dy]) =>
    `<path transform="translate(${80 + dx} ${20 + dy})" d="M-12 0 L0 -5 L12 0 L0 4 Z M-3 -1 L-8 -10 M-3 1 L-8 10" fill="#5a6a7a" stroke="#5a6a7a" stroke-width="2"/>`).join(''));
}

/* 品读 · 课后第 3 题：句子与批注 */
const CLUE_LABELS = ['读句子', '批注'];
const CLUES = [
  { q: '主席台设在天安门城楼上。城楼檐下，八盏大红宫灯分挂两边。靠着城楼左右两边的石栏，八面红旗迎风招展。', a: '大红宫灯、红旗，一片红色，喜庆热烈；“八盏”“八面”对称整齐，显得庄严隆重。' },
  { q: '到了正午，天安门广场已经成了人的海洋，红旗翻动，像海上的波浪。', a: '把人群比作“海洋”，把红旗比作“波浪”：人多、旗多，场面宏大热烈。' },
  { q: '两个半钟头的检阅，广场上不断地欢呼，不断地鼓掌，一个高潮接着一个高潮。群众差不多把嗓子都喊哑了，把手掌都拍麻了，还觉得不能够表达自己心里的欢喜和激动。', a: '两个“不断地”、“一个高潮接着一个高潮”，热烈持续不停；“喊哑了”“拍麻了”还觉得不够，写出群众激动到了极点。' },
  { q: '起初是全场肃静，只听见炮声和乐曲声，只听见国旗和其他许多旗帜飘拂的声音……', a: '连旗帜飘拂的声音都听得见，三十万人一点声音也没有——以声写静，突出升旗时的庄严肃穆。' },
];

/* 读与写 · 学写场面 */
const MOMENTS = [
  {
    name: '入场 · 我是那位农民', pic: 'ruchang',
    prompt: '“郊区的农民是五更天摸着黑起床，步行四五十里路赶来的。”想象其中一位农民，写一写他赶到广场时看到的场面和他的样子（一个“点”）。',
    hint: '先写他看到的“人的海洋”（面），再写他自己：走了一夜的路，他的脚、他的脸、他说的话。',
    example: '天刚亮，广场上已经是人山人海，红旗一面挨着一面。（面）王大伯擦了擦额头的汗，鞋上沾满了泥，他踮起脚朝城楼望去，咧开嘴笑了：“走了四十多里，值！”（点）',
  },
  {
    name: '升旗 · 那一刻', pic: 'shengqi',
    prompt: '五星红旗徐徐上升，三十万人一齐脱帽肃立。选人群中的一个人，给他写一个“特写”。',
    hint: '可以写一位老战士、一个学生或一位工人：他的动作、神态，心里在想什么。',
    example: '一位头发花白的老工人摘下帽子，紧紧攥在胸前。他仰着头，眼睛一眨不眨地望着那面鲜红的旗帜，泪水顺着脸上的皱纹流了下来。',
  },
  {
    name: '学以致用 · 学校升旗仪式', pic: 'shengqi',
    prompt: '用点面结合的方法，写一写学校的升旗仪式或运动会开幕式。',
    hint: '先写面：全校同学的队伍、整体的声音和动作；再写点：护旗手、升旗手或身边的某个同学。',
    example: '国歌响起，全校一千多名同学站得笔直，操场上静悄悄的。（面）升旗手小林双手一扬，国旗展开了；他一下一下拉着绳子，眼睛始终望着国旗。（点）',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    buildCeremonyBar();
    drawFlags(document.querySelector('#squareMap .flags'));
    drawParade(document.getElementById('parade'));
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateCeremonyBar(slide, step);
  },
};
