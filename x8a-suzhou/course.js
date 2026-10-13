'use strict';
/* 苏州园林 · 本课数据与专属互动：找中心句、“画框”总分结构图（四个讲究 + 三处细节）、图案画/美术画、换墙看“隔而不隔” */

const FRAME = {
  buju: { pic: 'chizhao', h: '第 3 段 · 布局', s: '我国的建筑……绝大部分是对称的……苏州园林可绝不讲究对称，好像故意避免似的。', p: '东边有了亭子或回廊，西边决不会来一个同样的。对称的建筑是图案画，园林是美术画，要求自然之趣。' },
  peihe: { pic: 'chizhao', h: '第 4 段 · 配合', s: '苏州园林里都有假山和池沼。', p: '假山的堆叠是艺术而不仅是技术，让人“忘却苏州城市，只觉得身在山间”；池沼引用活水，桥梁一座一个样，岸边高低屈曲任其自然，“鱼戏莲叶间”又是入画的一景。' },
  yingchen: { pic: 'jiashan', h: '第 5 段 · 映衬', s: '苏州园林栽种和修剪树木也着眼在画意。', p: '高树与低树俯仰生姿；落叶树与常绿树相间，花时不同的花树相间，四季不寂寞；不修剪成宝塔，不种阅兵式的道旁树；古藤盘曲嶙峋就是一幅好画。' },
  cengci: { pic: 'louchuang', h: '第 6 段 · 层次', s: '游览苏州园林必然会注意到花墙和廊子。', p: '墙壁隔着，廊子界着，层次多了，景致就见得深了；镂空花墙、无所依傍的廊子，隔而不隔，界而未界；大镜子“把整个园林翻了一番”。' },
  jiaoluo: { pic: 'jiaoluo', h: '第 7 段 · 角落', s: '……苏州园林在每一个角落都注意图画美。', p: '阶砌旁几丛书带草，墙上爬山虎、蔷薇木香，窗对白墙就补几竿竹子、几棵芭蕉——极小的局部也能得到美的享受。' },
  menchuang: { pic: 'louchuang', h: '第 8 段 · 门和窗', s: '苏州园林里的门和窗，图案设计和雕镂琢磨功夫都是工艺美术的上品。', p: '尽量工细而决不庸俗，即使简朴而别具匠心；综合起来看是高度的图案美，摄影家挺喜欢。' },
  secai: { pic: 'chizhao', h: '第 9 段 · 色彩', s: '苏州园林与北京的园林不同，极少使用彩绘。', p: '梁柱门窗漆广漆，墙壁白色，屋瓦檐漏淡灰色，与草木的绿色配合，引起安静闲适的感觉；花开时节，更显得花明艳照眼。' },
};

function initFrame() {
  const pic = document.getElementById('fmPic');
  const detail = document.getElementById('fmDetail');
  pic.dataset.bg = 'assets/chizhao.jpg';
  document.querySelector('.fm').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    const f = FRAME[b.dataset.k];
    document.querySelectorAll('.fm [data-k]').forEach((x) => x.classList.toggle('sel', x === b));
    pic.style.backgroundImage = `url('assets/${f.pic}.jpg')`;
    detail.innerHTML = `<b>${f.h}</b><br><span class="lead">段首句：${f.s}</span><br>${f.p}`;
  });
}

const GE = {
  none: '<b>什么都不隔：</b>站在这里一眼看到底，竹子、亭子、池塘全摆在眼前——景致浅，没有“深”的感觉。',
  wall: '<b>一道实墙：</b>全隔死了，墙那边的景色一点也看不到，游览者被挡在外面。',
  lou: '<b>花墙 + 漏窗：</b>墙把园子分成前后两层，可透过镂空图案又能隐约看见竹子、亭子——<b>隔而不隔</b>，越看越想往里走。',
  lang: '<b>一条廊子：</b>廊子两边无所依傍，柱子之间望得见对面的景色——划出了界，却没有隔断，<b>界而未界</b>。',
};
function initGe() {
  const svg = document.getElementById('geSvg');
  const info = document.getElementById('geInfo');
  const set = (m) => {
    svg.dataset.mode = m;
    document.querySelectorAll('#geBtns .btn').forEach((b) => b.classList.toggle('solid', b.dataset.m === m));
    info.innerHTML = GE[m];
  };
  document.getElementById('geBtns').addEventListener('click', (e) => { const b = e.target.closest('[data-m]'); if (b) set(b.dataset.m); });
  set('lou');
}

const PICKS = {
  key: [
    { t: '苏州园林是我国各地园林的标本', ok: false, why: '这是苏州园林的地位' },
    { t: '务必使游览者无论站在哪个点上，眼前总是一幅完美的图画', ok: true, why: '中心句：整体特征是“图画美”' },
    { t: '苏州园林可绝不讲究对称，好像故意避免似的', ok: false, why: '这只是“布局”一个方面' },
    { t: '苏州园林在每一个角落都注意图画美', ok: false, why: '这是对局部的补充' },
    { t: '游览者来到园里，没有一个不心里想着口头说着“如在画图中”的', ok: false, why: '这是游客的感受，印证特征' },
  ],
};

const CLUES = [
  { q: '课文多数段的首句是对本段内容的概括。这样写有什么好处？（思考探究二）', a: '读者一读首句就抓住段意；各段首句连起来就是全文提纲，条理清楚，总分结构一目了然。' },
  { q: '“苏州园林是我国各地园林的<b>标本</b>”——“标本”在这里是什么意思？', a: '本指保持原样供研究的动植物、矿物；这里指苏州园林是最有代表性的典范，各地园林都受它影响，要鉴赏中国园林就不该错过。' },
  { q: '“<b>图案画</b>”和“<b>美术画</b>”有什么区别？', a: '图案画讲究整齐对称、有规则；美术画追求自然之趣，不讲究对称。作者用它打比方，说明园林布局为什么不对称。' },
  { q: '假山的堆叠，是一项<b>艺术</b>而不仅是<b>技术</b>。“艺术”和“技术”有什么区别？', a: '技术只管把石头堆稳；艺术要有构思与意境，要设计者“胸中有丘壑”，让人忘却城市、身在山间。“而不仅是”说明技术是基础，艺术是更高的追求。' },
];

const MOMENTS = [
  {
    name: '一座公园', pic: 'chizhao',
    prompt: '介绍你游览过的一座公园：开头一句总说它最大的特点，再分几个方面说明。',
    hint: '可以按“布局—水景—花木—细节”的顺序；每段开头用一句话概括。',
    example: '人民公园最大的特点是“绿”。\n公园的布局以湖为中心。湖面占了全园将近一半……\n湖边的树木四季常绿。香樟、桂树……\n就连路边的垃圾桶也刷成了树桩的样子……',
  },
  {
    name: '我们的校园', pic: 'jiaoluo',
    prompt: '介绍你的校园，抓住一个主要特点，先总后分。',
    hint: '先找“特征句”，再从整体到局部：整体布局 → 主要建筑 → 一个有意思的角落。',
    example: '我们的校园不大，却处处是“书香”。\n走进校门，正对着的是图书馆……\n教学楼的走廊里，每一层都有开放书架……\n连操场边的长椅背上，也刻着一句诗……',
  },
  {
    name: '一座建筑', pic: 'louchuang',
    prompt: '介绍一座你熟悉的建筑（祠堂、老街、博物馆……），用“先总说再分别说明”的写法。',
    hint: '注意用准确的词：“大约”“几乎”“绝大部分”……',
    example: '老街口的祠堂是全村最古老的建筑，大约有两百年的历史。\n祠堂坐北朝南，前后共三进……\n最精彩的是门窗上的木雕……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, clues: CLUES, clueLabels: ['想一想', '参考理解'], moments: MOMENTS });
    initFrame();
    initGe();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
