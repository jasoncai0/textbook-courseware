'use strict';
/* 湖心亭看雪 · 本课数据。诗文模板（横排 + 译文）见 ../shared/poem.js；
 * 本课独有：白描量词“一痕—一点—一芥—两三粒”的镜头由远及近缩放（SVG 雪湖，镜头一级级推近） */

const NOTES = {
  崇祯五年: '公元 1632 年。崇祯，明思宗年号', 更定: '晚上八时左右（更读 gēng）', 拏: '撑（船）（读 ná）', 拥毳衣炉火: '裹着裘皮衣服，围着火炉（毳读 cuì）',
  雾凇沆砀: '冰花周围弥漫着白汽（读 wù sōng hàng dàng）', 长堤一痕: '西湖长堤在雪中隐隐露出一道痕迹', 焉得更有此人: '哪能还有这样的人呢！焉得，哪能。更，还',
  三大白: '三大杯酒。白，古人罚酒时用的酒杯', 客此: '客居此地', 舟子: '船夫', 相公: '旧时对士人的尊称',
};

const LINES = [
  { t: '崇祯五年十二月，余住西湖。', r: '崇祯/五年/十二月，余/住/西湖。', y: '崇祯五年十二月，我住在西湖。' },
  { t: '大雪三日，湖中人鸟声俱绝。', r: '大雪/三日，湖中/人鸟声/俱绝。', y: '接连下了几天大雪，湖中行人和飞鸟的声音都消失了。' },
  { t: '是日更定矣，余拏一小舟，拥毳衣炉火，独往湖心亭看雪。', r: '是日/更定矣，余/拏/一小舟，拥/毳衣/炉火，独往/湖心亭/看雪。', y: '这一天晚上八点左右，我撑着一只小船，裹着皮衣，带着火炉，独自前往湖心亭看雪。' },
  { t: '雾凇沆砀，天与云与山与水，上下一白，湖上影子，惟长堤一痕、湖心亭一点、与余舟一芥、舟中人两三粒而已。', r: '雾凇/沆砀，天/与云/与山/与水，上下/一白，湖上/影子，惟/长堤/一痕、湖心亭/一点、与/余舟/一芥、舟中人/两三粒/而已。', y: '湖上冰花周围弥漫着白汽，天、云、山、水，上上下下全是白茫茫的一片。湖上的影子，只有一道长堤的痕迹、一点湖心亭的轮廓，和我的一叶小船、船中的两三粒人影罢了。' },
  { t: '到亭上，有两人铺毡对坐，一童子烧酒炉正沸。', r: '到/亭上，有/两人/铺毡/对坐，一童子/烧酒/炉正沸。', y: '到了湖心亭上，看见有两个人铺着毡子相对而坐，一个童子正在烧酒，炉上的酒正沸腾。' },
  { t: '见余大喜曰：“湖中焉得更有此人！”拉余同饮。', r: '见余/大喜曰：“湖中/焉得/更有/此人！”拉余/同饮。', y: '他们看见我，非常高兴地说：“想不到湖中还会有这样的人！”拉着我一同饮酒。' },
  { t: '余强饮三大白而别。问其姓氏，是金陵人，客此。', r: '余/强饮/三大白/而别。问/其姓氏，是/金陵人，客此。', y: '我勉强喝了三大杯酒，然后和他们告别。问他们的姓氏，是金陵人，在此地客居。' },
  { t: '及下船，舟子喃喃曰：“莫说相公痴，更有痴似相公者。”', r: '及/下船，舟子/喃喃曰：“莫说/相公痴，更有/痴似/相公者。”', y: '等到下船的时候，船夫喃喃地说：“不要说相公您痴，还有像您一样痴的人呢！”' },
];

const POEMS = {
  hxt: { title: '湖心亭看雪', author: '张岱', layout: 'h', notes: NOTES, lines: LINES },
  hxtR: { title: '湖心亭看雪', author: '张岱', lines: LINES },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* 对联（思考探究三） */
const CLUES = [
  { q: '四季笙歌，尚有穷民悲夜月；<br>六桥花柳，浑无隙地种桑麻。<br><small>——〔明〕胡来朝</small>', a: '不写美景写民生：西湖终年歌舞，可还有穷苦百姓对月悲叹；堤上处处花柳，竟没有空地种桑麻。是讽谏，也是悲悯。' },
  { q: '亭立湖心，俨西子载扁舟，雅称雨奇晴好；<br>席开水面，恍东坡游赤壁，偏宜月白风清。<br><small>——〔明〕郑烨</small>', a: '用西施泛舟、东坡游赤壁两个典故，写湖心亭位置之妙：雨也奇、晴也好，最宜月白风清之夜。' },
  { q: '如月当空，偶以微云点河汉；<br>在人为目，且将秋水剪瞳神。<br><small>——〔明〕张岱</small>', a: '张岱自撰：湖心亭像当空明月边的一点微云，又像人脸上一双秋水般明亮的眼睛——小亭点睛，整个西湖都活了。' },
];

/* ============ 白描镜头：每一步推近一个景物 ============ */
const SHOTS = [
  { s: 1, x: 400, y: 225, w: '俱绝', t: '大雪三日，湖中人鸟声俱绝' },
  { s: 1, x: 400, y: 225, w: '俱绝', t: '大雪三日，湖中人鸟声俱绝' },
  { s: 1, x: 400, y: 225, w: '上下一白', t: '天与云与山与水，上下一白' },
  { s: 1.7, x: 360, y: 252, w: '一痕', t: '长堤一痕' },
  { s: 4.2, x: 548, y: 206, w: '一点', t: '湖心亭一点' },
  { s: 8, x: 300, y: 300, w: '一芥', t: '与余舟一芥' },
  { s: 22, x: 300, y: 296, w: '两三粒', t: '舟中人两三粒而已' },
];
const VB = { w: 800, h: 450 };

function setShot(slide, k) {
  const shot = SHOTS[Math.max(0, Math.min(k, SHOTS.length - 1))];
  const lens = slide.querySelector('#hxLens');
  lens.style.transform = `translate(${VB.w / 2 - shot.x * shot.s}px, ${VB.h / 2 - shot.y * shot.s}px) scale(${shot.s})`;
  slide.querySelector('.hx-word').textContent = shot.w;
  slide.querySelector('.hx-line').textContent = shot.t;
  slide.querySelectorAll('.hx-q').forEach((q) => q.classList.toggle('cur', +q.dataset.k === k));
}

function initLens() {
  const slide = document.querySelector('.s-lens');
  slide.querySelectorAll('.hx-q').forEach((q) => q.addEventListener('click', () => setShot(slide, +q.dataset.k)));
  setShot(slide, 0);
}

function updateLens(slide, step) {
  if (!slide.classList.contains('s-lens')) return;
  setShot(slide, Math.min(step, SHOTS.length - 1));
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['读一读，想一想', '可以这样理解'] });
    Poem.init();
    initLens();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateLens(slide, step);
  },
};
