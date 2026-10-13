'use strict';
/* 消息二则 · 本课数据与本课独有的“倒金字塔拆解”“六要素表”。通用互动见 ../shared/narrative.js */

/* 倒金字塔：p 对应原文 [data-p]，ly 对应 SVG 层；say 为讲解 */
const PARTS = [
  { p: 'title', ly: '', name: '标题', say: '标题：简明、醒目，概括性强。“三十万”“胜利”“南渡”是最具新闻价值的关键词。' },
  { p: 'head', ly: '', name: '电头', say: '电头（消息头）：黑体字，交代发稿的通讯社、地点和时间——“新华社长江前线二十二日二时电”。' },
  { p: 'lead', ly: 'lead', name: '导语', say: '导语：正文第一句。用最简要的文字呈现最重要的事实：谁（人民解放军）、何时（二十一日）、何事（约三十万人渡过长江）。' },
  { p: 'body', ly: 'body', name: '主体', say: '主体：承接导语，具体叙述——战斗何时开始、在哪里、敌军怎样溃退、我军怎样突破、正向哪里进击。' },
  { p: 'bg', ly: 'bg', name: '背景', say: '背景：“国民党反动派经营了三个半月的长江防线”——交代防线经营已久，反衬我军“不到二十四小时”突破之快。它暗含在主体中。' },
  { p: 'end', ly: 'end', name: '结语', say: '结语：“正以自己的英雄式的战斗，坚决地执行……命令”——收束全文，点明意义。' },
];

// 必须在 deck.js 统计分步之前生成
document.getElementById('partBtns').innerHTML = PARTS.map((x, i) =>
  `<button type="button" class="btn" data-step="${i + 1}" data-i="${i}">${x.name}</button>`).join('');

function showPart(i) {
  const x = PARTS[i];
  document.querySelectorAll('#partBtns .btn').forEach((b, k) => b.classList.toggle('solid', k === i));
  document.querySelectorAll('#newsText .np').forEach((el) => el.classList.toggle('hit', el.dataset.p === x.p));
  document.querySelectorAll('.pyr .ly').forEach((el) => el.classList.toggle('hit', x.ly && el.classList.contains(`ly-${x.ly}`)));
  document.getElementById('partSay').innerHTML = `<b>${x.name}</b>　${x.say.slice(x.name.length + 1)}`;
}

/* 六要素：两则消息 */
const SIX = [
  ['何时', '二十日午夜开始；二十一日已渡过约三十万人', '二十日夜起中路军突破；二十一日下午五时起西路、东路渡江；至发电时止'],
  ['何地', '芜湖、安庆之间的长江', '西起九江（不含），东至江阴，一千余华里的战线'],
  ['何人', '人民解放军（中路）约三十万人', '人民解放军百万大军（中、西、东三路）'],
  ['何事', '渡过长江，突破敌阵，占领南岸广大地区', '冲破敌阵，横渡长江'],
  ['何故', '敌军无斗志，防线“好似摧枯拉朽”', '我军英勇善战，锐不可当；国民党反动派拒绝签订和平协定，官兵都很泄气'],
  ['如何', '万船齐放，直取对岸，不到二十四小时即突破敌阵', '三路渡江：中路首先突破，西路渡过三分之二，东路整天激战、控制江阴要塞'],
];

function initSix() {
  const t = document.getElementById('sixTable');
  t.innerHTML = `<tr><th></th><th>我三十万大军胜利南渡长江</th><th>人民解放军百万大军横渡长江</th></tr>` +
    SIX.map(([k, a, b]) => `<tr><th>${k}</th><td><button type="button" class="cell">${a}</button></td><td><button type="button" class="cell">${b}</button></td></tr>`).join('');
  t.addEventListener('click', (e) => {
    const c = e.target.closest('.cell');
    if (c) c.classList.toggle('open');
  });
}

const PICKS = {
  tone: [
    { t: '毫无斗志', ok: true, why: '贬斥敌军' },
    { t: '英勇善战，锐不可当', ok: true, why: '赞美、自豪' },
    { t: '战犯汤恩伯', ok: true, why: '称谓见立场' },
    { t: '不起丝毫作用', ok: true, why: '轻蔑' },
    { t: '不料', ok: true, why: '讽刺意味' },
    { t: '二十一日下午五时起', ok: false, why: '客观时间' },
    { t: '地点在九江、安庆段', ok: false, why: '客观地点' },
    { t: '余部二十三日可渡完', ok: false, why: '客观事实' },
  ],
};

const MOMENTS = [
  {
    name: '学校运动会', pic: 'baozhi',
    prompt: '为本周的学校运动会拟一个标题，写一句导语。',
    hint: '把最有新闻价值的事放最前面：破纪录了吗？哪个班夺冠？',
    example: '标题：初二（3）班勇夺校运会团体总分第一　导语：本报讯　昨天下午，在为期两天的校秋季运动会上，初二（3）班以总分186分夺得团体第一名，其中男子4×100米接力打破了保持八年的校纪录。',
  },
  {
    name: '班级活动', pic: 'chenxi',
    prompt: '选一次班级活动（植树、义卖、读书会……），拟标题、写导语。',
    hint: '标题要有关键词；导语一句话交代谁、何时、何事、结果。',
    example: '标题：一场义卖，四百元善款送往山区　导语：本报讯　上周五午休时间，初二（5）班同学在校园文化长廊举办旧书义卖，一小时售出图书一百二十余本，所得四百余元已全部捐给结对的山区小学。',
  },
  {
    name: '身边的新变化', pic: 'jiangmian',
    prompt: '家乡或社区有什么新变化？为它写一个标题和导语。',
    hint: '用数字和事实说话，少用“非常”“特别”这类空泛的词。',
    example: '标题：社区“口袋公园”建成开放　导语：本报讯　10月8日，闲置多年的社区东侧空地变身“口袋公园”正式开放，新增座椅二十张、健身器材八组，附近居民步行三分钟就能到达。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    document.getElementById('partBtns').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-i]');
      if (b) showPart(+b.dataset.i);
    });
    initSix();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-pyr') && step >= 1) showPart(Math.min(step, PARTS.length) - 1);
  },
};
