'use strict';
/* 我的叔叔于勒 · 本课数据。记叙文模板见 ../shared/narrative.js；
 * 本课独有：菲利普夫妇对于勒的态度变化曲线（骂—赞—盼—骂—躲，可叠加“于勒的钱”一条线）+ 叙事视角切换 */

const ATT = [
  { w: '骂', when: '当初', name: '“全家的恐怖”\n坏蛋 · 流氓 · 无赖', v: 14, money: 8, why: '于勒把自己应得的遗产吃得一干二净，还占用了哥哥的那一份。' },
  { w: '赞', when: '第一封信', name: '“正直的人，\n有良心的人”', v: 64, money: 52, why: '信里说赚了点儿钱，希望能够赔偿损失——“这封信使我们家里人深切感动”。' },
  { w: '盼', when: '十年', name: '“全家唯一的希望”\n好心的于勒', v: 94, money: 92, why: '信成了“福音书”，父亲的希望与日俱增，还计划用叔叔的钱置一所别墅。' },
  { w: '疑', when: '船上', name: '“这个卖牡蛎的\n怎么这样像于勒？”', v: 44, money: 30, why: '父亲“脸色十分苍白，两只眼也跟寻常不一样”。' },
  { w: '骂', when: '证实', name: '这个贼 · 这个小子\n讨饭的 · 流氓', v: 8, money: 3, why: '母亲突然暴怒：“我就知道这个贼是不会有出息的，早晚会回来重新拖累我们的。”' },
  { w: '躲', when: '回程', name: '改乘圣玛洛船\n“以免再遇见他”', v: 3, money: 3, why: '亲兄弟近在眼前，却连一句话都不说，躲开了。' },
];
const AX = { x0: 85, dx: 131, y0: 300, k: 1.9 };
const ax = (i) => AX.x0 + i * AX.dx;
const ay = (v) => AX.y0 - v * AX.k;

function buildAttitude() {
  const svg = document.getElementById('attSvg');
  const path = (key) => ATT.map((p, i) => `${i ? 'L' : 'M'}${ax(i)} ${ay(p[key])}`).join(' ');
  const segs = ATT.slice(1).map((p, i) => `<line class="at-seg" data-step="${i + 2}" x1="${ax(i)}" y1="${ay(ATT[i].v)}" x2="${ax(i + 1)}" y2="${ay(p.v)}"/>`).join('');
  const dots = ATT.map((p, i) => {
    const up = p.v > 50;
    const lines = p.name.split('\n').map((t, k) => `<tspan x="${ax(i)}" dy="${k ? 17 : 0}">${t}</tspan>`).join('');
    return `<g class="at-pt${up ? ' up' : ''}" data-step="${i + 1}" data-i="${i}">
      <circle cx="${ax(i)}" cy="${ay(p.v)}" r="20"/><text class="at-w" x="${ax(i)}" y="${ay(p.v) + 8}">${p.w}</text>
      <line class="at-tie" x1="${ax(i)}" y1="70" x2="${ax(i)}" y2="${ay(p.v) - 22}"/><text class="at-n" x="${ax(i)}" y="34">${lines}</text>
      <text class="at-when" x="${ax(i)}" y="342">${p.when}</text></g>`;
  }).join('');
  svg.innerHTML = `<text x="16" y="${ay(92)}" class="at-y">亲</text><text x="16" y="${ay(6)}" class="at-y">嫌</text>
    <line x1="44" y1="${ay(50)}" x2="790" y2="${ay(50)}" class="at-mid"/>
    <path class="at-money" d="${path('money')}"/>
    ${segs}${dots}`;
}
buildAttitude();

function showAtt(i) {
  const p = ATT[i];
  document.querySelectorAll('.at-pt').forEach((g) => g.classList.toggle('sel', +g.dataset.i === i));
  document.getElementById('attInfo').innerHTML = `<b>${p.when} · ${p.w}</b><em>${p.name.replace('\n', ' ')}</em>${p.why}`;
}

function initAttitude() {
  const svg = document.getElementById('attSvg');
  svg.addEventListener('click', (e) => {
    const g = e.target.closest('.at-pt');
    if (g) showAtt(+g.dataset.i);
  });
  document.getElementById('attMoney').addEventListener('click', (e) => {
    const on = svg.classList.toggle('show-money');
    e.target.classList.toggle('solid', on);
  });
}

function updateAttitude(slide, step) {
  if (!slide.querySelector('#attSvg')) return;
  if (step >= 1) showAtt(Math.min(step, ATT.length) - 1);
  slide.querySelector('#attSvg').classList.toggle('show-money', step > ATT.length);
  slide.querySelector('#attMoney').classList.toggle('solid', step > ATT.length);
}

/* 思考探究一：四个角度梳理情节 */
const ANGLES = {
  plot: { name: '情节', chain: ['开端：盼于勒', '发展：赞于勒（两封信）', '高潮：遇于勒（船上）', '结局：躲于勒（改乘圣玛洛船）'] },
  logic: { name: '逻辑', chain: ['原因：于勒糟蹋钱，被打发到美洲', '于勒来信说发了财', '全家把希望寄托在他身上', '结果：于勒落魄，全家躲避'] },
  mind: { name: '心理', chain: ['期待：“如果于勒竟在这只船上……”', '期待升级：与日俱增，计划买别墅', '惊疑：“怎么这样像于勒？”', '破灭：暴怒、狼狈、躲开'] },
  skill: { name: '技巧', chain: ['悬念：于勒会回来吗？', '铺垫：父亲那句“永不变更的话”', '巧合：在去哲尔赛岛的船上偶遇', '结局：出人意料又在情理之中'] },
};

function showAngle(key) {
  const a = ANGLES[key];
  document.querySelectorAll('[data-angle]').forEach((b) => b.classList.toggle('solid', b.dataset.angle === key));
  document.getElementById('angleChain').innerHTML = a.chain.map((t, i) => `${i ? '<i>→</i>' : ''}<div><b>${i + 1}</b>${t}</div>`).join('');
}

function initAngles() {
  document.querySelectorAll('[data-angle]').forEach((b) => b.addEventListener('click', () => showAngle(b.dataset.angle)));
  showAngle('plot');
}

function updateAngles(slide, step) {
  if (!slide.querySelector('#angleChain') || step < 1) return;
  showAngle(['plot', 'logic', 'mind', 'skill'][Math.min(step, 4) - 1]);
}

/* 思考探究三：换个视角讲“付牡蛎钱” */
const VIEWS = {
  jo: { who: '若瑟夫（原文，第一人称“我”）', text: '我看了看他的手，那是一只满是皱纹的水手的手。我又看了看他的脸，那是一张又老又穷苦的脸，满脸愁容，狼狈不堪。我心里默念道：“这是我的叔叔，父亲的弟弟，我的亲叔叔。”我给了他十个铜子的小费。', say: '孩子的眼睛：看到的是一个可怜的亲人。天真、善良，和大人的冷漠形成对照，读者也跟着“我”一起震动。' },
  mom: { who: '换成母亲克拉丽丝（示例改写）', text: '我把五法郎交给若瑟夫，叫他去付钱，心里只盼着别叫女婿看出来。这孩子回来竟少了半个法郎——他给了那个流氓十个铜子的小费！真是疯了。', say: '母亲的眼睛：只看见钱和体面。读者能看到她的算计，却感受不到“亲叔叔”的分量。' },
  god: { who: '换成全知视角（示例改写）', text: '卖牡蛎的老水手正是于勒。他一眼认出了哥哥一家，却低下头装作不认识——他欠着他们的钱，没脸相认。菲利普夫妇也认出了他，赶紧躲到了船的另一头。', say: '全知视角：把于勒的心事全说出来了，悬念和含蓄就没有了，人物之间的冷暖也少了一层由孩子发现的冲击。' },
};

function showView(key) {
  const v = VIEWS[key];
  document.querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('solid', b.dataset.view === key));
  const box = document.getElementById('viewBox');
  box.querySelector('h3').textContent = v.who;
  box.querySelector('.yl-text').textContent = v.text;
  box.querySelector('.yl-say').textContent = v.say;
  box.classList.toggle('orig', key === 'jo');
}

function initViews() {
  document.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));
  showView('jo');
}

const MOMENTS = [
  {
    name: '假如于勒成了富翁', pic: 'muli',
    prompt: '积累拓展五：假如菲利普夫妇在船上发现已经成为百万富翁的于勒，他们会有怎样的表现呢？写一个 300 字左右的片段。',
    hint: '抓住人物的语言、动作、神态，前后称呼的变化最能说明问题。可以借用原文的写法：父亲那句“永不变更的话”、母亲的“暴怒”，现在会变成什么？',
    example: '父亲忽然看见头等舱里走出一位穿着讲究的先生，身边跟着两个仆人。他的脸一下子红了，两只眼睛放着光，低声对母亲说：“克拉丽丝，你看那位先生，怎么这样像于勒？”母亲一把整了整帽子，三步并作两步迎上去，满脸堆笑：“哎呀，这不是我们亲爱的于勒弟弟吗！我就知道你是个有办法的人！”……',
  },
  {
    name: '于勒的一封信', pic: 'shou',
    prompt: '思考探究二迁移：以于勒的口吻，给哥哥写一封永远不会寄出的信。',
    hint: '船长说他“不愿回到他们身边，因为他欠了他们的钱”。他在船上认出哥哥一家了吗？他心里在想什么？',
    example: '亲爱的菲利普：今天我在船上看见你们了。若瑟夫长这么高了，他还给了我十个铜子的小费……我没敢抬头。我欠你们的钱，一个子儿也还不上，我还有什么脸叫你一声哥哥呢？',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initAttitude();
    initAngles();
    initViews();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateAttitude(slide, step);
    updateAngles(slide, step);
  },
};
