'use strict';
/* 昆明的雨 · 本课数据。本课独有：“雨”串起的意象情感线（雨丝 + 珠子） */

const BEADS = [
  { n: '雨季', ic: '☂', pic: '', q: '昆明的雨季是明亮的、丰满的，使人动情的。……昆明的雨季，是浓绿的。', mei: '景物的美', qing: '总写：明亮、丰满、浓绿' },
  { n: '仙人掌', ic: '🌵', pic: 'xianrenzhang', q: '仙人掌悬空倒挂，尚能存活开花。……昆明仙人掌多，且极肥大。', mei: '景物的美', qing: '生命顽强，雨季湿润——赞叹' },
  { n: '菌子', ic: '🍄', pic: '', q: '昆明菌子极多。……牛肝菌色如牛肝，滑，嫩，鲜，香，很好吃。', mei: '滋味的美', qing: '如数家珍——喜爱' },
  { n: '杨梅', ic: '●', pic: 'yangmei', q: '卖杨梅的都是苗族女孩子……不时吆喝一声：“卖杨梅——”声音娇娇的。', mei: '滋味的美 · 人情的美', qing: '“火炭梅”“声音娇娇的”——亲切' },
  { n: '缅桂花', ic: '✿', pic: '', q: '有时送来一个七寸盘子，里面摆得满满的缅桂花！带着雨珠的缅桂花使我的心软软的。', mei: '人情的美', qing: '房东母女送花——温暖' },
  { n: '木香花', ic: '❀', pic: 'muxiang', q: '密匝匝的细碎的绿叶，数不清的半开的白花和饱涨的花骨朵，都被雨水淋得湿透了。', mei: '氛围的美', qing: '雨中小酒店，坐到午后——淡淡的乡愁、情味' },
  { n: '我想念昆明的雨', ic: '♥', pic: 'xianrenzhang', q: '我想念昆明的雨。（首尾各一次）', mei: '情感线索', qing: '对昆明生活的喜爱与想念' },
];
// 珠子在 deck.js 统计分步之前生成
document.getElementById('beads').innerHTML = BEADS.map((b, i) => `<button type="button" class="bead${i === BEADS.length - 1 ? ' last' : ''}" data-step="${i + 1}" data-i="${i}"><i>${b.ic}</i><span>${b.n}</span></button>`).join('');

function showBead(i) {
  const b = BEADS[i];
  document.querySelectorAll('.bead').forEach((x, k) => x.classList.toggle('cur', k === i));
  document.getElementById('thPic').style.backgroundImage = b.pic ? `url('assets/${b.pic}.jpg')` : 'none';
  document.getElementById('thPic').classList.toggle('empty', !b.pic);
  document.getElementById('thPic').dataset.ic = b.ic;
  document.getElementById('thName').textContent = b.n;
  document.getElementById('thQuote').textContent = b.q;
  document.getElementById('thMei').textContent = b.mei;
  document.getElementById('thQing').textContent = b.qing;
}
function initBeads() {
  document.getElementById('beads').addEventListener('click', (e) => {
    const b = e.target.closest('.bead');
    if (b && b.classList.contains('on')) showBead(+b.dataset.i);
  });
}
function updateThread(slide, step) {
  if (!slide.classList.contains('s-thread')) return;
  document.getElementById('thCard').classList.toggle('show', step > 0);
  if (step > 0) showBead(Math.min(step, BEADS.length) - 1);
}

const POEMS = {
  muxiang: {
    title: '', author: '汪曾祺 · 四十年后作',
    lines: [{ t: '莲花池外少行人，', r: '莲花池外/少行人，' }, { t: '野店苔痕一寸深。', r: '野店/苔痕/一寸深。' }, { t: '浊酒一杯天过午，', r: '浊酒/一杯/天过午，' }, { t: '木香花湿雨沉沉。', r: '木香花湿/雨沉沉。' }],
    notes: { 苔痕: '青苔的痕迹，可见雨多、人少', 浊酒: '用糯米、黄米等酿制的酒，较混浊' },
  },
};
Poem.render(POEMS);

const KINDS = ['景物的美', '滋味的美', '人情的美', '氛围的美'];
const SORT = [
  { s: '草木的枝叶里的水分都到了饱和状态，显示出过分的、近于夸张的旺盛。', ok: ['景物的美'], q: '浓绿的雨季，生机旺盛' },
  { s: '把草茎松毛择净，撕成蟹腿肉粗细的丝，和青辣椒同炒，入口便会使你张目结舌。', ok: ['滋味的美'], q: '干巴菌：中吃不中看' },
  { s: '昆明的杨梅很大……颜色黑红黑红的，叫作“火炭梅”。', ok: ['滋味的美'], q: '像一球烧得炽红的火炭，一点都不酸' },
  { s: '她大概是怕房客们乱摘她的花，时常给各家送去一些。', ok: ['人情的美'], q: '房东送花，含蓄的人情' },
  { s: '她们的声音使得昆明雨季的空气更加柔和了。', ok: ['人情的美'], q: '苗族女孩娇娇的吆喝声' },
  { s: '酒店有几只鸡，都把脑袋反插在翅膀下面，一只脚着地，一动也不动地在檐下站着。', ok: ['氛围的美'], q: '雨天的静，悠闲的情味' },
];

const MOMENTS = [
  {
    name: '批注“缅桂花”', pic: 'xianrenzhang',
    prompt: '“带着雨珠的缅桂花使我的心软软的，不是怀人，不是思乡。”给这句话写一段批注。',
    hint: '可以从“软软的”这个词入手：为什么心会“软”？“不是怀人，不是思乡”又是什么？',
    example: '“软软的”用得妙：带着雨珠的花是湿的、柔的，房东送花的心意也是柔的。作者特意说“不是怀人，不是思乡”，那是什么呢？是被生活中的一点美、一点人情轻轻打动的感觉——说不清，却很真。',
  },
  {
    name: '批注“菌子”', pic: 'muxiang',
    prompt: '给写干巴菌的那几句话写批注：“乍一看那样子，真叫人怀疑：这种东西也能吃？！……这东西这么好吃？！”',
    hint: '注意两个“？！”和前后的对比，体会作者的语气。',
    example: '两个“？！”前后呼应：先是嫌弃——像半干的牛粪、踩破的马蜂窝；后是惊喜——这么好吃！一贬一扬，像在饭桌上和朋友聊天，干巴菌的“中吃不中看”一下子活了。',
  },
  {
    name: '写写我家乡的雨', pic: 'yangmei',
    prompt: '学汪曾祺的写法，写一写你家乡雨季（或某个季节）里的一样东西，写出它的美和你的情。',
    hint: '不必写雨本身，写雨天里的一样吃的、一种花或一个人；语言像聊天一样自然。',
    example: '我们这儿梅雨天最多的是杨梅……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: KINDS, moments: MOMENTS });
    Poem.init();
    initBeads();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateThread(slide, step);
  },
};
