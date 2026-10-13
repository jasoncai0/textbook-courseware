'use strict';
/* 诗词三首 · 本课数据。诗文模板见 ../shared/poem.js；三首诗三种呈现：
 * 行路难——情感起伏折线；酬乐天——沉舟病树“情感天平”（意象翻转）；水调歌头——问月—怨月—宽月三段月相 */

const POEMS = {
  xln: {
    title: '行路难（其一）', author: '［唐］李白',
    notes: {
      金樽: '对酒杯的美称', 斗十千: '一斗值十千钱，形容酒美价贵', 珍羞: '美味的食物。羞，同“馐”', 直: '同“值”，价值', 投箸: '放下筷子',
      冰塞川: '坚冰堵塞了河道（塞读 sè）', 垂钓碧溪上: '相传姜太公遇周文王前曾在磻溪垂钓', 梦日边: '相传伊尹受商汤任用前，曾梦见乘船经过太阳旁边',
      今安在: '如今身处何方？也可理解为：现在要走的路在哪里？', 长风破浪: '比喻终将实现远大理想', 会: '终将', 云帆: '高高的帆', 济: '渡',
    },
    lines: [
      { t: '金樽清酒斗十千，', r: '金樽/清酒/斗十千，', f: '1.08 50% 50%' },
      { t: '玉盘珍羞直万钱。', r: '玉盘/珍羞/直万钱。' },
      { t: '停杯投箸不能食，', r: '停杯/投箸/不能食，' },
      { t: '拔剑四顾心茫然。', r: '拔剑/四顾/心茫然。' },
      { t: '欲渡黄河冰塞川，', r: '欲渡/黄河/冰塞川，' },
      { t: '将登太行雪满山。', r: '将登/太行/雪满山。' },
      { t: '闲来垂钓碧溪上，', r: '闲来/垂钓/碧溪上，' },
      { t: '忽复乘舟梦日边。', r: '忽复/乘舟/梦日边。' },
      { t: '行路难，行路难，', r: '行路难，行路难，' },
      { t: '多歧路，今安在？', r: '多歧路，今安在？' },
      { t: '长风破浪会有时，', r: '长风/破浪/会有时，', f: '1.2 50% 45%' },
      { t: '直挂云帆济沧海。', r: '直挂/云帆/济沧海。' },
    ],
  },
  cpl: {
    title: '酬乐天扬州初逢席上见赠', author: '［唐］刘禹锡',
    notes: {
      巴山楚水: '诗人曾被贬夔州、朗州等地，古属巴郡、楚地', 二十三年: '从被贬到写此诗，共二十二个年头，第二年才能回到洛阳，所以说“二十三年”',
      弃置身: '指遭受贬谪的诗人自己', 闻笛赋: '指向秀怀念亡友嵇康所作的《思旧赋》', 翻似: '反而好像', 烂柯人: '指晋人王质，观棋终局，斧柄已朽，回村已过百年',
      歌一曲: '指白居易的《醉赠刘二十八使君》', 长: '增长，振作（读 zhǎng）',
    },
    lines: [
      { t: '巴山楚水凄凉地，', r: '巴山/楚水/凄凉地，' },
      { t: '二十三年弃置身。', r: '二十/三年/弃置身。' },
      { t: '怀旧空吟闻笛赋，', r: '怀旧/空吟/闻笛赋，' },
      { t: '到乡翻似烂柯人。', r: '到乡/翻似/烂柯人。' },
      { t: '沉舟侧畔千帆过，', r: '沉舟/侧畔/千帆过，', f: '1.18 40% 55%' },
      { t: '病树前头万木春。', r: '病树/前头/万木春。', f: '1.18 65% 50%' },
      { t: '今日听君歌一曲，', r: '今日/听君/歌一曲，' },
      { t: '暂凭杯酒长精神。', r: '暂凭/杯酒/长精神。' },
    ],
  },
  sdgt: {
    title: '水调歌头', author: '［宋］苏轼', layout: 'h',
    notes: {
      丙辰: '宋神宗熙宁九年（1076）', 子由: '苏轼的弟弟苏辙，字子由', 宫阙: '宫殿', 归去: '回到天上去', 琼楼玉宇: '美玉砌成的楼宇，指想象中的月中仙宫',
      起舞弄清影: '在月光下起舞，影子也随着舞动', 何似: '哪里比得上', 照无眠: '照着不能入睡的人（指诗人自己）', 绮户: '雕花的门窗（绮读 qǐ）',
      何事: '为什么', 婵娟: '本义指妇女姿态美好的样子，这里指月亮',
    },
    lines: [
      { t: '丙辰中秋，欢饮达旦，大醉，作此篇，兼怀子由。', r: '丙辰/中秋，欢饮/达旦，大醉，作/此篇，兼怀/子由。', y: '丙辰年中秋节，高兴地喝酒直到天亮，喝得大醉，写下这首词，同时怀念弟弟子由。' },
      { t: '明月几时有？把酒问青天。', r: '明月/几时有？把酒/问/青天。', y: '明月从什么时候开始有的？我端起酒杯问青天。' },
      { t: '不知天上宫阙，今夕是何年。', r: '不知/天上/宫阙，今夕/是何年。', y: '不知道天上的宫殿里，今晚是哪一年。' },
      { t: '我欲乘风归去，又恐琼楼玉宇，高处不胜寒。', r: '我欲/乘风/归去，又恐/琼楼/玉宇，高处/不胜寒。', y: '我想乘着风回到天上去，又怕那美玉砌成的楼宇太高，受不住寒冷。' },
      { t: '起舞弄清影，何似在人间。', r: '起舞/弄清影，何似/在人间。', y: '在月光下起舞，影子随我舞动，天上哪里比得上在人间！' },
      { t: '转朱阁，低绮户，照无眠。', r: '转/朱阁，低/绮户，照/无眠。', y: '月儿转过朱红色的楼阁，低低地挂在雕花的门窗上，照着不能入睡的人。' },
      { t: '不应有恨，何事长向别时圆？', r: '不应/有恨，何事/长向/别时圆？', y: '月亮不该有什么怨恨吧，为什么偏在人们离别时圆呢？' },
      { t: '人有悲欢离合，月有阴晴圆缺，此事古难全。', r: '人有/悲欢/离合，月有/阴晴/圆缺，此事/古难全。', y: '人有悲欢离合，月有阴晴圆缺，这样的事自古就难以周全。' },
      { t: '但愿人长久，千里共婵娟。', r: '但愿/人长久，千里/共婵娟。', y: '只希望亲人平安长久，相隔千里也能共同欣赏这美好的月亮。' },
    ],
  },
};
POEMS.xlnR = { title: POEMS.xln.title, author: '李白', lines: POEMS.xln.lines };
POEMS.cplR = { title: POEMS.cpl.title, author: '刘禹锡', lines: POEMS.cpl.lines };
POEMS.sdgtR = { title: POEMS.sdgt.title, author: '苏轼', lines: POEMS.sdgt.lines.slice(1) };
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* ============ 行路难：情感起伏折线（顶层生成，分步才会被 deck.js 统计） ============ */
const WAVE = [
  { t: '金樽清酒斗十千，玉盘珍羞直万钱。', w: '盛宴', v: 62, why: '美酒佳肴，场面热闹——却是送别的宴席。' },
  { t: '停杯投箸不能食，拔剑四顾心茫然。', w: '茫然', v: 30, why: '“停、投、拔、顾”四个动作，写尽内心的苦闷。' },
  { t: '欲渡黄河冰塞川，将登太行雪满山。', w: '受阻', v: 10, why: '冰塞川、雪满山——比喻人生道路上的重重阻碍。' },
  { t: '闲来垂钓碧溪上，忽复乘舟梦日边。', w: '希望', v: 64, why: '想起姜太公、伊尹：他们也曾不得志，后来都被重用。' },
  { t: '行路难，行路难，多歧路，今安在？', w: '迷惘', v: 24, why: '短促的三字句连用，像一声声急切的追问。' },
  { t: '长风破浪会有时，直挂云帆济沧海。', w: '坚信', v: 96, why: '终有一天乘长风破万里浪，扬帆渡过沧海——自信豪迈。' },
];
const WV = { x0: 90, dx: 128, y0: 330, k: 2.8 };
const wx = (i) => WV.x0 + i * WV.dx;
const wy = (v) => WV.y0 - v * WV.k;

function buildWave() {
  const svg = document.getElementById('waveSvg');
  const segs = WAVE.slice(1).map((p, i) => `<line class="wv-seg" data-step="${i + 2}" x1="${wx(i)}" y1="${wy(WAVE[i].v)}" x2="${wx(i + 1)}" y2="${wy(p.v)}"/>`).join('');
  const dots = WAVE.map((p, i) => `<g class="wv-pt${p.v > 50 ? ' up' : ''}" data-step="${i + 1}" data-i="${i}"><circle cx="${wx(i)}" cy="${wy(p.v)}" r="13"/><text x="${wx(i)}" y="${wy(p.v) + (p.v > 50 ? -24 : 38)}">${p.w}</text></g>`).join('');
  svg.innerHTML = `<line x1="40" y1="${wy(50)}" x2="780" y2="${wy(50)}" class="wv-mid"/>
    <text x="14" y="${wy(92)}" class="wv-y">昂扬</text><text x="14" y="${wy(4)}" class="wv-y">低沉</text>
    ${WAVE.map((p, i) => `<text x="${wx(i)}" y="368" class="wv-x">${['一', '二', '三', '四', '五', '六'][i]}</text>`).join('')}
    ${segs}${dots}`;
}
buildWave();

function showWave(i) {
  const p = WAVE[i];
  document.querySelectorAll('.wv-pt').forEach((g) => g.classList.toggle('sel', +g.dataset.i === i));
  document.getElementById('waveInfo').innerHTML = `<b class="wv-line">${p.t}</b><span>${p.w}：${p.why}</span>`;
}

function initWave() {
  document.getElementById('waveSvg').addEventListener('click', (e) => {
    const g = e.target.closest('.wv-pt');
    if (g) showWave(+g.dataset.i);
  });
}

function updateWave(slide, step) {
  if (!slide.querySelector('#waveSvg') || step < 1) return;
  showWave(Math.min(step, WAVE.length) - 1);
}

/* ============ 酬乐天：情感天平 ============ */
// 左盘（沉舟、病树）每件重 1，右盘（千帆、万木）每件重 2：放上“千帆”时持平，再放“万木春”就压向振作一侧
function updateScale(slide, step) {
  const beam = slide.querySelector('#scaleBeam');
  if (!beam) return;
  const left = Math.min(step, 2);
  const right = Math.max(0, Math.min(step - 2, 2));
  const deg = (right * 2 - left) * 6;
  beam.style.transform = `rotate(${deg}deg)`;
  slide.querySelectorAll('.sc-pan').forEach((p) => { p.style.transform = `rotate(${-deg}deg)`; });
  slide.querySelector('.sc-read').textContent = deg < 0 ? '偏向：悲凉' : deg > 0 ? '偏向：振作' : '持平';
}

/* ============ 水调歌头：问月—怨月—宽月 ============ */
function setPhase(slide, k) {
  slide.dataset.ph = k;
  slide.querySelectorAll('.ym-card').forEach((c) => c.classList.toggle('sel', +c.dataset.ph === k));
}

function initMoon() {
  const slide = document.querySelector('.s-moon');
  slide.querySelectorAll('.ym-card').forEach((c) => c.addEventListener('click', () => setPhase(slide, +c.dataset.ph)));
}

function updateMoon(slide, step) {
  if (!slide.classList.contains('s-moon')) return;
  setPhase(slide, Math.min(step, 3));
}

/* ============ 背诵：选诗 ============ */
function initRecitePick() {
  const pick = document.getElementById('rcPick');
  const boxes = [...document.querySelectorAll('.rc-boxes .recite')];
  pick.innerHTML = boxes.map((b, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">${POEMS[b.dataset.recite].title}</button>`).join('');
  pick.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    boxes.forEach((x, i) => { x.hidden = i !== +b.dataset.i; });
    pick.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
  });
}

const MOMENTS = [
  {
    name: '行路难', pic: 'yunfan',
    prompt: '积累拓展五：以《行路难》为例，谈谈你从中得到的人生启示。',
    hint: '抓住情感的“起”与“落”：遇到“冰塞川”“雪满山”时，李白是怎样重新站起来的？联系自己的一次挫折。',
    example: '李白也有“拔剑四顾心茫然”的时候，可他没有停在谷底，而是想起姜太公、伊尹，最后唱出“长风破浪会有时”。考试失利那天，我也觉得前路被雪封住了。但路难走，不等于没有路——先承认难，再相信“会有时”。',
  },
  {
    name: '酬乐天', pic: 'chenzhou',
    prompt: '积累拓展五：以《酬乐天扬州初逢席上见赠》为例，谈谈你从中得到的人生启示。',
    hint: '刘禹锡把自己比作“沉舟”“病树”，却看到了“千帆过”“万木春”。换一个角度看自己的处境，会有什么不同？',
    example: '二十三年的贬谪，刘禹锡没有只盯着自己这只“沉舟”，而是看见了旁边的“千帆”。世界不会因为一个人的失意停下来，这既让人清醒，也给人力量：与其怨，不如“暂凭杯酒长精神”，重新出发。',
  },
  {
    name: '水调歌头', pic: 'mingyue',
    prompt: '积累拓展五：以《水调歌头》为例，谈谈你从中得到的人生启示。',
    hint: '从“怨月”到“宽月”，苏轼是怎样说服自己的？“但愿人长久”可以送给谁？',
    example: '苏轼也会埋怨月亮“何事长向别时圆”，但他很快想通了：人有离合，月有圆缺，自古难全。接受不完美，再把祝福送出去——“千里共婵娟”。中秋不能和远方的亲人团聚时，我也可以抬头看看同一轮月亮。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    Poem.init();
    initWave();
    initMoon();
    initRecitePick();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateWave(slide, step);
    updateScale(slide, step);
    updateMoon(slide, step);
  },
};
