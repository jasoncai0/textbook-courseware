'use strict';
/* 纳米技术就在我们身边 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，提问—解决卡见 wenjie.js，翻页引擎见 ../shared/deck.js
 * 本课专属：尺度缩放镜头（每按一次放大 1000 倍：米 → 毫米 → 微米 → 纳米）、身边的纳米卡片、药效时长条。
 */

/* 尺度缩放镜头 */
const LEVELS = [
  '<b>米</b>小朋友身高大约 1.3 米。红圈里是米尺的一小格——放大看看。',
  '<b>毫米</b>尺子上最小的一格是 1 毫米。<br>1 米 = 1000 毫米。红圈里是一根头发丝——再放大。',
  '<b>微米</b>头发丝有几十微米粗，红细胞大约 7 微米。<br>1 毫米 = 1000 微米。红圈里的小点——再放大！',
  '<b>纳米</b>1 微米 = 1000 纳米。1 纳米是十亿分之一米。<br>纳米技术研究的东西在 1～100 纳米之间，普通光学显微镜也看不见！',
];
const HEX = { r: 22, cols: 18, rows: 6, x0: 30, y0: 100 };
function drawTube() {
  // 碳纳米管示意：一片六边形网格
  const { r, cols, rows, x0, y0 } = HEX;
  const w = r * Math.sqrt(3);
  const hex = (cx, cy) => Array.from({ length: 6 }, (_, k) => {
    const a = Math.PI / 6 + k * Math.PI / 3;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  const cells = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      cells.push(`<polygon points="${hex(x0 + col * w + (row % 2) * w / 2, y0 + row * r * 1.5)}"/>`);
    }
  }
  document.getElementById('nanoTube').innerHTML = cells.join('');
}
function initZoom() {
  const svg = document.getElementById('zoomSvg');
  const lvs = [...svg.querySelectorAll('.lv')];
  const ladder = [...document.querySelectorAll('#zmLadder span')];
  let i = 0;
  const show = () => {
    lvs.forEach((g, k) => { g.classList.toggle('cur', k === i); g.classList.toggle('past', k < i); });
    ladder.forEach((s, k) => s.classList.toggle('cur', k === i));
    document.getElementById('zmCap').innerHTML = LEVELS[i];
    document.getElementById('zmIn').disabled = i === LEVELS.length - 1;
    document.getElementById('zmOut').disabled = i === 0;
  };
  document.getElementById('zmIn').addEventListener('click', () => { i = Math.min(LEVELS.length - 1, i + 1); show(); });
  document.getElementById('zmOut').addEventListener('click', () => { i = Math.max(0, i - 1); show(); });
  show();
}

/* 第 3 自然段：身边的纳米 */
const NEAR = [
  { name: '纳米涂层冰箱', pic: 'bingxiang', tag: '杀菌 · 除臭 · 保鲜', t: '冰箱里如果使用一种纳米涂层，就会具有杀菌和除臭功能，能够使蔬菜保鲜期更长。' },
  { name: '碳纳米管', pic: 'tianti', tag: '比钢铁结实百倍 · 非常轻', t: '有一种叫作“碳纳米管”的神奇材料，比钢铁结实百倍，而且非常轻，将来我们有可能坐上“碳纳米管天梯”到太空旅行。' },
  { name: '纳米吸波材料', pic: '', tag: '吸收雷达波', t: '在最先进的隐形战机上，用到一种纳米吸波材料，能够把探测雷达波吸收掉，所以雷达根本看不见它。' },
];
const RADAR_SVG = '<svg viewBox="0 0 200 120" aria-hidden="true"><circle cx="40" cy="60" r="10" fill="#2f6fa0"/><g fill="none" stroke="#2f6fa0" stroke-width="4"><path d="M60 40 q12 20 0 40"/><path d="M80 28 q22 32 0 64"/><path d="M100 16 q32 44 0 88"/></g><rect x="150" y="40" width="34" height="40" rx="6" fill="#9aa8b8"/><text x="167" y="100" font-size="14" text-anchor="middle" fill="#2f4a6a">吸收掉</text></svg>';
function initNear() {
  const box = document.getElementById('nearCards');
  box.innerHTML = NEAR.map((n, i) => `<button class="near-card" type="button" data-i="${i}">
      <span class="near-pic"${n.pic ? ` style="background-image:url(assets/${n.pic}.jpg)"` : ''}>${n.pic ? '' : RADAR_SVG}</span>
      <b>${n.name}</b><small>${n.tag}</small></button>`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.near-card');
    if (!c) return;
    box.querySelectorAll('.near-card').forEach((x) => x.classList.toggle('cur', x === c));
    document.getElementById('nearText').textContent = NEAR[+c.dataset.i].t;
  });
}

/* 第 4 自然段：更加健康 */
const HEALTH = [
  '癌症很可怕，但如果在只有几个癌细胞的时候就能发现的话，死亡率会大大降低。利用极其灵敏的纳米检测技术，可以实现疾病的早期检测与预防。',
  '未来的纳米机器人甚至可以通过血管直达病灶，杀死癌细胞。',
  '生病的时候，需要吃药。现在吃一次药最多管一两天，未来的纳米缓释技术，能够让药物效力缓慢地释放出来，服一次药可以管一周，甚至一个月。',
];
function initHealth() {
  const text = document.getElementById('hlText');
  const bars = document.getElementById('hlBars');
  const show = (i) => {
    document.querySelectorAll('#hlBtns .btn').forEach((b, k) => b.classList.toggle('solid', k === i));
    text.textContent = HEALTH[i];
    bars.classList.toggle('show', i === 2);
  };
  document.getElementById('hlBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-h]');
    if (b) show(+b.dataset.h);
  });
  show(0);
}

/* 课后第 2 题：例子分一分 */
const SORT = [
  { s: '冰箱里的纳米涂层能杀菌、除臭，让蔬菜保鲜期更长', ok: ['就在身边'], q: '家里就有' },
  { s: '碳纳米管比钢铁结实百倍，而且非常轻', ok: ['就在身边'], q: '神奇的材料' },
  { s: '纳米吸波材料能把探测雷达波吸收掉', ok: ['就在身边'], q: '用在隐形战机上' },
  { s: '纳米检测技术能在只有几个癌细胞时就发现疾病', ok: ['更加健康'], q: '早发现、早预防' },
  { s: '纳米机器人通过血管直达病灶，杀死癌细胞', ok: ['更加健康'], q: '直接治病' },
  { s: '纳米缓释技术让一次药管一周，甚至一个月', ok: ['更加健康'], q: '少吃药' },
];

/* 课后第 1 题：提问—解决卡 */
const WENJIE = {
  nami: {
    items: [
      { q: '为什么说“21世纪必将是纳米的世纪”？', k: 'nr', how: ['sx', 'zl'], a: '联系全文：纳米技术能用在冰箱、材料、医疗等很多地方，“衣食住行都会有纳米技术的影子”，会深刻改变生活。' },
      { q: '“无能为力”在这里是什么意思？', k: 'ci', how: ['sx'], a: '联系上下文：纳米级的东西太小了，普通的光学显微镜也看不清——显微镜“使不上劲”。' },
      { q: '碳纳米管为什么又轻又结实？', k: 'nr', how: ['zl', 'qj'], a: '查资料：碳原子连成六边形的网，卷成细细的管子，结构特别牢固，又是空心的，所以又轻又结实。' },
      { q: '课文为什么要用“乒乓球放在地球上”来比？', k: 'xf', how: ['sx', 'qj'], a: '和同学讨论：十亿分之一米太难想象，打个比方，一下子就明白纳米有多小了。' },
      { q: '纳米机器人那么小，是怎么造出来的？', k: 'nr', how: ['zl', 'qj'], a: '课文没有写，可以查科普书、上网搜，或者请教科学老师。现在还在研究中，课文说的是“未来”。' },
    ],
  },
};

/* 选做：我的纳米奇思 */
const MOMENTS = [
  { name: '纳米衣服', pic: 'bingxiang', prompt: '如果衣服用上纳米技术，会是什么样？', hint: '说清楚：用在哪里，有什么用，给生活带来什么方便。',
    example: '我想发明一件纳米校服。它的布料上有一层纳米涂层，泼上墨水、溅上泥点，轻轻一抖就掉了，永远不用洗。天冷的时候它能保暖，天热的时候又能透气，穿在身上可舒服了。' },
  { name: '纳米书包', pic: 'tianti', prompt: '如果书包用上碳纳米管这样又轻又结实的材料呢？', hint: '想一想：现在的书包有什么烦恼？纳米技术怎样解决？',
    example: '我想用碳纳米管做一个书包。它比羽毛还轻，背在身上一点儿也不累；它又特别结实，下雨天淋不湿，摔在地上也摔不坏。这样，同学们再也不会被沉沉的书包压弯腰了。' },
  { name: '纳米小医生', pic: 'jiqiren', prompt: '如果有一个纳米小医生住在身体里，它会做什么？', hint: '学课文第 4 自然段：检测、治疗、送药。',
    example: '我想请一个纳米小医生住进爷爷的身体里。它每天在血管里巡逻，一发现坏细胞，就马上消灭它；爷爷忘了吃药，它就慢慢地把药放出来。有了它，爷爷就能健健康康的。' },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['就在身边', '更加健康'], moments: MOMENTS });
    WenJie.init(WENJIE);
    drawTube();
    initZoom();
    initNear();
    initHealth();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
