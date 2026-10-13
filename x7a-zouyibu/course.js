'use strict';
/* 走一步，再走一步 · 本课数据与本课独有互动：心情曲线（逐段画出、点圆点看原文）、悬崖“一小步”分解 */

/* ---------- 心情曲线：v 越高心情越好（-5 ~ 3） ---------- */
const MOOD = [
  { v: -1, step: 1, k: '犹豫', q: '我犹豫了。我渴望像他们一样勇敢和活跃，但是……我不像其他孩子那样强壮，而且不能冒险。' },
  { v: 0, step: 1, k: '跟着去', q: '“我来了！”我喊道，然后跟在他们后面跑。' },
  { v: -2, step: 2, k: '吓坏了', q: '不知何时，我回头向下看了一眼，然后吓坏了。' },
  { v: -3, step: 2, k: '被丢下', q: '“全看你自己了。”杰里看起来很担心，但最后还是和其他孩子一起走了。' },
  { v: -4.3, step: 3, k: '进退两难', q: '我听见有人在哭泣、呻吟；我想知道那是谁，最后才意识到那就是我。' },
  { v: -4.6, step: 3, k: '麻木', q: '我趴在岩石上，神情恍惚，害怕和疲劳已经让我麻木。' },
  { v: -3.4, step: 4, k: '看见爸爸', q: '爸爸！但是他能做什么？' },
  { v: -4.2, step: 4, k: '“我不行！”', q: '“我不行！我会掉下去的！我会摔死的！”我大哭着说。' },
  { v: -1.4, step: 5, k: '能做到', q: '这看起来我能做到。' },
  { v: 0.6, step: 5, k: '又做到了', q: '再一次，我做到了。' },
  { v: 2.8, step: 6, k: '成就感', q: '我有了一种巨大的成就感和类似骄傲的感觉。' },
];
const STAGES = [['冒险', 1, 2], ['遇险', 3, 6], ['脱险', 7, 11]];
const X0 = 70;
const DX = 66;
const yOf = (v) => 190 - v * 34;

function buildMood() {
  const svg = document.getElementById('moodSvg');
  const pts = MOOD.map((m, i) => ({ ...m, x: X0 + i * DX, y: yOf(m.v) }));
  const segs = pts.slice(1).map((p, i) => `<path class="draw seg" data-step="${p.step}" pathLength="1" d="M${pts[i].x} ${pts[i].y} L${p.x} ${p.y}"/>`).join('');
  const dots = pts.map((p, i) => `<g class="md" data-step="${p.step}" data-i="${i}" tabindex="0"><circle cx="${p.x}" cy="${p.y}" r="9"/><text x="${p.x}" y="${p.y + (p.v < -3 ? 30 : -16)}" text-anchor="middle">${p.k}</text></g>`).join('');
  const bands = STAGES.map(([t, a, b]) => {
    const x1 = X0 + (a - 1) * DX - 26;
    const x2 = X0 + (b - 1) * DX + 26;
    return `<rect class="band" x="${x1}" y="360" width="${x2 - x1}" height="30" rx="6"/><text class="band-t" x="${(x1 + x2) / 2}" y="381" text-anchor="middle">${t}</text>`;
  }).join('');
  svg.innerHTML = `<line class="axis" x1="30" y1="190" x2="780" y2="190"/>
    <text class="ax-t" x="34" y="34">心情好 · 有信心</text><text class="ax-t" x="34" y="350">害怕 · 绝望</text>
    ${bands}${segs}${dots}`;
  const pop = document.getElementById('moodPop');
  const show = (g) => {
    const m = MOOD[+g.dataset.i];
    svg.querySelectorAll('.md').forEach((x) => x.classList.toggle('picked', x === g));
    pop.innerHTML = `<b>${m.k}</b><br>${m.q}`;
  };
  svg.addEventListener('click', (e) => { const g = e.target.closest('.md.on'); if (g) show(g); });
  svg.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('.md.on')) show(e.target); });
}
buildMood(); // 在 deck.js 统计分步之前生成

/* ---------- 悬崖：每一步“我”的位置与手电光指向 ---------- */
const BOY = [[340, 108], [340, 108], [356, 150], [394, 190], [430, 196], [410, 284], [470, 336]];
const BEAM = [null, 1, 1, 2, 3, 5, null];
const HOLD_XY = { 1: [370, 200], 2: [410, 240], 3: [455, 216], 4: [400, 290], 5: [440, 340] };

function updateCliff(slide, step) {
  const svg = slide.querySelector('#cliffSvg');
  if (!svg) return;
  const [bx, by] = BOY[Math.min(step, BOY.length - 1)];
  svg.querySelector('#boy').setAttribute('transform', `translate(${bx - 6} ${by - 22}) scale(1.5)`);
  const target = BEAM[step];
  const beam = svg.querySelector('#beam');
  if (target) {
    const [hx, hy] = HOLD_XY[target];
    beam.setAttribute('points', `636,326 646,330 ${hx + 18},${hy} ${hx - 18},${hy}`);
    beam.style.opacity = '1';
  } else beam.style.opacity = '0';
  svg.querySelectorAll('.hold').forEach((h) => {
    const n = +h.dataset.h;
    h.classList.toggle('lit', n === target);
    h.classList.toggle('done', target ? n < target : step >= 6);
  });
  svg.classList.toggle('arrived', step >= 6);
  // 右侧只留最新一句爸爸的话
  const lines = [...slide.querySelectorAll('.cl-lines p[data-step]')];
  lines.forEach((p) => p.classList.toggle('old', +p.dataset.step < step));
  slide.querySelector('#cliffKey').hidden = step > 0;
  slide.querySelector('#stepCount').textContent = step >= 2 && step <= 5 ? `第 ${step - 1} 步` : (step >= 6 ? '到底了！' : '');
}

const PICKS = {
  dad: [
    { t: '把一大段悬崖，分解成一个个小动作', ok: true, why: '化整为零，每一步都“能做到”' },
    { t: '只让“我”看眼前这一步，不去想“下面的路还很长”', ok: true, why: '不给恐惧留空隙' },
    { t: '反复说“你能做到”“这就是你要做的”', ok: true, why: '语气正常、安慰，给“我”信心' },
    { t: '用手电照亮落脚点', ok: true, why: '给“我”清楚、具体的方向' },
    { t: '爬上去把“我”背下来', ok: false, why: '他爬不上来；就算能，“我”也学不到这一课' },
    { t: '批评“我”胆小，逼“我”下来', ok: false, why: '爸爸用的是“非常正常的、安慰的口吻”' },
  ],
};

const MOMENTS = [
  {
    name: '复述故事', pic: 'xuanya',
    prompt: '按“冒险—遇险—脱险”复述这个故事，加上“我”的心理变化。',
    hint: '每个阶段说两三句：发生了什么？“我”心里怎样？',
    example: '一个炎热的七月天，“我”跟着五个男孩去爬悬崖。“我”身体弱，本来犹豫，但还是跟去了。爬到岩脊上，“我”往下一看吓坏了，伙伴们嘲笑“我”，丢下“我”走了。“我”进退两难，趴在岩石上一动不动，直到天黑。爸爸来了，他用手电筒照着落脚点，让“我”一次只迈一小步……最后“我”踩到了地面，扑进爸爸怀里，心里有一种巨大的成就感。',
  },
  {
    name: '我的一小步', pic: 'shoudian',
    prompt: '你有过因胆怯而不敢迈步的经历吗？后来是怎样克服的？',
    hint: '写出害怕时的身体反应和心里话；写清楚你迈出的“第一小步”是什么。',
    example: '第一次上台演讲，我的手心全是汗，腿也在抖……老师悄悄对我说：“别想下面有多少人，先把第一句话说出来。”',
  },
];

window.LESSON = {
  init() { Narrative.init({ picks: PICKS, moments: MOMENTS }); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateCliff(slide, step);
  },
};
