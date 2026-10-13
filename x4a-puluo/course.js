'use strict';
/* 普罗米修斯（四上 14）· 本课数据与互动。情节图、分类、翻卡、读写练习见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 课后第 1 题 · 众神的名字 ================= */
const NAMES = [
  { n: '普罗米修斯', p: 'pǔ luó mǐ xiū sī', who: '天神，为人类“盗”来火种的英雄' },
  { n: '宙斯', p: 'zhòu sī', who: '众神的领袖' },
  { n: '赫淮斯托斯', p: 'hè huái sī tuō sī', who: '火神，很敬佩普罗米修斯' },
  { n: '赫拉克勒斯', p: 'hè lā kè lè sī', who: '著名的大力士，救了普罗米修斯' },
];
function buildNames() {
  const box = document.getElementById('names');
  box.innerHTML = NAMES.map(({ n, p, who }) => {
    const py = p.split(' ');
    return `<button type="button" class="name-card"><span class="nm">${[...n].map((ch, i) => `<ruby>${ch}<rt>${py[i]}</rt></ruby>`).join('')}</span><small>${who}</small></button>`;
  }).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.name-card');
    if (c) c.classList.toggle('show');
  });
}

/* ================= 舞台剧：轮到谁说，谁亮起来 ================= */
function updateTheater(slide, step) {
  const says = [...slide.querySelectorAll('.say')];
  const cur = says.filter((x) => +x.dataset.step <= step).pop();
  says.forEach((x) => x.classList.toggle('now', x === cur));
  slide.querySelectorAll('.actor').forEach((a) => a.classList.toggle('speak', Boolean(cur) && a.dataset.who === cur.dataset.who));
}

/* ================= 地图走情节：六个站点，按步骤点亮 ================= */
const STOPS = [
  { x: 110, y: 350, t: '人间（黑暗）', c: '#8e3a1c' },
  { x: 230, y: 90, t: '天上 · 太阳车', c: '#d9822b' },
  { x: 380, y: 330, t: '人间（有了火）', c: '#d9822b' },
  { x: 540, y: 90, t: '宙斯的神殿', c: '#d9822b' },
  { x: 680, y: 230, t: '高加索山悬崖', c: '#d9822b' },
  { x: 700, y: 390, t: '获得自由', c: '#2f6b5e' },
];
function buildMap() {
  const seg = STOPS.slice(1).map((s, i) => {
    const a = STOPS[i];
    const mx = (a.x + s.x) / 2 + (i % 2 ? 40 : -40);
    const my = (a.y + s.y) / 2;
    return `<path class="draw" data-step="${i + 2}" pathLength="1" d="M${a.x} ${a.y} Q${mx} ${my} ${s.x} ${s.y}"/>`;
  }).join('');
  const stops = STOPS.map((s, i) => `<g class="stop" data-step="${i + 1}"><circle cx="${s.x}" cy="${s.y}" r="18" fill="${s.c}"/><text class="t-m t-c" x="${s.x}" y="${s.y + 6}" fill="#fff">${i + 1}</text>
    <text class="t-m t-c st-lab" x="${s.x}" y="${s.y < 200 ? s.y - 28 : s.y + 42}">${s.t}</text></g>`).join('');
  document.getElementById('routeMap').innerHTML = `<rect width="800" height="440" rx="14" fill="#f3ead6"/>
    <rect width="800" height="190" rx="14" fill="#dfe8f1"/><text class="t-m" x="20" y="30" fill="#5a6f86">天上</text><text class="t-m" x="20" y="220" fill="#7a6a4a">人间</text>
    <path d="M600 300 L680 200 L760 300 Z" fill="#b8ab92"/><path d="M640 300 L700 230 L780 320 Z" fill="#a49880"/>
    <circle cx="230" cy="90" r="40" fill="#f6c55a" opacity=".5"/>
    <g class="route" fill="none" stroke="#b5451b" stroke-width="5" stroke-linecap="round">${seg}</g>${stops}`;
}

/* ================= 人物对比 ================= */
const KINDS = ['普罗米修斯', '宙斯'];
const SORT_ITEMS = [
  { s: '决心冒着生命危险，到天上去“盗”取火种', ok: ['普罗米修斯'], q: '勇敢' },
  { s: '气急败坏，决定给以最严厉的惩罚', ok: ['宙斯'], q: '专横' },
  { s: '“为人类造福，有什么错？”', ok: ['普罗米修斯'], q: '一心为人类' },
  { s: '“我可以忍受各种痛苦，但决不会承认错误”', ok: ['普罗米修斯'], q: '坚定' },
  { s: '又派了一只凶恶的鹫鹰', ok: ['宙斯'], q: '狠心、残忍' },
  { s: '尽管如此，就是不屈服', ok: ['普罗米修斯'], q: '不屈' },
];

/* ================= 课后第 3 题 · 触动我的情节 ================= */
const CLUE_LABELS = ['情节', '课文里写道 · 我的感受'];
const CLUES = [
  { q: '冒险盗火', a: '“决心冒着生命危险，到天上去‘盗’取火种。”——明知危险还要去，为的是人类，他真勇敢！' },
  { q: '拒绝认错', a: '“为人类造福，有什么错？”——一句反问，掷地有声。他宁可受苦，也不归还火种。' },
  { q: '锁在悬崖，决不屈服', a: '“尽管如此，普罗米修斯就是不向宙斯屈服。”——痛苦没有尽头，他却一点儿也不低头。' },
  { q: '大力士救英雄', a: '“心中愤愤不平，便挽弓搭箭……”——英雄终于获得了自由，读到这里真痛快！' },
];

/* ================= 读与写 ================= */
const MOMENTS = [
  {
    name: '讲“盗”火的故事', pic: 'daohuo',
    prompt: '按照起因、经过、结果的顺序，讲一讲普罗米修斯“盗”火的故事。',
    hint: '起因：人间没有火；经过：盗火 → 受罚 → 不屈服；结果：被赫拉克勒斯解救。',
    example: '很久以前，地上没有火，人们只能吃生的东西，在黑暗里过夜。天神普罗米修斯看到了，决心冒着生命危险去天上“盗”火。他从太阳车的车轮上取下一颗火星，带到人间，人们从此有了火。宙斯知道后气急败坏，把他锁在高加索山的悬崖上，还派鹫鹰折磨他。可普罗米修斯说：“为人类造福，有什么错？”他始终不屈服。许多年后，大力士赫拉克勒斯射死了鹫鹰，砸碎了锁链，英雄终于获得了自由。',
  },
  {
    name: '写触动我的情节', pic: 'zhousi',
    prompt: '故事中哪个情节最触动你？写下来，说说为什么。',
    hint: '情节 + 课文里的句子 + 我的感受。',
    example: '最触动我的是普罗米修斯拒绝认错的情节。火神劝他认错，他却摇摇头说：“为人类造福，有什么错？”他明明知道会受到最严厉的惩罚，却一点儿也不退缩。我觉得他是真正的英雄。',
  },
  {
    name: '想象：第一次有了火', pic: 'renjian',
    prompt: '展开想象：人们第一次有了火，会是什么情景？',
    hint: '写人们的动作、表情和说的话；写火给生活带来的变化。',
    example: '那一夜，火光第一次照亮了山洞。孩子们围着火堆又跳又叫，老人们伸出冻僵的手，脸上露出了笑容。肉在火上“滋滋”地响，香味飘得老远。远处的狼看见火光，夹着尾巴逃走了。人们望着普罗米修斯，眼里满是感激。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    buildNames();
    buildMap();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.querySelector('#theater')) updateTheater(slide, step);
  },
};
