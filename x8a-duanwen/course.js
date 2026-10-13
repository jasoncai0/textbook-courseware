'use strict';
/* 短文二篇 · 本课数据。诗文模板（横排 + 译文）见 ../shared/poem.js；本课独有“山水色彩拼贴”“积水空明滑块” */

const POEMS = {
  daxie: {
    title: '答谢中书书', author: '［南朝］陶弘景', layout: 'h',
    lines: [
      { t: '山川之美，古来共谈。', r: '山川/之美，古来/共谈。', y: '山川景物的美丽，自古以来就是人们共同谈论的。' },
      { t: '高峰入云，清流见底。', r: '高峰/入云，清流/见底。', y: '高高的山峰直入云端，清澈的溪流可以看见水底。' },
      { t: '两岸石壁，五色交辉。', r: '两岸/石壁，五色/交辉。', y: '两岸的石壁色彩斑斓，交相辉映。' },
      { t: '青林翠竹，四时俱备。', r: '青林/翠竹，四时/俱备。', y: '青葱的林木，翠绿的竹丛，一年四季都有。' },
      { t: '晓雾将歇，猿鸟乱鸣；', r: '晓雾/将歇，猿鸟/乱鸣；', y: '清晨的薄雾将要消散的时候，猿和鸟此起彼伏地鸣叫；' },
      { t: '夕日欲颓，沉鳞竞跃。', r: '夕日/欲颓，沉鳞/竞跃。', y: '夕阳快要落山的时候，潜游水中的鱼儿争相跃出水面。' },
      { t: '实是欲界之仙都。', r: '实是/欲界/之仙都。', y: '这里实在是人间的仙境啊。' },
      { t: '自康乐以来，未复有能与其奇者。', r: '自/康乐/以来，未复/有能与/其奇者。', y: '自从谢灵运以来，再也没有人能够欣赏这奇丽的景色了。' },
    ],
    notes: {
      交辉: '五色交辉：这里形容石壁色彩斑斓，交相辉映', 四时: '四季', 歇: '消散', 颓: '夕日欲颓：夕阳快要落山了。颓，坠落',
      沉鳞: '指水中潜游的鱼', 欲界: '欲界之仙都：人间仙境。欲界，这里指人间；仙都，神仙居住的美好世界',
      康乐: '指南朝宋山水诗人谢灵运，他承袭祖父谢玄的爵位，被封为康乐公', 与: '参与（读 yù）。这里有“欣赏”“领悟”的意思',
    },
  },
  chengtian: {
    title: '记承天寺夜游', author: '［宋］苏轼', layout: 'h',
    lines: [
      { t: '元丰六年十月十二日夜，解衣欲睡，月色入户，欣然起行。', r: '元丰/六年/十月/十二日/夜，解衣/欲睡，月色/入户，欣然/起行。', y: '元丰六年十月十二日夜晚，我脱下衣服正要睡觉，月光照进门里，我高兴地起身出门。' },
      { t: '念无与为乐者，遂至承天寺寻张怀民。', r: '念/无与/为乐者，遂/至/承天寺/寻/张怀民。', y: '想到没有可以一起游乐的人，于是到承天寺去找张怀民。' },
      { t: '怀民亦未寝，相与步于中庭。', r: '怀民/亦/未寝，相与/步于/中庭。', y: '张怀民也还没有睡，我们便一起在院子里散步。' },
      { t: '庭下如积水空明，水中藻、荇交横，盖竹柏影也。', r: '庭下/如/积水/空明，水中/藻、荇/交横，盖/竹柏/影也。', y: '院子里的月光像积满的水一样澄澈透明，水中好像有藻、荇纵横交错，大概是竹子和柏树的影子吧。' },
      { t: '何夜无月？何处无竹柏？但少闲人如吾两人者耳。', r: '何夜/无月？何处/无/竹柏？但/少/闲人/如/吾两人者/耳。', y: '哪一夜没有月光？哪里没有竹子和柏树？只是缺少像我们两个这样的闲人罢了。' },
    ],
    notes: {
      元丰: '元丰六年：公元 1083 年。元丰，宋神宗年号', 念: '考虑，想到', 承天寺: '在今湖北黄冈南', 张怀民: '作者的朋友，当时也贬官在黄州',
      相与: '共同，一起', 中庭: '院子里', 空明: '形容水的澄澈', 荇: '藻、荇（xìng）：均为水生植物', 盖: '大概是', 但: '只是', 耳: '语气词，相当于“罢了”',
    },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* ---------- 山水拼贴：步骤按原文顺序拼，点击短句可单独拼入 / 拿掉 ---------- */
function initCollage() {
  const btns = document.getElementById('clBtns');
  btns.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-l]');
    if (!b) return;
    const layer = document.querySelector(`#collage .cl-layer[data-layer="${b.dataset.l}"]`);
    const show = !layerShown(layer);
    layer.classList.toggle('pin', show);
    layer.classList.toggle('unpin', !show);
    syncCollageBtns();
  });
}
const layerShown = (l) => l.classList.contains('pin') || (l.classList.contains('on') && !l.classList.contains('unpin'));
function syncCollageBtns() {
  document.querySelectorAll('#clBtns button').forEach((b) => {
    b.classList.toggle('on', layerShown(document.querySelector(`#collage .cl-layer[data-layer="${b.dataset.l}"]`)));
  });
}
function updateCollage(slide) {
  if (!slide.classList.contains('s-collage')) return;
  slide.querySelectorAll('.cl-layer').forEach((l) => { if (!l.classList.contains('on')) l.classList.remove('unpin'); });
  syncCollageBtns();
}

/* ---------- 积水空明：滑块 0 = 积水藻荇，100 = 月光竹柏影 ---------- */
function setYard(v) {
  const k = v / 100;
  document.getElementById('ydWater').style.opacity = String(1 - k);
  document.getElementById('ydZao').style.opacity = String(1 - k);
  document.getElementById('ydShadow').style.opacity = String(k);
  document.getElementById('ydTrees').style.opacity = String(k);
}
let yardTimer = null;
function animateYard(to) {
  const range = document.getElementById('yardRange');
  clearInterval(yardTimer);
  yardTimer = setInterval(() => {
    const v = +range.value;
    const nextV = v + Math.sign(to - v) * Math.min(4, Math.abs(to - v));
    range.value = nextV;
    setYard(nextV);
    if (nextV === to) clearInterval(yardTimer);
  }, 30);
}
function initYard() {
  const range = document.getElementById('yardRange');
  range.addEventListener('input', () => { clearInterval(yardTimer); setYard(+range.value); });
  setYard(0);
}
function updateYard(slide, step) {
  if (!slide.classList.contains('s-yard')) return;
  animateYard(step >= 3 ? 100 : 0);
}

/* ---------- 句子长度条形图 ---------- */
const CLAUSES = {
  rhA: ['山川之美', '古来共谈', '高峰入云', '清流见底', '两岸石壁', '五色交辉', '青林翠竹', '四时俱备', '晓雾将歇', '猿鸟乱鸣', '夕日欲颓', '沉鳞竞跃', '实是欲界之仙都', '自康乐以来', '未复有能与其奇者'],
  rhB: ['元丰六年十月十二日夜', '解衣欲睡', '月色入户', '欣然起行', '念无与为乐者', '遂至承天寺寻张怀民', '怀民亦未寝', '相与步于中庭', '庭下如积水空明', '水中藻荇交横', '盖竹柏影也', '何夜无月', '何处无竹柏', '但少闲人如吾两人者耳'],
};
function initBars() {
  Object.entries(CLAUSES).forEach(([id, list]) => {
    document.getElementById(id).innerHTML = list.map((c) => `<div class="rb"><i style="width:${c.length * 9}%"></i><span>${c}</span><b>${c.length}</b></div>`).join('');
  });
}

/* ---------- 炼字 ---------- */
const LIANZI = [
  { s: '山川之美，古来<em>共</em>谈', m: '共：共同。', w: '自古以来人人都在谈论，说明山川之美是公认的；开篇总起，引出下文。' },
  { s: '高峰<em>入</em>云，清流<em>见</em>底', m: '入：进入；见：看得见。', w: '“入”写山之高，直插云霄（仰视）；“见”写水之清，清澈见底（俯视）。' },
  { s: '两岸石壁，五色<em>交辉</em>', m: '交辉：交相辉映。', w: '五种色彩互相映照，写出石壁色彩斑斓、明丽耀眼。' },
  { s: '青林翠竹，四时<em>俱备</em>', m: '俱备：都具备。', w: '一年四季都有青林翠竹，写出四季常青、生机不衰。' },
  { s: '晓雾将<em>歇</em>，猿鸟<em>乱</em>鸣', m: '歇：消散；乱：此起彼伏。', w: '“歇”写晨雾慢慢散去的动态；“乱”写猿鸟争相啼叫，热闹欢快。' },
  { s: '夕日欲<em>颓</em>，沉鳞<em>竞</em>跃', m: '颓：坠落；竞：争相。', w: '“颓”写夕阳缓缓西沉；“竞”写鱼儿争着跃出水面，充满活力。' },
];
function initLianzi() {
  const box = document.getElementById('lz');
  box.innerHTML = LIANZI.map((x) => `<button type="button" class="lz-card"><span class="lz-s">${x.s}</span><span class="lz-a"><b>${x.m}</b>${x.w}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.lz-card');
    if (c) c.classList.toggle('open');
  });
}

const MOMENTS = [
  {
    name: '改写《答谢中书书》', pic: 'shanchuan',
    prompt: '以“我”的口吻，给朋友写一封短信，把信中的山川之美改写成白话散文。',
    hint: '按原文顺序：总说山川之美 → 山、水、石壁、林竹 → 清晨、傍晚 → 人间仙境。补出颜色、声音、动作和你的心情。',
    example: '朋友：\n山川的美，自古以来人们就爱谈论。我这里的山高得插进云里，溪水清得能看见水底的每一块小石子。两岸的石壁上，青的、红的、白的、黄的……颜色交错着闪光。青青的树林、翠绿的竹子，一年四季都那样茂盛。清晨，薄雾正一点点散开，猿猴和鸟儿就争着叫起来；傍晚，夕阳快要沉下山去，水里的鱼儿便一条接一条地跳出水面。这里真是人间的仙境啊！自从谢灵运以后，还有谁能欣赏这样的奇景呢？——我想，你会懂的。',
  },
  {
    name: '改写《记承天寺夜游》', pic: 'tingyue',
    prompt: '把这个月夜改写成一篇白话散文，写出“欣然”“念无与为乐者”和“闲人”的心情变化。',
    hint: '可以加上：月光怎样照进屋里；走去承天寺的路上想了什么；庭中月色给你的错觉；最后的感慨。',
    example: '十月十二日夜里，我脱了衣服正要睡，一片月光忽然从门口淌进来，铺在地上，亮汪汪的。我心里一喜，披衣起身。可是，和谁一起赏月呢？想来想去，只有住在承天寺的怀民了。推开寺门，怀民果然也没睡。我们便在院子里慢慢地走。院里的月光像一池积水，清得透明，水里还有水草纵横交错，轻轻摇着——抬头一看，原来是竹子和柏树的影子。哪一夜没有月亮？哪里没有竹柏？只是少有像我们这样的两个闲人罢了。',
  },
  {
    name: '我的一次“闲人”时刻', pic: 'tingyue',
    prompt: '你有没有在匆忙的生活里，忽然停下来，发现身边的一处美？写下那一刻。',
    hint: '写清楚：什么时候，为什么停下来，看到了什么（抓住特征），心里想到了什么。',
    example: '期末复习的晚上，我做完最后一道题，抬头揉眼睛，忽然看见窗台上那盆薄荷被台灯照着，叶子的影子投在墙上，大大的，一动一动，像一片小树林。我盯着看了好一会儿。原来它一直都在那里，只是我从来没有“闲”下来看过它。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    Poem.init();
    initCollage();
    initYard();
    initBars();
    initLianzi();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateCollage(slide);
    updateYard(slide, step);
  },
};
