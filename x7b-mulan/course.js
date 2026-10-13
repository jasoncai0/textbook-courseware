'use strict';
/* 木兰诗 · 本课数据。诗文模板（横排 + 译文）见 ../shared/poem.js；本课独有：情节详略字数条、互文拆读、民歌特色高亮 */

const POEMS = {
  s1: {
    title: '木兰诗（一）· 替爷从军', author: '北朝民歌', layout: 'h',
    lines: [
      { t: '唧唧复唧唧，木兰当户织。不闻机杼声，唯闻女叹息。', r: '唧唧/复唧唧，木兰/当户织。不闻/机杼声，唯闻/女叹息。', y: '叹息声一声接着一声，木兰对着门织布。听不见织布机的声音，只听见木兰在叹息。' },
      { t: '问女何所思，问女何所忆。女亦无所思，女亦无所忆。', r: '问女/何所思，问女/何所忆。女亦/无所思，女亦/无所忆。', y: '问木兰在想什么，问木兰在思念什么。木兰说她没想什么，也没思念什么。' },
      { t: '昨夜见军帖，可汗大点兵，军书十二卷，卷卷有爷名。', r: '昨夜/见军帖，可汗/大点兵，军书/十二卷，卷卷/有爷名。', y: '昨夜看见军中的文告，可汗在大规模征兵，征兵的名册有很多卷，每一卷上都有父亲的名字。' },
      { t: '阿爷无大儿，木兰无长兄，愿为市鞍马，从此替爷征。', r: '阿爷/无大儿，木兰/无长兄，愿为/市鞍马，从此/替爷征。', y: '父亲没有长大成人的儿子，木兰没有哥哥，木兰愿意为此去买鞍马，从此替父亲出征。' },
    ],
    notes: { 唧唧: '叹息声', 当户织: '对着门织布', 机杼声: '织布机发出的声音。杼（zhù），织布的梭子', 唯: '只', 何所思: '想的是什么', 忆: '思念', 军帖: '军中的文告（帖，tiě）', 可汗: '我国古代西北地区民族对最高统治者的称呼（kè hán）', 大点兵: '大规模地征兵', 军书: '征兵的名册', 十二: '表示多数，不是确指', 爷: '父亲', 为: '介词，为了，其后宾语省略', 市: '买', 鞍马: '泛指马和马具' },
  },
  s2: {
    title: '木兰诗（二）· 准备与出征', author: '北朝民歌', layout: 'h',
    lines: [
      { t: '东市买骏马，西市买鞍鞯，南市买辔头，北市买长鞭。', r: '东市/买骏马，西市/买鞍鞯，南市/买辔头，北市/买长鞭。', y: '到各处集市买齐骏马、鞍鞯、辔头和长鞭。' },
      { t: '旦辞爷娘去，暮宿黄河边，不闻爷娘唤女声，但闻黄河流水鸣溅溅。', r: '旦辞/爷娘去，暮宿/黄河边，不闻/爷娘/唤女声，但闻/黄河/流水/鸣溅溅。', y: '早晨辞别父母上路，晚上宿营在黄河边，听不见父母呼唤女儿的声音，只听见黄河水流的溅溅声。' },
      { t: '旦辞黄河去，暮至黑山头，不闻爷娘唤女声，但闻燕山胡骑鸣啾啾。', r: '旦辞/黄河去，暮至/黑山头，不闻/爷娘/唤女声，但闻/燕山/胡骑/鸣啾啾。', y: '早晨离开黄河上路，晚上到达黑山头，听不见父母呼唤女儿的声音，只听见燕山胡人战马的啾啾鸣叫声。' },
    ],
    notes: { 鞍鞯: '鞯（jiān），马鞍下的垫子', 辔头: '驾驭牲口用的嚼子和缰绳（辔，pèi）', 旦: '早晨', 溅溅: '水流声（读 jiān jiān）', 黑山: '当时北方的山名', 燕山: '当时北方的山名（燕，yān）', 胡骑: '胡人的战马', 啾啾: '马叫的声音' },
  },
  s3: {
    title: '木兰诗（三）· 征战与辞官', author: '北朝民歌', layout: 'h',
    lines: [
      { t: '万里赴戎机，关山度若飞。', r: '万里/赴戎机，关山/度若飞。', y: '不远万里奔赴战场，像飞一样越过一道道关塞山岭。' },
      { t: '朔气传金柝，寒光照铁衣。', r: '朔气/传金柝，寒光/照铁衣。', y: '北方的寒气传送着打更的声音，清冷的月光映照着铠甲。' },
      { t: '将军百战死，壮士十年归。', r: '将军/百战死，壮士/十年归。', y: '将士们身经百战，有的战死沙场，有的多年后胜利归来。' },
      { t: '归来见天子，天子坐明堂。', r: '归来/见天子，天子/坐明堂。', y: '归来朝见天子，天子坐在朝堂之上。' },
      { t: '策勋十二转，赏赐百千强。', r: '策勋/十二转，赏赐/百千强。', y: '给木兰记了很大的功，赏赐的财物很多。' },
      { t: '可汗问所欲，木兰不用尚书郎，愿驰千里足，送儿还故乡。', r: '可汗/问所欲，木兰/不用/尚书郎，愿驰/千里足，送儿/还故乡。', y: '可汗问木兰想要什么，木兰不愿做尚书郎，只希望骑上千里马，回到故乡。' },
    ],
    notes: { 戎机: '战事', 度: '越过', 朔气: '北方的寒气。朔（shuò），北方', 金柝: '古时军中白天用来烧饭、夜里用来打更的器具（柝，tuò）', 铁衣: '铠甲，古代军人穿的护身服装', 天子: '指上文的“可汗”', 明堂: '古代帝王举行大典的朝堂', 策勋: '记功', 十二转: '记很大的功。转（zhuǎn），勋位每升一级叫一转', 强: '有余', 问所欲: '问（木兰）想要什么', 尚书郎: '尚书省的官', 驰: '赶马快跑', 千里足: '千里马' },
  },
  s4: {
    title: '木兰诗（四）· 还乡团聚', author: '北朝民歌', layout: 'h',
    lines: [
      { t: '爷娘闻女来，出郭相扶将；阿姊闻妹来，当户理红妆；小弟闻姊来，磨刀霍霍向猪羊。', r: '爷娘/闻女来，出郭/相扶将；阿姊/闻妹来，当户/理红妆；小弟/闻姊来，磨刀/霍霍/向猪羊。', y: '父母听说女儿回来了，互相搀扶着到城外迎接；姐姐听说妹妹回来了，对着门梳妆打扮；弟弟听说姐姐回来了，霍霍地磨刀准备杀猪宰羊。' },
      { t: '开我东阁门，坐我西阁床。', r: '开我/东阁门，坐我/西阁床。', y: '打开我闺房的门，在闺房的床上坐一坐。' },
      { t: '脱我战时袍，著我旧时裳。', r: '脱我/战时袍，著我/旧时裳。', y: '脱下打仗时穿的战袍，换上从前的女儿装。' },
      { t: '当窗理云鬓，对镜帖花黄。', r: '当窗/理云鬓，对镜/帖花黄。', y: '对着窗子、对着镜子梳理好看的鬓发，贴上花黄。' },
      { t: '出门看火伴，火伴皆惊忙：同行十二年，不知木兰是女郎。', r: '出门/看火伴，火伴/皆惊忙：同行/十二年，不知/木兰/是女郎。', y: '出门去看同伴，同伴们都很吃惊：同行多年，竟不知道木兰是个女子。' },
      { t: '雄兔脚扑朔，雌兔眼迷离；双兔傍地走，安能辨我是雄雌？', r: '雄兔/脚扑朔，雌兔/眼迷离；双兔/傍地走，安能/辨我/是雄雌？', y: '提起兔子的耳朵，雄兔的前脚时时动弹，雌兔的眼睛时常眯着；两只兔子贴着地面跑，怎能分辨哪只是雄兔哪只是雌兔呢？' },
    ],
    notes: { 郭: '外城', 扶将: '扶持', 红妆: '女子的艳丽装束（妆，zhuāng）', 霍霍: '磨刀的声音', 著: '穿（读 zhuó）', 云鬓: '像云那样的鬓发，形容好看的头发', 帖: '同“贴”', 花黄: '古代妇女的一种面部装饰物', 火伴: '军中的同伴。当时规定若干士兵同一个灶吃饭，所以称“火伴”', 扑朔: '动弹', 迷离: '眯着眼', 傍地走: '贴着地面跑。傍，靠近；走，跑', 安能: '怎能' },
  },
};
const ALL_LINES = ['s1', 's2', 's3', 's4'].flatMap((k) => POEMS[k].lines);
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* 情节与详略：part 对应的诗句（用于统计字数） */
const PARTS = [
  { k: '从军', t: '叹息 · 决定', lines: [0, 1, 2, 3] },
  { k: '从军', t: '备马', lines: [4] },
  { k: '从军', t: '辞家 · 出征', lines: [5, 6] },
  { k: '征战', t: '十年征战', lines: [7, 8, 9] },
  { k: '还乡', t: '辞官', lines: [10, 11, 12] },
  { k: '还乡', t: '团聚 · 换装', lines: [13, 14, 15, 16, 17] },
  { k: '结尾', t: '双兔之喻', lines: [18] },
];
const PUNCT = /[，。、；：？！“”]/g;
const charCount = (idx) => idx.reduce((s, i) => s + ALL_LINES[i].t.replace(PUNCT, '').length, 0);

document.getElementById('bars').innerHTML = (() => {
  const counts = PARTS.map((p) => charCount(p.lines));
  const max = Math.max(...counts);
  return PARTS.map((p, i) => `<div class="bar-row k-${p.k}" data-step="${i + 1}">
    <span class="bk">${p.k}</span><span class="bt">${p.t}</span>
    <span class="bb"><i style="--w:${(counts[i] / max * 100).toFixed(0)}%"></i></span><b>${counts[i]} 字</b></div>`).join('');
})();

/* 互文 */
const HUWEN = [
  { o: '东市买骏马，西市买鞍鞯，南市买辔头，北市买长鞭。', bad: '东市只买马，西市只买鞍鞯……', ok: '到各处集市买齐了骏马、鞍鞯、辔头、长鞭——写出准备之忙、出征之急。' },
  { o: '将军百战死，壮士十年归。', bad: '将军都战死了，只有壮士回来了。', ok: '将军和壮士身经百战，有的战死，有的多年后胜利归来。' },
  { o: '开我东阁门，坐我西阁床。', bad: '只开东边的门，只坐西边的床。', ok: '打开我闺房的门，在闺房的床上坐一坐——东阁、西阁泛指自己的房间。' },
  { o: '当窗理云鬓，对镜帖花黄。', bad: '对着窗子只梳头，对着镜子只贴花黄。', ok: '对着窗子、对着镜子梳理鬓发，贴上花黄。' },
];

function initHuwen() {
  const box = document.getElementById('huwen');
  box.innerHTML = HUWEN.map((h, i) => `<div class="hw" data-i="${i}"><p class="hw-o">${h.o}</p>
    <div class="btns"><button class="btn" type="button" data-a="bad">拆开读</button><button class="btn" type="button" data-a="ok">合起来读</button></div>
    <p class="hw-r"></p></div>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-a]');
    if (!b) return;
    const row = b.closest('.hw');
    const h = HUWEN[+row.dataset.i];
    const ok = b.dataset.a === 'ok';
    row.classList.toggle('is-ok', ok);
    row.classList.toggle('is-bad', !ok);
    row.querySelector('.hw-r').textContent = ok ? `✓ ${h.ok}` : `✗ ${h.bad}这样理解就错了。`;
  });
}

/* 民歌特色高亮 */
const STYLE_SAY = {
  wen: '<b>口语化的问答：</b>“问女何所思，问女何所忆。女亦无所思，女亦无所忆。”一问一答，像拉家常，写出木兰心事重重又不愿说破；“可汗问所欲”也是问答。',
  pai: '<b>铺陈排比：</b>四市买马，“爷娘……阿姊……小弟……”，“开我……坐我……脱我……著我……”——一连串整齐的句子，写出忙碌、欢喜和急切，节奏明快。',
  yu: '<b>风趣的比喻：</b>用双兔并跑难辨雌雄，比喻木兰女扮男装、混在军中十二年没人识破——收尾轻松幽默，又透着自豪。',
};

function initStyle() {
  const box = document.getElementById('styleText');
  document.querySelector('.style-tools').addEventListener('click', (e) => {
    const b = e.target.closest('[data-s]');
    if (!b) return;
    const k = b.dataset.s;
    const on = !box.classList.contains(`show-${k}`);
    Object.keys(STYLE_SAY).forEach((x) => box.classList.remove(`show-${x}`));
    document.querySelectorAll('.style-tools .btn').forEach((x) => x.classList.toggle('solid', on && x === b));
    if (on) box.classList.add(`show-${k}`);
    document.getElementById('styleSay').innerHTML = on ? STYLE_SAY[k] : '点上面的按钮，看看北方民歌的特色。';
  });
}

/* 背诵：分段切换 */
function initReciteTabs() {
  const tabs = document.getElementById('reciteTabs');
  const boxes = [...document.querySelectorAll('.recite-one .recite')];
  const show = (i) => {
    boxes.forEach((b, k) => { b.hidden = k !== i; });
    tabs.querySelectorAll('.btn').forEach((b, k) => b.classList.toggle('solid', k === i));
  };
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    if (b) show(+b.dataset.r);
  });
  show(0);
}

/* 木兰形象：分类 */
const SORT = [
  { s: '唧唧复唧唧，木兰当户织。不闻机杼声，唯闻女叹息。', ok: ['女儿情怀'], q: '为父亲担忧，愁肠百结' },
  { s: '阿爷无大儿，木兰无长兄，愿为市鞍马，从此替爷征。', ok: ['英雄气概'], q: '勇于担当，孝顺父亲' },
  { s: '不闻爷娘唤女声，但闻黄河流水鸣溅溅。', ok: ['女儿情怀'], q: '思念爹娘' },
  { s: '万里赴戎机，关山度若飞。', ok: ['英雄气概'], q: '英勇矫健' },
  { s: '木兰不用尚书郎，愿驰千里足，送儿还故乡。', ok: ['英雄气概', '女儿情怀'], q: '不慕功名，眷恋家乡' },
  { s: '当窗理云鬓，对镜帖花黄。', ok: ['女儿情怀'], q: '爱美，恢复女儿本色' },
  { s: '同行十二年，不知木兰是女郎。', ok: ['英雄气概'], q: '机智谨慎，巾帼不让须眉' },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['英雄气概', '女儿情怀'] });
    Poem.init();
    initHuwen();
    initStyle();
    initReciteTabs();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
