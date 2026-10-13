'use strict';
/* 阿西莫夫短文两篇 · 本课专属互动：板块漂移示意（滑块三个时期，恐龙随大陆走）+ 推理链、证据天平（撞击说 vs 火山说）、括号翻卡、海沟选一选 */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const svgNS = (tag, attrs, text) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text) el.textContent = text;
  return el;
};

/* ---------- 板块漂移：大陆是示意形状，pos 为三个时期的位置 ---------- */
const LANDS = [
  { id: 'na', name: '北美', d: 'M-50 -40 L30 -50 L55 -20 L20 20 L-10 45 L-40 10 Z', pos: [[250, 95], [215, 85], [130, 95]] },
  { id: 'eu', name: '欧亚', d: 'M-90 -35 L80 -40 L95 0 L40 30 L-20 25 L-80 5 Z', pos: [[350, 90], [330, 80], [385, 85]] },
  { id: 'sa', name: '南美', d: 'M-25 -45 L25 -40 L30 0 L5 50 L-10 45 L-20 0 Z', pos: [[255, 190], [235, 190], [185, 230]] },
  { id: 'af', name: '非洲', d: 'M-40 -45 L35 -45 L45 0 L10 50 L-15 40 L-35 -5 Z', pos: [[320, 175], [300, 182], [320, 190]] },
  { id: 'in', name: '印度', d: 'M-15 -15 L18 -15 L5 22 Z', pos: [[378, 208], [395, 215], [415, 145]] },
  { id: 'an', name: '南极洲', d: 'M-60 -15 L60 -15 L50 15 L-50 15 Z', pos: [[318, 262], [300, 290], [330, 318]] },
  { id: 'au', name: '澳大利亚', d: 'M-30 -20 L30 -18 L32 15 L-25 18 Z', pos: [[382, 252], [372, 285], [505, 255]] },
];
const ERAS = [
  '约 2.25 亿年前：最后一次完整的泛大陆形成，所有陆地都处在热带和温带，早期恐龙分散到泛大陆各地。',
  '约两亿年前：泛大陆分裂出四部分——北部（北美、欧洲、亚洲）、南部（南美、非洲）、最南部（南极洲、澳大利亚）、印度。',
  '今天：北美与欧亚分开，南美与非洲相离，印度与亚洲相撞形成喜马拉雅山脉；南极被带到极地，冰天雪地，恐龙化石埋在冰下。',
];
function buildDrift() {
  const svg = document.getElementById('driftSvg');
  svg.appendChild(svgNS('rect', { x: 0, y: 0, width: 600, height: 340, rx: 12, class: 'ocean' }));
  LANDS.forEach((l) => {
    const g = svgNS('g', { class: `land land-${l.id}`, id: `land-${l.id}` });
    g.appendChild(svgNS('path', { d: l.d }));
    g.appendChild(svgNS('text', { class: 'land-t t-c', x: 0, y: 4 }, l.name));
    if (l.id !== 'in') g.appendChild(svgNS('text', { class: 'dino', x: -8, y: -14 }, '🦕'));
    svg.appendChild(g);
  });
}
function setEra(i) {
  LANDS.forEach((l) => {
    const [x, y] = l.pos[i];
    document.getElementById(`land-${l.id}`).style.transform = `translate(${x}px, ${y}px)`;
  });
  document.getElementById('driftSvg').classList.toggle('ice', i === 2);
  document.getElementById('driftCap').textContent = ERAS[i];
}
function initDrift() {
  buildDrift();
  const r = document.getElementById('driftRange');
  r.addEventListener('input', () => setEra(+r.value));
  setEra(0);
}

/* ---------- 证据天平：side L 撞击 / R 火山 / 0 标尺；w 权重 ---------- */
const EVIDENCE = [
  { t: '6500 万年前形成的沉积物薄层中，稀有金属铱的含量异常丰富。', side: 'L', w: 1, why: '有人据此认为是巨大的小行星或彗星撞击地球——撞击说由此提出。' },
  { t: '1987 年有人指出：许多火山大致同时喷发，也能造成使生物大量灭绝的巨大灾难。', side: 'R', w: 1, why: '火山说同样能解释大灭绝——两种对立的理论。' },
  { t: '斯石英：沙子在超高压下变得极为致密；在 850 °C 下加热 30 分钟会变回普通沙子。', side: '0', w: 0, why: '这是判断的“标尺”：斯石英只在强烈挤压处形成，又怕高温。它本身不偏向任何一方。' },
  { t: '有证据显示曾受巨大陨石撞击的地区发现了斯石英。', side: 'L', w: 1, why: '撞击产生的巨大压力能形成斯石英。' },
  { t: '火山喷发温度极高，携带上来的斯石英都会转化为普通二氧化硅；火山活动地区至今没有发现过斯石英。', side: 'L', w: 1, why: '排除火山：有斯石英的地方，“肯定发生过撞击，而且肯定没有发生过火山活动”。' },
  { t: '1989 年，研究者在新墨西哥州拉顿地区 6500 万年前的岩层中检测到了斯石英的原子排列。', side: 'L', w: 2, why: '决定性证据：6500 万年前曾有一次巨大的撞击——“造成恐龙灭绝的原因不是火山活动，而应该是撞击”。' },
];
function initScale() {
  const list = document.getElementById('evList');
  const beam = document.getElementById('beam');
  const cap = document.getElementById('scaleCap');
  const wL = document.getElementById('wL');
  const wR = document.getElementById('wR');
  const placed = new Set();
  list.innerHTML = EVIDENCE.map((e, i) => `<button type="button" class="ev" data-i="${i}"><span class="ev-n">${i + 1}</span>${esc(e.t)}</button>`).join('');
  const draw = () => {
    const sum = { L: 0, R: 0 };
    wL.innerHTML = '';
    wR.innerHTML = '';
    [...placed].sort().forEach((i) => {
      const e = EVIDENCE[i];
      if (e.side === '0') return;
      const box = e.side === 'L' ? wL : wR;
      const cx = e.side === 'L' ? 110 : 490;
      for (let k = 0; k < e.w; k += 1) {
        const n = sum[e.side];
        box.appendChild(svgNS('rect', { class: `wt w-${e.side}`, x: cx - 34 + (n % 2) * 36, y: 186 - Math.floor(n / 2) * 24, width: 32, height: 22, rx: 4 }));
        box.appendChild(svgNS('text', { class: 't-s t-c wt-t', x: cx - 18 + (n % 2) * 36, y: 202 - Math.floor(n / 2) * 24 }, String(i + 1)));
        sum[e.side] += 1;
      }
    });
    const deg = Math.max(-16, Math.min(16, (sum.R - sum.L) * 4));
    beam.style.transform = `rotate(${deg}deg)`;
    return sum;
  };
  list.addEventListener('click', (ev) => {
    const b = ev.target.closest('.ev');
    if (!b) return;
    const i = +b.dataset.i;
    placed.add(i);
    b.classList.add('used', `s${EVIDENCE[i].side}`);
    const sum = draw();
    const done = placed.has(5);
    cap.innerHTML = `<b>证据 ${i + 1}：</b>${esc(EVIDENCE[i].why)}${done ? `<br><b class="verdict">天平倒向撞击说（${sum.L} : ${sum.R}）</b>` : ''}`;
  });
  document.getElementById('evReset').addEventListener('click', () => {
    placed.clear();
    list.querySelectorAll('.ev').forEach((b) => { b.className = 'ev'; });
    draw();
    cap.textContent = '按课文顺序点左边的证据卡，它会落到支持的一边。';
  });
  draw();
}

/* ---------- 思考探究三：括号 ---------- */
const CLUES = [
  { q: '（如果看一张地图，并假定把非洲和南美洲拼合在一起，你就会看到它们拼合得多么天衣无缝。）', a: '补充证据：两块大陆轮廓吻合，证明它们曾连在一起；还引导读者自己动手验证。' },
  { q: '（万一哪天某个星体要撞击地球，我们也许会知道如何来避免这种撞击）', a: '联系现实与未来：说明研究灭绝原因“不仅仅是一个学术问题”，有现实意义。' },
  { q: '二氧化硅（即非常纯的沙子）', a: '解释概念：把专业名词换成通俗说法，让读者明白“被压扁的沙子”指什么。' },
  { q: '（你也可以在真空中对金刚石加热，从而把它恢复到原始碳的状态，但谁愿意这样做呢？）', a: '补充说明并增添趣味：金刚石也会“还原”，一句反问幽默风趣，拉近与读者的距离。' },
];

const TRENCH = [
  { t: '板块构造理论', ok: true, why: '✓ 一个板块向另一个板块下面俯冲' },
  { t: '撞击说', ok: false, why: '讲恐龙灭绝的原因' },
  { t: '火山说', ok: false, why: '讲恐龙灭绝的原因' },
];

const MOMENTS = [
  {
    name: '我支持撞击说', pic: 'zhuangji',
    prompt: '用课文的证据和你查到的资料，写一段支持“撞击说”的短文。',
    hint: '观点一句话；证据两三条（铱异常、斯石英……）；推理要说清“因为……所以……”；结尾留有余地。',
    example: '我认为恐龙灭绝很可能是小行星撞击造成的。首先，6500 万年前的沉积层里铱的含量异常丰富，而铱在地壳中极少；其次，拉顿地区同一年代的岩层中发现了斯石英，而斯石英只在超高压下形成，火山的高温反而会把它变回普通沙子。当然，科学家们仍在继续研究，这个结论也许还会被修正。',
  },
  {
    name: '我想再查一查', pic: 'huoshan',
    prompt: '课文说还有多种假说。查一种课文没写到的假说，介绍它的依据。',
    hint: '假说叫什么？它根据什么？你觉得它有什么不足？注明资料来源。',
    example: '有一种假说认为，恐龙灭绝和气候变化有关……（请查阅资料后补充，注明来源）',
  },
  {
    name: '给同学讲讲', pic: 'fandalu',
    prompt: '假如你是讲解员，用三四句话向低年级同学讲清楚“为什么南极有恐龙化石”。',
    hint: '用打比方：板块像什么？大陆像什么？',
    example: '地球的表面像一块拼图，每一块“拼图”都驮着大陆慢慢移动。很久很久以前，所有大陆挤在一起，恐龙在上面到处跑。后来大陆分开了，有一块被带到了最南边，变成了冰天雪地的南极——恐龙的骨头就留在了那里。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['括号里的话', '作用'], picks: { trench: TRENCH }, moments: MOMENTS });
    initDrift();
    initScale();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
