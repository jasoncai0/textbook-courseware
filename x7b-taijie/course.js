'use strict';
/* 台阶 · 本课数据与本课独有的“台阶时间线”。通用页面逻辑见 ../shared/narrative.js */

/* 时间线七个节点：台阶级数、父亲的位置（x, y）、心气（0–100）、配图、阶段（0 攒钱 1 建成 2 失落） */
const STAGES = [
  { t: '老台阶：三级青石板', n: 3, at: [410, 226], sit: true, q: '“我们家的台阶低！”父亲又像是对我，又像是自言自语地感叹。这句话他不知说了多少遍。', d: '坐在最高的一级上，脚搁在最低一级——却总觉得台阶低。', spirit: 40, pic: 'laotai', p: 0 },
  { t: '盼：要造高台阶的新屋', n: 3, at: [410, 226], sit: true, q: '父亲老实厚道低眉顺眼累了一辈子，没人说过他有地位，父亲也从没觉得自己有地位。但他日夜盼着，准备着要造一栋有高台阶的新屋。', d: '柳树枝摇来摇去，却摇不散父亲那专注的目光。', spirit: 55, pic: 'laotai', p: 0 },
  { t: '攒：大半辈子的准备', n: 3, at: [150, 276], q: '他今天从地里捡回一块砖，明天可能又捡进一片瓦，再就是往一个黑瓦罐里塞角票。', d: '一个冬天下来，破草鞋堆得超过了台阶。', spirit: 70, pic: 'laotai', p: 0 },
  { t: '造：深秋雾里踏黄泥', n: 3, at: [210, 276], q: '那时已经是深秋，露水很大，雾也很大，父亲浮在雾里。……额头上一会儿就滚满了黄豆大的露珠。', d: '白天陪匠人干，晚上一个人干到半夜——脸上总是挂着笑容。', spirit: 95, pic: 'nihuang', p: 1 },
  { t: '成：九级新台阶', n: 9, at: [250, 276], q: '新台阶砌好了，九级，正好比老台阶高出两倍。……父亲明明该高兴，却露出些尴尬的笑。', d: '就尽力把胸挺得高些，无奈，他的背是驼惯了的。', spirit: 75, pic: 'xintai', p: 1 },
  { t: '不自在：一级级往下挪', n: 9, at: [405, 222], sit: true, q: '第二次他再坐台阶上时就比上次低了一级……便一级级地往下挪，挪到最低一级，他又觉得太低了，干脆就坐到门槛上去。', d: '坐太高了和人打招呼有些不自在。', spirit: 45, pic: 'xintai', p: 2 },
  { t: '失落：“父亲老了”', n: 9, at: [407, 143], sit: true, q: '他那颗很倔的头颅埋在膝盖里半晌都没动……“这人怎么了？”怎么了呢，父亲老了。', d: '挑水闪了腰，很少跨出家门的台阶，一副若有所失的模样。', spirit: 15, pic: 'xintai', p: 2 },
];

const GROUND = 290;
// 台阶从地面往上画到门槛：级数越多，门槛越高
function stepsSvg(n, isNew) {
  const h = (GROUND - (n === 3 ? 240 : 155)) / n;
  return Array.from({ length: n }, (_, i) => {
    const w = 170 - i * (isNew ? 8 : 15);
    const x = 407 - w / 2;
    const y = GROUND - (i + 1) * h;
    return `<rect x="${x.toFixed(0)}" y="${y.toFixed(1)}" width="${w}" height="${h.toFixed(1)}" class="${isNew ? 'st-new' : 'st-old'}"/>`;
  }).join('');
}

let stageNow = -1;
function showStage(i) {
  if (i === stageNow) return;
  stageNow = i;
  const s = STAGES[i];
  const isNew = s.n === 9;
  const $ = (id) => document.getElementById(id);
  $('stepsOld').innerHTML = isNew ? '' : stepsSvg(3, false);
  $('stepsNew').innerHTML = isNew ? stepsSvg(9, true) : '';
  const top = isNew ? 0 : 40;
  const wall = document.querySelector('#stairs .wall');
  const door = document.querySelector('#stairs .door');
  wall.setAttribute('y', top); wall.setAttribute('height', (isNew ? 155 : 240) - top);
  door.setAttribute('y', (isNew ? 155 : 240) - 110);
  $('dad').setAttribute('transform', `translate(${s.at[0]} ${s.at[1]})`);
  $('dad').classList.toggle('sit', Boolean(s.sit));
  $('tlRange').value = i;
  $('tlTitle').textContent = `${i + 1} / ${STAGES.length}　${s.t}`;
  $('tlQuote').textContent = s.q;
  $('tlDad').textContent = s.d;
  $('tlPic').style.backgroundImage = `url('assets/${s.pic}.jpg')`;
  $('tlSpirit').style.width = `${s.spirit}%`;
  document.querySelectorAll('.phase span').forEach((p) => p.classList.toggle('cur', +p.dataset.p === s.p));
}

/* 旁批 */
const CLUE_LABELS = ['原文 · 旁批', '参考思考'];
const CLUES = [
  { q: '父亲总觉得我们家的台阶低。<br><small>旁批：起笔引人思考，父亲为什么“总”有这样的感觉？</small>', a: '台阶的高低象征着地位的高低。“总”字说明这是父亲长久的心病，一句话引出全篇的故事。' },
  { q: '父亲说洗了一次干净的脚，觉得这脚轻飘飘的没着落……<br><small>旁批：如此详写父亲洗脚，是要表现什么？</small>', a: '脚宽大、裂着干沟、一年才洗一次，洗出的是“泥土的颜色”——写出父亲常年劳作的辛苦和与土地的血肉联系。' },
  { q: '柳树枝老是摇来摇去，却摇不散父亲那专注的目光。<br><small>旁批：摇晃的树枝，摇不散的目光。想想父亲此时的心理。</small>', a: '父亲盯着别人家的高台阶，羡慕，也暗暗下了决心：我们家也要有高台阶。' },
  { q: '父亲浮在雾里。……每一根细发都艰难地挑着一颗乃至数颗小水珠……<br><small>旁批：选取一处动词，用一两句话做点评。</small>', a: '“浮”写出雾浓和父亲忙碌的身影；“挑”把头发拟人化，写出父亲起早摸黑、一丝不苟——露珠里全是辛劳。' },
  { q: '第二次他再坐台阶上时就比上次低了一级……<br><small>旁批：造好的新台阶为什么会让父亲如此“不自在”？</small>', a: '低眉顺眼了一辈子，一下子“地位高了”，反而手足无措；也说明他的谦卑、朴实——他要的是尊严，不是高人一等。' },
  { q: '“这人怎么了？”<br><small>旁批：似问非问，心情复杂。</small>', a: '目标实现了，身体却垮了，心里空了——他问自己，也问岁月。“怎么了呢，父亲老了。”是“我”的回答，满含心疼。' },
];

/* 细节点评 */
const MOMENTS = [
  {
    name: '洗脚', pic: 'laotai',
    prompt: '“后来父亲的脚终于洗好了，终于洗出了脚的本色，却也是黄几几的，是泥土的颜色。”',
    hint: '两个“终于”说明什么？“泥土的颜色”让你想到什么？',
    example: '两个“终于”写出脚太难洗，洗出来的“本色”竟是泥土色——父亲一辈子和土地长在一起。',
  },
  {
    name: '踏黄泥', pic: 'nihuang',
    prompt: '“晃破了便滚到额头上，额头上一会儿就滚满了黄豆大的露珠。”',
    hint: '露珠是从哪里来的？“滚满”写出了什么？',
    example: '露珠和汗水混在一起，“滚满”写出天没亮就开工、踏得卖力——这是父亲大半辈子盼来的一天。',
  },
  {
    name: '磕烟灰', pic: 'xintai',
    prompt: '“他抽了一筒，举起烟枪往台阶上磕烟灰，磕了一下，感觉手有些不对劲，便猛然愣住。……于是，他就憋住了不磕。”',
    hint: '以前在青石板上怎么磕？现在为什么“憋住了不磕”？',
    example: '在老台阶上磕了几十年，磕出了深深的凹凼；新台阶太金贵，他舍不得磕，也不习惯——“憋住”里有珍惜，也有拘束。',
  },
  {
    name: '挑水', pic: 'xintai',
    prompt: '“我连忙去抢父亲的担子，他却很粗暴地一把推开我：‘不要你凑热闹，我连一担水都挑不——动吗！’”',
    hint: '破折号拖长了哪个字？父亲为什么“粗暴”？',
    example: '“挑不——动吗”，一个破折号，是父亲咬牙硬撑：他不肯承认自己老了。粗暴里藏着要强。',
  },
  {
    name: '头颅', pic: 'xintai',
    prompt: '“他那颗很倔的头颅埋在膝盖里半晌都没动，那极短的发，似刚收割过的庄稼茬，高低不齐，灰白而失去了生机。”',
    hint: '“很倔”和“埋”放在一起，矛盾吗？比喻用得好在哪里？',
    example: '倔强了一辈子的头，如今埋进膝盖；头发像收割后的庄稼茬——父亲的力气和岁月都被“收割”了。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    document.querySelector('.tl-panel').insertAdjacentHTML('beforeend', '<div class="spirit"><small>父亲的心气</small><div class="meter"><i id="tlSpirit"></i></div></div>');
    document.getElementById('tlRange').addEventListener('input', (e) => showStage(+e.target.value));
    showStage(0);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-tl')) showStage(step);
  },
};
