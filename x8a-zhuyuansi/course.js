'use strict';
/* 与朱元思书 · 本课数据。诗文模板（横排 + 译文）见 ../shared/poem.js；本课独有“奇山异水分写结构树” */

const POEMS = {
  zhu: {
    title: '与朱元思书', author: '［南朝］吴均', layout: 'h',
    lines: [
      { t: '风烟俱净，天山共色。', r: '风烟/俱净，天山/共色。', y: '风和烟雾都消散尽净，天空和群山呈现同样的颜色。' },
      { t: '从流飘荡，任意东西。', r: '从流/飘荡，任意/东西。', y: '（我乘着船）随着江流漂荡，任凭船随意向东或向西漂流。' },
      { t: '自富阳至桐庐一百许里，奇山异水，天下独绝。', r: '自/富阳/至/桐庐/一百许里，奇山/异水，天下/独绝。', y: '从富阳到桐庐一百里左右，奇异的山水，天下独一无二。' },
      { t: '水皆缥碧，千丈见底。', r: '水/皆/缥碧，千丈/见底。', y: '江水都是浅青色的，千丈深也能看见水底。' },
      { t: '游鱼细石，直视无碍。', r: '游鱼/细石，直视/无碍。', y: '游动的鱼儿和细小的石头，可以一直看下去，毫无阻碍。' },
      { t: '急湍甚箭，猛浪若奔。', r: '急湍/甚箭，猛浪/若奔。', y: '湍急的水流比箭还快，凶猛的巨浪像飞奔的马。' },
      { t: '夹岸高山，皆生寒树，负势竞上，互相轩邈，争高直指，千百成峰。', r: '夹岸/高山，皆生/寒树，负势/竞上，互相/轩邈，争高/直指，千百/成峰。', y: '两岸的高山上，都长着密密的绿树，叫人心生寒意；山峦凭借高峻的地势争着向上，仿佛都在争着往高处远处伸展，笔直地直插云天，形成千百座山峰。' },
      { t: '泉水激石，泠泠作响；好鸟相鸣，嘤嘤成韵。', r: '泉水/激石，泠泠/作响；好鸟/相鸣，嘤嘤/成韵。', y: '泉水冲击着石头，发出泠泠的清越声响；美丽的鸟儿相互和鸣，嘤嘤的叫声和谐动听。' },
      { t: '蝉则千转不穷，猿则百叫无绝。', r: '蝉则/千转/不穷，猿则/百叫/无绝。', y: '蝉长久地叫个不停，猿也长久地啼叫不止。' },
      { t: '鸢飞戾天者，望峰息心；经纶世务者，窥谷忘反。', r: '鸢飞/戾天者，望峰/息心；经纶/世务者，窥谷/忘反。', y: '像老鹰飞上天空一样极力追求名利的人，望见这些山峰，就会平息追名逐利的心；忙于治理政务的人，看到这些山谷，就会流连忘返。' },
      { t: '横柯上蔽，在昼犹昏；疏条交映，有时见日。', r: '横柯/上蔽，在昼/犹昏；疏条/交映，有时/见日。', y: '横斜的树枝在上面遮蔽着，白天也像黄昏一样昏暗；稀疏的枝条互相掩映，有时也能看见阳光。' },
    ],
    notes: {
      共色: '同样的颜色', 从流: '从流飘荡：（乘船）随着江流漂荡。从，跟、随', 东西: '任意东西：任凭船随意向东或向西漂流。东西，向东或向西',
      许: '表示约数', 缥碧: '浅青色（缥读 piǎo）', 甚箭: '即“甚于箭”，比箭还快', 寒树: '这里形容树密而绿，让人心生寒意',
      负势: '负势竞上：山峦凭借（高峻的）地势，争着向上', 轩邈: '这些山峦仿佛都在争着往高处远处伸展。轩，高；邈（miǎo），远。这里均作动词用',
      直指: '笔直地向上，直插云天', 成峰: '千百成峰：形成千百座山峰', 激: '冲击，撞击', 泠泠: '拟声词，形容水声清越（读 líng líng）',
      嘤嘤: '嘤嘤成韵：鸣声嘤嘤，和谐动听。嘤嘤，鸟鸣声', 千转: '长久不断地叫。千，表示多；转（zhuàn），同“啭”，鸟鸣，这里指蝉鸣',
      鸢飞: '鸢飞戾天：鸢（yuān）鸟飞到天上，这里比喻极力追求名利。戾（lì），至、到达', 息心: '指平息名利之心',
      经纶: '经纶世务：治理国家大事。经纶，筹划、治理', 反: '同“返”，返回', 横柯: '横斜的树枝。柯，树木的枝干', 交映: '互相掩映',
    },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* 结构树叶子：原文、画面、写法 */
const LEAVES = {
  qing: { pic: 'shui', t: '水皆缥碧，千丈见底。游鱼细石，直视无碍。', w: '静态 · 清：“缥碧”写颜色，“千丈见底”用夸张，“游鱼细石，直视无碍”从侧面写水清。' },
  ji: { pic: 'shui', t: '急湍甚箭，猛浪若奔。', w: '动态 · 急：把急流比作箭、把猛浪比作奔马，比喻加夸张，写出水势之猛。' },
  xing: { pic: 'shan', t: '夹岸高山，皆生寒树，负势竞上，互相轩邈，争高直指，千百成峰。', w: '山势 · 奇：“竞上”“轩邈”“争高”用拟人，静止的山仿佛在比赛往上长，写出山的动态和气势。' },
  sheng: { pic: 'shan', t: '泉水激石，泠泠作响；好鸟相鸣，嘤嘤成韵。蝉则千转不穷，猿则百叫无绝。', w: '山中之声：泉声、鸟鸣、蝉唱、猿啼，像一支山间交响曲，写出山的生机。' },
  qing2: { pic: 'ke', t: '鸢飞戾天者，望峰息心；经纶世务者，窥谷忘反。', w: '面对山谷的感想：连追名逐利的人都忘了名利——侧面写山水的魅力，抒发作者的情怀。' },
  guang: { pic: 'ke', t: '横柯上蔽，在昼犹昏；疏条交映，有时见日。', w: '林中光影：枝叶浓密，白天也昏暗；偶尔透进阳光——明暗交错，幽深迷人。' },
};
function showLeaf(k) {
  const d = LEAVES[k];
  document.querySelectorAll('.tr-leaf').forEach((b) => b.classList.toggle('on-leaf', b.dataset.k === k));
  document.getElementById('trPic').style.backgroundImage = `url('assets/${d.pic}.jpg')`;
  document.getElementById('trText').textContent = d.t;
  document.getElementById('trWhy').textContent = d.w;
}
function initTree() {
  document.querySelector('.tr').addEventListener('click', (e) => {
    const b = e.target.closest('.tr-leaf');
    if (b) showLeaf(b.dataset.k);
  });
}
// 按 → 时，右侧详情跟着出现的层级走
function updateTree(slide, step) {
  if (!slide.classList.contains('s-tree')) return;
  const box = document.getElementById('trDetail');
  box.classList.toggle('show', step >= 1);
  if (step >= 5) showLeaf('xing');
  else if (step >= 3) showLeaf('qing');
  else if (step >= 1) {
    document.querySelectorAll('.tr-leaf').forEach((b) => b.classList.remove('on-leaf'));
    document.getElementById('trPic').style.backgroundImage = "url('assets/shui.jpg')";
    document.getElementById('trText').textContent = '风烟俱净，天山共色。从流飘荡，任意东西。自富阳至桐庐一百许里，奇山异水，天下独绝。';
    document.getElementById('trWhy').textContent = '总写：先写乘船所见的天色山色，再用“奇山异水，天下独绝”总领全文。';
  }
}

/* 天平：第 2 步起向“山水”一侧倾斜 */
function updateScale(slide, step) {
  if (!slide.classList.contains('s-scale')) return;
  slide.querySelector('#scaleSvg').classList.toggle('tilt', step >= 2);
}

/* 词类活用 */
const HUO = [
  { w: '东西', s: '任意<em>东西</em>', from: '方位名词', to: '动词', m: '向东漂流、向西漂流' },
  { w: '上', s: '负势竞<em>上</em>', from: '方位名词', to: '动词', m: '向上，指山峦争着向上长' },
  { w: '上', s: '横柯<em>上</em>蔽', from: '方位名词', to: '状语', m: '在上面（遮蔽）' },
  { w: '轩 · 邈', s: '互相<em>轩邈</em>', from: '形容词', to: '动词', m: '往高处、远处伸展' },
];
function initHuo() {
  const box = document.getElementById('hy');
  box.innerHTML = HUO.map((h) => `<button type="button" class="hy-card"><span class="hy-s">${h.s}</span>
    <span class="hy-flow"><i>${h.from}</i><b>→</b><i class="to">${h.to}</i></span><span class="hy-m">${h.m}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.hy-card');
    if (c) c.classList.toggle('open');
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    Poem.init();
    initTree();
    initHuo();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateTree(slide, step);
    updateScale(slide, step);
  },
};
