'use strict';
/* 海滨小城 · 本课逻辑。故事页 / 小练笔用 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 游览路线图 ================= */
const STOPS = [
  { name: '海上', para: '第 1、2 段', say: '天是蓝的，海也是蓝的；船来船往，海鸥飞翔。早晨，一切都镀上了一层金黄色。' },
  { name: '沙滩', para: '第 3 段', say: '遍地是各种颜色、各种花纹的贝壳；船队一靠岸，海滩上就喧闹起来。' },
  { name: '庭院', para: '第 4 段', say: '每一个庭院都栽了很多树：桉树飘香，凤凰树开花像红云。' },
  { name: '公园', para: '第 5 段', say: '许许多多榕树像撑开的绿绒大伞，石凳上坐满了人。' },
  { name: '街道', para: '第 6 段', say: '细沙铺成，踩上去咯吱咯吱地响；干净得连一片落叶都没有。' },
];

function initRoute() {
  const svg = document.getElementById('route');
  const card = document.getElementById('stopCard');
  svg.addEventListener('click', (e) => {
    const stop = e.target.closest('.stop');
    if (!stop) return;
    const s = STOPS[+stop.dataset.s];
    stop.classList.add('seen');
    svg.querySelectorAll('.stop').forEach((g) => g.classList.toggle('sel', g === stop));
    card.innerHTML = `<h3>${s.name}<small>${s.para}</small></h3><p class="zc-more">${s.say}</p>`;
  });
}

/* ================= 海上的颜色：朝阳一照，镀上金黄色 ================= */
function initSeaColor() {
  const svg = document.getElementById('seaColor');
  const gull = (x, y) => `<path class="gull" d="M${x} ${y} q8 -9 16 0 q8 -9 16 0" stroke-width="3.5" fill="none"/>`;
  svg.innerHTML = `
    <rect class="c-sky" width="640" height="200"/>
    <circle class="c-sun" cx="560" cy="210" r="34" fill="#ffb347"/>
    <rect class="c-sea" y="200" width="640" height="180"/>
    <g class="c-cloud"><ellipse cx="120" cy="60" rx="56" ry="18"/><ellipse cx="160" cy="50" rx="40" ry="18"/><ellipse cx="380" cy="80" rx="60" ry="16" class="grey"/></g>
    <g class="c-gulls">${gull(220, 120)}${gull(270, 100)}${gull(450, 140)}</g>
    <g transform="translate(130 200)"><path class="c-fanchuan" d="M-50 0 H50 L36 16 H-36 Z"/><path class="c-fan" d="M-6 0 V-60 L34 -6 Z"/></g>
    <g transform="translate(420 200)"><path class="c-jian" d="M-80 0 H80 L66 18 H-70 Z M-30 0 V-22 H30 V0 Z M-6 -22 V-40 H6 V-22 Z"/></g>
    <path d="M0 200 H640" stroke="#fff" stroke-width="2" opacity=".6"/>
    <rect class="c-gold" width="640" height="380"/>`;
  const btn = document.getElementById('sunBtn');
  btn.addEventListener('click', () => {
    const gold = svg.classList.toggle('gold');
    btn.textContent = gold ? '回到白天' : '早晨，朝阳升起';
  });
}

/* ================= 找关键句：第 4、5、6 段 ================= */
const KEYS = [
  {
    tab: '第 4 段 · 庭院',
    sents: ['小城里每一个庭院都栽了很多树。', '有桉树、椰子树、橄榄树、凤凰树，还有别的许多亚热带树木。', '初夏，桉树叶子散发出来的香味，飘得满街满院都是。', '凤凰树开了花，开得那么热闹，小城好像笼罩在一片片红云中。'],
    kids: [['树的种类多', '桉树、椰子树、橄榄树、凤凰树……'], ['桉树香', '香味飘得满街满院都是'], ['凤凰树花红', '好像笼罩在一片片红云中']],
  },
  {
    tab: '第 5 段 · 公园',
    sents: ['小城的公园更美。', '这里栽着许许多多榕树。', '一棵棵榕树就像一顶顶撑开的绿绒大伞，树叶密不透风，可以遮太阳，挡风雨。', '树下摆着石凳，每逢休息的日子，石凳上总是坐满了人。'],
    kids: [['榕树多', '许许多多榕树'], ['榕树像大伞', '密不透风，遮太阳，挡风雨'], ['人多', '石凳上总是坐满了人']],
  },
  {
    tab: '第 6 段 · 街道',
    sents: ['小城的街道也美。', '除了沥青的大路，都是用细沙铺成的，踩上去咯吱咯吱地响，好像踩在沙滩上一样。', '人们把街道打扫得十分干净，甚至连一片落叶都没有。'],
    kids: [['细沙铺成', '踩上去咯吱咯吱地响'], ['十分干净', '连一片落叶都没有']],
  },
];

function initKeys() {
  const tabs = document.getElementById('keyTabs');
  const box = document.getElementById('keySents');
  const tree = document.getElementById('keyTree');
  const show = (k) => {
    const d = KEYS[k];
    tabs.querySelectorAll('.btn').forEach((b, i) => b.classList.toggle('solid', i === k));
    box.dataset.k = k;
    box.innerHTML = d.sents.map((s, i) => `<button type="button" class="pick ks" data-i="${i}">${s}<small></small></button>`).join('');
    tree.hidden = true;
  };
  tabs.innerHTML = KEYS.map((d, i) => `<button type="button" class="btn" data-k="${i}">${d.tab}</button>`).join('');
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (b) show(+b.dataset.k);
  });
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('.ks');
    if (!btn) return;
    const d = KEYS[+box.dataset.k];
    btn.classList.remove('wrong');
    if (+btn.dataset.i !== 0) {
      void btn.offsetWidth; // 重新触发抖动
      btn.classList.add('wrong');
      btn.querySelector('small').textContent = '这句在说明关键句';
      return;
    }
    btn.classList.add('right');
    btn.querySelector('small').textContent = '✓ 关键句：后面的句子都围绕它写';
    document.getElementById('keyRoot').textContent = d.sents[0];
    document.getElementById('keyKids').innerHTML = d.kids.map(([b, s]) => `<div class="kt-kid"><b>${b}</b>${s}</div>`).join('');
    document.getElementById('keyKids').style.gridTemplateColumns = `repeat(${d.kids.length}, 1fr)`;
    tree.hidden = false;
  });
  show(0);
}

/* ================= 小练笔 ================= */
const MOMENTS = [
  {
    name: '校园一角', pic: 'gongyuan',
    prompt: '学校里哪个地方最美？先写一句关键句，再围绕它写。',
    hint: '课本提示：“操场后面的小花园真美……”写写那里有什么、是什么样子的。',
    example: '操场后面的小花园真美。花坛里开满了月季花，红的像火，粉的像霞。几棵桂花树站在花坛边，一到秋天，香味飘得满校园都是。课间，同学们总爱到这里来看花、捉迷藏。',
  },
  {
    name: '家乡的街道', pic: 'tingyuan',
    prompt: '你家附近的街道、公园、小河有什么特别的地方？围绕一句话写几句。',
    hint: '可以学课文用“……真美”“……也美”“……更美”开头。',
    example: '我家门前的小河真美。河水清清的，能看见水底的小石子。河边一排垂柳，长长的柳枝垂到水面上，风一吹，像在梳头发。傍晚，夕阳把河水染得红红的。',
  },
  {
    name: '海边', pic: 'shatan',
    prompt: '你去过海边或湖边吗？围绕一句话，写写那里的景色。',
    hint: '可以写颜色（天、水、船）、声音（浪声、汽笛声），还可以写早晨和傍晚有什么不同。',
    example: '傍晚的海边热闹极了。夕阳把海面染成了金色，渔船一只接一只地靠了岸。大人们忙着搬鱼，小孩子在沙滩上追着浪花跑，笑声和海浪声混在一起。',
  },
];

/* ================= 接入通用引擎（../shared/deck.js） ================= */
window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initRoute();
    initSeaColor();
    initKeys();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
