'use strict';
/* 词四首 · 本课数据。竖排诗与背诵见 ../shared/poem.js；
 * 本课独有：一首一种读法——渔家傲“色调板”、江城子“分镜头”、破阵子“醉里/梦里/醒来”虚实切换、满江红“情感层次” */

const POEMS = {
  yu: {
    title: '渔家傲·秋思', author: '范仲淹',
    notes: { 塞下: '边界要塞之地，这里指当时的西北边疆', 衡阳: '衡阳雁去：即“雁去衡阳”，为符合格律而倒置。传说北雁南飞至衡阳回雁峰而止', 边声: '边塞特有的声音，如大风、羌笛、马嘶的声音', 千嶂: '层峦叠嶂。嶂，直立似屏障的山峰', 燕然: '燕然未勒：没有像东汉窦宪那样在燕然山刻石记功，指边患未平、功业未成（燕读 yān）', 征夫: '出征的士兵' },
    lines: [
      { t: '塞下秋来风景异，', r: '塞下/秋来/风景异，', f: '1.08 50% 50%' }, { t: '衡阳雁去无留意。', r: '衡阳/雁去/无留意。', f: '1.3 60% 20%' },
      { t: '四面边声连角起，', r: '四面/边声/连角起，', f: '1.1 50% 60%' }, { t: '千嶂里，长烟落日孤城闭。', r: '千嶂里，长烟/落日/孤城闭。', f: '1.3 45% 45%' },
      { t: '浊酒一杯家万里，', r: '浊酒/一杯/家万里，', f: '1.05 50% 50%' }, { t: '燕然未勒归无计。', r: '燕然/未勒/归无计。' },
      { t: '羌管悠悠霜满地，', r: '羌管/悠悠/霜满地，', f: '1.25 50% 80%' }, { t: '人不寐，将军白发征夫泪。', r: '人/不寐，将军/白发/征夫泪。', f: '1.04 50% 50%' },
    ],
  },
  jcz: {
    title: '江城子·密州出猎', author: '苏轼',
    lines: [
      { t: '老夫聊发少年狂，' }, { t: '左牵黄，右擎苍，' }, { t: '锦帽貂裘，千骑卷平冈。' }, { t: '为报倾城随太守，亲射虎，看孙郎。' },
      { t: '酒酣胸胆尚开张。' }, { t: '鬓微霜，又何妨！' }, { t: '持节云中，何日遣冯唐？' }, { t: '会挽雕弓如满月，西北望，射天狼。' },
    ],
  },
  pzz: {
    title: '破阵子·为陈同甫赋壮词以寄之', author: '辛弃疾',
    lines: [
      { t: '醉里挑灯看剑，梦回吹角连营。' }, { t: '八百里分麾下炙，五十弦翻塞外声，沙场秋点兵。' },
      { t: '马作的卢飞快，弓如霹雳弦惊。' }, { t: '了却君王天下事，赢得生前身后名。可怜白发生！' },
    ],
  },
  mjh: {
    title: '满江红', author: '秋瑾',
    lines: [
      { t: '小住京华，早又是中秋佳节。' }, { t: '为篱下黄花开遍，秋容如拭。' }, { t: '四面歌残终破楚，八年风味徒思浙。' }, { t: '苦将侬强派作蛾眉，殊未屑！' },
      { t: '身不得，男儿列，心却比，男儿烈。' }, { t: '算平生肝胆，因人常热。' }, { t: '俗子胸襟谁识我？英雄末路当磨折。' }, { t: '莽红尘何处觅知音？青衫湿！' },
    ],
  },
};
POEMS.yuR = { title: POEMS.yu.title, author: POEMS.yu.author, lines: POEMS.yu.lines };
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

const CLUES = [
  { q: '<b>亲射虎，看孙郎</b><br><small>孙权曾经“亲乘马射虎”</small>', a: '以孙权自比，要亲自射虎给全城百姓看——写出猎的豪迈和年轻人一样的勇武。' },
  { q: '<b>持节云中，何日遣冯唐？</b><br><small>冯唐持节赦免魏尚</small>', a: '以魏尚自许：作者当时被外放密州，盼望朝廷像汉文帝派冯唐那样，重新信任、重用自己。' },
  { q: '<b>会挽雕弓如满月，西北望，射天狼</b><br><small>天狼星“主侵掠”</small>', a: '天狼喻指侵扰西北边境的西夏军队——终将拉满雕弓抗击敌人，表达为国杀敌、建功立业的壮志。' },
];

const MOMENTS = [
  {
    name: '点评江城子', pic: 'chulie',
    prompt: '点评“千骑卷平冈”中的“卷”字。',
    hint: '想一想：“卷”字写出了队伍怎样的气势？换成“过”“上”有什么不同？',
    example: '“卷”字写出上千骑马的随从像席卷而过的狂风，铺天盖地、迅疾猛烈，一个字就把出猎场面的浩大声势写活了；换成“过”就平淡了。这样的场面正衬托出“老夫”的少年之狂。',
  },
  {
    name: '点评破阵子', pic: 'tiaodeng',
    prompt: '点评“醉里挑灯看剑”。',
    hint: '为什么是“醉里”？为什么要“挑灯”？“看剑”看出了什么心思？',
    example: '“醉里”可见心中苦闷，借酒浇愁；深夜仍“挑灯”，可见难以入眠；醉中念念不忘的却是“剑”——杀敌报国的志向一刻没有忘记。一句话把人物的苦闷与壮志都写了出来，引出下面的梦境。',
  },
  {
    name: '点评满江红', pic: 'huanghua',
    prompt: '点评“身不得，男儿列，心却比，男儿烈”。',
    hint: '注意句式：短句、对比、反复。“列”和“烈”读音相同，意思有什么不同？',
    example: '四个三字短句节奏急促，像斩钉截铁的誓言。“男儿列”与“男儿烈”音同义异：身份上进不了男儿的行列，心志却比男儿更刚烈。一抑一扬，写出了作者不甘屈服的豪情。',
  },
];

/* ============ 破阵子：醉里 / 梦里 / 醒来 ============ */
const DREAM_LAB = { shi: '醉里 · 实', xu: '梦里 · 虚', xing: '醒来 · 实' };

function setDream(mode) {
  const slide = document.querySelector('.s-dream');
  slide.dataset.mode = mode;
  slide.querySelector('#csLab').textContent = DREAM_LAB[mode];
  slide.querySelectorAll('.cs-dbtn .btn').forEach((b) => b.classList.toggle('solid', b.dataset.mode === mode));
  slide.querySelectorAll('.pz-l').forEach((p) => p.classList.toggle('hi', p.dataset.m === mode));
}

function initDream() {
  document.querySelectorAll('.s-dream [data-mode]').forEach((b) => b.addEventListener('click', () => setDream(b.dataset.mode)));
  setDream('shi');
}

function updateDream(slide, step) {
  if (!slide.classList.contains('s-dream')) return;
  setDream(step <= 1 ? 'shi' : step >= 6 ? 'xing' : 'xu');
}

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS, clues: CLUES, clueLabels: ['典故', '意思'] });
    Poem.init();
    initDream();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateDream(slide, step);
  },
};
